# 📊 Backend → Frontend Datenfluss - Bodenjäger Shop

**Version**: 1.0.0
**Stand**: 15. November 2025
**Rolle**: Frontend-Entwickler Guide

---

## 🎯 Übersicht

Dieses Dokument erklärt, wie Produktdaten von WordPress/WooCommerce ins Next.js Frontend kommen und wo sie verwendet werden.

---

## 📍 Datenfluss-Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                    WORDPRESS BACKEND                         │
│  ┌────────────────────────────────────────────────────┐     │
│  │  WooCommerce Datenbank                              │     │
│  │  - Produkte (wp_posts)                              │     │
│  │  - Custom Fields (wp_postmeta)                      │     │
│  │  - 40 Jäger Custom Fields (_paketpreis, etc.)      │     │
│  └────────────────────────────────────────────────────┘     │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Jäger WordPress Plugin                             │     │
│  │  - Datei: api-product-data.php                      │     │
│  │  - Liest Custom Fields aus DB                       │     │
│  │  - Konvertiert Typen (Boolean, Float, Array)       │     │
│  │  - Berechnet Set-Angebot Preise                     │     │
│  └────────────────────────────────────────────────────┘     │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │  REST API Endpoint                                   │     │
│  │  GET /wp-json/jaeger/v1/products                    │     │
│  │  GET /wp-json/jaeger/v1/products/{id}               │     │
│  │                                                      │     │
│  │  Parameter:                                          │     │
│  │  - fields=full (alle Felder)                        │     │
│  │  - fields=critical (23 Felder für Karten)          │     │
│  │  - fields=minimal (9 Felder für Modals)            │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                         ↓
                    HTTPS Request
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │  API Client Layer                                    │     │
│  │  Datei: src/lib/woocommerce.ts                      │     │
│  │                                                      │     │
│  │  class WooCommerceClient {                          │     │
│  │    getProducts(params)                              │     │
│  │    getProduct(slug)                                 │     │
│  │    getProductsByIds(ids[])                          │     │
│  │  }                                                  │     │
│  └────────────────────────────────────────────────────┘     │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │  TypeScript Interfaces                               │     │
│  │  Datei: src/lib/woocommerce.ts                      │     │
│  │                                                      │     │
│  │  interface StoreApiProduct {                        │     │
│  │    id: number                                       │     │
│  │    name: string                                     │     │
│  │    // WooCommerce Standard-Felder                  │     │
│  │    price: number                                    │     │
│  │    images: ProductImage[]                           │     │
│  │    // Root-Level Jäger Felder (40)                 │     │
│  │    paketpreis?: number                              │     │
│  │    einheit_short?: string                           │     │
│  │    show_setangebot?: boolean                        │     │
│  │    setangebot_ersparnis_prozent?: number            │     │
│  │    // ... alle anderen                              │     │
│  │  }                                                  │     │
│  └────────────────────────────────────────────────────┘     │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐     │
│  │  React Components                                    │     │
│  │  - ProductCard.tsx                                   │     │
│  │  - SetAngebot.tsx                                    │     │
│  │  - CategoryPageClient.tsx                            │     │
│  │  - BestsellerSlider.tsx                              │     │
│  │  - ... alle anderen                                  │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Wichtige Backend-Dateien

### 1. WordPress Plugin API (Backend)

**Ort**: `src/types/wp-store-api-extension/wp-store-api-extension.php`

**Verantwortlich für**:
- Custom Fields aus Datenbank lesen
- Type-Konvertierung (String → Boolean, Float, Array)
- Set-Angebot Preisberechnung (serverseitig)
- Root-Level Felder bereitstellen

**Wichtige Funktionen**:
```php
// Liest alle 40 Jäger Custom Fields
get_post_meta($product_id, '_paketpreis', true)
get_post_meta($product_id, '_einheit_short', true)
get_post_meta($product_id, '_show_setangebot', true)
// ... etc.

// Berechnet Set-Angebot Preise
calculate_setangebot_prices($product)

// Stellt Felder auf Root-Ebene bereit
$product['paketpreis'] = $jaeger_meta['paketpreis']
$product['einheit_short'] = $jaeger_meta['einheit_short']
```

### 2. Backend-Dokumentation (für dich)

