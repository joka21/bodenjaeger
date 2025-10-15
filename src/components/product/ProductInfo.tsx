'use client';

import Image from 'next/image';
import type { StoreApiProduct } from '@/lib/woocommerce';

interface ProductInfoProps {
  product: StoreApiProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  // Extract features from short_description or jaeger_meta
  const getFeaturesFromDescription = (html: string): string[] => {
    // Extract <li> items from HTML
    const matches = html.match(/<li>(.*?)<\/li>/g);
    if (matches) {
      return matches.map(match => match.replace(/<\/?li>/g, '').trim()).slice(0, 3);
    }
    return [];
  };

  let features: string[] = [];

  if (product.short_description) {
    features = getFeaturesFromDescription(product.short_description);
  }

  // Fallback: Create features from jaeger_meta if no features found
  if (features.length === 0 && product.jaeger_meta) {
    const meta = product.jaeger_meta;
    if (meta.text_produktuebersicht && meta.show_text_produktuebersicht) {
      features.push(meta.text_produktuebersicht);
    }
    if (meta.lieferzeit && meta.show_lieferzeit) {
      features.push(meta.lieferzeit);
    }
    if (meta.paketinhalt) {
      features.push(`Paketinhalt: ${meta.paketinhalt} ${meta.einheit_short || 'm²'}`);
    }
  }

  return (
    <div className="space-y-4">
      {/* Product Title */}
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
        {product.name}
      </h1>

      {/* Article Number */}
      <div className="text-sm text-gray-600">
        Art.Nr.: {product.sku || 'N/A'}
      </div>

      {/* Features List */}
      {features.length > 0 && (
        <div className="space-y-2 pt-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Image
                src="/images/Icons/Haken rot.png"
                alt="Check"
                width={20}
                height={20}
                className="flex-shrink-0 mt-0.5"
              />
              <span className="text-gray-700 text-sm leading-relaxed">
                {feature}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
