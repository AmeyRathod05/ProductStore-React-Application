import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import productsReducer from '../features/products/productSlice';
import favoritesReducer from '../features/favorites/favoriteSlice';
import { usersApi } from '../features/users/api/usersApi';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    favorites: favoritesReducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore these action types
          'persist/PERSIST',
          'persist/REHYDRATE',
          // RTK Query actions
          'usersApi/executeQuery/pending',
          'usersApi/executeQuery/fulfilled',
          'usersApi/executeQuery/rejected',
          'usersApi/executeMutation/pending',
          'usersApi/executeMutation/fulfilled',
          'usersApi/executeMutation/rejected',
        ],
      },
    }).concat(usersApi.middleware),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;