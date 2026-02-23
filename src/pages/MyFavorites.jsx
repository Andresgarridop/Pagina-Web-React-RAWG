import React from 'react';
import { useSelector } from 'react-redux';
import GameCard from '../components/GameCard';
import { Heart } from 'lucide-react';

export default function MyFavorites() {
    const { favorites } = useSelector((state) => state.games);

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-12 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-500/30 grid place-items-center">
                    <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                        Mis Favoritos
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Tu colección personal de videojuegos guardados.
                    </p>
                </div>
            </div>

            {favorites.length === 0 ? (
                <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-20 text-center">
                    <p className="text-slate-500 text-lg">Aún no has añadido ningún favorito.</p>
                    <p className="text-slate-600 text-sm mt-2">¡Explora el catálogo y marca los que más te gusten!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {favorites.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>
            )}
        </div>
    );
}
