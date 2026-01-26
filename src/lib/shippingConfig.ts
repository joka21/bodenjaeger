/**
 * Versandkosten-Konfiguration
 *
 * Hier kannst du die Versandkosten einfach anpassen.
 * Die Stufen werden von oben nach unten geprüft.
 */

export interface ShippingTier {
  minAmount: number;  // Mindestbestellwert in €
  cost: number;       // Versandkosten in €
  label: string;      // Beschreibung
}

/**
 * VERSANDKOSTEN-STUFEN
 * ==================
 * Passe diese Werte an, um die Versandkosten zu ändern.
 */
export const SHIPPING_TIERS: ShippingTier[] = [
  {
    minAmount: 200,   // Ab 200€
    cost: 0,          // Kostenlos
    label: 'Kostenloser Versand ab 200€'
  },
  {
    minAmount: 49,    // Ab 49€
    cost: 6,          // 6€ Versand
    label: 'Versand 6€'
  },
  {
    minAmount: 0,     // Bis 49€
    cost: 50,         // 50€ Versand
    label: 'Versand 50€'
  }
];

/**
 * Berechnet die Versandkosten basierend auf dem Warenwert
 *
 * @param subtotal - Zwischensumme (Warenwert ohne Versand)
 * @returns Versandkosten in €
 */
export function calculateShippingCost(subtotal: number): number {
  // Finde die passende Versandkosten-Stufe
  for (const tier of SHIPPING_TIERS) {
    if (subtotal >= tier.minAmount) {
      return tier.cost;
    }
  }

  // Fallback: Höchste Versandkosten (sollte nie passieren)
  return SHIPPING_TIERS[SHIPPING_TIERS.length - 1].cost;
}

/**
 * Gibt die passende Versandkosten-Stufe für einen Warenwert zurück
 *
 * @param subtotal - Zwischensumme (Warenwert ohne Versand)
 * @returns Die passende Versandkosten-Stufe
 */
export function getShippingTier(subtotal: number): ShippingTier {
  for (const tier of SHIPPING_TIERS) {
    if (subtotal >= tier.minAmount) {
      return tier;
    }
  }

  // Fallback
  return SHIPPING_TIERS[SHIPPING_TIERS.length - 1];
}

/**
 * Gibt den nächsten kostenlosen Versand-Schwellenwert zurück
 *
 * @param subtotal - Aktuelle Zwischensumme
 * @returns Betrag bis zum kostenlosen Versand, oder null wenn bereits erreicht
 */
export function getAmountUntilFreeShipping(subtotal: number): number | null {
  const freeShippingTier = SHIPPING_TIERS.find(tier => tier.cost === 0);

  if (!freeShippingTier) return null;

  if (subtotal >= freeShippingTier.minAmount) {
    return null; // Bereits kostenloser Versand
  }

  return freeShippingTier.minAmount - subtotal;
}
