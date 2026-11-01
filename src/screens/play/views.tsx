import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { TurkishText } from "../../core/TurkishText.ts";
import type { BuildExercise, ChoiceExercise, ClozeExercise, IntroExercise, MatchExercise, TypingExercise, Outcome } from "../../engine/exercises/Exercise.ts";
import type { AppStore } from "../../services/AppStore.ts";
import { Icon } from "../../ui/Icon.tsx";

export interface ViewProps<E, A> {
  ex: E;
  store: AppStore;
  result: Outcome | null;
  onAnswer: (a: A) => void;
  registerCheck?: (fn: (() => void) | null, enabled: boolean) => void;
}

function Speak({ text, store, big }: { text: string; store: AppStore; big?: boolean }) {
  return (
    <div className="row" style={{ gap: 8, justifyContent: "center" }}>
      <button className={"speak" + (big ? " big" : "")} onClick={() => store.speech.speak(text)} aria-label="Play audio"><Icon name="speaker" size={big ? 34 : 20} /></button>
      <button className="speak slow" onClick={() => store.speech.speak(text, true)} aria-label="Play slowly"><Icon name="slow" size={big ? 22 : 18} /></button>
    </div>
  );
}

export function IntroView({ ex, store, onAnswer }: ViewProps<IntroExercise, void>) {
  useEffect(() => { store.speech.speak(ex.tr); }, [ex, store]);
  return (
    <div className="ex center">
      <p className="eyebrow">New</p>
      <h1 className="tr intro-tr">{ex.tr}</h1>
      {ex.hint && <p className="mono">{ex.hint}</p>}
      <p className="intro-en">{ex.en}</p>
      {store.speech.available && <Speak text={ex.tr} store={store} big />}
      <button className="btn primary" style={{ marginTop: 28 }} onClick={() => onAnswer()}>Got it</button>
    </div>
  );
}

export function ChoiceView({ ex, store, result, onAnswer }: ViewProps<ChoiceExercise, string>) {
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => { setPicked(null); if (ex.speak) store.speech.speak(ex.speak); }, [ex, store]);
  const listen = ex.kind === "listen";
  return (
    <div className="ex">
      <p className="ex-instr">{ex.instruction}</p>
      {listen ? <Speak text={ex.speak ?? ""} store={store} big />
        : <button className={"prompt " + (ex.promptLang === "tr" ? "tr" : "")} onClick={() => ex.promptLang === "tr" && store.speech.speak(ex.prompt)}>{ex.prompt}</button>}
      <div className={"opts n" + ex.options.length}>
        {ex.options.map((o) => {
          const state = !result ? "" : o.id === ex.answerId ? " ok" : o.id === picked ? " bad" : " dim";
          return (
            <button key={o.id} className={"opt" + state + (ex.options.some((x) => x.label.length > 14) ? " long" : "")} disabled={!!result}
              onClick={() => { setPicked(o.id); onAnswer(o.id); }}>
              <span className={/[ıİğşçöü]/.test(o.label) || ex.promptLang === "en" ? "tr" : ""}>{o.label}</span>
              {state === " ok" && <Icon name="check" size={18} stroke={2} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ClozeView({ ex, result, onAnswer }: ViewProps<ClozeExercise, string>) {
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => setPicked(null), [ex]);
  return (
    <div className="ex">
      <p className="ex-instr">Which ending completes the word?</p>
      <div className="cloze-card">
        <span className="chip">{ex.familyLabel}</span>
        <div className="cloze tr">
          <span>{ex.stem}</span>
          <span className={"gap" + (result ? (picked === ex.answer ? " ok" : " bad") : "")}>{result ? (picked ?? "") : "\u00a0\u00a0\u00a0\u00a0"}</span>
        </div>
        <p className="muted">{ex.gloss}</p>
        <p className="mono">{ex.pattern}</p>
      </div>
      <div className="opts cl">
        {ex.options.map((o) => {
          const state = !result ? "" : o === ex.answer ? " ok" : o === picked ? " bad" : " dim";
          return <button key={o} className={"opt tr" + state} disabled={!!result} onClick={() => { setPicked(o); onAnswer(o); }}>-{o}</button>;
        })}
      </div>
    </div>
  );
}

const KEYS = ["ç", "ğ", "ı", "ö", "ş", "ü", "İ"];
export function TypingView({ ex, store, result, onAnswer, registerCheck }: ViewProps<TypingExercise, string>) {
  const [val, setVal] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { setVal(""); ref.current?.focus({ preventScroll: true }); if (ex.speak) store.speech.speak(ex.speak); }, [ex, store]);
  useEffect(() => {
    registerCheck?.(() => onAnswer(val), val.trim().length > 0);
    return () => registerCheck?.(null, false);
  }, [val, registerCheck, onAnswer]);
  const insert = (ch: string) => {
    const el = ref.current;
    const at = el?.selectionStart ?? val.length;
    const next = val.slice(0, at) + ch + val.slice(el?.selectionEnd ?? at);
    setVal(next);
    requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(at + 1, at + 1); });
  };
  return (
    <div className="ex">
      <p className="ex-instr">{ex.instruction}</p>
      {ex.prompt ? <p className="prompt">{ex.prompt}</p> : <Speak text={ex.speak ?? ""} store={store} big />}
      {ex.firstLetter && <p className="mono" style={{ textAlign: "center" }}>starts with {TurkishText.lower(ex.answer[0] ?? "")}, {ex.answer.length} letters</p>}
      <input ref={ref} className={"typing tr" + (result ? (result.verdict === "wrong" ? " bad" : " ok") : "")} value={val} disabled={!!result}
        onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && val.trim()) onAnswer(val); }}
        lang="tr" autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck={false} enterKeyHint="done" aria-label="Your answer" placeholder="Type in Turkish" />
      <div className="keys" aria-label="Turkish letters">
        {KEYS.map((k) => <button key={k} className="key tr" disabled={!!result} onPointerDown={(e) => e.preventDefault()} onClick={() => insert(k)}>{k}</button>)}
      </div>
    </div>
  );
}

