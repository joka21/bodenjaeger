# Root-Level Felder - Jäger API

**Version**: 1.3.0
**Stand**: 14. November 2025, 19:30 Uhr

## ✅ Änderung: ALLE 40 Felder auf Root-Ebene

Alle Jaeger Custom Fields sind jetzt **sowohl verschachtelt als auch auf Root-Ebene** verfügbar für einfacheren Frontend-Zugriff.

---

## 📊 Vollständige Feldliste (40 Felder)

### Root-Level Response-Struktur

```json
{
  "id": 1134,
  "name": "Rigid-Vinyl Eiche Newstead",
  "slug": "rigid-vinyl-eiche-newstead",

  // WooCommerce Standard
  "prices": { ... },
  "stock": { ... },
  "images": [ ... ],
  "categories": [ ... ],

  // ========================================
  // JAEGER FELDER AUF ROOT-EBENE (40)
  // ========================================

  // Paketinformationen (8)
  "paketpreis": 110.89,
  "paketpreis_s": 99.99,
  "paketinhalt": 2.22,
  "einheit": "Quadratmeter",
  "einheit_short": "m²",
  "verpackungsart": "Paket(e)",
  "verpackungsart_short": "Pak.",
  "verschnitt": 10.0,

  // UVP System (3)
  "show_uvp": false,
  "uvp": null,
  "uvp_paketpreis": null,

  // Produktbeschreibung (3)
  "show_text_produktuebersicht": false,
  "text_produktuebersicht": null,
  "artikelbeschreibung": "<p>...</p>",

  // Set-Angebot Konfiguration (6)
  "show_setangebot": true,
  "setangebot_titel": "Komplett-Set",
  "setangebot_text_color": null,
  "setangebot_text_size": null,
  "setangebot_button_style": null,
  "setangebot_rabatt": 0,

  // Set-Angebot Berechnete Werte (4)
  "setangebot_einzelpreis": 47.95,
  "setangebot_gesamtpreis": 34.99,
  "setangebot_ersparnis_euro": 12.96,
  "setangebot_ersparnis_prozent": 27.03,

  // Zusatzprodukte (4)
  "daemmung_id": null,
  "sockelleisten_id": 1605,
  "daemmung_option_ids": [],
  "sockelleisten_option_ids": [1605, 1592, 1258],

  // Aktionen & Badges (10)
  "show_aktion": false,
  "aktion": null,
  "aktion_text_color": null,
  "aktion_text_size": null,
  "aktion_button_style": null,
  "show_angebotspreis_hinweis": false,
  "angebotspreis_hinweis": null,
  "angebotspreis_text_color": null,
  "angebotspreis_text_size": null,
  "angebotspreis_button_style": null,

  // Lieferzeit (2)
  "show_lieferzeit": false,
  "lieferzeit": null,

  // Testing (1)
  "testdummy": null,

  // ========================================
  // ZUSÄTZLICH: Verschachtelte Struktur
  // (für Backwards Compatibility)
  // ========================================
  "jaeger_fields": {
    // Gleiche Felder nochmal verschachtelt
    "paketpreis": 110.89,
    "einheit_short": "m²",
    // ...
  }
}
```

---

## 🎯 Vorteile Root-Level Felder

### Vorher (verschachtelt):
```typescript
const preis = product.jaeger_fields.paketpreis;
const einheit = product.jaeger_fields.einheit_short;
const ersparnis = product.jaeger_fields.setangebot?.ersparnis_prozent;
```

### Jetzt (Root-Level):
```typescript
const preis = product.paketpreis;
const einheit = product.einheit_short;
const ersparnis = product.setangebot_ersparnis_prozent;
```

**Vorteile:**
- ✅ Kürzerer Code
- ✅ Keine Verschachtelung
- ✅ Keine Optional Chaining `?.` notwendig
- ✅ Bessere IDE Autocomplete
- ✅ Einfacheres Type-Safety

---

## 📝 TypeScript Interface

