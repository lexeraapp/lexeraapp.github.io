import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PHASE_INFO } from "../content/ContentLibrary.ts";
import { ALPHABET } from "../content/alphabet.ts";
import { TurkishText } from "../core/TurkishText.ts";
import { Icon } from "../ui/Icon.tsx";
import { useSpeechReady, useStore } from "../ui/context.tsx";

type Tab = "words" | "grammar" | "sounds" | "method";
const TABS: { id: Tab; label: string }[] = [
  { id: "words", label: "Words" }, { id: "grammar", label: "Grammar" }, { id: "sounds", label: "Sounds" }, { id: "method", label: "Method" },
];

function Dot({ level }: { level: string }) {
  const fill = level === "mastered" ? 1 : level === "known" ? 0.66 : level === "learning" ? 0.33 : 0;
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-label={level} role="img">
      <circle cx="7" cy="7" r="5.5" fill="none" stroke="var(--text-3)" strokeWidth="1" />
      {fill > 0 && <circle cx="7" cy="7" r={5.5 * fill} fill="var(--accent-bright)" />}
    </svg>
  );
}

function Words() {
  const s = useStore();
  const [q, setQ] = useState("");
  const speech = useSpeechReady();
  const list = useMemo(() => {
    const needle = TurkishText.fold(q.trim());
    return s.lib.lessons
      .filter((l) => s.lessonStatus(l.id) !== "locked")
      .map((l) => ({ l, words: l.words.filter((w) => !needle || TurkishText.fold(w.tr).includes(needle) || w.en.toLowerCase().includes(needle)) }))
      .filter((g) => g.words.length);
  }, [s, q]);
  return (
    <div className="stack">
      <label className="search">
        <Icon name="search" size={18} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Turkish or English" inputMode="search" autoCapitalize="off" autoCorrect="off" aria-label="Search words" />
      </label>
      {list.length === 0 && <p className="muted">Words appear here as you unlock lessons.</p>}
      {list.map(({ l, words }) => (
        <section key={l.id} className="stack" style={{ gap: 6 }}>
          <p className="eyebrow">{l.title}</p>
          <div className="card list">
            {words.map((w) => (
              <button key={w.id} className="li" onClick={() => s.speech.speak(w.tr)} aria-label={`${w.tr}, ${w.en}`}>
                <Dot level={s.mastery(w.id)} />
                <span className="grow" style={{ textAlign: "left" }}>
                  <span className="tr li-tr">{w.tr}</span>
                  <span className="muted li-en">{w.en}</span>
                </span>
                {speech && <Icon name="speaker" size={16} />}
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Grammar() {
  const s = useStore();
  return (
    <div className="stack">
      {s.lib.units.map((u) => (
        <Link key={u.id} to={`/atlas/note/${u.id}`} className="card tap li-card">
          <span className="grow">
            <span className="eyebrow">{PHASE_INFO[u.phase].title} · unit {u.index + 1}</span>
            <h3 style={{ marginTop: 2 }}>{u.note.title}</h3>
          </span>
          <Icon name="next" size={18} />
        </Link>
      ))}
    </div>
  );
}

function Sounds() {
  const s = useStore();
  const speech = useSpeechReady();
  return (
    <div className="stack">
      <p className="muted">Twenty-nine letters, one sound each. Tap a letter to hear its anchor word{speech ? "" : " (audio needs a Turkish voice on your device)"}.</p>
      <div className="alpha">
        {ALPHABET.map((l) => (
          <button key={l.lower} className="letter" onClick={() => s.speech.speak(l.word, true)}>
            <span className="tr letter-big">{l.upper}{l.lower}</span>
            <span className="letter-word tr">{l.word}</span>
            <span className="dim letter-sound">{l.sound}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const METHOD: { title: string; body: string; source: string }[] = [
  { title: "Spaced retrieval", body: "Every word you meet is brought back at growing intervals, just before you would forget it. Recalling beats rereading, and spacing beats cramming.", source: "Ebbinghaus 1885; Cepeda et al. 2006; Roediger and Karpicke 2006" },
  { title: "The 85 percent rule", body: "A hidden director watches your last answers and nudges difficulty to keep you right about four times in five. That is hard enough to learn from and easy enough to keep going.", source: "Wilson et al. 2019; Csikszentmihalyi on flow" },
  { title: "Frequent words first", body: "Early lessons use the highest value vocabulary and the phrases real Turkish speakers use daily, because a small core covers most everyday speech.", source: "Nation on frequency and coverage" },
  { title: "Grammar as pattern, not rules", body: "Turkish glues suffixes onto words. Instead of memorising tables, you drill the two harmony patterns thousands of times in different words until the right vowel feels right.", source: "Pattern learning and desirable difficulty, Bjork 1994" },
  { title: "Mixed practice", body: "Each lesson blends new items with older ones and varies the format: choose, match, listen, build, type. Varied retrieval builds sturdier memory than blocked repetition.", source: "Interleaving research, Rohrer and Taylor 2007" },
  { title: "Comprehensible input", body: "Sentences stay just beyond what you know, with full translations, so you meet new forms inside meaning instead of in isolation.", source: "Krashen 1982" },
  { title: "Finish on a win", body: "Sessions warm up, climb to the hardest items, then cool down on something you know. People remember the peak and the end of an experience, so the end is designed.", source: "Kahneman et al. 1993" },
];

function Method() {
  return (
    <div className="stack">
      <p className="muted">Lexera is built from published findings on how adults learn languages. This is what each part of the app is for.</p>
      {METHOD.map((m) => (
        <article key={m.title} className="card stack" style={{ gap: 6 }}>
          <h3>{m.title}</h3>
          <p className="muted" style={{ fontSize: "0.92rem" }}>{m.body}</p>
          <p className="mono">{m.source}</p>
        </article>
      ))}
      <p className="dim" style={{ fontSize: "0.82rem" }}>Course content follows CEFR levels A1 to B1. Have a native speaker review anything you plan to rely on in formal settings.</p>
    </div>
  );
}

export function Atlas() {
  const [tab, setTab] = useState<Tab>("words");
  return (
    <main className="screen">
      <div className="page-title">
        <p className="eyebrow">Atlas</p>
        <h1>Everything you have met.</h1>
      </div>
      <div className="seg" role="tablist">
        {TABS.map((t) => <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "on" : ""} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>
      <div style={{ marginTop: 18 }}>
        {tab === "words" && <Words />}
        {tab === "grammar" && <Grammar />}
        {tab === "sounds" && <Sounds />}
        {tab === "method" && <Method />}
      </div>
    </main>
  );
}

export function NoteReader() {
  const { id } = useParams();
  const nav = useNavigate();
  const s = useStore();
  const unit = id ? s.lib.unit(id) : undefined;
  if (!unit) return <main className="screen"><p>Note not found.</p></main>;
  const n = unit.note;
  return (
    <main className="screen">
      <button className="btn ghost sm" onClick={() => nav(-1)} style={{ marginLeft: -12 }}><Icon name="back" size={18} /> Back</button>
      <article className="stack note" style={{ marginTop: 8 }}>
        <p className="eyebrow">{PHASE_INFO[unit.phase].title} · {unit.title}</p>
        <h1>{n.title}</h1>
        {n.paragraphs.map((p, i) => <p key={i} className="note-p">{p}</p>)}
        {n.table && (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr>{n.table.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>{n.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={j > 0 ? "tr" : ""}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        )}
        <hr className="hair" />
        <p className="eyebrow">Words in this unit</p>
        <div className="chips">
          {unit.lessons.flatMap((l) => l.words).map((w) => <button key={w.id} className="chip tr" onClick={() => s.speech.speak(w.tr)}>{w.tr}</button>)}
        </div>
      </article>
    </main>
  );
}
