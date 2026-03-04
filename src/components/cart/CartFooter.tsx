'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/cart-utils';

interface CartFooterProps {
  subtotal: number;
  shipping: number;
  savings: number;
  total: number;
  onCheckout: () => void;
  customerNote: string;
  onCustomerNoteChange: (note: string) => void;
  deliveryNote: string;
  onDeliveryNoteChange: (note: string) => void;
}

const MAX_NOTE_LENGTH = 500;

export default function CartFooter({
  subtotal,
  shipping,
  savings,
  total,
  onCheckout,
  customerNote,
  onCustomerNoteChange,
  deliveryNote,
  onDeliveryNoteChange,
}: CartFooterProps) {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [isDeliveryNoteOpen, setIsDeliveryNoteOpen] = useState(false);
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-4">
      {/* Price breakdown */}
      <div className="space-y-2">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Zwischensumme</span>
          <span className="font-semibold text-dark">{formatPrice(subtotal)} €</span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Versandkosten</span>
          <span className="font-semibold text-dark">
            {shipping === 0 ? 'Kostenlos' : `${formatPrice(shipping)} €`}
          </span>
        </div>

        {/* Shipping info */}
        {shipping > 0 && subtotal < 999 && (
          <div className="text-xs text-gray-500">
            Noch {formatPrice(999 - subtotal)} € bis zum kostenlosen Versand
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-lg font-bold text-dark">Gesamtsumme</span>
          <span className="text-2xl font-bold text-dark">{formatPrice(total)} €</span>
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
          className={`flex items-center justify-center px-4 py-2 border-2 font-semibold rounded-lg transition-colors relative ${
            isDeliveryNoteOpen
              ? 'bg-dark text-white border-dark'
              : 'bg-white border-dark text-dark hover:bg-gray-50'
          }`}
          aria-label="Lieferwunsch"
          onClick={() => { setIsDeliveryNoteOpen(!isDeliveryNoteOpen); if (!isDeliveryNoteOpen) setIsNoteOpen(false); }}
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
          {deliveryNote.trim().length > 0 && !isDeliveryNoteOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand rounded-full" />
          )}
        </button>

        <button
          className={`flex items-center justify-center px-4 py-2 border-2 font-semibold rounded-lg transition-colors relative ${
            isNoteOpen
              ? 'bg-dark text-white border-dark'
              : 'bg-white border-dark text-dark hover:bg-gray-50'
          }`}
          aria-label="Anmerkung"
          onClick={() => { setIsNoteOpen(!isNoteOpen); if (!isNoteOpen) setIsDeliveryNoteOpen(false); }}
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
          {customerNote.trim().length > 0 && !isNoteOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand rounded-full" />
          )}
        </button>
      </div>

      {/* Delivery note textarea */}
      {isDeliveryNoteOpen && (
        <div className="space-y-1">
          <textarea
            value={deliveryNote}
            onChange={(e) => onDeliveryNoteChange(e.target.value.slice(0, MAX_NOTE_LENGTH))}
            placeholder="z.B. Wunschtermin, Abladeort, telefonische Avisierung..."
            rows={3}
            maxLength={MAX_NOTE_LENGTH}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-dark resize-none"
          />
          <div className="text-xs text-gray-400 text-right">
            {deliveryNote.length}/{MAX_NOTE_LENGTH}
          </div>
        </div>
      )}

      {/* Note textarea */}
      {isNoteOpen && (
        <div className="space-y-1">
          <textarea
            value={customerNote}
            onChange={(e) => onCustomerNoteChange(e.target.value.slice(0, MAX_NOTE_LENGTH))}
            placeholder="z.B. Lieferwünsche, Anmerkungen zur Bestellung..."
            rows={3}
            maxLength={MAX_NOTE_LENGTH}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-dark resize-none"
          />
          <div className="text-xs text-gray-400 text-right">
            {customerNote.length}/{MAX_NOTE_LENGTH}
          </div>
        </div>
      )}

      {/* Checkout button */}
      <Link href="/checkout" onClick={onCheckout}>
        <button className="w-full py-4 bg-dark text-white font-bold text-lg rounded-lg hover:bg-[#1e1d22] transition-colors shadow-lg">
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
