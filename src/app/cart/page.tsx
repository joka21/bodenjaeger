'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const {
    cartItems,
    itemCount,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="content-container">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <svg
                className="mx-auto w-24 h-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3m4 10v6a2 2 0 002 2h8a2 2 0 002-2v-6m-12 0h12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Ihr Warenkorb ist leer
            </h1>
            <p className="text-gray-600 mb-8">
              Fügen Sie Produkte hinzu, um mit dem Einkaufen zu beginnen.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Jetzt einkaufen
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 overflow-hidden">
      <div className="content-container">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900">
              Warenkorb ({itemCount} {itemCount === 1 ? 'Artikel' : 'Artikel'})
            </h1>
          </div>

          {/* Cart Items */}
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => {
              const paketinhalt = item.product.paketinhalt || 1;
              const einheit = item.product.einheit_short || 'm²';
              const verpackungsart = item.product.verpackungsart_short || 'Pak.';
              const totalAmount = item.quantity * paketinhalt;

              // Preise berechnen - KORREKT für Set-Angebote
              let pricePerUnit: number;
              let regularPricePerUnit: number;
              let totalPrice: number;
              let displayAmount: number;

              if (item.isSetItem && item.setPricePerUnit !== undefined && item.actualM2 !== undefined) {
                // Set-Item: Verwende Set-Preise
                pricePerUnit = item.setPricePerUnit;
                regularPricePerUnit = item.regularPricePerUnit || 0;
                displayAmount = item.actualM2;
                totalPrice = pricePerUnit * displayAmount;
              } else {
                // Regular Item: Verwende Produktpreise
                pricePerUnit = item.product.price || 0;
                regularPricePerUnit = item.product.regular_price || 0;
                displayAmount = totalAmount;
                totalPrice = pricePerUnit * item.quantity;
              }

              const hasDiscount = regularPricePerUnit > pricePerUnit;
              const isFree = pricePerUnit === 0 && item.isSetItem;

              return (
                <div key={item.id} className="flex flex-col gap-1 py-4 px-6 border-b border-[#e5e5e5]">
                  {/* Zeile 1: Bild + Name + X-Button */}
                  <div className="flex flex-row items-start gap-3">
                    <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={item.product.images[0]?.src || "https://via.placeholder.com/48x48/f3f4f6/9ca3af?text=Kein+Bild"}
                        alt={item.product.images[0]?.alt || item.product.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="flex-1 text-sm font-medium text-[#2e2d32] hover:text-[#ed1b24] transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#4c4c4c] hover:text-[#ed1b24] text-xl leading-none transition-colors"
                      title="Artikel entfernen"
                    >
                      ×
                    </button>
                  </div>

                  {/* Zeile 2: Quantity + Menge */}
                  <div className="flex flex-row items-center gap-2 ml-15">
                    {/* Quantity Control - nur für floor items im Set oder reguläre Produkte */}
                    {(!item.isSetItem || item.setItemType === 'floor') && (
                      <div className="flex items-center border border-[#e5e5e5] rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 text-[#4c4c4c] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span className="px-2 py-1 text-sm text-[#2e2d32] min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-[#4c4c4c] hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    )}
                    <span className="text-sm text-[#4c4c4c]">
                      {item.isSetItem && item.actualM2
                        ? `${displayAmount.toFixed(2)} ${einheit}`
                        : `${item.quantity} ${verpackungsart} = ${totalAmount.toFixed(2)} ${einheit}`
                      }
                    </span>
                    {item.isSetItem && (
                      <span className="text-xs text-[#4c4c4c] italic">
                        (Set-Angebot)
                      </span>
                    )}
                  </div>

                  {/* Zeile 3: Preise */}
                  <div className="flex flex-row items-center justify-end gap-2">
                    {isFree ? (
                      <span className="text-sm font-semibold" style={{ color: '#28a745' }}>
                        Kostenlos
                      </span>
                    ) : (
                      <>
                        {hasDiscount && regularPricePerUnit > 0 && (
                          <span className="text-sm text-[#4c4c4c] line-through">
                            {regularPricePerUnit.toFixed(2).replace('.', ',')} €/{einheit}
                          </span>
                        )}
                        <span className={`text-sm font-semibold ${hasDiscount ? 'text-[#ed1b24]' : 'text-[#2e2d32]'}`}>
                          {pricePerUnit.toFixed(2).replace('.', ',')} €/{einheit}
                        </span>
                        <span className="text-sm font-semibold text-[#2e2d32]">
                          Gesamt: {totalPrice.toFixed(2).replace('.', ',')} €
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Warenkorb leeren
              </button>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ← Weiter einkaufen
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">
                  {itemCount} {itemCount === 1 ? 'Artikel' : 'Artikel'} im Warenkorb
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  Gesamt: €{totalPrice.toFixed(2)}
                </div>
              </div>
              <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
                Zur Kasse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}