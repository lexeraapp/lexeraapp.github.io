import { useState } from "react";
import { Icon } from "../ui/Icon.tsx";
import { LogoMark } from "../ui/Logo.tsx";
import { useInstall, useStore } from "../ui/context.tsx";

const GOALS = [
  { xp: 20, name: "Light", note: "about 5 minutes a day" },
  { xp: 40, name: "Steady", note: "about 10 minutes a day" },
  { xp: 60, name: "Serious", note: "about 15 minutes a day" },
];

export function Welcome() {
  const s = useStore();
  const install = useInstall();
  const [goal, setGoal] = useState(40);
  return (
    <main className="screen welcome">
      <div className="welcome-mark"><LogoMark size={92} /></div>
      <div className="stack" style={{ gap: 10 }}>
        <p className="eyebrow">Turkish for English speakers</p>
        <h1>Learn Turkish the way it is built.</h1>
        <p className="muted">Three phases, from first greetings to relative clauses. Short sessions that adapt to you, and grammar drills that teach vowel harmony until it feels automatic.</p>
      </div>
      <section className="stack" aria-label="Daily goal">
        <h3>Choose a daily goal</h3>
        {GOALS.map((g) => (
          <button key={g.xp} className={"card tap goal" + (goal === g.xp ? " on" : "")} onClick={() => setGoal(g.xp)} aria-pressed={goal === g.xp}>
            <span className="grow" style={{ textAlign: "left" }}>
              <b className="goal-name">{g.name}</b>
              <span className="dim" style={{ display: "block", fontSize: "0.85rem" }}>{g.note}</span>
            </span>
            <span className="mono">{g.xp} xp</span>
            <span className="goal-dot">{goal === g.xp && <Icon name="check" size={14} stroke={2} />}</span>
          </button>
        ))}
      </section>
      <div className="stack">
        <button className="btn primary" onClick={() => s.completeOnboarding(goal)}>Begin</button>
        <p className="mono" style={{ textAlign: "center" }}>No account. Progress stays on this device.</p>
        {!install.standalone && (
          <p className="dim" style={{ fontSize: "0.82rem", textAlign: "center" }}>
            {install.ios ? "On iPhone, tap Share, then Add to Home Screen to install Lexera." : "You can install Lexera from your browser menu to use it like an app."}
          </p>
        )}
      </div>
    </main>
  );
}
