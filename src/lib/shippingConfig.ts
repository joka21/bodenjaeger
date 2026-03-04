/**
 * Versandkosten-Konfiguration
 *
 * Staffelung nach Warenwert + Sonderregeln für Muster und Zubehör.
 */

import type { CartItem } from '@/contexts/CartContext';

export interface ShippingTier {
  minAmount: number;  // Mindestbestellwert in €
  cost: number;       // Versandkosten in €
  label: string;      // Beschreibung
}

/**
 * VERSANDKOSTEN-STUFEN (Standard-Versand)
 */
export const SHIPPING_TIERS: ShippingTier[] = [
  {
    minAmount: 999,
    cost: 0,
    label: 'Kostenloser Versand ab 999€'
  },
  {
    minAmount: 500,
    cost: 29.99,
    label: 'Versand 29,99€'
  },
  {
    minAmount: 0,
    cost: 59.99,
    label: 'Versand 59,99€'
  }
];

/** Versandkosten für reine Zubehör-/Kleinteile-Bestellungen */
export const ACCESSORIES_SHIPPING = 4.99;

/**
 * Prüft ob ein CartItem ein Zubehör-Produkt ist
 */
function isAccessory(item: CartItem): boolean {
  return item.product.categories?.some(c => c.slug === 'zubehoer') ?? false;
}

/**
 * Berechnet die Versandkosten basierend auf Warenwert UND Warenkorb-Inhalt.
 *
 * Regeln:
 * 1. Nur Muster → kostenlos
 * 2. Nur Zubehör/Kleinteile (kein Boden) → 4,99€
 * 3. Enthält Boden/Set → Staffelung nach Warenwert
 *
 * @param subtotal - Zwischensumme (Warenwert ohne Versand)
 * @param cartItems - Optional: Cart-Items für Sonderregeln (Muster, Zubehör)
 */
export function calculateShippingCost(subtotal: number, cartItems?: CartItem[]): number {
  if (!cartItems || cartItems.length === 0) {
    // Fallback ohne Cart-Items: nur Staffelung nach Warenwert
    return getShippingBySubtotal(subtotal);
  }

  // Nur Muster → kostenlos
  const onlySamples = cartItems.every(item => item.isSample);
  if (onlySamples) return 0;

  // Nicht-Muster Items filtern
  const nonSampleItems = cartItems.filter(item => !item.isSample);

  // Nur Zubehör (ohne Muster) → 4,99€
  const onlyAccessories = nonSampleItems.every(item => isAccessory(item));
  if (onlyAccessories) return ACCESSORIES_SHIPPING;

  // Standard-Staffelung nach Warenwert
  return getShippingBySubtotal(subtotal);
}

/**
 * Reine Staffelung nach Warenwert
 */
function getShippingBySubtotal(subtotal: number): number {
  for (const tier of SHIPPING_TIERS) {
    if (subtotal >= tier.minAmount) {
      return tier.cost;
    }
  }
  return SHIPPING_TIERS[SHIPPING_TIERS.length - 1].cost;
}

/**
 * Gibt die passende Versandkosten-Stufe für einen Warenwert zurück
 */
export function getShippingTier(subtotal: number): ShippingTier {
  for (const tier of SHIPPING_TIERS) {
    if (subtotal >= tier.minAmount) {
      return tier;
    }
  }
  return SHIPPING_TIERS[SHIPPING_TIERS.length - 1];
}

/**
 * Gibt den Betrag bis zum kostenlosen Versand zurück
 */
export function getAmountUntilFreeShipping(subtotal: number): number | null {
  const freeShippingTier = SHIPPING_TIERS.find(tier => tier.cost === 0);
  if (!freeShippingTier) return null;
  if (subtotal >= freeShippingTier.minAmount) return null;
  return freeShippingTier.minAmount - subtotal;
}
