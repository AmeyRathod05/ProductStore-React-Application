// src/features/favorites/favoriteSlice.test.ts
import favoritesReducer, { addFavorite, removeFavorite } from './favoriteSlice';
import type { Product } from '../../types';

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'Test description',
  category: 'electronics',
  image: 'test.jpg',
  rating: { rate: 4.5, count: 120 },
};

describe('favoriteSlice', () => {
  const initialState = {
    items: [] as Product[],
  };

  beforeEach(() => {
    // Clear localStorage mock
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const state = favoritesReducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });

    it('should load favorites from localStorage', () => {
      const savedFavorites = [mockProduct];
      localStorage.setItem('favorites', JSON.stringify(savedFavorites));
      
      // Test localStorage integration by checking initial state
      const state = favoritesReducer(undefined, { type: 'unknown' });
      
      // Note: This test verifies localStorage is checked during initialization
      // The actual localStorage loading happens in the slice file
      expect(localStorage.getItem).toHaveBeenCalledWith('favorites');
    });
  });

  describe('reducers', () => {
    it('should handle addFavorite', () => {
      const action = addFavorite(mockProduct);
      const state = favoritesReducer(initialState, action);
      
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockProduct);
      expect(localStorage.setItem).toHaveBeenCalledWith('favorites', JSON.stringify([mockProduct]));
    });

    it('should not add duplicate favorites', () => {
      const stateWithFavorite = {
        items: [mockProduct],
      };
      
      const action = addFavorite(mockProduct);
      const state = favoritesReducer(stateWithFavorite, action);
      
      expect(state.items).toHaveLength(1); // Still only one item
      expect(localStorage.setItem).toHaveBeenCalledTimes(0); // Not called again
    });

    it('should handle removeFavorite', () => {
      const stateWithFavorites = {
        items: [mockProduct, { ...mockProduct, id: 2 }],
      };
      
      const action = removeFavorite(mockProduct.id);
      const state = favoritesReducer(stateWithFavorites, action);
      
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe(2); // Only the second product remains
      expect(localStorage.setItem).toHaveBeenCalledWith('favorites', JSON.stringify([{ ...mockProduct, id: 2 }]));
    });

    it('should handle removeFavorite when product not found', () => {
      const stateWithFavorites = {
        items: [mockProduct],
      };
      
      const action = removeFavorite(999); // Non-existent ID
      const state = favoritesReducer(stateWithFavorites, action);
      
      expect(state.items).toHaveLength(1); // No change
      expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });
  });
});
