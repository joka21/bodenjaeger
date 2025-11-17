# 🎯 Backend Request: `fields` Parameter für Jäger API

## Zusammenfassung

Wir möchten die Performance unseres Next.js Frontends optimieren, indem wir **nur die benötigten Felder** vom Backend laden. Dafür benötigen wir einen optionalen `fields` Parameter in der Jäger Products API.

---

## ✅ Was bereits funktioniert

Die Jäger API liefert bereits alle Daten perfekt:

```
GET /wp-json/jaeger/v1/products
GET /wp-json/jaeger/v1/products/{id}
```

**Antwort-Format (aktuell):**
```json
{
  "products": [
    {
      "id": 1134,
      "name": "Rigid-Vinyl Eiche Newstead",
      "slug": "rigid-vinyl-eiche-newstead",
      "images": [...],
      "description": "...",
      "jaeger_meta": {
        "einheit_short": "m²",
        "paketinhalt": 2.22,
        "paketpreis": 110.89,
        "show_setangebot": true,
        // ... alle 40+ Custom Fields
      }
    }
  ],
  "pagination": {
    "total": 500,
    "total_pages": 25,
    "current_page": 1,
    "per_page": 20
  }
}
```

✅ **Das funktioniert perfekt!**

---

## 🚀 Was wir zusätzlich brauchen

### Neuer Parameter: `fields`

```
GET /wp-json/jaeger/v1/products?fields=critical
GET /wp-json/jaeger/v1/products?fields=full
GET /wp-json/jaeger/v1/products?fields=minimal
```

### Use Cases:

#### 1. **`fields=critical`** (Startseite / Kategorie-Listen)
Nur absolute Minimum für Produktkarten:

**Benötigte Felder:**
```json
{
  "id": 1134,
  "name": "Rigid-Vinyl Eiche Newstead",
  "slug": "rigid-vinyl-eiche-newstead",
  "thumbnail": "https://..../image.jpg",
  "thumbnail_alt": "Alt Text",
  "price": 49.99,
  "regular_price": 49.99,
  "sale_price": null,
  "uvp": null,
  "show_uvp": false,
  "einheit_short": "m²",
  "has_setangebot": true,
  "setangebot_ersparnis_prozent": 27,
  "is_in_stock": true
}
```

**Warum?**
- Startseite zeigt 12 Produkte → 12 × 15 Felder statt 12 × 40+ Felder
- **Reduziert Payload um ~70%**
- Faster Time to Interactive

---

#### 2. **`fields=full`** (Standard - wie jetzt)
Alle Felder, wie die API bereits liefert.

**Verwendung:**
```
GET /wp-json/jaeger/v1/products?fields=full
GET /wp-json/jaeger/v1/products/{id}  # Default ist "full"
```

**Response:** Genau wie aktuell (keine Änderung)

---

#### 3. **`fields=minimal`** (Zusatzprodukte / Modals)
Noch weniger Felder für Dämmung/Sockelleisten-Auswahl:

**Benötigte Felder:**
```json
{
  "id": 1234,
  "name": "Trittschalldämmung Premium",
  "price": 12.99,
  "image": "https://..../image.jpg",
  "einheit_short": "m²",
  "paketinhalt": 10.0,
  "verpackungsart_short": "Rol.",
  "is_in_stock": true
}
```

**Verwendung:**
```
GET /wp-json/jaeger/v1/products?include=1234,1235,1236&fields=minimal
```

**Warum?**
- Laden nur wenn User Modal öffnet
- Nur 7 Felder statt 40+
- Schnellere Modal-Opening-Zeit

---

## 🔧 Technische Implementierung (Vorschlag)

### PHP Backend (WordPress Plugin)

```php
<?php
// In deinem Jäger Plugin: class-jaeger-products-api.php

public function get_products( $request ) {
    $fields = $request->get_param('fields') ?? 'full';

    // Hole Produkte wie bisher
    $products = $this->fetch_products($request);

    // Filter Felder basierend auf Parameter
    switch ($fields) {
        case 'critical':
            $products = array_map([$this, 'filter_critical_fields'], $products);
            break;
        case 'minimal':
            $products = array_map([$this, 'filter_minimal_fields'], $products);
            break;
        case 'full':
        default:
            // Keine Änderung - alle Felder
            break;
    }

    return rest_ensure_response([
        'products' => $products,
        'pagination' => $this->get_pagination()
    ]);
}

private function filter_critical_fields($product) {
    return [
        'id' => $product['id'],
        'name' => $product['name'],
        'slug' => $product['slug'],
        'thumbnail' => $product['images'][0]['src'] ?? '',
        'thumbnail_alt' => $product['images'][0]['alt'] ?? $product['name'],
        'price' => $product['jaeger_meta']['price'] ?? 0,
        'regular_price' => $product['jaeger_meta']['regular_price'] ?? 0,
        'sale_price' => $product['jaeger_meta']['sale_price'] ?? null,
        'uvp' => $product['jaeger_meta']['uvp'] ?? null,
        'show_uvp' => $product['jaeger_meta']['show_uvp'] ?? false,
        'einheit_short' => $product['jaeger_meta']['einheit_short'] ?? 'm²',
        'has_setangebot' => $product['jaeger_meta']['show_setangebot'] ?? false,
        'setangebot_ersparnis_prozent' => $product['jaeger_meta']['setangebot_ersparnis_prozent'] ?? null,
        'is_in_stock' => $product['is_in_stock'],
    ];
}

private function filter_minimal_fields($product) {
    return [
        'id' => $product['id'],
        'name' => $product['name'],
        'price' => $product['jaeger_meta']['price'] ?? 0,
        'image' => $product['images'][0]['src'] ?? '',
        'einheit_short' => $product['jaeger_meta']['einheit_short'] ?? 'm²',
        'paketinhalt' => $product['jaeger_meta']['paketinhalt'] ?? 0,
        'verpackungsart_short' => $product['jaeger_meta']['verpackungsart_short'] ?? 'Pak.',
        'is_in_stock' => $product['is_in_stock'],
    ];
}
```

