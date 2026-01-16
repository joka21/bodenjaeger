'use client';

import React from 'react';
import Image from 'next/image';
import { CartSetItem as CartSetItemType, CartItemBase } from '@/types/cart-drawer';
import { formatPrice, formatUnitValue } from '@/lib/cart-utils';

interface CartSetItemProps {
  setItem: CartSetItemType;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
}

export default function CartSetItem({ setItem, onQuantityChange, onRemove }: CartSetItemProps) {
  const { mainProduct, bundleProducts, setTotal } = setItem;

  // Calculate total m² for main product
  const totalM2 = mainProduct.quantity * mainProduct.unitValue;

  return (
    <div className="bg-[#f9f9fb] rounded-md p-3 mb-3">
      {/* Main Product (Boden) */}
      <div className="flex flex-col gap-0.5 pb-2 border-b border-[#e5e5e5]">
        {/* Zeile 1: Bild + "Boden • Produktname" + X */}
        <div className="flex flex-row items-start gap-2">
          <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden">
            {mainProduct.image ? (
              <Image
                src={mainProduct.image}
                alt={mainProduct.name}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <span className="flex-1 text-sm font-semibold text-[#2e2d32]">
            Boden • {mainProduct.name}
          </span>
          <button
            onClick={onRemove}
            className="text-[#4c4c4c] hover:text-[#ed1b24] text-xl font-bold leading-none transition-colors"
            title="Set entfernen"
          >
            ×
          </button>
        </div>

        {/* Zeile 2: X Pak. = Y m² */}
        <div className="ml-14 text-xs text-gray-500">
          {mainProduct.quantity} Pak. = {formatUnitValue(totalM2)} m²
        </div>

        {/* Zeile 3: ~~Alt€~~ Neu€/m² (mittig) + Gesamt€ (rechts) */}
        <div className="ml-14 flex items-center justify-end gap-4">
          <div className="flex items-center gap-2 flex-1 justify-center">
            {mainProduct.originalPricePerUnit && mainProduct.originalPricePerUnit !== mainProduct.pricePerUnit && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(mainProduct.originalPricePerUnit)}
              </span>
            )}
            <span className="text-sm font-semibold text-[#ed1b24]">
              {formatPrice(mainProduct.pricePerUnit)} €/m²
            </span>
          </div>
          <span className="text-sm font-semibold text-[#2e2d32]">
            {formatPrice(mainProduct.total)} €
          </span>
        </div>

        {/* Zeile 4: [- Menge +] Pak. + [X] rechtsbündig (schon oben) */}
        <div className="ml-14 flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-[#e5e5e5] rounded">
              <button
                onClick={() => onQuantityChange(mainProduct.quantity - 1)}
                disabled={mainProduct.quantity <= 1}
                className="px-2 py-0.5 text-[#4c4c4c] hover:bg-gray-50 disabled:opacity-50 text-sm"
              >
                −
              </button>
              <span className="px-2 py-0.5 text-sm text-[#2e2d32] min-w-[2rem] text-center">
                {mainProduct.quantity}
              </span>
              <button
                onClick={() => onQuantityChange(mainProduct.quantity + 1)}
                className="px-2 py-0.5 text-[#4c4c4c] hover:bg-gray-50 text-sm"
              >
                +
              </button>
            </div>
            <span className="text-xs text-[#4c4c4c]">Pak.</span>
          </div>
        </div>
      </div>

      {/* Bundle Products (Dämmung, Sockelleiste) */}
      {bundleProducts.map((bundleProduct) => (
        <BundleProductItem key={bundleProduct.id} product={bundleProduct} />
      ))}

      {/* Set Total */}
      <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#e5e5e5]">
        <span className="font-bold text-sm text-[#2e2d32]">Gesamt:</span>
        <span className="text-base font-bold text-[#2e2d32]">{formatPrice(setTotal)} €</span>
      </div>
    </div>
  );
}

// Bundle Product Component (Dämmung, Sockelleiste)
function BundleProductItem({ product }: { product: CartItemBase }) {
  // Determine product type label from itemType (preferred) or fallback to unit
  const getTypeLabel = () => {
    if (product.itemType === 'baseboard') {
      return 'Sockelleiste';
    } else if (product.itemType === 'insulation') {
      return 'Dämmung';
    }
    // Fallback: unit-basierte Erkennung
    if (product.unit === 'Stk.' || product.unit === 'lfm' || product.unit === 'm') {
      return 'Sockelleiste';
    }
    return 'Dämmung';
  };

  const typeLabel = getTypeLabel();
  const isBaseboard = product.itemType === 'baseboard' || typeLabel === 'Sockelleiste';

  // Calculate total quantity × unitValue - handle invalid values
  const totalValue = (product.quantity && product.unitValue)
    ? product.quantity * product.unitValue
    : 0;
  const unitDisplay = isBaseboard ? 'm' : 'm²';

  // Determine package unit display (Pak. für Dämmung, Stk. für Sockelleiste)
  const packageUnit = isBaseboard ? 'Stk.' : 'Pak.';

  // Debug log
  console.log('🔧 BundleProduct:', {
    name: product.name,
    type: typeLabel,
    quantity: product.quantity,
    unitValue: product.unitValue,
    totalValue,
    unit: product.unit,
    packageUnit
  });

  return (
    <div className="flex flex-col gap-0.5 py-2 border-b border-[#e5e5e5] last:border-b-0">
      {/* Zeile 1: Bild + "Dämmung" / "Sockelleiste" */}
      <div className="flex flex-row items-start gap-2">
        <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <span className="flex-1 text-sm font-semibold text-[#2e2d32]">
          {typeLabel}
        </span>
      </div>

      {/* Zeile 2: Produktname */}
      <div className="ml-14 text-xs text-[#2e2d32]">
        {product.name}
      </div>

      {/* Zeile 3: X Pak./Stk. = Y m²/m */}
      <div className="ml-14 text-xs text-gray-500">
        {product.quantity} {packageUnit} = {formatUnitValue(totalValue)} {unitDisplay}
      </div>

      {/* Zeile 4: ~~Alt€~~ Neu€/Einheit (mittig) + Gesamt€ (rechts) */}
      <div className="ml-14 flex items-center justify-end gap-4">
        <div className="flex items-center gap-2 flex-1 justify-center">
          {product.originalPricePerUnit && product.originalPricePerUnit !== product.pricePerUnit && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPricePerUnit)}
            </span>
          )}
          <span className="text-sm font-semibold text-[#ed1b24]">
            {formatPrice(product.pricePerUnit)} €/{unitDisplay}
          </span>
        </div>
        <span className="text-sm font-semibold text-[#2e2d32]">
          {formatPrice(product.total)} €
        </span>
      </div>
    </div>
  );
}
