'use client';

import { useState, useEffect, useCallback } from 'react';
import { type StoreApiProduct } from '@/lib/woocommerce';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

interface CategoryPageClientProps {
  slug: string;
  categoryName: string;
  categoryDescription?: string | null;
  categoryImage?: CategoryImage | null;
}

export default function CategoryPageClient({ slug, categoryName, categoryDescription, categoryImage }: CategoryPageClientProps) {
  const [products, setProducts] = useState<StoreApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const productsPerPage = 12;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 Fetching products for category: ${slug}`);

      // Parse sort settings
      const [orderby, order] = sortBy.split('-');

      // Build API URL with sorting and search
      let apiUrl = `/api/store-api-test?per_page=${productsPerPage}&page=${currentPage}&category=${encodeURIComponent(slug)}&orderby=${orderby}&order=${order}`;

      // Add search query if present
      if (searchQuery.trim()) {
        apiUrl += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      // Add cache buster timestamp to force fresh data when sorting/searching
      apiUrl += `&_t=${Date.now()}`;

      console.log('📡 API URL:', apiUrl);
      console.log('📊 Sort settings:', { orderby, order, searchQuery });

      const response = await fetch(apiUrl, {
        cache: 'no-store' // Disable Next.js fetch cache for dynamic sorting
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const fetchedProducts = await response.json();

      // Get pagination info from headers
      const totalProductsCount = parseInt(response.headers.get('X-WP-Total') || '0');
      const totalPagesFromAPI = parseInt(response.headers.get('X-WP-TotalPages') || '1');

      console.log(`📦 Fetched ${fetchedProducts.length} products for category ${slug} (${totalProductsCount} total across ${totalPagesFromAPI} pages)`);

      // API now handles category filtering server-side, so we can use the products directly
      setProducts(fetchedProducts);

      // Use the total pages and total products count from the API
      setTotalPages(totalPagesFromAPI);
      setTotalProducts(totalProductsCount);

    } catch (err) {
      console.error('❌ Error fetching category products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [slug, currentPage, productsPerPage, sortBy, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounce search: Only fetch after user stops typing for 500ms
  useEffect(() => {
    if (searchQuery === '') {
      // If search is cleared, fetch immediately
      return;
    }

    const debounceTimer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Prefetch next page for faster navigation
  useEffect(() => {
    if (slug && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      const prefetchUrl = `/api/store-api-test?per_page=${productsPerPage}&page=${nextPage}&category=${encodeURIComponent(slug)}&orderby=date&order=desc`;

      // Prefetch with a small delay to not interfere with current page loading
      const timeoutId = setTimeout(() => {
        fetch(prefetchUrl).catch(() => {}); // Silent prefetch
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [slug, currentPage, totalPages, productsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="content-container py-8">
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
        <div className="content-container py-8">
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
      <div className="content-container py-8">
        {/* Category Header */}
        <div className="mb-8">
          {/* Category Image & Description - Two Column Layout */}
          {(categoryImage || categoryDescription) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Left: Category Image */}
              {categoryImage && categoryImage.src && (
                <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={categoryImage.src}
                    alt={categoryImage.alt || categoryName}
                    fill
                    className="object-cover"
                    priority
                    quality={85}
                  />
                </div>
              )}

              {/* Right: Category Name & Description */}
              {categoryDescription && (
                <div className="bg-gray-100 rounded-md p-6 flex flex-col">
                  {/* Category Name as Heading */}
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{categoryName}</h1>

                  {/* Category Description */}
                  <div className="text-gray-900 text-base md:text-lg leading-relaxed md:leading-loose flex-grow">
                    {(() => {
                      // Remove HTML tags and get first 200 characters (mobile) or 400 (desktop)
                      const plainText = categoryDescription
                        .replace(/<[^>]+>/g, '')
                        .replace(/&nbsp;/g, ' ')
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .trim();

                      // Mobile: 200 chars, Desktop: 400 chars (we show both, CSS handles display)
                      const mobilePreview = plainText.length > 200
                        ? plainText.substring(0, 200) + '...'
                        : plainText;

                      const desktopPreview = plainText.length > 400
                        ? plainText.substring(0, 400) + '...'
                        : plainText;

                      return (
                        <>
                          <span className="md:hidden">{mobilePreview}</span>
                          <span className="hidden md:inline">{desktopPreview}</span>
                        </>
                      );
                    })()}
                  </div>

                  {/* Weiterlesen Link */}
                  {categoryDescription.replace(/<[^>]+>/g, '').trim().length > 200 && (
                    <a
                      href="#category-full-description"
                      className="text-gray-900 font-medium mt-4 inline-block hover:underline"
                    >
                      Weiterlesen →
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-600 mb-4 sm:mb-0">
              {totalProducts} {totalProducts === 1 ? 'Produkt' : 'Produkte'} gefunden
              {totalPages > 1 && ` (Seite ${currentPage} von ${totalPages})`}
            </p>

            {/* Sorting Options */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1); // Reset to first page on sort change
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date-desc">Neueste zuerst</option>
                <option value="date-asc">Älteste zuerst</option>
                <option value="price-asc">Preis: Niedrig zu Hoch</option>
                <option value="price-desc">Preis: Hoch zu Niedrig</option>
                <option value="title-asc">Name: A-Z</option>
                <option value="title-desc">Name: Z-A</option>
                <option value="popularity-desc">Beliebteste</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <article key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <Link href={`/products/${product.slug}`}>
                  {/* Bildbereich */}
                  <div className="relative aspect-[4/3] bg-gray-200">
                    {product.images?.length > 0 && product.images[0]?.src ? (
                      <Image
                        src={product.images[0].src}
                        alt={product.images[0]?.alt || product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority={false}
                        loading="lazy"
                        quality={80}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-sm">Kein Bild verfügbar</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                      {/* Sale Badge - ✅ USE ROOT-LEVEL FIELDS */}
                      {product.on_sale && (
                        <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm shadow-md w-fit">
                          -{Math.round(product.has_setangebot ? (product.setangebot_ersparnis_prozent || 0) : (product.discount_percent || 0))}%
                        </div>
                      )}

                      {/* Aktion Badge - ✅ USE ROOT-LEVEL FIELDS */}
                      {product.show_aktion && product.aktion && (
                        <div className="bg-[#2e2d32] text-white px-3 py-1 rounded font-medium text-sm shadow-md">
                          {product.aktion}
                        </div>
                      )}

                      {/* Angebotspreis Hinweis Badge - ✅ USE ROOT-LEVEL FIELDS */}
                      {product.show_angebotspreis_hinweis && product.angebotspreis_hinweis && (
                        <div className="bg-black text-white px-3 py-1 rounded font-bold text-sm shadow-md">
                          {product.angebotspreis_hinweis}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Produktinfo-Bereich */}
                  <div className="bg-gray-100 p-4">
                    {/* Produktname */}
                    <h3 className="text-gray-900 font-medium text-base mb-3 line-clamp-2 min-h-[3rem]">
                      {product.name}
                    </h3>

                    {/* Produktbeschreibung als Liste mit Haken */}
                    {(() => {
                      const description = product.short_description || product.description || '';
                      if (!description) return null;

                      // HTML bereinigen und in Listenpunkte aufteilen
                      const cleanText = description
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<li[^>]*>/gi, '\n')
                        .replace(/<\/li>/gi, '')
                        .replace(/<ul[^>]*>|<\/ul>/gi, '')
                        .replace(/<ol[^>]*>|<\/ol>/gi, '')
                        .replace(/<p[^>]*>|<\/p>/gi, '\n')
                        .replace(/<[^>]+>/g, '')
                        .replace(/&nbsp;/g, ' ')
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .trim();

                      const points = cleanText
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line.length > 0 && line.length < 200)
                        .slice(0, 4); // Max 4 Punkte

                      if (points.length === 0) return null;

                      return (
                        <ul className="mb-3 space-y-1">
                          {points.map((point, index) => (
                            <li key={index} className="flex items-start text-xs text-gray-600">
                              <Image
                                src="/images/Icons/Haken schieferschwarz.png"
                                alt="Checkmark"
                                width={12}
                                height={12}
                                className="mr-1.5 flex-shrink-0 mt-0.5"
                              />
                              <span className="line-clamp-1">{point}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    })()}

                    {/* Trennlinie */}
                    <div className="h-[1px] bg-[#2e2d32] mx-8 mb-3" />

                    {/* Preisanzeige - ✅ USE ROOT-LEVEL FIELDS */}
                    {(() => {
                      const unit = product.einheit_short || 'm²';
                      const price = product.price || 0;
                      const regularPrice = product.regular_price || 0;
                      const hasDiscount = product.on_sale && regularPrice > price;

                      return (
                        <div className="space-y-1">
                          {/* Streichpreis wenn Rabatt vorhanden */}
                          {hasDiscount && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">Statt</span>
                              <span className="text-gray-500 line-through">
                                {regularPrice.toFixed(2).replace('.', ',')} €/{unit}
                              </span>
                            </div>
                          )}

                          {/* Hauptpreis */}
                          <div className="flex justify-between items-center">
                            <span className="text-gray-900 font-medium">Preis</span>
                            <span className={`font-bold text-xl ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                              {price.toFixed(2).replace('.', ',')} €/{unit}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </Link>
              </article>
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
                      ? 'bg-[#ed1b24] text-white border-[#ed1b24]'
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

        {/* Full Category Description at bottom */}
        {categoryDescription && categoryDescription.replace(/<[^>]+>/g, '').trim().length > 200 && (
          <div id="category-full-description" className="mt-16 bg-gray-100 rounded-md p-8">
            <h2 className="text-2xl font-bold text-[#2e2d32] mb-6">
              Über {categoryName}
            </h2>
            <div
              className="text-[#2e2d32] prose prose-lg max-w-none
                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#2e2d32] [&_h3]:mt-6 [&_h3]:mb-4
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#2e2d32] [&_h2]:mt-8 [&_h2]:mb-4
                [&_p]:text-[#2e2d32] [&_p]:leading-relaxed [&_p]:mb-4
                [&_ul]:text-[#2e2d32] [&_ul]:mb-4 [&_ul]:space-y-2
                [&_ol]:text-[#2e2d32] [&_ol]:mb-4 [&_ol]:space-y-2
                [&_li]:text-[#2e2d32] [&_li]:leading-relaxed
                [&_strong]:text-[#2e2d32] [&_strong]:font-semibold
                [&_em]:text-[#2e2d32]"
              dangerouslySetInnerHTML={{ __html: categoryDescription }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
