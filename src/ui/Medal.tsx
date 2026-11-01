import { IconGlyph, type IconName } from "./Icon.tsx";

/** Badge art: concentric hairline rings encode tier, the glyph encodes the discipline. Locked badges are dashed. */
export function Medal({ glyph, tier, earned, size = 72 }: { glyph: string; tier: 1 | 2 | 3; earned: boolean; size?: number }) {
  const rings = [34, 30, 26].slice(0, tier);
  const tone = earned ? (tier === 3 ? "var(--accent-bright)" : tier === 2 ? "var(--text-2)" : "var(--accent)") : "var(--text-3)";
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" aria-hidden="true" style={{ opacity: earned ? 1 : 0.45 }}>
      {rings.map((r) => (
        <circle key={r} cx="40" cy="40" r={r} stroke={tone} strokeWidth="1" strokeDasharray={earned ? undefined : "2 4"} />
      ))}
      {earned && <circle cx="40" cy="40" r="22" fill="var(--accent-dim)" />}
      <g transform="translate(26 26) scale(1.167)" stroke={earned ? "var(--text)" : "var(--text-3)"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <IconGlyph name={glyph as IconName} />
      </g>
    </svg>
  );
}
