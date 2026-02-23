import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, Search, Calendar, Info } from "lucide-react";

import Carousel from "../components/Carousel";
import HeroSlider from "../components/HeroSlider";
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import { fetchPopularGames, fetchTopMetacriticGames } from "../slices/gamesThunks";

export default function Home() {
  const dispatch = useDispatch();
  const { popular, metacritic, isLoading, error } = useSelector((state) => state.games);

  useEffect(() => {
    dispatch(fetchTopMetacriticGames({ pageSize: 8 }));
    dispatch(fetchPopularGames({ pageSize: 12 }));
  }, [dispatch]);

  return (
    <div>
      {/* HERO SLIDER */}
      {isLoading && metacritic.length === 0 && <Loading message="Cargando videojuegos destacados…" />}

      {error && <ErrorMessage message={error} />}

      {metacritic.length > 0 && (
        <HeroSlider items={metacritic} />
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
      {isLoading && popular.length === 0 && <Loading message="Cargando videojuegos populares…" />}

      {popular.length > 0 && (
        <Carousel
          title="Videojuegos más populares"
          items={popular}
        />
      )}
    </div>
  );
}
