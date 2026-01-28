import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar, Star, Trophy } from "lucide-react";

export default function HeroSlider({ items = [] }) {
  const slides = useMemo(() => (items || []).filter(Boolean), [items]);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const t = setInterval(() => {
      setI((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(t);
  }, [slides.length]);

  const current = slides[i];
  if (!current) return null;

  const bg = current.background_image;
  const released = current.released || "—";
  const rating = current.rating ? current.rating.toFixed(1) : "—";
  const meta = current.metacritic ?? "—";

  const next = () => setI((prev) => (prev + 1) % slides.length);
  const prev = () => setI((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative border-b border-slate-800">
      <div className="relative w-full h-[70vh] overflow-hidden">
        {bg && (
          <img
            src={bg}
            alt={current.name}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30" />

        <div className="relative h-full max-w-6xl mx-auto px-6 pt-10 pb-24 grid lg:grid-cols-2 items-end">
          <div>
            <p className="text-sm text-indigo-300 font-semibold uppercase tracking-wide">
              Clásicos y top valorados
            </p>

            <h2 className="mt-4 text-5xl sm:text-6xl font-extrabold leading-tight">
              {current.name}
            </h2>

            <div className="mt-5 flex flex-wrap gap-2 text-sm sm:text-base">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/60 border border-slate-800">
                <Calendar className="w-4 h-4 text-indigo-300" />
                {released}
              </span>

              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/60 border border-slate-800">
                <Star className="w-4 h-4 text-indigo-300" />
                {rating}
              </span>

              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/60 border border-slate-800">
                <Trophy className="w-4 h-4 text-indigo-300" />
                Metacritic: {meta}
              </span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to={`/games/${current.id}`}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-semibold transition"
              >
                Ver ficha
              </Link>

              <Link
                to="/games"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900 transition"
              >
                Buscar más
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-2">
          {slides.slice(0, 8).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-2.5 rounded-full transition border ${
                idx === i
                  ? "w-10 bg-indigo-400 border-indigo-300"
                  : "w-2.5 bg-slate-700/60 border-slate-600"
              }`}
              aria-label={`Ir a slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="absolute bottom-10 right-8 flex items-center gap-2">
          <button
            onClick={prev}
            className="p-4 rounded-2xl border border-slate-800 bg-slate-950/50 hover:bg-slate-900 transition"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 text-slate-100" />
          </button>

          <button
            onClick={next}
            className="p-4 rounded-2xl border border-slate-800 bg-slate-950/50 hover:bg-slate-900 transition"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6 text-slate-100" />
          </button>
        </div>
      </div>
    </section>
  );
}
