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
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      {/* Header with product name and remove button */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#2e2d32] flex-1">{product.name}</h3>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
          aria-label="Produkt entfernen"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Product details */}
      <div className="flex space-x-3">
        {/* Product image */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
        </div>

        {/* Product info and quantity */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Quantity stepper */}
          <div className="mb-2">
            <QuantityStepper value={product.quantity} onChange={onQuantityChange} />
          </div>

          {/* Unit info */}
          <div className="text-xs text-gray-600 mb-1">
            {getUnitDisplayText(product.unit, product.unitValue)}
          </div>

          {/* Price info */}
          <div className="flex items-center space-x-2">
            {product.originalPricePerUnit && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPricePerUnit)} €/{product.unit}
              </span>
            )}
            <span className="text-sm font-semibold text-[#d32f2f]">
              {formatPrice(product.pricePerUnit)} €/{product.unit}
            </span>
          </div>
        </div>

        {/* Total price */}
        <div className="flex flex-col items-end justify-end">
          <span className="text-lg font-bold text-[#2e2d32]">{formatPrice(product.total)} €</span>
        </div>
      </div>
    </div>
  );
}
