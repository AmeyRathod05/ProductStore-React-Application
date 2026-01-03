// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import FavoritesPage from './pages/FavoritePage';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/40 border border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link 
            to="/" 
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent hover:from-cyan-300 hover:to-purple-300 transition-all"
          >
            ProductHub
          </Link>
          <nav className="flex gap-6">
            <Link 
              to="/" 
              className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all backdrop-blur-sm border border-transparent hover:border-white/20"
            >
              Products
            </Link>
            <Link 
              to="/favorites" 
              className="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all backdrop-blur-sm border border-transparent hover:border-white/20"
            >
              Favorites ❤️
            </Link>
          </nav>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <Header />
      <main className="relative">
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </main>
    </div>
  );
}