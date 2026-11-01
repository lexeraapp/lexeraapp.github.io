import type { ReactNode } from "react";

export function Ring({ size = 56, stroke = 2, progress, children, tone = "var(--accent-bright)" }: {
  size?: number; stroke?: number; progress: number; children?: ReactNode; tone?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-hover)" strokeWidth={stroke} opacity=".6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tone} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - p)} style={{ transition: "stroke-dashoffset 1.2s var(--ease-liturgy)" }} />
      </svg>
      <div className="ring-in">{children}</div>
    </div>
  );
}
