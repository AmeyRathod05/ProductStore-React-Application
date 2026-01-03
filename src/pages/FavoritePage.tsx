// src/pages/FavoritePage.tsx
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeFavorite } from '../features/favorites/favoriteSlice';
import type { RootState } from '../app/store';
import ProductCard from '../components/ProductCard';

export default function FavoritesPage() {
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const dispatch = useDispatch();

  const handleRemoveFavorite = (productId: number) => {
    dispatch(removeFavorite(productId));
  };

  if (favorites.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="backdrop-blur-xl bg-slate-800/30 border border-white/10 rounded-3xl p-16 text-center shadow-2xl">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Your Favorites</h1>
          <p className="text-gray-300 mb-8 text-lg">You haven't added any products to your favorites yet.</p>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 text-cyan-300 rounded-xl hover:from-cyan-500/40 hover:to-purple-500/40 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Your Favorites ({favorites.length})</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
            <button
              onClick={() => handleRemoveFavorite(product.id)}
              className="absolute top-3 right-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 text-red-400 rounded-full w-10 h-10 flex items-center justify-center hover:from-red-500/40 hover:to-pink-500/40 transition-all hover:scale-110 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-xl shadow-red-500/20"
              aria-label="Remove from favorites"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
