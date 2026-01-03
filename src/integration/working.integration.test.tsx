// src/integration/working.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ProductListingPage from '../pages/ProductListingPage';
import productsReducer from '../features/products/productSlice';
import favoritesReducer from '../features/favorites/favoriteSlice';
import type { Product } from '../types';

// Mock axios
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Wireless Headphones',
    price: 99.99,
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'electronics',
    image: 'headphones.jpg',
    rating: { rate: 4.5, count: 120 },
  },
  {
    id: 2,
    title: 'Cotton T-Shirt',
    price: 29.99,
    description: 'Comfortable cotton t-shirt for everyday wear',
    category: 'clothing',
    image: 'tshirt.jpg',
    rating: { rate: 3.8, count: 89 },
  },
];

const createTestStore = () => {
  return configureStore({
    reducer: {
      products: productsReducer,
      favorites: favoritesReducer,
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </Provider>
  );
};

describe('Working Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // Reset axios mocks
    mockedAxios.get = jest.fn();
    mockedAxios.get.mockClear();
  });

  describe('Search Integration', () => {
    it('should search products and update UI', async () => {
      // Mock successful API calls
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderWithProviders(<ProductListingPage />);

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.getByText('Cotton T-Shirt')).toBeInTheDocument();
      });

      // Test search
      const searchInput = screen.getByPlaceholderText('Search by title...');
      fireEvent.change(searchInput, { target: { value: 'Wireless' } });

      // Should filter results
      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.queryByText('Cotton T-Shirt')).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('should show no results for non-matching search', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderWithProviders(<ProductListingPage />);

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });

      // Search for non-existent product
      const searchInput = screen.getByPlaceholderText('Search by title...');
      fireEvent.change(searchInput, { target: { value: 'NonExistent' } });

      await waitFor(() => {
        expect(screen.getByText('No products found.')).toBeInTheDocument();
      });
    });
  });

  describe('Category Filter Integration', () => {
    it('should filter by category', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderWithProviders(<ProductListingPage />);

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.getByText('Cotton T-Shirt')).toBeInTheDocument();
      });

      // Filter by electronics
      const categorySelect = screen.getByDisplayValue('All Categories');
      fireEvent.change(categorySelect, { target: { value: 'electronics' } });

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.queryByText('Cotton T-Shirt')).not.toBeInTheDocument();
      });
    });
  });

  describe('Favorites Integration', () => {
    it('should add product to favorites', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderWithProviders(<ProductListingPage />);

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });

      // Add to favorites
      const favoriteButtons = screen.getAllByText('Add to Favorites');
      fireEvent.click(favoriteButtons[0]);

      // Button should change state
      await waitFor(() => {
        expect(screen.getByText('Added to Favorites ❤️')).toBeInTheDocument();
      });

      // Check localStorage was called
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should prevent duplicate favorites', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderWithProviders(<ProductListingPage />);

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });

      // Add to favorites
      const favoriteButtons = screen.getAllByText('Add to Favorites');
      fireEvent.click(favoriteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Added to Favorites ❤️')).toBeInTheDocument();
      });

      // Try to add again
      fireEvent.click(screen.getByText('Added to Favorites ❤️'));

      // Should still only have one favorite
      expect(screen.getAllByText('Added to Favorites ❤️')).toHaveLength(1);
    });
  });

  describe('Combined Filters Integration', () => {
    it('should combine search and category filters', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderWithProviders(<ProductListingPage />);

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });

      // Apply category filter
      const categorySelect = screen.getByDisplayValue('All Categories');
      fireEvent.change(categorySelect, { target: { value: 'electronics' } });

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.queryByText('Cotton T-Shirt')).not.toBeInTheDocument();
      });

      // Apply search
      const searchInput = screen.getByPlaceholderText('Search by title...');
      fireEvent.change(searchInput, { target: { value: 'Wireless' } });

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });
    });
  });

  describe('Price Sorting Integration', () => {
    it('should sort products by price ascending', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderWithProviders(<ProductListingPage />);

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });

      // Sort by price ascending
      const sortSelect = screen.getByDisplayValue('Default');
      fireEvent.change(sortSelect, { target: { value: 'price-asc' } });

      await waitFor(() => {
        const prices = screen.getAllByText(/\$\d+\.\d+/);
        // Cotton T-Shirt ($29.99) should come first
        expect(prices[0]).toHaveTextContent('29.99');
      });
    });
  });

  describe('UI States Integration', () => {
    it('should render product grid correctly', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderWithProviders(<ProductListingPage />);

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });

      // Should render product cards
      const productCards = screen.getAllByRole('link');
      expect(productCards).toHaveLength(2);

      // Each card should have required elements
      productCards.forEach((card) => {
        expect(card).toBeInTheDocument();
        expect(card.querySelector('img')).toBeInTheDocument();
      });
    });

    it('should show loading state', async () => {
      // Mock never-resolving promise for loading state
      mockedAxios.get.mockReturnValueOnce(new Promise(() => {}));

      renderWithProviders(<ProductListingPage />);

      // Should show loading spinner (check for spinning div)
      const loadingSpinner = document.querySelector('.animate-spin');
      expect(loadingSpinner).toBeInTheDocument();
    });
  });

  describe('End-to-End User Flow', () => {
    it('should complete full user journey: search -> filter -> favorite', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderWithProviders(<ProductListingPage />);

      // 1. User sees all products
      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.getByText('Cotton T-Shirt')).toBeInTheDocument();
      });

      // 2. User searches for "Wireless"
      const searchInput = screen.getByPlaceholderText('Search by title...');
      fireEvent.change(searchInput, { target: { value: 'Wireless' } });

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.queryByText('Cotton T-Shirt')).not.toBeInTheDocument();
      });

      // 3. User clears search
      fireEvent.change(searchInput, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.getByText('Cotton T-Shirt')).toBeInTheDocument();
      });

      // 4. User filters by electronics
      const categorySelect = screen.getByDisplayValue('All Categories');
      fireEvent.change(categorySelect, { target: { value: 'electronics' } });

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.queryByText('Cotton T-Shirt')).not.toBeInTheDocument();
      });

      // 5. User adds to favorites
      const favoriteButtons = screen.getAllByText('Add to Favorites');
      fireEvent.click(favoriteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Added to Favorites ❤️')).toBeInTheDocument();
      });

      // 6. User removes from favorites
      fireEvent.click(screen.getByText('Added to Favorites ❤️'));

      await waitFor(() => {
        expect(screen.getByText('Add to Favorites')).toBeInTheDocument();
      });
    });
  });
});