| Datei | Zweck |
|-------|-------|
| `backend/API_FELDER_MAPPING.md` | Alle 40 Felder: DB → API Mapping |
| `backend/API_FIELDS_PARAMETER.md` | fields Parameter Dokumentation |
| `backend/ROOT_LEVEL_FIELDS.md` | Root-Level Felder Zugriff |

---

## 🚀 Frontend Integration

### 1. API Client (`src/lib/woocommerce.ts`)

**Hauptklasse**: `WooCommerceClient`

```typescript
// Singleton Instance
export const wooCommerceClient = new WooCommerceClient();
```

**Wichtige Methoden**:

#### `getProducts(params)` - Produktliste laden
```typescript
const products = await wooCommerceClient.getProducts({
  per_page: 12,
  page: 1,
  category: 'vinyl',
  // fields: 'critical' // Optional: Nur wichtige Felder
});
```

**Verwendet in**:
- Startseite: `src/app/page.tsx`
- Kategorie-Seiten: `src/app/categories/[slug]/page.tsx`
- Slider: `BestsellerSlider.tsx`, `SaleProductSlider.tsx`

#### `getProduct(slug)` - Einzelprodukt laden
```typescript
const product = await wooCommerceClient.getProduct('rigid-vinyl-eiche-newstead');
```

**Verwendet in**:
- Produktdetailseite: `src/app/products/[slug]/page.tsx`

#### `getProductsByIds(ids)` - Mehrere Produkte laden
```typescript
const productsMap = await wooCommerceClient.getProductsByIds([1234, 1235, 1236]);
```

**Verwendet in**:
- Set-Angebot: Laden von Dämmung/Sockelleisten-Optionen
- Zusatzprodukte/Zubehör

---

### 2. TypeScript Interface (`StoreApiProduct`)

**Definiert in**: `src/lib/woocommerce.ts` (Zeile 73-256)

**Struktur**:
```typescript
interface StoreApiProduct {
  // WooCommerce Standard
  id: number;
  name: string;
  slug: string;
  price: number;
  regular_price: number;
  sale_price: number | null;
  on_sale: boolean;
  images: ProductImage[];
  categories: ProductCategory[];
  stock_status: 'instock' | 'outofstock' | 'onbackorder';

  // ✅ ROOT-LEVEL JÄGER FELDER (40)
  // Paketinformationen (8)
  paketpreis?: number | null;
  paketpreis_s?: number | null;
  paketinhalt?: number | null;
  einheit?: string | null;
  einheit_short?: string;        // ✅ Immer verwendet
  verpackungsart?: string | null;
  verpackungsart_short?: string | null;
  verschnitt?: number;

  // UVP System (3)
  show_uvp?: boolean;
  uvp?: number | null;
  uvp_paketpreis?: number | null;

  // Produktbeschreibung (3)
  show_text_produktuebersicht?: boolean;
  text_produktuebersicht?: string | null;
  artikelbeschreibung?: string | null;

  // Set-Angebot Konfiguration (6)
  show_setangebot?: boolean;     // ✅ Zeigt Set-Angebot an
  setangebot_titel?: string;
  setangebot_text_color?: string | null;
  setangebot_text_size?: string | null;
  setangebot_button_style?: string | null;
  setangebot_rabatt?: number;

  // Set-Angebot Berechnete Werte (4) - VOM BACKEND!
  setangebot_einzelpreis?: number | null;      // ✅ Vergleichspreis
  setangebot_gesamtpreis?: number | null;      // ✅ Set-Preis
  setangebot_ersparnis_euro?: number | null;
  setangebot_ersparnis_prozent?: number | null; // ✅ Oft verwendet

  // Zusatzprodukte (4)
  daemmung_id?: number | null;
  sockelleisten_id?: number | null;
  daemmung_option_ids?: number[];
  sockelleisten_option_ids?: number[];

  // Aktionen & Badges (10)
  show_aktion?: boolean;
  aktion?: string | null;
  aktion_text_color?: string | null;
  aktion_text_size?: string | null;
  aktion_button_style?: string | null;
  show_angebotspreis_hinweis?: boolean;
  angebotspreis_hinweis?: string | null;
  angebotspreis_text_color?: string | null;
  angebotspreis_text_size?: string | null;
  angebotspreis_button_style?: string | null;

  // Lieferzeit (2)
  show_lieferzeit?: boolean;
  lieferzeit?: string | null;

  // Testing (1)
  testdummy?: string | null;

  // Calculated (Frontend oder Backend)
  discount_percent?: number;
  has_setangebot?: boolean;
}
```

