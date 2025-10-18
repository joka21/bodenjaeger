'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import {
  CartDrawerItem,
  CartSetItem as CartSetItemType,
  CartSingleItem as CartSingleItemType,
  CartItemBase,
} from '@/types/cart-drawer';
import { calculateCartData } from '@/lib/cart-utils';
import CartSetItemComponent from './CartSetItem';
import CartSingleItemComponent from './CartSingleItem';
import CartFooter from './CartFooter';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, updateQuantity, removeFromCart, removeSet } = useCart();
  const [drawerItems, setDrawerItems] = useState<CartDrawerItem[]>([]);

  // Convert CartContext items to CartDrawer format
  useEffect(() => {
    const convertedItems: CartDrawerItem[] = [];
    const processedSetIds = new Set<string>();

    cartItems.forEach((item) => {
      // Handle Set Items
      if (item.isSetItem && item.setId) {
        // Skip if we've already processed this set
        if (processedSetIds.has(item.setId)) {
          return;
        }

        // Find all items in this set
        const setItems = cartItems.filter((ci) => ci.setId === item.setId);

        // Find main product (floor)
        const mainItem = setItems.find((si) => si.setItemType === 'floor');
        if (!mainItem) return;

        // Convert main product to CartItemBase
        const mainProduct: CartItemBase = {
          id: `main-${item.setId}`,
          productId: mainItem.id,
          name: mainItem.product.name,
          image: mainItem.product.images?.[0]?.src || '',
          quantity: mainItem.quantity,
          unit: 'Pak.',
          unitValue: 2.22, // TODO: Get from product meta
          pricePerUnit: mainItem.product.prices
            ? parseFloat(mainItem.product.prices.price) / 100
            : 0,
          originalPricePerUnit: mainItem.product.prices?.regular_price
            ? parseFloat(mainItem.product.prices.regular_price) / 100
            : undefined,
          total:
            (mainItem.product.prices ? parseFloat(mainItem.product.prices.price) / 100 : 0) *
            mainItem.quantity,
        };

        // Convert bundle products
        const bundleProducts: CartItemBase[] = setItems
          .filter((si) => si.setItemType !== 'floor')
          .map((bundleItem) => {
            const isFree = bundleItem.product.prices
              ? parseFloat(bundleItem.product.prices.price) === 0
              : false;

            return {
              id: `bundle-${bundleItem.id}`,
              productId: bundleItem.id,
              name: bundleItem.product.name,
              image: bundleItem.product.images?.[0]?.src || '',
              quantity: bundleItem.quantity,
              unit: bundleItem.setItemType === 'insulation' ? 'Rol.' : 'Stk.',
              unitValue: bundleItem.setItemType === 'insulation' ? 3.0 : 2.4,
              pricePerUnit: bundleItem.product.prices
                ? parseFloat(bundleItem.product.prices.price) / 100
                : 0,
              originalPricePerUnit: bundleItem.product.prices?.regular_price
                ? parseFloat(bundleItem.product.prices.regular_price) / 100
                : undefined,
              total: isFree
                ? 0
                : (bundleItem.product.prices ? parseFloat(bundleItem.product.prices.price) / 100 : 0) *
                  bundleItem.quantity,
              isFree,
            };
          });

        const setTotal = mainProduct.total + bundleProducts.reduce((sum, bp) => sum + bp.total, 0);

        const setItem: CartSetItemType = {
          type: 'set',
          setId: item.setId,
          mainProduct,
          bundleProducts,
          setTotal,
        };

        convertedItems.push(setItem);
        processedSetIds.add(item.setId);
      }
      // Handle Single Items
      else if (!item.isSetItem) {
        const product: CartItemBase = {
          id: `single-${item.id}`,
          productId: item.id,
          name: item.product.name,
          image: item.product.images?.[0]?.src || '',
          quantity: item.quantity,
          unit: 'Pak.', // TODO: Determine from product meta
          unitValue: 2.22,
          pricePerUnit: item.product.prices
            ? parseFloat(item.product.prices.price) / 100
            : 0,
          originalPricePerUnit: item.product.prices?.regular_price
            ? parseFloat(item.product.prices.regular_price) / 100
            : undefined,
          total:
            (item.product.prices ? parseFloat(item.product.prices.price) / 100 : 0) *
            item.quantity,
        };

        const singleItem: CartSingleItemType = {
          type: 'single',
          product,
        };

        convertedItems.push(singleItem);
      }
    });

    setDrawerItems(convertedItems);
  }, [cartItems]);

  // Calculate cart data
  const cartData = calculateCartData(drawerItems);

  // Handle quantity change for single items
  const handleSingleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  // Handle quantity change for set items (updates all items in set proportionally)
  const handleSetQuantityChange = (setId: string, newQuantity: number) => {
    const setItem = drawerItems.find(
      (item): item is CartSetItemType => item.type === 'set' && item.setId === setId
    );
    if (!setItem) return;

    const ratio = newQuantity / setItem.mainProduct.quantity;

    // Update main product
    updateQuantity(setItem.mainProduct.productId, newQuantity);

    // Update bundle products proportionally
    setItem.bundleProducts.forEach((bundleProduct) => {
      const newBundleQuantity = Math.ceil(bundleProduct.quantity * ratio);
      updateQuantity(bundleProduct.productId, newBundleQuantity);
    });
  };

  // Handle remove single item
  const handleRemoveSingle = (productId: number) => {
    removeFromCart(productId);
  };

  // Handle remove set
  const handleRemoveSet = (setId: string) => {
    removeSet(setId);
  };

  // Close drawer on checkout
  const handleCheckout = () => {
    onClose();
  };

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

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full bg-[#f5f5f5] shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          w-full md:w-[450px]
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#2e2d32]">Warenkorb</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Warenkorb schließen"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {drawerItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg
                className="w-16 h-16 mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-lg font-medium">Dein Warenkorb ist leer</p>
              <p className="text-sm mt-2">Füge Produkte hinzu, um fortzufahren</p>
            </div>
          ) : (
            <div className="space-y-3">
              {drawerItems.map((item) => {
                if (item.type === 'set') {
                  return (
                    <CartSetItemComponent
                      key={item.setId}
                      setItem={item}
                      onQuantityChange={(newQty) => handleSetQuantityChange(item.setId, newQty)}
                      onRemove={() => handleRemoveSet(item.setId)}
                    />
                  );
                } else {
                  return (
                    <CartSingleItemComponent
                      key={item.product.id}
                      product={item.product}
                      onQuantityChange={(newQty) =>
                        handleSingleQuantityChange(item.product.productId, newQty)
                      }
                      onRemove={() => handleRemoveSingle(item.product.productId)}
                    />
                  );
                }
              })}
            </div>
          )}
        </div>

        {/* Footer - Sticky */}
        {drawerItems.length > 0 && (
          <CartFooter
            subtotal={cartData.subtotal}
            shipping={cartData.shipping}
            savings={cartData.savings}
            total={cartData.total}
            onCheckout={handleCheckout}
          />
        )}
      </div>
    </>
  );
}
