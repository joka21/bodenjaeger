# Jäger API - Fields Parameter Dokumentation

**Version**: 1.2.0
**Stand**: 14. November 2025

## Übersicht

Die Jäger Products API unterstützt jetzt einen `fields` Parameter zur Performance-Optimierung. Damit kann das Frontend **nur die benötigten Felder** anfordern, was die Payload-Größe um **70-90% reduziert**.

---

## API Endpoints

### 1. Einzelprodukt

```
GET /wp-json/jaeger/v1/products/{id}?fields={mode}
```

**Parameter:**
- `id` (required): Produkt-ID
- `fields` (optional): `full` (default), `critical`, `minimal`

**Beispiele:**
```bash
# Alle Felder (Standard)
GET /wp-json/jaeger/v1/products/1134

# Nur kritische Felder für Produktkarten
GET /wp-json/jaeger/v1/products/1134?fields=critical

# Minimale Felder für Modals
GET /wp-json/jaeger/v1/products/1134?fields=minimal
```

---

### 2. Produktliste

```
GET /wp-json/jaeger/v1/products?fields={mode}&per_page=20&page=1
```

**Parameter:**
- `fields` (optional): `full` (default), `critical`, `minimal`
- `per_page` (optional): Anzahl Produkte pro Seite (default: 20)
- `page` (optional): Seite (default: 1)
- `category` (optional): Kategorie-Slug filter
- `include` (optional): Kommagetrennte Produkt-IDs

**Beispiele:**
```bash
# Kategorie-Seite mit kritischen Feldern
GET /wp-json/jaeger/v1/products?category=laminat&per_page=12&fields=critical

# Spezifische Produkte für Modal (Dämmung)
GET /wp-json/jaeger/v1/products?include=1234,1235,1236&fields=minimal

# Startseite mit kritischen Feldern
GET /wp-json/jaeger/v1/products?per_page=12&fields=critical
```

---

## Field Modes

### 🟢 `fields=critical` (Produktkarten)

**Verwendung:** Startseite, Kategorie-Listen, Produktübersichten

**Felder (23):**
```json
{
  "id": 1134,
  "name": "Rigid-Vinyl Eiche Newstead",
  "slug": "rigid-vinyl-eiche-newstead",

  "thumbnail": "https://..../image.jpg",
  "thumbnail_alt": "Alt Text",
  "thumbnail_sizes": {
    "thumbnail": "...",
    "medium": "...",
    "large": "...",
    "full": "...",
    "woocommerce_thumbnail": "...",
    "woocommerce_single": "..."
  },

  "price": 49.99,
  "regular_price": 49.99,
  "sale_price": null,
  "on_sale": false,
  "discount_percent": 0,

  "uvp": null,
  "show_uvp": false,
  "einheit_short": "m²",

  "has_setangebot": true,
  "setangebot_ersparnis_prozent": 27,
  "setangebot_einzelpreis": 47.95,
  "setangebot_gesamtpreis": 34.99,

  "is_in_stock": true,
  "stock_status": "instock",

  "aktion": "Restposten",
  "angebotspreis_hinweis": "Black Sale",

  "categories": [
    {"id": 123, "name": "Vinyl", "slug": "vinyl"}
  ]
}
```

**Payload-Größe:** ~2-4 KB pro Produkt
**Performance-Gain:** ~70% kleiner als `fields=full`

---

### 🟡 `fields=minimal` (Modals)

**Verwendung:** Dämmung-/Sockelleisten-Auswahl, Quick-View Modals

**Felder (9):**
```json
{
  "id": 1234,
  "name": "Trittschalldämmung Premium",
  "price": 12.99,
  "image": "https://..../image.jpg",
  "image_alt": "Alt Text",
  "einheit_short": "m²",
  "paketinhalt": 10.0,
  "verpackungsart_short": "Rol.",
  "is_in_stock": true
}
```

**Payload-Größe:** ~1 KB pro Produkt
**Performance-Gain:** ~90% kleiner als `fields=full`

---

### 🔵 `fields=full` (Standard)

**Verwendung:** Produktdetailseite, Admin-Bereiche

