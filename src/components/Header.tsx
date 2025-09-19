'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from './CartDrawer';

export default function Header() {
  const { itemCount, totalPrice } = useCart();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              WooCommerce Store
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Produkte
            </Link>
          </nav>

          {/* Cart */}
          <div className="flex items-center space-x-4">
            {/* Cart Drawer Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors group"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:block font-medium">
                Warenkorb
              </span>
              {itemCount > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                    {itemCount}
                  </span>
                  <span className="hidden lg:block text-sm">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
              )}
            </button>

            {/* Cart Page Link (for mobile/fallback) */}
            <Link
              href="/cart"
              className="hidden text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Cart Page
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
      />
    </header>
  );
}