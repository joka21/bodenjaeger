/**
 * Single Source of Truth für die kanonische Produktionsdomain und URL-Erzeugung.
 *
 * Feed (feed.xml), Sitemap, robots.txt, Canonical-Tags und JSON-LD MÜSSEN exakt
 * dieselbe Domain + Pfadstruktur verwenden, damit gilt:
 *   Feed-link == Canonical == tatsächlich erreichbare URL (ohne Redirect-Kette).
 *
 * Ein Domainwechsel (z. B. non-www ↔ www) erfolgt ausschließlich an DIESER Stelle.
 * Der zugehörige 301 non-www → www liegt in der Vercel-Domainkonfiguration,
 * nicht im Code.
 */
export const SITE_URL = 'https://www.bodenjaeger.de';

/** Kanonische Produkt-URL: https://www.bodenjaeger.de/products/{slug} */
export function productUrl(slug: string): string {
  return `${SITE_URL}/products/${slug}`;
}

/** Kanonische Kategorie-URL: https://www.bodenjaeger.de/category/{slug} */
export function categoryUrl(slug: string): string {
  return `${SITE_URL}/category/${slug}`;
}
