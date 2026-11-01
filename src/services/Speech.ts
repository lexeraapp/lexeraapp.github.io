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
  speak(text: string, slow = false): void {
    if (!this.available || !this.voice) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = this.voice;
    u.lang = this.voice.lang;
    u.rate = slow ? Math.max(0.4, this.rate - 0.4) : this.rate;
    window.speechSynthesis.speak(u);
  }
  stop(): void {
    if (Speech.supported) window.speechSynthesis.cancel();
  }
}
