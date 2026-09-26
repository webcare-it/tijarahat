# E-Commerce Frontend

A modern, responsive e-commerce platform built with React, TypeScript, and Vite.

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS
- **State Management**: Redux Toolkit
- **Data Fetching**: TanStack Query (React Query), Axios
- **Routing**: React Router v7
- **Build Tool**: Vite
- **UI Components**: ShadcnUI, Lucide React Icons
- **Animations**: Framer Motion

## 📁 Project Structure

```
src/
├── api/          # API services and hooks
├── components/   # Reusable UI components
├── controllers/  # Business logic controllers
├── hooks/        # Custom React hooks
├── lib/          # Core utilities and configurations
├── pages/        # Page components
├── providers/    # React context providers
├── redux/        # Redux slices and store
└── types/        # TypeScript types
```

## 🛠️ Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run development server**:

   ```bash
   npm run dev
   ```

3. **Build for production**:

   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run start
   ```

## 🔄 CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

- **Trigger**: Automatically runs on push to `main` branch
- **Build Process**:
  - Sets up Node.js environment
  - Installs dependencies
  - Builds the production-ready code
- **Deployment**:
  - Creates optimized `.htaccess` for SPA routing
  - Deploys to FTP server using secure credentials

Workflow file: `.github/workflows/main.yml`

## 🎨 Key Features

- Responsive design for all device sizes
- Dynamic SEO metadata handling
- Google Tag Manager integration for analytics
- Shopping cart and wishlist functionality
- User authentication and profile management
- Product search and filtering
- Order tracking system
- Coupon and discount support
- Mobile-friendly navigation

## 📱 Pages

- Home
- Product listings (by category, brand)
- Product details
- Shopping cart
- Checkout process
- User dashboard/orders
- Wishlist
- Search functionality
- Order tracking
- Landing pages

## 🔧 Development

- TypeScript for type safety
- ESLint for code quality
- TailwindCSS for styling
- React Query for server state management
- Redux for client state management
