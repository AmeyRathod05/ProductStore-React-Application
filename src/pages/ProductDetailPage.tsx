// src/pages/ProductDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../features/favorites/favoriteSlice';
import type { Product } from '../types';
import type { RootState } from '../app/store';
import axios from 'axios';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFavorite = product ? favorites.some((p) => p.id === product.id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(`https://fakestoreapi.com/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleToggleFavorite = () => {
    if (product) {
      if (isFavorite) {
        dispatch(removeFavorite(product.id));
      } else {
        dispatch(addFavorite(product));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 backdrop-blur-sm bg-white/20"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-b-purple-600 animate-reverse"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-2xl p-12 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error || 'Product not found'}</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 text-blue-600 rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 transition-all hover:scale-105"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 bg-slate-800/40 backdrop-blur-xl border border-white/20 text-cyan-400 hover:text-cyan-300 mb-6 hover:scale-105 transition-all rounded-xl shadow-lg hover:shadow-xl"
      >
        ← Back to Products
      </Link>

      <div className="backdrop-blur-xl bg-slate-800/30 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Product Image */}
          <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain p-8"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{product.title}</h1>
            
            <div className="flex items-center mb-4">
              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">${product.price}</span>
              <div className="ml-4 flex items-center">
                <span className="text-yellow-400 text-xl">⭐</span>
                <span className="ml-1 text-gray-300">
                  {product.rating.rate} ({product.rating.count} reviews)
                </span>
              </div>
            </div>

            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 text-gray-200 rounded-full text-sm shadow-lg hover:shadow-xl">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </span>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed text-lg backdrop-blur-sm bg-slate-800/20 p-4 rounded-xl">{product.description}</p>

            <button
              onClick={handleToggleFavorite}
              className={`py-4 px-6 rounded-2xl font-medium transition-all duration-300 backdrop-blur-xl border hover:scale-105 shadow-lg hover:shadow-xl ${
                isFavorite
                  ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 hover:from-red-500/40 hover:to-pink-500/40 border-white/20 shadow-red-500/20'
                  : 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 hover:from-cyan-500/40 hover:to-purple-500/40 border-white/20 shadow-cyan-500/20'
              }`}
            >
              {isFavorite ? 'Remove from Favorites ❤️' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
