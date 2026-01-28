import { useEffect, useState } from "react";
import { Star, Search, Calendar, Info } from "lucide-react";

import Carousel from "../components/Carousel";
import HeroSlider from "../components/HeroSlider";
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import { getPopularGames, getTopMetacriticGames } from "../services/rawg";

export default function Home() {
  const [heroGames, setHeroGames] = useState([]);
  const [popular, setPopular] = useState([]);

  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);

  const [errorHero, setErrorHero] = useState("");
  const [errorPopular, setErrorPopular] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingHero(true);
        setErrorHero("");
        const data = await getTopMetacriticGames({ pageSize: 8 });
        if (!alive) return;
        setHeroGames(data.results || []);
      } catch {
        if (!alive) return;
        setErrorHero("No se pudo cargar el slider de videojuegos destacados.");
      } finally {
        if (!alive) return;
        setLoadingHero(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoadingPopular(true);
        setErrorPopular("");
        const data = await getPopularGames({ pageSize: 12 });
        if (!alive) return;
        setPopular(data.results || []);
      } catch {
        if (!alive) return;
        setErrorPopular("No se pudieron cargar los videojuegos populares.");
      } finally {
        if (!alive) return;
        setLoadingPopular(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      {/* HERO SLIDER */}
      {loadingHero && <Loading message="Cargando videojuegos destacados…" />}

      {errorHero && <ErrorMessage message={errorHero} />}

      {!loadingHero && !errorHero && (
        <HeroSlider items={heroGames} />
      )}

      {/* SECCIÓN PROMOCIONAL */}
      <section className="py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid gap-14 lg:grid-cols-2 items-center">
          <div>
            <p className="text-indigo-400 font-semibold uppercase tracking-wide" style={{ fontSize: 'clamp(0.75rem, 1vw, 0.875rem)' }}>
              Plataforma de videojuegos
            </p>

            <h1 className="mt-4 font-extrabold leading-tight" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Descubre, busca y explora
              <br />
              los mejores videojuegos
            </h1>

            <p className="mt-6 text-slate-300" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
              Accede a una base de datos completa de videojuegos, consulta
              valoraciones, fechas de lanzamiento y descubre títulos destacados
              de todas las plataformas.
            </p>

            <div className="mt-10">
              <Button to="/games" variant="primary">
                Explorar videojuegos
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-10">
            <ul className="space-y-5 text-slate-300">
              <li className="flex items-center gap-4">
                <Star className="w-5 h-5 text-indigo-300" />
                Videojuegos destacados y mejor valorados
              </li>
              <li className="flex items-center gap-4">
                <Search className="w-5 h-5 text-indigo-300" />
                Búsqueda rápida por nombre
              </li>
              <li className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-indigo-300" />
                Fechas de lanzamiento y puntuaciones
              </li>
              <li className="flex items-center gap-4">
                <Info className="w-5 h-5 text-indigo-300" />
                Información detallada de cada videojuego
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CARRUSEL DE POPULARES */}
      {loadingPopular && <Loading message="Cargando videojuegos populares…" />}

      {errorPopular && <ErrorMessage message={errorPopular} />}

      {!loadingPopular && !errorPopular && (
        <Carousel
          title="Videojuegos más populares"
          items={popular}
        />
      )}
    </div>
  );
}
