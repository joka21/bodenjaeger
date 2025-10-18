'use client';

import React from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/cart-utils';

interface CartFooterProps {
  subtotal: number;
  shipping: number;
  savings: number;
  total: number;
  onCheckout: () => void;
}

export default function CartFooter({
  subtotal,
  shipping,
  savings,
  total,
  onCheckout,
}: CartFooterProps) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-4">
      {/* Price breakdown */}
      <div className="space-y-2">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Zwischensumme</span>
          <span className="font-semibold text-[#2e2d32]">{formatPrice(subtotal)} €</span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Versandkosten</span>
          <span className="font-semibold text-[#2e2d32]">
            {shipping === 0 ? 'Kostenlos' : `${formatPrice(shipping)} €`}
          </span>
        </div>

        {/* Shipping info */}
        {shipping > 0 && (
          <div className="text-xs text-gray-500">
            {subtotal >= 250 && subtotal < 500
              ? 'Noch ' + formatPrice(500 - subtotal) + ' € bis zum kostenlosen Versand'
              : subtotal < 250
                ? 'Ab 500€ Bestellwert versandkostenfrei'
                : ''}
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-lg font-bold text-[#2e2d32]">Gesamtsumme</span>
          <span className="text-2xl font-bold text-[#2e2d32]">{formatPrice(total)} €</span>
        </div>

        {/* Savings */}
        {savings > 0 && (
          <div className="flex items-center justify-center py-2 bg-[#4CAF50]/10 rounded-lg">
            <svg
              className="w-5 h-5 text-[#4CAF50] mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-semibold text-[#4CAF50]">
              Du sparst {formatPrice(savings)} €
            </span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          className="flex items-center justify-center px-4 py-2 bg-white border-2 border-[#2e2d32] text-[#2e2d32] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Lieferwunsch"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">Lieferwunsch</span>
        </button>

        <button
          className="flex items-center justify-center px-4 py-2 bg-white border-2 border-[#2e2d32] text-[#2e2d32] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Anmerkung"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          <span className="text-sm">Anmerkung</span>
        </button>
      </div>

      {/* Checkout button */}
      <Link href="/checkout" onClick={onCheckout}>
        <button className="w-full py-4 bg-[#2e2d32] text-white font-bold text-lg rounded-lg hover:bg-[#1e1d22] transition-colors shadow-lg">
          Zur Kasse
        </button>
      </Link>

      {/* Discount code info */}
      <div className="text-center text-xs text-gray-500">
        Du hast einen Rabattcode? Den kannst du im Checkout eingeben.
      </div>
    </div>
  );
}
