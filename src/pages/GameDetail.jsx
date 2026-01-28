import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Monitor,
  Tag,
  Star,
  Trophy,
  Heart,
  ExternalLink,
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

  const genres = useMemo(() => game?.genres?.map((g) => g.name) || [], [game]);
  const platforms = useMemo(
    () => game?.platforms?.map((p) => p.platform?.name).filter(Boolean) || [],
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

          <div className="relative max-w-6xl mx-auto px-4 pt-10 pb-10 min-h-[62vh]">
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
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                  {game.name}
                </h1>

                {/* Chips */}
                <div className="mt-6 flex flex-wrap items-center gap-2 text-sm sm:text-base">
                  <Badge icon={Calendar}>{released}</Badge>
                  <Badge icon={Star}>{rating}</Badge>
                  <Badge icon={Trophy}>Metacritic: {meta}</Badge>
                </div>

                {/* Acciones (aquí encaja perfecto favoritos) */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleToggleFav}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl border transition text-sm font-semibold ${fav
                      ? "bg-pink-500/20 border-pink-400 text-pink-300 hover:bg-pink-500/25"
                      : "bg-slate-950/40 border-slate-800 text-slate-200 hover:bg-slate-900"
                      }`}
                    aria-label={fav ? "Quitar de favoritos" : "Añadir a favoritos"}
                    title={fav ? "Quitar de favoritos" : "Añadir a favoritos"}
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

                {/* Géneros */}
                {genres.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {genres.map((g) => (
                      <Badge key={g} icon={Tag} className="bg-slate-950/30">
                        {g}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Tarjeta derecha */}
              <div className="lg:col-span-4 flex lg:justify-end">
                <div className="w-full lg:w-auto rounded-3xl border border-slate-800 bg-slate-950/40 p-6">
                  {platforms.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-indigo-300" />
                        Plataformas
                      </p>
                      <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                        {platforms.slice(0, 14).join(" · ")}
                        {platforms.length > 14 ? " · …" : ""}
                      </p>
                    </div>
                  )}

                  {!game.website && (
                    <p className="mt-4 text-sm text-slate-500">
                      Este título no tiene web oficial disponible.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Card>
            <h2 className="text-xl font-bold">Descripción</h2>
            <p className="mt-4 text-slate-300 leading-relaxed whitespace-pre-line">
              {description || "No hay descripción disponible para este juego."}
            </p>
          </Card>
        </div>

        <div className="lg:col-span-4">
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

              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Actualizado</span>
                <span className="font-semibold text-slate-200">
                  {game.updated ? game.updated.slice(0, 10) : "—"}
                </span>
              </div>
            </div>
          </Card>

          {game.esrb_rating?.name && (
            <Card className="mt-6">
              <h2 className="text-xl font-bold">Clasificación</h2>
              <p className="mt-4 text-slate-300">{game.esrb_rating.name}</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
