import { SuffixBook } from "../core/Harmony.ts";
import { Rng } from "../core/Rng.ts";
import { TurkishText } from "../core/TurkishText.ts";
import type { DrillSpec, Sentence, Word } from "../core/types.ts";
import { DistractorPicker } from "./DistractorPicker.ts";
import {
  BuildExercise, ChoiceExercise, ClozeExercise, Exercise, IntroExercise, ListenExercise, MatchExercise, TypingExercise,
} from "./exercises/Exercise.ts";

export interface FactoryEnv {
  rng: Rng;
  speechAvailable: boolean;
}

/** Turns content items into playable exercises, adapting the form to the requested tier. */
export class ExerciseFactory {
  private seq = 0;
  private readonly picker: DistractorPicker;
  constructor(private readonly env: FactoryEnv) {
    this.picker = new DistractorPicker(env.rng);
  }
  private id(kind: string): string {
    return `${kind}-${this.seq++}`;
  }
  private get rng(): Rng {
    return this.env.rng;
  }

  intro(w: Word): IntroExercise {
    return new IntroExercise(this.id("intro"), { kind: "word", id: w.id }, w.tr, w.en, w.hint);
  }

  word(w: Word, tier: number, pool: readonly Word[], produce: boolean, avoidListen = false): Exercise {
    const ref = { kind: "word" as const, id: w.id };
    const speech = this.env.speechAvailable && !avoidListen;
    if (produce && tier >= 3) {
      const listenType = tier >= 4 && speech && this.rng.chance(0.4);
      if (listenType) return new TypingExercise(this.id("type"), tier, ref, "Type what you hear", "", "tr", w.tr, false, w.tr);
      return new TypingExercise(this.id("type"), tier, ref, "Write this in Turkish", w.en, "en", w.tr, tier === 3);
    }
    const n = tier <= 1 ? 2 : 3;
    const similar = tier >= 3;
    if (speech && this.rng.chance(0.25)) {
      const toTr = tier >= 3;
      const labels = this.picker.pick(toTr ? w.tr : w.en, pool.map((p) => (toTr ? p.tr : p.en)), n, similar);
      const opts = this.options(w, pool, labels, toTr ? "tr" : "en");
      return new ListenExercise(this.id("listen"), tier, ref, toTr ? "Listen, then pick the word you hear" : "Listen, then pick the meaning", "", "tr", opts, w.id, w.tr);
    }
    const trToEn = tier <= 2 ? this.rng.chance(0.7) : this.rng.chance(0.35);
    const labels = this.picker.pick(trToEn ? w.en : w.tr, pool.map((p) => (trToEn ? p.en : p.tr)), n, similar);
    const opts = this.options(w, pool, labels, trToEn ? "en" : "tr");
    return new ChoiceExercise(
      this.id("choice"), tier, ref,
      trToEn ? "What does this mean?" : "How do you say this in Turkish?",
      trToEn ? w.tr : w.en, trToEn ? "tr" : "en", opts, w.id, trToEn ? w.tr : undefined,
    );
  }

  private options(w: Word, pool: readonly Word[], labels: string[], side: "tr" | "en") {
    const pick = (l: string) => pool.find((p) => (side === "tr" ? p.tr : p.en) === l);
    const wrong = labels.map((l) => ({ id: pick(l)?.id ?? `x-${l}`, label: l }));
    const right = { id: w.id, label: side === "tr" ? w.tr : w.en };
    return this.rng.shuffle([right, ...wrong]);
  }

  match(words: readonly Word[], tier: number): MatchExercise {
    const pairs = words.map((w) => ({ id: w.id, tr: w.tr, en: w.en }));
    const left = this.rng.shuffle(pairs.map((p) => p.id));
    let right = this.rng.shuffle(pairs.map((p) => p.id));
    // Make sure rows are not trivially aligned.
    if (pairs.length > 2 && right.every((id, i) => id === left[i])) right = [...right.slice(1), right[0] as string];
    return new MatchExercise(this.id("match"), tier, words.map((w) => ({ kind: "word" as const, id: w.id })), pairs, left, right);
  }

  sentence(s: Sentence, tier: number, pool: readonly Sentence[]): BuildExercise {
    const answer = TurkishText.tokens(s.tr);
    const extra = tier <= 2 ? 0 : tier === 3 ? 2 : 3;
    const have = new Set(answer.map((t) => TurkishText.norm(t)));
    const spare = pool.filter((p) => p.id !== s.id).flatMap((p) => TurkishText.tokens(p.tr)).filter((t) => !have.has(TurkishText.norm(t)));
    const distractors = this.rng.sample([...new Set(spare)], extra);
    const tiles = this.rng.shuffle([...answer, ...distractors]).map((text, i) => ({ id: `t${i}`, text }));
    return new BuildExercise(this.id("build"), tier, { kind: "sentence", id: s.id }, s.en, answer, tiles);
  }

  drill(d: DrillSpec, tier: number): ClozeExercise {
    const fam = SuffixBook.get(d.family);
    const b = fam.build(d.stem);
    const count = tier <= 2 ? 2 : tier === 3 ? 3 : 4;
    const wrong = this.rng.sample(fam.variants.filter((v) => v !== b.add), count - 1);
    const options = this.rng.shuffle([b.add, ...wrong]);
    return new ClozeExercise(this.id("cloze"), tier, { kind: "drill", id: d.id }, d.stem, d.gloss, fam.label, fam.pattern, options, b.add, b.form, b.why);
  }
}
