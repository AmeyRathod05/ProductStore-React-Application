// src/features/products/productSlice.test.ts
import productsReducer, {
  fetchProducts,
  fetchCategories,
  setSearchTerm,
  setCategory,
  setSortBy,
} from './productSlice';
import type { Product } from '../../types';

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Product 1',
    price: 29.99,
    description: 'Test description 1',
    category: 'electronics',
    image: 'test1.jpg',
    rating: { rate: 4.5, count: 120 },
  },
  {
    id: 2,
    title: 'Test Product 2',
    price: 19.99,
    description: 'Test description 2',
    category: 'clothing',
    image: 'test2.jpg',
    rating: { rate: 3.8, count: 89 },
  },
];

describe('productSlice', () => {
  const initialState = {
    items: [] as Product[],
    filteredItems: [] as Product[],
    categories: [] as string[],
    status: 'idle' as const,
    error: null as string | null,
    searchTerm: '',
    selectedCategory: '',
    sortBy: '' as 'price-asc' | 'price-desc' | '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      const state = productsReducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    it('should handle setSearchTerm', () => {
      const stateWithProducts = {
        ...initialState,
        items: mockProducts,
        filteredItems: mockProducts,
      };
      
      const action = setSearchTerm('Test Product 1');
      const state = productsReducer(stateWithProducts, action);
      
      expect(state.searchTerm).toBe('Test Product 1');
      expect(state.filteredItems).toHaveLength(1);
      expect(state.filteredItems[0].title).toBe('Test Product 1');
    });

    it('should handle setCategory', () => {
      const stateWithProducts = {
        ...initialState,
        items: mockProducts,
        filteredItems: mockProducts,
      };
      
      const action = setCategory('electronics');
      const state = productsReducer(stateWithProducts, action);
      
      expect(state.selectedCategory).toBe('electronics');
      expect(state.filteredItems).toHaveLength(1);
      expect(state.filteredItems[0].category).toBe('electronics');
    });

    it('should handle setSortBy price ascending', () => {
      const stateWithProducts = {
        ...initialState,
        items: mockProducts,
        filteredItems: mockProducts,
      };
      
      const action = setSortBy('price-asc');
      const state = productsReducer(stateWithProducts, action);
      
      expect(state.sortBy).toBe('price-asc');
      expect(state.filteredItems[0].price).toBe(19.99); // Lower price first
      expect(state.filteredItems[1].price).toBe(29.99);
    });

    it('should handle setSortBy price descending', () => {
      const stateWithProducts = {
        ...initialState,
        items: mockProducts,
        filteredItems: mockProducts,
      };
      
      const action = setSortBy('price-desc');
      const state = productsReducer(stateWithProducts, action);
      
      expect(state.sortBy).toBe('price-desc');
      expect(state.filteredItems[0].price).toBe(29.99); // Higher price first
      expect(state.filteredItems[1].price).toBe(19.99);
    });

    it('should apply multiple filters together', () => {
      const stateWithProducts = {
        ...initialState,
        items: mockProducts,
        filteredItems: mockProducts,
      };
      
      // Apply search first
      let state = productsReducer(stateWithProducts, setSearchTerm('Test'));
      // Then apply category filter
      state = productsReducer(state, setCategory('electronics'));
      
      expect(state.filteredItems).toHaveLength(1);
      expect(state.filteredItems[0].title).toBe('Test Product 1');
      expect(state.filteredItems[0].category).toBe('electronics');
    });
  });

  describe('extraReducers', () => {
    it('should handle fetchProducts.pending', () => {
      const action = { type: fetchProducts.pending.type };
      const state = productsReducer(initialState, action);
      
      expect(state.status).toBe('loading');
    });

    it('should handle fetchProducts.fulfilled', () => {
      const action = { type: fetchProducts.fulfilled.type, payload: mockProducts };
      const state = productsReducer(initialState, action);
      
      expect(state.status).toBe('succeeded');
      expect(state.items).toEqual(mockProducts);
      expect(state.filteredItems).toEqual(mockProducts);
    });

    it('should handle fetchCategories.fulfilled', () => {
      const mockCategories = ['electronics', 'clothing', 'jewelry'];
      const action = { type: fetchCategories.fulfilled.type, payload: mockCategories };
      const state = productsReducer(initialState, action);
      
      expect(state.categories).toEqual(['all', ...mockCategories]);
    });
  });
});
