'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types/mobile-menu';

interface MobileMenuLevel1Props {
  categories: Category[];
  onCategoryClick: (category: Category) => void;
  onClose: () => void;
}

export default function MobileMenuLevel1({ categories, onCategoryClick, onClose }: MobileMenuLevel1Props) {
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isServiceExpanded, setIsServiceExpanded] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f9f9fb]">
      {/* Search Field */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Suchbegriff eingeben"
            className="w-full h-12 pl-4 pr-12 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#ed1b24]"
          />
          <img
            src="/images/Icons/Lupe schieferschwarz.png"
            alt="Suche"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
          />
        </div>
      </div>

      {/* Main Categories */}
      <div className="mt-2">
        {categories.map((category) => (
          <div key={category.id} className="border-b border-gray-200 bg-white">
            <button
              onClick={() => onCategoryClick(category)}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="text-[#2e2d32] font-medium text-base">{category.label}</span>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Footer Sections */}
      <div className="mt-4">
        {/* Über Bodenjäger */}
        <div className="border-b border-gray-200 bg-white">
          <button
            onClick={() => setIsAboutExpanded(!isAboutExpanded)}
            className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-[#2e2d32] font-medium text-base">Über Bodenjäger</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isAboutExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          {isAboutExpanded && (
            <div className="px-4 pb-4 space-y-2">
              <Link
                href="/fachmarkt-hueckelhoven"
                onClick={onClose}
                className="block py-2 text-[#666666] hover:text-[#ed1b24] transition-colors"
              >
                Fachmarkt Hückelhoven
              </Link>
              <Link
                href="/karriere"
                onClick={onClose}
                className="block py-2 text-[#666666] hover:text-[#ed1b24] transition-colors"
              >
                Jobs & Karriere
              </Link>
              <Link
                href="/agb"
                onClick={onClose}
                className="block py-2 text-[#666666] hover:text-[#ed1b24] transition-colors"
              >
                AGB
              </Link>
              <Link
                href="/impressum"
                onClick={onClose}
                className="block py-2 text-[#666666] hover:text-[#ed1b24] transition-colors"
              >
                Impressum
              </Link>
              <Link
                href="/datenschutz"
                onClick={onClose}
                className="block py-2 text-[#666666] hover:text-[#ed1b24] transition-colors"
              >
                Datenschutzerklärung
              </Link>
            </div>
          )}
        </div>

        {/* Kundenservice */}
        <div className="border-b border-gray-200 bg-white">
          <button
            onClick={() => setIsServiceExpanded(!isServiceExpanded)}
            className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="text-[#2e2d32] font-medium text-base">Kundenservice</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isServiceExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          {isServiceExpanded && (
            <div className="px-4 pb-4 space-y-2">
              <Link
                href="/kontakt"
                onClick={onClose}
                className="block py-2 text-[#666666] hover:text-[#ed1b24] transition-colors"
              >
                Kontakt
              </Link>
              <Link
                href="/service"
                onClick={onClose}
                className="block py-2 text-[#666666] hover:text-[#ed1b24] transition-colors"
              >
                Serviceübersicht
              </Link>
              <Link
                href="/versand-lieferzeit"
                onClick={onClose}
                className="block py-2 text-[#666666] hover:text-[#ed1b24] transition-colors"
              >
                Versandkosten & Lieferzeit
              </Link>
              <Link
                href="/widerruf"
                onClick={onClose}
                className="block py-2 text-[#666666] hover:text-[#ed1b24] transition-colors"
              >
                Widerrufsbelehrung
              </Link>
              <Link
                href="/blog"
                onClick={onClose}
                className="block py-2 text-[#666666] hover:text-[#ed1b24] transition-colors"
              >
                Blog
              </Link>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="bg-white px-4 py-6">
          <h3 className="text-[#2e2d32] font-medium mb-4">Folge uns</h3>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/bodenjaeger"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#ed1b24] hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://facebook.com/bodenjaeger"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#ed1b24] hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-8" />
    </div>
  );
}
