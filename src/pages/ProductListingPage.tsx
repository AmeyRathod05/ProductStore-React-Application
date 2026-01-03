// src/pages/ProductListingPage.tsx
import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce'; 
import {
  fetchProducts,
  fetchCategories,
  setSearchTerm,
  setCategory,
  setSortBy,
} from '../features/products/productSlice';
import type { RootState, AppDispatch } from '../app/store';
import ProductCard from '../components/ProductCard';

export default function ProductListingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { filteredItems, categories, status } = useSelector((state: RootState) => state.products);

  const [searchInput, setSearchInput] = useState('');

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      dispatch(setSearchTerm(term));
    }, 400),
    [dispatch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 backdrop-blur-sm bg-white/20"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-b-purple-600 animate-reverse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Products</h1>

      {/* Controls */}
      <div className="backdrop-blur-xl bg-slate-800/30 border border-white/10 rounded-2xl p-6 mb-8 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchInput}
            onChange={handleSearchChange}
            className="px-4 py-3 bg-slate-800/40 backdrop-blur-xl border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-slate-700/50 transition-all flex-1 placeholder-gray-400 text-white shadow-lg hover:shadow-xl"
            aria-label="Search products"
          />

          <select
            onChange={(e) => dispatch(setCategory(e.target.value))}
            className="px-4 py-3 bg-slate-800/40 backdrop-blur-xl border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-slate-700/50 transition-all text-white shadow-lg hover:shadow-xl"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => dispatch(setSortBy(e.target.value as 'price-asc' | 'price-desc' | ''))}
            className="px-4 py-3 bg-slate-800/40 backdrop-blur-xl border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-slate-700/50 transition-all text-white shadow-lg hover:shadow-xl"
            aria-label="Sort by price"
          >
            <option value="">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredItems.length === 0 ? (
        <div className="backdrop-blur-xl bg-slate-800/30 border border-white/10 rounded-2xl p-12 text-center shadow-2xl">
          <p className="text-gray-300 text-lg">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}