'use client';

import Image from 'next/image';
import { Category } from '@/types/mobile-menu';

interface MobileMenuLevel1Props {
  categories: Category[];
  onCategoryClick: (category: Category) => void;
  onClose: () => void;
}

export default function MobileMenuLevel1({ categories, onCategoryClick }: MobileMenuLevel1Props) {
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
          <Image
            src="/images/Icons/Lupe schieferschwarz.png"
            alt="Suche"
            width={20}
            height={20}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
          />
        </div>
      </div>

      {/* Main Categories - only categories from desktop header */}
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

      {/* Bottom Spacer */}
      <div className="h-8" />
    </div>
  );
}
