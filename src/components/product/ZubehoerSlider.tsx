'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { StoreApiProduct } from '@/lib/woocommerce';
import { useCart } from '@/contexts/CartContext';
import { shimmerBlurDataURL } from '@/lib/imageUtils';

interface ZubehoerCategory {
  name: string;
  metaKey: string; // Meta-Key für die Produkt-IDs (z.B. '_option_products_werkzeug')
}

interface ZubehoerSliderProps {
  product?: StoreApiProduct; // Hauptprodukt für Meta-Keys
  categories?: ZubehoerCategory[];
}

// Standard Kategorien (basierend auf Meta-Keys aus BACKEND-FELDER-DOKUMENTATION.md)
// WICHTIG: Backend verwendet _option_products_*, aber im jaeger_meta kommen sie ohne _ an
const DEFAULT_CATEGORIES: ZubehoerCategory[] = [
  { name: 'Zubehör für Sockelleisten', metaKey: 'option_products_zubehoer-fuer-sockelleisten' },
  { name: 'Werkzeug', metaKey: 'option_products_werkzeug' },
  { name: 'Kleber', metaKey: 'option_products_kleber' },
  { name: 'Montagekleber & Silikon', metaKey: 'option_products_montagekleber-silikon' },
  { name: 'Untergrundvorbereitung', metaKey: 'option_products_untergrundvorbereitung' },
  { name: 'Schienen & Profile', metaKey: 'option_products_schienen-profile' },
  { name: 'Reinigung & Pflege', metaKey: 'option_products_reinigung-pflege' },
];

/**
 * Zubehör-Slider Komponente für Produktdetailseiten
 *
 * Features:
 * - Linke Seite: Feste Info-Sektion mit "Weiter zum Warenkorb" Button
 * - Rechte Seite: Kategorie-Navigation + horizontaler Produkt-Slider
 * - WooCommerce API Integration
 * - CartContext Integration für "In den Warenkorb" Button
 * - Responsive Design (Desktop/Mobile)
 */
