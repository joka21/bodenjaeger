/**
 * Google-Merchant-Produktfeed — https://www.bodenjaeger.de/feed.xml
 *
 * Format: RSS 2.0 mit g:-Namespace (offizielles Google-Merchant-Format).
 *
 * Quelle: dieselbe Jäger-API wie die Sitemap (`wooCommerceClient.getProducts`,
 * paginiert). Die Produkt-URL wird über `productUrl()` aus `@/lib/site` gebildet —
 * damit gilt per Konstruktion: Feed-link == Sitemap-URL == Canonical.
 *
 * Preis: ausschließlich backend-vorberechnete Paketpreise (`getPackagePrices`).
 * Es wird im Frontend NICHTS neu berechnet.
 *
 * Ausgeschlossen: Muster-Artikel (`muster-*`), nicht kaufbare Produkte
 * (`purchasable === false`), Produkte ohne gültigen Preis (≤ 0) und ohne Bild.
 */

import { wooCommerceClient, type StoreApiProduct } from '@/lib/woocommerce';
import { SITE_URL, productUrl } from '@/lib/site';
import { stripHtml, getPackagePrices } from '@/lib/schema';

// Merchant ruft den Feed i. d. R. täglich ab — 6 h hält ihn frisch genug,
// ohne das Backend bei jedem Crawl zu belasten.
export const revalidate = 21600;

const PRODUCTS_PER_PAGE = 100;
const MAX_PRODUCT_PAGES = 50; // Safety-Limit (5.000 Produkte max), wie sitemap.ts

async function fetchAllProducts(): Promise<StoreApiProduct[]> {
  const all: StoreApiProduct[] = [];
  let page = 1;

  while (page <= MAX_PRODUCT_PAGES) {
    const batch = await wooCommerceClient.getProducts({
      per_page: PRODUCTS_PER_PAGE,
      page,
    });

    if (batch.length === 0) break;
    all.push(...batch);
    if (batch.length < PRODUCTS_PER_PAGE) break;

    page += 1;
  }

  return all;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Mappt die Backend-Einheit auf eine von Google akzeptierte Unit-Pricing-Einheit.
 * Nur Flächen-/Längenware erhält Unit-Pricing; Stückartikel (z. B. „Stück") → null.
 */
function googleUnit(einheitShort?: string | null): 'sqm' | 'm' | null {
  const e = (einheitShort ?? '').toLowerCase().trim();
  if (e === 'm²' || e === 'm2' || e === 'qm') return 'sqm';
  if (e === 'lfm' || e === 'lm' || e === 'm') return 'm';
  return null;
}

function mapAvailability(status: StoreApiProduct['stock_status']): string {
  switch (status) {
    case 'instock':
      return 'in_stock';
    case 'outofstock':
      return 'out_of_stock';
    case 'onbackorder':
      return 'backorder';
    default:
      return 'in_stock';
  }
}

/**
 * Versucht, die echte Produktmarke aus den WooCommerce-Attributen abzuleiten
 * (Attribut-Name enthält „Hersteller"/„Marke"/„Brand"). Kein Treffer → null.
 */
function deriveBrand(product: StoreApiProduct): string | null {
  const attr = product.attributes?.find((a) => /hersteller|marke|brand/i.test(a.name));
  const value = attr?.options?.find((o) => typeof o === 'string' && o.trim().length > 0);
  return value ? value.trim() : null;
}

function buildItem(product: StoreApiProduct): string | null {
  // --- Ausschlüsse ---
  if (!product.slug || product.slug.startsWith('muster-')) return null;
  if (product.purchasable === false) return null;

  const image = product.images?.[0]?.src;
  if (!image) return null;

  const { regular, sale } = getPackagePrices(product);
  if (regular <= 0) return null;

  // --- Pflichtfelder ---
  const id =
    product.sku && product.sku.trim().length > 0
      ? product.sku.trim()
      : String(product.id);
  const title = (product.name ?? '').slice(0, 150);
  const description =
    stripHtml(product.short_description || product.text_produktuebersicht || '') ||
    product.name ||
    '';
  const link = productUrl(product.slug);
  const availability = mapAvailability(product.stock_status);

  const parts: string[] = [
    `<g:id>${escapeXml(id)}</g:id>`,
    `<title>${escapeXml(title)}</title>`,
    `<link>${escapeXml(link)}</link>`,
    `<description>${escapeXml(description)}</description>`,
    `<g:image_link>${escapeXml(image)}</g:image_link>`,
  ];

  // Zusätzliche Bilder (max. 10)
  for (const img of product.images?.slice(1, 11) ?? []) {
    if (img?.src) {
      parts.push(`<g:additional_image_link>${escapeXml(img.src)}</g:additional_image_link>`);
    }
  }

  parts.push(`<g:availability>${availability}</g:availability>`);
  parts.push(`<g:condition>new</g:condition>`);

  // Preis: regulärer Paketpreis als g:price, Aktionspreis nur falls aktiv.
  parts.push(`<g:price>${regular.toFixed(2)} EUR</g:price>`);
  if (sale !== null) {
    parts.push(`<g:sale_price>${sale.toFixed(2)} EUR</g:sale_price>`);
  }

  // Unit-Pricing nur für Flächen-/Längenware mit bekanntem Paketinhalt.
  const unit = googleUnit(product.einheit_short);
  if (unit && product.paketinhalt && product.paketinhalt > 0) {
    parts.push(`<g:unit_pricing_measure>${product.paketinhalt}${unit}</g:unit_pricing_measure>`);
    parts.push(`<g:unit_pricing_base_measure>1${unit}</g:unit_pricing_base_measure>`);
  }

  // Marke nur wenn aus Attributen ableitbar. Fehlen brand UND gtin/mpn
  // (gtin/mpn existieren im Backend derzeit nicht), wird identifier_exists=false
  // gesetzt, damit Google keine fehlenden Kennzeichnungen bemängelt.
  const brand = deriveBrand(product);
  if (brand) {
    parts.push(`<g:brand>${escapeXml(brand)}</g:brand>`);
  } else {
    parts.push(`<g:identifier_exists>false</g:identifier_exists>`);
  }

  return `<item>\n      ${parts.join('\n      ')}\n    </item>`;
}

export async function GET(): Promise<Response> {
  const products = await fetchAllProducts();
  const items = products
    .map(buildItem)
    .filter((item): item is string => item !== null);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Bodenjäger Produktfeed</title>
    <link>${SITE_URL}</link>
    <description>Produktdaten für das Google Merchant Center</description>
    ${items.join('\n    ')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=21600, stale-while-revalidate=86400',
    },
  });
}
