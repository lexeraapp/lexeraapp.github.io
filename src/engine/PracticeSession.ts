import type { ItemRef, Sentence, Verdict, Word } from "../core/types.ts";
import { DifficultyDirector } from "./DifficultyDirector.ts";
import { ExerciseFactory } from "./ExerciseFactory.ts";
import { Exercise, refKey, type Outcome } from "./exercises/Exercise.ts";
import { XpRules } from "./Rewards.ts";
import type { Content } from "./Content.ts";

export type SessionMode = "lesson" | "review" | "gate" | "harmony" | "speed";
export type Stage = "warm" | "build" | "peak" | "cool";
export interface Slot {
  type: "intro" | "word" | "match" | "sentence" | "drill";
  stage: Stage;
  refs: ItemRef[];
  produce?: boolean;
  retry?: boolean;
  /** Speed round: choice-only, no audio or typing. */
  fast?: boolean;
}
const OFFSET: Record<Stage, number> = { warm: -1, build: 0, peak: 1, cool: -1 };

export interface Answered {
  exercise: Exercise;
  outcome: Outcome;
  xp: number;
  combo: number;
}
export interface SessionSummary {
  mode: SessionMode;
  lessonId?: string;
  phase?: string;
  scored: number;
  correct: number;
  near: number;
  wrong: number;
  accuracy: number;
  stars: 0 | 1 | 2 | 3;
  xp: number;
  bonusXp: number;
  bestCombo: number;
  durationMs: number;
  /** First-attempt verdict per item, used to update spaced repetition. */
  results: Record<string, Verdict>;
  kindRight: Record<string, number>;
  newWordIds: string[];
  perfect: boolean;
  skillAfter: number;
}

export interface SessionOptions {
  mode: SessionMode;
  title: string;
  slots: Slot[];
  factory: ExerciseFactory;
  director: DifficultyDirector;
  content: Content;
  /** Pools used for distractors. */
  wordPool: Word[];
  sentencePool: Sentence[];
  lessonId?: string;
  phase?: string;
  /** For endless modes: called when the queue runs dry. */
  refill?: () => Slot[];
  now?: () => number;
}

/** Runs one play session: lazily builds each exercise at the current difficulty, re-queues misses, tallies rewards. */
export class PracticeSession {
  private queue: Slot[];
  private index = 0;
  private _current?: Exercise;
  private retries = 0;
  private combo = 0;
  private bestCombo = 0;
  private xp = 0;
  private scored = 0;
  private correct = 0;
  private near = 0;
  private wrong = 0;
  private answeredCount = 0;
  private readonly scoredTotal: number;
  private readonly first = new Map<string, Verdict>();
  private readonly kindRight: Record<string, number> = {};
  private readonly started: number;
  private readonly seenIntro: string[] = [];
  private done = false;

  constructor(readonly opts: SessionOptions) {
    this.queue = opts.slots.slice();
    this.scoredTotal = this.queue.filter((s) => s.type !== "intro").length;
    this.started = (opts.now ?? Date.now)();
    this.build();
  }

  get title(): string { return this.opts.title; }
  get mode(): SessionMode { return this.opts.mode; }
  get current(): Exercise | undefined { return this._current; }
  get finished(): boolean { return this.done; }
  get progress(): number {
    if (this.opts.refill) return 0;
    return Math.min(1, this.answeredCount / Math.max(1, this.scoredTotal + this.retries));
  }
  get comboNow(): number { return this.combo; }
  get xpNow(): number { return this.xp; }
  get tierNow(): number { return this.opts.director.tier; }
  get stageNow(): Stage { return this.queue[this.index]?.stage ?? "cool"; }

