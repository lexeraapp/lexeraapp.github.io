import { Rng } from "../core/Rng.ts";
import { TurkishText } from "../core/TurkishText.ts";

/** Picks plausible wrong answers. At higher tiers distractors look more like the target. */
export class DistractorPicker {
  constructor(private readonly rng: Rng) {}

  pick(target: string, pool: readonly string[], n: number, similar: boolean): string[] {
    const unique = [...new Set(pool.filter((p) => p && TurkishText.norm(p) !== TurkishText.norm(target)))];
    if (!similar) return this.rng.sample(unique, n);
    const ranked = this.rng
      .shuffle(unique)
      .map((c) => ({ c, d: TurkishText.distance(TurkishText.fold(c), TurkishText.fold(target)) + Math.abs(c.length - target.length) * 0.5 }))
      .sort((a, b) => a.d - b.d)
      .slice(0, Math.max(n * 2, n))
      .map((x) => x.c);
    return this.rng.sample(ranked, n);
  }
}
