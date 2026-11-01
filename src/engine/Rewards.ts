import type { Verdict } from "../core/types.ts";

export class XpRules {
  private static readonly BASE = [0, 6, 8, 10, 13, 16];
  static forAnswer(verdict: Verdict, tier: number, combo: number): number {
    if (verdict === "wrong") return 0;
    const base = XpRules.BASE[Math.min(5, Math.max(1, tier))] as number;
    const full = verdict === "correct" ? base : Math.round(base / 2);
    const bonus = verdict === "correct" ? Math.min(4, Math.max(0, combo - 2)) : 0;
    return full + bonus;
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

/** Level curve: cumulative XP to reach level L is 50 * (L - 1)^1.5, so early levels come fast and later ones stretch. */
export class Levels {
  static xpFor(level: number): number {
    return Math.round(50 * Math.pow(Math.max(0, level - 1), 1.5));
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
