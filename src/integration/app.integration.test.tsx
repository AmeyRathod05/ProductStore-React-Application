// src/integration/app.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../App';
import productsReducer from '../features/products/productSlice';
import favoritesReducer from '../features/favorites/favoriteSlice';
import type { Product } from '../types';

// Mock axios
jest.mock('axios');
const mockedAxios = jest.requireActual('axios');

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
  {
    id: 3,
    title: 'Laptop Stand',
    price: 49.99,
    description: 'Adjustable laptop stand for better ergonomics',
    category: 'electronics',
    image: 'stand.jpg',
    rating: { rate: 4.2, count: 67 },
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

const renderApp = (initialRoute = '/') => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Navigation', () => {
    it('should navigate between pages', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderApp();

      // Should start on products page
      expect(screen.getByText('Products')).toBeInTheDocument();

      // Navigate to favorites
      const favoritesLink = screen.getByText('Favorites ❤️');
      fireEvent.click(favoritesLink);

      await waitFor(() => {
        expect(screen.getByText('Your Favorites')).toBeInTheDocument();
      });

      // Navigate back to products
      const productsLink = screen.getByText('Products');
      fireEvent.click(productsLink);

      await waitFor(() => {
        expect(screen.getByText('Products')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should filter products by search term', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.getByText('Cotton T-Shirt')).toBeInTheDocument();
        expect(screen.getByText('Laptop Stand')).toBeInTheDocument();
      });

      // Type in search
      const searchInput = screen.getByPlaceholderText('Search by title...');
      fireEvent.change(searchInput, { target: { value: 'Wireless' } });

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.queryByText('Cotton T-Shirt')).not.toBeInTheDocument();
        expect(screen.queryByText('Laptop Stand')).not.toBeInTheDocument();
      });
    });

    it('should show "No products found" for non-matching search', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });

      // Search for non-existent product
      const searchInput = screen.getByPlaceholderText('Search by title...');
      fireEvent.change(searchInput, { target: { value: 'NonExistentProduct' } });

      await waitFor(() => {
        expect(screen.getByText('No products found.')).toBeInTheDocument();
      });
    });
  });

  describe('Category Filter', () => {
    it('should filter products by category', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.getByText('Cotton T-Shirt')).toBeInTheDocument();
        expect(screen.getByText('Laptop Stand')).toBeInTheDocument();
      });

      // Filter by electronics category
      const categorySelect = screen.getByDisplayValue('All Categories');
      fireEvent.change(categorySelect, { target: { value: 'electronics' } });

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.getByText('Laptop Stand')).toBeInTheDocument();
        expect(screen.queryByText('Cotton T-Shirt')).not.toBeInTheDocument();
      });
    });

    it('should combine search and category filter', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });

      // Apply category filter first
      const categorySelect = screen.getByDisplayValue('All Categories');
      fireEvent.change(categorySelect, { target: { value: 'electronics' } });

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.queryByText('Cotton T-Shirt')).not.toBeInTheDocument();
      });

      // Then apply search
      const searchInput = screen.getByPlaceholderText('Search by title...');
      fireEvent.change(searchInput, { target: { value: 'Laptop' } });

      await waitFor(() => {
        expect(screen.getByText('Laptop Stand')).toBeInTheDocument();
        expect(screen.queryByText('Wireless Headphones')).not.toBeInTheDocument();
      });
    });
  });

  describe('Price Sorting', () => {
    it('should sort products by price ascending', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });

      // Sort by price ascending
      const sortSelect = screen.getByDisplayValue('Default');
      fireEvent.change(sortSelect, { target: { value: 'price-asc' } });

      await waitFor(() => {
        const products = screen.getAllByText(/(\$|\d)/);
        // Should show Cotton T-Shirt ($29.99) first
        expect(products[0]).toHaveTextContent('29.99');
        expect(products[1]).toHaveTextContent('49.99');
        expect(products[2]).toHaveTextContent('99.99');
      });
    });

    it('should sort products by price descending', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });

      // Sort by price descending
      const sortSelect = screen.getByDisplayValue('Default');
      fireEvent.change(sortSelect, { target: { value: 'price-desc' } });

      await waitFor(() => {
        const products = screen.getAllByText(/(\$|\d)/);
        // Should show Wireless Headphones ($99.99) first
        expect(products[0]).toHaveTextContent('99.99');
        expect(products[1]).toHaveTextContent('49.99');
        expect(products[2]).toHaveTextContent('29.99');
      });
    });
  });

  describe('Favorites Functionality', () => {
    it('should add product to favorites', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });

      // Add first product to favorites
      const favoriteButtons = screen.getAllByText('Add to Favorites');
      fireEvent.click(favoriteButtons[0]);

      // Button should change to "Added to Favorites"
      await waitFor(() => {
        expect(screen.getByText('Added to Favorites ❤️')).toBeInTheDocument();
      });

      // Navigate to favorites page
      const favoritesLink = screen.getByText('Favorites ❤️');
      fireEvent.click(favoritesLink);

      await waitFor(() => {
        expect(screen.getByText('Your Favorites (1)')).toBeInTheDocument();
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });
    });

    it('should remove product from favorites', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });

      // Add product to favorites
      const favoriteButtons = screen.getAllByText('Add to Favorites');
      fireEvent.click(favoriteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Added to Favorites ❤️')).toBeInTheDocument();
      });

      // Navigate to favorites page
      const favoritesLink = screen.getByText('Favorites ❤️');
      fireEvent.click(favoritesLink);

      await waitFor(() => {
        expect(screen.getByText('Your Favorites (1)')).toBeInTheDocument();
      });

      // Remove from favorites
      const removeButton = screen.getByText('×');
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(screen.getByText('Your Favorites (0)')).toBeInTheDocument();
        expect(screen.queryByText('Wireless Headphones')).not.toBeInTheDocument();
      });
    });

    it('should show empty state when no favorites', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderApp('/favorites');

      await waitFor(() => {
        expect(screen.getByText('Your Favorites')).toBeInTheDocument();
        expect(screen.getByText("You haven't added any products to your favorites yet.")).toBeInTheDocument();
        expect(screen.getByText('Browse Products')).toBeInTheDocument();
      });
    });
  });

  describe('Product Detail Page', () => {
    it('should navigate to product detail page', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });

      // Click on product card
      const productCard = screen.getByText('Wireless Headphones').closest('a');
      fireEvent.click(productCard!);

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
        expect(screen.getByText('99.99')).toBeInTheDocument();
        expect(screen.getByText('4.5 (120 reviews)')).toBeInTheDocument();
        expect(screen.getByText('Electronics')).toBeInTheDocument();
        expect(screen.getByText('High-quality wireless headphones with noise cancellation')).toBeInTheDocument();
      });
    });

    it('should add/remove favorites from detail page', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });

      // Navigate to product detail
      const productCard = screen.getByText('Wireless Headphones').closest('a');
      fireEvent.click(productCard!);

      await waitFor(() => {
        expect(screen.getByText('Add to Favorites')).toBeInTheDocument();
      });

      // Add to favorites
      const favoriteButton = screen.getByText('Add to Favorites');
      fireEvent.click(favoriteButton);

      await waitFor(() => {
        expect(screen.getByText('Remove from Favorites ❤️')).toBeInTheDocument();
      });

      // Remove from favorites
      fireEvent.click(screen.getByText('Remove from Favorites ❤️'));

      await waitFor(() => {
        expect(screen.getByText('Add to Favorites')).toBeInTheDocument();
      });
    });
  });

  describe('Back Navigation', () => {
    it('should navigate back from product detail page', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockProducts })
        .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

      renderApp();

      await waitFor(() => {
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });

      // Navigate to product detail
      const productCard = screen.getByText('Wireless Headphones').closest('a');
      fireEvent.click(productCard!);

      await waitFor(() => {
        expect(screen.getByText('← Back to Products')).toBeInTheDocument();
      });

      // Click back button
      const backButton = screen.getByText('← Back to Products');
      fireEvent.click(backButton);

      await waitFor(() => {
        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      });
    });
  });
});
