import { describe, expect, it } from "vitest";
import { library } from "./ContentLibrary.ts";
import { SuffixBook } from "../core/Harmony.ts";

describe("content integrity", () => {
  it("has 3 phases of 10 units with 2 lessons each", () => {
    expect(library.units).toHaveLength(30);
    expect(library.lessons).toHaveLength(60);
    for (const l of library.lessons) {
      expect(l.words.length).toBe(8);
      expect(l.sentences.length).toBeGreaterThanOrEqual(3);
    }
  });
  it("has no empty fields, emoji or em dashes", () => {
    for (const w of library.words) {
      expect(w.tr && w.en, w.id).toBeTruthy();
    }
    const blob = JSON.stringify(library.units);
    expect(blob).not.toMatch(/\u2014|\u2013/);
    expect(blob).not.toMatch(/\p{Extended_Pictographic}/u);
  });
  it("every drill builds and avoids unsupported present-tense stems", () => {
    for (const d of library.drills) {
      const fam = SuffixBook.get(d.family);
      const b = fam.build(d.stem);
      expect(fam.variants, d.id).toContain(b.add);
      if (d.family.startsWith("pres") || d.family.startsWith("pcont")) expect(/[ae]$/.test(d.stem), d.id).toBe(false);
    }
  });
  it("has no duplicate word forms inside a phase", () => {
    for (const phase of ["beginner", "intermediate", "advanced"] as const) {
      const seen = new Map<string, string>();
      for (const l of library.lessonsOf(phase)) for (const w of l.words) {
        const key = w.tr.toLowerCase() + "|" + w.en.toLowerCase();
        expect(seen.has(key), `${w.tr} repeated in ${l.id} and ${seen.get(key)}`).toBe(false);
        seen.set(key, l.id);
      }
    }
  });
  it("sentences contain at least two tokens", () => {
    for (const s of library.sentences) expect(s.tr.split(" ").length, s.id).toBeGreaterThanOrEqual(2);
  });
});
