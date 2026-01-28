import { NavLink } from "react-router-dom";
import { Gamepad2, Search, Star, Info } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/60">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 grid place-items-center">
                <Gamepad2 className="w-5 h-5 text-indigo-300" />
              </div>
              <div className="leading-tight">
                <p className="font-semibold">GameFinder</p>
                <p className="text-xs text-slate-400">Explora • Busca • Descubre</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Explora videojuegos destacados, busca títulos y accede a fichas completas utilizando
              la API de RAWG.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">Navegación</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <NavLink to="/" className="text-slate-300 hover:text-white transition">
                  Inicio
                </NavLink>
              </li>
              <li>
                <NavLink to="/games" className="text-slate-300 hover:text-white transition">
                  Videojuegos
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Funciones</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <Star className="w-4 h-4 text-indigo-300" />
                Slider de destacados
              </li>
              <li className="flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-300" />
                Búsqueda por nombre
              </li>
              <li className="flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-300" />
                Detalle del videojuego
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Explorar</p>
            <p className="mt-4 text-sm text-slate-400">
              Descubre los títulos más populares y mejor valorados del momento.
            </p>

            <div className="mt-6">
              <NavLink
                to="/games"
                className="inline-flex px-5 py-3 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 transition text-sm font-semibold"
              >
                Buscar videojuegos
              </NavLink>
            </div>
          </div>
        </div>

        {/* Todo integrado (sin “segundo footer”) */}
        <div className="mt-10 pt-8 border-t border-slate-800/70 text-sm text-slate-400 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GameAtlas</p>
          <p>Datos proporcionados por RAWG API</p>
        </div>
      </div>
    </footer>
  );
}
