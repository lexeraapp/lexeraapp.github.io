import { library, type ContentLibrary } from "../content/ContentLibrary.ts";
import { Rng } from "../core/Rng.ts";
import { PHASES, type Lesson, type PhaseId, type Verdict, type Word } from "../core/types.ts";
import { BadgeBook } from "../engine/Badges.ts";
import { Clock } from "../engine/Clock.ts";
import { Content } from "../engine/Content.ts";
import { DifficultyDirector } from "../engine/DifficultyDirector.ts";
import { ExerciseFactory } from "../engine/ExerciseFactory.ts";
import { PracticeSession, type SessionSummary } from "../engine/PracticeSession.ts";
import { Levels, type LevelInfo } from "../engine/Rewards.ts";
import { freshSave, migrate, type SaveData } from "../engine/SaveData.ts";
import { ReviewScheduler, type Mastery } from "../engine/Scheduler.ts";
import { SessionPlanner } from "../engine/SessionPlanner.ts";
import { StreakKeeper } from "../engine/Streak.ts";
import { Haptics, SoundFx } from "./SoundFx.ts";
import { Speech } from "./Speech.ts";
import type { KeyValueStorage } from "./Storage.ts";

export type LessonStatus = "locked" | "open" | "done";
export type SessionSpec =
  | { mode: "lesson"; lessonId: string }
  | { mode: "review" }
  | { mode: "gate"; phase: PhaseId }
  | { mode: "harmony" }
  | { mode: "speed" };

export interface CommitResult {
  xp: number;
  levelBefore: LevelInfo;
  levelAfter: LevelInfo;
  leveledUp: boolean;
  newBadges: string[];
  streakExtended: boolean;
  streakCount: number;
  earnedFreeze: boolean;
  goalReached: boolean;
  passed: boolean;
  unlockedPhase: PhaseId | null;
  speedRecord: boolean;
}

const KEY = "lexera.save.v1";

/** The single source of truth for progress. React subscribes through useSyncExternalStore. */
export class AppStore {
  private listeners = new Set<() => void>();
  private version = 0;
  private data: SaveData;
  readonly content: Content;
  readonly speech = new Speech();
  readonly sfx = new SoundFx();
  readonly haptics = new Haptics();

  constructor(private readonly storage: KeyValueStorage, readonly lib: ContentLibrary = library, private readonly clock = new Clock()) {
    this.content = new Content(lib);
    this.data = AppStore.load(storage);
    this.applySettings();
  }

  private static load(storage: KeyValueStorage): SaveData {
    try {
      const raw = storage.get(KEY);
      return raw ? migrate(JSON.parse(raw)) : freshSave();
    } catch {
      return freshSave();
    }
  }

