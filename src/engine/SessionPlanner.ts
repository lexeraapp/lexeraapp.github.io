import type { Lesson, PhaseId, Sentence, Word } from "../core/types.ts";
import { Rng } from "../core/Rng.ts";
import type { ContentLibrary } from "../content/ContentLibrary.ts";
import { ReviewScheduler, type ItemState } from "./Scheduler.ts";
import type { Slot } from "./PracticeSession.ts";

type States = Record<string, ItemState>;
const wref = (id: string) => [{ kind: "word" as const, id }];

function interleave<T>(...lists: T[][]): T[] {
  const out: T[] = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) for (const l of lists) if (i < l.length) out.push(l[i] as T);
  return out;
}

/**
 * Shapes each session as an arc: warm-up (easy wins), build (mixed formats plus interleaved review), peak (hardest
 * production), cool-down (finish on a strong item). Ending well matters: the peak-end rule says people judge an
 * experience mostly by its most intense moment and its end (Kahneman et al., 1993).
 */
export class SessionPlanner {
  constructor(private readonly lib: ContentLibrary, private readonly rng: Rng) {}

  lesson(l: Lesson, states: States, now: number): Slot[] {
    const slots: Slot[] = [];
    const words = l.words;
    words.forEach((w, i) => {
      slots.push({ type: "intro", stage: "warm", refs: wref(w.id) });
      if (i % 2 === 1) for (const p of [words[i - 1] as Word, w]) slots.push({ type: "word", stage: "warm", refs: wref(p.id) });
    });
    const earlier = this.lib.lessonsBefore(l.id).flatMap((x) => x.words);
    const due = earlier
      .filter((w) => ReviewScheduler.isDue(states[`word:${w.id}`], now))
      .sort((a, b) => ReviewScheduler.urgency(states[`word:${b.id}`] as ItemState, now) - ReviewScheduler.urgency(states[`word:${a.id}`] as ItemState, now));
    const prev = this.lib.lessonsBefore(l.id).slice(-1)[0];
    const reviewWords = (due.length ? due : prev ? this.rng.sample(prev.words, 2) : []).slice(0, 3);
    const reviews: Slot[] = reviewWords.map((w) => ({ type: "word", stage: "build", refs: wref(w.id) }));
    const sentences: Slot[] = this.rng.shuffle(l.sentences).map((s) => ({ type: "sentence", stage: "build", refs: [{ kind: "sentence", id: s.id }] }));
    const drills: Slot[] = this.rng.sample(l.drills, 4).map((d) => ({ type: "drill", stage: "build", refs: [{ kind: "drill", id: d.id }] }));
    const peakWords: Slot[] = this.rng.sample(words, 4).map((w) => ({ type: "word", stage: "peak", refs: wref(w.id), produce: true }));
    const match: Slot = { type: "match", stage: "build", refs: this.rng.sample(words, 5).flatMap((w) => wref(w.id)) };
    const mid = interleave(sentences, drills, reviews);
    const half = Math.ceil(mid.length / 2);
    mid.forEach((s, i) => { if (i >= half) s.stage = "peak"; });
    slots.push(match, ...interleave(mid, peakWords));
    const strong = [...words].sort((a, b) => (states[`word:${b.id}`]?.box ?? 0) - (states[`word:${a.id}`]?.box ?? 0)).slice(0, 2);
    for (const w of strong) slots.push({ type: "word", stage: "cool", refs: wref(w.id) });
    return slots;
  }

  /** Spaced-repetition review: the most overdue words first, with production for well-known ones. */
  review(states: States, now: number, count = 10): Slot[] {
    const seen = this.lib.words.filter((w) => (states[`word:${w.id}`]?.seen ?? 0) > 0);
    const ranked = seen
      .map((w) => ({ w, s: states[`word:${w.id}`] as ItemState }))
      .sort((a, b) => ReviewScheduler.urgency(b.s, now) - ReviewScheduler.urgency(a.s, now))
      .slice(0, count);
    return this.rng.shuffle(ranked).map(({ w, s }, i): Slot => ({
      type: "word", stage: i < 2 ? "warm" : i >= count - 2 ? "cool" : s.box >= 3 ? "peak" : "build", refs: wref(w.id), produce: s.box >= 3,
    }));
  }

  dueCount(states: States, now: number): number {
    return this.lib.words.filter((w) => ReviewScheduler.isDue(states[`word:${w.id}`], now)).length;
  }

  /** Test-out exam for a phase: draws from every lesson before it. */
  gate(phase: PhaseId): Slot[] {
    const order: PhaseId[] = ["beginner", "intermediate", "advanced"];
    const before = order.slice(0, order.indexOf(phase));
    const lessons = before.flatMap((p) => this.lib.lessonsOf(p));
    const words = this.rng.sample(lessons.flatMap((l) => l.words), 7);
    const sentences = this.rng.sample(lessons.flatMap((l) => l.sentences), 3);
    const drills = this.rng.sample(lessons.flatMap((l) => l.drills), 3);
    const slots = [
      ...words.slice(0, 2).map((w): Slot => ({ type: "word", stage: "warm", refs: wref(w.id) })),
      ...interleave(
        words.slice(2).map((w): Slot => ({ type: "word", stage: "build", refs: wref(w.id), produce: true })),
        sentences.map((s): Slot => ({ type: "sentence", stage: "build", refs: [{ kind: "sentence", id: s.id }] })),
        drills.map((d): Slot => ({ type: "drill", stage: "peak", refs: [{ kind: "drill", id: d.id }] })),
      ),
    ];
    return slots;
  }

  harmony(doneLessonIds: string[], count = 12): Slot[] {
    const pool = doneLessonIds.flatMap((id) => this.lib.lesson(id)?.drills ?? []);
    return this.rng.sample(pool, Math.min(count, pool.length)).map((d, i, a): Slot => ({
      type: "drill", stage: i < 3 ? "warm" : i > a.length - 3 ? "cool" : i > a.length / 2 ? "peak" : "build", refs: [{ kind: "drill", id: d.id }],
    }));
  }

  speedChunk(words: Word[]): Slot[] {
    return this.rng.sample(words, Math.min(10, words.length)).map((w): Slot => ({ type: "word", stage: "build", refs: wref(w.id), fast: true }));
  }

  sentencePool(lessons: Lesson[]): Sentence[] {
    return lessons.flatMap((l) => l.sentences);
  }
}
