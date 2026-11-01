import { Clock } from "./Clock.ts";
import type { StreakState } from "./SaveData.ts";

export interface StreakChange {
  state: StreakState;
  extended: boolean;
  froze: number;
  earnedFreeze: boolean;
  reset: boolean;
}

/** Daily streak with forgiveness: freezes bridge missed days, and one is earned every 7 days (max 2). */
export class StreakKeeper {
  static readonly MAX_FREEZES = 2;
  static touch(s: StreakState, today: string): StreakChange {
    const st = { ...s };
    if (st.last === today) return { state: st, extended: false, froze: 0, earnedFreeze: false, reset: false };
    let froze = 0;
    let reset = false;
    if (st.last === null) st.count = 1;
    else {
      const gap = Clock.diffDays(st.last, today);
      const missed = gap - 1;
      if (missed <= 0) st.count += 1;
      else if (missed <= st.freezes) {
        st.freezes -= missed;
        froze = missed;
        st.count += 1;
      } else {
        st.count = 1;
        reset = true;
      }
    }
    st.last = today;
    st.best = Math.max(st.best, st.count);
    let earned = false;
    if (st.count > 0 && st.count % 7 === 0 && st.freezes < StreakKeeper.MAX_FREEZES) {
      st.freezes += 1;
      earned = true;
    }
    return { state: st, extended: true, froze, earnedFreeze: earned, reset };
  }
  /** Streak shown to the player: lapses to 0 if the last active day is too far back to bridge. */
  static live(s: StreakState, today: string): number {
    if (!s.last) return 0;
    const missed = Clock.diffDays(s.last, today) - 1;
    return missed > s.freezes ? 0 : s.count;
  }
  static doneToday(s: StreakState, today: string): boolean {
    return s.last === today;
  }
}
