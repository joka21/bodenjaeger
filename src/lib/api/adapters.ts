/**
 * ADAPTER FUNCTIONS
 *
 * Konvertiert zwischen alten StoreApiProduct Types und neuen optimierten Types
 * Ermöglicht schrittweise Migration ohne Breaking Changes
 */

import type { StoreApiProduct } from '@/lib/woocommerce';
import type { ProductCritical, ProductFull, ProductOption } from '@/types/product-optimized';

// ============================================
// ADAPTER: StoreApiProduct → ProductCritical
// ============================================

export function adaptStoreApiToProductCritical(product: StoreApiProduct): ProductCritical {
  // Extrahiere ersten Thumbnail
  const thumbnail = product.images?.[0]?.src || '';
  const thumbnail_alt = product.images?.[0]?.alt || product.name;

  // Extrahiere Preise
  const price = typeof product.prices?.price === 'string'
    ? parseFloat(product.prices.price) / 100
    : 0;
  const regular_price = typeof product.prices?.regular_price === 'string'
    ? parseFloat(product.prices.regular_price) / 100
    : 0;
  const sale_price = product.prices?.sale_price
    ? parseFloat(product.prices.sale_price) / 100
    : null;

  // Extrahiere UVP
  const uvp = product.jaeger_meta?.uvp || null;
  const show_uvp = product.jaeger_meta?.show_uvp || false;

  // Extrahiere Einheit
  const einheit_short = product.jaeger_meta?.einheit_short || 'm²';

  // Set-Angebot Info
  const has_setangebot = product.jaeger_meta?.show_setangebot === true;
  const setangebot_ersparnis_prozent = product.jaeger_meta?.setangebot_ersparnis_prozent || null;

  // Stock Status
  const is_in_stock = product.is_in_stock !== false;

  // Kategorien
  const categories = product.categories?.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    thumbnail,
    thumbnail_alt,
    price,
    regular_price,
    sale_price,
    uvp,
    show_uvp,
    einheit_short,
    has_setangebot,
    setangebot_ersparnis_prozent,
    is_in_stock,
    categories,
  };
}

// ============================================
// ADAPTER: StoreApiProduct → ProductFull
// ============================================

export function adaptStoreApiToProductFull(product: StoreApiProduct): ProductFull {
  // Basis von ProductCritical
  const critical = adaptStoreApiToProductCritical(product);

  // Erweiterte Felder
  const images = product.images?.map(img => ({
    id: typeof img.id === 'string' ? parseInt(img.id, 10) : img.id,
    src: img.src,
    alt: img.alt || product.name,
    name: img.name || '',
  })) || [];

  const description = product.description || '';
  const short_description = product.short_description || '';

  // Preise
  const paketpreis = product.jaeger_meta?.paketpreis || 0;
  const paketpreis_s = product.jaeger_meta?.paketpreis_s || null;
  const paketinhalt = product.jaeger_meta?.paketinhalt || 0;
  const verschnitt = product.jaeger_meta?.verschnitt || 0;

  // Einheiten
  const einheit = product.jaeger_meta?.einheit || 'Quadratmeter';
  const verpackungsart = product.jaeger_meta?.verpackungsart || 'Paket(e)';
  const verpackungsart_short = product.jaeger_meta?.verpackungsart_short || 'Pak.';

  // Set-Angebot vollständig
  const show_setangebot = product.jaeger_meta?.show_setangebot === true;
  const setangebot_einzelpreis = product.jaeger_meta?.setangebot_einzelpreis || 0;
  const setangebot_gesamtpreis = product.jaeger_meta?.setangebot_gesamtpreis || 0;
  const setangebot_ersparnis_euro = product.jaeger_meta?.setangebot_ersparnis_euro || 0;
  const setangebot_ersparnis_prozent = product.jaeger_meta?.setangebot_ersparnis_prozent || 0;
  const setangebot_titel = product.jaeger_meta?.setangebot_titel || '';

  // Zusatzprodukte IDs
  const standard_addition_daemmung = product.jaeger_meta?.standard_addition_daemmung || null;
  const standard_addition_sockelleisten = product.jaeger_meta?.standard_addition_sockelleisten || null;
  const option_products_daemmung = product.jaeger_meta?.option_products_daemmung || null;
  const option_products_sockelleisten = product.jaeger_meta?.option_products_sockelleisten || null;

  // Lieferzeit
  const show_lieferzeit = product.jaeger_meta?.show_lieferzeit || false;
  const lieferzeit = product.jaeger_meta?.lieferzeit || '';

  // Badges
  const show_aktion = product.jaeger_meta?.show_aktion || false;
  const aktion = product.jaeger_meta?.aktion || null;
  const show_angebotspreis_hinweis = product.jaeger_meta?.show_angebotspreis_hinweis || false;
  const angebotspreis_hinweis = product.jaeger_meta?.angebotspreis_hinweis || null;

  // Produktübersicht
  const show_text_produktuebersicht = product.jaeger_meta?.show_text_produktuebersicht || false;
  const text_produktuebersicht = product.jaeger_meta?.text_produktuebersicht || null;

  // Stock Details
  const stock_quantity = product.stock_quantity || null;
  const stock_status = product.stock_status || 'instock';

  return {
    ...critical,
    images,
    description,
    short_description,
    paketpreis,
    paketpreis_s,
    paketinhalt,
    verschnitt,
    einheit,
    verpackungsart,
    verpackungsart_short,
    show_setangebot,
    setangebot_einzelpreis,
    setangebot_gesamtpreis,
    setangebot_ersparnis_euro,
    setangebot_ersparnis_prozent,
    setangebot_titel,
    standard_addition_daemmung,
    standard_addition_sockelleisten,
    option_products_daemmung,
    option_products_sockelleisten,
    show_lieferzeit,
    lieferzeit,
    show_aktion,
    aktion,
    show_angebotspreis_hinweis,
    angebotspreis_hinweis,
    show_text_produktuebersicht,
    text_produktuebersicht,
    stock_quantity,
    stock_status: stock_status as 'instock' | 'outofstock' | 'onbackorder',
  };
}

// ============================================
// ADAPTER: StoreApiProduct → ProductOption
// ============================================

export function adaptStoreApiToProductOption(product: StoreApiProduct): ProductOption {
  const price = typeof product.prices?.price === 'string'
    ? parseFloat(product.prices.price) / 100
    : 0;

  const image = product.images?.[0]?.src || '';
  const einheit_short = product.jaeger_meta?.einheit_short || 'm²';
  const paketinhalt = product.jaeger_meta?.paketinhalt || 0;
  const verpackungsart_short = product.jaeger_meta?.verpackungsart_short || 'Pak.';
  const is_in_stock = product.is_in_stock !== false;

  return {
    id: product.id,
    name: product.name,
    price,
    image,
    einheit_short,
    paketinhalt,
    verpackungsart_short,
    is_in_stock,
  };
}

// ============================================
// BATCH ADAPTERS
// ============================================

export function adaptStoreApiProductsToCritical(products: StoreApiProduct[]): ProductCritical[] {
  return products.map(adaptStoreApiToProductCritical);
}

export function adaptStoreApiProductsToFull(products: StoreApiProduct[]): ProductFull[] {
  return products.map(adaptStoreApiToProductFull);
}

export function adaptStoreApiProductsToOptions(products: StoreApiProduct[]): ProductOption[] {
  return products.map(adaptStoreApiToProductOption);
}