---

## 📋 Verwendung in Components

### 1. ProductCard (`src/components/ProductCard.tsx`)

**Zweck**: Produktkarte auf Startseite/Kategorie-Seiten

**Verwendete Felder**:
```typescript
// Zeile 19-25
const price = product.price || 0;
const regularPrice = product.regular_price || 0;
const einheitShort = product.einheit_short || 'm²';
const discount = product.has_setangebot
  ? product.setangebot_ersparnis_prozent
  : product.discount_percent;

// Zeile 116-119: Aktions-Badge
{product.show_aktion && product.aktion && (
  <div className="...">
    {product.aktion}
  </div>
)}

// Zeile 203-218: Set-Angebot Section
{product.show_setangebot && (
  <div>
    <h4>{product.setangebot_titel || 'Set-Angebot'}</h4>
    <p>
      {product.daemmung_id && product.sockelleisten_id
        ? 'Inkl. Sockelleiste und Dämmung'
        : product.sockelleisten_id
        ? 'Inkl. Sockelleiste'
        : product.daemmung_id
        ? 'Inkl. Dämmung'
        : 'Set-Angebot'}
    </p>
  </div>
)}

// Zeile 236-240: Angebotspreis-Hinweis
{product.show_angebotspreis_hinweis && product.angebotspreis_hinweis && (
  <div>{product.angebotspreis_hinweis}</div>
)}

// Zeile 272-276: Lieferzeit
{product.show_lieferzeit && product.lieferzeit && (
  <div>🚚 {product.lieferzeit}</div>
)}
```

**Wichtig**: ProductCard nutzt **Root-Level Felder** direkt!
```typescript
// ✅ RICHTIG (Root-Level)
product.einheit_short
product.setangebot_ersparnis_prozent
product.daemmung_id

// ❌ FALSCH (verschachtelt - nicht mehr nötig)
product.jaeger_fields?.einheit_short
product.jaeger_fields?.setangebot?.ersparnis_prozent
```

---

### 2. SetAngebot (`src/components/product/SetAngebot.tsx`)

**Zweck**: Set-Angebot Section auf Produktdetailseite

**Props von Parent Component** (`ProductPageContent.tsx`):
```typescript
// Zeile 28-32: Backend-Preise werden übergeben
comparisonPriceTotal={product.setangebot_einzelpreis}
totalDisplayPrice={product.setangebot_gesamtpreis}
savingsAmount={product.setangebot_ersparnis_euro}
savingsPercent={product.setangebot_ersparnis_prozent}  // ✅ VOM BACKEND!
```

**Verwendung**:
```typescript
// Zeile 113-116: Backend-Preise verwenden
const displayComparisonPrice = comparisonPriceTotal || 0;
const displaySetPrice = totalDisplayPrice || 0;
const displaySavingsPercent = savingsPercent || 0;  // ✅ DIREKT VOM BACKEND

// Zeile 413-431: Gesamt-Preiszeile Desktop
<div className="...">
  <span className="line-through">
    {displayComparisonPrice.toFixed(2).replace('.', ',')} €
  </span>
  <span className="text-red-600">
    {displaySetPrice.toFixed(2).replace('.', ',')} €
  </span>
  {displaySavingsPercent > 0 && (
    <span className="bg-red-600">
      -{Math.round(displaySavingsPercent)}%
    </span>
  )}
</div>
```

**Wichtig**: Alle Preisberechnungen kommen vom Backend!
```typescript
// ✅ RICHTIG - Backend calculated
product.setangebot_einzelpreis      // Vergleichspreis (Einzelkauf)
product.setangebot_gesamtpreis      // Set-Preis
product.setangebot_ersparnis_euro   // Ersparnis in €
product.setangebot_ersparnis_prozent // Ersparnis in %

// ❌ FALSCH - Keine Frontend-Berechnung mehr!
// const setPrice = basePrice + daemmungPrice + sockelleistePrice
```

**Zusatzprodukte laden**:
```typescript
// Zeile 243-244: jaeger_meta für Paketinhalt
{selectedDaemmung?.jaeger_meta?.paketinhalt
  ? `${selectedDaemmung.jaeger_meta.paketinhalt}${selectedDaemmung.jaeger_meta.einheit_short || 'm²'}`
  : daemmungVE || '-'}
```

---

