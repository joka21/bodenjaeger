# API Felder Mapping - Jäger Plugin

**Version**: 1.2.0
**Stand**: 14. November 2025

Diese Dokumentation zeigt das Mapping zwischen Datenbank-Feldern und API-Response-Feldern.

---

## ✅ Vollständig gemappte Felder (40/40)

### Paketinformationen (8/8)

| Datenbank-Feld | API-Feld | Ort in Response | Typ |
|----------------|----------|-----------------|-----|
| `_paketpreis` | `paketpreis` | `jaeger_fields.paketpreis` | float |
| `_paketpreis_s` | `paketpreis_s` | `jaeger_fields.paketpreis_s` | float |
| `_paketinhalt` | `paketinhalt` | `jaeger_fields.paketinhalt` | float |
| `_einheit` | `einheit` | `jaeger_fields.einheit` | string |
| `_einheit_short` | `einheit_short` | `jaeger_fields.einheit_short` | string |
| `_verpackungsart` | `verpackungsart` | `jaeger_fields.verpackungsart` | string |
| `_verpackungsart_short` | `verpackungsart_short` | `jaeger_fields.verpackungsart_short` | string |
| `_verschnitt` | `verschnitt` | `jaeger_fields.verschnitt` | float |

---

### UVP System (3/3)

| Datenbank-Feld | API-Feld | Ort in Response | Typ |
|----------------|----------|-----------------|-----|
| `_uvp` | `uvp` | `jaeger_fields.uvp` | float |
| `_show_uvp` | `show_uvp` | `jaeger_fields.show_uvp` | boolean |
| `_uvp_paketpreis` | `uvp_paketpreis` | `jaeger_fields.uvp_paketpreis` | float |

---

### Produktbeschreibung (3/3)

| Datenbank-Feld | API-Feld | Ort in Response | Typ |
|----------------|----------|-----------------|-----|
| `_show_text_produktuebersicht` | `show_text_produktuebersicht` | `jaeger_fields.show_text_produktuebersicht` | boolean |
| `_text_produktuebersicht` | `text_produktuebersicht` | `jaeger_fields.text_produktuebersicht` | string |
| `_artikelbeschreibung` | `artikelbeschreibung` | `jaeger_fields.artikelbeschreibung` | string (HTML) |

---

### Set-Angebot Konfiguration (6/6)

| Datenbank-Feld | API-Feld | Ort in Response | Typ |
|----------------|----------|-----------------|-----|
| `_show_setangebot` | `show_setangebot` | `jaeger_fields.show_setangebot` | boolean |
| `_setangebot_titel` | `titel` | `jaeger_fields.setangebot.titel` | string |
| `_setangebot_text_color` | `text_color` | `jaeger_fields.setangebot.text_color` | string |
| `_setangebot_text_size` | `text_size` | `jaeger_fields.setangebot.text_size` | string |
| `_setangebot_button_style` | `button_style` | `jaeger_fields.setangebot.button_style` | string |
| `_setangebot_rabatt` | `rabatt` | `jaeger_fields.setangebot.rabatt` | float |

**Zusätzlich auf Root-Ebene:**
- `setangebot_titel` → Root-Level
- `setangebot_rabatt` → Root-Level

---

### Set-Angebot Berechnete Werte (4/4)

| Datenbank-Feld | API-Feld | Ort in Response | Typ |
|----------------|----------|-----------------|-----|
| `_setangebot_einzelpreis` | `einzelpreis` | `jaeger_fields.setangebot.einzelpreis` | float |
| `_setangebot_gesamtpreis` | `gesamtpreis` | `jaeger_fields.setangebot.gesamtpreis` | float |
| `_setangebot_ersparnis_euro` | `ersparnis_euro` | `jaeger_fields.setangebot.ersparnis_euro` | float |
| `_setangebot_ersparnis_prozent` | `ersparnis_prozent` | `jaeger_fields.setangebot.ersparnis_prozent` | float |

**Zusätzlich auf Root-Ebene:**
- `setangebot_einzelpreis` → Root-Level
- `setangebot_gesamtpreis` → Root-Level
- `setangebot_ersparnis_euro` → Root-Level
- `setangebot_ersparnis_prozent` → Root-Level

---

### Zusatzprodukte (4/4)

