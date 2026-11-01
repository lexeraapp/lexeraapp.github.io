export type IconName =
  | "path" | "practice" | "atlas" | "you" | "ember" | "lozenge" | "star" | "lock" | "check" | "close" | "speaker" | "slow"
  | "back" | "next" | "gear" | "search" | "shield" | "bolt" | "repeat" | "headphones" | "pen" | "grid" | "harmony" | "target"
  | "build" | "play" | "flag" | "info" | "download" | "tulip";

interface Spec { d: string[]; c?: [number, number, number][] }
const S: Record<IconName, Spec> = {
  path: { d: ["M7 21c0-5 10-4 10-9S8 8 8 3"], c: [[7, 21, 1.2], [8, 3, 1.2]] },
  practice: { d: [], c: [[12, 12, 9], [12, 12, 5], [12, 12, 1]] },
  atlas: { d: ["M3 5.5c3-1 6-1 9 1 3-2 6-2 9-1V19c-3-1-6-1-9 1-3-2-6-2-9-1z", "M12 6.5V20"] },
  you: { d: ["M4.5 20c1-4 4-6 7.5-6s6.5 2 7.5 6"], c: [[12, 8, 4]] },
  ember: { d: ["M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z"] },
  lozenge: { d: ["M12 3l7 9-7 9-7-9z"] },
  star: { d: ["M12 3c.6 4.6 3.4 7.4 9 9-5.6 1.6-8.4 4.4-9 9-.6-4.6-3.4-7.4-9-9 5.6-1.6 8.4-4.4 9-9z"] },
  lock: { d: ["M6 11h12v9H6z", "M8.5 11V8a3.5 3.5 0 0 1 7 0v3"] },
  check: { d: ["M5 12.5l4.5 4.5L19 7"] },
  close: { d: ["M6 6l12 12M18 6L6 18"] },
  speaker: { d: ["M4 9.5h3.5L12 6v12l-4.5-3.5H4z", "M15.5 9a4 4 0 0 1 0 6", "M18 6.5a8 8 0 0 1 0 11"] },
  slow: { d: ["M7 4h10M7 20h10", "M8 4c0 5 8 5 8 8s-8 3-8 8", "M16 4c0 5-8 5-8 8"] },
  back: { d: ["M15 5l-7 7 7 7"] },
  next: { d: ["M9 5l7 7-7 7"] },
  gear: { d: ["M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"], c: [[12, 12, 3.2]] },
  search: { d: ["M20 20l-4-4"], c: [[11, 11, 6.5]] },
  shield: { d: ["M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"] },
  bolt: { d: ["M13 3L5 13h6l-1 8 8-10h-6z"] },
  repeat: { d: ["M17 7H8a4 4 0 0 0-4 4", "M7 17h9a4 4 0 0 0 4-4", "M15 4l3 3-3 3", "M9 20l-3-3 3-3"] },
  headphones: { d: ["M4 14v-2a8 8 0 0 1 16 0v2", "M4 14h3v6H4z", "M17 14h3v6h-3z"] },
  pen: { d: ["M4 20l1-4L16 5l3 3L8 19z", "M14 7l3 3"] },
  grid: { d: ["M4 4h7v7H4z", "M13 4h7v7h-7z", "M4 13h7v7H4z", "M13 13h7v7h-7z"] },
  harmony: { d: ["M3 9c3-4 6 4 9 0s6-4 9 0", "M3 15c3-4 6 4 9 0s6-4 9 0"] },
  target: { d: [], c: [[12, 12, 9], [12, 12, 4.5], [12, 12, 0.8]] },
  build: { d: ["M4 8h6v4H4z", "M14 8h6v4h-6z", "M9 15h6v4H9z"] },
  play: { d: ["M8 5l11 7-11 7z"] },
  flag: { d: ["M6 21V4", "M6 5h11l-2 4 2 4H6"] },
  info: { d: ["M12 11v6", "M12 7.5v.2"], c: [[12, 12, 9]] },
  download: { d: ["M12 4v11", "M7 11l5 5 5-5", "M5 20h14"] },
  tulip: { d: ["M12 3c-3 4-3 8 0 11 3-3 3-7 0-11z", "M11 14c-4-1-6-5-5.5-8.500 2.500 1.500 4 4 4.500 6.500", "M13 14c4-1 6-5 5.500-8.500-2.500 1.500-4 4-4.500 6.500", "M12 14v7"] },
};

export function IconGlyph({ name }: { name: IconName }) {
  const s = S[name];
  return (
    <>
      {s.d.map((d, i) => <path key={i} d={d} />)}
      {s.c?.map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} />)}
    </>
  );
}

export function Icon({ name, size = 22, stroke = 1.5, className, fill }: { name: IconName; size?: number; stroke?: number; className?: string; fill?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} fillOpacity={fill ? 0.14 : undefined}
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <IconGlyph name={name} />
    </svg>
  );
}
