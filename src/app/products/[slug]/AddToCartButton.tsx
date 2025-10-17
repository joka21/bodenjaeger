'use client';

import { useState } from "react";
import { type StoreApiProduct } from "@/lib/woocommerce";
import { useCart } from "@/contexts/CartContext";
import type { SetQuantityCalculation } from "@/lib/setCalculations";
import { prepareSetForCart } from "@/lib/setCalculations";

interface AddToCartButtonProps {
  product: StoreApiProduct;
  quantities: SetQuantityCalculation;
  selectedDaemmung: StoreApiProduct | null;
  selectedSockelleiste: StoreApiProduct | null;
}

export default function AddToCartButton({
  product,
  quantities,
  selectedDaemmung,
  selectedSockelleiste
}: AddToCartButtonProps) {
  const [addedToCart, setAddedToCart] = useState(false);
  const { addSetToCart } = useCart();

  const handleAddToCart = () => {
    // Prepare set bundle for cart
    const setBundle = prepareSetForCart(
      quantities,
      product,
      selectedDaemmung,
      selectedSockelleiste
    );

    // Add to cart
    addSetToCart(setBundle);
    setAddedToCart(true);

    // Reset feedback after 3 seconds
    setTimeout(() => setAddedToCart(false), 3000);
  };

  // Count total items in set
  const totalSetItems =
    quantities.floor.packages +
    (quantities.insulation?.packages || 0) +
    (quantities.baseboard?.packages || 0);

  return (
    <div>
      {/* Success Message */}
      {addedToCart && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">
            Set mit {totalSetItems} Paketen erfolgreich in den Warenkorb gelegt!
          </span>
        </div>
      )}

      {/* Action Button */}
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
                Set hinzugefügt!
              </span>
            )
            : `Komplett-Set in den Warenkorb (${totalSetItems} Pakete)`
          : 'Nicht verfügbar'
        }
      </button>
    </div>
  );
}