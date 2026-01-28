export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
}) {
    // Lógica para mostrar páginas (máximo 5)
    const pagesToShow = (() => {
        const max = 5;
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, start + max - 1);
        const realStart = Math.max(1, end - max + 1);

        const arr = [];
        for (let i = realStart; i <= end; i++) arr.push(i);
        return arr;
    })();

    return (
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="text-sm text-slate-400">
                {itemsPerPage} juegos por página
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900 transition text-sm font-semibold disabled:opacity-40 disabled:hover:bg-slate-950/40"
                >
                    Anterior
                </button>

                {pagesToShow[0] > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
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
                        onClick={() => onPageChange(p)}
                        className={`px-4 py-2 rounded-2xl border text-sm font-semibold transition ${p === currentPage
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
                            onClick={() => onPageChange(totalPages)}
                            className="px-4 py-2 rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900 transition text-sm font-semibold"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 rounded-2xl border border-slate-800 bg-slate-950/40 hover:bg-slate-900 transition text-sm font-semibold disabled:opacity-40 disabled:hover:bg-slate-950/40"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