| Datenbank-Feld | API-Feld | Ort in Response | Typ |
|----------------|----------|-----------------|-----|
| `_standard_addition_daemmung` | `standard_daemmung_id` | `jaeger_fields.zusatzprodukte.daemmung.standard_id` | int |
| `_option_products_daemmung` | `option_daemmung_ids` | `jaeger_fields.zusatzprodukte.daemmung.options_ids` | int[] |
| `_standard_addition_sockelleisten` | `standard_sockelleisten_id` | `jaeger_fields.zusatzprodukte.sockelleisten.standard_id` | int |
| `_option_products_sockelleisten` | `option_sockelleisten_ids` | `jaeger_fields.zusatzprodukte.sockelleisten.options_ids` | int[] |

**Zusätzlich auf Root-Ebene:**
- `daemmung_id` → Root-Level
- `sockelleisten_id` → Root-Level
- `daemmung_option_ids` → Root-Level (Array)
- `sockelleisten_option_ids` → Root-Level (Array)

**Mit Details:**
- `jaeger_fields.zusatzprodukte.daemmung.standard` → Vollständiges Produkt-Objekt
- `jaeger_fields.zusatzprodukte.daemmung.options` → Array von Produkt-Objekten
- `jaeger_fields.zusatzprodukte.sockelleisten.standard` → Vollständiges Produkt-Objekt
- `jaeger_fields.zusatzprodukte.sockelleisten.options` → Array von Produkt-Objekten

---

### Aktionen & Badges (10/10)

| Datenbank-Feld | API-Feld | Ort in Response | Typ |
|----------------|----------|-----------------|-----|
| `_show_aktion` | `show_aktion` | `jaeger_fields.styling.show_aktion` | boolean |
| `_aktion` | `aktion` | `jaeger_fields.styling.aktion` | string |
| `_aktion_text_color` | `aktion_text_color` | `jaeger_fields.styling.aktion_text_color` | string |
| `_aktion_text_size` | `aktion_text_size` | `jaeger_fields.styling.aktion_text_size` | string |
| `_aktion_button_style` | `aktion_button_style` | `jaeger_fields.styling.aktion_button_style` | string |
| `_show_angebotspreis_hinweis` | `show_angebotspreis_hinweis` | `jaeger_fields.styling.show_angebotspreis_hinweis` | boolean |
| `_angebotspreis_hinweis` | `angebotspreis_hinweis` | `jaeger_fields.styling.angebotspreis_hinweis` | string |
| `_angebotspreis_text_color` | `angebotspreis_text_color` | `jaeger_fields.styling.angebotspreis_text_color` | string |
| `_angebotspreis_text_size` | `angebotspreis_text_size` | `jaeger_fields.styling.angebotspreis_text_size` | string |
| `_angebotspreis_button_style` | `angebotspreis_button_style` | `jaeger_fields.styling.angebotspreis_button_style` | string |

---

### Lieferzeit (2/2)

| Datenbank-Feld | API-Feld | Ort in Response | Typ |
|----------------|----------|-----------------|-----|
| `_show_lieferzeit` | `show_lieferzeit` | `jaeger_fields.show_lieferzeit` | boolean |
| `_lieferzeit` | `lieferzeit` | `jaeger_fields.lieferzeit` | string |

---

### Testing & Debug (1/1)

| Datenbank-Feld | API-Feld | Ort in Response | Typ |
|----------------|----------|-----------------|-----|
| `_testdummy` | `testdummy` | `jaeger_fields.testdummy` | string |

---

## 📊 Zusammenfassung

| Kategorie | Felder | Status |
|-----------|--------|--------|
| Paketinformationen | 8 | ✅ 100% |
| UVP System | 3 | ✅ 100% |
| Produktbeschreibung | 3 | ✅ 100% |
| Set-Angebot Config | 6 | ✅ 100% |
| Set-Angebot Berechnet | 4 | ✅ 100% |
| Zusatzprodukte | 4 | ✅ 100% |
| Aktionen & Badges | 10 | ✅ 100% |
| Lieferzeit | 2 | ✅ 100% |
| Testing | 1 | ✅ 100% |
| **GESAMT** | **40** | **✅ 100%** |

---

## 🎯 API Response Struktur

