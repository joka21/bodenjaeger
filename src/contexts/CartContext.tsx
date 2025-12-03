'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StoreApiProduct } from '@/lib/woocommerce';

// Cart item interface extending the WooCommerce product
export interface CartItem {
  id: number;
  product: StoreApiProduct;
  quantity: number;
  isSetItem?: boolean;           // Flag to identify set items
  setId?: string;                 // Group ID for set items
  setItemType?: 'floor' | 'insulation' | 'baseboard';  // Type of set item
  // Set-Angebot pricing information
  setPricePerUnit?: number;      // Actual price per unit in the set (0 for free items, verrechnung for upgrades)
  regularPricePerUnit?: number;  // Regular price per unit for comparison
  actualM2?: number;             // Actual m² or lfm after rounding to packages
}

// Set bundle interface for adding to cart
export interface SetBundle {
  floor: {
    product: StoreApiProduct;
    packages: number;
    actualM2: number;
    setPricePerUnit: number;      // Always the set price (setangebot_gesamtpreis)
    regularPricePerUnit: number;  // Regular price for comparison
  };
  insulation: {
    product: StoreApiProduct;
    packages: number;
    actualM2: number;
    setPricePerUnit: number;      // 0 for standard/cheaper, verrechnung for upgrades
    regularPricePerUnit: number;  // Full regular price
    standardProduct: StoreApiProduct;  // Reference to standard product for price calculation
  } | null;
  baseboard: {
    product: StoreApiProduct;
    packages: number;
    actualLfm: number;
    setPricePerUnit: number;      // 0 for standard/cheaper, verrechnung for upgrades
    regularPricePerUnit: number;  // Full regular price
    standardProduct: StoreApiProduct;  // Reference to standard product for price calculation
  } | null;
}

// Cart context type definition
export interface CartContextType {
  cartItems: CartItem[];
  itemCount: number;
  totalPrice: number;
  addToCart: (product: StoreApiProduct, quantity?: number) => void;
  addSetToCart: (setBundle: SetBundle) => void;
  removeFromCart: (productId: number) => void;
  removeSet: (setId: string) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getItemQuantity: (productId: number) => number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// CartProvider component props
interface CartProviderProps {
  children: ReactNode;
}

// LocalStorage key for persisting cart data
const CART_STORAGE_KEY = 'woocommerce-cart';

// CartProvider component
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart: CartItem[] = JSON.parse(savedCart);
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Calculate total item count
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price with correct Set-Angebot logic
  const totalPrice = cartItems.reduce((total, item) => {
    if (item.isSetItem && item.setPricePerUnit !== undefined && item.actualM2 !== undefined) {
      // Set item: use setPricePerUnit × actualM2
      return total + (item.setPricePerUnit * item.actualM2);
    } else {
      // Regular item: use product price × quantity
      const price = item.product.prices?.price
        ? parseFloat(item.product.prices.price) / 100
        : (item.product.price || 0);
      return total + (price * item.quantity);
    }
  }, 0);

  // Add item to cart
  const addToCart = (product: StoreApiProduct, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id && !item.isSetItem);

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item.id === product.id && !item.isSetItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, {
          id: product.id,
          product,
          quantity
        }];
      }
    });
  };

  // Add set bundle to cart with correct pricing information
  const addSetToCart = (setBundle: SetBundle) => {
    const setId = `set-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    setCartItems(prevItems => {
      const newItems: CartItem[] = [];

      // Add floor with pricing
      newItems.push({
        id: setBundle.floor.product.id,
        product: setBundle.floor.product,
        quantity: setBundle.floor.packages,
        isSetItem: true,
        setId,
        setItemType: 'floor',
        setPricePerUnit: setBundle.floor.setPricePerUnit,
        regularPricePerUnit: setBundle.floor.regularPricePerUnit,
        actualM2: setBundle.floor.actualM2
      });

      // Add insulation if exists with pricing
      if (setBundle.insulation) {
        newItems.push({
          id: setBundle.insulation.product.id,
          product: setBundle.insulation.product,
          quantity: setBundle.insulation.packages,
          isSetItem: true,
          setId,
          setItemType: 'insulation',
          setPricePerUnit: setBundle.insulation.setPricePerUnit,
          regularPricePerUnit: setBundle.insulation.regularPricePerUnit,
          actualM2: setBundle.insulation.actualM2
        });
      }

      // Add baseboard if exists with pricing
      if (setBundle.baseboard) {
        newItems.push({
          id: setBundle.baseboard.product.id,
          product: setBundle.baseboard.product,
          quantity: setBundle.baseboard.packages,
          isSetItem: true,
          setId,
          setItemType: 'baseboard',
          setPricePerUnit: setBundle.baseboard.setPricePerUnit,
          regularPricePerUnit: setBundle.baseboard.regularPricePerUnit,
          actualM2: setBundle.baseboard.actualLfm
        });
      }

      return [...prevItems, ...newItems];
    });
  };

  // Remove entire set by setId
  const removeSet = (setId: string) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.setId !== setId)
    );
  };

  // Remove item from cart completely
  const removeFromCart = (productId: number) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== productId)
    );
  };

  // Update item quantity
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Check if product is in cart
  const isInCart = (productId: number): boolean => {
    return cartItems.some(item => item.id === productId);
  };

  // Get quantity of specific item in cart
  const getItemQuantity = (productId: number): number => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Context value
  const contextValue: CartContextType = {
    cartItems,
    itemCount,
    totalPrice,
    addToCart,
    addSetToCart,
    removeFromCart,
    removeSet,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};