### 3. CategoryPageClient (`src/components/category/CategoryPageClient.tsx`)

**Zweck**: Kategorie-Seite mit Filter/Sorting

**Produktliste laden**:
```typescript
const products = await wooCommerceClient.getProducts({
  category: categorySlug,
  per_page: 12,
  page: currentPage,
  // fields: 'critical' // Optional
});
```

**ProductCard einbinden**:
```tsx
{products.map(product => (
  <ProductCard
    key={product.id}
    product={product}
    showDescription={isFloorCategory}  // Nur bei Boden-Kategorien
  />
))}
```

---

### 4. Slider Components

**Beispiel**: `BestsellerSlider.tsx` (Zeile 19-22)

```typescript
const products = await wooCommerceClient.getProducts({
  per_page: 12,
  featured: true
  // fields: 'critical' // Optional
});
```

---

## 🎨 Fields Parameter (Performance-Optimierung)

### Wann welchen Mode verwenden?

| Mode | Felder | Use Case | Payload-Größe |
|------|--------|----------|---------------|
| **`full`** | ~100+ | Produktdetailseite | ~15 KB |
| **`critical`** | 23 | Produktkarten, Listen | ~4 KB |
| **`minimal`** | 9 | Modals, Zusatzprodukte | ~1 KB |

### Beispiele:

```typescript
// Startseite - nur wichtige Felder
const products = await wooCommerceClient.getProducts({
  per_page: 12,
  // fields: 'critical'  // TODO: Aktivieren für bessere Performance
});

// Modal - minimale Felder
const daemmungOptions = await wooCommerceClient.getProductsByIds(
  product.daemmung_option_ids || []
  // fields: 'minimal'  // TODO: Aktivieren
);

// Produktdetail - alle Felder
const product = await wooCommerceClient.getProduct(slug);
// fields=full ist default
```

**Status**: `fields` Parameter ist im Backend dokumentiert, aber noch nicht aktiv implementiert. Wird später für Performance-Optimierung verwendet.

---

## ✅ Best Practices für dich als Frontend-Entwickler

### 1. Immer Root-Level Felder verwenden
```typescript
// ✅ RICHTIG
product.paketpreis
product.einheit_short
product.setangebot_ersparnis_prozent
product.daemmung_id

// ❌ FALSCH (alte Struktur)
product.jaeger_fields?.paketpreis
product.jaeger_fields?.setangebot?.ersparnis_prozent
```

### 2. Backend-Preise vertrauen
```typescript
// ✅ RICHTIG - Backend calculated
const setPrice = product.setangebot_gesamtpreis;
const savings = product.setangebot_ersparnis_prozent;

// ❌ FALSCH - Keine Neuberechnung im Frontend
const setPrice = basePrice + daemmungPrice + sockelleistePrice;
```

### 3. Null/Undefined Checks
```typescript
// ✅ RICHTIG - Mit Fallback
const einheit = product.einheit_short || 'm²';
const preis = product.paketpreis || 0;

// ✅ RICHTIG - Conditional Rendering
{product.show_setangebot && product.setangebot_titel && (
  <div>{product.setangebot_titel}</div>
)}
```

### 4. Type Safety
```typescript
// ✅ RICHTIG - TypeScript Interface verwenden
import { StoreApiProduct } from '@/lib/woocommerce';

interface MyComponentProps {
  product: StoreApiProduct;
}
```

---

## 🔍 Debugging Guide

### Problem: Felder sind undefined

**Check 1**: Ist das Feld auf Root-Level?
```typescript
console.log('Root-Level:', product.paketpreis);
console.log('Verschachtelt:', product.jaeger_fields?.paketpreis);
```

**Check 2**: API Response prüfen
```bash
curl "https://plan-dein-ding.de/wp-json/jaeger/v1/products/1134"
```

**Check 3**: Backend-Dokumentation checken
- `backend/API_FELDER_MAPPING.md` → Feld-Namen
- `backend/ROOT_LEVEL_FIELDS.md` → Root-Level Zugriff

### Problem: Preise stimmen nicht

**Check**: Sind Backend-Preise gesetzt?
```typescript
console.log('Backend Preise:', {
  einzelpreis: product.setangebot_einzelpreis,
  gesamtpreis: product.setangebot_gesamtpreis,
  ersparnis: product.setangebot_ersparnis_prozent
});
```

**Wichtig**: Preise werden im Backend berechnet, **nicht im Frontend**!

