import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Monitor,
  Tag,
  Star,
  Trophy,
  Heart,
  ExternalLink,
  Building2,
} from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import { getGameDetails } from "../services/rawg";
import { isFavorite, toggleFavorite } from "../services/favorites";

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function GameDetail() {
  const id = window.location.pathname.split("/").pop();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isFavorite(id));
  }, [id]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getGameDetails(id);
        if (!alive) return;

        setGame(data);
      } catch (e) {
        if (!alive) return;
        setError(e.message || "No se pudo cargar el videojuego.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  const genres = useMemo(() => game?.genres || [], [game]);
  const tags = useMemo(() => game?.tags || [], [game]);
  const publishers = useMemo(() => game?.publishers || [], [game]);
  const platforms = useMemo(
    () => game?.platforms || [],
    [game]
  );

  const rating = game?.rating ? game.rating.toFixed(1) : "—";
  const meta = game?.metacritic ?? "—";
  const released = game?.released || "—";

  const description = useMemo(() => {
    const raw = game?.description_raw || stripHtml(game?.description || "");
    return raw || "";
  }, [game]);

  const handleToggleFav = () => {
    const nowFav = toggleFavorite(id);
    setFav(nowFav);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Loading message="Cargando videojuego…" />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <ErrorMessage message={error || "No encontrado"} />
        <Button to="/games" className="mt-6">
          <ArrowLeft className="w-4 h-4" />
          Volver a videojuegos
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative border-b border-slate-800">
        <div className="relative w-full min-h-[62vh] overflow-hidden">
          {game.background_image && (
            <img
              src={game.background_image}
              alt={game.name}
              className="absolute inset-0 w-full h-full object-cover opacity-65"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/35" />

          <div className="relative max-w-7xl mx-auto px-4 pt-10 pb-10 min-h-[62vh]">
            {/* BACK arriba */}
            <div className="flex items-center justify-between">
              <Button to="/games" className="text-sm">
                <ArrowLeft className="w-4 h-4" />
                Volver al catálogo
              </Button>
            </div>

            {/* Contenido principal */}
            <div className="mt-10 grid gap-8 lg:grid-cols-12 items-end">
              <div className="lg:col-span-8">
                <h1 className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(2rem, 5vw, 5rem)' }}>
                  {game.name}
                </h1>

                {/* Chips */}
                <div className="mt-6 flex flex-wrap items-center gap-2" style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1.125rem)' }}>
                  <Badge icon={Calendar}>{released}</Badge>
                  <Badge icon={Star}>{rating}</Badge>
                  <Badge icon={Trophy}>Metacritic: {meta}</Badge>
                </div>

                {/* Acciones */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleToggleFav}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl border transition text-sm font-semibold ${fav
                      ? "bg-pink-500/20 border-pink-400 text-pink-300 hover:bg-pink-500/25"
                      : "bg-slate-950/40 border-slate-800 text-slate-200 hover:bg-slate-900"
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${fav ? "fill-current" : ""}`} />
                    {fav ? "En favoritos" : "Añadir a favoritos"}
                  </button>

                  {game.website && (
                    <Button href={game.website} target="_blank" rel="noreferrer" className="text-sm">
                      Web oficial
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Géneros Clickables */}
                {genres.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {genres.map((g) => (
                      <Link key={g.id} to={`/games?genres=${g.slug}`}>
                        <Badge icon={Tag} className="bg-slate-950/30 hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-colors cursor-pointer">
                          {g.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Tarjeta derecha (Plataformas) */}
              <div className="lg:col-span-4 flex lg:justify-end">
                <div className="w-full lg:w-auto rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
                  {platforms.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-indigo-300" />
                        Plataformas
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {platforms.map((p) => (
                          <Link key={p.platform.id} to={`/games?platforms=${p.platform.id}`}>
                            <span className="text-xs bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg text-slate-400 hover:text-indigo-300 hover:border-indigo-500/30 transition-colors">
                              {p.platform.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          <Card>
            <h2 className="font-bold" style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}>Descripción</h2>
            <p className="mt-4 text-slate-300 leading-relaxed whitespace-pre-line" style={{ fontSize: 'clamp(0.875rem, 1.1vw, 1.125rem)' }}>
              {description || "No hay descripción disponible para este juego."}
            </p>
          </Card>

          {/* Tags Section */}
          {tags.length > 0 && (
            <Card>
              <h2 className="text-xl font-bold mb-4">Etiquetas</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <Link key={t.id} to={`/games?tags=${t.slug}`}>
                    <span className="text-xs bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-full text-slate-400 hover:text-indigo-300 hover:border-indigo-500/30 transition-colors">
                      #{t.name}
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card>
            <h2 className="text-xl font-bold">Detalles</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Fecha</span>
                <span className="font-semibold text-slate-200">{released}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Rating</span>
                <span className="font-semibold text-slate-200">{rating}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Metacritic</span>
                <span className="font-semibold text-slate-200">{meta}</span>
              </div>
            </div>
          </Card>

          {/* Publishers Section */}
          {publishers.length > 0 && (
            <Card>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Publishers
              </h2>
              <div className="mt-4 space-y-2">
                {publishers.map((pub) => (
                  <Link
                    key={pub.id}
                    to={`/publishers/${pub.id}`}
                    className="block p-3 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-200 group-hover:text-indigo-300">{pub.name}</span>
                      <ArrowLeft className="w-4 h-4 rotate-180 text-slate-500 group-hover:text-indigo-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {game.esrb_rating?.name && (
            <Card>
              <h2 className="text-xl font-bold">Clasificación</h2>
              <p className="mt-4 text-slate-300">{game.esrb_rating.name}</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
