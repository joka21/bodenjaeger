'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useCheckout } from '@/contexts/CheckoutContext';

export default function OrderSummary() {
  const { items, totalPrice } = useCart();
  const { formData } = useCheckout();
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate shipping cost
  const shippingCost = formData.selectedShippingMethod
    ? parseFloat(formData.selectedShippingMethod.cost)
    : 0;

  // Calculate tax (19% VAT for Germany)
  const subtotal = totalPrice;
  const taxRate = 0.19;
  const taxAmount = subtotal * taxRate;

  // Calculate total including shipping
  const total = subtotal + shippingCost;

  return (
    <>
      {/* Mobile Collapsible Summary */}
      <div className="lg:hidden bg-gray-50 border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-4 flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="font-medium text-[#2e2d32]">
              {isExpanded ? 'Bestellübersicht ausblenden' : 'Bestellübersicht anzeigen'}
            </span>
          </div>
          <span className="font-semibold text-[#2e2d32]">{total.toFixed(2)} €</span>
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-200">
            <OrderSummaryContent
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              taxAmount={taxAmount}
              total={total}
              shippingMethodTitle={formData.selectedShippingMethod?.title}
            />
          </div>
        )}
      </div>

      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-[#2e2d32] mb-6">Bestellübersicht</h2>
          <OrderSummaryContent
            items={items}
            subtotal={subtotal}
            shippingCost={shippingCost}
            taxAmount={taxAmount}
            total={total}
            shippingMethodTitle={formData.selectedShippingMethod?.title}
          />
        </div>
      </div>
    </>
  );
}

interface OrderSummaryContentProps {
  items: any[];
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  shippingMethodTitle?: string;
}

function OrderSummaryContent({
  items,
  subtotal,
  shippingCost,
  taxAmount,
  total,
  shippingMethodTitle,
}: OrderSummaryContentProps) {
  return (
    <div className="space-y-4">
      {/* Cart Items */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex space-x-3">
            {/* Product Image */}
            <div className="relative w-16 h-16 bg-white rounded-lg border border-gray-200 flex-shrink-0 overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
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
              {/* Quantity Badge */}
              <div className="absolute -top-2 -right-2 bg-[#2e2d32] text-white text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center">
                {item.quantity}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-[#2e2d32] line-clamp-2">{item.name}</h3>
              {item.variation && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {Object.entries(item.variation)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ')}
                </p>
              )}
              <p className="text-sm font-semibold text-[#2e2d32] mt-1">
                {(item.price * item.quantity).toFixed(2)} €
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4" />

      {/* Price Breakdown */}
      <div className="space-y-2">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Zwischensumme</span>
          <span className="font-medium text-[#2e2d32]">{subtotal.toFixed(2)} €</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Versand {shippingMethodTitle && `(${shippingMethodTitle})`}
          </span>
          <span className="font-medium text-[#2e2d32]">
            {shippingCost > 0 ? `${shippingCost.toFixed(2)} €` : 'Noch nicht ausgewählt'}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Inkl. MwSt. (19%)</span>
          <span className="font-medium text-[#2e2d32]">{taxAmount.toFixed(2)} €</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-[#2e2d32]">Gesamt</span>
        <span className="text-2xl font-bold text-[#2e2d32]">{total.toFixed(2)} €</span>
      </div>

      {/* Info Text */}
      <div className="text-xs text-gray-500 mt-4">
        <p>Alle Preise inkl. gesetzlicher MwSt.</p>
      </div>
    </div>
  );
}
