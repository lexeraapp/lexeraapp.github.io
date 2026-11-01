/** Tulip inside a halo: the lale is the emblem of Turkish culture, the halo is the portfolio's primary mark. */
export function LogoMark({ size = 40, ring = true }: { size?: number; ring?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      {ring && <circle cx="32" cy="32" r="26" stroke="var(--accent)" strokeWidth="1.2" opacity=".7" />}
      <g stroke="var(--text)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 13c-7 9-7 20 0 28 7-8 7-19 0-28z" fill="var(--text)" fillOpacity=".14" />
        <path d="M30 40C21 37 17 28 18 20c6 3 10 9 11.500 15" />
        <path d="M34 40c9-3 13-12 12-20-6 3-10 9-11.500 15" />
        <path d="M32 41v14" />
        <path d="M32 50c-5 0-8-2.500-9-6 5 0 8 2 9 6z" />
      </g>
    </svg>
  );
}

export function Wordmark({ size = 28 }: { size?: number }) {
  return (
    <span className="wordmark" style={{ fontSize: size }}>
      Lexera
    </span>
  );
}
