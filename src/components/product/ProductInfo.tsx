'use client';

import Image from 'next/image';
import type { StoreApiProduct } from '@/lib/woocommerce';
import SetAngebot from './SetAngebot';
import SetAngebotMobile from './SetAngebotMobile';

interface ProductInfoProps {
  product: StoreApiProduct;
  daemmungProduct?: StoreApiProduct | null;
  sockelleisteProduct?: StoreApiProduct | null;
  daemmungOptions?: StoreApiProduct[];
  sockelleisteOptions?: StoreApiProduct[];
  onProductSelection?: (daemmung: StoreApiProduct | null, sockelleiste: StoreApiProduct | null) => void;
  // Correct prices from setCalculations
  comparisonPriceTotal?: number;
  totalDisplayPrice?: number;
  savingsAmount?: number;
  savingsPercent?: number;
}

export default function ProductInfo({
  product,
  daemmungProduct,
  sockelleisteProduct,
  daemmungOptions = [],
  sockelleisteOptions = [],
  onProductSelection,
  comparisonPriceTotal,
  totalDisplayPrice,
  savingsAmount,
  savingsPercent
}: ProductInfoProps) {
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

  // ✅ Fallback: Create features from ROOT-LEVEL FIELDS if no features found
  if (features.length === 0) {
    if (product.text_produktuebersicht && product.show_text_produktuebersicht) {
      features.push(product.text_produktuebersicht);
    }
    if (product.lieferzeit && product.show_lieferzeit) {
      features.push(product.lieferzeit);
    }
    if (product.paketinhalt) {
      features.push(`Paketinhalt: ${product.paketinhalt} ${product.einheit_short || 'm²'}`);
    }
  }

  // ✅ Get pricing information from ROOT-LEVEL FIELDS (backend/ROOT_LEVEL_FIELDS.md)
  const paketinhalt = product.paketinhalt || 1;
  const paketpreis = product.paketpreis || 0;
  const paketpreisS = product.paketpreis_s;

  // Calculate price per unit (€/m²)
  const basePrice = (paketpreisS !== undefined && paketpreisS !== null && paketpreisS > 0)
    ? paketpreisS / paketinhalt
    : paketpreis / paketinhalt;
  const regularPrice = paketpreis / paketinhalt;
  const einheit = product.einheit_short || 'm²';
  const productImage = product.images && product.images.length > 0
    ? product.images[0].src
    : '/images/placeholder.jpg';

  // ✅ Dämmung information from loaded product - USE ROOT-LEVEL FIELDS
  const daemmungName = daemmungProduct?.name || 'Trittschalldämmung';
  const daemmungImage = daemmungProduct?.images && daemmungProduct.images.length > 0
    ? daemmungProduct.images[0].src
    : '/images/placeholder.jpg';
  // Standard products are FREE in the set (price = 0)
  const daemmungSetPrice = 0; // Always 0 for standard products
  const daemmungPaketpreis = daemmungProduct?.paketpreis || 0;
  const daemmungPaketinhalt = daemmungProduct?.paketinhalt || 1;
  const daemmungRegularPrice = daemmungPaketpreis / daemmungPaketinhalt;
  const daemmungVE = daemmungProduct?.paketinhalt
    ? `${daemmungProduct.paketinhalt}${daemmungProduct.einheit_short || 'm²'}`
    : undefined;

  // ✅ Sockelleiste information from loaded product - USE ROOT-LEVEL FIELDS
  const sockelleisteName = sockelleisteProduct?.name || 'Sockelleiste';
  const sockelleisteImage = sockelleisteProduct?.images && sockelleisteProduct.images.length > 0
    ? sockelleisteProduct.images[0].src
    : '/images/placeholder.jpg';
  // Standard products are FREE in the set (price = 0)
  const sockelleisteSetPrice = 0; // Always 0 for standard products
  const sockelleistePaketpreis = sockelleisteProduct?.paketpreis || 0;
  const sockelleistePaketinhalt = sockelleisteProduct?.paketinhalt || 1;
  const sockelleisteRegularPrice = sockelleistePaketpreis / sockelleistePaketinhalt;
  const sockelleisteVE = sockelleisteProduct?.paketinhalt
    ? `${sockelleisteProduct.paketinhalt}${sockelleisteProduct.einheit_short || 'lfm'}`
    : undefined;
  const sockelleisteEinheit = sockelleisteProduct?.einheit_short || 'lfm';

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

      {/* Set Angebot Component - Desktop */}
      <div className="mt-6 hidden md:block">
        <SetAngebot
          setangebotTitel={product.setangebot_titel || undefined}
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
          comparisonPriceTotal={comparisonPriceTotal}
          totalDisplayPrice={totalDisplayPrice}
          savingsAmount={savingsAmount}
          savingsPercent={savingsPercent}
        />
      </div>

      {/* Set Angebot Component - Mobile */}
      <div className="mt-6 md:hidden">
        <SetAngebotMobile
          setangebotTitel={product.setangebot_titel || undefined}
          productName={product.name}
          productImage={productImage}
          basePrice={basePrice}
          regularPrice={regularPrice}
          einheit={einheit}
          daemmungName={daemmungName}
          daemmungImage={daemmungImage}
          daemmungPrice={daemmungSetPrice}
          daemmungRegularPrice={daemmungRegularPrice}
          sockelleisteName={sockelleisteName}
          sockelleisteImage={sockelleisteImage}
          sockelleistePrice={sockelleisteSetPrice}
          sockelleisteRegularPrice={sockelleisteRegularPrice}
          comparisonPriceTotal={comparisonPriceTotal}
          totalDisplayPrice={totalDisplayPrice}
          savingsPercent={savingsPercent}
        />
      </div>
    </div>
  );
}
