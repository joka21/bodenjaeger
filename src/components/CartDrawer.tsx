'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    cartItems,
    itemCount,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Warenkorb ({itemCount})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Warenkorb schließen"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3m4 10v6a2 2 0 002 2h8a2 2 0 002-2v-6m-12 0h12"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ihr Warenkorb ist leer
                </h3>
                <p className="text-gray-500 mb-4">
                  Fügen Sie Produkte hinzu, um mit dem Einkauf zu beginnen.
                </p>
                <button
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Weiter einkaufen
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item.isSetItem && item.setId ? `${item.setId}-${item.setItemType}` : `${item.id}-${index}`}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-md overflow-hidden">
                      <Image
                        src={
                          item.product.images[0]?.src ||
                          "https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=No+Image"
                        }
                        alt={item.product.images[0]?.alt || item.product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>

                      {/* Price */}
                      <div className="mt-1">
                        {item.product.on_sale ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-red-600">
                              €{item.product.prices?.price ? (parseFloat(item.product.prices.price) / 100).toFixed(2) : item.product.sale_price}
                            </span>
                            <span className="text-xs text-gray-500 line-through">
                              €{item.product.prices?.regular_price ? (parseFloat(item.product.prices.regular_price) / 100).toFixed(2) : item.product.regular_price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-gray-900">
                            €{item.product.prices?.price ? (parseFloat(item.product.prices.price) / 100).toFixed(2) : item.product.price}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 transition-colors"
                            aria-label="Menge verringern"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 transition-colors"
                            aria-label="Menge erhöhen"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          aria-label="Artikel entfernen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="mt-2 text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          Subtotal: €{((item.product.prices?.price
                            ? parseFloat(item.product.prices.price) / 100
                            : parseFloat(item.product.price) || 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 space-y-4">
                {/* Clear Cart Button */}
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="w-full text-sm text-red-600 hover:text-red-800 font-medium py-2 border border-red-200 hover:border-red-300 rounded-lg transition-colors"
                  >
                    Warenkorb leeren
                  </button>
                )}

                {/* Total */}
                <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                  <span>Gesamt:</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                  Zur Kasse gehen
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={onClose}
                  className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
                >
                  Weiter einkaufen
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}