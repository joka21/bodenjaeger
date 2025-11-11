'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { StoreApiProduct } from '@/lib/woocommerce';

interface ImageGalleryProps {
  product: StoreApiProduct;
}

export default function ImageGallery({ product }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images || [];

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Kein Bild verfügbar</span>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];
  const jaegerMeta = product.jaeger_meta;

  // Calculate discount percentage
  let discountPercent = 0;
  if (product.on_sale) {
    const salePrice = product.prices?.sale_price
      ? parseFloat(product.prices.sale_price) / 100
      : parseFloat(product.sale_price) / 100;
    const regularPrice = product.prices?.regular_price
      ? parseFloat(product.prices.regular_price) / 100
      : parseFloat(product.regular_price || product.price) / 100;

    const comparePrice = (jaegerMeta?.show_uvp && jaegerMeta?.uvp && jaegerMeta.uvp > 0)
      ? jaegerMeta.uvp
      : regularPrice;

    if (comparePrice > 0 && salePrice < comparePrice) {
      discountPercent = Math.round(((comparePrice - salePrice) / comparePrice) * 100);
    }
  }

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      {/* Main Image */}
      <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden group">
        <Image
          src={currentImage.src}
          alt={currentImage.alt || product.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
          quality={90}
        />

        {/* Badges (top left) */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm shadow-md w-fit">
              -{discountPercent}%
            </div>
          )}

          {/* Aktion Badge */}
          {jaegerMeta?.show_aktion && jaegerMeta?.aktion && (
            <div className="bg-[#2e2d32] text-white px-3 py-1 rounded font-medium text-sm shadow-md">
              {jaegerMeta.aktion}
            </div>
          )}

          {/* Angebotspreis Hinweis Badge */}
          {jaegerMeta?.show_angebotspreis_hinweis && (
            <div className="bg-black text-white px-3 py-1 rounded font-bold text-sm shadow-md">
              {jaegerMeta.angebotspreis_hinweis || 'Angebot'}
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Nächstes Bild"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {images.slice(0, 3).map((image, index) => (
            <button
              key={image.id || index}
              onClick={() => selectImage(index)}
              className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                currentImageIndex === index
                  ? 'border-[#2e2d32] ring-2 ring-[#2e2d32] ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt || `${product.name} Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 150px"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
