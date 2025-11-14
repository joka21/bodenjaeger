/**
 * OPTIMIERTE PRODUKT-TYPES FÜR GESTAFFELTE DATENLADUNG
 *
 * Strategie:
 * - ProductCritical: Minimale Daten für Listings (Startseite, Kategorie)
 * - ProductFull: Vollständige Daten für Detailseite
 * - ProductOption: Leichtgewichtige Daten für Zusatzprodukte
 */

// ============================================
// 1. CRITICAL DATA (Startseite/Listings)
// ============================================

export interface ProductCritical {
  // Core Identity
  id: number;
  name: string;
  slug: string;

  // Images (nur Thumbnail für Listings)
  thumbnail: string;
  thumbnail_alt?: string;

  // Preise (minimal für Preisanzeige)
  price: number;                    // Aktueller Preis
  regular_price: number;            // Original-Preis
  sale_price: number | null;        // Sale-Preis (falls vorhanden)
  uvp: number | null;               // UVP (falls vorhanden)
  show_uvp: boolean;

  // Einheiten (für Preisanzeige "34,99 €/m²")
  einheit_short: string;            // "m²", "lfm", etc.

  // Set-Angebot Badges
  has_setangebot: boolean;
  setangebot_ersparnis_prozent: number | null;  // Für "-27%" Badge

  // Verfügbarkeit
  is_in_stock: boolean;

  // Optional: Kategorie-Info für Filtering
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

// ============================================
// 2. FULL DATA (Produktdetailseite)
// ============================================

export interface ProductFull extends ProductCritical {
  // Erweiterte Bilder
  images: Array<{
    id: number;
    src: string;
    alt: string;
    name: string;
  }>;

  // Beschreibung
  description: string;
  short_description: string;

  // Erweiterte Preis-Info
  paketpreis: number;               // Preis pro Paket
  paketpreis_s: number | null;      // Sale-Preis pro Paket
  paketinhalt: number;              // m² pro Paket
  verschnitt: number;               // Verschnitt-Prozentsatz

  // Vollständige Einheiten-Info
  einheit: string;                  // "Quadratmeter"
  verpackungsart: string;           // "Paket(e)"
  verpackungsart_short: string;     // "Pak."

  // Set-Angebot (vollständig)
  show_setangebot: boolean;
  setangebot_einzelpreis: number;
  setangebot_gesamtpreis: number;
  setangebot_ersparnis_euro: number;
  setangebot_ersparnis_prozent: number;
  setangebot_titel: string;

  // Zusatzprodukt-IDs (nur IDs - Details werden on-demand geladen!)
  standard_addition_daemmung: number | null;
  standard_addition_sockelleisten: number | null;
  option_products_daemmung: string | null;        // Komma-getrennte IDs
  option_products_sockelleisten: string | null;   // Komma-getrennte IDs

  // Lieferzeit
  show_lieferzeit: boolean;
  lieferzeit: string;

  // Badges
  show_aktion: boolean;
  aktion: string | null;
  show_angebotspreis_hinweis: boolean;
  angebotspreis_hinweis: string | null;

  // Produktübersicht-Text
  show_text_produktuebersicht: boolean;
  text_produktuebersicht: string | null;

  // Stock-Details
  stock_quantity: number | null;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
}

// ============================================
// 3. OPTION DATA (Zusatzprodukte On-Demand)
// ============================================

export interface ProductOption {
  id: number;
  name: string;
  price: number;
  image: string;
  einheit_short: string;
  paketinhalt: number;
  verpackungsart_short: string;
  is_in_stock: boolean;
}

// ============================================
// 4. API RESPONSE TYPES
// ============================================

export interface ProductsResponse<T> {
  products: T[];
  pagination: {
    total: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
}

export interface ProductResponse<T> {
  product: T;
}

// ============================================
// 5. HELPER TYPES
// ============================================

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
  name: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

// Type Guards
export function isProductFull(product: ProductCritical | ProductFull): product is ProductFull {
  return 'description' in product;
}

export function isProductCritical(product: ProductCritical | ProductFull): product is ProductCritical {
  return !('description' in product);
}

// ============================================
// 6. QUERY PARAMETERS
// ============================================

export interface ProductQueryParams {
  page?: number;
  per_page?: number;
  category?: string;
  search?: string;
  orderby?: 'date' | 'title' | 'price' | 'popularity';
  order?: 'asc' | 'desc';
  on_sale?: boolean;
  in_stock?: boolean;
}

export interface ProductFieldsParam {
  fields: 'critical' | 'full' | 'minimal';
}
