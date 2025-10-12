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
        <div className="w-[1300px] mx-auto h-full">
          <div className="flex items-center justify-between h-full gap-[1%]">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <img
                src="/images/logo/logo-bodenjaeger-fff.svg"
                alt="Bodenjäger Logo"
                className="h-20"
              />
            </Link>

            {/* Search Field */}
            <div className="w-[150px]">
              <div className="relative w-full h-full flex items-center">
                <input
                  type="text"
                  placeholder="Suche..."
                  className="w-full h-12 pl-4 pr-12 rounded-[6%] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <img
                  src="/images/Icons/Lupe schieferschwarz.png"
                  alt="Suche"
                  className="absolute right-4 w-6 h-6 pointer-events-none"
                />
              </div>
            </div>

            {/* Icons - Favoriten, Warenkorb, Kundenkonto */}
            <div className="flex items-center gap-[1%]">
              {/* Favoriten */}
              <Link href="/favoriten" className="flex items-center justify-center w-12 h-12 hover:opacity-80 transition-opacity">
                <img
                  src="/images/Icons/Favoriten weiß.png"
                  alt="Favoriten"
                  className="w-8 h-8"
                />
              </Link>

              {/* Warenkorb */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative flex items-center justify-center w-12 h-12 hover:opacity-80 transition-opacity"
              >
                <img
                  src="/images/Icons/Warenkorb weiß.png"
                  alt="Warenkorb"
                  className="w-8 h-8"
                />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Kundenkonto */}
              <Link href="/kundenkonto" className="flex items-center justify-center w-12 h-12 hover:opacity-80 transition-opacity">
                <img
                  src="/images/Icons/Kundenkonto weiß.png"
                  alt="Kundenkonto"
                  className="w-8 h-8"
                />
              </Link>
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