### Vollständige Response (fields=full)

```json
{
  "id": 1134,
  "name": "Rigid-Vinyl Eiche Newstead",
  "slug": "rigid-vinyl-eiche-newstead",

  // WooCommerce Standard-Felder
  "prices": {
    "price": 49.99,
    "regular_price": 49.99,
    "sale_price": null,
    "on_sale": false
  },

  "stock": {
    "stock_status": "instock",
    "stock_quantity": 100
  },

  "images": [
    {
      "id": 12345,
      "src": "https://...",
      "alt": "Alt Text",
      "sizes": { ... }
    }
  ],

  "categories": [
    {"id": 123, "name": "Vinyl", "slug": "vinyl"}
  ],

  // JAEGER CUSTOM FIELDS (40 Felder)
  "jaeger_fields": {
    // Paketinformationen
    "paketpreis": 110.89,
    "paketpreis_s": 99.99,
    "paketinhalt": 2.22,
    "einheit": "Quadratmeter",
    "einheit_short": "m²",
    "verpackungsart": "Paket(e)",
    "verpackungsart_short": "Pak.",
    "verschnitt": 10.0,

    // UVP
    "show_uvp": false,
    "uvp": 0,
    "uvp_paketpreis": 0,

    // Produktbeschreibung
    "show_text_produktuebersicht": false,
    "text_produktuebersicht": "",
    "artikelbeschreibung": "<p>...</p>",

    // Set-Angebot
    "show_setangebot": true,
    "setangebot": {
      "titel": "Komplett-Set",
      "rabatt": 0,
      "einzelpreis": 47.95,
      "gesamtpreis": 34.99,
      "ersparnis_euro": 12.96,
      "ersparnis_prozent": 27.03,
      "text_color": "",
      "text_size": "",
      "button_style": "",
      "standard_daemmung_id": 0,
      "standard_sockelleisten_id": 1605,
      "option_daemmung_ids": [],
      "option_sockelleisten_ids": [1605, 1592, 1258],
      "standard_daemmung": null,
      "standard_sockelleisten": {
        "id": 1605,
        "name": "Sockelleiste XY",
        "price": 12.99,
        "image": "https://...",
        "paketinhalt": 2.5,
        "einheit_short": "lfm"
      }
    },

    // Zusatzprodukte (mit Details)
    "zusatzprodukte": {
      "daemmung": {
        "standard_id": 0,
        "options_ids": [],
        "standard": null,
        "options": []
      },
      "sockelleisten": {
        "standard_id": 1605,
        "options_ids": [1605, 1592, 1258],
        "standard": { ... },
        "options": [ ... ]
      }
    },

    // Styling & Badges
    "styling": {
      "text_color": "",
      "text_size": "",
      "button_style": "",
      "show_aktion": false,
      "aktion": "",
      "aktion_text_color": "",
      "aktion_text_size": "",
      "aktion_button_style": "",
      "show_angebotspreis_hinweis": false,
      "angebotspreis_hinweis": "",
      "angebotspreis_text_color": "",
      "angebotspreis_text_size": "",
      "angebotspreis_button_style": ""
    },

    // Lieferzeit
    "show_lieferzeit": false,
    "lieferzeit": "",

    // Testing
    "testdummy": ""
  },

  // Set-Angebot Felder ZUSÄTZLICH auf Root-Ebene
  "setangebot_einzelpreis": 47.95,
  "setangebot_gesamtpreis": 34.99,
  "setangebot_ersparnis_euro": 12.96,
  "setangebot_ersparnis_prozent": 27.03,
  "setangebot_titel": "Komplett-Set",
  "setangebot_rabatt": 0,

  // Zusatzprodukt-IDs ZUSÄTZLICH auf Root-Ebene
  "daemmung_id": null,
  "sockelleisten_id": 1605,
  "daemmung_option_ids": [],
  "sockelleisten_option_ids": [1605, 1592, 1258]
}
```

---

## 🔍 Zugriff auf Felder

### TypeScript Beispiele

