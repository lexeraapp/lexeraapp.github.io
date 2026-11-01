export interface KeyValueStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

/** localStorage with a silent in-memory fallback (private mode, blocked storage). */
export class SafeStorage implements KeyValueStorage {
  private readonly mem = new Map<string, string>();
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return this.mem.get(key) ?? null;
    }
  }
  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      this.mem.set(key, value);
    }
  }
  remove(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      this.mem.delete(key);
    }
  }
}

export class MemoryStorage implements KeyValueStorage {
  private readonly m = new Map<string, string>();
  get(k: string): string | null { return this.m.get(k) ?? null; }
  set(k: string, v: string): void { this.m.set(k, v); }
  remove(k: string): void { this.m.delete(k); }
}
