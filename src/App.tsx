import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { Atlas, NoteReader } from "./screens/Atlas.tsx";
import { Path } from "./screens/Path.tsx";
import { Practice } from "./screens/Practice.tsx";
import { Welcome } from "./screens/Welcome.tsx";
import { You } from "./screens/You.tsx";
import { Play } from "./screens/play/Play.tsx";
import { Backdrop } from "./ui/Backdrop.tsx";
import { TabBar } from "./ui/Shell.tsx";
import { AppProvider, useStore } from "./ui/context.tsx";

function Frame() {
  const s = useStore();
  const { pathname } = useLocation();
  const playing = pathname.startsWith("/play");
  if (!s.save.onboarded) return <Welcome />;
  return (
    <>
      <Routes>
        <Route path="/" element={<Path />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/atlas" element={<Atlas />} />
        <Route path="/atlas/note/:id" element={<NoteReader />} />
        <Route path="/you" element={<You />} />
        <Route path="/play/:mode/:id?" element={<Play />} />
        <Route path="*" element={<Path />} />
      </Routes>
      {!playing && <TabBar />}
    </>
  );
}

export function App() {
  return (
    <AppProvider>
      <div className="app">
        <Backdrop />
        <HashRouter>
          <Frame />
        </HashRouter>
      </div>
    </AppProvider>
  );
}
