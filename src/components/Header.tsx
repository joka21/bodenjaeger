'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import CartDrawer from './cart/CartDrawer';
import MobileMenu from './navigation/MobileMenu';
import LiveSearch from './LiveSearch';

export default function Header() {
  const { isCartDrawerOpen, closeCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isLoggedIn, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close account dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top Section - 150px height - #2e2d32 */}
      <div className="w-full h-[70px] sm:h-[80px] md:h-[100px] bg-dark overflow-visible">
        <div className="content-container h-full">
          <div className="flex items-center justify-between h-full gap-2 md:gap-[1%]">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 min-w-[120px] sm:min-w-[150px] md:min-w-[200px]">
              <Image
                src="/images/logo/logo-bodenjaeger-fff.svg"
                alt="Bodenjäger Logo"
                width={200}
                height={80}
                className="h-10 sm:h-12 md:h-14 w-auto"
                priority
              />
            </Link>

            {/* Search Field with Live Results */}
            <LiveSearch />

            {/* Icons - Favoriten, Warenkorb, Kundenkonto, Hamburger (Mobile) */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-[1%]">
              {/* Favoriten */}
              <Link href="/favoriten" className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 hover:opacity-80 transition-opacity">
                <Image
                  src="/images/Icons/Favoriten weiß.png"
                  alt="Favoriten"
                  width={32}
                  height={32}
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Kundenkonto */}
              <div className="relative" ref={accountMenuRef}>
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                      className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 hover:opacity-80 transition-opacity"
                      aria-label="Kundenkonto"
                    >
                      <Image
                        src="/images/Icons/Kundenkonto weiß.png"
                        alt="Kundenkonto"
                        width={32}
                        height={32}
                        className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
                      />
                    </button>
                    {isAccountMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-ash z-50">
                        <div className="px-4 py-3 border-b border-ash">
                          <p className="text-sm font-semibold text-dark truncate">
                            {user?.firstName || user?.displayName}
                          </p>
                          <p className="text-xs text-mid truncate">{user?.email}</p>
                        </div>
                        <Link
                          href="/konto"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-dark hover:bg-gray-50 transition-colors"
                        >
                          Mein Konto
                        </Link>
                        <Link
                          href="/konto/bestellungen"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-dark hover:bg-gray-50 transition-colors"
                        >
                          Bestellungen
                        </Link>
                        <button
                          onClick={async () => {
                            setIsAccountMenuOpen(false);
                            await logout();
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-mid hover:bg-gray-50 transition-colors border-t border-ash"
                        >
                          Abmelden
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src="/images/Icons/Kundenkonto weiß.png"
                      alt="Anmelden"
                      width={32}
                      height={32}
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
                    />
                  </Link>
                )}
              </div>

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
      <div className="hidden lg:block w-full h-[50px] bg-mid overflow-visible">
        <div className="content-container h-full">
          <nav className="hidden lg:flex items-center justify-center h-full space-x-8">
            <div className="relative group">
              <Link
                href="/category/vinylboden"
                className="text-white hover:text-gray-200 transition-colors font-medium"
              >
                Vinylboden
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
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
        onClose={closeCartDrawer}
      />


      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}