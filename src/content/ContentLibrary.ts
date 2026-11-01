import type { DrillSpec, Lesson, PhaseId, RawUnit, Sentence, Unit, Word } from "../core/types.ts";
import { PHASES } from "../core/types.ts";
import { BEGINNER } from "./beginner.ts";
import { INTERMEDIATE } from "./intermediate.ts";
import { ADVANCED } from "./advanced.ts";

export interface PhaseInfo {
  id: PhaseId;
  title: string;
  level: string;
  blurb: string;
}
export const PHASE_INFO: Record<PhaseId, PhaseInfo> = {
  beginner: { id: "beginner", title: "Beginner", level: "A1", blurb: "Sounds, greetings, home, food, time, questions and the core present tense." },
  intermediate: { id: "intermediate", title: "Intermediate", level: "A2", blurb: "Past tense, cases, possession, health, travel, hobbies and habits." },
  advanced: { id: "advanced", title: "Advanced", level: "B1", blurb: "Hearsay past, conditionals, voice, reported speech, storytelling and formal style." },
};

/** Parses the compact content format into typed domain objects and indexes them. */
export class ContentLibrary {
  readonly units: Unit[] = [];
  private readonly lessonMap = new Map<string, Lesson>();
  private readonly wordMap = new Map<string, Word>();
  private readonly sentenceMap = new Map<string, Sentence>();
  private readonly drillMap = new Map<string, DrillSpec>();

  constructor(raw: Record<PhaseId, RawUnit[]>) {
    for (const phase of PHASES) raw[phase].forEach((u, i) => this.addUnit(phase, i, u));
  }

  private addUnit(phase: PhaseId, index: number, raw: RawUnit): void {
    const lessons: Lesson[] = raw.lessons.map((rl, li) => {
      const lessonId = `${raw.id}-${li + 1}`;
      const words = rl.words.map((s, wi): Word => {
        const [tr = "", en = "", hint] = s.split("|");
        return { id: `${lessonId}-w${wi + 1}`, tr, en, hint, unitId: raw.id, lessonId };
      });
      const sentences = rl.sentences.map((s, si): Sentence => {
        const [tr = "", en = ""] = s.split("|");
        return { id: `${lessonId}-s${si + 1}`, tr, en, unitId: raw.id, lessonId };
      });
      const drills = (rl.drills ?? []).map((s, di): DrillSpec => {
        const [family = "", stem = "", gloss = ""] = s.split("|");
        return { id: `${lessonId}-d${di + 1}`, family, stem, gloss, unitId: raw.id, lessonId };
      });
      const lesson: Lesson = { id: lessonId, unitId: raw.id, phase, title: rl.title, goal: rl.goal, tip: rl.tip, words, sentences, drills };
      words.forEach((w) => this.wordMap.set(w.id, w));
      sentences.forEach((x) => this.sentenceMap.set(x.id, x));
      drills.forEach((d) => this.drillMap.set(d.id, d));
      this.lessonMap.set(lessonId, lesson);
      return lesson;
    });
    this.units.push({ id: raw.id, phase, index, title: raw.title, summary: raw.summary, note: raw.note, lessons });
  }

  get lessons(): Lesson[] { return this.units.flatMap((u) => u.lessons); }
  get words(): Word[] { return [...this.wordMap.values()]; }
  get sentences(): Sentence[] { return [...this.sentenceMap.values()]; }
  get drills(): DrillSpec[] { return [...this.drillMap.values()]; }
  lesson(id: string): Lesson | undefined { return this.lessonMap.get(id); }
  unit(id: string): Unit | undefined { return this.units.find((u) => u.id === id); }
  word(id: string): Word | undefined { return this.wordMap.get(id); }
  sentence(id: string): Sentence | undefined { return this.sentenceMap.get(id); }
  drill(id: string): DrillSpec | undefined { return this.drillMap.get(id); }
  unitsOf(phase: PhaseId): Unit[] { return this.units.filter((u) => u.phase === phase); }
  lessonsOf(phase: PhaseId): Lesson[] { return this.unitsOf(phase).flatMap((u) => u.lessons); }
  /** Lessons strictly before the given lesson in the global course order. */
  lessonsBefore(lessonId: string): Lesson[] {
    const all = this.lessons;
    return all.slice(0, Math.max(0, all.findIndex((l) => l.id === lessonId)));
  }
}

export const library = new ContentLibrary({ beginner: BEGINNER, intermediate: INTERMEDIATE, advanced: ADVANCED });
