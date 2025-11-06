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
    <div className="bg-gray-100 rounded-md p-4 mb-3">
      {/* Product details */}
      <div className="flex gap-3 items-start">
        {/* Product image with X button */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {/* X-Button on image */}
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs hover:bg-gray-400 transition-colors shadow-md"
            aria-label="Produkt entfernen"
          >
            ✕
          </button>
        </div>

        {/* Product info and quantity */}
        <div className="flex-1 min-w-0">
          {/* Product name */}
          <h3 className="font-bold text-sm text-[#2e2d32] leading-tight mb-1">
            {product.name}
          </h3>

          {/* Unit info */}
          <p className="text-xs text-gray-600 mb-2">
            {getUnitDisplayText(product.unit, product.unitValue)}
          </p>

          {/* Quantity stepper */}
          <div className="mb-2">
            <QuantityStepper value={product.quantity} onChange={onQuantityChange} />
          </div>

          {/* Price info */}
          <div className="flex items-baseline gap-2">
            {product.originalPricePerUnit && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPricePerUnit)} €/{product.unit}
              </span>
            )}
            <span className="text-sm font-bold text-[#ed1b24]">
              {formatPrice(product.pricePerUnit)} €/{product.unit}
            </span>
          </div>
        </div>

        {/* Total price */}
        <div className="flex-shrink-0 text-right">
          <span className="text-lg font-bold text-[#2e2d32]">
            {formatPrice(product.total)} €
          </span>
        </div>
      </div>

      {/* Gesamt-Zeile für Single Items */}
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
        <span className="font-bold text-base text-[#2e2d32]">Gesamt:</span>
        <span className="text-lg font-bold text-[#2e2d32]">
          {formatPrice(product.total)} €
        </span>
      </div>
    </div>
  );
}