```typescript
interface JaegerProduct {
  // WooCommerce Standard
  id: number;
  name: string;
  slug: string;
  prices: {
    price: number;
    regular_price: number;
    sale_price: number | null;
    on_sale: boolean;
  };
  stock: {
    stock_status: 'instock' | 'outofstock' | 'onbackorder';
    stock_quantity: number | null;
  };
  images: ProductImage[];
  categories: ProductCategory[];

  // JAEGER FELDER AUF ROOT-EBENE
  // Paketinformationen
  paketpreis: number | null;
  paketpreis_s: number | null;
  paketinhalt: number | null;
  einheit: string | null;
  einheit_short: string;
  verpackungsart: string | null;
  verpackungsart_short: string | null;
  verschnitt: number;

  // UVP
  show_uvp: boolean;
  uvp: number | null;
  uvp_paketpreis: number | null;

  // Produktbeschreibung
  show_text_produktuebersicht: boolean;
  text_produktuebersicht: string | null;
  artikelbeschreibung: string | null;

  // Set-Angebot Config
  show_setangebot: boolean;
  setangebot_titel: string;
  setangebot_text_color: string | null;
  setangebot_text_size: string | null;
  setangebot_button_style: string | null;
  setangebot_rabatt: number;

  // Set-Angebot Berechnet
  setangebot_einzelpreis: number | null;
  setangebot_gesamtpreis: number | null;
  setangebot_ersparnis_euro: number | null;
  setangebot_ersparnis_prozent: number | null;

  // Zusatzprodukte
  daemmung_id: number | null;
  sockelleisten_id: number | null;
  daemmung_option_ids: number[];
  sockelleisten_option_ids: number[];

  // Aktionen & Badges
  show_aktion: boolean;
  aktion: string | null;
  aktion_text_color: string | null;
  aktion_text_size: string | null;
  aktion_button_style: string | null;
  show_angebotspreis_hinweis: boolean;
  angebotspreis_hinweis: string | null;
  angebotspreis_text_color: string | null;
  angebotspreis_text_size: string | null;
  angebotspreis_button_style: string | null;

  // Lieferzeit
  show_lieferzeit: boolean;
  lieferzeit: string | null;

  // Testing
  testdummy: string | null;

  // Verschachtelt (Backwards Compatibility)
  jaeger_fields: {
    // Gleiche Felder nochmal
  };
}
```

---

## 🔍 Verwendungsbeispiele

### Produktkarte Component
```tsx
interface ProductCardProps {
  product: JaegerProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>

      {/* Root-Level Zugriff - Einfach! */}
      <p className="price">
        {product.paketpreis?.toFixed(2)} €/{product.einheit_short}
      </p>

      {/* UVP Badge */}
      {product.show_uvp && product.uvp && (
        <span className="uvp">statt {product.uvp.toFixed(2)} €</span>
      )}

      {/* Set-Angebot Badge */}
      {product.show_setangebot && product.setangebot_ersparnis_prozent && (
        <span className="discount">
          -{product.setangebot_ersparnis_prozent.toFixed(0)}%
        </span>
      )}

      {/* Aktions-Badge */}
      {product.show_aktion && product.aktion && (
        <span className="action-badge">{product.aktion}</span>
      )}

      {/* Angebots-Badge */}
      {product.show_angebotspreis_hinweis && product.angebotspreis_hinweis && (
        <span className="sale-badge">{product.angebotspreis_hinweis}</span>
      )}

      {/* Lieferzeit */}
      {product.show_lieferzeit && product.lieferzeit && (
        <p className="delivery">{product.lieferzeit}</p>
      )}
    </div>
  );
}
```

### Set-Angebot Component
```tsx
export function SetAngebot({ product }: { product: JaegerProduct }) {
  if (!product.show_setangebot) return null;

  return (
    <div className="set-angebot">
      <h3>{product.setangebot_titel}</h3>

      {/* Alle Felder direkt auf Root-Level */}
      <div className="prices">
        <span className="original">
          {product.setangebot_einzelpreis?.toFixed(2)} €
        </span>
        <span className="set-price">
          {product.setangebot_gesamtpreis?.toFixed(2)} €
        </span>
      </div>

      <div className="savings">
        <span>Sie sparen: {product.setangebot_ersparnis_euro?.toFixed(2)} €</span>
        <span>({product.setangebot_ersparnis_prozent?.toFixed(0)}%)</span>
      </div>

      {/* Zusatzprodukte */}
      {product.sockelleisten_id && (
        <p>Inkl. Sockelleiste (ID: {product.sockelleisten_id})</p>
      )}
      {product.daemmung_id && (
        <p>Inkl. Dämmung (ID: {product.daemmung_id})</p>
      )}
    </div>
  );
}
```

