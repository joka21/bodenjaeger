'use client';

import { useState } from 'react';
import type { StoreApiProduct } from '@/lib/woocommerce';
import type { SetQuantityCalculation } from '@/lib/setCalculations';
import { useCart } from '@/contexts/CartContext';

// Simple price interface - prices come from backend!
interface SetPrices {
  totalDisplayPrice: number;
  comparisonPriceTotal?: number;
  savings?: number;
  savingsPercent?: number;
}

interface TotalPriceProps {
  quantities: SetQuantityCalculation | null;
  prices: SetPrices | null;
  einheit: string;
  product: StoreApiProduct;
  selectedDaemmung: StoreApiProduct | null;
  selectedSockelleiste: StoreApiProduct | null;
  daemmungProduct: StoreApiProduct | null;  // Standard dämmung for price calculation
  sockelleisteProduct: StoreApiProduct | null;  // Standard sockelleiste for price calculation
  lieferzeit?: string;
}

export default function TotalPrice({
  quantities,
  prices,
  einheit,
  product,
  selectedDaemmung,
  selectedSockelleiste,
  daemmungProduct,
  sockelleisteProduct,
  lieferzeit = '3-7 Arbeitstage'
}: TotalPriceProps) {
  const [addedToCart, setAddedToCart] = useState(false);
  const { addSetToCart } = useCart();

  // Show loading state if data not yet available
  if (!quantities || !prices) {
    return (
      <div className="p-6 bg-white rounded-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

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

  // Handle add to cart - prepare with correct pricing
  const handleAddToCart = () => {
    // We need to pass pricing info to prepareSetForCart
    // For now, we'll create the bundle directly here with correct pricing

    // Calculate prices for each product (same logic as ProductPageContent.tsx)
    const bodenPricePerM2 = product.setangebot_gesamtpreis || product.price || 0;

    // Dämmung pricing (same logic as ProductPageContent.tsx)
    let daemmungSetPricePerUnit = 0;
    let daemmungRegularPricePerUnit = 0;
    if (selectedDaemmung && daemmungProduct && quantities.insulation) {
      const daemmungPricePerM2 = selectedDaemmung.price || 0;
      const standardDaemmungPrice = daemmungProduct.price || 0;

      const daemmungVerrechnung = selectedDaemmung.verrechnung ??
        Math.max(0, daemmungPricePerM2 - standardDaemmungPrice);

      const istStandard = daemmungVerrechnung === 0;
      const istBilliger = daemmungPricePerM2 < standardDaemmungPrice;

      daemmungSetPricePerUnit = (istStandard || istBilliger) ? 0 : daemmungVerrechnung;
      daemmungRegularPricePerUnit = daemmungPricePerM2;
    }

    // Sockelleiste pricing (same logic as ProductPageContent.tsx)
    let sockelleisteSetPricePerUnit = 0;
    let sockelleisteRegularPricePerUnit = 0;
    if (selectedSockelleiste && sockelleisteProduct && quantities.baseboard) {
      const sockelleistePricePerLfm = selectedSockelleiste.price || 0;
      const standardSockelleistePrice = sockelleisteProduct.price || 0;

      const sockelleisteVerrechnung = selectedSockelleiste.verrechnung ??
        Math.max(0, sockelleistePricePerLfm - standardSockelleistePrice);

      const istStandard = sockelleisteVerrechnung === 0;
      const istBilliger = sockelleistePricePerLfm < standardSockelleistePrice;

      sockelleisteSetPricePerUnit = (istStandard || istBilliger) ? 0 : sockelleisteVerrechnung;
      sockelleisteRegularPricePerUnit = sockelleistePricePerLfm;
    }

    // Create set bundle with pricing
    const setBundle = {
      floor: {
        product: product,
        packages: quantities.floor.packages,
        actualM2: quantities.floor.actualM2,
        setPricePerUnit: bodenPricePerM2,
        regularPricePerUnit: bodenPricePerM2,
      },
      insulation: selectedDaemmung && quantities.insulation ? {
        product: selectedDaemmung,
        packages: quantities.insulation.packages,
        actualM2: quantities.insulation.actualM2,
        setPricePerUnit: daemmungSetPricePerUnit,
        regularPricePerUnit: daemmungRegularPricePerUnit,
        standardProduct: product, // Reference for price calculation
      } : null,
      baseboard: selectedSockelleiste && quantities.baseboard ? {
        product: selectedSockelleiste,
        packages: quantities.baseboard.packages,
        actualLfm: quantities.baseboard.actualLfm,
        setPricePerUnit: sockelleisteSetPricePerUnit,
        regularPricePerUnit: sockelleisteRegularPricePerUnit,
        standardProduct: product, // Reference for price calculation
      } : null,
    };

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
    <div className="p-0">
      {/* 1. GESAMTSUMMEN-HEADER */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[#2e2d32] text-2xl md:text-3xl font-bold">
          Gesamtsumme <span className="text-base font-normal">(inkl. MwSt.)</span>
        </span>
        <div className="text-right">
          <div className="text-[#000000] font-bold text-[28px] md:text-[32px] leading-tight">
            {totalDisplayPrice.toFixed(2).replace('.', ',')}€
          </div>
        </div>
      </div>

      {/* 2. ERSPARNIS-BOX */}
      {hasSavings && (
        <div className="py-2 my-4">
          <div
            className="font-semibold text-sm md:text-base"
            style={{ color: '#28a745' }}
          >
            Du sparst {savings?.toFixed(2).replace('.', ',')}€ ({Math.round(savingsPercent || 0)}%)
          </div>
        </div>
      )}

      {/* Success Message */}
      {addedToCart && (
        <div className="bg-[#d4edda] border border-[#c3e6cb] text-[#155724] px-4 py-3 rounded-lg mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium text-sm">
            Set mit {totalPackages} Paketen erfolgreich in den Warenkorb gelegt!
          </span>
        </div>
      )}

      {/* 4. CTA BUTTONS */}
      <div className="grid grid-cols-2 gap-3 mt-5 mb-4">
        {/* Sekundär-Button: Individuelles Angebot */}
        <button
          type="button"
          onClick={handleRequestQuote}
          className="w-full bg-transparent border border-[#2e2d32] hover:bg-[#f5f5f5] text-[#2e2d32] font-semibold text-sm py-4 px-3 rounded-md transition-colors"
        >
          Individuelles Angebot anfragen
        </button>

        {/* Primär-Button: In den Warenkorb */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.is_in_stock || addedToCart}
          className={`w-full font-semibold text-sm py-4 px-3 rounded-lg transition-all ${
            product.is_in_stock
              ? addedToCart
                ? 'bg-[#155724] hover:bg-[#0f4419] text-white'
                : 'bg-[#2e2d32] hover:bg-[#1a1a1d] active:scale-[0.98] text-white'
              : 'bg-[#e5e5e5] cursor-not-allowed text-[#999999]'
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
              <span className="flex items-center justify-center gap-2">
                <img
                  src="/images/Icons/Warenkorb weiß.png"
                  alt=""
                  className="w-5 h-5"
                />
                In den Warenkorb
              </span>
            )
          ) : (
            'Nicht verfügbar'
          )}
        </button>
      </div>

      {/* 5. LIEFERHINWEIS */}
      <div className="text-left text-[#666666] text-[13px] md:text-sm pt-3 mt-3 border-t border-[#e5e5e5]">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
          </svg>
          <span><span className="font-bold">Lieferzeit:</span> {lieferzeit} oder im Markt abholen</span>
        </div>
      </div>
    </div>
  );
}
