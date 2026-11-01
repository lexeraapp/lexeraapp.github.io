import { useEffect, useRef } from "react";

interface Mote { x: number; y: number; r: number; a: number; vy: number; vx: number; ph: number; accent: boolean }

/** Slow drifting dust, the portfolio's particle language reduced to atmosphere. */
export class ParticleField {
  private ctx: CanvasRenderingContext2D;
  private motes: Mote[] = [];
  private raf = 0;
  private w = 0;
  private h = 0;
  private t = 0;
  private running = false;
  private readonly onVisibility = () => (document.hidden ? this.stop() : this.start());

  constructor(private readonly canvas: HTMLCanvasElement, private readonly still: boolean) {
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.resize();
    window.addEventListener("resize", this.resize);
    document.addEventListener("visibilitychange", this.onVisibility);
  }
  private resize = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(90, (this.w * this.h) / 14000));
    this.motes = Array.from({ length: count }, () => this.spawn(true));
    if (this.still) this.draw();
  };
  private spawn(anywhere: boolean): Mote {
    return {
      x: Math.random() * this.w, y: anywhere ? Math.random() * this.h : this.h + 10,
      r: Math.random() * 1.2 + 0.3, a: Math.random() * 0.35 + 0.05, vy: -(Math.random() * 0.12 + 0.03),
      vx: (Math.random() - 0.5) * 0.05, ph: Math.random() * 6.28, accent: Math.random() > 0.9,
    };
  }
  start(): void {
    if (this.still || this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.t += 0.01;
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }
  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }
  private draw(): void {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);
    for (const m of this.motes) {
      m.x += m.vx; m.y += m.vy;
      if (m.y < -10) Object.assign(m, this.spawn(false));
      const tw = 0.6 + 0.4 * Math.sin(this.t * 2 + m.ph);
      ctx.globalAlpha = m.a * tw;
      ctx.fillStyle = m.accent ? "#c9cfd2" : "#e6e3da";
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, 6.2832);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  destroy(): void {
    this.stop();
    window.removeEventListener("resize", this.resize);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }
}

export function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduced";
    const field = new ParticleField(ref.current, still);
    field.start();
    return () => field.destroy();
  }, []);
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop-light" />
      <svg className="backdrop-halo" viewBox="0 0 800 800" fill="none">
        {[380, 300, 220, 140].map((r, i) => (
          <circle key={r} cx="400" cy="400" r={r} stroke="currentColor" strokeWidth="1" strokeDasharray={i % 2 ? "2 9" : undefined} />
        ))}
        <path d="M400 150c-55 70-55 150 0 215 55-65 55-145 0-215z" stroke="currentColor" strokeWidth="1" />
      </svg>
      <canvas ref={ref} className="backdrop-motes" />
      <div className="backdrop-grain" />
      <div className="backdrop-vignette" />
    </div>
  );
}
