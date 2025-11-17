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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900">
              Warenkorb ({itemCount} {itemCount === 1 ? 'Artikel' : 'Artikel'})
            </h1>
          </div>

          {/* Cart Items */}
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item.id} className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden">
                    <Image
                      src={
                        item.product.images[0]?.src ||
                        "https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=Kein+Bild"
                      }
                      alt={item.product.images[0]?.alt || item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      SKU: {item.product.sku || 'N/A'}
                    </p>
                    <div className="mt-2">
                      <span className="text-lg font-bold text-blue-600">
                        €{(item.product.price || 0).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        pro Stück
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      €{((item.product.price || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Artikel entfernen"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
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