'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { StoreApiProduct } from '@/lib/woocommerce';

interface UnifiedProductCardProps {
  product: StoreApiProduct;
}

/**
 * Einheitliche Produktkarte für alle Übersichten
 * Basiert auf CategoryPageClient Design
 */
export default function UnifiedProductCard({ product }: UnifiedProductCardProps) {
  return (
    <article className="bg-white rounded-lg overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Bildbereich */}
        <div className="relative aspect-[4/3] bg-white">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]?.src || ''}
              alt={product.images[0]?.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              loading="lazy"
              quality={80}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-sm">Kein Bild</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {/* Sale Badge */}
            {product.on_sale && (
              <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm shadow-md w-fit">
                -{Math.round(product.has_setangebot ? (product.setangebot_ersparnis_prozent || 0) : (product.discount_percent || 0))}%
              </div>
            )}

            {/* Aktion Badge */}
            {product.show_aktion && product.aktion && (
              <div className="bg-[#2e2d32] text-white px-3 py-1 rounded font-medium text-sm shadow-md">
                {product.aktion}
              </div>
            )}

            {/* Angebotspreis Hinweis Badge */}
            {product.show_angebotspreis_hinweis && product.angebotspreis_hinweis && (
              <div className="bg-black text-white px-3 py-1 rounded font-bold text-sm shadow-md">
                {product.angebotspreis_hinweis}
              </div>
            )}
          </div>

        {/* Test Buttons on Border */}
        <div className="absolute left-0 right-0 flex justify-between px-4 z-10" style={{ bottom: '-2%' }}>
          <button
            className="text-white flex items-center justify-start gap-2"
            style={{
              backgroundColor: 'var(--color-bg-darkest)',
              height: '10px',
              padding: '1rem',
              borderRadius: '6px'
            }}
          >
            <Image
              src="/images/Icons/Favoriten weiß.png"
              alt="Wunschlist"
              width={16}
              height={16}
            />
            <div className="flex flex-col items-start">
              <span className="text-[0.65rem] leading-tight">Auf die</span>
              <span className="text-xs font-bold leading-tight">Merkliste</span>
            </div>
          </button>
          <button
            className="text-white flex items-center justify-start gap-2"
            style={{
              backgroundColor: 'var(--color-bg-darkest)',
              height: '10px',
              padding: '1rem',
              borderRadius: '6px'
            }}
          >
            <Image
              src="/images/Icons/Musterbox weiß.png"
              alt="Muster bestellen"
              width={16}
              height={16}
            />
            <div className="flex flex-col items-start">
              <span className="text-[0.65rem] leading-tight">Kostenloses</span>
              <span className="text-xs font-bold leading-tight">Muster</span>
            </div>
          </button>
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

          {/* Preisanzeige */}
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
  );
}
