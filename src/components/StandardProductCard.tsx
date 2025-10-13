'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StoreApiProduct } from '@/lib/woocommerce';

/**
 * Interface für Mock-Produktkarte (für Entwicklung)
 */
interface MockProduct {
  id: number;
  name: string;
  slug: string;
  images: Array<{
    src: string;
    alt: string;
  }>;
  _show_setangebot?: string;
  _setangebot_einzelpreis?: number;
  _setangebot_gesamtpreis?: number;
  _setangebot_ersparnis_prozent?: number;
  _aktion?: string;
  _einheit_short?: string;
}

/**
 * Union Type: Unterstützt sowohl WooCommerce als auch Mock-Produkte
 */
interface StandardProductCardProps {
  product: StoreApiProduct | MockProduct;
}

/**
 * Deutsche Preisformatierung: XX,XX €
 */
const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toFixed(2).replace('.', ',');
};

/**
 * Type Guard: Prüft ob Produkt ein WooCommerce-Produkt ist
 */
const isWooCommerceProduct = (product: StoreApiProduct | MockProduct): product is StoreApiProduct => {
  return 'price' in product && 'on_sale' in product;
};

/**
 * Standard-Produktkarte für Bodenjäger Shop
 *
 * Features:
 * - Multi-Image Slider mit Prev/Next Navigation
 * - Rabatt- und Aktions-Badges
 * - Set-Angebot Preisanzeige
 * - Responsive Design
 * - Hover-Effekte
 * - Vollständig klickbar (Link zu Produktseite)
 * - Unterstützt WooCommerce und Mock-Produkte
 */
export default function StandardProductCard({ product }: StandardProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  // Extrahiere Daten abhängig vom Produkttyp
  const isWoo = isWooCommerceProduct(product);

  let showSetAngebot = false;
  let discountPercent = 0;
  let vergleichspreis = 0;
  let aktuellerPreis = 0;
  let aktionsBadge = '';
  let unit = 'm²';

  if (isWoo) {
    // WooCommerce Produkt
    showSetAngebot = product.on_sale;
    const regularPrice = parseFloat(product.regular_price || product.price);
    const salePrice = parseFloat(product.sale_price || product.price);

    if (product.on_sale && regularPrice > 0) {
      discountPercent = Math.round(((regularPrice - salePrice) / regularPrice) * 100);
      vergleichspreis = regularPrice;
      aktuellerPreis = salePrice;
    } else {
      aktuellerPreis = parseFloat(product.price);
    }
  } else {
    // Mock Produkt
    showSetAngebot = product._show_setangebot === 'yes';
    discountPercent = product._setangebot_ersparnis_prozent ? Math.round(product._setangebot_ersparnis_prozent) : 0;
    vergleichspreis = product._setangebot_einzelpreis || 0;
    aktuellerPreis = product._setangebot_gesamtpreis || 0;
    aktionsBadge = product._aktion || '';
    unit = product._einheit_short || 'm²';
  }

  // Navigation Funktionen
  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };


  return (
    <article
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`}>
        {/* ===== BILDBEREICH MIT SLIDER ===== */}
        <div className="relative aspect-[4/3] bg-gray-200">
          {/* Hauptbild */}
          {images.length > 0 ? (
            <Image
              src={images[currentImageIndex]?.src}
              alt={images[currentImageIndex]?.alt || product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={false}
              loading="lazy"
              quality={80}
            />
          ) : (
            // Placeholder wenn kein Bild vorhanden
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-sm">Kein Bild verfügbar</span>
            </div>
          )}

          {/* ===== BADGES (Oben Links) ===== */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {/* Rabatt-Badge */}
            {showSetAngebot && discountPercent > 0 && (
              <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm shadow-md">
                -{discountPercent}%
              </div>
            )}

            {/* Aktion-Badge */}
            {aktionsBadge && (
              <div className="bg-[#2e2d32] text-white px-3 py-1 rounded font-medium text-sm shadow-md">
                {aktionsBadge}
              </div>
            )}
          </div>

          {/* ===== SLIDER NAVIGATION (Nur bei mehreren Bildern) ===== */}
          {hasMultipleImages && (
            <>
              {/* Previous Button */}
              <button
                onClick={goToPrevious}
                className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full flex items-center justify-center transition-all duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                aria-label="Vorheriges Bild"
              >
                {/* Chevron Left Icon (Inline SVG) */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={goToNext}
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full flex items-center justify-center transition-all duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                aria-label="Nächstes Bild"
              >
                {/* Chevron Right Icon (Inline SVG) */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Dots Indikator (Optional) */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ===== PRODUKTINFO-BEREICH ===== */}
        <div className="bg-gray-100 p-4">
          {/* Produktname */}
          <h3 className="text-gray-900 font-medium text-base mb-3 line-clamp-2">
            {product.name}
          </h3>

          {/* Trennlinie */}
          <div className="h-[1px] bg-[#2e2d32] mx-8 mb-3" />

          {/* Preisanzeige - Nur wenn Set-Angebot aktiv */}
          {showSetAngebot ? (
            <>
              {/* Preiszeile 1: Set-Angebot + Vergleichspreis */}
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-900 text-sm">Set-Angebot</span>
                {vergleichspreis > 0 && (
                  <span className="text-gray-500 line-through text-sm">
                    statt {formatPrice(vergleichspreis)}€/{unit}
                  </span>
                )}
              </div>

              {/* Preiszeile 2: Gesamt + Aktueller Preis */}
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium">Gesamt</span>
                <span className="text-red-600 font-bold text-xl">
                  {formatPrice(aktuellerPreis)} €/{unit}
                </span>
              </div>
            </>
          ) : (
            // Alternative Preisanzeige wenn kein Set-Angebot
            <div className="flex justify-between items-center">
              <span className="text-gray-900 font-medium">Preis</span>
              <span className="text-gray-900 font-bold text-xl">
                {formatPrice(aktuellerPreis)} €/{unit}
              </span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
