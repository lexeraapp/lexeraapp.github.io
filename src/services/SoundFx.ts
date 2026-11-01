type Tone = { f: number; t: number; d: number; type?: OscillatorType; g?: number };

/** Tiny synthesized sound set, no audio files. Quiet and low by design. */
export class SoundFx {
  enabled = true;
  private ctx: AudioContext | null = null;

  private context(): AudioContext | null {
    if (!this.enabled) return null;
    try {
      const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!C) return null;
      this.ctx ??= new C();
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }
  private play(tones: Tone[]): void {
    const ctx = this.context();
    if (!ctx) return;
    const t0 = ctx.currentTime;
    for (const n of tones) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = n.type ?? "sine";
      o.frequency.value = n.f;
      const peak = n.g ?? 0.05;
      g.gain.setValueAtTime(0.0001, t0 + n.t);
      g.gain.exponentialRampToValueAtTime(peak, t0 + n.t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + n.t + n.d);
      o.connect(g).connect(ctx.destination);
      o.start(t0 + n.t);
      o.stop(t0 + n.t + n.d + 0.05);
    }
  }
  tap(): void { this.play([{ f: 440, t: 0, d: 0.06, g: 0.025 }]); }
  correct(): void { this.play([{ f: 523.25, t: 0, d: 0.16 }, { f: 659.25, t: 0.08, d: 0.22 }]); }
  near(): void { this.play([{ f: 440, t: 0, d: 0.2 }]); }
  wrong(): void { this.play([{ f: 196, t: 0, d: 0.22, type: "triangle", g: 0.06 }]); }
  complete(): void { this.play([523.25, 659.25, 783.99, 1046.5].map((f, i) => ({ f, t: i * 0.1, d: 0.35 }))); }
  levelUp(): void { this.play([392, 523.25, 659.25, 783.99, 1046.5].map((f, i) => ({ f, t: i * 0.09, d: 0.4, g: 0.06 }))); }
}

export class Haptics {
  enabled = true;
  private buzz(p: number | number[]): void {
    if (this.enabled && "vibrate" in navigator) navigator.vibrate(p);
  }
  tap(): void { this.buzz(8); }
  correct(): void { this.buzz(12); }
  wrong(): void { this.buzz([30, 40, 30]); }
  complete(): void { this.buzz([20, 40, 20, 40, 60]); }
}
