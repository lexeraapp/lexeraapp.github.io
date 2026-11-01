import type { SaveData } from "./SaveData.ts";
import { ReviewScheduler } from "./Scheduler.ts";
import type { ContentLibrary } from "../content/ContentLibrary.ts";

export interface BadgeCtx {
  save: SaveData;
  lib: ContentLibrary;
  knownWords: number;
  lessonsDone: number;
  unitsDone: Set<string>;
  phasesDone: Set<string>;
  streak: number;
}
export interface BadgeDef {
  id: string;
  title: string;
  desc: string;
  tier: 1 | 2 | 3;
  glyph: string;
  test(c: BadgeCtx): boolean;
}

const def = (id: string, title: string, desc: string, tier: 1 | 2 | 3, glyph: string, test: (c: BadgeCtx) => boolean): BadgeDef => ({ id, title, desc, tier, glyph, test });

export class BadgeBook {
  static readonly all: BadgeDef[] = [
    def("first-light", "First Light", "Finish your first lesson.", 1, "star", (c) => c.lessonsDone >= 1),
    def("sound-check", "Sound Check", "Complete the unit on sounds and greetings.", 1, "speaker", (c) => c.unitsDone.has("b1")),
    def("tide-3", "Three Tides", "Keep a 3 day streak.", 1, "ember", (c) => c.save.streak.best >= 3),
    def("tide-7", "Seven Tides", "Keep a 7 day streak.", 2, "ember", (c) => c.save.streak.best >= 7),
    def("tide-30", "Thirty Tides", "Keep a 30 day streak.", 3, "ember", (c) => c.save.streak.best >= 30),
    def("words-25", "First Vocabulary", "Know 25 words.", 1, "atlas", (c) => c.knownWords >= 25),
    def("words-100", "Working Vocabulary", "Know 100 words.", 2, "atlas", (c) => c.knownWords >= 100),
    def("words-250", "Wide Vocabulary", "Know 250 words.", 3, "atlas", (c) => c.knownWords >= 250),
    def("harmony-25", "In Harmony", "Answer 25 grammar drills correctly.", 1, "harmony", (c) => c.save.stats.cloze >= 25),
    def("harmony-100", "Perfect Pitch", "Answer 100 grammar drills correctly.", 2, "harmony", (c) => c.save.stats.cloze >= 100),
    def("ear-20", "Good Ear", "Answer 20 listening questions correctly.", 2, "speaker", (c) => c.save.stats.listen >= 20),
    def("build-20", "Sentence Smith", "Build 20 sentences correctly.", 2, "build", (c) => c.save.stats.build >= 20),
    def("clean-1", "Clean Sheet", "Finish a lesson without a single mistake.", 1, "check", (c) => c.save.stats.perfect >= 1),
    def("clean-10", "Ten Clean Sheets", "Finish ten flawless lessons.", 3, "check", (c) => c.save.stats.perfect >= 10),
    def("speed-15", "Quick Hands", "Score 15 in a Speed Round.", 2, "bolt", (c) => c.save.stats.speedBest >= 15),
    def("goal-7", "Steady Hand", "Reach your daily goal on 7 days.", 2, "target", (c) => c.save.stats.goalDays >= 7),
    def("phase-1", "Foundations", "Complete the beginner phase.", 2, "path", (c) => c.phasesDone.has("beginner")),
    def("phase-2", "Crossing", "Complete the intermediate phase.", 3, "path", (c) => c.phasesDone.has("intermediate")),
    def("phase-3", "Summit", "Complete the advanced phase.", 3, "path", (c) => c.phasesDone.has("advanced")),
  ];
  static byId(id: string): BadgeDef | undefined {
    return BadgeBook.all.find((b) => b.id === id);
  }
  /** Returns ids of badges newly earned. */
  static evaluate(c: BadgeCtx): string[] {
    return BadgeBook.all.filter((b) => !c.save.badges[b.id] && b.test(c)).map((b) => b.id);
  }
  static countKnown(save: SaveData, lib: ContentLibrary): number {
    return lib.words.filter((w) => ReviewScheduler.mastery(save.items[`word:${w.id}`]) !== "learning" && ReviewScheduler.mastery(save.items[`word:${w.id}`]) !== "new").length;
  }
}
