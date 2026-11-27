/** Text to speech through the browser's Turkish voice. Degrades gracefully when no voice exists. */
export class Speech {
  private voice: SpeechSynthesisVoice | null = null;
  private listeners = new Set<() => void>();
  enabled = true;
  rate = 0.9;

  constructor() {
    if (!Speech.supported) return;
    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      const found = voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith("tr")) ?? null;
      if (found !== this.voice) {
        this.voice = found;
        this.listeners.forEach((l) => l());
      }
    };
    load();
    window.speechSynthesis.addEventListener?.("voiceschanged", load);
    this.armUnlock();
  }
  static get supported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }
  get available(): boolean {
    return this.enabled && !!this.voice;
  }
  onChange(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  private unlocked = false;
  private priming = false;
  private primeEvents = ["touchend", "pointerup", "click"] as const;
  private readonly onGesture = (): void => this.unlock();

  /**
   * iOS Safari starts speech only after the page has spoken once from inside a real tap. Words that play on their
   * own (the first word of a session is spoken from an effect, not from a tap) are dropped until then, which is
   * why the first word stayed silent and every later one worked. Prime the engine with a silent utterance from the
   * first genuine tap. Only touchend, pointerup and click count as activation: pointerdown and touchstart do not,
   * so those must not be used. The listeners stay until the engine confirms it has really started speaking.
   */
  private armUnlock(): void {
    if (typeof document === "undefined") return;
    for (const type of this.primeEvents) document.addEventListener(type, this.onGesture, { capture: true, passive: true });
  }
  private markUnlocked(): void {
    this.unlocked = true;
    this.priming = false;
    for (const type of this.primeEvents) document.removeEventListener(type, this.onGesture, { capture: true });
  }
  unlock(): void {
    if (this.unlocked || this.priming || !Speech.supported) return;
    this.priming = true;
    try {
      const u = new SpeechSynthesisUtterance(".");
      u.volume = 0;
      if (this.voice) { u.voice = this.voice; u.lang = this.voice.lang; }
      u.onstart = () => this.markUnlocked();
      u.onend = () => this.markUnlocked();
      u.onerror = () => { this.priming = false; };
      window.speechSynthesis.speak(u);
      window.setTimeout(() => { this.priming = false; }, 1500);
    } catch { this.priming = false; }
  }
  speak(text: string, slow = false): void {
    if (!this.enabled || !Speech.supported) return;
    const synth = window.speechSynthesis;
    const say = (): void => {
      if (!this.voice) {
        const found = synth.getVoices().find((v) => v.lang.toLowerCase().replace("_", "-").startsWith("tr"));
        if (!found) return;
        this.voice = found;
      }
      const u = new SpeechSynthesisUtterance(text);
      u.voice = this.voice;
      u.lang = this.voice.lang;
      u.rate = slow ? Math.max(0.4, this.rate - 0.4) : this.rate;
      u.onstart = () => { if (!this.unlocked) this.markUnlocked(); };
      synth.speak(u);
      if (synth.paused) synth.resume();
    };
    // iOS drops an utterance queued in the same tick as cancel(): give the cancel a moment to land.
    if (synth.speaking || synth.pending) {
      synth.cancel();
      window.setTimeout(say, 60);
    } else say();
  }
  stop(): void {
    if (Speech.supported) window.speechSynthesis.cancel();
  }
}
