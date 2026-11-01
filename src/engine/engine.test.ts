import { describe, expect, it } from "vitest";
import { library } from "../content/ContentLibrary.ts";
import { Rng } from "../core/Rng.ts";
import { Content } from "./Content.ts";
import { DifficultyDirector } from "./DifficultyDirector.ts";
import { ExerciseFactory } from "./ExerciseFactory.ts";
import { PracticeSession } from "./PracticeSession.ts";
import { Levels } from "./Rewards.ts";
import { ReviewScheduler } from "./Scheduler.ts";
import { SessionPlanner } from "./SessionPlanner.ts";
import { StreakKeeper } from "./Streak.ts";
import { MatchExercise, TypingExercise } from "./exercises/Exercise.ts";

describe("Scheduler", () => {
  it("promotes on success and demotes on failure", () => {
    let s = ReviewScheduler.grade(undefined, "correct", 0);
    expect(s.box).toBe(1);
    s = ReviewScheduler.grade(s, "correct", 1000);
    s = ReviewScheduler.grade(s, "correct", 2000);
    expect(s.box).toBe(3);
    s = ReviewScheduler.grade(s, "wrong", 3000);
    expect(s.box).toBe(1);
    expect(s.lapses).toBe(1);
  });
});

describe("DifficultyDirector", () => {
  it("rises on a hot streak and falls after repeated misses, staying in range", () => {
    const d = new DifficultyDirector(2);
    for (let i = 0; i < 12; i++) d.record(true);
    expect(d.level).toBeGreaterThan(2.5);
    const high = d.level;
    d.record(false); d.record(false);
    expect(d.level).toBeLessThan(high - 0.3);
    for (let i = 0; i < 40; i++) d.record(false);
    expect(d.level).toBe(1);
    for (let i = 0; i < 80; i++) d.record(true);
    expect(d.level).toBeLessThanOrEqual(4);
  });
  it("settles in the middle for a player whose success falls as difficulty rises", () => {
    const rng = new Rng(7);
    const d = new DifficultyDirector(1);
    const levels: number[] = [];
    for (let i = 0; i < 600; i++) {
      const p = Math.min(0.99, Math.max(0.2, 0.97 - 0.16 * (d.level - 1)));
      d.record(rng.chance(p));
      if (i > 300) levels.push(d.level);
    }
    const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
    expect(avg).toBeGreaterThan(1.3);
    expect(avg).toBeLessThan(3.2);
    expect(d.accuracy).toBeGreaterThan(0.6);
  });
});

describe("Streak", () => {
  it("extends, freezes and resets", () => {
    let st = { count: 0, best: 0, last: null as string | null, freezes: 1 };
    st = StreakKeeper.touch(st, "2026-10-01").state;
    st = StreakKeeper.touch(st, "2026-10-02").state;
    expect(st.count).toBe(2);
    st = StreakKeeper.touch(st, "2026-10-04").state; // one missed day, freeze used
    expect(st.count).toBe(3);
    expect(st.freezes).toBe(0);
    st = StreakKeeper.touch(st, "2026-10-09").state; // gap, reset
    expect(st.count).toBe(1);
  });
});

describe("Levels", () => {
  it("is monotonic", () => {
    expect(Levels.info(0).level).toBe(1);
    expect(Levels.info(Levels.xpFor(5)).level).toBe(5);
    expect(Levels.xpFor(10)).toBeGreaterThan(Levels.xpFor(9));
  });
});

describe("Exercises", () => {
  it("typing accepts accent-free input as near", () => {
    const t = new TypingExercise("t", 3, { kind: "word", id: "x" }, "", "hello", "en", "günaydın", false);
    expect(t.check("günaydın").verdict).toBe("correct");
    expect(t.check("gunaydin").verdict).toBe("near");
    expect(t.check("merhaba").verdict).toBe("wrong");
  });
  it("match rows never start aligned", () => {
    const rng = new Rng(3);
    const f = new ExerciseFactory({ rng, speechAvailable: false });
    const words = library.lessons[0]!.words.slice(0, 5);
    for (let i = 0; i < 30; i++) {
      const m = f.match(words, 2) as MatchExercise;
      expect(m.leftOrder.some((id, k) => id !== m.rightOrder[k])).toBe(true);
    }
  });
});

describe("full lesson simulation", () => {
  it("every lesson plays to completion for a perfect player and for a poor player", () => {
    for (const lesson of library.lessons) {
      for (const skill of [1, 0.55]) {
        const rng = new Rng(lesson.id.length * 31 + (skill > 0.9 ? 1 : 2));
        const planner = new SessionPlanner(library, rng);
        const content = new Content(library);
        const s = new PracticeSession({
          mode: "lesson", title: lesson.title, lessonId: lesson.id, phase: lesson.phase,
          slots: planner.lesson(lesson, {}, Date.now()),
          factory: new ExerciseFactory({ rng, speechAvailable: true }),
          director: new DifficultyDirector(1.5), content,
          wordPool: [...lesson.words, ...library.lessonsBefore(lesson.id).flatMap((l) => l.words)],
          sentencePool: lesson.sentences,
        });
        let guard = 0;
        while (!s.finished && guard++ < 200) {
          const ex = s.current!;
          if (ex.kind === "intro") { s.advance(); continue; }
          const good = rng.chance(skill);
          let answer: unknown;
          switch (ex.kind) {
            case "choice": case "listen": { const c = ex as import("./exercises/Exercise.ts").ChoiceExercise; answer = good ? c.answerId : "nope"; break; }
            case "typing": answer = good ? (ex as TypingExercise).answer : "zzz"; break;
            case "build": answer = good ? (ex as import("./exercises/Exercise.ts").BuildExercise).answer : []; break;
            case "cloze": answer = good ? (ex as import("./exercises/Exercise.ts").ClozeExercise).answer : "?"; break;
            case "match": answer = { missedIds: good ? [] : ex.refs.map((r) => r.id) }; break;
          }
          s.submit(answer);
          s.advance();
        }
        expect(s.finished, lesson.id).toBe(true);
        const sum = s.summary();
        expect(sum.scored).toBeGreaterThan(15);
        expect(sum.scored).toBeLessThan(40);
        if (skill === 1) expect(sum.stars).toBe(3);
      }
    }
  });
});
