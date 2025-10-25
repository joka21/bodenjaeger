'use client';

import { useState } from 'react';
import type { StoreApiProduct } from '@/lib/woocommerce';
import type { SetQuantityCalculation, SetPriceCalculation } from '@/lib/setCalculations';
import { prepareSetForCart } from '@/lib/setCalculations';
import { useCart } from '@/contexts/CartContext';

interface TotalPriceProps {
  quantities: SetQuantityCalculation;
  prices: SetPriceCalculation;
  einheit: string;
  product: StoreApiProduct;
  selectedDaemmung: StoreApiProduct | null;
  selectedSockelleiste: StoreApiProduct | null;
  lieferzeit?: string;
}

export default function TotalPrice({
  quantities,
  prices,
  einheit,
  product,
  selectedDaemmung,
  selectedSockelleiste,
  lieferzeit = '3-7 Arbeitstage'
}: TotalPriceProps) {
  const [addedToCart, setAddedToCart] = useState(false);
  const { addSetToCart } = useCart();

  const {
    totalDisplayPrice,
    comparisonPriceTotal,
    savings,
    savingsPercent
  } = prices;

  const hasSavings = savings !== undefined && savings > 0;

  // Calculate total packages in set
  const totalPackages =
    quantities.floor.packages +
    (quantities.insulation?.packages || 0) +
    (quantities.baseboard?.packages || 0);

  // Handle add to cart
  const handleAddToCart = () => {
    const setBundle = prepareSetForCart(
      quantities,
      product,
      selectedDaemmung,
      selectedSockelleiste
    );

    addSetToCart(setBundle);
    setAddedToCart(true);

    setTimeout(() => setAddedToCart(false), 3000);
  };

  // Handle request quote
  const handleRequestQuote = () => {
    // TODO: Open contact form or mailto link
    window.location.href = '/kontakt';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 md:p-6">
      {/* 1. GESAMTSUMMEN-HEADER */}
      <div className="flex items-start justify-between mb-4 pb-4">
        <span className="text-gray-600 text-sm md:text-base font-normal">
          Gesamtsumme (inkl. MwSt.)
        </span>
        <div className="text-right">
          {hasSavings && comparisonPriceTotal && (
            <div className="text-gray-400 line-through text-sm md:text-base font-normal mb-1">
              {comparisonPriceTotal.toFixed(2).replace('.', ',')}€
            </div>
          )}
          <div className="text-black font-bold text-2xl md:text-3xl">
            {totalDisplayPrice.toFixed(2).replace('.', ',')}€
          </div>
        </div>
      </div>

      {/* 2. ERSPARNIS-BOX (Grün) */}
      {hasSavings && savings && savingsPercent && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4">
          <div className="text-green-700 font-semibold text-sm md:text-base">
            Du sparst {savings.toFixed(2).replace('.', ',')}€ ({savingsPercent.toFixed(0)}%)
          </div>
        </div>
      )}

      {/* 3. SET-INHALT LISTE */}
      <div className="mb-5 pb-4 border-b border-gray-100">
        <div className="text-gray-800 font-semibold text-sm md:text-base mb-3">
          Dein Set umfasst:
        </div>

        <div className="space-y-2 text-sm">
          {/* Floor */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700">
              Boden: {quantities.floor.packages} Paket(e)
            </span>
            <span className="text-gray-500">
              = {quantities.floor.actualM2.toFixed(2).replace('.', ',')} {einheit}
            </span>
          </div>

          {/* Insulation */}
          {quantities.insulation && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">
                Dämmung: {quantities.insulation.packages} Paket(e)
              </span>
              <span className="text-gray-500">
                = {quantities.insulation.actualM2.toFixed(2).replace('.', ',')} {einheit}
              </span>
            </div>
          )}

          {/* Baseboard */}
          {quantities.baseboard && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">
                Sockelleisten: {quantities.baseboard.packages} Paket(e)
              </span>
              <span className="text-gray-500">
                = {quantities.baseboard.actualLfm.toFixed(2).replace('.', ',')} lfm
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Success Message */}
      {addedToCart && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium text-sm">
            Set mit {totalPackages} Paketen erfolgreich in den Warenkorb gelegt!
          </span>
        </div>
      )}

      {/* 4. CTA BUTTONS */}
      <div className="space-y-3 mb-4">
        {/* Sekundär-Button: Individuelles Angebot */}
        <button
          type="button"
          onClick={handleRequestQuote}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm md:text-base py-3.5 px-5 rounded-lg transition-colors border border-gray-300"
        >
          Individuelles Angebot anfragen
        </button>

        {/* Primär-Button: In den Warenkorb */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.is_in_stock || addedToCart}
          className={`w-full font-semibold text-sm md:text-base py-3.5 px-5 rounded-lg transition-all ${
            product.is_in_stock
              ? addedToCart
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white'
              : 'bg-gray-400 cursor-not-allowed text-white'
          }`}
        >
          {product.is_in_stock ? (
            addedToCart ? (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Set hinzugefügt!
              </span>
            ) : (
              <div className="flex flex-col items-center">
                <span>Komplett-Set in den Warenkorb</span>
                <span className="text-xs opacity-90 mt-0.5">({totalPackages} Pakete)</span>
              </div>
            )
          ) : (
            'Nicht verfügbar'
          )}
        </button>
      </div>

      {/* 5. LIEFERHINWEIS */}
      <div className="text-center text-gray-500 text-xs md:text-sm pt-3 border-t border-gray-100">
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
          </svg>
          <span>{lieferzeit} oder im Markt abholen</span>
        </div>
      </div>
    </div>
  );
}
