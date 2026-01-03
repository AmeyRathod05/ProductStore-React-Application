// src/components/ProductCard.test.tsx
import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';
import type { Product } from '../types';
import favoritesReducer from '../features/favorites/favoriteSlice';

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  description: 'Test description',
  category: 'electronics',
  image: 'test.jpg',
  rating: { rate: 4.5, count: 120 },
};

const createTestStore = (initialFavorites: Product[] = []) => {
  return configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
    preloadedState: {
      favorites: { items: initialFavorites },
    },
  });
};

const renderWithProviders = (component: React.ReactElement, store = createTestStore()) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>
        {component}
      </MemoryRouter>
    </Provider>
  );
};

describe('ProductCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product information correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(120 reviews)')).toBeInTheDocument();
  });

  it('displays product image with correct attributes', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test.jpg');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('shows "Add to Favorites" when product is not in favorites', () => {
    const store = createTestStore([]);
    renderWithProviders(<ProductCard product={mockProduct} />, store);

    const button = screen.getByText('Add to Favorites');
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('shows "Added to Favorites" when product is in favorites', () => {
    const store = createTestStore([mockProduct]);
    renderWithProviders(<ProductCard product={mockProduct} />, store);

    const button = screen.getByText('Added to Favorites ❤️');
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('links to product detail page', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/1');
  });

  it('adds to favorites when button is clicked', () => {
    const store = createTestStore([]);
    renderWithProviders(<ProductCard product={mockProduct} />, store);

    const button = screen.getByText('Add to Favorites');
    fireEvent.click(button);

    const state = store.getState();
    expect(state.favorites.items).toHaveLength(1);
    expect(state.favorites.items[0]).toEqual(mockProduct);
  });

  it('prevents event propagation when favorite button is clicked', () => {
    const store = createTestStore([]);
    renderWithProviders(<ProductCard product={mockProduct} />, store);

    const button = screen.getByText('Add to Favorites');
    const mockPreventDefault = jest.fn();
    const mockStopPropagation = jest.fn();

    // Create a synthetic event
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(clickEvent, 'preventDefault', {
      value: mockPreventDefault,
      writable: true,
    });
    Object.defineProperty(clickEvent, 'stopPropagation', {
      value: mockStopPropagation,
      writable: true,
    });

    button.dispatchEvent(clickEvent);

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(mockStopPropagation).toHaveBeenCalled();
  });
});
