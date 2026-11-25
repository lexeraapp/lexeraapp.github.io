import { useState } from "react";
import { Icon } from "../ui/Icon.tsx";
import { LogoMark } from "../ui/Logo.tsx";
import { DAILY_GOALS as GOALS, DEFAULT_GOAL } from "../engine/Rewards.ts";
import { useInstall, useStore } from "../ui/context.tsx";

export function Welcome() {
  const s = useStore();
  const install = useInstall();
  const [goal, setGoal] = useState(DEFAULT_GOAL);
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
