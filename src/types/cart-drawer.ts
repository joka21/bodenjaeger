// Cart Drawer Types for Mini-Warenkorb with Set-Angebote support

export type ProductUnit = 'Pak.' | 'Rol.' | 'Stk.' | 'm²' | 'm' | 'lfm';

/**
 * Helper function to safely convert string to ProductUnit
 */
export function toProductUnit(value: string | undefined, fallback: ProductUnit = 'm²'): ProductUnit {
  const validUnits: ProductUnit[] = ['Pak.', 'Rol.', 'Stk.', 'm²', 'm', 'lfm'];
  if (value && validUnits.includes(value as ProductUnit)) {
    return value as ProductUnit;
  }
  return fallback;
}

export interface CartItemBase {
  id: string;
  productId: number;
  name: string;
  image: string;
  quantity: number;
  unit: ProductUnit;
  unitValue: number; // e.g., 2.22 for "2.22 m²"
  pricePerUnit: number; // Current price per unit
  originalPricePerUnit?: number; // UVP (strikethrough)
  total: number;
  isFree?: boolean; // Free items in set
}

export interface CartSetItem {
  type: 'set';
  setId: string; // Unique set ID
  mainProduct: CartItemBase; // Main product with quantity stepper
  bundleProducts: CartItemBase[]; // Accessories without quantity stepper
  setTotal: number; // Total price of the set
}

export interface CartSingleItem {
  type: 'single';
  product: CartItemBase;
}

export type CartDrawerItem = CartSetItem | CartSingleItem;

export interface CartDrawerData {
  items: CartDrawerItem[];
  subtotal: number;
  shipping: number;
  savings: number; // Savings/discount
  total: number;
}

export interface CartDrawerContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}
