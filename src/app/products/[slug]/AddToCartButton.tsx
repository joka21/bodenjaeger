'use client';

import { useState } from "react";
import { type StoreApiProduct } from "@/lib/woocommerce";
import { useCart } from "@/contexts/CartContext";

interface AddToCartButtonProps {
  product: StoreApiProduct;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    // Reset feedback after 3 seconds
    setTimeout(() => setAddedToCart(false), 3000);
  };

  return (
    <div>
      {/* Quantity Selector */}
      {product.is_in_stock && (
        <div className="mb-6">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Anzahl:
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              -
            </button>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center border border-gray-300 rounded-lg py-2"
              min="1"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {addedToCart && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">
            {quantity} {quantity === 1 ? 'Artikel wurde' : 'Artikel wurden'} erfolgreich in den Warenkorb gelegt!
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={handleAddToCart}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
            product.is_in_stock
              ? addedToCart
                ? 'bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!product.is_in_stock}
        >
          {product.is_in_stock
            ? addedToCart
              ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Hinzugefügt! ({getItemQuantity(product.id)} im Warenkorb)
                </span>
              )
              : isInCart(product.id)
                ? `Weitere ${quantity} hinzufügen (${getItemQuantity(product.id)} bereits im Warenkorb)`
                : `In den Warenkorb (${quantity} Stück)`
            : 'Nicht verfügbar'
          }
        </button>

        <button className="w-full py-3 px-6 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          Zur Wunschliste hinzufügen
        </button>
      </div>
    </div>
  );
}