import { useEffect, useState } from "react";

const SET = "abcçdefgğhıijklmnoöprsştuüvyz";

/** Text scramble reveal, carried over from the portfolio's branding page. */
export function Scramble({ text, duration = 700 }: { text: string; duration?: number }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (document.documentElement.dataset.motion === "reduced") { setOut(text); return; }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / duration);
      const keep = Math.floor(text.length * k);
      setOut(text.split("").map((ch, i) => (i < keep || ch === " " ? ch : SET[Math.floor(Math.random() * SET.length)])).join(""));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration]);
  return <>{out}</>;
}
