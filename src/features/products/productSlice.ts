import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Product } from '../../types';

interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  categories: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  sortBy: 'price-asc' | 'price-desc' | '';
}

// Fetch products and categories
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get<Product[]>('https://fakestoreapi.com/products');
  return response.data;
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async () => {
  const response = await axios.get<string[]>('https://fakestoreapi.com/products/categories');
  return response.data;
});

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  categories: [],
  status: 'idle',
  error: null,
  searchTerm: '',
  selectedCategory: '',
  sortBy: '',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      applyFilters(state);
    },
    setCategory(state, action) {
      state.selectedCategory = action.payload;
      applyFilters(state);
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
      applyFilters(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = ['all', ...action.payload];
      });
  },
});

function applyFilters(state: ProductsState) {
  let filtered = [...state.items];

  if (state.searchTerm) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  }
  if (state.selectedCategory && state.selectedCategory !== 'all') {
    filtered = filtered.filter(p => p.category === state.selectedCategory);
  }
  if (state.sortBy) {
    filtered.sort((a, b) =>
      state.sortBy === 'price-asc' ? a.price - b.price : b.price - a.price
    );
  }
  state.filteredItems = filtered;
}

export const { setSearchTerm, setCategory, setSortBy } = productsSlice.actions;
export default productsSlice.reducer;