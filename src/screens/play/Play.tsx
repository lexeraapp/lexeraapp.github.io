import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PHASES, type PhaseId } from "../../core/types.ts";
import type { Answered, PracticeSession } from "../../engine/PracticeSession.ts";
import type { SessionSpec } from "../../services/AppStore.ts";
import type { BuildExercise, ChoiceExercise, ClozeExercise, IntroExercise, MatchExercise, Outcome, TypingExercise } from "../../engine/exercises/Exercise.ts";
import { Icon } from "../../ui/Icon.tsx";
import { useStore } from "../../ui/context.tsx";
import { Summary } from "./Summary.tsx";
import { BuildView, ChoiceView, ClozeView, IntroView, MatchView, TypingView } from "./views.tsx";

const SPEED_SECONDS = 60;

function parseSpec(mode?: string, id?: string): SessionSpec | null {
  switch (mode) {
    case "lesson": return id ? { mode: "lesson", lessonId: id } : null;
    case "gate": return id && PHASES.includes(id as PhaseId) ? { mode: "gate", phase: id as PhaseId } : null;
    case "review": case "harmony": case "speed": return { mode };
    default: return null;
  }
}

export function Play() {
  const { mode, id } = useParams();
  const nav = useNavigate();
  const store = useStore();
  const spec = parseSpec(mode, id);
  const sessionRef = useRef<PracticeSession | null>(null);
  if (!sessionRef.current && spec && store.canStart(spec)) sessionRef.current = store.createSession(spec);
  const session = sessionRef.current;

  const [, force] = useState(0);
  const [result, setResult] = useState<Answered | null>(null);
  const [leave, setLeave] = useState(false);
  const [over, setOver] = useState(false);
  const [left, setLeft] = useState(SPEED_SECONDS);
  const [score, setScore] = useState(0);
  const checkRef = useRef<(() => void) | null>(null);
  const [canCheck, setCanCheck] = useState(false);
  const speed = session?.mode === "speed";

  const registerCheck = useCallback((fn: (() => void) | null, enabled: boolean) => { checkRef.current = fn; setCanCheck(enabled); }, []);

  useEffect(() => { document.documentElement.dataset.phase = session?.opts.phase ?? ""; return () => { delete document.documentElement.dataset.phase; }; }, [session]);

  useEffect(() => {
    if (!speed || over) return;
    const t = setInterval(() => setLeft((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [speed, over]);
  useEffect(() => {
    if (speed && left <= 0 && !over) { session?.finish(); setOver(true); }
  }, [left, speed, over, session]);

  if (!session) {
    return (
      <main className="screen center-screen">
        <h2>Not available yet</h2>
        <p className="muted">Finish a few lessons to unlock this.</p>
        <button className="btn" onClick={() => nav("/")}>Back to path</button>
      </main>
    );
  }
  const ex = session.current;
  if (session.finished || over || !ex) return <Summary session={session} />;

  const answer = (a: unknown) => {
    if (result) return;
    const r = session.submit(a);
    setResult(r);
    const v = r.outcome.verdict;
    if (v === "correct") { store.sfx.correct(); store.haptics.correct(); if (speed) setScore((x) => x + 1); }
    else if (v === "near") store.sfx.near();
    else { store.sfx.wrong(); store.haptics.wrong(); }
    if (speed && v !== "wrong") { /* keep flowing */ }
    if (speed) setTimeout(() => next(), v === "wrong" ? 700 : 260);
  };
  const next = () => {
    session.advance();
    setResult(null);
    setCanCheck(false);
    if (session.finished) setOver(true);
    force((n) => n + 1);
  };

  const isIntro = ex.kind === "intro";
  const needsCheck = ex.kind === "typing" || ex.kind === "build";
  const outcome: Outcome | null = result?.outcome ?? null;
  const props = { store, result: outcome, registerCheck };
  const pct = speed ? left / SPEED_SECONDS : session.progress;

  return (
    <main className="play" data-verdict={outcome?.verdict ?? ""}>
      <header className="play-top">
        <button className="icon-btn" aria-label="Leave" onClick={() => (session.progress > 0 || speed ? setLeave(true) : nav(-1))}><Icon name="close" size={22} /></button>
        <div className="rail grow"><i style={{ width: `${pct * 100}%` }} /></div>
        {speed ? <span className="num play-score">{score}</span>
          : <span className={"combo" + (session.comboNow >= 3 ? " on" : "")} aria-label={`Combo ${session.comboNow}`}><Icon name="lozenge" size={14} fill /><b className="num">{session.comboNow}</b></span>}
      </header>
      <section className="play-body" key={ex.id}>
        {ex.kind === "intro" && <IntroView ex={ex as IntroExercise} {...props} onAnswer={() => next()} />}
        {(ex.kind === "choice" || ex.kind === "listen") && <ChoiceView ex={ex as ChoiceExercise} {...props} onAnswer={answer} />}
        {ex.kind === "cloze" && <ClozeView ex={ex as ClozeExercise} {...props} onAnswer={answer} />}
        {ex.kind === "typing" && <TypingView ex={ex as TypingExercise} {...props} onAnswer={answer} />}
        {ex.kind === "build" && <BuildView ex={ex as BuildExercise} {...props} onAnswer={answer} />}
        {ex.kind === "match" && <MatchView ex={ex as MatchExercise} {...props} onAnswer={answer} />}
      </section>

      {!isIntro && !outcome && needsCheck && (
        <footer className="play-foot"><button className="btn primary" disabled={!canCheck} onClick={() => checkRef.current?.()}>Check</button></footer>
      )}
      {outcome && !speed && (
        <footer className={"feedback " + outcome.verdict}>
          <div className="feedback-in">
            <div className="row" style={{ gap: 10 }}>
              <span className="fb-ico"><Icon name={outcome.verdict === "wrong" ? "close" : "check"} size={22} stroke={2} /></span>
              <h3 className="fb-title">{outcome.verdict === "correct" ? (result?.combo && result.combo >= 3 ? `Correct, ${result.combo} in a row` : "Correct") : outcome.verdict === "near" ? "Almost" : "Not quite"}</h3>
              {result && result.xp > 0 && <span className="mono fb-xp">+{result.xp} xp</span>}
            </div>
            {(outcome.verdict !== "correct" || ex.kind === "cloze") && (
              <div className="fb-detail">
                {outcome.verdict !== "correct" && ex.kind !== "match" && <p className="fb-answer tr">{outcome.correct}</p>}
                {ex.kind === "match" && <p className="muted">Review these pairs: {outcome.correct.split("\n").slice(0, 2).join(", ")} ...</p>}
                {outcome.notes.map((n, i) => <p key={i} className="muted fb-note">{n}</p>)}
                {ex.kind === "cloze" && outcome.verdict === "correct" && <p className="fb-answer tr">{outcome.correct}</p>}
              </div>
            )}
            <button className="btn primary" autoFocus onClick={next}>Continue</button>
          </div>
        </footer>
      )}

      {leave && (
        <div className="sheet-wrap" onClick={() => setLeave(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Leave session">
            <div className="sheet-grab" />
            <h2>Leave this session?</h2>
            <p className="muted">{speed ? "Your round will end now." : "Progress in this session will be lost."}</p>
            <button className="btn primary" onClick={() => setLeave(false)}>Keep going</button>
            <button className="btn ghost" onClick={() => (speed ? (session.finish(), setOver(true), setLeave(false)) : nav("/", { replace: true }))}>{speed ? "End round" : "Leave"}</button>
          </div>
        </div>
      )}
    </main>
  );
}