  private build(): void {
    if (this.index >= this.queue.length && this.opts.refill) this.queue.push(...this.opts.refill());
    const slot = this.queue[this.index];
    if (!slot) {
      this._current = undefined;
      this.done = true;
      return;
    }
    const { factory, director, content, wordPool, sentencePool } = this.opts;
    let tier = DifficultyDirector.clamp(director.level + OFFSET[slot.stage] - (slot.retry ? 1 : 0));
    tier = Math.round(tier);
    if (slot.stage === "warm") tier = Math.min(tier, 2);
    const first = slot.refs[0] as ItemRef;
    switch (slot.type) {
      case "intro": this._current = factory.intro(content.word(first.id)); break;
      case "word": this._current = factory.word(content.word(first.id), tier, wordPool, !!slot.produce && !slot.retry && !slot.fast, !!slot.retry || !!slot.fast); break;
      case "match": this._current = factory.match(slot.refs.map((r) => content.word(r.id)), tier); break;
      case "sentence": this._current = factory.sentence(content.sentence(first.id), tier, sentencePool); break;
      case "drill": this._current = factory.drill(content.drill(first.id), tier); break;
    }
  }

  /** Grade the current exercise. Call advance() afterwards to move on. */
  submit(answer: unknown): Answered {
    const ex = this._current;
    if (!ex) throw new Error("No active exercise");
    const outcome = (ex as Exercise<unknown>).check(answer);
    const slot = this.queue[this.index] as Slot;
    this.scored += 1;
    const v = outcome.verdict;
    if (v === "correct") { this.correct += 1; this.combo += 1; this.kindRight[ex.kind] = (this.kindRight[ex.kind] ?? 0) + 1; }
    else if (v === "near") { this.near += 1; this.combo = 0; }
    else { this.wrong += 1; this.combo = 0; }
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    const gained = XpRules.forAnswer(v, ex.tier, this.combo) * (this.opts.mode === "review" ? 0.8 : 1);
    const xp = Math.round(gained);
    this.xp += xp;
    this.opts.director.record(v !== "wrong");
    const perRef = outcome.perRef ?? Object.fromEntries(ex.refs.map((r) => [refKey(r), v]));
    for (const [k, verdict] of Object.entries(perRef)) if (!this.first.has(k)) this.first.set(k, verdict);
    this.answeredCount += 1;
    // Re-queue a missed item a few steps later in an easier form (retrieval with feedback, then retry).
    if (v === "wrong" && this.retries < 4 && slot.type !== "match" && !this.opts.refill) {
      this.retries += 1;
      this.queue.splice(Math.min(this.queue.length, this.index + 4), 0, { ...slot, stage: "build", retry: true, produce: false });
    }
    return { exercise: ex, outcome, xp, combo: this.combo };
  }

  advance(): void {
    const slot = this.queue[this.index];
    if (slot?.type === "intro") this.seenIntro.push((slot.refs[0] as ItemRef).id);
    this.index += 1;
    this.build();
  }

  finish(): void {
    this.done = true;
    this._current = undefined;
  }

  summary(): SessionSummary {
    const accuracy = this.scored ? (this.correct + this.near * 0.5) / this.scored : 0;
    const perfect = this.wrong === 0 && this.near === 0 && this.scored >= 8 && this.opts.mode !== "speed";
    const bonus = this.opts.mode === "speed" ? 0 : (perfect ? 10 : 0) + (accuracy >= 0.9 ? 5 : 0);
    const results: Record<string, Verdict> = {};
    for (const [k, v] of this.first) results[k] = v;
    return {
      mode: this.opts.mode, lessonId: this.opts.lessonId, phase: this.opts.phase,
      scored: this.scored, correct: this.correct, near: this.near, wrong: this.wrong, accuracy,
      stars: XpRules.stars(accuracy), xp: this.xp + bonus, bonusXp: bonus, bestCombo: this.bestCombo,
      durationMs: (this.opts.now ?? Date.now)() - this.started, results, kindRight: this.kindRight,
      newWordIds: this.seenIntro, perfect, skillAfter: this.opts.director.level,
    };
  }
}
