'use client';

import Image from 'next/image';
import type { StoreApiProduct } from '@/lib/woocommerce';
import SetAngebot from './SetAngebot';

interface ProductInfoProps {
  product: StoreApiProduct;
  daemmungProduct?: StoreApiProduct | null;
  sockelleisteProduct?: StoreApiProduct | null;
  daemmungOptions?: StoreApiProduct[];
  sockelleisteOptions?: StoreApiProduct[];
  onProductSelection?: (daemmungPrice: number, sockelleistePrice: number) => void;
}

export default function ProductInfo({ product, daemmungProduct, sockelleisteProduct, daemmungOptions = [], sockelleisteOptions = [], onProductSelection }: ProductInfoProps) {
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

  // Get pricing information
  const basePrice = parseFloat(product.prices?.price || product.price || '0') / 100;
  const regularPrice = parseFloat(product.prices?.regular_price || product.regular_price || '0') / 100;
  const einheit = product.jaeger_meta?.einheit_short || 'm²';
  const productImage = product.images && product.images.length > 0
    ? product.images[0].src
    : '/images/placeholder.jpg';

  // Dämmung information from loaded product
  const daemmungName = daemmungProduct?.name || 'Trittschalldämmung';
  const daemmungImage = daemmungProduct?.images && daemmungProduct.images.length > 0
    ? daemmungProduct.images[0].src
    : '/images/placeholder.jpg';
  // Standard products are FREE in the set (price = 0)
  const daemmungSetPrice = 0; // Always 0 for standard products
  const daemmungRegularPrice = daemmungProduct?.prices?.price
    ? parseFloat(daemmungProduct.prices.price) / 100
    : parseFloat(daemmungProduct?.price || '0');
  const daemmungVE = daemmungProduct?.jaeger_meta?.paketinhalt
    ? `${daemmungProduct.jaeger_meta.paketinhalt}${daemmungProduct.jaeger_meta.einheit_short || 'm²'}`
    : undefined;

  // Sockelleiste information from loaded product
  const sockelleisteName = sockelleisteProduct?.name || 'Sockelleiste';
  const sockelleisteImage = sockelleisteProduct?.images && sockelleisteProduct.images.length > 0
    ? sockelleisteProduct.images[0].src
    : '/images/placeholder.jpg';
  // Standard products are FREE in the set (price = 0)
  const sockelleisteSetPrice = 0; // Always 0 for standard products
  const sockelleisteRegularPrice = sockelleisteProduct?.prices?.price
    ? parseFloat(sockelleisteProduct.prices.price) / 100
    : parseFloat(sockelleisteProduct?.price || '0');
  const sockelleisteVE = sockelleisteProduct?.jaeger_meta?.paketinhalt
    ? `${sockelleisteProduct.jaeger_meta.paketinhalt}${sockelleisteProduct.jaeger_meta.einheit_short || 'lfm'}`
    : undefined;
  const sockelleisteEinheit = sockelleisteProduct?.jaeger_meta?.einheit_short || 'lfm';

  return (
    <div className="space-y-6">
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

      {/* Set Angebot Component */}
      <div className="mt-6">
        <SetAngebot
          productName={product.name}
          productImage={productImage}
          basePrice={basePrice}
          regularPrice={regularPrice}
          einheit={einheit}
          daemmungName={daemmungName}
          daemmungImage={daemmungImage}
          daemmungPrice={daemmungSetPrice}
          daemmungRegularPrice={daemmungRegularPrice}
          daemmungVE={daemmungVE}
          daemmungOptions={daemmungOptions}
          sockelleisteName={sockelleisteName}
          sockelleisteImage={sockelleisteImage}
          sockelleistePrice={sockelleisteSetPrice}
          sockelleisteRegularPrice={sockelleisteRegularPrice}
          sockelleisteVE={sockelleisteVE}
          sockelleisteEinheit={sockelleisteEinheit}
          sockelleisteOptions={sockelleisteOptions}
          onProductSelection={onProductSelection}
        />
      </div>
    </div>
  );
}
