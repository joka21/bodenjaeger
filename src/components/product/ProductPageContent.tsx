'use client';

import { useState, useMemo } from 'react';
import type { StoreApiProduct } from '@/lib/woocommerce';
import { calculateSetQuantities, calculateSetPrices } from '@/lib/setCalculations';
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
  const paketinhalt = product.jaeger_meta?.paketinhalt || 1;
  const einheit = product.jaeger_meta?.einheit_short || 'm²';

  // State for wanted m² (user input)
  const [wantedM2, setWantedM2] = useState(paketinhalt);

  // State for selected addition products
  const [selectedDaemmung, setSelectedDaemmung] = useState<StoreApiProduct | null>(daemmungProduct);
  const [selectedSockelleiste, setSelectedSockelleiste] = useState<StoreApiProduct | null>(sockelleisteProduct);

  // State for custom quantities (optional user overrides)
  const [customInsulationM2, setCustomInsulationM2] = useState<number | undefined>(undefined);
  const [customBaseboardLfm, setCustomBaseboardLfm] = useState<number | undefined>(undefined);

  // Calculate set quantities (packages for each product)
  const quantities = useMemo(() => {
    return calculateSetQuantities(
      wantedM2,
      product,
      selectedDaemmung,
      selectedSockelleiste,
      customInsulationM2,
      customBaseboardLfm
    );
  }, [wantedM2, product, selectedDaemmung, selectedSockelleiste, customInsulationM2, customBaseboardLfm]);

  // Calculate set prices (for display)
  const prices = useMemo(() => {
    return calculateSetPrices(
      quantities,
      product,
      daemmungProduct,
      selectedDaemmung,
      sockelleisteProduct,
      selectedSockelleiste
    );
  }, [quantities, product, daemmungProduct, selectedDaemmung, sockelleisteProduct, selectedSockelleiste]);

  // Handle quantity changes from QuantitySelector
  const handleQuantityChange = (newPackages: number, newSqm: number) => {
    setWantedM2(newSqm);
  };

  // Handle selected products from SetAngebot
  const handleProductSelection = (daemmung: StoreApiProduct | null, sockelleiste: StoreApiProduct | null) => {
    setSelectedDaemmung(daemmung);
    setSelectedSockelleiste(sockelleiste);
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
              onProductSelection={handleProductSelection}
            />

            {/* Quantity Selector */}
            <QuantitySelector
              paketinhalt={paketinhalt}
              einheit={einheit}
              onQuantityChange={handleQuantityChange}
            />

            {/* Total Price */}
            <TotalPrice
              quantities={quantities}
              prices={prices}
              einheit={einheit}
            />

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Individuelles Angebot anfragen
              </button>

              <AddToCartButton
                product={product}
                quantities={quantities}
                selectedDaemmung={selectedDaemmung}
                selectedSockelleiste={selectedSockelleiste}
              />
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
