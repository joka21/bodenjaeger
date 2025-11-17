# ❌ Fehlende API-Felder im Set-Angebot

**Datum**: 15. November 2025
**Problem**: Wichtige Set-Angebot Felder fehlen in der API-Response
**Impact**: Set-Angebot kann nicht vollständig angezeigt werden

---

## 🔍 Analyse der API-Response

**Getestetes Produkt**: `rigid-vinyl-eiche-newstead`
**Endpoint**: `/wp-json/jaeger/v1/products?search=rigid-vinyl-eiche-newstead`

### ✅ Was funktioniert (ist in der API):

```json
{
  "has_setangebot": true,
  "setangebot_einzelpreis": 47.95,
  "setangebot_gesamtpreis": 34.99,
  "setangebot_ersparnis_euro": 12.96,
  "setangebot_ersparnis_prozent": 27.03
}
```

✅ **Preisfelder funktionieren perfekt!**

---

## ❌ Was FEHLT (sollte laut Doku da sein):

### 1. Set-Angebot Konfiguration (2 Felder fehlen)

Laut `backend/ROOT_LEVEL_FIELDS.md` sollten diese Felder auf Root-Level sein:

```json
{
  "setangebot_titel": "Komplett-Set",  // ❌ FEHLT
  "setangebot_rabatt": 0                // ❌ FEHLT
}
```

**Impact**:
- Titel kann nicht angezeigt werden (fallback auf "Set-Angebot")
- Rabatt-Info fehlt

---

### 2. Zusatzprodukt-IDs (4 Felder fehlen KOMPLETT!)

**KRITISCH!** Laut `backend/ROOT_LEVEL_FIELDS.md` und `backend/API_FELDER_MAPPING.md` sollten diese Felder da sein:

```json
{
  "daemmung_id": 1234,              // ❌ FEHLT KOMPLETT
  "sockelleisten_id": 1605,         // ❌ FEHLT KOMPLETT
  "daemmung_option_ids": [1234, 1235],     // ❌ FEHLT KOMPLETT
  "sockelleisten_option_ids": [1605, 1592, 1258]  // ❌ FEHLT KOMPLETT
}
```

**Impact**:
- ❌ Dämmung kann NICHT geladen werden
- ❌ Sockelleisten können NICHT geladen werden
- ❌ Alternative Optionen können NICHT angezeigt werden
- ❌ Set-Angebot ist **UNVOLLSTÄNDIG**

---

## 📋 Mapping: Datenbank → API

Laut `backend/API_FELDER_MAPPING.md`:

### Set-Angebot Config (2 fehlen):
| Datenbank-Feld | API-Feld (Root) | Status |
|----------------|-----------------|--------|
| `_setangebot_titel` | `setangebot_titel` | ❌ FEHLT |
| `_setangebot_rabatt` | `setangebot_rabatt` | ❌ FEHLT |

### Zusatzprodukte (4 fehlen):
| Datenbank-Feld | API-Feld (Root) | Status |
|----------------|-----------------|--------|
| `_standard_addition_daemmung` | `daemmung_id` | ❌ FEHLT |
| `_standard_addition_sockelleisten` | `sockelleisten_id` | ❌ FEHLT |
| `_option_products_daemmung` | `daemmung_option_ids` | ❌ FEHLT |
| `_option_products_sockelleisten` | `sockelleisten_option_ids` | ❌ FEHLT |

---

## 🔧 Was das Backend-Plugin tun muss

**Datei**: `src/types/wp-store-api-extension/wp-store-api-extension.php`

### 1. Set-Angebot Felder hinzufügen:

```php
// Titel und Rabatt auf Root-Level
$product['setangebot_titel'] = get_post_meta($product_id, '_setangebot_titel', true);
$product['setangebot_rabatt'] = floatval(get_post_meta($product_id, '_setangebot_rabatt', true));
```

### 2. Zusatzprodukt-IDs hinzufügen:

```php
// Standard-Zusatzprodukte
$product['daemmung_id'] = intval(get_post_meta($product_id, '_standard_addition_daemmung', true)) ?: null;
$product['sockelleisten_id'] = intval(get_post_meta($product_id, '_standard_addition_sockelleisten', true)) ?: null;

// Optional Zusatzprodukte (Arrays)
$daemmung_options = get_post_meta($product_id, '_option_products_daemmung', true);
$product['daemmung_option_ids'] = !empty($daemmung_options)
  ? array_map('intval', explode(',', $daemmung_options))
  : [];

$sockelleisten_options = get_post_meta($product_id, '_option_products_sockelleisten', true);
$product['sockelleisten_option_ids'] = !empty($sockelleisten_options)
  ? array_map('intval', explode(',', $sockelleisten_options))
  : [];
```

---

## 🎯 Frontend-Code wartet bereits auf diese Daten

**Datei**: `src/app/products/[slug]/page.tsx` (Zeile 38-48)

```typescript
// ✅ USE ROOT-LEVEL FIELDS - Parse all product IDs we need to load
const daemmungId = product.daemmung_id;              // ❌ undefined
const sockelleisteId = product.sockelleisten_id;    // ❌ undefined

// IDs are already arrays on root level
const daemmungOptionIds = product.daemmung_option_ids || [];        // ❌ []
const sockelleisteOptionIds = product.sockelleisten_option_ids || []; // ❌ []

console.log('Dämmung ID:', daemmungId);  // → undefined
console.log('Sockelleiste ID:', sockelleisteId);  // → undefined
```

**Das Frontend ist bereit - wartet nur auf die Backend-Daten!**

---

## ✅ Was bereits funktioniert

1. ✅ Preisberechnung läuft perfekt (Backend)
2. ✅ Frontend kann Zusatzprodukte laden (via `getProductsByIds`)
3. ✅ Set-Angebot Component zeigt Daten korrekt an
4. ✅ TypeScript Interfaces sind korrekt

**Nur die 6 Felder fehlen in der API!**

---

## 📊 Zusammenfassung

| Kategorie | Felder Total | ✅ Vorhanden | ❌ Fehlen |
|-----------|--------------|--------------|-----------|
| Set-Angebot Preise | 4 | 4 | 0 |
| Set-Angebot Config | 2 | 0 | **2** |
| Zusatzprodukt IDs | 4 | 0 | **4** |
| **GESAMT** | **10** | **4** | **6** |

**Status**: ⚠️ Set-Angebot zu 40% funktionsfähig

---

## 🚀 Priorität

**HIGH - KRITISCH**

Ohne diese 6 Felder kann das Set-Angebot **nicht vollständig funktionieren**:
- Keine Dämmung anzeigbar
- Keine Sockelleisten anzeigbar
- Keine alternativen Produkte auswählbar
- Titel fehlt

---

## 📞 Next Steps

1. **Backend-Team**: Füge die 6 fehlenden Felder hinzu
2. **Test**: Prüfe mit `/wp-json/jaeger/v1/products/{id}`
3. **Frontend**: Sollte dann automatisch funktionieren

---

**Erstellt von**: Claude (Frontend Developer)
**Für**: Backend-Team
**Datei**: `backend/FEHLENDE_API_FELDER.md`
