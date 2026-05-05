import type { CartItem } from '@/contexts/CartContext';

// Muster sind immer kostenlos. Ab dem 4. Muster fällt pro zusätzlichem
// Muster ein Fracht-Aufschlag an.
export const FREE_SAMPLE_LIMIT = 3;
export const SAMPLE_SHIPPING_SURCHARGE = 1.99;

// Backend-Konvention: jedes Muster-Produkt hat den Slug des Boden-Produkts
// mit vorangestelltem "muster-". Beispiel:
//   Boden:  "rigid-vinyl-vara-fjord"
//   Muster: "muster-rigid-vinyl-vara-fjord"
export const SAMPLE_SLUG_PREFIX = 'muster-';

// Erkennt Muster-Produkte am Slug-Präfix oder an der "muster"-Kategorie.
// Backend-seitig haben Muster aktuell teilweise einen Platzhalter-Preis (z.B. 10€)
// stehen — fachlich sind sie aber kostenlos. Frontend muss den Preis-Display deshalb
// für Muster überschreiben.
export function isMusterProduct(
  product:
    | { slug?: string; categories?: Array<{ slug: string }> }
    | null
    | undefined
): boolean {
  if (!product) return false;
  if (product.slug && product.slug.startsWith(SAMPLE_SLUG_PREFIX)) return true;
  if (product.categories?.some((c) => c.slug === 'muster')) return true;
  return false;
}

export function countSamples(items: CartItem[]): number {
  return items.reduce((n, item) => (item.isSample ? n + item.quantity : n), 0);
}

export function calculateSampleShippingSurcharge(sampleCount: number): number {
  return Math.max(0, sampleCount - FREE_SAMPLE_LIMIT) * SAMPLE_SHIPPING_SURCHARGE;
}
