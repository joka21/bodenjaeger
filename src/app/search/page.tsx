'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { StoreApiProduct } from '@/lib/woocommerce';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<StoreApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-[#1e40af] hover:underline">
            Home
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">Suche</span>
        </nav>

        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1e40af] mb-2">
            Suchergebnisse
          </h1>
          {query && (
            <p className="text-gray-600">
              Suche nach: <span className="font-semibold text-gray-900">{query}</span>
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e40af]"></div>
            <p className="mt-4 text-gray-600">Suche läuft...</p>
          </div>
        )}

        {/* No Query */}
        {!loading && !query && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Bitte geben Sie einen Suchbegriff ein.
            </p>
          </div>
        )}

        {/* No Results */}
        {!loading && query && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              Keine Produkte gefunden für &ldquo;{query}&rdquo;
            </p>
            <p className="text-gray-500 mb-6">
              Versuchen Sie es mit anderen Suchbegriffen oder durchsuchen Sie unsere Kategorien.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/category/vinylboden"
                className="px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors"
              >
                Vinylboden
              </Link>
              <Link
                href="/category/laminat"
                className="px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors"
              >
                Laminat
              </Link>
              <Link
                href="/category/parkett"
                className="px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors"
              >
                Parkett
              </Link>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && products.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{products.length}</span>
                {products.length === 1 ? ' Produkt gefunden' : ' Produkte gefunden'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showDescription={false}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e40af]"></div>
            <p className="mt-4 text-gray-600">Lade Suchergebnisse...</p>
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
