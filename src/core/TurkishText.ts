/** Locale-correct helpers. JS default casing breaks dotted and dotless i. */
export class TurkishText {
  static lower(s: string): string {
    return s.toLocaleLowerCase("tr-TR");
  }
  static upper(s: string): string {
    return s.toLocaleUpperCase("tr-TR");
  }
  private static readonly FOLD: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u",
  };
  /** Strip Turkish diacritics so "gorusuruz" can be compared with "görüşürüz". */
  static fold(s: string): string {
    return TurkishText.lower(s).replace(/[çğıöşüâîû]/g, (c) => TurkishText.FOLD[c] ?? c);
  }
  /** Normalise for exact comparison: case, spacing, apostrophes, punctuation. */
  static norm(s: string): string {
    return TurkishText.lower(s)
      .replace(/[’‘`´]/g, "'")
      .replace(/[.,!?;:"“”]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  static sameExact(a: string, b: string): boolean {
    return TurkishText.norm(a) === TurkishText.norm(b);
  }
  static sameFolded(a: string, b: string): boolean {
    return TurkishText.fold(TurkishText.norm(a)) === TurkishText.fold(TurkishText.norm(b));
  }
  static distance(a: string, b: string): number {
    const m = a.length;
    const n = b.length;
    if (!m) return n;
    if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        cur[j] = Math.min((prev[j] as number) + 1, (cur[j - 1] as number) + 1, (prev[j - 1] as number) + cost);
      }
      prev = cur;
    }
    return prev[n] as number;
  }
  static tokens(sentence: string): string[] {
    return sentence.trim().split(/\s+/).filter(Boolean);
  }
}
