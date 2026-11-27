/**
 * iPhone haptics. Safari has no Vibration API; the only Taptic hook is a native
 * <input type="checkbox" switch>, which ticks when a finger lands on it. Since iOS 26.5 a
 * script-made click on such a switch no longer ticks, so every tappable control gets an
 * invisible switch laid over it: the tap lands on the switch (haptic) and is forwarded
 * to the real control.
 */
const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
export const isIOS =
  /iP(hone|od|ad)/.test(ua) || (typeof navigator !== "undefined" && navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

let lastOverlayTick = 0;
/** True just after an overlay switch ticked, so the script fallback stays quiet instead of doubling up. */
export const overlayTickedRecently = (): boolean => Date.now() - lastOverlayTick < 300;

let fallback: HTMLLabelElement | null = null;
/** Works on iOS 17.4 to 26.4 for moments with no tap (results, errors). Ignored by newer iOS. */
let lastFallback = 0;
export function iosFallbackTick(): void {
  if (typeof document === "undefined" || overlayTickedRecently() || Date.now() - lastFallback < 80) return;
  lastFallback = Date.now();
  if (!fallback) {
    const label = document.createElement("label");
    label.setAttribute("aria-hidden", "true");
    label.style.display = "none";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", "");
    label.appendChild(input);
    document.head.appendChild(label);
    fallback = label;
  }
  fallback.click();
}

const HOSTS = "button, a[href]";
const SKIP = "[data-no-hx]";
/**
 * A finger that lands on a native switch is owned by the switch, so it cannot start a scroll. Overlays therefore go
 * only on controls that sit still: the tab bar, sheets, the feedback bar, the play header and footer, and answer
 * items inside a session. Controls on scrolling pages (badges, the path, settings) keep a script tick instead.
 */
const PINNED = ".tabbar, .sheet-wrap, .feedback, .play-foot, .play-top";
const PLAY_ITEMS = ".opt, .speak, .tile";

export function mountIosHaptics(): void {
  if (typeof document === "undefined" || !isIOS || "vibrate" in navigator) return;
  // Controls without an overlay still get the script tick (iOS 17.4 to 26.4; newer iOS ignores it).
  document.addEventListener("click", (event) => {
    if (document.documentElement.classList.contains("haptics-off")) return;
    if ((event.target as Element | null)?.closest?.("button, a[href]")) iosFallbackTick();
  });
  let queued = false;
  const decorate = (): void => {
    queued = false;
    document.querySelectorAll<HTMLElement>(HOSTS).forEach((host) => {
      if (host.querySelector(":scope > .hx") || host.closest(SKIP)) return;
      if (!host.closest(PINNED) && !host.matches(PLAY_ITEMS)) return;
      if ((host as HTMLButtonElement).disabled || host.getAttribute("aria-disabled") === "true") return;
      if (getComputedStyle(host).position === "static") host.classList.add("hx-host");
      const sw = document.createElement("input");
      sw.type = "checkbox";
      sw.className = "hx";
      sw.tabIndex = -1;
      sw.setAttribute("switch", "");
      sw.setAttribute("aria-hidden", "true");
      sw.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        lastOverlayTick = Date.now();
        if (!(host as HTMLButtonElement).disabled) host.click();
      });
      host.append(sw);
    });
  };
  const queue = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(decorate);
  };
  new MutationObserver(queue).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["disabled", "aria-disabled"],
  });
  decorate();
}
