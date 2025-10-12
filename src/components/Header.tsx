'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from './CartDrawer';

export default function Header() {
  const { itemCount, totalPrice } = useCart();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top Section - 150px height - #2e2d32 */}
      <div className="w-full h-[150px] bg-[#2e2d32]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-white hover:text-gray-200 transition-colors">
                Bodenjäger
              </h1>
            </Link>

            {/* Cart */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors group"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3m4 10v6a2 2 0 002 2h8a2 2 0 002-2v-6m-12 0h12"
                  />
                </svg>
                <span className="hidden sm:block font-medium">
                  Warenkorb
                </span>
                {itemCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-full">
                      {itemCount}
                    </span>
                    <span className="hidden lg:block text-sm">
                      €{totalPrice.toFixed(2)}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - 50px height - #4c4c4c - Navigation */}
      <div className="w-full h-[50px] bg-[#4c4c4c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <nav className="hidden lg:flex items-center justify-center h-full space-x-8">
            <div className="relative group">
              <Link
                href="/category/vinylboden"
                className="text-white hover:text-gray-200 transition-colors font-medium"
              >
                Vinylboden
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <Link href="/category/klebe-vinyl" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Klebe-Vinyl
                </Link>
                <Link href="/category/rigid-vinyl" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Rigid-Vinyl
                </Link>
              </div>
            </div>
            <Link
              href="/category/laminat"
              className="text-white hover:text-gray-200 transition-colors font-medium"
            >
              Laminat
            </Link>
            <Link
              href="/category/parkett"
              className="text-white hover:text-gray-200 transition-colors font-medium"
            >
              Parkett
            </Link>
            <Link
              href="/category/teppichboden"
              className="text-white hover:text-gray-200 transition-colors font-medium"
            >
              Teppichboden
            </Link>
            <Link
              href="/category/sockelleisten"
              className="text-white hover:text-gray-200 transition-colors font-medium"
            >
              Sockelleisten
            </Link>
            <Link
              href="/category/daemmung"
              className="text-white hover:text-gray-200 transition-colors font-medium"
            >
              Dämmung
            </Link>
            <Link
              href="/category/zubehoer"
              className="text-white hover:text-gray-200 transition-colors font-medium"
            >
              Zubehör
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center justify-center h-full">
            <button
              type="button"
              className="text-white hover:text-gray-200 focus:outline-none"
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