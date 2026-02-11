import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { Building2, Search, ArrowRight, Gamepad2 } from "lucide-react";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import Pagination from "../components/Pagination";
import { getPublishersList } from "../services/rawg";

const PAGE_SIZE = 20;

export default function Publishers() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || "";

    const [publishers, setPublishers] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getPublishersList({
                    page,
                    pageSize: PAGE_SIZE,
                    search
                });
                if (!alive) return;
                setPublishers(data.results || []);
                setCount(data.count || 0);
            } catch (e) {
                if (!alive) return;
                setError(e.message || "Error cargando publishers");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [page, search]);

    const totalPages = useMemo(() => Math.max(1, Math.ceil(count / PAGE_SIZE)), [count]);

    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", String(newPage));
        setSearchParams(newParams);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-4xl font-extrabold flex items-center gap-3">
                        <Building2 className="w-10 h-10 text-indigo-400" />
                        Desarrolladoras
                    </h1>
                    <p className="mt-2 text-slate-400">
                        Encuentra a las compañías que hacen posibles tus juegos favoritos.
                    </p>
                </div>

                {/* Buscador */}
                <div className="relative max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar publisher..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>

                {loading && <Loading message="Cargando compañias…" />}
                {error && <ErrorMessage message={error} />}

                {!loading && !error && publishers.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-slate-400 text-lg">No se encontraron publishers con ese nombre.</p>
                    </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {!loading && !error && publishers.map((pub) => (
                        <Link
                            key={pub.id}
                            to={`/publishers/${pub.id}`}
                            className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 transition-all p-6 flex flex-col justify-between min-h-[160px]"
                        >
                            {pub.image_background && (
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={pub.image_background}
                                        alt=""
                                        className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                                </div>
                            )}

                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                                        {pub.name}
                                    </h3>
                                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                                        <Gamepad2 className="w-4 h-4" />
                                        <span>{pub.games_count} videojuegos</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Ver detalles</span>
                                    <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {!loading && !error && count > 0 && (
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
