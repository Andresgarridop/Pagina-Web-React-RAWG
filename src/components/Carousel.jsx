import { useRef } from "react";
import GameCard from "./GameCard";

export default function Carousel({ title, items }) {
    const ref = useRef(null);

    const scrollBy = (px) => {
        if (!ref.current) return;
        ref.current.scrollBy({ left: px, behavior: "smooth" });
    };

    return (
        <section className="py-10">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold">{title}</h2>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => scrollBy(-520)}
                            className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 transition"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => scrollBy(520)}
                            className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 transition"
                        >
                            →
                        </button>
                    </div>
                </div>

                <div
                    ref={ref}
                    className="mt-4 flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar"
                    style={{ scrollSnapType: "x mandatory" }}
                >
                    {items?.map((g) => (
                        <div key={g.id} className="min-w-[260px] max-w-[260px]" style={{ scrollSnapAlign: "start" }}>
                            <GameCard game={g} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