export function BuildView({ ex, store, result, onAnswer, registerCheck }: ViewProps<BuildExercise, string[]>) {
  const [placed, setPlaced] = useState<string[]>([]);
  useEffect(() => setPlaced([]), [ex]);
  const text = (id: string) => ex.tiles.find((t) => t.id === id)?.text ?? "";
  useEffect(() => {
    registerCheck?.(() => onAnswer(placed.map(text)), placed.length > 0);
    return () => registerCheck?.(null, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placed, registerCheck, onAnswer]);
  const state = result ? (result.verdict === "wrong" ? " bad" : " ok") : "";
  return (
    <div className="ex">
      <p className="ex-instr">Build this sentence in Turkish</p>
      <p className="prompt">{ex.prompt}</p>
      <div className={"line" + state} aria-label="Your sentence">
        {placed.map((id) => (
          <button key={id} className="tile tr" disabled={!!result} onClick={() => { store.sfx.tap(); setPlaced(placed.filter((p) => p !== id)); }}>{text(id)}</button>
        ))}
      </div>
      <div className="bank">
        {ex.tiles.map((t) => (
          <button key={t.id} className={"tile tr" + (placed.includes(t.id) ? " used" : "")} disabled={!!result || placed.includes(t.id)}
            onClick={() => { store.sfx.tap(); store.haptics.tap(); setPlaced([...placed, t.id]); }}>{t.text}</button>
        ))}
      </div>
    </div>
  );
}

/** Two columns facing each other, same row height, with a drawn link for every match. */
export function MatchView({ ex, store, onAnswer }: ViewProps<MatchExercise, { missedIds: string[] }>) {
  const [sel, setSel] = useState<{ side: "l" | "r"; id: string } | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [missed, setMissed] = useState<string[]>([]);
  const [flash, setFlash] = useState<string[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const cards = useRef(new Map<string, HTMLButtonElement>());
  const [lines, setLines] = useState<{ id: string; x1: number; y1: number; x2: number; y2: number }[]>([]);
  useEffect(() => { setSel(null); setDone([]); setMissed([]); setFlash([]); }, [ex]);
  const pair = (id: string) => ex.pairs.find((p) => p.id === id)!;

  const measure = () => {
    const box = wrap.current?.getBoundingClientRect();
    if (!box) return;
    setLines(done.map((id) => {
      const a = cards.current.get("l" + id)?.getBoundingClientRect();
      const b = cards.current.get("r" + id)?.getBoundingClientRect();
      if (!a || !b) return { id, x1: 0, y1: 0, x2: 0, y2: 0 };
      return { id, x1: a.right - box.left, y1: a.top + a.height / 2 - box.top, x2: b.left - box.left, y2: b.top + b.height / 2 - box.top };
    }));
  };
  useLayoutEffect(() => { measure(); window.addEventListener("resize", measure); return () => window.removeEventListener("resize", measure); }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const tap = (side: "l" | "r", id: string) => {
    if (done.includes(id) && side) return;
    store.sfx.tap(); store.haptics.tap();
    if (side === "l") store.speech.speak(pair(id).tr);
    if (!sel || sel.side === side) { setSel({ side, id }); return; }
    const leftId = side === "r" ? sel.id : id;
    const rightId = side === "r" ? id : sel.id;
    if (leftId === rightId) {
      const next = [...done, leftId];
      setDone(next); setSel(null); store.sfx.correct();
      if (next.length === ex.pairs.length) setTimeout(() => onAnswer({ missedIds: missed }), 750);
    } else {
      store.sfx.wrong(); store.haptics.wrong();
      setMissed((m) => [...new Set([...m, leftId, rightId])]);
      setFlash([leftId, rightId]); setSel(null);
      setTimeout(() => setFlash([]), 450);
    }
  };
  const cls = (side: "l" | "r", id: string) =>
    "mcard" + (side === "l" ? " tr" : "") + (done.includes(id) ? " done" : "") + (sel?.side === side && sel.id === id ? " sel" : "") + (flash.includes(id) ? " bad" : "");
  return (
    <div className="ex">
      <p className="ex-instr">Match each Turkish word with its meaning</p>
      <div className="match" ref={wrap}>
        <svg className="match-lines" aria-hidden="true">
          {lines.map((l) => <line key={l.id} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--ok)" strokeWidth="1.5" strokeLinecap="round" style={{ ["--len" as string]: 400, strokeDasharray: 400, animation: "draw 0.5s var(--ease-liturgy) both" }} />)}
        </svg>
        {ex.leftOrder.map((id, i) => (
          <button key={"l" + id} style={{ gridColumn: 1, gridRow: i + 1 }} ref={(el) => { if (el) cards.current.set("l" + id, el); }} className={cls("l", id)} onClick={() => tap("l", id)}>{pair(id).tr}</button>
        ))}
        {ex.rightOrder.map((id, i) => (
          <button key={"r" + id} style={{ gridColumn: 2, gridRow: i + 1 }} ref={(el) => { if (el) cards.current.set("r" + id, el); }} className={cls("r", id)} onClick={() => tap("r", id)}>{pair(id).en}</button>
        ))}
      </div>
    </div>
  );
}
