import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productSlice';
import favoritesReducer from '../features/favorites/favoriteSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;