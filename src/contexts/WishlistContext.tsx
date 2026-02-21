'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StoreApiProduct } from '@/lib/woocommerce';

export interface WishlistItem {
  id: number;
  product: StoreApiProduct;
  addedAt: number;
}

export interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  addToWishlist: (product: StoreApiProduct) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (product: StoreApiProduct) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

const WISHLIST_STORAGE_KEY = 'bodenjager-wishlist';

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as WishlistItem[];
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
    }
    return [];
  });
  const [isWishlistLoaded, setIsWishlistLoaded] = useState(false);

  useEffect(() => {
    setIsWishlistLoaded(true);
  }, []);

  useEffect(() => {
    if (!isWishlistLoaded) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlistItems, isWishlistLoaded]);

  const wishlistCount = wishlistItems.length;

  const addToWishlist = (product: StoreApiProduct) => {
    setWishlistItems(prev => {
      if (prev.some(item => item.id === product.id)) return prev;
      return [...prev, { id: product.id, product, addedAt: Date.now() }];
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };

  const toggleWishlist = (product: StoreApiProduct) => {
    setWishlistItems(prev => {
      if (prev.some(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, { id: product.id, product, addedAt: Date.now() }];
    });
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlistItems.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const contextValue: WishlistContextType = {
    wishlistItems,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};
