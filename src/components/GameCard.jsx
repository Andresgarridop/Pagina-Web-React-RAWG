import { Link } from "react-router-dom";

export default function GameCard({ game }) {
  const image = game?.background_image;

  return (
    <Link
      to={`/games/${game.id}`}
      className="group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40 hover:bg-slate-900 transition"
    >
      <div className="aspect-[16/10] bg-slate-900">
        {image ? (
          <img
            src={image}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-slate-500">
            Sin imagen
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold leading-tight">{game.name}</h3>

        <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
          <span className="text-slate-400">{game.released || "Sin fecha"}</span>
          <span className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700">
            ⭐ {game.rating?.toFixed?.(1) ?? game.rating ?? "—"}
          </span>
        </div>
      </div>
    </Link>
  );
}