---

## 📊 Performance Impact (geschätzt)

### Startseite (12 Produkte)

**Aktuell:**
- Payload: ~180 KB (12 Produkte × 15 KB)
- Transfer Time: ~800ms (3G)

**Mit `fields=critical`:**
- Payload: ~50 KB (12 Produkte × 4 KB)
- Transfer Time: ~250ms (3G)
- **🚀 Verbesserung: 72% schneller**

### Modal mit 5 Zusatzprodukten

**Aktuell:** 75 KB
**Mit `fields=minimal`:** 15 KB
**🚀 Verbesserung: 80% kleiner**

---

## ✅ Abnahmekriterien

### 1. API Response mit `fields=critical`
```bash
curl "https://plan-dein-ding.de/wp-json/jaeger/v1/products?fields=critical&per_page=5"
```

**Erwartete Response:**
- Nur 15 Felder pro Produkt
- `pagination` bleibt gleich
- Status 200 OK

### 2. API Response mit `fields=minimal`
```bash
curl "https://plan-dein-ding.de/wp-json/jaeger/v1/products?include=1234,1235&fields=minimal"
```

**Erwartete Response:**
- Nur 7 Felder pro Produkt
- Status 200 OK

### 3. Backwards Compatibility
```bash
curl "https://plan-dein-ding.de/wp-json/jaeger/v1/products"
curl "https://plan-dein-ding.de/wp-json/jaeger/v1/products?fields=full"
```

**Erwartete Response:**
- Beide Requests liefern ALLE Felder (wie bisher)
- Status 200 OK
- ✅ **Keine Breaking Changes für Frontend!**

---

## 📝 Frontend Integration (bereits vorbereitet)

Unser Frontend hat bereits die API-Wrapper fertig:

```typescript
// src/lib/api/products-critical.ts
const response = await fetch(
  'https://plan-dein-ding.de/wp-json/jaeger/v1/products?fields=critical'
);

// src/lib/api/product-full.ts
const response = await fetch(
  'https://plan-dein-ding.de/wp-json/jaeger/v1/products/1134?fields=full'
);

// src/lib/api/product-options.ts
const response = await fetch(
  'https://plan-dein-ding.de/wp-json/jaeger/v1/products?include=1234,1235&fields=minimal'
);
```

Wir haben auch **Adapter**, die die alte API unterstützen, falls der Parameter noch nicht da ist.

---

## ❓ Fragen?

### Ist das viel Arbeit?
- Nein! Die Daten sind schon da, wir filtern nur die Response.
- Geschätzter Aufwand: **1-2 Stunden**

### Kann das Breaking Changes verursachen?
- Nein! `fields` ist **optional**.
- Ohne Parameter → Verhalten wie bisher (alle Felder).

### Wann brauchen wir das?
- **Nicht dringend**, aber würde Performance stark verbessern.
- Priorisierung: **Medium** (Nice-to-Have für Launch)

---

## 🎯 Zusammenfassung

**Was wir wollen:**
```
GET /wp-json/jaeger/v1/products?fields=critical  # 15 Felder
GET /wp-json/jaeger/v1/products?fields=full      # Alle Felder (default)
GET /wp-json/jaeger/v1/products?fields=minimal   # 7 Felder
```

**Warum?**
- 70-80% kleinere Payloads
- Schnellere Ladezeiten
- Bessere Performance-Scores
- Keine Breaking Changes

**Effort:** 1-2 Stunden
**Impact:** Hoch (Performance)
**Urgency:** Medium

---

## 📞 Kontakt

Bei Fragen zum Frontend oder den benötigten Feldern:
- Frontend Lead: [Dein Name]
- Dokumentation: Siehe `src/types/product-optimized.ts`

**Vielen Dank! 🙏**
