'use client';

import React from 'react';
import Image from 'next/image';
import { CartItemBase } from '@/types/cart-drawer';
import { formatPrice, getUnitDisplayText } from '@/lib/cart-utils';
import QuantityStepper from './QuantityStepper';

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
    <div className="bg-gray-50 rounded-md p-3 mb-3">
      <div className="flex flex-col gap-1">
        {/* Zeile 1: Bild + Name + X-Button */}
        <div className="flex flex-row items-start gap-3">
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
          <span className="flex-1 text-sm font-medium text-[#2e2d32]">{product.name}</span>
          <button
            onClick={onRemove}
            className="text-[#4c4c4c] hover:text-[#ed1b24] text-xl leading-none transition-colors"
            title="Produkt entfernen"
          >
            ×
          </button>
        </div>

        {/* Zeile 2: Quantity + Menge */}
        <div className="flex flex-row items-center gap-2">
          {/* Quantity Control */}
          <div className="flex items-center border border-[#e5e5e5] rounded">
            <button
              onClick={() => onQuantityChange(product.quantity - 1)}
              disabled={product.quantity <= 1}
              className="px-2 py-1 text-[#4c4c4c] hover:bg-gray-50 disabled:opacity-50"
            >
              −
            </button>
            <span className="px-2 py-1 text-sm text-[#2e2d32] min-w-[2rem] text-center">
              {product.quantity}
            </span>
            <button
              onClick={() => onQuantityChange(product.quantity + 1)}
              className="px-2 py-1 text-[#4c4c4c] hover:bg-gray-50"
            >
              +
            </button>
          </div>
          <span className="text-sm text-[#4c4c4c]">
            {product.quantity} {getUnitDisplayText(product.unit, product.unitValue)}
          </span>
        </div>

        {/* Zeile 3: Preise */}
        <div className="flex flex-row items-center justify-end gap-2">
          {product.originalPricePerUnit && (
            <span className="text-sm text-[#4c4c4c] line-through">
              {formatPrice(product.originalPricePerUnit)} €/{product.unit}
            </span>
          )}
          <span className="text-sm font-semibold text-[#ed1b24]">
            {formatPrice(product.pricePerUnit)} €/{product.unit}
          </span>
          <span className="text-sm font-semibold text-[#2e2d32]">
            Gesamt: {formatPrice(product.total)} €
          </span>
        </div>
      </div>
    </div>
  );
}
