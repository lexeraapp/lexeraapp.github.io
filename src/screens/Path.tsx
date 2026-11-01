import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PHASE_INFO } from "../content/ContentLibrary.ts";
import { PHASES, type Lesson, type PhaseId, type Unit } from "../core/types.ts";
import { Icon } from "../ui/Icon.tsx";
import { Hud } from "../ui/Shell.tsx";
import { useStore } from "../ui/context.tsx";

const X = [0, 44, 66, 44, 0, -44, -66, -44];
const STEP = 112;

function Stars({ n }: { n: number }) {
  return (
    <span className="stars" aria-label={`${n} of 3 stars`}>
      {[1, 2, 3].map((i) => <Icon key={i} name="star" size={11} fill={i <= n} className={i <= n ? "on" : ""} />)}
    </span>
  );
}

function UnitPath({ unit, onPick }: { unit: Unit; onPick: (l: Lesson) => void }) {
  const s = useStore();
  const n = unit.lessons.length;
  const h = n * STEP + 20;
  const pts = unit.lessons.map((_, i) => ({ x: 50 + (X[(unit.index * 2 + i) % X.length] as number) / 3.4, y: 52 + i * STEP }));
  return (
    <section className="unit">
      <div className="unit-head">
        <div className="grow">
          <p className="eyebrow">Unit {unit.index + 1}</p>
          <h2>{unit.title}</h2>
          <p className="muted" style={{ fontSize: "0.9rem", marginTop: 4 }}>{unit.summary}</p>
        </div>
        <button className="btn sm" onClick={() => onPick({ ...(unit.lessons[0] as Lesson), id: `note:${unit.id}` })}>
          <Icon name="atlas" size={16} /> Note
        </button>
      </div>
      <div className="trail" style={{ height: h }}>
        <svg className="trail-line" viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" aria-hidden="true">
          {pts.slice(1).map((p, i) => {
            const q = pts[i] as { x: number; y: number };
            const done = s.stars((unit.lessons[i] as Lesson).id) >= 1;
            return <path key={i} d={`M ${q.x} ${q.y} C ${q.x} ${q.y + 52}, ${p.x} ${p.y - 52}, ${p.x} ${p.y}`} fill="none" vectorEffect="non-scaling-stroke"
              stroke={done ? "var(--accent-bright)" : "var(--border-hover)"} strokeWidth="1" strokeDasharray={done ? undefined : "3 6"} />;
          })}
        </svg>
        {unit.lessons.map((l, i) => {
          const st = s.lessonStatus(l.id);
          const p = pts[i] as { x: number; y: number };
          return (
            <button key={l.id} className={`node ${st}`} style={{ left: `${p.x}%`, top: p.y }} onClick={() => onPick(l)}
              aria-label={`${l.title}, ${st}`}>
              <span className="node-ring">
                {st === "locked" ? <Icon name="lock" size={20} /> : st === "done" ? <Icon name="check" size={24} stroke={1.8} /> : <span className="num node-n">{s.lib.lessons.findIndex((x) => x.id === l.id) + 1}</span>}
              </span>
              <span className="node-label">{l.title}</span>
              {st === "done" && <Stars n={s.stars(l.id)} />}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function Path() {
  const s = useStore();
  const nav = useNavigate();
  const [phase, setPhase] = useState<PhaseId>(s.currentPhase);
  const [sheet, setSheet] = useState<Lesson | null>(null);
  const info = PHASE_INFO[phase];
  const prog = s.phaseProgress(phase);
  const next = s.nextLesson;
  const due = s.dueCount;
  const goalP = Math.min(1, s.todayXp / s.save.goal);
  const units = useMemo(() => s.lib.unitsOf(phase), [s.lib, phase]);
  const topRef = useRef<HTMLDivElement>(null);
  useEffect(() => { document.documentElement.dataset.phase = phase; return () => { delete document.documentElement.dataset.phase; }; }, [phase]);

  const pick = (l: Lesson) => {
    if (l.id.startsWith("note:")) { nav(`/atlas/note/${l.id.slice(5)}`); return; }
    setSheet(l);
  };
  const open = sheet ? s.lessonStatus(sheet.id) : "locked";

  return (
    <main className="screen" ref={topRef}>
      <Hud />
      <section className="today card">
        <div className="between row">
          <div>
            <p className="eyebrow">Today</p>
            <h3>{s.todayXp >= s.save.goal ? "Goal reached" : `${s.save.goal - s.todayXp} xp to your goal`}</h3>
          </div>
          <span className="num today-xp">{s.todayXp}<span className="dim">/{s.save.goal}</span></span>
        </div>
        <div className="rail" style={{ margin: "14px 0 18px" }}><i style={{ width: `${goalP * 100}%` }} /></div>
        <div className="row" style={{ gap: 10 }}>
          {next && <button className="btn primary grow" onClick={() => nav(`/play/lesson/${next.id}`)}><Icon name="play" size={16} fill /> {s.stars(next.id) ? "Practice again" : "Continue"}</button>}
          {due >= 4 && <button className="btn grow" onClick={() => nav("/play/review")}><Icon name="repeat" size={18} /> Review {due}</button>}
        </div>
      </section>

      <div className="phases" role="tablist" aria-label="Phases">
        {PHASES.map((p) => {
          const pp = s.phaseProgress(p);
          return (
            <button key={p} role="tab" aria-selected={phase === p} className={"phase" + (phase === p ? " on" : "")} onClick={() => setPhase(p)}>
              {!pp.unlocked && <Icon name="lock" size={13} />}
              <span>{PHASE_INFO[p].title}</span>
            </button>
          );
        })}
      </div>
      <div className="between row phase-meta">
        <p className="muted" style={{ fontSize: "0.9rem" }}>{info.blurb}</p>
        <span className="mono" style={{ whiteSpace: "nowrap" }}>{info.level} · {prog.done}/{prog.total}</span>
      </div>

      {!prog.unlocked && (
        <div className="card gate">
          <Icon name="flag" size={22} />
          <div className="grow">
            <b>Already know this?</b>
            <p className="muted" style={{ fontSize: "0.88rem" }}>Pass a 10 question test with 80 percent to skip ahead. Or finish the earlier phase to unlock it.</p>
          </div>
          <button className="btn sm" onClick={() => nav(`/play/gate/${phase}`)}>Test out</button>
        </div>
      )}

      {units.map((u) => <UnitPath key={u.id} unit={u} onPick={pick} />)}

      {sheet && (
        <div className="sheet-wrap" onClick={() => setSheet(null)}>
          <div className="sheet" role="dialog" aria-label={sheet.title} onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grab" />
            <p className="eyebrow">{PHASE_INFO[sheet.phase].title} · {s.lib.unit(sheet.unitId)?.title}</p>
            <h2>{sheet.title}</h2>
            <p className="muted">{sheet.goal}</p>
            <div className="chips">
              {sheet.words.slice(0, 8).map((w) => <span key={w.id} className="chip tr">{open === "locked" ? "?" : w.tr}</span>)}
            </div>
            <div className="card tipbox"><Icon name="info" size={18} /><p style={{ fontSize: "0.9rem" }}>{sheet.tip}</p></div>
            {open === "locked" ? (
              <p className="muted" style={{ fontSize: "0.9rem" }}>Finish the lesson before this one with at least one star to open it.</p>
            ) : (
              <button className="btn primary" onClick={() => nav(`/play/lesson/${sheet.id}`)}>{open === "done" ? "Play again" : "Start lesson"}</button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
