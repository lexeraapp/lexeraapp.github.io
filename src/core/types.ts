export type PhaseId = "beginner" | "intermediate" | "advanced";
export const PHASES: readonly PhaseId[] = ["beginner", "intermediate", "advanced"];

export interface Word {
  id: string;
  tr: string;
  en: string;
  hint?: string;
  unitId: string;
  lessonId: string;
}
export interface Sentence {
  id: string;
  tr: string;
  en: string;
  unitId: string;
  lessonId: string;
}
export interface DrillSpec {
  id: string;
  family: string;
  stem: string;
  gloss: string;
  unitId: string;
  lessonId: string;
}
export interface GrammarNote {
  title: string;
  paragraphs: string[];
  table?: { head: string[]; rows: string[][] };
}
export interface Lesson {
  id: string;
  unitId: string;
  phase: PhaseId;
  title: string;
  goal: string;
  tip: string;
  words: Word[];
  sentences: Sentence[];
  drills: DrillSpec[];
}
export interface Unit {
  id: string;
  phase: PhaseId;
  index: number;
  title: string;
  summary: string;
  note: GrammarNote;
  lessons: Lesson[];
}
export interface RawLesson {
  title: string;
  goal: string;
  tip: string;
  words: string[];
  sentences: string[];
  drills?: string[];
}
export interface RawUnit {
  id: string;
  title: string;
  summary: string;
  note: GrammarNote;
  lessons: RawLesson[];
}

export type Verdict = "correct" | "near" | "wrong";
export type ItemKind = "word" | "sentence" | "drill";
export interface ItemRef {
  kind: ItemKind;
  id: string;
}
