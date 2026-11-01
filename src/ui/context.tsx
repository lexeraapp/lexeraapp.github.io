import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { AppStore } from "../services/AppStore.ts";
import { InstallHelper } from "../services/Install.ts";
import { SafeStorage } from "../services/Storage.ts";

const store = new AppStore(new SafeStorage());
const install = new InstallHelper();
const Ctx = createContext<AppStore>(store);

export function AppProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

/** Returns the store and re-renders the caller whenever progress changes. */
export function useStore(): AppStore {
  const s = useContext(Ctx);
  useSyncExternalStore(s.subscribe, s.getVersion, s.getVersion);
  return s;
}

export function useInstall(): InstallHelper {
  useSyncExternalStore(
    (fn) => install.onChange(fn),
    () => (install.canPrompt ? 1 : 0),
    () => 0,
  );
  return install;
}

export function useSpeechReady(): boolean {
  const s = useContext(Ctx);
  return useSyncExternalStore(
    (fn) => s.speech.onChange(fn),
    () => s.speech.available,
    () => false,
  );
}
