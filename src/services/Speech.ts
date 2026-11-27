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
    if (typeof document !== "undefined") {
      const prime = (): void => this.unlock();
      for (const type of ["pointerdown", "touchend", "click", "keydown"]) document.addEventListener(type, prime, { once: true, capture: true });
    }
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
  /** iOS Safari only lets speech start after a real tap. Prime the engine silently on the first touch of the app,
   *  so the first word of a session (spoken from an effect, not from a tap) is not dropped. */
  unlock(): void {
    if (this.unlocked || !Speech.supported) return;
    this.unlocked = true;
    try {
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      window.speechSynthesis.speak(u);
    } catch { /* ignore */ }
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
