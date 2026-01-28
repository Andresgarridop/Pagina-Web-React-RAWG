import { useEffect, useMemo, useState } from "react";
import GameCard from "../components/GameCard";
import GameFilters from "../components/GameFilters";
import Pagination from "../components/Pagination";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
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
                <GameFilters
                    searchInput={searchInput}
                    onSearchChange={(value) => {
                        setSearchInput(value);
                    }}
                    ordering={ordering}
                    onOrderingChange={(value) => {
                        setOrdering(value);
                        setPage(1);
                    }}
                    genre={genre}
                    onGenreChange={(value) => {
                        setGenre(value);
                        setPage(1);
                    }}
                    platform={platform}
                    onPlatformChange={(value) => {
                        setPlatform(value);
                        setPage(1);
                    }}
                    genres={genres}
                    platforms={platforms}
                    loadingFilters={loadingFilters}
                    onClearFilters={clearFilters}
                    count={count}
                    currentPage={page}
                    totalPages={totalPages}
                    orderOptions={ORDER_OPTIONS}
                />

                {/* Estado */}
                {loading && <Loading message="Cargando videojuegos…" />}

                {error && <ErrorMessage message={error} />}

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
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        itemsPerPage={PAGE_SIZE}
                    />
                )}
            </div>
        </div>
    );
}
