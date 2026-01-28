import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import GameCard from "../components/GameCard";
import { getGamesList, getGenres, getPlatforms } from "../services/rawg";

const PAGE_SIZE = 40;

const ORDER_OPTIONS = [
    { value: "", label: "Relevancia" },
    { value: "-rating", label: "Mejor valorados" },
    { value: "-metacritic", label: "Top Metacritic" },
    { value: "-added", label: "Más populares" },
    { value: "-released", label: "Más recientes" },
    { value: "name", label: "Nombre (A-Z)" },
];

export default function Games() {
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [ordering, setOrdering] = useState("");
    const [genre, setGenre] = useState(""); // slug
    const [platform, setPlatform] = useState(""); // id
    const [page, setPage] = useState(1);

    const [games, setGames] = useState([]);
    const [count, setCount] = useState(0);

    const [genres, setGenres] = useState([]);
    const [platforms, setPlatforms] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingFilters, setLoadingFilters] = useState(true);
    const [error, setError] = useState("");

    // Debounce del buscador (para no pedir a la API en cada tecla)
    useEffect(() => {
        const t = setTimeout(() => {
            setSearch(searchInput.trim());
            setPage(1);
        }, 450);

        return () => clearTimeout(t);
    }, [searchInput]);

    // Cargar listas de filtros (géneros y plataformas) una vez
    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setLoadingFilters(true);
                const [g, p] = await Promise.all([getGenres(), getPlatforms()]);
                if (!alive) return;
                setGenres(g.results || []);
                setPlatforms(p.results || []);
            } catch {
                if (!alive) return;
                // si falla, no rompemos la página (simplemente filtros vacíos)
            } finally {
                if (!alive) return;
                setLoadingFilters(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    // Cargar juegos cuando cambie search/filters/página
    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getGamesList({
                    page,
                    pageSize: PAGE_SIZE,
                    search,
                    ordering,
                    genres: genre,
                    platforms: platform,
                });

                if (!alive) return;

                setGames(data.results || []);
                setCount(data.count || 0);
            } catch (e) {
                if (!alive) return;
                setError(e.message || "Error cargando videojuegos");
                setGames([]);
                setCount(0);
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [page, search, ordering, genre, platform]);

    const totalPages = useMemo(() => {
        if (!count) return 1;
        return Math.max(1, Math.ceil(count / PAGE_SIZE));
    }, [count]);

    const pagesToShow = useMemo(() => {
        const max = 5;
        const start = Math.max(1, page - 2);
        const end = Math.min(totalPages, start + max - 1);
        const realStart = Math.max(1, end - max + 1);

        const arr = [];
        for (let i = realStart; i <= end; i++) arr.push(i);
        return arr;
    }, [page, totalPages]);

    const clearFilters = () => {
        setSearchInput("");
        setSearch("");
        setOrdering("");
        setGenre("");
        setPlatform("");
        setPage(1);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-4xl font-extrabold">Explora Videojuegos</h1>
                    <p className="mt-2 text-slate-400">
                      Desde clásicos legendarios hasta los lanzamientos más recientes, todo en un solo lugar.
                    </p>

                </div>

                {/* Barra de búsqueda + filtros */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-5">
                    <div className="grid gap-4 lg:grid-cols-12 items-center">
                        <div className="lg:col-span-6">
                            <label className="text-sm text-slate-300">Buscar por nombre</label>
                            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2">
                                <Search className="w-5 h-5 text-slate-400" />
                                <input
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Ej: The Witcher, GTA, Zelda…"
                                    className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <label className="text-sm text-slate-300">Ordenar</label>
                            <select
                                value={ordering}
                                onChange={(e) => {
                                    setOrdering(e.target.value);
                                    setPage(1);
                                }}
                                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none"
                            >
                                {ORDER_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="lg:col-span-2">
                            <label className="text-sm text-slate-300">Género</label>
                            <select
                                value={genre}
                                onChange={(e) => {
                                    setGenre(e.target.value);
                                    setPage(1);
                                }}
                                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none"
                                disabled={loadingFilters}
                            >
                                <option value="">Todos</option>
                                {genres.map((g) => (
                                    <option key={g.id} value={g.slug}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="lg:col-span-2">
                            <label className="text-sm text-slate-300">Plataforma</label>
                            <select
                                value={platform}
                                onChange={(e) => {
                                    setPlatform(e.target.value);
                                    setPage(1);
                                }}
                                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none"
                                disabled={loadingFilters}
                            >
                                <option value="">Todas</option>
                                {platforms.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900 transition text-sm font-semibold"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-indigo-300" />
                            Limpiar filtros
                        </button>

                        <div className="text-sm text-slate-400">
                            {count ? (
                                <>
                                    Mostrando página <span className="text-slate-200 font-semibold">{page}</span> de{" "}
                                    <span className="text-slate-200 font-semibold">{totalPages}</span> —{" "}
                                    <span className="text-slate-200 font-semibold">{count}</span> resultados
                                </>
                            ) : (
                                "—"
                            )}
                        </div>
                    </div>
                </div>

                {/* Estado */}
                {loading && (
                    <p className="text-slate-400">Cargando videojuegos…</p>
                )}

                {error && (
                    <p className="text-red-400">{error}</p>
                )}

                {!loading && !error && games.length === 0 && (
                    <p className="text-slate-400">No hay resultados con esos filtros.</p>
                )}

                {/* Grid */}
                {!loading && !error && games.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {games.map((g) => (
                            <GameCard key={g.id} game={g} />
                        ))}
                    </div>
                )}

                {/* Paginación */}
                {!loading && !error && count > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                        <div className="text-sm text-slate-400">
                            {PAGE_SIZE} juegos por página
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="px-4 py-2 rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900 transition text-sm font-semibold disabled:opacity-40 disabled:hover:bg-slate-950/40"
                            >
                                Anterior
                            </button>

                            {pagesToShow[0] > 1 && (
                                <>
                                    <button
                                        onClick={() => setPage(1)}
                                        className="px-4 py-2 rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900 transition text-sm font-semibold"
                                    >
                                        1
                                    </button>
                                    <span className="px-2 text-slate-500">…</span>
                                </>
                            )}

                            {pagesToShow.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-4 py-2 rounded-2xl border text-sm font-semibold transition ${p === page
                                            ? "bg-indigo-500 border-indigo-400 text-slate-950"
                                            : "border-slate-800 bg-slate-950/40 hover:bg-slate-900 text-slate-100"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}

                            {pagesToShow[pagesToShow.length - 1] < totalPages && (
                                <>
                                    <span className="px-2 text-slate-500">…</span>
                                    <button
                                        onClick={() => setPage(totalPages)}
                                        className="px-4 py-2 rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900 transition text-sm font-semibold"
                                    >
                                        {totalPages}
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="px-4 py-2 rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900 transition text-sm font-semibold disabled:opacity-40 disabled:hover:bg-slate-950/40"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
