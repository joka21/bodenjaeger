'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

export default function OrderSummary() {
  const { cartItems, totalPrice, itemCount } = useCart();
  const [discountCode, setDiscountCode] = useState('');

  // Berechne Zwischensumme, Versand, MwSt
  const subtotal = totalPrice;
  const shipping = subtotal >= 999 ? 0 : 49;
  const total = subtotal + shipping;
  const mwst = total * 0.19;

  return (
    <div className="sticky top-6">
      {/* Produkt-Liste */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => {
          const image = item.product.images?.[0]?.src || '/images/placeholder.jpg';
          const name = item.product.name;
          const pricePerUnit = item.product.price || 0;
          const einheit = item.product.einheit_short || 'm²';
          const totalItemPrice = pricePerUnit * item.quantity;

          return (
            <div key={item.id} className="flex flex-row items-start gap-3">
              {/* Bild mit Badge */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover rounded"
                  sizes="64px"
                />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#4c4c4c] text-white text-xs rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-medium text-[#2e2d32] line-clamp-2">{name}</p>
                <p className="text-xs text-[#4c4c4c]">
                  {pricePerUnit.toFixed(2).replace('.', ',')} €/{einheit}
                </p>
              </div>

              {/* Preis */}
              <span className="text-sm font-medium text-[#2e2d32]">
                {totalItemPrice.toFixed(2).replace('.', ',')} €
              </span>
            </div>
          );
        })}
      </div>

      {/* Rabattcode */}
      <div className="flex flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Rabattcode"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="flex-1 h-12 px-4 text-sm border border-[#e5e5e5] rounded-lg focus:outline-none focus:border-[#ed1b24]"
        />
        <button className="px-6 h-12 text-sm font-medium text-[#2e2d32] bg-[#f9f9fb] border border-[#e5e5e5] rounded-lg hover:bg-[#e5e5e5] transition-colors">
          Anwenden
        </button>
      </div>

      {/* Summen */}
      <div className="space-y-2 py-4 border-t border-[#e5e5e5]">
        <div className="flex justify-between text-sm text-[#4c4c4c]">
          <span>Zwischensumme · {itemCount} Artikel</span>
          <span>{subtotal.toFixed(2).replace('.', ',')} €</span>
        </div>
        <div className="flex justify-between text-sm text-[#4c4c4c]">
          <span>Versand</span>
          <span>{shipping === 0 ? 'Kostenlos' : `${shipping.toFixed(2).replace('.', ',')} €`}</span>
        </div>
      </div>

      {/* Gesamt */}
      <div className="flex justify-between items-baseline pt-4 border-t border-[#e5e5e5]">
        <div>
          <span className="text-lg font-semibold text-[#2e2d32]">Gesamt</span>
          <p className="text-xs text-[#4c4c4c]">
            inkl. {mwst.toFixed(2).replace('.', ',')} € MwSt
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#4c4c4c]">EUR</span>
          <span className="text-xl font-bold text-[#2e2d32] ml-1">
            {total.toFixed(2).replace('.', ',')} €
          </span>
        </div>
      </div>

      {/* Vorteile */}
      <div className="mt-6 p-4 bg-[#f9f9fb] rounded-lg">
        <h3 className="text-sm font-semibold text-[#2e2d32] mb-4">
          Deine Vorteile mit Bodenjäger
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-[#2e2d32] flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-[#2e2d32]">Trusted Shops Käuferschutz</p>
              <p className="text-xs text-[#4c4c4c]">
                Garantiert sicher einkaufen – deine Zahlung ist bis zu 30.000 € geschützt
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-[#2e2d32] flex-shrink-0"
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
            <div>
              <p className="text-sm font-medium text-[#2e2d32]">100 Tage Rückgaberecht</p>
              <p className="text-xs text-[#4c4c4c]">
                Du hast volle 100 Tage Zeit, deine Bestellung zurückzusenden
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-[#2e2d32] flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-[#2e2d32]">Kostenlose Lieferung ab 999 €</p>
              <p className="text-xs text-[#4c4c4c]">
                Bei Bestellungen über 999 € entfallen die Versandkosten
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
