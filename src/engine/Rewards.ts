import type { Verdict } from "../core/types.ts";

export type XpMode = "lesson" | "review" | "gate" | "harmony" | "speed";

export interface DailyGoal { xp: number; name: string; note: string }

/**
 * Daily goals are measured in XP, and XP is calibrated so one full lesson played well is worth about 40.
 * Light is one lesson, Steady is two, Serious is three to four plus some practice, so the numbers mean something.
 */
export const DAILY_GOALS: DailyGoal[] = [
  { xp: 40, name: "Light", note: "about one lesson a day" },
  { xp: 80, name: "Steady", note: "about two lessons a day" },
  { xp: 140, name: "Serious", note: "three or four lessons a day" },
];
export const DEFAULT_GOAL = 80;
/** Bump when the XP scale changes. Older saves are rescaled once in migrate(). */
export const XP_REV = 2;

export interface SessionTally {
  mode: XpMode;
  /** Sum of per-answer points (fractional). */
  points: number;
  scored: number;
  accuracy: number;
  stars: number;
  perfect: boolean;
}

/**
 * XP design:
 *  - Every right answer is worth 0.8 to 1.6 points depending on difficulty tier, a near miss half, a wrong answer none.
 *  - A short combo adds up to 0.4 per answer, so streaks matter but never dominate.
 *  - Modes are weighted by how much new learning they carry: lessons 1.0, gate 0.6, harmony 0.8, review 0.7, speed 0.5.
 *  - Finishing well pays a completion bonus (lesson stars, a passed test, a clean review). Speed rounds are capped.
 *  - Repeating the same session on the same day pays less (see XpRules.repeatFactor), so grinding one easy lesson
 *    cannot fill the goal. The result: a lesson is worth about 35 to 45 XP, never hundreds.
 */
export class XpRules {
  private static readonly BASE = [0, 0.8, 1, 1.3, 1.6];
  private static readonly MODE: Record<XpMode, number> = { lesson: 1, review: 0.7, gate: 0.6, harmony: 0.8, speed: 0.5 };
  private static readonly STAR_BONUS = [0, 3, 6, 10];
  static readonly SPEED_CAP = 30;
  private static readonly REPEAT = [1, 0.5, 0.25, 0.1];

  /** Fractional points for one answer. */
  static forAnswer(verdict: Verdict, tier: number, combo: number): number {
    if (verdict === "wrong") return 0;
    const base = XpRules.BASE[Math.min(4, Math.max(1, Math.round(tier)))] as number;
    if (verdict === "near") return base / 2;
    return base + Math.min(0.4, Math.max(0, combo - 2) * 0.1);
  }

  static modeWeight(mode: XpMode): number { return XpRules.MODE[mode]; }

  /** Final XP and the completion bonus included in it. */
  static session(t: SessionTally): { xp: number; bonus: number } {
    if (t.scored < 3) return { xp: 0, bonus: 0 };
    const earned = t.points * XpRules.MODE[t.mode];
    let bonus = 0;
    if (t.mode === "lesson") bonus = XpRules.STAR_BONUS[t.stars] as number;
    else if (t.mode === "gate") bonus = t.accuracy >= 0.8 ? 8 : 0;
    else if (t.mode === "review" || t.mode === "harmony") bonus = t.scored >= 8 && t.accuracy >= 0.9 ? 3 : 0;
    const total = Math.round(earned + bonus);
    if (t.mode === "speed") return { xp: Math.min(XpRules.SPEED_CAP, total), bonus: 0 };
    return { xp: total, bonus: Math.min(total, bonus) };
  }

  /** Share of XP paid for the nth play (0 based) of the same session today. */
  static repeatFactor(playsToday: number): number {
    return XpRules.REPEAT[Math.min(XpRules.REPEAT.length - 1, Math.max(0, playsToday))] as number;
  }

  static stars(accuracy: number): 0 | 1 | 2 | 3 {
    if (accuracy >= 0.9) return 3;
    if (accuracy >= 0.75) return 2;
    if (accuracy >= 0.55) return 1;
    return 0;
  }
}

export interface LevelInfo {
  level: number;
  title: string;
  into: number;
  span: number;
  progress: number;
  next: number;
}

/** Level curve: cumulative XP to reach level L is 60 * (L - 1)^1.5 (a lesson is about 40 XP), so early levels come fast and later ones stretch. */
export class Levels {
  static xpFor(level: number): number {
    return Math.round(60 * Math.pow(Math.max(0, level - 1), 1.5));
  }
  static titleFor(level: number): string {
    if (level >= 20) return "Üstat";
    if (level >= 15) return "Usta";
    if (level >= 10) return "Kalfa";
    if (level >= 5) return "Çırak";
    return "Acemi";
  }
  static meaning(title: string): string {
    return ({ Acemi: "novice", Çırak: "apprentice", Kalfa: "journeyman", Usta: "master", Üstat: "grand master" } as Record<string, string>)[title] ?? "";
  }
  static info(xp: number): LevelInfo {
    let level = 1;
    while (Levels.xpFor(level + 1) <= xp) level++;
    const base = Levels.xpFor(level);
    const next = Levels.xpFor(level + 1);
    return { level, title: Levels.titleFor(level), into: xp - base, span: next - base, progress: (xp - base) / (next - base), next };
  }
}
