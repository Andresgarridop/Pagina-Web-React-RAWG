import { Routes, Route } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Games from "./pages/Games";
import GameDetail from "./pages/GameDetail";
import Publishers from "./pages/Publishers";
import PublisherDetail from "./pages/PublisherDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:id" element={<GameDetail />} />
          <Route path="/publishers" element={<Publishers />} />
          <Route path="/publishers/:id" element={<PublisherDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
