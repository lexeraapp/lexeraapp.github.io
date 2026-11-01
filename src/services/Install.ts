interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Wraps the install prompt (Android, desktop) and detects iOS where installation is manual. */
export class InstallHelper {
  private deferred: BeforeInstallPromptEvent | null = null;
  private listeners = new Set<() => void>();

  constructor() {
    if (typeof window === "undefined") return;
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferred = e as BeforeInstallPromptEvent;
      this.listeners.forEach((l) => l());
    });
    window.addEventListener("appinstalled", () => {
      this.deferred = null;
      this.listeners.forEach((l) => l());
    });
  }
  onChange(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  get standalone(): boolean {
    const nav = navigator as Navigator & { standalone?: boolean };
    return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
  }
  get ios(): boolean {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }
  get canPrompt(): boolean {
    return this.deferred !== null;
  }
  async prompt(): Promise<boolean> {
    if (!this.deferred) return false;
    await this.deferred.prompt();
    const r = await this.deferred.userChoice;
    this.deferred = null;
    return r.outcome === "accepted";
  }
}
