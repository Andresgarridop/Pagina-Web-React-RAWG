import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import GameCard from "../components/GameCard";
import GameFilters from "../components/GameFilters";
import Pagination from "../components/Pagination";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import { fetchGamesList, fetchFilterData } from "../slices/gamesThunks";

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
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { list: games, count, genres, platforms, isLoading, error } = useSelector((state) => state.games);

    const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || "";
    const ordering = searchParams.get("ordering") || "";
    const genre = searchParams.get("genres") || "";
    const platform = searchParams.get("platforms") || "";
    const tag = searchParams.get("tags") || "";
    const publisher = searchParams.get("publishers") || "";

    // Debounce del buscador
    useEffect(() => {
        const t = setTimeout(() => {
            if (searchInput.trim() !== search) {
                const newParams = new URLSearchParams(searchParams);
                if (searchInput.trim()) {
                    newParams.set("search", searchInput.trim());
                } else {
                    newParams.delete("search");
                }
                newParams.set("page", "1");
                setSearchParams(newParams);
            }
        }, 450);
        return () => clearTimeout(t);
    }, [searchInput, search, searchParams, setSearchParams]);

    // Cargar listas de filtros una vez
    useEffect(() => {
        dispatch(fetchFilterData());
    }, [dispatch]);

    // Cargar juegos cuando cambie la URL
    useEffect(() => {
        dispatch(fetchGamesList({
            page,
            pageSize: PAGE_SIZE,
            search,
            ordering,
            genres: genre,
            platforms: platform,
            tags: tag,
            publishers: publisher
        }));
    }, [dispatch, page, search, ordering, genre, platform, tag, publisher]);

    const totalPages = useMemo(() => {
        if (!count) return 1;
        return Math.max(1, Math.ceil(count / PAGE_SIZE));
    }, [count]);

    const handleParamChange = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        newParams.set("page", "1");
        setSearchParams(newParams);
    };

    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", String(newPage));
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchInput("");
        setSearchParams({});
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        {tag ? `Juegos con etiqueta: ${tag}` :
                            publisher ? `Juegos de Publisher ID: ${publisher}` :
                                "Explora Videojuegos"}
                    </h1>
                    <p className="mt-2 text-slate-400">
                        {search ? `Resultados para "${search}"` : "Descubre tu próxima aventura favorita."}
                    </p>
                </div>

                <GameFilters
                    searchInput={searchInput}
                    onSearchChange={setSearchInput}
                    ordering={ordering}
                    onOrderingChange={(v) => handleParamChange("ordering", v)}
                    genre={genre}
                    onGenreChange={(v) => handleParamChange("genres", v)}
                    platform={platform}
                    onPlatformChange={(v) => handleParamChange("platforms", v)}
                    genres={genres}
                    platforms={platforms}
                    loadingFilters={isLoading && genres.length === 0}
                    onClearFilters={clearFilters}
                    count={count}
                    currentPage={page}
                    totalPages={totalPages}
                    orderOptions={ORDER_OPTIONS}
                />

                {isLoading && games.length === 0 && <Loading message="Cargando videojuegos…" />}
                {error && <ErrorMessage message={error} />}
                {!isLoading && !error && games.length === 0 && (
                    <p className="text-slate-400">No hay resultados con esos filtros.</p>
                )}

                {!isLoading && !error && games.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {games.map((g) => (
                            <GameCard key={g.id} game={g} />
                        ))}
                    </div>
                )}

                {!isLoading && !error && count > 0 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        itemsPerPage={PAGE_SIZE}
                    />
                )}
            </div>
        </div>
    );
}
