// src/features/products/productSlice.simple.test.ts
import productsReducer, {
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

describe('productSlice - Basic Tests', () => {
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

  it('should return initial state', () => {
    const state = productsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

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
});
