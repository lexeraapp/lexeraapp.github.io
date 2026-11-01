export const MAX_TIER = 4;

/**
 * Keeps the player inside the flow channel. Target success rate is 0.82, close to the ~85% optimum found for
 * learning with error-driven algorithms (Wilson et al., 2019, Nature Communications). Skill is a float in [1, 4].
 */
export class DifficultyDirector {
  static readonly TARGET = 0.82;
  private history: boolean[] = [];
  private _level: number;
  private misses = 0;
  private hits = 0;

  constructor(startLevel = 1.5, private readonly windowSize = 8) {
    this._level = DifficultyDirector.clamp(startLevel);
  }

  static clamp(v: number): number {
    return Math.min(MAX_TIER, Math.max(1, v));
  }

  get level(): number {
    return this._level;
  }
  get tier(): number {
    return Math.round(this._level);
  }
  get accuracy(): number {
    return this.history.length ? this.history.filter(Boolean).length / this.history.length : DifficultyDirector.TARGET;
  }

  record(ok: boolean): void {
    this.history.push(ok);
    if (this.history.length > this.windowSize) this.history.shift();
    if (ok) {
      this.hits += 1;
      this.misses = 0;
    } else {
      this.misses += 1;
      this.hits = 0;
    }
    // Proportional controller toward the target rate.
    const err = (ok ? 1 : 0) - DifficultyDirector.TARGET;
    let delta = err * 0.18;
    // Mercy rule: two misses in a row ease off immediately.
    if (this.misses >= 2) delta -= 0.35;
    // Stretch rule: a hot streak raises the bar so it never gets boring.
    if (this.hits >= 5) {
      delta += 0.25;
      this.hits = 0;
    }
    this._level = DifficultyDirector.clamp(this._level + delta);
  }

  /** Number of answer options: fewer choices at low tiers. */
  get choiceCount(): number {
    return this.tier <= 1 ? 3 : 4;
  }
}
