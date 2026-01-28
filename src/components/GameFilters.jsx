import { Search, SlidersHorizontal } from "lucide-react";

export default function GameFilters({
    searchInput,
    onSearchChange,
    ordering,
    onOrderingChange,
    genre,
    onGenreChange,
    platform,
    onPlatformChange,
    genres,
    platforms,
    loadingFilters,
    onClearFilters,
    count,
    currentPage,
    totalPages,
    orderOptions,
}) {
    return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-5">
            <div className="grid gap-4 lg:grid-cols-12 items-center">
                <div className="lg:col-span-6">
                    <label className="text-sm text-slate-300">Buscar por nombre</label>
                    <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            value={searchInput}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Ej: The Witcher, GTA, Zelda…"
                            className="w-full bg-transparent outline-none text-slate-100 placeholder:text-slate-500"
                        />
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <label className="text-sm text-slate-300">Ordenar</label>
                    <select
                        value={ordering}
                        onChange={(e) => onOrderingChange(e.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-slate-100 outline-none"
                    >
                        {orderOptions.map((o) => (
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
                        onChange={(e) => onGenreChange(e.target.value)}
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
                        onChange={(e) => onPlatformChange(e.target.value)}
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
                    onClick={onClearFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900 transition text-sm font-semibold"
                >
                    <SlidersHorizontal className="w-4 h-4 text-indigo-300" />
                    Limpiar filtros
                </button>

                <div className="text-sm text-slate-400">
                    {count ? (
                        <>
                            Mostrando página <span className="text-slate-200 font-semibold">{currentPage}</span> de{" "}
                            <span className="text-slate-200 font-semibold">{totalPages}</span> —{" "}
                            <span className="text-slate-200 font-semibold">{count}</span> resultados
                        </>
                    ) : (
                        "—"
                    )}
                </div>
            </div>
        </div>
    );
}
