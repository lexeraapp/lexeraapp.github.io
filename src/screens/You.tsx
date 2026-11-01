import { useRef, useState } from "react";
import { BadgeBook } from "../engine/Badges.ts";
import { Levels } from "../engine/Rewards.ts";
import { Icon } from "../ui/Icon.tsx";
import { Medal } from "../ui/Medal.tsx";
import { Ring } from "../ui/Ring.tsx";
import { useInstall, useStore } from "../ui/context.tsx";

function Toggle({ label, on, onChange, note }: { label: string; on: boolean; onChange: (v: boolean) => void; note?: string }) {
  return (
    <button className="toggle" role="switch" aria-checked={on} onClick={() => onChange(!on)}>
      <span className="grow" style={{ textAlign: "left" }}>
        {label}
        {note && <span className="dim" style={{ display: "block", fontSize: "0.8rem" }}>{note}</span>}
      </span>
      <span className={"switch" + (on ? " on" : "")}><i /></span>
    </button>
  );
}

export function You() {
  const s = useStore();
  const install = useInstall();
  const lvl = s.level;
  const act = s.weekActivity();
  const max = Math.max(1, ...act.map((a) => a.xp));
  const [pick, setPick] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const codeRef = useRef<HTMLTextAreaElement>(null);
  const d = s.save;
  const acc = d.stats.answered ? Math.round((d.stats.right / d.stats.answered) * 100) : 0;
  const picked = pick ? BadgeBook.byId(pick) : undefined;

  return (
    <main className="screen">
      <div className="page-title"><p className="eyebrow">You</p><h1>Your progress.</h1></div>

      <section className="card lvl">
        <Ring size={96} stroke={2.5} progress={lvl.progress}>
          <span className="num lvl-n">{lvl.level}</span>
        </Ring>
        <div className="grow">
          <h2>{lvl.title}</h2>
          <p className="muted" style={{ fontSize: "0.9rem" }}>{Levels.meaning(lvl.title)}</p>
          <p className="mono" style={{ marginTop: 8 }}>{lvl.into} / {lvl.span} xp to level {lvl.level + 1}</p>
        </div>
      </section>

      <section className="stat-grid" style={{ marginTop: 14 }}>
        <div className="card stat"><Icon name="ember" size={18} /><b className="num">{s.streak}</b><span className="dim">day streak</span></div>
        <div className="card stat"><Icon name="shield" size={18} /><b className="num">{d.streak.freezes}</b><span className="dim">freezes</span></div>
        <div className="card stat"><Icon name="atlas" size={18} /><b className="num">{s.knownCount}</b><span className="dim">words known</span></div>
        <div className="card stat"><Icon name="target" size={18} /><b className="num">{acc}%</b><span className="dim">accuracy</span></div>
      </section>

      <section className="card" style={{ marginTop: 14 }}>
        <div className="between row"><h3>Last five weeks</h3><span className="mono">best streak {d.streak.best}</span></div>
        <div className="heat" role="img" aria-label="Activity over the last 35 days">
          {act.map((a) => <i key={a.key} style={{ opacity: a.xp ? 0.28 + 0.72 * (a.xp / max) : 1 }} className={a.xp ? "hit" : ""} title={`${a.key}: ${a.xp} xp`} />)}
        </div>
        <p className="dim" style={{ fontSize: "0.82rem", marginTop: 10 }}>A streak freeze covers a missed day. You earn one every 7 days, up to 2.</p>
      </section>

      <section style={{ marginTop: 22 }}>
        <div className="between row"><h2>Badges</h2><span className="mono">{Object.keys(d.badges).length} / {BadgeBook.all.length}</span></div>
        <div className="medals">
          {BadgeBook.all.map((b) => (
            <button key={b.id} className={"medal" + (pick === b.id ? " on" : "")} onClick={() => setPick(pick === b.id ? null : b.id)} aria-label={`${b.title}, ${d.badges[b.id] ? "earned" : "locked"}`}>
              <Medal glyph={b.glyph} tier={b.tier} earned={!!d.badges[b.id]} size={64} />
              <span className="medal-t">{b.title}</span>
            </button>
          ))}
        </div>
        {picked && (
          <div className="card" style={{ marginTop: 10 }}>
            <b>{picked.title}</b>
            <p className="muted" style={{ fontSize: "0.9rem" }}>{picked.desc}</p>
            <p className="mono" style={{ marginTop: 6 }}>{d.badges[picked.id] ? `earned ${new Date(d.badges[picked.id] as number).toLocaleDateString()}` : "not earned yet"}</p>
          </div>
        )}
      </section>

      <section className="stack" style={{ marginTop: 26 }}>
        <h2>Settings</h2>
        <div className="card list">
          <div className="li goalrow">
            <span className="grow">Daily goal</span>
            <div className="seg mini">
              {[20, 40, 60].map((g) => <button key={g} className={d.goal === g ? "on" : ""} onClick={() => s.update((x) => { x.goal = g; })}>{g}</button>)}
            </div>
          </div>
          <Toggle label="Sound effects" on={d.settings.sound} onChange={(v) => s.update((x) => { x.settings.sound = v; })} />
          <Toggle label="Turkish voice" on={d.settings.speech} note={s.speech.available ? undefined : "No Turkish voice found on this device"} onChange={(v) => s.update((x) => { x.settings.speech = v; })} />
          <Toggle label="Haptics" on={d.settings.haptics} onChange={(v) => s.update((x) => { x.settings.haptics = v; })} />
          <Toggle label="Reduce motion" on={d.settings.reduceMotion} onChange={(v) => s.update((x) => { x.settings.reduceMotion = v; })} />
        </div>

        {!install.standalone && (
          <div className="card stack" style={{ gap: 8 }}>
            <div className="row"><Icon name="download" size={20} /><b>Install Lexera</b></div>
            <p className="muted" style={{ fontSize: "0.9rem" }}>
              {install.ios ? "In Safari tap Share, then Add to Home Screen. Lexera then opens full screen and works offline." : "Install it to open full screen from your home screen, and use it offline."}
            </p>
            {install.canPrompt && <button className="btn" onClick={() => void install.prompt()}>Install app</button>}
          </div>
        )}

        <div className="card stack" style={{ gap: 10 }}>
          <b>Back up your progress</b>
          <p className="muted" style={{ fontSize: "0.88rem" }}>There are no accounts, so progress lives on this device. Copy the code to move it somewhere else.</p>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn sm grow" onClick={async () => { try { await navigator.clipboard.writeText(s.exportCode()); setMsg("Code copied."); } catch { setMsg("Copy failed. Select the box below instead."); if (codeRef.current) codeRef.current.value = s.exportCode(); } }}>Copy code</button>
            <button className="btn sm grow" onClick={() => { const ok = s.importCode(codeRef.current?.value ?? ""); setMsg(ok ? "Progress restored." : "That code did not work."); }}>Restore</button>
          </div>
          <textarea ref={codeRef} className="code" rows={2} placeholder="Paste a backup code here to restore" aria-label="Backup code" />
          {msg && <p className="mono" role="status">{msg}</p>}
        </div>

        <button className="btn ghost" onClick={() => { if (window.confirm("Erase all progress on this device? This cannot be undone.")) s.reset(); }}>Reset all progress</button>
      </section>
    </main>
  );
}
