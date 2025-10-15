'use client';

import { useState } from 'react';
import type { StoreApiProduct } from '@/lib/woocommerce';
import ImageGallery from './ImageGallery';
import ProductInfo from './ProductInfo';
import QuantitySelector from './QuantitySelector';
import TotalPrice from './TotalPrice';
import AddToCartButton from '@/app/products/[slug]/AddToCartButton';

interface ProductPageContentProps {
  product: StoreApiProduct;
  daemmungProduct: StoreApiProduct | null;
  sockelleisteProduct: StoreApiProduct | null;
  daemmungOptions: StoreApiProduct[];
  sockelleisteOptions: StoreApiProduct[];
}

export default function ProductPageContent({
  product,
  daemmungProduct,
  sockelleisteProduct,
  daemmungOptions,
  sockelleisteOptions
}: ProductPageContentProps) {
  // State for quantity and sqm
  const paketinhalt = product.jaeger_meta?.paketinhalt || 1;
  const [packages, setPackages] = useState(1);
  const [sqm, setSqm] = useState(paketinhalt);

  // Get paketpreis values
  const paketpreis = product.jaeger_meta?.paketpreis || 0;
  const paketpreis_s = product.jaeger_meta?.paketpreis_s;
  const einheit = product.jaeger_meta?.einheit_short || 'm²';

  // Handle quantity changes from QuantitySelector
  const handleQuantityChange = (newPackages: number, newSqm: number) => {
    setPackages(newPackages);
    setSqm(newSqm);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Product Section - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 mb-12">
          {/* LEFT COLUMN - Image Gallery */}
          <div className="space-y-6">
            <ImageGallery product={product} />

            {/* Action Buttons - Placeholder for now */}
            <div className="grid grid-cols-2 gap-4">
              <button className="px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
                📦 Kostenloses Muster bestellen
              </button>
              <button className="px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
                🏠 Virtuell im Bodenplaner ansehen
              </button>
            </div>

            {/* Service Icons - Placeholder for now */}
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <span>📞</span>
                <span>Persönliche Beratung unter 0800 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <span>📦</span>
                <span>Kostenlose Einlagerung bis zu 6 Monate</span>
              </div>
              <div className="flex items-center gap-3">
                <span>🚚</span>
                <span>Lieferung zum Wunschtermin</span>
              </div>
              <div className="flex items-center gap-3">
                <span>💰</span>
                <span>Kostenlose Lieferung ab 999€</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Product Info & Cart */}
          <div className="space-y-6">
            <ProductInfo
              product={product}
              daemmungProduct={daemmungProduct}
              sockelleisteProduct={sockelleisteProduct}
              daemmungOptions={daemmungOptions}
              sockelleisteOptions={sockelleisteOptions}
            />

            {/* Quantity Selector */}
            <QuantitySelector
              paketinhalt={paketinhalt}
              einheit={einheit}
              onQuantityChange={handleQuantityChange}
            />

            {/* Total Price */}
            <TotalPrice
              paketpreis={paketpreis}
              paketpreis_s={paketpreis_s}
              packages={packages}
              sqm={sqm}
              einheit={einheit}
            />

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Individuelles Angebot anfragen
              </button>

              <AddToCartButton product={product} />
            </div>

            {/* Lieferzeit */}
            {product.jaeger_meta?.show_lieferzeit && product.jaeger_meta?.lieferzeit && (
              <div className="text-sm text-gray-600 text-center">
                🚚 {product.jaeger_meta.lieferzeit}
              </div>
            )}
          </div>
        </div>

        {/* Placeholder sections for later */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Passendes Zubehör
          </h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Produktdetails
          </h2>
          {product.description && (
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
