import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Building2, Gamepad2, Globe, ExternalLink } from "lucide-react";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import GameCard from "../components/GameCard";
import { getPublisherDetails, getGamesList } from "../services/rawg";

export default function PublisherDetail() {
    const { id } = useParams();
    const [publisher, setPublisher] = useState(null);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    function stripHtml(html = "") {
        return html.replace(/<[^>]*>/g, "").trim();
    }

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                setError("");

                const [pubData, gamesData] = await Promise.all([
                    getPublisherDetails(id),
                    getGamesList({ publishers: id, pageSize: 8, ordering: "-added" })
                ]);

                if (!alive) return;
                setPublisher(pubData);
                setGames(gamesData.results || []);
            } catch (e) {
                if (!alive) return;
                setError(e.message || "Error cargando detalles del publisher");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [id]);

    if (loading) return <div className="max-w-6xl mx-auto px-4 py-20"><Loading message="Cargando información del publisher..." /></div>;
    if (error || !publisher) return <div className="max-w-6xl mx-auto px-4 py-20"><ErrorMessage message={error || "Publisher no encontrado"} /><Button to="/publishers" className="mt-6"><ArrowLeft className="w-4 h-4" /> Volver</Button></div>;

    const description = stripHtml(publisher.description || "");

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <Button to="/publishers" className="mb-8">
                <ArrowLeft className="w-4 h-4" />
                Volver a publishers
            </Button>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Lado Izquierdo: Info del Publisher */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Building2 className="w-24 h-24 -mr-6 -mt-6" />
                        </div>

                        <h1 className="text-3xl font-bold text-slate-100">{publisher.name}</h1>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center gap-3 text-slate-300">
                                <Gamepad2 className="w-5 h-5 text-indigo-400" />
                                <span>{publisher.games_count} videojuegos publicados</span>
                            </div>

                            {publisher.website && (
                                <a
                                    href={publisher.website}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    <Globe className="w-5 h-5" />
                                    <span>Sitio web oficial</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>

                        <Link
                            to={`/games?publishers=${publisher.id}`}
                            className="mt-8 block w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-center font-bold transition-all"
                        >
                            Ver todos sus juegos
                        </Link>
                    </div>

                    <Card>
                        <h2 className="text-xl font-bold mb-4">Acerca de</h2>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            {description || "No hay descripción detallada disponible para este publisher."}
                        </p>
                    </Card>
                </div>

                {/* Lado Derecho: Juegos Destacados */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
                        Videojuegos populares
                        <Link to={`/games?publishers=${publisher.id}`} className="text-sm font-normal text-indigo-400 hover:underline">Ver más</Link>
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {games.map((g) => (
                            <GameCard key={g.id} game={g} />
                        ))}
                    </div>

                    {games.length === 0 && (
                        <p className="text-slate-500 py-10 text-center border border-dashed border-slate-800 rounded-3xl">
                            No se encontraron videojuegos populares para este publisher.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