  // ---- subscription -------------------------------------------------------
  subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };
  getVersion = (): number => this.version;
  private commitData(): void {
    this.version += 1;
    try {
      this.storage.set(KEY, JSON.stringify(this.data));
    } catch {
      /* storage full or blocked: keep running in memory */
    }
    this.listeners.forEach((l) => l());
  }
  private applySettings(): void {
    const s = this.data.settings;
    this.sfx.enabled = s.sound;
    this.speech.enabled = s.speech;
    this.speech.rate = s.speechRate;
    this.haptics.enabled = s.haptics;
    document.documentElement.dataset.motion = s.reduceMotion ? "reduced" : "full";
  }

  // ---- read model -----------------------------------------------------------
  get save(): SaveData { return this.data; }
  get today(): string { return Clock.key(this.clock.now()); }
  get level(): LevelInfo { return Levels.info(this.data.xp); }
  get streak(): number { return StreakKeeper.live(this.data.streak, this.today); }
  get streakDoneToday(): boolean { return StreakKeeper.doneToday(this.data.streak, this.today); }
  get todayXp(): number { return this.data.days[this.today]?.xp ?? 0; }
  get dueCount(): number { return new SessionPlanner(this.lib, new Rng()).dueCount(this.data.items, this.clock.now()); }
  get seenWords(): Word[] { return this.lib.words.filter((w) => (this.data.items[`word:${w.id}`]?.seen ?? 0) > 0); }
  mastery(wordId: string): Mastery { return ReviewScheduler.mastery(this.data.items[`word:${wordId}`]); }
  get knownCount(): number { return BadgeBook.countKnown(this.data, this.lib); }

  lessonStatus(id: string): LessonStatus {
    const all = this.lib.lessons;
    const i = all.findIndex((l) => l.id === id);
    const l = all[i];
    if (!l) return "locked";
    if ((this.data.lessons[id]?.stars ?? 0) >= 1) return "done";
    if (i === 0) return "open";
    const prev = all[i - 1] as Lesson;
    if ((this.data.lessons[prev.id]?.stars ?? 0) >= 1) return "open";
    const firstOfPhase = this.lib.lessonsOf(l.phase)[0]?.id === id;
    return firstOfPhase && this.data.gates[l.phase] ? "open" : "locked";
  }
  stars(id: string): number { return this.data.lessons[id]?.stars ?? 0; }
  phaseProgress(phase: PhaseId): { done: number; total: number; unlocked: boolean } {
    const ls = this.lib.lessonsOf(phase);
    const first = ls[0];
    return {
      done: ls.filter((l) => this.stars(l.id) >= 1).length,
      total: ls.length,
      unlocked: !!first && this.lessonStatus(first.id) !== "locked",
    };
  }
  get nextLesson(): Lesson | undefined {
    return this.lib.lessons.find((l) => this.lessonStatus(l.id) === "open");
  }
  get currentPhase(): PhaseId { return this.nextLesson?.phase ?? "advanced"; }
  get doneLessonIds(): string[] { return this.lib.lessons.filter((l) => this.stars(l.id) >= 1).map((l) => l.id); }
  weekActivity(): { key: string; xp: number }[] {
    return Array.from({ length: 35 }, (_, i) => {
      const key = Clock.addDays(this.today, i - 34);
      return { key, xp: this.data.days[key]?.xp ?? 0 };
    });
  }

  // ---- sessions -----------------------------------------------------------------
  private skillFor(phase: PhaseId): number { return this.data.skill[phase]; }

  canStart(spec: SessionSpec): boolean {
    if (spec.mode === "lesson") return this.lessonStatus(spec.lessonId) !== "locked";
    if (spec.mode === "review") return this.seenWords.length >= 4;
    if (spec.mode === "speed") return this.seenWords.length >= 8;
    if (spec.mode === "harmony") return this.doneLessonIds.some((id) => (this.lib.lesson(id)?.drills.length ?? 0) > 0);
    return true;
  }

  createSession(spec: SessionSpec): PracticeSession {
    const rng = new Rng();
    const planner = new SessionPlanner(this.lib, rng);
    const factory = new ExerciseFactory({ rng, speechAvailable: this.speech.available });
    const now = this.clock.now();
    const items = this.data.items;
    let slots, title, phase: PhaseId = this.currentPhase, wordPool: Word[], lessonId: string | undefined;
    let refill: (() => ReturnType<SessionPlanner["speedChunk"]>) | undefined;
    switch (spec.mode) {
      case "lesson": {
        const l = this.lib.lesson(spec.lessonId) as Lesson;
        phase = l.phase; lessonId = l.id; title = l.title;
        slots = planner.lesson(l, items, now);
        wordPool = [...l.words, ...this.lib.lessonsBefore(l.id).flatMap((x) => x.words)];
        break;
      }
      case "review":
        title = "Review"; slots = planner.review(items, now); wordPool = this.seenWords; break;
      case "gate": {
        phase = spec.phase; title = `Test out to ${spec.phase}`;
        slots = planner.gate(spec.phase);
        const order = PHASES.slice(0, PHASES.indexOf(spec.phase));
        wordPool = order.flatMap((p) => this.lib.lessonsOf(p).flatMap((l) => l.words));
        break;
      }
      case "harmony":
        title = "Harmony gym"; slots = planner.harmony(this.doneLessonIds); wordPool = this.lib.words; break;
      case "speed":
        title = "Speed round"; wordPool = this.seenWords; slots = planner.speedChunk(wordPool);
        refill = () => planner.speedChunk(wordPool); break;
    }
    const sentencePool = planner.sentencePool(
      spec.mode === "lesson"
        ? [this.lib.lesson(spec.lessonId) as Lesson, ...this.lib.lessonsBefore(spec.lessonId)]
        : spec.mode === "gate" ? this.lib.lessons.filter((l) => PHASES.indexOf(l.phase) < PHASES.indexOf(phase)) : this.lib.lessons,
    );
    return new PracticeSession({
      mode: spec.mode, title, slots, factory, director: new DifficultyDirector(this.skillFor(phase)), content: this.content,
      wordPool, sentencePool, lessonId, phase, refill, now: () => this.clock.now(),
    });
  }

  /** Apply a finished session to progress. Returns what changed so the UI can celebrate it. */
  commit(sum: SessionSummary): CommitResult {
    const d = this.data;
    const now = this.clock.now();
    const today = this.today;
    const levelBefore = Levels.info(d.xp);
    const before = new Set(Object.keys(d.badges));
    const goalBefore = (d.days[today]?.xp ?? 0) >= d.goal;

    for (const [key, verdict] of Object.entries(sum.results) as [string, Verdict][]) {
      d.items[key] = ReviewScheduler.grade(d.items[key], verdict, now, Math.random());
    }
    d.xp += sum.xp;
    const day = d.days[today] ?? { xp: 0, sessions: 0 };
    day.xp += sum.xp; day.sessions += 1;
    d.days[today] = day;

    d.stats.answered += sum.scored;
    d.stats.right += sum.correct;
    d.stats.cloze += sum.kindRight["cloze"] ?? 0;
    d.stats.listen += sum.kindRight["listen"] ?? 0;
    d.stats.typing += sum.kindRight["typing"] ?? 0;
    d.stats.build += sum.kindRight["build"] ?? 0;
    d.stats.match += sum.kindRight["match"] ?? 0;
    let speedRecord = false;
    if (sum.mode === "speed" && sum.correct > d.stats.speedBest) { d.stats.speedBest = sum.correct; speedRecord = sum.correct > 0; }

    let passed = true;
    let unlockedPhase: PhaseId | null = null;
    if (sum.mode === "lesson" && sum.lessonId) {
      const prev = d.lessons[sum.lessonId] ?? { stars: 0, best: 0, plays: 0 };
      passed = sum.stars >= 1;
      d.lessons[sum.lessonId] = { stars: Math.max(prev.stars, sum.stars), best: Math.max(prev.best, sum.accuracy), plays: prev.plays + 1 };
      if (sum.perfect) d.stats.perfect += 1;
    }
    if (sum.mode === "gate" && sum.phase) {
      passed = sum.accuracy >= 0.8;
      if (passed && !d.gates[sum.phase as PhaseId]) { d.gates[sum.phase as PhaseId] = true; unlockedPhase = sum.phase as PhaseId; }
    }
    if (sum.phase) {
      const p = sum.phase as PhaseId;
      d.skill[p] = DifficultyDirector.clamp(d.skill[p] * 0.6 + sum.skillAfter * 0.4);
    }

    let streakExtended = false, earnedFreeze = false;
    if (sum.xp > 0 && sum.scored >= 3) {
      const ch = StreakKeeper.touch(d.streak, today);
      d.streak = ch.state; streakExtended = ch.extended; earnedFreeze = ch.earnedFreeze;
    }
    const goalReached = !goalBefore && day.xp >= d.goal;
    if (goalReached) d.stats.goalDays += 1;

    const done = this.lib.lessons.filter((l) => (d.lessons[l.id]?.stars ?? 0) >= 1);
    const doneIds = new Set(done.map((l) => l.id));
    const unitsDone = new Set(this.lib.units.filter((u) => u.lessons.every((l) => doneIds.has(l.id))).map((u) => u.id));
    const phasesDone = new Set(PHASES.filter((p) => this.lib.lessonsOf(p).every((l) => doneIds.has(l.id))));
    const earned = BadgeBook.evaluate({ save: d, lib: this.lib, knownWords: BadgeBook.countKnown(d, this.lib), lessonsDone: done.length, unitsDone, phasesDone, streak: d.streak.count });
    for (const id of earned) d.badges[id] = now;
    void before;

    const levelAfter = Levels.info(d.xp);
    d.onboarded = true;
    this.commitData();
    return {
      xp: sum.xp, levelBefore, levelAfter, leveledUp: levelAfter.level > levelBefore.level, newBadges: earned,
      streakExtended, streakCount: d.streak.count, earnedFreeze, goalReached, passed, unlockedPhase, speedRecord,
    };
  }

  // ---- settings and data ----------------------------------------------------------------
  update(fn: (d: SaveData) => void): void {
    fn(this.data);
    this.applySettings();
    this.commitData();
  }
  completeOnboarding(goal: number): void { this.update((d) => { d.onboarded = true; d.goal = goal; }); }
  exportCode(): string { return btoa(unescape(encodeURIComponent(JSON.stringify(this.data)))); }
  importCode(code: string): boolean {
    try {
      const parsed = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
      if (!parsed || typeof parsed !== "object" || parsed.v !== 1) return false;
      this.data = migrate(parsed);
      this.applySettings();
      this.commitData();
      return true;
    } catch {
      return false;
    }
  }
  reset(): void {
    this.data = freshSave(this.clock.now());
    this.applySettings();
    this.commitData();
  }
}
