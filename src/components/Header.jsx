import { NavLink } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

function Item({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-xl text-sm transition border ${
          isActive
            ? "bg-slate-800 border-slate-700 text-white"
            : "bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 grid place-items-center">
            <Gamepad2 className="w-5 h-5 text-indigo-300" />
          </div>

          <div className="leading-tight">
            <p className="font-semibold text-base">GameAtlas</p>
            <p className="text-xs text-slate-400">
              Explora · Busca · Descubre
            </p>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex items-center gap-2">
          <Item to="/">Inicio</Item>
          <Item to="/games">Videojuegos</Item>
        </nav>
      </div>
    </header>
  );
}
