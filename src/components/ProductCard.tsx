// src/components/ProductCard.tsx
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite } from '../features/favorites/favoriteSlice';
import type { Product } from '../types';
import type { RootState } from '../app/store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some((p) => p.id === product.id);

  const handleAddFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addFavorite(product));
  };

  return (
    <div className="group backdrop-blur-xl bg-slate-800/30 border border-white/10 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden hover:scale-105 hover:bg-slate-700/40">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-4 backdrop-blur-sm bg-slate-800/20">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 text-white group-hover:text-cyan-400 transition-colors">{product.title}</h3>
          <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">${product.price}</p>
          <div className="flex items-center mt-2 text-sm text-gray-300">
            <span className="text-yellow-400">⭐</span>
            <span className="ml-1">{product.rating.rate}</span>
            <span className="ml-2 text-gray-400">({product.rating.count} reviews)</span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 backdrop-blur-sm bg-slate-800/10">
        <button
          onClick={handleAddFavorite}
          disabled={isFavorite}
          className={`w-full py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-xl border shadow-lg hover:shadow-xl ${
            isFavorite
              ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed border-gray-600/50 shadow-gray-600/20'
              : 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 hover:from-cyan-500/40 hover:to-purple-500/40 border-white/20 hover:scale-105 shadow-cyan-500/20'
          }`}
          aria-label={isFavorite ? 'Already in favorites' : 'Add to favorites'}
        >
          {isFavorite ? 'Added to Favorites ❤️' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
}