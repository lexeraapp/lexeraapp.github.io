import type { PhaseId } from "../core/types.ts";
import type { ItemState } from "./Scheduler.ts";

export interface StreakState {
  count: number;
  best: number;
  last: string | null;
  freezes: number;
}
export interface SaveData {
  v: 1;
  created: number;
  onboarded: boolean;
  xp: number;
  goal: number;
  streak: StreakState;
  days: Record<string, { xp: number; sessions: number }>;
  lessons: Record<string, { stars: number; best: number; plays: number }>;
  items: Record<string, ItemState>;
  skill: Record<PhaseId, number>;
  badges: Record<string, number>;
  gates: Record<PhaseId, boolean>;
  settings: { sound: boolean; speech: boolean; haptics: boolean; reduceMotion: boolean; speechRate: number };
  stats: { answered: number; right: number; perfect: number; speedBest: number; goalDays: number; cloze: number; listen: number; typing: number; build: number; match: number };
}

export function freshSave(now = Date.now()): SaveData {
  return {
    v: 1, created: now, onboarded: false, xp: 0, goal: 40,
    streak: { count: 0, best: 0, last: null, freezes: 1 },
    days: {}, lessons: {}, items: {},
    skill: { beginner: 1.4, intermediate: 2, advanced: 2.5 },
    badges: {}, gates: { beginner: true, intermediate: false, advanced: false },
    settings: { sound: true, speech: true, haptics: true, reduceMotion: false, speechRate: 0.9 },
    stats: { answered: 0, right: 0, perfect: 0, speedBest: 0, goalDays: 0, cloze: 0, listen: 0, typing: 0, build: 0, match: 0 },
  };
}

/** Merge unknown or older saved data over a fresh save so missing fields never crash the app. */
export function migrate(raw: unknown): SaveData {
  const base = freshSave();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<SaveData>;
  return {
    ...base, ...r,
    streak: { ...base.streak, ...r.streak },
    skill: { ...base.skill, ...r.skill },
    gates: { ...base.gates, ...r.gates, beginner: true },
    settings: { ...base.settings, ...r.settings },
    stats: { ...base.stats, ...r.stats },
    days: r.days ?? {}, lessons: r.lessons ?? {}, items: r.items ?? {}, badges: r.badges ?? {},
    v: 1,
  };
}
