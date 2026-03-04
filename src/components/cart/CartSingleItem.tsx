'use client';

import React from 'react';
import Image from 'next/image';
import { CartItemBase } from '@/types/cart-drawer';
import { formatPrice, formatUnitValue } from '@/lib/cart-utils';

interface CartSingleItemProps {
  product: CartItemBase;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
}

export default function CartSingleItem({
  product,
  onQuantityChange,
  onRemove,
}: CartSingleItemProps) {
  return (
    <div className="bg-pale rounded-md p-3 mb-3">
      <div className="flex flex-col gap-0.5">
        {/* Zeile 1: Bild + Produktname + Gesamtpreis rechtsbündig */}
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
          <div className="flex-1 flex items-start justify-between">
            <span className="text-sm font-semibold text-dark">{product.name}</span>
            <span className="text-sm font-semibold text-dark ml-2">
              {formatPrice(product.total)} €
            </span>
          </div>
        </div>

        {/* Zeile 2: X Pak./Stk. = Y m²/lfm */}
        {!product.isSample && product.unitValue > 1 && (
          <div className="ml-14 text-xs text-gray-500">
            {product.quantity} {product.unit} = {formatUnitValue(product.quantity * product.unitValue)} {product.contentUnit}
          </div>
        )}

        {/* Zeile 3: [- Menge +] Pak./Stk. + [X] rechtsbündig */}
        <div className="ml-14 flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            {product.isSample ? (
              // Samples: Locked to quantity 1
              <span className="text-xs text-mid italic">Nur 1 Stk. möglich</span>
            ) : (
              // Regular products: Quantity controls
              <>
                <div className="flex items-center border border-ash rounded">
                  <button
                    onClick={() => onQuantityChange(product.quantity - 1)}
                    disabled={product.quantity <= 1}
                    className="px-2 py-0.5 text-mid hover:bg-gray-50 disabled:opacity-50 text-sm"
                  >
                    −
                  </button>
                  <span className="px-2 py-0.5 text-sm text-dark min-w-[2rem] text-center">
                    {product.quantity}
                  </span>
                  <button
                    onClick={() => onQuantityChange(product.quantity + 1)}
                    className="px-2 py-0.5 text-mid hover:bg-gray-50 text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-mid">{product.unit}</span>
              </>
            )}
          </div>
          <button
            onClick={onRemove}
            className="text-mid hover:text-brand text-xl font-bold leading-none transition-colors"
            title="Produkt entfernen"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
