// src/pages/ProductListingPage.test.tsx
import { render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import ProductListingPage from './ProductListingPage';
import productsReducer from '../features/products/productSlice';
import favoritesReducer from '../features/favorites/favoriteSlice';
import type { Product } from '../types';

// Mock axios
jest.mock('axios');
const mockedAxios = jest.requireActual('axios');

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

const createTestStore = () => {
  return configureStore({
    reducer: {
      products: productsReducer,
      favorites: favoritesReducer,
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={createTestStore()}>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </Provider>
  );
};

describe('ProductListingPage Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    mockedAxios.get.mockReturnValueOnce(new Promise(() => {})); // Never resolves
    
    renderWithProviders(<ProductListingPage />);
    
    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('displays products after successful fetch', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockProducts })
      .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

    renderWithProviders(<ProductListingPage />);

    await waitFor(() => {
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('$19.99')).toBeInTheDocument();
    });
  });

  it('displays search input and filters', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockProducts })
      .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

    renderWithProviders(<ProductListingPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search by title...')).toBeInTheDocument();
      expect(screen.getByDisplayValue('All Categories')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Default')).toBeInTheDocument();
    });
  });

  it('filters products by search term', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockProducts })
      .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

    renderWithProviders(<ProductListingPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    // Type in search
    const searchInput = screen.getByPlaceholderText('Search by title...');
    fireEvent.change(searchInput, { target: { value: 'Product 1' } });

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
    });
  });

  it('filters products by category', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockProducts })
      .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

    renderWithProviders(<ProductListingPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    // Select category
    const categorySelect = screen.getByDisplayValue('All Categories');
    fireEvent.change(categorySelect, { target: { value: 'electronics' } });

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
    });
  });

  it('sorts products by price', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockProducts })
      .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

    renderWithProviders(<ProductListingPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    // Sort by price ascending
    const sortSelect = screen.getByDisplayValue('Default');
    fireEvent.change(sortSelect, { target: { value: 'price-asc' } });

    await waitFor(() => {
      const products = screen.getAllByText(/Test Product/);
      // Should be in price order (19.99 first, then 29.99)
      expect(products[0]).toHaveTextContent('Test Product 2');
      expect(products[1]).toHaveTextContent('Test Product 1');
    });
  });

  it('displays "No products found" when search returns no results', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockProducts })
      .mockResolvedValueOnce({ data: ['electronics', 'clothing'] });

    renderWithProviders(<ProductListingPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    // Search for non-existent product
    const searchInput = screen.getByPlaceholderText('Search by title...');
    fireEvent.change(searchInput, { target: { value: 'NonExistentProduct' } });

    await waitFor(() => {
      expect(screen.getByText('No products found.')).toBeInTheDocument();
      expect(screen.queryByText('Test Product 1')).not.toBeInTheDocument();
    });
  });
});
