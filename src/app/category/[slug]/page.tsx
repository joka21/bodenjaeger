'use client';

import { useState, useEffect, useCallback } from 'react';
import { type StoreApiProduct } from '@/lib/woocommerce';
import ProductCard from '@/components/ProductCard';

interface JaegerMeta {
  uvp?: number | null;
  show_uvp?: boolean;
  paketpreis?: number | null;
  paketpreis_s?: number | null;
  paketinhalt?: number | null;
  einheit_short?: string | null;
  verpackungsart_short?: string | null;
  verschnitt?: number | null;
  text_produktuebersicht?: string | null;
  show_text_produktuebersicht?: boolean;
  lieferzeit?: string | null;
  show_lieferzeit?: boolean;
  setangebot_titel?: string | null;
  show_setangebot?: boolean;
  standard_addition_daemmung?: number | null;
  standard_addition_sockelleisten?: number | null;
  aktion?: string | null;
  show_aktion?: boolean;
  angebotspreis_hinweis?: string | null;
  show_angebotspreis_hinweis?: boolean;
}

interface ExtendedProduct extends StoreApiProduct {
  jaeger_meta?: JaegerMeta;
}


// Category mapping for display names
const categoryNames: Record<string, string> = {
  'vinylboden': 'Vinylboden',
  'klebe-vinyl': 'Klebe-Vinyl',
  'rigid-vinyl': 'Rigid-Vinyl',
  'laminat': 'Laminat',
  'parkett': 'Parkett',
  'teppichboden': 'Teppichboden',
  'sockelleisten': 'Sockelleisten',
  'daemmung': 'Dämmung',
  'zubehoer': 'Zubehör'
};

export default function CategoryPage({ params }: PageProps<'/category/[slug]'>) {
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);

  const productsPerPage = 12;

  // Resolve params promise
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const categorySlug = resolvedParams?.slug || '';
  const categoryName = categoryNames[categorySlug] || categorySlug;

  const fetchProducts = useCallback(async () => {
    if (!categorySlug) return; // Don't fetch if params not resolved yet

    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 Fetching products for category: ${categorySlug}`);

      // Use our proxy API to avoid CORS issues
      const apiUrl = `/api/store-api-test?per_page=${productsPerPage}&page=${currentPage}&category=${encodeURIComponent(categorySlug)}&orderby=date&order=desc`;

      console.log('📡 API URL:', apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const fetchedProducts = await response.json();

      // Get pagination info from headers
      const totalProducts = parseInt(response.headers.get('X-WP-Total') || '0');
      const totalPagesFromAPI = parseInt(response.headers.get('X-WP-TotalPages') || '1');

      console.log(`📦 Fetched ${fetchedProducts.length} products for category ${categorySlug} (${totalProducts} total across ${totalPagesFromAPI} pages)`);

      // API now handles category filtering server-side, so we can use the products directly
      setProducts(fetchedProducts);

      // Use the total pages from the API
      setTotalPages(totalPagesFromAPI);

    } catch (err) {
      console.error('❌ Error fetching category products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [categorySlug, currentPage, productsPerPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Prefetch next page for faster navigation
  useEffect(() => {
    if (categorySlug && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      const prefetchUrl = `/api/store-api-test?per_page=${productsPerPage}&page=${nextPage}&category=${encodeURIComponent(categorySlug)}&orderby=date&order=desc`;

      // Prefetch with a small delay to not interfere with current page loading
      const timeoutId = setTimeout(() => {
        fetch(prefetchUrl).catch(() => {}); // Silent prefetch
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [categorySlug, currentPage, totalPages, productsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{categoryName}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-300"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{categoryName}</h1>

          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Fehler beim Laden der Produkte:</strong> {error}
          </div>

          <button
            onClick={fetchProducts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{categoryName}</h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-600 mb-4 sm:mb-0">
              {products.length} {products.length === 1 ? 'Produkt' : 'Produkte'} gefunden
            </p>

            {/* Sorting/Filter Options */}
            <div className="flex items-center space-x-4">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Sortieren nach...</option>
                <option>Neueste</option>
                <option>Preis: Niedrig zu Hoch</option>
                <option>Preis: Hoch zu Niedrig</option>
                <option>Name A-Z</option>
              </select>

              <div className="flex items-center space-x-2">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Keine Produkte gefunden</h3>
            <p className="text-gray-600 mb-6">
              In der Kategorie &ldquo;{categoryName}&rdquo; sind derzeit keine Produkte verfügbar.
            </p>
            <button
              onClick={fetchProducts}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Aktualisieren
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Zurück
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Weiter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Generate static params for common categories to avoid 404 on direct access
export async function generateStaticParams() {
  const categories = [
    'vinylboden',
    'klebe-vinyl',
    'rigid-vinyl',
    'laminat',
    'parkett',
    'teppichboden',
    'sockelleisten',
    'daemmung',
    'zubehoer',
    'coretec',
    'primecore'
  ];

  return categories.map((slug) => ({
    slug,
  }));
}

// Enable dynamic rendering for categories not in generateStaticParams
export const dynamicParams = true;