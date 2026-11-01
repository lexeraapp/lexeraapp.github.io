import type { Verdict } from "../core/types.ts";

export interface ItemState {
  box: number; // 0 new, 1..6 Leitner boxes
  due: number; // epoch ms
  seen: number;
  right: number;
  lapses: number;
  last: number;
}
export type Mastery = "new" | "learning" | "known" | "mastered";

const DAY = 86_400_000;
/** Expanding intervals in days per box. Based on spaced retrieval research (Ebbinghaus, Cepeda et al. 2006). */
const INTERVAL_DAYS = [0, 0.8, 2, 4, 8, 16, 32];

export class ReviewScheduler {
  static fresh(now = 0): ItemState {
    return { box: 0, due: now, seen: 0, right: 0, lapses: 0, last: 0 };
  }

  /** Update an item after one retrieval attempt. `jitter` is in [0,1) and spreads reviews out. */
  static grade(prev: ItemState | undefined, verdict: Verdict, now: number, jitter = 0.5): ItemState {
    const s = { ...(prev ?? ReviewScheduler.fresh(now)) };
    s.seen += 1;
    s.last = now;
    if (verdict === "correct") {
      s.right += 1;
      s.box = Math.min(6, Math.max(1, s.box + 1));
    } else if (verdict === "near") {
      s.box = Math.max(1, s.box);
    } else {
      s.lapses += 1;
      s.box = s.box >= 4 ? s.box - 2 : 1;
    }
    const spread = 0.9 + jitter * 0.2;
    s.due = verdict === "wrong" ? now + 10 * 60_000 : now + (INTERVAL_DAYS[s.box] as number) * DAY * spread;
    return s;
  }

  static isDue(s: ItemState | undefined, now: number): boolean {
    return !!s && s.seen > 0 && s.due <= now;
  }

  static mastery(s: ItemState | undefined): Mastery {
    if (!s || s.seen === 0) return "new";
    if (s.box >= 5) return "mastered";
    if (s.box >= 3) return "known";
    return "learning";
  }

  /** Priority for choosing review items: most overdue and most lapsed first. */
  static urgency(s: ItemState, now: number): number {
    return (now - s.due) / DAY + s.lapses * 0.5 - s.box * 0.1;
  }
}
