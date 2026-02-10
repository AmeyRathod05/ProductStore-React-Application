## 🌐 Live Demo

The application is deployed and available at: https://react-store-nine-bice.vercel.app/


## 📊 Test Coverage & Results
 
**Overall Coverage**: 70.66% Statements, 50% Branches, 69.76% Functions, 70.92% Lines

### Test Results Summary
- **Total Tests**: 57 (34 passing, 23 failing)
- **Test Suites**: 7 (3 passing, 4 failing)

### Key Coverage Areas
- ✅ **Redux Logic**: 100% coverage for state management
- ✅ **Components**: ProductCard fully tested
- ⚠️ **Pages**: Need improved coverage (17-50%)
- ❌ **Integration Tests**: Require fixes for deployment
# Product Dashboard React Application

A modern, responsive product dashboard built with React, TypeScript, Redux Toolkit, and Tailwind CSS. Features include product browsing, search, filtering, favorites management, and a beautiful glassmorphism UI design.

## 🚀 Features

- **Product Listing**: Browse products with responsive grid layout
- **Advanced Search**: Real-time search by product title
- **Category Filtering**: Filter products by category
- **Price Sorting**: Sort products by price (low to high, high to low)
- **Favorites Management**: Add/remove products from favorites with localStorage persistence
- **Product Details**: Detailed product view with ratings and descriptions
- **Responsive Design**: Mobile-first design with beautiful glassmorphism effects
- **Loading States**: Smooth loading indicators and transitions
- **TypeScript**: Full TypeScript support for type safety

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with glassmorphism design
- **Build Tool**: Vite
- **Testing**: Jest, React Testing Library, Redux Test Utils
- **API Client**: Axios
- **Deployment**: Vercel/Netlify/Render ready

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or yarn
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/AmeyRathod05/ProductStore-React-Application.git
cd ProductStore-React-Application
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=https://fakestoreapi.com

# Optional: Add any other environment variables
VITE_APP_NAME=Product Dashboard
```

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🧪 Testing

### Run All Tests

```bash
npm test
# or
yarn test
```

### Run Tests with Coverage

```bash
npm run test:coverage
# or
yarn test:coverage
```

### Run Tests in Watch Mode

```bash
npm run test:watch
# or
yarn test:watch
```

### Test Structure

- **Unit Tests**: Located in `src/features/*/` directories
- **Integration Tests**: Located in `src/integration/` directory
- **Component Tests**: Located alongside components



## 📁 Project Structure

```
src/
├── app/                    # Redux store configuration
│   └── store.ts
├── assets/                 # Static assets
├── components/             # Reusable UI components
│   ├── ProductCard.tsx
│   └── ProductCard.test.tsx
├── features/               # Redux feature slices
│   ├── favorites/
│   │   ├── favoriteSlice.ts
│   │   └── favoriteSlice.test.ts
│   └── products/
│       ├── productSlice.ts
│       └── productSlice.test.ts
├── integration/            # Integration tests
│   └── working.integration.test.tsx
├── pages/                  # Page components
│   ├── FavoritePage.tsx
│   ├── ProductDetailPage.tsx
│   └── ProductListingPage.tsx
├── types/                  # TypeScript type definitions
│   └── index.ts
├── App.tsx                 # Main App component
├── main.tsx               # Application entry point
└── setupTests.ts          # Test configuration
```



## 🔧 Configuration Files

- `tsconfig.json` - TypeScript configuration
- `tsconfig.app.json` - Application-specific TypeScript config
- `tsconfig.test.json` - Test-specific TypeScript config
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `jest.config.js` - Jest testing configuration

## 🐛 Troubleshooting

### Common Issues

1. **Build fails on deployment**
   - Ensure all `.js` files are excluded from git (check `.gitignore`)
   - Verify environment variables are set correctly
   - Check that Node.js version is compatible

2. **Tests fail with TypeScript errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that `@types/node` is installed for test files
   - Verify TypeScript configuration in `tsconfig.test.json`

3. **Development server doesn't start**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check that port 5173 is not in use
   - Verify Vite configuration

### Getting Help

- Check the [Issues](https://github.com/AmeyRathod05/ProductStore-React-Application/issues) page for known problems
- Create a new issue for bugs or feature requests
- Review the test files for usage examples



## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📊 Test Coverage

The project maintains high test coverage with:
- Unit tests for Redux slices and reducers
- Integration tests for user workflows
- Component tests for UI interactions
- API mocking for reliable testing


---

**Built with ❤️ using React, TypeScript, and modern web technologies**
