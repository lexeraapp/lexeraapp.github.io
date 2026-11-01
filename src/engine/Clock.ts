export class Clock {
  now(): number {
    return Date.now();
  }
  /** Local calendar day key, e.g. 2026-10-31. */
  static key(ms: number): string {
    const d = new Date(ms);
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }
  static diffDays(a: string, b: string): number {
    const [ay, am, ad] = a.split("-").map(Number) as [number, number, number];
    const [by, bm, bd] = b.split("-").map(Number) as [number, number, number];
    return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86_400_000);
  }
  static addDays(key: string, n: number): string {
    const [y, m, d] = key.split("-").map(Number) as [number, number, number];
    return Clock.key(new Date(y, m - 1, d + n).getTime());
  }
}
