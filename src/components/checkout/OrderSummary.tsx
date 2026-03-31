'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { calculateShippingCost } from '@/lib/shippingConfig';

interface OrderSummaryProps {
  shippingMethod?: 'delivery' | 'pickup';
}

export default function OrderSummary({ shippingMethod = 'delivery' }: OrderSummaryProps) {
  const { cartItems, totalPrice, itemCount } = useCart();
  const [discountCode, setDiscountCode] = useState('');

  // Berechne Zwischensumme, Versand, MwSt
  const subtotal = totalPrice;
  const shipping = shippingMethod === 'pickup' ? 0 : calculateShippingCost(subtotal, cartItems);
  const total = subtotal + shipping;
  const mwst = total - (total / 1.19);

  return (
    <div className="sticky top-6">
      {/* Produkt-Liste */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => {
          const image = item.product.images?.[0]?.src || '/images/placeholder.jpg';
          const name = item.product.name;
          const einheit = item.product.einheit_short || 'm²';
          const priceUnit = einheit;

          // Preise berechnen - KORREKT für Set-Angebote
          let pricePerUnit: number;
          let totalItemPrice: number;
          let displayAmount: number;

          if (item.isSetItem && item.setPricePerUnit !== undefined && item.actualM2 !== undefined) {
            // Set-Item: Verwende Set-Preise (als Zahl konvertieren)
            pricePerUnit = Number(item.setPricePerUnit);
            displayAmount = Number(item.actualM2);
            totalItemPrice = pricePerUnit * displayAmount;
          } else {
            // Regular Item
            const rawPrice = item.product.price || 0;
            pricePerUnit = Number(rawPrice);
            const paketinhalt = item.product.paketinhalt || 1;
            // Paketpreis = Einzelpreis × Paketinhalt (gilt für ALLE Einheiten)
            displayAmount = item.quantity * paketinhalt;
            totalItemPrice = pricePerUnit * paketinhalt * item.quantity;
          }

          const isFree = pricePerUnit === 0 && item.isSetItem;

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
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-mid text-white text-xs rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-medium text-dark line-clamp-2">{name}</p>
                {!isFree && (
                  <p className="text-xs text-mid">
                    {pricePerUnit.toFixed(2).replace('.', ',')} €/{priceUnit}
                  </p>
                )}
                {item.isSetItem && (
                  <p className="text-xs text-mid italic">
                    (Set-Angebot)
                  </p>
                )}
              </div>

              {/* Preis */}
              {isFree ? (
                <span className="text-sm font-semibold" style={{ color: 'var(--color-success)' }}>
                  Kostenlos
                </span>
              ) : (
                <span className="text-sm font-medium text-dark">
                  {totalItemPrice.toFixed(2).replace('.', ',')} €
                </span>
              )}
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
          className="flex-1 h-12 px-4 text-sm border border-ash rounded-lg focus:outline-none focus:border-brand"
        />
        <button className="px-6 h-12 text-sm font-medium text-dark bg-pale border border-ash rounded-lg hover:bg-ash transition-colors">
          Anwenden
        </button>
      </div>

      {/* Summen */}
      <div className="space-y-2 py-4 border-t border-ash">
        <div className="flex justify-between text-sm text-mid">
          <span>Zwischensumme · {itemCount} Artikel</span>
          <span>{subtotal.toFixed(2).replace('.', ',')} €</span>
        </div>
        <div className="flex justify-between text-sm text-mid">
          <span>{shippingMethod === 'pickup' ? 'Abholung' : 'Versand'}</span>
          <span>
            {shippingMethod === 'pickup'
              ? 'Kostenlos'
              : shipping === 0
                ? 'Kostenlos'
                : `${shipping.toFixed(2).replace('.', ',')} €`}
          </span>
        </div>
      </div>

      {/* Gesamt */}
      <div className="flex justify-between items-baseline pt-4 border-t border-ash">
        <div>
          <span className="text-lg font-semibold text-dark">Gesamt</span>
          <p className="text-xs text-mid">
            inkl. {mwst.toFixed(2).replace('.', ',')} € MwSt
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-mid">EUR</span>
          <span className="text-xl font-bold text-dark ml-1">
            {total.toFixed(2).replace('.', ',')} €
          </span>
        </div>
      </div>

      {/* Vorteile */}
      <div className="mt-6 p-4 bg-pale rounded-lg">
        <h3 className="text-sm font-semibold text-dark mb-4">
          Deine Vorteile mit Bodenjäger
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0">🛡️</span>
            <div>
              <p className="text-sm font-medium text-dark">Sicher einkaufen</p>
              <p className="text-xs text-mid">
                Mit Trusted Shops Käuferschutz und sicheren Zahlungsmethoden.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0">🚚</span>
            <div>
              <p className="text-sm font-medium text-dark">Schneller &amp; zuverlässiger Versand</p>
              <p className="text-xs text-mid">
                Wir versenden deine Bestellung schnell und sicher direkt zu dir nach Hause.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0">🏬</span>
            <div>
              <p className="text-sm font-medium text-dark">Online bestellen &amp; im Markt abholen</p>
              <p className="text-xs text-mid">
                Alle Artikel kannst du bequem online bestellen und bei uns im Markt abholen.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0">⭐</span>
            <div>
              <p className="text-sm font-medium text-dark">Fachberatung vom Bodenexperten</p>
              <p className="text-xs text-mid">
                Als Fachhändler beraten wir dich online und vor Ort im Markt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