**Felder:** ALLE (~100+ Felder)
- Alle WooCommerce Standard-Felder
- Alle Jäger Custom Fields (40+)
- Bilder mit allen Größen
- Kategorien, Tags, Attribute
- Zusatzprodukte mit Details
- Set-Angebot vollständig
- Versand, Lager, Reviews
- Meta-Daten

**Payload-Größe:** ~10-15 KB pro Produkt
**Verwendung:** Wenn alle Daten benötigt werden

---

## Performance Impact

### Beispiel: Startseite mit 12 Produkten

| Mode | Payload | Transfer (3G) | Improvement |
|------|---------|---------------|-------------|
| `full` | 180 KB | ~800ms | Basis |
| `critical` | 50 KB | ~250ms | **72% schneller** |
| `minimal` | 15 KB | ~80ms | **90% schneller** |

### Beispiel: Modal mit 5 Zusatzprodukten

| Mode | Payload | Improvement |
|------|---------|-------------|
| `full` | 75 KB | Basis |
| `minimal` | 5 KB | **93% kleiner** |

---

## TypeScript Interfaces

### Critical Product
```typescript
interface ProductCritical {
  id: number;
  name: string;
  slug: string;

  thumbnail: string | null;
  thumbnail_alt: string;
  thumbnail_sizes: {
    thumbnail: string;
    medium: string;
    large: string;
    full: string;
    woocommerce_thumbnail: string;
    woocommerce_single: string;
  } | null;

  price: number;
  regular_price: number;
  sale_price: number | null;
  on_sale: boolean;
  discount_percent: number;

  uvp: number | null;
  show_uvp: boolean;
  einheit_short: string;

  has_setangebot: boolean;
  setangebot_ersparnis_prozent: number | null;
  setangebot_einzelpreis: number | null;
  setangebot_gesamtpreis: number | null;

  is_in_stock: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';

  aktion: string | null;
  angebotspreis_hinweis: string | null;

  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}
```

### Minimal Product
```typescript
interface ProductMinimal {
  id: number;
  name: string;
  price: number;
  image: string | null;
  image_alt: string;
  einheit_short: string;
  paketinhalt: number;
  verpackungsart_short: string;
  is_in_stock: boolean;
}
```

---

## Verwendungsbeispiele

### Next.js Frontend

#### Produktkarten (Startseite)
```typescript
// app/page.tsx
import { fetchProductsCritical } from '@/lib/api/products-critical';

export default async function HomePage() {
  const { products, pagination } = await fetchProductsCritical({
    per_page: 12,
    page: 1
  });

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### Zusatzprodukte Modal
```typescript
// components/set-angebot/daemmung-modal.tsx
import { fetchProductsMinimal } from '@/lib/api/products-minimal';