```typescript
// Paketinformationen
const paketpreis = product.jaeger_fields.paketpreis;
const einheit = product.jaeger_fields.einheit_short;

// UVP
const hasUVP = product.jaeger_fields.show_uvp;
const uvpPrice = product.jaeger_fields.uvp;

// Set-Angebot (verschachtelt)
const setTitel = product.jaeger_fields.setangebot?.titel;
const ersparnis = product.jaeger_fields.setangebot?.ersparnis_prozent;

// Set-Angebot (Root-Level - empfohlen)
const einzelpreis = product.setangebot_einzelpreis;
const gesamtpreis = product.setangebot_gesamtpreis;
const ersparnisProzent = product.setangebot_ersparnis_prozent;

// Zusatzprodukte (verschachtelt)
const standardSockelleiste = product.jaeger_fields.zusatzprodukte.sockelleisten.standard;
const sockelleistenOptionen = product.jaeger_fields.zusatzprodukte.sockelleisten.options;

// Zusatzprodukte (Root-Level - empfohlen für IDs)
const daemmungId = product.daemmung_id;
const sockelleistenId = product.sockelleisten_id;
const sockelleistenIds = product.sockelleisten_option_ids;

// Badges
const hasAktion = product.jaeger_fields.styling.show_aktion;
const aktionText = product.jaeger_fields.styling.aktion;
const hasAngebot = product.jaeger_fields.styling.show_angebotspreis_hinweis;
const angebotText = product.jaeger_fields.styling.angebotspreis_hinweis;

// Lieferzeit
const hasLieferzeit = product.jaeger_fields.show_lieferzeit;
const lieferzeit = product.jaeger_fields.lieferzeit;
```

---

## 📝 Wichtige Hinweise

### 1. Doppelte Felder (Root + verschachtelt)

Einige Felder sind **sowohl verschachtelt als auch auf Root-Ebene** verfügbar:

**Set-Angebot Felder:**
- Verschachtelt: `jaeger_fields.setangebot.einzelpreis`
- Root-Level: `setangebot_einzelpreis` ← **Empfohlen für Frontend**

**Zusatzprodukt-IDs:**
- Verschachtelt: `jaeger_fields.zusatzprodukte.daemmung.standard_id`
- Root-Level: `daemmung_id` ← **Empfohlen für Frontend**

**Warum?** Root-Level Zugriff ist schneller und einfacher für das Frontend.

### 2. Boolean Felder

Alle `_show_*` Felder werden zu `boolean` konvertiert:
- Datenbank: `'yes'` / `'no'` / `''`
- API: `true` / `false`

### 3. Numeric Felder

Alle Preis- und Zahlenfelder werden zu `float` oder `int` konvertiert:
- `floatval()` für Preise, Prozente, Paketinhalte
- `intval()` für IDs

Leere Werte werden zu:
- `null` für optionale Felder
- `0` für Felder mit Default (z.B. `verschnitt`)

### 4. Array Felder

Kommagetrennte Strings werden zu Arrays konvertiert:
- Datenbank: `"1234,1235,1236"`
- API: `[1234, 1235, 1236]`

---

## 🎨 Fields Parameter

Mit `fields` Parameter kannst du die Response filtern:

### fields=critical (23 Felder)
```typescript
{
  id, name, slug,
  thumbnail, thumbnail_alt, thumbnail_sizes,
  price, regular_price, sale_price, on_sale, discount_percent,
  uvp, show_uvp, einheit_short,
  has_setangebot, setangebot_ersparnis_prozent,
  setangebot_einzelpreis, setangebot_gesamtpreis,
  is_in_stock, stock_status,
  aktion, angebotspreis_hinweis,
  categories
}
```

### fields=minimal (9 Felder)
```typescript
{
  id, name, price,
  image, image_alt,
  einheit_short, paketinhalt, verpackungsart_short,
  is_in_stock
}
```

---

## ✅ Validierung

Alle 40 Datenbankfelder sind vollständig in der API gemappt:

- ✅ Alle Felder haben `get_post_meta()` Aufrufe
- ✅ Alle Felder sind in `jaeger_fields` oder Root-Level verfügbar
- ✅ Type-Konvertierungen sind korrekt implementiert
- ✅ Zusatzprodukte haben vollständige Details
- ✅ Doppelte Felder für einfacheren Frontend-Zugriff

---

**Letzte Aktualisierung:** 14. November 2025, 19:00 Uhr
**Vollständigkeit:** ✅ 40/40 Felder (100%)
**Status:** Production Ready
