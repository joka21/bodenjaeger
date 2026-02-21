'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';
import UnifiedProductCard from '@/components/UnifiedProductCard';

export default function FavoritenPage() {
  const { wishlistItems, wishlistCount, clearWishlist } = useWishlist();

  const sortedItems = useMemo(
    () => [...wishlistItems].sort((a, b) => b.addedAt - a.addedAt),
    [wishlistItems]
  );

  if (wishlistCount === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <svg
            className="w-20 h-20 mx-auto mb-6 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Ihre Merkliste ist leer
          </h1>
          <p className="text-gray-500 mb-8">
            Speichern Sie Ihre Lieblingsprodukte, um sie später wiederzufinden.
          </p>
          <Link
            href="/category/vinylboden"
            className="inline-block px-6 py-3 rounded-lg text-white font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Produkte entdecken
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1500px] mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Meine Merkliste
            </h1>
            <p className="text-gray-500 mt-1">
              {wishlistCount} {wishlistCount === 1 ? 'Produkt' : 'Produkte'}
            </p>
          </div>
          <button
            onClick={clearWishlist}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Merkliste leeren
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedItems.map(item => (
            <UnifiedProductCard key={item.id} product={item.product} />
          ))}
        </div>
      </div>
    </main>
  );
}
