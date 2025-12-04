// Cart Utility Functions for Bodenjäger E-Commerce

import { CartDrawerData, CartDrawerItem } from '@/types/cart-drawer';

/**
 * Calculate shipping costs - IMMER 0
 */
export function calculateShipping(subtotal: number): number {
  return 0;
}

/**
 * Calculate savings - IMMER 0
 */
export function calculateSavings(items: CartDrawerItem[]): number {
  return 0;
}

/**
 * Calculate subtotal from cart items
 */
export function calculateSubtotal(items: CartDrawerItem[]): number {
  return items.reduce((sum, item) => {
    if (item.type === 'set') {
      return sum + item.setTotal;
    } else {
      return sum + item.product.total;
    }
  }, 0);
}

/**
 * Calculate bundle item quantity based on main product quantity change
 * Example: Laminat 1 Pak. → 2 Pak. means Dämmung 1 Rol. → 2 Rol.
 */
export function calculateBundleQuantity(
  mainQuantity: number,
  originalMainQuantity: number,
  bundleQuantity: number
): number {
  const ratio = mainQuantity / originalMainQuantity;
  return Math.ceil(bundleQuantity * ratio);
}

/**
 * Format price for display (German format: 1234.56 → "1.234,56")
 */
export function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',');
}

/**
 * Format unit value (e.g., 2.22 → "2,22")
 */
export function formatUnitValue(value: number): string {
  return value.toFixed(2).replace('.', ',');
}

/**
 * Get product unit display text
 */
export function getUnitDisplayText(unit: string, unitValue: number): string {
  switch (unit) {
    case 'Pak.':
      return `Pak. = ${formatUnitValue(unitValue)} m²`;
    case 'Rol.':
      return `Rol. = ${formatUnitValue(unitValue)} m²`;
    case 'Stk.':
      return `Stk. = ${formatUnitValue(unitValue)} m`;
    case 'm²':
      return `${formatUnitValue(unitValue)} m²`;
    case 'lfm':
      return `${formatUnitValue(unitValue)} lfm`;
    case 'm':
      return `${formatUnitValue(unitValue)} m`;
    default:
      return `${unitValue} ${unit}`;
  }
}

/**
 * Calculate total cart data
 */
export function calculateCartData(items: CartDrawerItem[]): CartDrawerData {
  const subtotal = calculateSubtotal(items);
  const shipping = calculateShipping(subtotal);
  const savings = calculateSavings(items);
  const total = subtotal + shipping;

  return {
    items,
    subtotal,
    shipping,
    savings,
    total,
  };
}

/**
 * Check if a product is part of a set
 */
export function isProductInSet(items: CartDrawerItem[], productId: number): boolean {
  return items.some((item) => {
    if (item.type === 'set') {
      return (
        item.mainProduct.productId === productId ||
        item.bundleProducts.some((bp) => bp.productId === productId)
      );
    }
    return false;
  });
}

/**
 * Get total item count (not counting bundle items separately)
 */
export function getTotalItemCount(items: CartDrawerItem[]): number {
  return items.reduce((count, item) => {
    if (item.type === 'set') {
      return count + item.mainProduct.quantity;
    } else {
      return count + item.product.quantity;
    }
  }, 0);
}
