import { NavLink } from "react-router-dom";
import { Icon, type IconName } from "./Icon.tsx";
import { LogoMark } from "./Logo.tsx";
import { Ring } from "./Ring.tsx";
import { useStore } from "./context.tsx";

const TABS: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: "/", label: "Path", icon: "path", end: true },
  { to: "/practice", label: "Practice", icon: "practice" },
  { to: "/atlas", label: "Atlas", icon: "atlas" },
  { to: "/you", label: "You", icon: "you" },
];

export function TabBar() {
  return (
    <nav className="tabbar" aria-label="Main">
      <div className="tabbar-in">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => "tab" + (isActive ? " on" : "")}>
            <Icon name={t.icon} size={22} />
            <span>{t.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

/** Streak, level and daily goal in one quiet line. */
export function Hud() {
  const s = useStore();
  const lvl = s.level;
  const goal = s.save.goal;
  const p = Math.min(1, s.todayXp / goal);
  return (
    <header className="hud">
      <div className="row">
        <LogoMark size={30} />
        <span className="wordmark">Lexera</span>
      </div>
      <div className="row hud-stats">
        <span className={"hud-stat" + (s.streakDoneToday ? " lit" : "")} title="Day streak">
          <Icon name="ember" size={18} fill={s.streakDoneToday} />
          <b className="num">{s.streak}</b>
        </span>
        <Ring size={44} stroke={2} progress={p}>
          <span className="num hud-lvl">{lvl.level}</span>
        </Ring>
      </div>
    </header>
  );
}
