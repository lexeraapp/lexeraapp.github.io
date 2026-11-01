// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { beforeAll, describe, expect, it } from "vitest";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

beforeAll(() => {
  const noop = new Proxy({}, { get: () => () => undefined });
  HTMLCanvasElement.prototype.getContext = (() => noop) as never;
  window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as never;
  window.requestAnimationFrame = ((cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 16)) as never;
  Element.prototype.scrollTo = (() => undefined) as never;
});

const flush = () => act(async () => { await new Promise((r) => setTimeout(r, 30)); });
const click = async (el: Element | null | undefined) => { expect(el).toBeTruthy(); await act(async () => { (el as HTMLElement).click(); }); await flush(); };
const buttonByText = (root: HTMLElement, t: string) => [...root.querySelectorAll("button")].find((b) => b.textContent?.trim().startsWith(t));
const go = async (hash: string) => { await act(async () => { window.location.hash = hash; }); await flush(); };

describe("app smoke test", () => {
  it("boots, onboards, and renders every screen without crashing", async () => {
    const { App } = await import("../App.tsx");
    const host = document.createElement("div");
    host.id = "root";
    document.body.appendChild(host);
    const root = createRoot(host);
    await act(async () => { root.render(<App />); });
    await flush();

    expect(host.textContent).toContain("Choose a daily goal");
    await click(buttonByText(host, "Begin"));
    expect(host.textContent).toContain("Today");
    expect(host.textContent).toContain("Sounds and greetings");

    for (const [hash, needle] of [["/practice", "Harmony gym"], ["/atlas", "Everything you have met"], ["/atlas/note/b2", "To be"], ["/you", "Badges"], ["/", "Today"]] as const) {
      await go(hash);
      expect(host.textContent, hash).toContain(needle);
    }

    // Play the first lesson: intros then real exercises, answering whatever shows up.
    await go("/play/lesson/b1-1");
    expect(host.textContent).toContain("New");
    let guard = 0;
    while (guard++ < 120 && !host.textContent?.includes("accuracy")) {
      const got = buttonByText(host, "Got it");
      if (got) { await click(got); continue; }
      const cont = [...host.querySelectorAll(".feedback button")][0];
      if (cont) { await click(cont); continue; }
      const opt = host.querySelector(".opt:not(:disabled)");
      if (opt) { await click(opt); continue; }
      const input = host.querySelector("input.typing") as HTMLInputElement | null;
      if (input) {
        await act(async () => {
          const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
          set.call(input, "x"); input.dispatchEvent(new Event("input", { bubbles: true }));
        });
        await click(buttonByText(host, "Check"));
        continue;
      }
      const tile = host.querySelector(".bank .tile:not(:disabled)");
      if (tile) { await click(tile); await click(buttonByText(host, "Check")); continue; }
      const mcards = host.querySelectorAll(".mcard.tr");
      if (mcards.length) {
        // match: click every left card then its partner by trying right cards until done
        for (const l of mcards) {
          for (const r of host.querySelectorAll(".mcard:not(.tr):not(.done)")) {
            if ((l as HTMLElement).classList.contains("done")) break;
            await click(l); await click(r);
          }
        }
        await act(async () => { await new Promise((r) => setTimeout(r, 900)); });
        continue;
      }
      break;
    }
    expect(host.textContent).toContain("accuracy");
    expect(host.textContent).toContain("xp");
    root.unmount();
  }, 60_000);
});
