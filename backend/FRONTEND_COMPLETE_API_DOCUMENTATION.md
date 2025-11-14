# 🚀 Frontend API Dokumentation - Komplett-Übersicht

## 📋 Inhalt

1. [Übersicht: Was ist verfügbar](#übersicht)
2. [API Endpunkte](#api-endpunkte)
3. [Vollständige Datenstruktur](#datenstruktur)
4. [Next.js Integration Beispiele](#nextjs-integration)
5. [React Components Beispiele](#react-components)
6. [TypeScript Types](#typescript-types)
7. [Best Practices](#best-practices)

---

## 🎯 Übersicht

### Was ist jetzt verfügbar?

Dein WordPress Backend stellt **3 vollständige API-Systeme** für das Next.js Frontend bereit:

```
┌─────────────────────────────────────────────────────┐
│  WORDPRESS / WOOCOMMERCE BACKEND                    │
│  (plan-dein-ding.de)                                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📦 API 1: WooCommerce Standard (bereits da)        │
│     → Alle Standard-WooCommerce-Felder              │
│                                                      │
│  📦 API 2: Jaeger Product Data (NEU)                │
│     → WooCommerce + 30+ Custom Fields               │
│     → Set-Angebot Daten                             │
│     → Zusatzprodukte (Dämmung, Sockelleisten)       │
│                                                      │
│  📦 API 3: Jaeger Calculations (NEU)                │
│     → Live-Berechnungen für Set-Angebote            │
│     → Mengen, Preise, Ersparnis                     │
│                                                      │
└─────────────────────────────────────────────────────┘
                         ↕ HTTPS / REST API
┌─────────────────────────────────────────────────────┐
│  NEXT.JS FRONTEND                                    │
│  (Headless / Vercel)                                │
└─────────────────────────────────────────────────────┘
```

---

## 📡 API Endpunkte

### Base URL
```
https://plan-dein-ding.de/wp-json
```

### API 1: WooCommerce Standard

```typescript
// Produkte
GET /wc/v3/products              // Liste aller Produkte
GET /wc/v3/products/{id}         // Einzelprodukt
GET /wc/v3/products/categories   // Kategorien
GET /wc/v3/products/tags         // Tags

// Warenkorb (WooCommerce Store API)
GET  /wc/store/v1/cart           // Warenkorb anzeigen
POST /wc/store/v1/cart/add-item  // Artikel hinzufügen
POST /wc/store/v1/cart/update-item  // Artikel aktualisieren
```

### API 2: Jaeger Product Data ⭐ HAUPTAPI

```typescript
// Produktdaten (WooCommerce + Custom Fields)
GET /jaeger/v1/products                    // Produktliste (20 pro Seite)
GET /jaeger/v1/products?category=laminat   // Nach Kategorie filtern
GET /jaeger/v1/products?page=2&per_page=50 // Pagination
GET /jaeger/v1/products/{id}               // Einzelprodukt mit ALLEN Feldern

// Kategorien
GET /jaeger/v1/categories                  // Alle Kategorien mit Produktanzahl
```

### API 3: Jaeger Calculations

```typescript
// Set-Angebot Berechnungen
POST /jaeger/v1/calculate-quantities  // Nur Mengenberechnung
POST /jaeger/v1/calculate-prices      // Nur Preisberechnung
POST /jaeger/v1/calculate-set         // Kombiniert: Mengen + Preise ⭐
POST /jaeger/v1/prepare-cart          // Warenkorb vorbereiten
```

---

## 📊 Datenstruktur

### Einzelprodukt: `/jaeger/v1/products/{id}`

**Beispiel: Produkt ID 1134 (Rigid-Vinyl Eiche Newstead)**

```json
{
  // ============================================
  // STANDARD WOOCOMMERCE FELDER
  // ============================================
  "id": 1134,
  "name": "Rigid-Vinyl Eiche Newstead",
  "slug": "rigid-vinyl-eiche-newstead",
  "permalink": "https://plan-dein-ding.de/produkt/rigid-vinyl-eiche-newstead/",
  "type": "simple",
  "status": "publish",
  "featured": false,
  "catalog_visibility": "visible",
  "description": "<p>Hochwertiger Rigid-Vinyl Bodenbelag...</p>",
  "short_description": "<p>Premium Vinylboden in Eiche Optik</p>",
  "sku": "RV-NEWSTEAD-001",
  "date_created": "2025-03-15T10:30:00",
  "date_modified": "2025-03-20T14:22:00",

  // Preise
  "prices": {
    "price": "34.99",
    "regular_price": "42.95",
    "sale_price": "34.99",
    "on_sale": true,
    "date_on_sale_from": "2025-03-01T00:00:00",
    "date_on_sale_to": "2025-04-30T23:59:59",
    "price_html": "<del>42,95€</del> <ins>34,99€</ins>"
  },

  // Lagerbestand
  "stock": {
    "stock_status": "instock",
    "stock_quantity": 150,
    "manage_stock": true,
    "backorders": "no",
    "backorders_allowed": false,
    "backordered": false
  },

  // Versand
  "shipping": {
    "weight": "15.5",
    "length": "120",
    "width": "20",
    "height": "10",
    "shipping_class": "standard"
  },

  // Bilder (alle Größen)
  "images": [
    {
      "id": 5678,
      "src": "https://plan-dein-ding.de/wp-content/uploads/2025/03/Newstead.jpg",
      "src_thumbnail": "https://plan-dein-ding.de/.../Newstead-150x150.jpg",
      "src_medium": "https://plan-dein-ding.de/.../Newstead-300x300.jpg",
      "src_large": "https://plan-dein-ding.de/.../Newstead-1024x1024.jpg",
      "name": "Newstead Produktbild",
      "alt": "Rigid-Vinyl Eiche Newstead Bodenbelag"
    },
    {
      "id": 5679,
      "src": "https://plan-dein-ding.de/.../Newstead-Detail.jpg",
      // ... weitere Galerie-Bilder
    }
  ],

  // Kategorien
  "categories": [
    {
      "id": 16,
      "name": "Vinylboden",
      "slug": "vinylboden"
    },
    {
      "id": 17,
      "name": "Rigid-Vinyl",
      "slug": "rigid-vinyl"
    }
  ],

  // Tags
  "tags": [
    {
      "id": 45,
      "name": "Eiche",
      "slug": "eiche"
    },
    {
      "id": 67,
      "name": "Wasserfest",
      "slug": "wasserfest"
    }
  ],

  // Related Products
  "related_products": [1135, 1136, 1137],
  "cross_sell_products": [2234, 2456],

  // ============================================
  // JAEGER CUSTOM FIELDS (30+ Felder)
  // ============================================
  "jaeger_fields": {

    // Test & Anzeige
    "testdummy": "",
    "show_text_produktuebersicht": true,
    "text_produktuebersicht": "inkl. Trittschalldämmung & Sockelleiste",

    // ─────────────────────────────────────
    // UVP-SYSTEM
    // ─────────────────────────────────────
    "show_uvp": true,
    "uvp": 52.95,                    // UVP pro m²
    "uvp_paketpreis": 117.56,        // UVP pro Paket

    // ─────────────────────────────────────
    // PAKET-PREISE
    // ─────────────────────────────────────
    "paketpreis": 95.45,             // Regulärer Preis pro Paket
    "paketpreis_s": 77.75,           // Sonderpreis pro Paket (Aktion)

    // ─────────────────────────────────────
    // PAKET-DETAILS
    // ─────────────────────────────────────
    "paketinhalt": 2.22,             // Inhalt pro Paket in m²
    "einheit": "Quadratmeter",
    "einheit_short": "m²",
    "verpackungsart": "Paket",
    "verpackungsart_short": "Pak",
    "verschnitt": 5,                 // Verschnitt in % (default: 5)

    // ─────────────────────────────────────
    // LIEFERZEIT
    // ─────────────────────────────────────
    "show_lieferzeit": true,
    "lieferzeit": "3-7 Arbeitstage oder im Markt abholen",

    // ─────────────────────────────────────
    // ARTIKELBESCHREIBUNG (Rich Text)
    // ─────────────────────────────────────
    "artikelbeschreibung": "<h3>Produktdetails</h3><p>Dieser hochwertige...</p>",

    // ─────────────────────────────────────
    // SET-ANGEBOT AKTIVIERUNG
    // ─────────────────────────────────────
    "show_setangebot": true,

    // ─────────────────────────────────────
    // SET-ANGEBOT DATEN (wenn aktiviert)
    // ─────────────────────────────────────
    "setangebot": {
      // Basis-Konfiguration
      "titel": "Komplett-Set",
      "rabatt": 10,                  // Zusatzrabatt in %

      // Berechnete Werte (vom Backend)
      "einzelpreis": 45.99,          // Einzelkauf-Preis pro m²
      "gesamtpreis": 34.99,          // Set-Preis pro m²
      "ersparnis_euro": 11.00,       // Ersparnis in €
      "ersparnis_prozent": 23.9,     // Ersparnis in %

      // Styling
      "text_color": "black",
      "text_size": "large",
      "button_style": "primary",

      // Standard-Produkte (IDs)
      "standard_daemmung_id": 2234,
      "standard_sockelleisten_id": 2456,

      // Optional wählbare Produkte (IDs Array)
      "option_daemmung_ids": [2234, 2235, 2236],
      "option_sockelleisten_ids": [2456, 2457, 2458],

      // Standard-Dämmung (vollständige Daten)
      "standard_daemmung": {
        "id": 2234,
        "name": "Trittschalldämmung Premium 3mm",
        "slug": "trittschalldaemmung-premium-3mm",
        "price": 4.95,
        "regular_price": 5.95,
        "sale_price": 4.95,
        "image": "https://plan-dein-ding.de/.../daemmung.jpg",
        "paketinhalt": 10.0,
        "einheit_short": "m²"
      },

      // Standard-Sockelleiste (vollständige Daten)
      "standard_sockelleisten": {
        "id": 2456,
        "name": "Sockelleiste Eiche 60mm",
        "slug": "sockelleiste-eiche-60mm",
        "price": 7.95,
        "regular_price": 9.95,
        "sale_price": 7.95,
        "image": "https://plan-dein-ding.de/.../sockelleiste.jpg",
        "paketinhalt": 2.5,
        "einheit_short": "lfm"
      }
    },

    // ─────────────────────────────────────
    // ZUSATZPRODUKTE (erweitert)
    // ─────────────────────────────────────
    "zusatzprodukte": {
      "daemmung": {
        "standard_id": 2234,
        "options_ids": [2234, 2235, 2236],

        // Standard-Produkt (vollständige Daten)
        "standard": {
          "id": 2234,
          "name": "Trittschalldämmung Premium 3mm",
          "price": 4.95,
          "image": "https://...",
          "paketinhalt": 10.0,
          "einheit_short": "m²"
        },

        // Alle wählbaren Optionen (Array mit vollständigen Daten)
        "options": [
          {
            "id": 2234,
            "name": "Trittschalldämmung Premium 3mm",
            "price": 4.95,
            "image": "https://...",
            "paketinhalt": 10.0,
            "einheit_short": "m²"
          },
          {
            "id": 2235,
            "name": "Trittschalldämmung Premium 5mm",
            "price": 6.95,
            "image": "https://...",
            "paketinhalt": 8.0,
            "einheit_short": "m²"
          },
          {
            "id": 2236,
            "name": "Aqua-Stop Dampfsperre",
            "price": 3.95,
            "image": "https://...",
            "paketinhalt": 15.0,
            "einheit_short": "m²"
          }
        ]
      },

      "sockelleisten": {
        "standard_id": 2456,
        "options_ids": [2456, 2457, 2458],

        "standard": {
          "id": 2456,
          "name": "Sockelleiste Eiche 60mm",
          "price": 7.95,
          "image": "https://...",
          "paketinhalt": 2.5,
          "einheit_short": "lfm"
        },

        "options": [
          {
            "id": 2456,
            "name": "Sockelleiste Eiche 60mm",
            "price": 7.95,
            "image": "https://...",
            "paketinhalt": 2.5,
            "einheit_short": "lfm"
          },
          {
            "id": 2457,
            "name": "Sockelleiste Eiche 80mm",
            "price": 9.95,
            "image": "https://...",
            "paketinhalt": 2.5,
            "einheit_short": "lfm"
          },
          {
            "id": 2458,
            "name": "Sockelleiste Weiß foliert",
            "price": 5.95,
            "image": "https://...",
            "paketinhalt": 2.5,
            "einheit_short": "lfm"
          }
        ]
      }
    },

    // ─────────────────────────────────────
    // STYLING-OPTIONEN
    // ─────────────────────────────────────
    "styling": {
      "text_color": "black",
      "text_size": "medium",
      "button_style": "primary"
    }
  }
}
```

### Produktliste: `/jaeger/v1/products`

```json
{
  "products": [
    {
      "id": 1134,
      "name": "Rigid-Vinyl Eiche Newstead",
      "slug": "rigid-vinyl-eiche-newstead",
      "permalink": "https://plan-dein-ding.de/produkt/...",
      "price": 34.99,
      "regular_price": 42.95,
      "on_sale": true,
      "image": "https://plan-dein-ding.de/.../Newstead.jpg",
      "categories": [
        {"id": 16, "name": "Vinylboden", "slug": "vinylboden"},
        {"id": 17, "name": "Rigid-Vinyl", "slug": "rigid-vinyl"}
      ],
      "has_setangebot": false
    },
    // ... weitere 19 Produkte
  ],
  "pagination": {
    "total": 446,              // Gesamt-Produktanzahl
    "total_pages": 23,         // Gesamt-Seitenanzahl
    "current_page": 1,
    "per_page": 20
  }
}
```

### Kategorien: `/jaeger/v1/categories`

```json
[
  {
    "id": 15,
    "name": "Laminat",
    "slug": "laminat",
    "count": 87,                    // Produktanzahl
    "description": "Hochwertiges Laminat...",
    "parent": 0,                    // 0 = Haupt-Kategorie
    "image": "https://plan-dein-ding.de/.../laminat-cat.jpg"
  },
  {
    "id": 16,
    "name": "Vinylboden",
    "slug": "vinylboden",
    "count": 156,
    "description": "",
    "parent": 0,
    "image": "https://..."
  },
  {
    "id": 17,
    "name": "Rigid-Vinyl",
    "slug": "rigid-vinyl",
    "count": 89,
    "description": "",
    "parent": 16,                   // Sub-Kategorie von Vinylboden
    "image": null
  }
  // ... weitere Kategorien
]
```

### Set-Berechnung: `POST /jaeger/v1/calculate-set`

**Request Body:**
```json
{
  "wantedM2": 26.7,
  "floorProductId": 1134,
  "insulationProductId": 2234,
  "baseboardProductId": 2456
}
```

**Response:**
```json
{
  "quantities": {
    "floor": {
      "packages": 12,              // Benötigte Pakete
      "actualM2": 26.64,           // Tatsächliche m² (12 Pakete × 2.22)
      "wantedM2": 26.7,            // Gewünschte m²
      "paketinhalt": 2.22,
      "wasteM2": -0.06             // Verschnitt (negativ = weniger als gewünscht)
    },
    "insulation": {
      "packages": 3,
      "actualM2": 30.0,
      "neededM2": 26.64,
      "paketinhalt": 10.0
    },
    "baseboard": {
      "packages": 11,
      "actualLfm": 27.5,
      "neededLfm": 26.64,          // 1 m² = 1 lfm (Business Rule)
      "paketinhalt": 2.5
    }
  },
  "prices": {
    "floorPrice": 933.00,          // 12 Pakete × 77,75€
    "insulationSurcharge": 0.00,   // Standard-Dämmung = kostenlos
    "baseboardSurcharge": 22.00,   // Premium-Aufpreis (Differenz zu Standard)
    "totalDisplayPrice": 955.00,   // Gesamtpreis
    "comparisonPriceTotal": 1227.33, // Einzelkauf-Preis
    "savings": 272.33,             // Ersparnis in €
    "savingsPercent": 22.2,        // Ersparnis in %
    "pricePerM2": 35.85            // Preis pro m²
  }
}
```

---

## 💻 Next.js Integration

### 1. API Client erstellen

```typescript
// lib/api/jaeger.ts
const API_BASE = process.env.NEXT_PUBLIC_WP_API_URL || 'https://plan-dein-ding.de/wp-json';

/**
 * Produktliste laden
 */
export async function getProducts(params?: {
  category?: string;
  page?: number;
  perPage?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.perPage) searchParams.set('per_page', params.perPage.toString());

  const url = `${API_BASE}/jaeger/v1/products?${searchParams}`;
  const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1h

  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

/**
 * Einzelprodukt laden (mit ALLEN Feldern)
 */
export async function getProduct(productId: number) {
  const url = `${API_BASE}/jaeger/v1/products/${productId}`;
  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    if (response.status === 404) throw new Error('Product not found');
    throw new Error('Failed to fetch product');
  }

  return response.json();
}

/**
 * Kategorien laden
 */
export async function getCategories() {
  const url = `${API_BASE}/jaeger/v1/categories`;
  const response = await fetch(url, { next: { revalidate: 86400 } }); // Cache 24h

  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

/**
 * Set-Angebot berechnen
 */
export async function calculateSet(params: {
  wantedM2: number;
  floorProductId: number;
  insulationProductId?: number;
  baseboardProductId?: number;
}) {
  const url = `${API_BASE}/jaeger/v1/calculate-set`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
    cache: 'no-store' // Immer frisch berechnen
  });

  if (!response.ok) throw new Error('Calculation failed');
  return response.json();
}
```

### 2. Environment Variables

```env
# .env.local
NEXT_PUBLIC_WP_API_URL=https://plan-dein-ding.de/wp-json
```

---

## ⚛️ React Components

### Produktliste (Server Component)

```typescript
// app/products/page.tsx
import { getProducts } from '@/lib/api/jaeger';
import ProductCard from '@/components/ProductCard';

export default async function ProductsPage({
  searchParams
}: {
  searchParams: { category?: string; page?: string }
}) {
  const data = await getProducts({
    category: searchParams.category,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    perPage: 20
  });

  return (
    <div className="container">
      <h1>Unsere Produkte</h1>

      <div className="products-grid">
        {data.products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <span>Seite {data.pagination.current_page} von {data.pagination.total_pages}</span>
        <span>{data.pagination.total} Produkte</span>
      </div>
    </div>
  );
}
```

### Produktkarte Component

```typescript
// components/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    regular_price: number;
    on_sale: boolean;
    image: string;
    categories: Array<{ id: number; name: string; slug: string }>;
    has_setangebot: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <Link href={`/products/${product.slug}`}>
        <div className="image-wrapper">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="product-image"
          />

          {product.on_sale && (
            <span className="sale-badge">
              Sale
            </span>
          )}

          {product.has_setangebot && (
            <span className="set-badge">
              Set-Angebot
            </span>
          )}
        </div>

        <div className="product-info">
          <h3>{product.name}</h3>

          <div className="categories">
            {product.categories.map(cat => (
              <span key={cat.id} className="category-tag">
                {cat.name}
              </span>
            ))}
          </div>

          <div className="price">
            {product.on_sale ? (
              <>
                <span className="sale-price">{product.price}€</span>
                <span className="regular-price">{product.regular_price}€</span>
              </>
            ) : (
              <span>{product.price}€</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
```

### Einzelprodukt Seite (Server Component)

```typescript
// app/products/[slug]/page.tsx
import { getProduct } from '@/lib/api/jaeger';
import ImageGallery from '@/components/ImageGallery';
import PriceDisplay from '@/components/PriceDisplay';
import SetAngebot from '@/components/SetAngebot';
import { notFound } from 'next/navigation';

export default async function ProductPage({
  params
}: {
  params: { slug: string }
}) {
  let product;

  try {
    // In Produktion: slug zu ID konvertieren (z.B. via separate API oder Mapping)
    // Für Demo: Verwende fixe ID
    product = await getProduct(1134);
  } catch (error) {
    notFound();
  }

  const { jaeger_fields } = product;

  return (
    <div className="product-detail">
      <div className="product-layout">
        {/* Linke Seite: Bilder */}
        <div className="product-images">
          <ImageGallery images={product.images} />
        </div>

        {/* Rechte Seite: Infos */}
        <div className="product-info">
          <h1>{product.name}</h1>

          {/* Kategorien */}
          <div className="categories">
            {product.categories.map(cat => (
              <a key={cat.id} href={`/products?category=${cat.slug}`}>
                {cat.name}
              </a>
            ))}
          </div>

          {/* Preis mit UVP */}
          <PriceDisplay
            price={product.prices.price}
            regularPrice={product.prices.regular_price}
            onSale={product.prices.on_sale}
            uvp={jaeger_fields.show_uvp ? jaeger_fields.uvp : null}
            einheit={jaeger_fields.einheit_short}
          />

          {/* Paket-Informationen */}
          <div className="paket-info">
            <h3>Paket-Details</h3>
            <div className="info-grid">
              <div>
                <strong>Paketinhalt:</strong>
                <span>{jaeger_fields.paketinhalt} {jaeger_fields.einheit_short}</span>
              </div>
              <div>
                <strong>Preis pro Paket:</strong>
                <span>
                  {jaeger_fields.paketpreis_s || jaeger_fields.paketpreis}€
                </span>
              </div>
              <div>
                <strong>Verschnitt:</strong>
                <span>{jaeger_fields.verschnitt}%</span>
              </div>
              <div>
                <strong>Verpackung:</strong>
                <span>{jaeger_fields.verpackungsart}</span>
              </div>
            </div>
          </div>

          {/* Lagerbestand */}
          <div className="stock-info">
            {product.stock.stock_status === 'instock' ? (
              <span className="in-stock">
                ✓ Auf Lager ({product.stock.stock_quantity} verfügbar)
              </span>
            ) : (
              <span className="out-of-stock">
                Nicht auf Lager
              </span>
            )}
          </div>

          {/* Lieferzeit */}
          {jaeger_fields.show_lieferzeit && (
            <div className="delivery-time">
              <strong>Lieferzeit:</strong>
              <span>{jaeger_fields.lieferzeit}</span>
            </div>
          )}

          {/* Set-Angebot */}
          {jaeger_fields.show_setangebot && jaeger_fields.setangebot && (
            <SetAngebot
              productId={product.id}
              setangebot={jaeger_fields.setangebot}
              paketinhalt={jaeger_fields.paketinhalt}
              verschnitt={jaeger_fields.verschnitt}
            />
          )}

          {/* Standard: In den Warenkorb */}
          {!jaeger_fields.show_setangebot && (
            <button className="add-to-cart">
              In den Warenkorb
            </button>
          )}
        </div>
      </div>

      {/* Beschreibung */}
      <div className="product-description">
        <h2>Produktbeschreibung</h2>
        <div dangerouslySetInnerHTML={{ __html: product.description }} />

        {jaeger_fields.artikelbeschreibung && (
          <div dangerouslySetInnerHTML={{
            __html: jaeger_fields.artikelbeschreibung
          }} />
        )}
      </div>

      {/* Zusatzprodukte anzeigen */}
      {jaeger_fields.zusatzprodukte && (
        <div className="zusatzprodukte">
          <h2>Empfohlenes Zubehör</h2>

          <div className="zubehoer-grid">
            <h3>Trittschalldämmung</h3>
            {jaeger_fields.zusatzprodukte.daemmung.options.map(daemmung => (
              <ProductCard key={daemmung.id} product={daemmung} />
            ))}
          </div>

          <div className="zubehoer-grid">
            <h3>Sockelleisten</h3>
            {jaeger_fields.zusatzprodukte.sockelleisten.options.map(sockel => (
              <ProductCard key={sockel.id} product={sockel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Set-Angebot Component (Client Component)

```typescript
// components/SetAngebot.tsx
'use client';

import { useState, useEffect } from 'react';
import { calculateSet } from '@/lib/api/jaeger';

interface SetAngebotProps {
  productId: number;
  setangebot: any;
  paketinhalt: number;
  verschnitt: number;
}

export default function SetAngebot({
  productId,
  setangebot,
  paketinhalt,
  verschnitt
}: SetAngebotProps) {
  const [wantedM2, setWantedM2] = useState(25);
  const [calculation, setCalculation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Dämmung & Sockelleiste Auswahl
  const [selectedDaemmung, setSelectedDaemmung] = useState(
    setangebot.standard_daemmung_id
  );
  const [selectedSockelleiste, setSelectedSockelleiste] = useState(
    setangebot.standard_sockelleisten_id
  );

  // Live-Berechnung bei Änderungen
  useEffect(() => {
    const calculate = async () => {
      setLoading(true);
      try {
        const result = await calculateSet({
          wantedM2,
          floorProductId: productId,
          insulationProductId: selectedDaemmung,
          baseboardProductId: selectedSockelleiste
        });
        setCalculation(result);
      } catch (error) {
        console.error('Calculation error:', error);
      } finally {
        setLoading(false);
      }
    };

    calculate();
  }, [wantedM2, selectedDaemmung, selectedSockelleiste, productId]);

  return (
    <div className="set-angebot">
      <div className="set-header">
        <h2>{setangebot.titel}</h2>
        {setangebot.ersparnis_prozent > 0 && (
          <span className="savings-badge">
            -{Math.round(setangebot.ersparnis_prozent)}% Ersparnis
          </span>
        )}
      </div>

      {/* m²-Eingabe */}
      <div className="m2-input">
        <label>Gewünschte Fläche (m²)</label>
        <input
          type="number"
          value={wantedM2}
          onChange={(e) => setWantedM2(parseFloat(e.target.value))}
          step="0.1"
          min="1"
        />
      </div>

      {/* Dämmung Auswahl */}
      <div className="product-selector">
        <h3>Trittschalldämmung</h3>
        <select
          value={selectedDaemmung}
          onChange={(e) => setSelectedDaemmung(parseInt(e.target.value))}
        >
          {setangebot.option_daemmung_ids.map((id: number) => {
            const daemmung = setangebot.zusatzprodukte?.daemmung.options.find(
              (opt: any) => opt.id === id
            );
            return daemmung ? (
              <option key={id} value={id}>
                {daemmung.name} - {daemmung.price}€
                {id === setangebot.standard_daemmung_id && ' (kostenlos im Set)'}
              </option>
            ) : null;
          })}
        </select>
      </div>

      {/* Sockelleisten Auswahl */}
      <div className="product-selector">
        <h3>Sockelleisten</h3>
        <select
          value={selectedSockelleiste}
          onChange={(e) => setSelectedSockelleiste(parseInt(e.target.value))}
        >
          {setangebot.option_sockelleisten_ids.map((id: number) => {
            const sockel = setangebot.zusatzprodukte?.sockelleisten.options.find(
              (opt: any) => opt.id === id
            );
            return sockel ? (
              <option key={id} value={id}>
                {sockel.name} - {sockel.price}€
                {id === setangebot.standard_sockelleisten_id && ' (kostenlos im Set)'}
              </option>
            ) : null;
          })}
        </select>
      </div>

      {/* Berechnung anzeigen */}
      {loading ? (
        <div className="loading">Wird berechnet...</div>
      ) : calculation ? (
        <div className="calculation-result">
          <div className="quantities">
            <h3>Benötigte Mengen</h3>
            <div className="quantity-grid">
              <div>
                <strong>Boden:</strong>
                <span>{calculation.quantities.floor.packages} Pakete</span>
                <small>({calculation.quantities.floor.actualM2} m²)</small>
              </div>
              <div>
                <strong>Dämmung:</strong>
                <span>{calculation.quantities.insulation?.packages || 0} Pakete</span>
              </div>
              <div>
                <strong>Sockelleiste:</strong>
                <span>{calculation.quantities.baseboard?.packages || 0} Pakete</span>
              </div>
            </div>
          </div>

          <div className="price-summary">
            <div className="price-line">
              <span>Boden:</span>
              <span>{calculation.prices.floorPrice}€</span>
            </div>
            {calculation.prices.insulationSurcharge > 0 && (
              <div className="price-line surcharge">
                <span>Dämmung Aufpreis:</span>
                <span>+{calculation.prices.insulationSurcharge}€</span>
              </div>
            )}
            {calculation.prices.baseboardSurcharge > 0 && (
              <div className="price-line surcharge">
                <span>Sockelleiste Aufpreis:</span>
                <span>+{calculation.prices.baseboardSurcharge}€</span>
              </div>
            )}
            <div className="price-line total">
              <span>Gesamtpreis:</span>
              <span className="total-price">
                {calculation.prices.totalDisplayPrice}€
              </span>
            </div>
            {calculation.prices.savings > 0 && (
              <div className="savings">
                <span>Sie sparen:</span>
                <span className="savings-amount">
                  {calculation.prices.savings}€
                  ({calculation.prices.savingsPercent}%)
                </span>
              </div>
            )}
          </div>

          <button className="add-set-to-cart">
            Set in den Warenkorb
          </button>
        </div>
      ) : null}
    </div>
  );
}
```

---

## 📘 TypeScript Types

```typescript
// types/product.ts

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: 'simple' | 'variable' | 'grouped' | 'external';
  status: 'publish' | 'draft' | 'pending';
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  date_created: string;
  date_modified: string;

  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    on_sale: boolean;
    date_on_sale_from: string | null;
    date_on_sale_to: string | null;
    price_html: string;
  };

  stock: {
    stock_status: 'instock' | 'outofstock' | 'onbackorder';
    stock_quantity: number | null;
    manage_stock: boolean;
    backorders: 'no' | 'notify' | 'yes';
    backorders_allowed: boolean;
    backordered: boolean;
  };

  shipping: {
    weight: string;
    length: string;
    width: string;
    height: string;
    shipping_class: string;
  };

  images: ProductImage[];
  categories: ProductCategory[];
  tags: ProductTag[];
  related_products: number[];
  cross_sell_products: number[];
}

export interface ProductImage {
  id: number;
  src: string;
  src_thumbnail: string;
  src_medium: string;
  src_large: string;
  name: string;
  alt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductTag {
  id: number;
  name: string;
  slug: string;
}

export interface JaegerCustomFields {
  testdummy: string;
  show_text_produktuebersicht: boolean;
  text_produktuebersicht: string;

  // UVP
  show_uvp: boolean;
  uvp: number;
  uvp_paketpreis: number;

  // Preise
  paketpreis: number;
  paketpreis_s: number;

  // Paket-Details
  paketinhalt: number;
  einheit: string;
  einheit_short: string;
  verpackungsart: string;
  verpackungsart_short: string;
  verschnitt: number;

  // Lieferzeit
  show_lieferzeit: boolean;
  lieferzeit: string;

  // Beschreibung
  artikelbeschreibung: string;

  // Set-Angebot
  show_setangebot: boolean;
  setangebot: SetAngebot | null;

  // Zusatzprodukte
  zusatzprodukte: {
    daemmung: ZusatzproduktGroup;
    sockelleisten: ZusatzproduktGroup;
  };

  // Styling
  styling: {
    text_color: string;
    text_size: string;
    button_style: string;
  };
}

export interface SetAngebot {
  titel: string;
  rabatt: number;
  einzelpreis: number;
  gesamtpreis: number;
  ersparnis_euro: number;
  ersparnis_prozent: number;
  text_color: string;
  text_size: string;
  button_style: string;
  standard_daemmung_id: number;
  standard_sockelleisten_id: number;
  option_daemmung_ids: number[];
  option_sockelleisten_ids: number[];
  standard_daemmung: SimpleProduct | null;
  standard_sockelleisten: SimpleProduct | null;
}

export interface ZusatzproduktGroup {
  standard_id: number;
  options_ids: number[];
  standard: SimpleProduct | null;
  options: SimpleProduct[];
}

export interface SimpleProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  regular_price: number;
  sale_price: number | null;
  image: string;
  paketinhalt: number;
  einheit_short: string;
}

export interface JaegerProduct extends WooCommerceProduct {
  jaeger_fields: JaegerCustomFields;
}

export interface ProductList {
  products: SimpleProduct[];
  pagination: {
    total: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
}

export interface SetCalculation {
  quantities: {
    floor: {
      packages: number;
      actualM2: number;
      wantedM2: number;
      paketinhalt: number;
      wasteM2: number;
    };
    insulation: {
      packages: number;
      actualM2: number;
      neededM2: number;
      paketinhalt: number;
    } | null;
    baseboard: {
      packages: number;
      actualLfm: number;
      neededLfm: number;
      paketinhalt: number;
    } | null;
  };
  prices: {
    floorPrice: number;
    insulationSurcharge: number;
    baseboardSurcharge: number;
    totalDisplayPrice: number;
    comparisonPriceTotal: number | null;
    savings: number | null;
    savingsPercent: number | null;
    pricePerM2: number;
  };
}
```

---

## 🎯 Best Practices

### 1. Caching Strategy

```typescript
// Server Components: Nutze Next.js Cache
export async function getProducts() {
  const response = await fetch(url, {
    next: {
      revalidate: 3600,  // 1 Stunde Cache
      tags: ['products']  // Für gezieltes Invalidieren
    }
  });
}

// Client Components: Nutze SWR oder React Query
import useSWR from 'swr';

function ProductList() {
  const { data, error, isLoading } = useSWR(
    '/jaeger/v1/products',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000  // 1 Minute
    }
  );
}
```

### 2. Error Handling

```typescript
// lib/api/jaeger.ts
export async function getProduct(id: number) {
  try {
    const response = await fetch(`${API_BASE}/jaeger/v1/products/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new ProductNotFoundError(`Product ${id} not found`);
      }
      throw new ApiError(`API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      throw error;  // Re-throw für notFound()
    }
    console.error('API Error:', error);
    throw new ApiError('Failed to fetch product');
  }
}
```

### 3. Loading States

```typescript
// app/products/[slug]/page.tsx
import { Suspense } from 'react';
import ProductSkeleton from '@/components/ProductSkeleton';

export default function ProductPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent />
    </Suspense>
  );
}
```

### 4. SEO Optimization

```typescript
// app/products/[slug]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id);

  return {
    title: `${product.name} kaufen | Bodenjäger`,
    description: product.short_description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: [product.images[0].src],
      type: 'website',
    },
  };
}
```

### 5. Performance Optimization

```typescript
// Lazy Loading für schwere Components
import dynamic from 'next/dynamic';

const SetAngebot = dynamic(() => import('@/components/SetAngebot'), {
  loading: () => <p>Lädt Set-Angebot...</p>,
  ssr: false  // Nur client-side laden
});

// Image Optimization
import Image from 'next/image';

<Image
  src={product.image}
  alt={product.name}
  width={600}
  height={600}
  priority={false}  // Lazy loading
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

---

## ✅ Checkliste: Frontend Integration

### Backend (WordPress)
- [x] `api-endpoints.php` hochgeladen
- [x] `api-product-data.php` hochgeladen
- [x] `JaegerPlugin.php` angepasst
- [x] Plugin reaktiviert
- [x] API getestet (446 Produkte verfügbar)

### Frontend (Next.js)
- [ ] API Client erstellen (`lib/api/jaeger.ts`)
- [ ] TypeScript Types definieren (`types/product.ts`)
- [ ] Environment Variables setzen (`.env.local`)
- [ ] Produktliste Page (`app/products/page.tsx`)
- [ ] Einzelprodukt Page (`app/products/[slug]/page.tsx`)
- [ ] ProductCard Component
- [ ] SetAngebot Component
- [ ] Error Handling implementieren
- [ ] Loading States implementieren
- [ ] SEO Metadata hinzufügen
- [ ] Caching Strategy umsetzen

---

## 🎉 Fertig!

Du hast jetzt **vollständigen API-Zugriff** auf:

✅ **446 Produkte** mit allen Details
✅ **Standard WooCommerce Felder** (Preise, Bilder, Kategorien, etc.)
✅ **30+ Jaeger Custom Fields** (Paketpreise, UVP, Set-Angebote, etc.)
✅ **Live-Berechnungen** für Set-Angebote
✅ **Zusatzprodukte** (Dämmung, Sockelleisten) mit vollständigen Daten

**API Base URL:**
```
https://plan-dein-ding.de/wp-json/jaeger/v1
```

**Test-Link:**
```
https://plan-dein-ding.de/wp-json/jaeger/v1/products
```

---

**Viel Erfolg mit dem Headless Frontend! 🚀**
