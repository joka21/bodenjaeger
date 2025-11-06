'use client';

import React from 'react';
import Image from 'next/image';
import { CartSetItem as CartSetItemType, CartItemBase } from '@/types/cart-drawer';
import { formatPrice, getUnitDisplayText } from '@/lib/cart-utils';
import QuantityStepper from './QuantityStepper';

interface CartSetItemProps {
  setItem: CartSetItemType;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
}

export default function CartSetItem({ setItem, onQuantityChange, onRemove }: CartSetItemProps) {
  const { mainProduct, bundleProducts, setTotal } = setItem;

  return (
    <div className="bg-gray-100 rounded-md p-4 mb-3">
      {/* Main Product */}
      <div className="flex gap-3 items-start">
        {/* Main product image with X button */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
          {mainProduct.image ? (
            <Image
              src={mainProduct.image}
              alt={mainProduct.name}
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
            aria-label="Set entfernen"
          >
            ✕
          </button>
        </div>

        {/* Main product info with quantity stepper */}
        <div className="flex-1 min-w-0">
          {/* Product name */}
          <h3 className="font-bold text-sm text-[#2e2d32] leading-tight mb-1">
            {mainProduct.name}
          </h3>

          {/* Unit info */}
          <p className="text-xs text-gray-600 mb-2">
            {getUnitDisplayText(mainProduct.unit, mainProduct.unitValue)}
          </p>

          {/* Quantity stepper - only for main product */}
          <div className="mb-2">
            <QuantityStepper value={mainProduct.quantity} onChange={onQuantityChange} />
          </div>

          {/* Price info */}
          <div className="flex items-baseline gap-2">
            {mainProduct.originalPricePerUnit && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(mainProduct.originalPricePerUnit)} €/{mainProduct.unit}
              </span>
            )}
            <span className="text-sm font-bold text-[#ed1b24]">
              {formatPrice(mainProduct.pricePerUnit)} €/{mainProduct.unit}
            </span>
          </div>
        </div>

        {/* Main product total */}
        <div className="flex-shrink-0 text-right">
          <span className="text-lg font-bold text-[#2e2d32]">
            {formatPrice(mainProduct.total)} €
          </span>
        </div>
      </div>

      {/* Bundle Products (Accessories) */}
      {bundleProducts.length > 0 && (
        <div className="space-y-3 mt-3 pt-3 pl-3">
          {bundleProducts.map((bundleProduct) => (
            <BundleProductItem key={bundleProduct.id} product={bundleProduct} />
          ))}
        </div>
      )}

      {/* Set Total */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200">
        <span className="font-bold text-base text-[#2e2d32]">Gesamt:</span>
        <span className="text-lg font-bold text-[#2e2d32]">{formatPrice(setTotal)} €</span>
      </div>
    </div>
  );
}

// Bundle Product Component (used within CartSetItem)
function BundleProductItem({ product }: { product: CartItemBase }) {
  return (
    <div className="flex gap-3 items-start">
      {/* Bundle product image (smaller) */}
      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Bundle product info */}
      <div className="flex-1 min-w-0">
        {/* Product name */}
        <h4 className="font-medium text-sm text-[#2e2d32] leading-tight mb-1">{product.name}</h4>

        {/* Unit info */}
        <p className="text-xs text-gray-600 mb-1">
          {product.quantity} × {getUnitDisplayText(product.unit, product.unitValue)}
        </p>

        {/* Price info - special handling for free items */}
        {product.isFree ? (
          <div className="flex items-baseline gap-2">
            {product.originalPricePerUnit && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPricePerUnit)} €/{product.unit}
              </span>
            )}
            <span className="text-sm font-bold text-green-600">Kostenlos</span>
          </div>
        ) : (
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
        )}
      </div>

      {/* Bundle product total */}
      <div className="flex-shrink-0 text-right">
        <span className="text-base font-bold text-[#2e2d32]">
          {formatPrice(product.total)} €
        </span>
      </div>
    </div>
  );
}
