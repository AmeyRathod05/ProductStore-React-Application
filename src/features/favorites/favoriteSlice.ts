import { createSlice } from '@reduxjs/toolkit';
import type { Product } from '../../types';

interface FavoritesState {
  items: Product[];
}

const saved = localStorage.getItem('favorites');
const initialState: FavoritesState = {
  items: saved ? JSON.parse(saved) : [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action) {
      if (!state.items.find(p => p.id === action.payload.id)) {
        state.items.push(action.payload);
        localStorage.setItem('favorites', JSON.stringify(state.items));
      }
    },
    removeFavorite(state, action) {
      state.items = state.items.filter(p => p.id !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(state.items));
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;