### Problem: Zusatzprodukte fehlen

**Check**: IDs vorhanden?
```typescript
console.log('Zusatzprodukt-IDs:', {
  daemmung: product.daemmung_id,
  daemmung_options: product.daemmung_option_ids,
  sockelleiste: product.sockelleisten_id,
  sockelleisten_options: product.sockelleisten_option_ids
});
```

**Dann laden**:
```typescript
const daemmungOptions = await wooCommerceClient.getProductsByIds(
  product.daemmung_option_ids || []
);
```

---

## 📚 Wichtige Dateien für dich

### Frontend
| Datei | Zweck |
|-------|-------|
| `src/lib/woocommerce.ts` | API Client + TypeScript Interfaces |
| `src/components/ProductCard.tsx` | Produktkarte (verwendet Root-Level) |
| `src/components/product/SetAngebot.tsx` | Set-Angebot Section |
| `src/components/product/ProductPageContent.tsx` | Produktdetailseite |

### Backend-Dokumentation
| Datei | Zweck |
|-------|-------|
| `backend/API_FELDER_MAPPING.md` | Alle 40 Felder: DB → API |
| `backend/ROOT_LEVEL_FIELDS.md` | Root-Level Felder Guide |
| `backend/API_FIELDS_PARAMETER.md` | Performance-Optimierung |

### Backend-Code (nur zum Verstehen)
| Datei | Zweck |
|-------|-------|
| `src/types/wp-store-api-extension/wp-store-api-extension.php` | WordPress Plugin API |

---

## 🚦 Quick Reference: Häufig verwendete Felder

### Produktkarten
```typescript
product.name                          // Produktname
product.slug                          // URL-Slug
product.price                         // Preis
product.regular_price                 // UVP
product.einheit_short                 // "m²" / "lfm"
product.images[0].src                 // Hauptbild
product.show_setangebot               // Hat Set-Angebot?
product.setangebot_ersparnis_prozent  // Rabatt in %
product.show_aktion                   // Hat Aktions-Badge?
product.aktion                        // "Restposten" / "Neuheit"
```

### Set-Angebot
```typescript
product.show_setangebot               // Anzeigen?
product.setangebot_titel              // "Komplett-Set"
product.setangebot_einzelpreis        // Vergleichspreis (Backend)
product.setangebot_gesamtpreis        // Set-Preis (Backend)
product.setangebot_ersparnis_euro     // Ersparnis € (Backend)
product.setangebot_ersparnis_prozent  // Ersparnis % (Backend)
product.daemmung_id                   // Standard Dämmung ID
product.sockelleisten_id              // Standard Sockelleiste ID
product.daemmung_option_ids           // Array von Dämmung-IDs
product.sockelleisten_option_ids      // Array von Sockelleisten-IDs
```

### Produktdetails
```typescript
product.paketpreis                    // Preis pro Paket
product.paketinhalt                   // z.B. 2.22
product.einheit                       // "Quadratmeter"
product.verpackungsart                // "Paket(e)"
product.verschnitt                    // 10 (%)
product.artikelbeschreibung           // HTML Description
product.show_lieferzeit               // Lieferzeit anzeigen?
product.lieferzeit                    // "2-3 Werktage"
```

---

## ✨ Zusammenfassung

### Datenfluss in 4 Schritten:
1. **WordPress DB** → Custom Fields (`_paketpreis`, `_einheit_short`, etc.)
2. **Jäger Plugin** → Liest Fields, konvertiert Typen, berechnet Preise
3. **REST API** → `GET /wp-json/jaeger/v1/products` mit Root-Level Feldern
4. **Next.js** → `wooCommerceClient.getProducts()` → `StoreApiProduct` Interface

### Key Takeaways:
- ✅ **Immer Root-Level Felder** verwenden (`product.paketpreis`)
- ✅ **Backend-Preise** vertrauen (keine Neuberechnung im Frontend)
- ✅ **TypeScript Interface** verwenden (`StoreApiProduct`)
- ✅ **Null-Checks** mit Fallbacks (`|| ''` / `|| 0`)
- ✅ **Backend-Doku** checken bei Fragen

---

**Bei Fragen**: Siehe `backend/` Ordner oder frage Backend-Team!

**Letzte Aktualisierung**: 15. November 2025
**Erstellt von**: Claude (Frontend Assistant)
**Status**: ✅ Production Ready