### Produktdetail Page
```tsx
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product: JaegerProduct = await fetchProduct(params.slug);

  return (
    <div className="product-detail">
      <h1>{product.name}</h1>

      {/* Paketinformationen */}
      <div className="package-info">
        <p>Paketinhalt: {product.paketinhalt} {product.einheit_short}</p>
        <p>Verpackungsart: {product.verpackungsart}</p>
        <p>Verschnitt: {product.verschnitt}%</p>
      </div>

      {/* Beschreibung */}
      {product.show_text_produktuebersicht && product.text_produktuebersicht && (
        <div className="overview-text">{product.text_produktuebersicht}</div>
      )}

      {product.artikelbeschreibung && (
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: product.artikelbeschreibung }}
        />
      )}

      {/* Set-Angebot */}
      <SetAngebot product={product} />
    </div>
  );
}
```

---

## ⚡ Performance mit fields Parameter

Die Root-Level Felder funktionieren auch mit `fields` Parameter:

### fields=critical
```json
{
  "id": 1134,
  "name": "Rigid-Vinyl Eiche Newstead",
  "slug": "rigid-vinyl-eiche-newstead",
  "thumbnail": "https://...",
  "price": 49.99,
  "regular_price": 49.99,

  // Root-Level Felder
  "einheit_short": "m²",
  "show_uvp": false,
  "uvp": null,
  "show_setangebot": true,
  "setangebot_ersparnis_prozent": 27.03,
  "show_aktion": false,
  "aktion": null,
  "show_angebotspreis_hinweis": false,
  "angebotspreis_hinweis": null
}
```

### fields=minimal
```json
{
  "id": 1234,
  "name": "Trittschalldämmung Premium",
  "price": 12.99,
  "image": "https://...",

  // Root-Level Felder
  "einheit_short": "m²",
  "paketinhalt": 10.0,
  "verpackungsart_short": "Rol.",
  "is_in_stock": true
}
```

---

## 🔄 Backwards Compatibility

✅ **Keine Breaking Changes!**

Alle Felder sind **zusätzlich weiterhin verschachtelt** verfügbar:

```typescript
// NEU (empfohlen)
product.paketpreis

// ALT (funktioniert weiterhin)
product.jaeger_fields.paketpreis

// Beide liefern den gleichen Wert!
```

**Migration:**
- ✅ Bestehender Code funktioniert weiterhin
- ✅ Neuer Code kann Root-Level nutzen
- ✅ Schrittweise Migration möglich

---

## 📊 Zusammenfassung

| Aspekt | Vorher | Jetzt |
|--------|--------|-------|
| **Felder auf Root** | 10 | **40** ✅ |
| **Zugriff** | `product.jaeger_fields.feld` | `product.feld` |
| **Code-Länge** | Länger | Kürzer |
| **Verschachtelung** | 2-3 Ebenen | 1 Ebene |
| **Type-Safety** | Schwieriger | Einfacher |
| **Backwards Compat** | - | ✅ Ja |

---

## ✅ Änderungen in dieser Version

**Version 1.3.0 (14.11.2025, 19:30 Uhr):**

1. ✅ **ALLE 40 Felder auf Root-Ebene**
   - Paketinformationen (8)
   - UVP System (3)
   - Produktbeschreibung (3)
   - Set-Angebot Config (6)
   - Set-Angebot Berechnet (4)
   - Zusatzprodukte (4)
   - Aktionen & Badges (10)
   - Lieferzeit (2)
   - Testing (1)

2. ✅ **Filter-Funktionen aktualisiert**
   - `filter_critical_fields()` nutzt Root-Level
   - `filter_minimal_fields()` nutzt Root-Level
   - `convert_single_product_to_list_format()` nutzt Root-Level

3. ✅ **Type-Konvertierungen**
   - Boolean: `'yes'` → `true`, `'no'` → `false`
   - Numeric: Strings → `float` / `int`
   - Arrays: `"1,2,3"` → `[1, 2, 3]`

4. ✅ **Null-Handling**
   - Leere Werte → `null`
   - Default-Werte wo sinnvoll (z.B. `verschnitt: 5`)

---

**Letzte Aktualisierung:** 14. November 2025, 19:30 Uhr
**Version:** 1.3.0
**Status:** ✅ Production Ready
**Datei zu hochladen:** `backend/api-product-data.php`