export default function ZubehoerSlider({
  product,
  categories = DEFAULT_CATEGORIES
}: ZubehoerSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<StoreApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  const { addToCart } = useCart();

  // Filtere Kategorien: Nur die anzeigen, die Produkt-IDs haben
  const availableCategories = categories.filter((category) => {
    const jaegerMeta = product?.jaeger_meta || {};
    const productIdsString = jaegerMeta[category.metaKey as keyof typeof jaegerMeta];
    return productIdsString && typeof productIdsString === 'string' && productIdsString.trim().length > 0;
  });

  const [activeCategory, setActiveCategory] = useState<string>('');

  // Setze die erste verfügbare Kategorie als aktiv, wenn noch keine ausgewählt ist
  useEffect(() => {
    if (!activeCategory && availableCategories.length > 0) {
      setActiveCategory(availableCategories[0].metaKey);
    }
  }, [availableCategories, activeCategory]);

  // Produkte für aktive Kategorie laden (aus Meta-Keys)
  useEffect(() => {
    const loadProducts = async () => {
      if (!activeCategory || !product) return;

      setLoading(true);
      setError(null);

      try {
        console.log(`🔍 Loading products for meta key: ${activeCategory}`);
        console.log('📦 Available jaeger_meta keys:', Object.keys(product.jaeger_meta || {}));

        // 1. Produkt-IDs aus jaeger_meta auslesen
        const jaegerMeta = product.jaeger_meta || {};
        const productIdsString = jaegerMeta[activeCategory as keyof typeof jaegerMeta];

        if (!productIdsString || typeof productIdsString !== 'string') {
          console.warn(`⚠️ No product IDs found for meta key: ${activeCategory}`);
          console.log(`💡 Available meta values:`, jaegerMeta);
          setProducts([]);
          setLoading(false);
          return;
        }

        console.log(`✅ Found product IDs string: ${productIdsString}`);

        // 2. Komma-getrennte IDs parsen
        const productIds = productIdsString
          .split(',')
          .map((id: string) => parseInt(id.trim()))
          .filter((id: number) => !isNaN(id) && id > 0);

        if (productIds.length === 0) {
          console.warn(`⚠️ No valid product IDs after parsing: ${productIdsString}`);
          setProducts([]);
          setLoading(false);
          return;
        }

        console.log(`📋 Parsed ${productIds.length} product IDs:`, productIds);

        // 3. Produkte über API-Route laden (server-side)
        const response = await fetch('/api/products/by-ids', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: productIds }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const loadedProducts: StoreApiProduct[] = await response.json();

        console.log(`✅ Loaded ${loadedProducts.length} products via API`);
        setProducts(loadedProducts);
      } catch (err) {
        console.error('❌ Error loading accessory products:', err);
        setError('Fehler beim Laden der Produkte');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [activeCategory, product]);

  // Scroll-Position prüfen
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [products]);

  // Scroll nach rechts
  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = 240; // Breite einer Karte + Gap
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // In den Warenkorb
  const handleAddToCart = (product: StoreApiProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('🛒 Adding product to cart:', product.name, product.id);
    addToCart(product, 1);

    // Visuelles Feedback
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 2000);
  };

  // Wenn keine Kategorien mit Produkten vorhanden sind, nichts anzeigen
  if (availableCategories.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* LINKE SEITE - Info Box (Fixed) */}
        <div className="lg:w-[280px] flex-shrink-0 bg-[#e5e5e5] p-6 lg:sticky lg:top-0 lg:self-start">
          <h2 className="text-2xl font-bold text-[#2e2d32] mb-4">
            Passendes Zubehör:
          </h2>

          <p className="text-base text-gray-700 mb-4">
            Hier findest du unsere Vorauswahl der passenden Zubehörprodukte zu deiner obigen Produktauswahl.
          </p>

          <p className="text-sm text-gray-600 mb-6">
            Die Anzahl der Produkte kannst du ganz einfach im Warenkorb anpassen.
          </p>

          <Link
            href="/cart"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-white font-bold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-bg-darkest)' }}
          >
            Weiter zum Warenkorb
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* RECHTE SEITE - Kategorien + Slider */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Kategorie-Navigation */}
          {availableCategories.length > 0 && (
            <div className="mb-6 overflow-x-auto scrollbar-hide">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 min-w-min">
                {availableCategories.map((category) => (
                  <button
                    key={category.metaKey}
                    onClick={() => setActiveCategory(category.metaKey)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between gap-2 whitespace-nowrap ${
                      activeCategory === category.metaKey
                        ? 'bg-gray-200 font-semibold text-gray-900'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex-1 text-left">
                      {category.name}
                    </span>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Produkt-Slider */}
          <div className="relative">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12 text-red-600">
                {error}
              </div>
            )}

            {/* Products */}
            {!loading && !error && products.length > 0 && (
              <>
                <div
                  ref={scrollContainerRef}
                  className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  {products.map((product) => {
                    const price = product.prices?.price
                      ? parseFloat(product.prices.price) / 100
                      : parseFloat(product.price) / 100;
                    const unit = product.jaeger_meta?.einheit_short || 'Stk.';

                    return (
                      <div
                        key={product.id}
                        className="flex-shrink-0 w-[220px] snap-start"
                      >
                        <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col relative">
                          <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
                            {/* Produktbild */}
                            <div className="relative aspect-square bg-gray-100">
                              {product.images.length > 0 ? (
                                <Image
                                  src={product.images[0]?.src}
                                  alt={product.images[0]?.alt || product.name}
                                  fill
                                  sizes="220px"
                                  className="object-contain p-4"
                                  loading="lazy"
                                  quality={75}
                                  placeholder="blur"
                                  blurDataURL={shimmerBlurDataURL(220, 220)}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">Kein Bild</span>
                                </div>
                              )}
                            </div>

                            {/* Produktinfo */}
                            <div className="p-3 flex-1 flex flex-col">
                              {/* Produktname */}
                              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                                {product.name}
                              </h3>

                              {/* Features mit Checkmarks */}
                              <div className="space-y-1 mb-3 flex-1">
                                {/* Paketinhalt */}
                                {product.jaeger_meta?.paketinhalt && (
                                  <div className="flex items-start gap-1.5 text-xs text-gray-600">
                                    <svg className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>{product.jaeger_meta.paketinhalt} Stück</span>
                                  </div>
                                )}

                                {/* Generic Features */}
                                <div className="flex items-start gap-1.5 text-xs text-gray-600">
                                  <svg className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  <span>Hochwertige Qualität</span>
                                </div>

                                <div className="flex items-start gap-1.5 text-xs text-gray-600">
                                  <svg className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  <span>Schnelle Lieferung</span>
                                </div>
                              </div>

                              {/* Preis */}
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                  {price.toFixed(2).replace('.', ',')}€
                                </div>
                                <div className="text-xs text-gray-500">
                                  pro {unit}
                                </div>
                              </div>
                            </div>
                          </Link>

                          {/* Warenkorb Button (absolute) */}
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className={`absolute bottom-3 left-3 w-10 h-10 rounded-full text-white flex items-center justify-center transition-all shadow-lg z-10 ${
                              addedProductId === product.id
                                ? 'bg-green-600 scale-110'
                                : 'bg-black hover:bg-gray-800'
                            }`}
                            aria-label="In den Warenkorb"
                          >
                            {addedProductId === product.id ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            )}
                          </button>
                        </article>
                      </div>
                    );
                  })}
                </div>

                {/* Scroll Right Button */}
                {canScrollRight && (
                  <button
                    onClick={scrollRight}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl text-gray-900 flex items-center justify-center transition-all z-10"
                    aria-label="Weitere Produkte"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </>
            )}

            {/* No Products */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Keine Produkte in dieser Kategorie gefunden.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hide scrollbar with CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
