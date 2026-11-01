import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeBook } from "../../engine/Badges.ts";
import type { PracticeSession } from "../../engine/PracticeSession.ts";
import type { CommitResult } from "../../services/AppStore.ts";
import { Icon } from "../../ui/Icon.tsx";
import { Medal } from "../../ui/Medal.tsx";
import { Ring } from "../../ui/Ring.tsx";
import { Scramble } from "../../ui/Scramble.tsx";
import { useStore } from "../../ui/context.tsx";

export function Summary({ session }: { session: PracticeSession }) {
  const s = useStore();
  const nav = useNavigate();
  const sum = useRef(session.summary()).current;
  const [res, setRes] = useState<CommitResult | null>(null);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const r = s.commit(sum);
    setRes(r);
    if (r.leveledUp) s.sfx.levelUp(); else s.sfx.complete();
    s.haptics.complete();
  }, [s, sum]);

  const lesson = sum.mode === "lesson";
  const gate = sum.mode === "gate";
  const speed = sum.mode === "speed";
  const failed = (lesson && sum.stars < 1) || (gate && res && !res.passed);
  const title = failed ? "Not yet" : speed ? `${sum.correct} correct` : gate ? "Test passed" : sum.stars === 3 ? "Flawless" : "Session complete";
  const secs = Math.max(1, Math.round(sum.durationMs / 1000));
  const lvl = res?.levelAfter ?? s.level;

  return (
    <main className="screen summary">
      <p className="eyebrow">{session.title}</p>
      <h1><Scramble text={title} /></h1>
      {lesson && (
        <div className="big-stars" aria-label={`${sum.stars} of 3 stars`}>
          {[1, 2, 3].map((i) => <span key={i} style={{ animationDelay: `${0.25 + i * 0.22}s` }} className={i <= sum.stars ? "on" : ""}><Icon name="star" size={40} fill={i <= sum.stars} /></span>)}
        </div>
      )}
      <p className="muted summary-msg">
        {failed ? (lesson ? "You answered under 55 percent right. That is normal for new material. Play it again, it will feel easier." : "You need 80 percent to skip ahead. Review the earlier phase and try again.")
          : speed ? (res?.speedRecord ? "A new personal best." : `Your best is ${s.save.stats.speedBest}.`)
          : sum.perfect ? "Not one mistake. That is how it sticks." : sum.accuracy >= 0.75 ? "Solid work. The words you missed will come back soon." : "Passed. The words you missed will come back in your reviews."}
      </p>

      <div className="stat-grid three">
        <div className="card stat"><b className="num">{Math.round(sum.accuracy * 100)}%</b><span className="dim">accuracy</span></div>
        <div className="card stat"><b className="num">+{sum.xp}</b><span className="dim">xp{sum.bonusXp ? ` (${sum.bonusXp} bonus)` : ""}</span></div>
        <div className="card stat"><b className="num">{speed ? sum.bestCombo : secs}</b><span className="dim">{speed ? "best run" : "seconds"}</span></div>
      </div>

      <section className="card lvl" style={{ marginTop: 14 }}>
        <Ring size={72} stroke={2.5} progress={lvl.progress}><span className="num lvl-n" style={{ fontSize: "1.5rem" }}>{lvl.level}</span></Ring>
        <div className="grow">
          <b>{res?.leveledUp ? `Level ${lvl.level}: ${lvl.title}` : `${lvl.title}, level ${lvl.level}`}</b>
          <p className="mono" style={{ marginTop: 4 }}>{lvl.into} / {lvl.span} xp</p>
        </div>
      </section>

      <div className="stack" style={{ marginTop: 14, gap: 10 }}>
        {res?.streakExtended && <div className="card row"><Icon name="ember" size={20} fill /><span>Streak: {res.streakCount} {res.streakCount === 1 ? "day" : "days"}{res.earnedFreeze ? ". You earned a streak freeze." : ""}</span></div>}
        {res?.goalReached && <div className="card row"><Icon name="target" size={20} /><span>Daily goal reached.</span></div>}
        {res?.unlockedPhase && <div className="card row"><Icon name="flag" size={20} /><span>The {res.unlockedPhase} phase is open.</span></div>}
        {res?.newBadges.map((id) => {
          const b = BadgeBook.byId(id);
          return b && (
            <div key={id} className="card row" style={{ gap: 14 }}>
              <Medal glyph={b.glyph} tier={b.tier} earned size={58} />
              <span><b>{b.title}</b><span className="muted" style={{ display: "block", fontSize: "0.88rem" }}>{b.desc}</span></span>
            </div>
          );
        })}
      </div>

      <div className="stack" style={{ marginTop: 22 }}>
        <button className="btn primary" onClick={() => nav("/", { replace: true })}>Continue</button>
        {(failed || speed) && <button className="btn" onClick={() => nav(0)}>Play again</button>}
      </div>
    </main>
  );
}
