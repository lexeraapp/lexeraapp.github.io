import { useNavigate } from "react-router-dom";
import { Icon, type IconName } from "../ui/Icon.tsx";
import { useStore } from "../ui/context.tsx";

interface ModeCard { to: string; icon: IconName; title: string; body: string; ready: boolean; hint: string; meta?: string }

export function Practice() {
  const s = useStore();
  const nav = useNavigate();
  const due = s.dueCount;
  const cards: ModeCard[] = [
    {
      to: "/play/review", icon: "repeat", title: "Review", ready: s.seenWords.length >= 4,
      body: "The words that are due again, ordered by how close you are to forgetting them.",
      hint: "Finish a lesson to unlock review.", meta: due > 0 ? `${due} due` : "nothing due",
    },
    {
      to: "/play/harmony", icon: "harmony", title: "Harmony gym", ready: s.canStart({ mode: "harmony" }),
      body: "Endless suffix drills. Vowel harmony and consonant harmony until you stop thinking about them.",
      hint: "Finish a lesson with grammar drills to unlock.", meta: `${s.save.stats.cloze} correct so far`,
    },
    {
      to: "/play/speed", icon: "bolt", title: "Speed round", ready: s.canStart({ mode: "speed" }),
      body: "Sixty seconds of quick recall. Build a streak of right answers and beat your best.",
      hint: "Learn at least 8 words to unlock.", meta: `best ${s.save.stats.speedBest}`,
    },
  ];
  return (
    <main className="screen">
      <div className="page-title">
        <p className="eyebrow">Practice</p>
        <h1>Keep it fresh.</h1>
        <p className="muted">Lessons teach. Practice makes it stay. Short sessions on separate days beat one long one.</p>
      </div>
      <div className="stack">
        {cards.map((c) => (
          <button key={c.to} className={"card tap mode" + (c.ready ? "" : " off")} onClick={() => c.ready && nav(c.to)} aria-disabled={!c.ready}>
            <span className="mode-ico">{c.ready ? <Icon name={c.icon} size={26} /> : <Icon name="lock" size={22} />}</span>
            <span className="grow" style={{ textAlign: "left" }}>
              <h3>{c.title}</h3>
              <span className="muted" style={{ fontSize: "0.88rem", display: "block", marginTop: 4 }}>{c.ready ? c.body : c.hint}</span>
              {c.ready && <span className="mono" style={{ display: "block", marginTop: 8 }}>{c.meta}</span>}
            </span>
            {c.ready && <Icon name="next" size={18} />}
          </button>
        ))}
      </div>
    </main>
  );
}