async function DaemmungModal({ productIds }: { productIds: number[] }) {
  const { products } = await fetchProductsMinimal({
    include: productIds.join(',')
  });

  return (
    <div className="modal">
      {products.map(product => (
        <ProductOption key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### Produktdetailseite
```typescript
// app/products/[slug]/page.tsx
import { fetchProductFull } from '@/lib/api/product-full';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  // fields=full ist default, kann weggelassen werden
  const product = await fetchProductFull(params.slug);

  return <ProductDetails product={product} />;
}
```

---

## Backwards Compatibility

✅ **Keine Breaking Changes!**

- `fields` Parameter ist **optional**
- **Default:** `fields=full` (alle Felder wie bisher)
- Bestehende API-Calls funktionieren **ohne Änderungen**
- Neue Clients können den Parameter nutzen, alte Clients weiterhin nicht

**Beispiele:**
```bash
# Alt (funktioniert weiterhin)
GET /wp-json/jaeger/v1/products

# Neu (opt-in)
GET /wp-json/jaeger/v1/products?fields=critical
```

---

## Testing

### Test-Script
Verwende das bereitgestellte Test-Script:

```bash
# 1. test-fields-api.php in WordPress Root hochladen
# 2. Im Browser aufrufen
https://deine-domain.de/test-fields-api.php

# 3. Nach Test löschen!
```

Das Script testet:
- ✅ `fields=full` (Einzelprodukt)
- ✅ `fields=critical` (Einzelprodukt)
- ✅ `fields=minimal` (Einzelprodukt)
- ✅ `fields=critical` (Produktliste)
- ✅ `include` Parameter mit `fields=minimal`
- 📊 Performance-Vergleich mit Payload-Größen

### cURL Tests
```bash
# Full
curl "https://plan-dein-ding.de/wp-json/jaeger/v1/products/1134?fields=full"

# Critical
curl "https://plan-dein-ding.de/wp-json/jaeger/v1/products/1134?fields=critical"

# Minimal
curl "https://plan-dein-ding.de/wp-json/jaeger/v1/products/1134?fields=minimal"

# Liste mit critical
curl "https://plan-dein-ding.de/wp-json/jaeger/v1/products?per_page=5&fields=critical"

# Include mit minimal
curl "https://plan-dein-ding.de/wp-json/jaeger/v1/products?include=1234,1235&fields=minimal"
```

---

## Implementation Details

### Backend (PHP)

**Datei:** `backend/api-product-data.php`

**Neue Funktionen:**
- `filter_product_fields($product, $fields_mode)` - Hauptfilter
- `filter_critical_fields($product)` - Critical Mode
- `filter_minimal_fields($product)` - Minimal Mode
- `convert_single_product_to_list_format($data)` - Format-Konvertierung

**Flow:**
1. Request kommt mit `fields` Parameter
2. Produktdaten werden vollständig geladen (wie bisher)
3. **NEU:** Basierend auf `fields` Parameter werden Felder gefiltert
4. Response wird zurückgegeben (gefiltert oder vollständig)

### Frontend Integration

**Empfohlene Struktur:**
```
lib/api/
├── jaegerApi.ts           # Base API Client
├── products-critical.ts   # fetchProductsCritical()
├── products-minimal.ts    # fetchProductsMinimal()
├── product-full.ts        # fetchProductFull()
└── types/
    ├── product-critical.ts
    ├── product-minimal.ts
    └── product-full.ts
```

---

## Changelog

### Version 1.2.0 (14.11.2025)
- ✅ **NEU:** `fields` Parameter für Performance-Optimierung
- ✅ **NEU:** `fields=critical` Mode (~23 Felder)
- ✅ **NEU:** `fields=minimal` Mode (~9 Felder)
- ✅ **NEU:** `include` Parameter für spezifische Produkt-IDs
- ✅ **VERBESSERT:** Styling-Felder inkl. Aktionen & Badges
- ✅ **VERBESSERT:** API-Dokumentation
- ✅ **TEST:** Test-Script für alle Modes

### Version 1.1.0 (14.11.2025)
- ✅ Set-Angebot Felder auf Root-Ebene
- ✅ FATAL ERROR Fix für External Products
- ✅ Server-side Preisberechnung

---

## FAQ

### Wann soll ich welchen Mode verwenden?

**`fields=critical`:**
- ✅ Startseite / Home
- ✅ Kategorie-Seiten
- ✅ Suche-Ergebnisse
- ✅ Produktlisten
- ✅ Related Products

**`fields=minimal`:**
- ✅ Dämmung-Auswahl Modal
- ✅ Sockelleisten-Auswahl Modal
- ✅ Quick-View Modals
- ✅ Cross-Sell Popups

**`fields=full`:**
- ✅ Produktdetailseite
- ✅ Admin-Bereiche
- ✅ Wenn alle Daten benötigt werden

### Kann ich eigene Felder hinzufügen?

Ja! Editiere die Filter-Funktionen in `backend/api-product-data.php`:

```php
private function filter_critical_fields($product) {
    return array(
        // Bestehende Felder...

        // Dein custom Feld hinzufügen:
        'mein_feld' => $product['jaeger_meta']['mein_feld'] ?? null,
    );
}
```

### Werden Caches unterstützt?

Ja! Der `fields` Parameter funktioniert mit:
- ✅ WordPress Transient Cache
- ✅ Redis/Memcached
- ✅ CDN Caching (da URL-Parameter)
- ✅ Browser-Cache

Jeder Mode wird **separat gecached** durch unterschiedliche URLs.

---

## Support

Bei Fragen oder Problemen:
1. Test-Script ausführen: `test-fields-api.php`
2. Debug-Log prüfen: `debug-jaeger-plugin.log`
3. Dokumentation checken: `DATENBANK_FELDER.md`

---

**Letzte Aktualisierung:** 14. November 2025, 18:30 Uhr
**Version:** 1.2.0
**Status:** ✅ Production Ready
