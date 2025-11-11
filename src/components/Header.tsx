'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import CartDrawer from './cart/CartDrawer';
import MobileMenu from './navigation/MobileMenu';

export default function Header() {
  const { itemCount } = useCart();
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 overflow-hidden">
      {/* Top Section - 150px height - #2e2d32 */}
      <div className="w-full h-[80px] sm:h-[100px] md:h-[150px] bg-[#2e2d32] overflow-hidden">
        <div className="w-full max-w-[1300px] mx-auto h-full px-2 sm:px-4">
          <div className="flex items-center justify-between h-full gap-2 md:gap-[1%]">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <img
                src="/images/logo/logo-bodenjaeger-fff.svg"
                alt="Bodenjäger Logo"
                className="h-10 sm:h-12 md:h-20"
              />
            </Link>

            {/* Search Field */}
            <div className="hidden sm:block w-[200px] lg:w-[250px] bg-white rounded-[12%]">
              <div className="relative w-full h-full flex items-center">
                <input
                  type="text"
                  placeholder="Suche..."
                  className="w-full h-12 pl-4 pr-12 bg-transparent text-gray-900 focus:outline-none"
                />
                <img
                  src="/images/Icons/Lupe schieferschwarz.png"
                  alt="Suche"
                  className="absolute right-4 w-6 h-6 pointer-events-none"
                />
              </div>
            </div>

            {/* Icons - Favoriten, Warenkorb, Kundenkonto, Hamburger (Mobile) */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-[1%]">
              {/* Favoriten */}
              <Link href="/favoriten" className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 hover:opacity-80 transition-opacity">
                <img
                  src="/images/Icons/Favoriten weiß.png"
                  alt="Favoriten"
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
                />
              </Link>

              {/* Warenkorb */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 hover:opacity-80 transition-opacity"
              >
                <img
                  src="/images/Icons/Warenkorb weiß.png"
                  alt="Warenkorb"
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
                />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-1 sm:px-1.5 py-0.5 rounded-full min-w-[16px] sm:min-w-[20px] text-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Kundenkonto */}
              <Link href="/kundenkonto" className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 hover:opacity-80 transition-opacity">
                <img
                  src="/images/Icons/Kundenkonto weiß.png"
                  alt="Kundenkonto"
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
                />
              </Link>

              {/* Hamburger Menu Button (Mobile Only - ganz rechts) */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 hover:opacity-80 transition-opacity"
                aria-label="Menü öffnen"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>

      {/* Bottom Section - 50px height - #4c4c4c - Navigation */}
      <div className="w-full h-[50px] bg-[#4c4c4c] overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 h-full">
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

          {/* Empty div on mobile - menu button moved to top section */}
          <div className="lg:hidden flex items-center justify-center h-full">
            {/* Hamburger button now in top section with other icons */}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
      />


      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}