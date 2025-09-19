'use client';

import { useState } from 'react';
import { StoreApiProduct } from '@/lib/woocommerce';
import Link from 'next/link';
import Image from 'next/image';

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

interface ProductCardProps {
  product: ExtendedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { jaeger_meta } = product;
  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!jaeger_meta?.uvp || !jaeger_meta?.paketpreis) return 0;
    return Math.round(((jaeger_meta.uvp - jaeger_meta.paketpreis) / jaeger_meta.uvp) * 100);
  };

  const discount = calculateDiscount();

  // Get main price - prioritize paketpreis, fallback to regular price
  const getMainPrice = () => {
    if (jaeger_meta?.paketpreis) {
      return `${jaeger_meta.paketpreis.toFixed(2)} €/${jaeger_meta.einheit_short || 'm²'}`;
    }

    // Fallback to WooCommerce price
    const price = product.prices?.price ?
      (parseFloat(product.prices.price) / 100).toFixed(2) :
      product.price;
    return `${price} €`;
  };

  // Get strike price (UVP)
  const getStrikePrice = () => {
    if (jaeger_meta?.uvp && jaeger_meta?.show_uvp) {
      return `statt ${jaeger_meta.uvp.toFixed(2)} €/${jaeger_meta.einheit_short || 'm²'}`;
    }
    return null;
  };

  // Navigation functions
  const goToPrevious = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(prev =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // Dummy features for now
  const features = [
    'Wasserfest',
    'Langlebig',
    'Pflegeleicht',
    'Kratzer-resistent'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Section with Slider */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {/* Main Image */}
        {images.length > 0 ? (
          <Image
            src={images[currentImageIndex]?.src}
            alt={images[currentImageIndex]?.alt || product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">Kein Bild</span>
          </div>
        )}

        {/* Sale Badge (Top Left) */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
            -{discount}%
          </div>
        )}

        {/* Action Badge (Top Right) */}
        {jaeger_meta?.show_aktion && jaeger_meta?.aktion && (
          <div className="absolute top-3 right-3 bg-gray-900 text-white px-3 py-1 rounded text-sm font-medium">
            {jaeger_meta.aktion}
          </div>
        )}

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Action Buttons (Bottom of Image) */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-center space-x-2">
          <button className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-3 py-1 rounded text-xs font-medium transition-colors">
            💖 Merkliste
          </button>
          <button className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-3 py-1 rounded text-xs font-medium transition-colors">
            📐 Bodenplaner
          </button>
          <button className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-3 py-1 rounded text-xs font-medium transition-colors">
            🎨 Muster
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-3">
            {product.name}
          </h3>
        </Link>

        {/* Features List */}
        <div className="mb-4">
          <ul className="space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Set-Angebot Section */}
        {jaeger_meta?.show_setangebot && (
          <div className="border-t pt-4">
            <div className="mb-2">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {jaeger_meta.setangebot_titel || 'Set-Angebot'}
              </h4>
              <p className="text-xs text-gray-600">
                Inkl. Sockelleiste und Dämmung
              </p>
            </div>

            {/* Pricing */}
            <div className="space-y-1">
              {/* Strike Price */}
              {getStrikePrice() && (
                <div className="text-sm text-gray-500 line-through">
                  {getStrikePrice()}
                </div>
              )}

              {/* Main Price */}
              <div className="text-xl font-bold text-red-600">
                {getMainPrice()}
              </div>

              {/* Price Hint */}
              {jaeger_meta?.show_angebotspreis_hinweis && jaeger_meta?.angebotspreis_hinweis && (
                <div className="text-xs text-gray-500">
                  {jaeger_meta.angebotspreis_hinweis}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Regular Pricing (if no Set-Angebot) */}
        {!jaeger_meta?.show_setangebot && (
          <div className="border-t pt-4">
            <div className="space-y-1">
              {/* Strike Price */}
              {getStrikePrice() && (
                <div className="text-sm text-gray-500 line-through">
                  {getStrikePrice()}
                </div>
              )}

              {/* Main Price */}
              <div className="text-xl font-bold text-gray-900">
                {getMainPrice()}
              </div>
            </div>
          </div>
        )}

        {/* Product Overview Text */}
        {jaeger_meta?.show_text_produktuebersicht && jaeger_meta?.text_produktuebersicht && (
          <div className="mt-3 text-sm text-gray-600">
            {jaeger_meta.text_produktuebersicht}
          </div>
        )}

        {/* Delivery Time */}
        {jaeger_meta?.show_lieferzeit && jaeger_meta?.lieferzeit && (
          <div className="mt-2 text-xs text-green-600">
            🚚 {jaeger_meta.lieferzeit}
          </div>
        )}
      </div>
    </div>
  );
}