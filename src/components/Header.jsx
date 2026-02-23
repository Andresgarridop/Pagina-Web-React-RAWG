import { NavLink } from "react-router-dom";
import { Gamepad2, User, Heart, Calendar, Zap } from "lucide-react";

function Item({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-xl text-sm transition border ${isActive
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
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 grid place-items-center">
            <Gamepad2 className="w-5 h-5 text-indigo-300" />
          </div>

          <div className="leading-tight hidden sm:block">
            <p className="font-semibold text-base">GameAtlas</p>
            <p className="text-xs text-slate-400">
              Explora · Busca · Descubre
            </p>
          </div>
        </NavLink>

        {/* NAV */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-2">
            <Item to="/">Inicio</Item>
            <Item to="/games">Videojuegos</Item>
            <Item to="/events">Eventos</Item>
            <Item to="/publishers">Desarrolladoras</Item>
          </nav>

          <div className="h-8 w-px bg-slate-800 mx-2 hidden md:block" />

          {/* USER PROFILE SIMULATION */}
          <div className="flex items-center gap-2 group relative py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 cursor-pointer">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-300" />
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 mt-1 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right group-hover:translate-y-0 translate-y-2">
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-800/20">
                <p className="text-sm font-semibold text-white">Usuario</p>
                <p className="text-xs text-slate-400">usuario@gameatlas.com</p>
              </div>
              <div className="p-2">
                <NavLink to="/my-favorites" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                  <Heart className="w-4 h-4 text-pink-400" />
                  Mis Favoritos
                </NavLink>
                <NavLink to="/my-events" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Mis Eventos
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
