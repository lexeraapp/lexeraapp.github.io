import type { ItemRef, Verdict } from "../../core/types.ts";
import { TurkishText } from "../../core/TurkishText.ts";

export type ExerciseKind = "intro" | "choice" | "listen" | "match" | "typing" | "build" | "cloze";

export interface Outcome {
  verdict: Verdict;
  /** The canonical correct answer, shown in feedback. */
  correct: string;
  notes: string[];
  perRef?: Record<string, Verdict>;
}
export const refKey = (r: ItemRef): string => `${r.kind}:${r.id}`;

export abstract class Exercise<A = unknown> {
  abstract readonly kind: ExerciseKind;
  constructor(readonly id: string, readonly tier: number, readonly refs: ItemRef[]) {}
  abstract check(answer: A): Outcome;
  get scored(): boolean {
    return true;
  }
  protected simple(ok: boolean, correct: string, notes: string[] = []): Outcome {
    const verdict: Verdict = ok ? "correct" : "wrong";
    return { verdict, correct, notes, perRef: Object.fromEntries(this.refs.map((r) => [refKey(r), verdict])) };
  }
}

export interface ChoiceOption {
  id: string;
  label: string;
}

export class IntroExercise extends Exercise<void> {
  readonly kind = "intro" as const;
  constructor(id: string, ref: ItemRef, readonly tr: string, readonly en: string, readonly hint?: string) {
    super(id, 1, [ref]);
  }
  override get scored(): boolean {
    return false;
  }
  check(): Outcome {
    return { verdict: "correct", correct: this.tr, notes: [] };
  }
}

export class ChoiceExercise extends Exercise<string> {
  readonly kind: "choice" | "listen" = "choice";
  constructor(
    id: string, tier: number, ref: ItemRef,
    readonly instruction: string,
    readonly prompt: string,
    readonly promptLang: "tr" | "en",
    readonly options: ChoiceOption[],
    readonly answerId: string,
    readonly speak?: string,
    readonly note?: string,
  ) {
    super(id, tier, [ref]);
  }
  check(answer: string): Outcome {
    const right = this.options.find((o) => o.id === this.answerId);
    return this.simple(answer === this.answerId, right?.label ?? "", this.note ? [this.note] : []);
  }
}

export class ListenExercise extends ChoiceExercise {
  override readonly kind = "listen" as const;
}

export interface MatchPair {
  id: string;
  tr: string;
  en: string;
}
export interface MatchAnswer {
  missedIds: string[];
}
export class MatchExercise extends Exercise<MatchAnswer> {
  readonly kind = "match" as const;
  constructor(id: string, tier: number, refs: ItemRef[], readonly pairs: MatchPair[], readonly leftOrder: string[], readonly rightOrder: string[]) {
    super(id, tier, refs);
  }
  check(a: MatchAnswer): Outcome {
    const perRef: Record<string, Verdict> = {};
    for (const r of this.refs) perRef[refKey(r)] = a.missedIds.includes(r.id) ? "wrong" : "correct";
    const verdict: Verdict = a.missedIds.length === 0 ? "correct" : a.missedIds.length <= 2 ? "near" : "wrong";
    return { verdict, correct: this.pairs.map((p) => `${p.tr} = ${p.en}`).join("\n"), notes: [], perRef };
  }
}

export class TypingExercise extends Exercise<string> {
  readonly kind = "typing" as const;
  constructor(
    id: string, tier: number, ref: ItemRef,
    readonly instruction: string,
    readonly prompt: string,
    readonly promptLang: "tr" | "en",
    readonly answer: string,
    readonly firstLetter: boolean,
    readonly speak?: string,
  ) {
    super(id, tier, [ref]);
  }
  check(input: string): Outcome {
    if (TurkishText.sameExact(input, this.answer)) return this.simple(true, this.answer);
    if (TurkishText.sameFolded(input, this.answer)) {
      const o = this.simple(true, this.answer, [`Almost. Mind the Turkish letters: ${this.answer}.`]);
      o.verdict = "near";
      if (o.perRef) for (const k of Object.keys(o.perRef)) o.perRef[k] = "near";
      return o;
    }
    return this.simple(false, this.answer);
  }
}

export class BuildExercise extends Exercise<string[]> {
  readonly kind = "build" as const;
  constructor(id: string, tier: number, ref: ItemRef, readonly prompt: string, readonly answer: string[], readonly tiles: { id: string; text: string }[]) {
    super(id, tier, [ref]);
  }
  check(tokens: string[]): Outcome {
    const ok = tokens.length === this.answer.length && tokens.every((t, i) => TurkishText.norm(t) === TurkishText.norm(this.answer[i] as string));
    return this.simple(ok, this.answer.join(" "));
  }
}

export class ClozeExercise extends Exercise<string> {
  readonly kind = "cloze" as const;
  constructor(
    id: string, tier: number, ref: ItemRef,
    readonly stem: string, readonly gloss: string, readonly familyLabel: string, readonly pattern: string,
    readonly options: string[], readonly answer: string, readonly form: string, readonly why: string[],
  ) {
    super(id, tier, [ref]);
  }
  check(add: string): Outcome {
    return this.simple(add === this.answer, this.form, this.why);
  }
}
