# 🔧 Backend Request: einheit_short auf Root-Level

**Datum**: 16. November 2025
**Priorität**: MEDIUM
**Von**: Frontend-Entwickler
**An**: Backend-Team

---

## 📋 Anforderung

Bitte das Feld `einheit_short` zusätzlich auf **Root-Level** der API-Response verfügbar machen, wie die anderen 40 Custom-Felder auch.

---

## ❓ Warum?

### Aktueller Stand (Inkonsistent)
```json
{
  "id": 1134,
  "name": "Rigid-Vinyl Eiche Newstead",

  // ✅ Diese Felder sind auf Root-Level:
  "paketpreis": 94.92,
  "setangebot_titel": "Komplett-Set",
  "daemmung_id": null,
  "sockelleisten_id": 1605,

  // ❌ Aber einheit_short ist verschachtelt:
  "jaeger_meta": {
    "einheit_short": "m²",
    "paketinhalt": 2.21
  }
}
```

### Problem im Frontend
```typescript
// ❌ Aktuell: Verschiedene Zugriffsmuster
const einheit1 = product.einheit_short;              // undefined (Root-Level)
const einheit2 = product.jaeger_meta?.einheit_short; // "m²" (verschachtelt)

// Slider-Komponenten nutzen jaeger_meta.einheit_short
const unit = product.jaeger_meta.einheit_short; // ✅ Funktioniert

// ProductCard versucht Root-Level
const einheitShort = product.einheit_short || 'm²'; // ❌ Fallback zu 'm²'
```

### Lösung: Root-Level Zugriff
```typescript
// ✅ Gewünscht: Einheitlicher Zugriff überall
const einheit = product.einheit_short || 'm²';
```

---

## 🎯 Gewünschte API-Response

```json
{
  "id": 1134,
  "name": "Rigid-Vinyl Eiche Newstead",
  "price": 34.99,

  // ✅ einheit_short auf Root-Level (wie andere Felder)
  "einheit_short": "m²",
  "paketpreis": 94.92,
  "paketinhalt": 2.21,
  "setangebot_titel": "Komplett-Set",
  "daemmung_id": null,
  "sockelleisten_id": 1605,

  // Optional: jaeger_meta kann zusätzlich bleiben (für Rückwärtskompatibilität)
  "jaeger_meta": {
    "einheit_short": "m²",
    "paketinhalt": 2.21,
    "show_aktion": false,
    "aktion": "Restposten",
    "show_lieferzeit": true,
    "lieferzeit": "3-7 Arbeitstage oder im Markt abholen"
  }
}
```

---

## 🔧 Backend-Implementierung

**Datei**: `src/types/wp-store-api-extension/wp-store-api-extension.php`

### Vorgeschlagene Änderung:

```php
// Bereits vorhanden: Alle anderen Root-Level Felder
$product['setangebot_titel'] = get_post_meta($product_id, '_setangebot_titel', true);
$product['daemmung_id'] = intval(get_post_meta($product_id, '_standard_addition_daemmung', true)) ?: null;
$product['sockelleisten_id'] = intval(get_post_meta($product_id, '_standard_addition_sockelleisten', true)) ?: null;

// ✅ NEU: einheit_short auch auf Root-Level
$product['einheit_short'] = get_post_meta($product_id, '_einheit_short', true) ?: 'm²';
$product['paketinhalt'] = floatval(get_post_meta($product_id, '_paketinhalt', true)) ?: null;

// Optional: jaeger_meta kann zusätzlich bleiben
$jaeger_meta = [
  'einheit_short' => $product['einheit_short'],
  'paketinhalt' => $product['paketinhalt'],
  'show_aktion' => (bool) get_post_meta($product_id, '_show_aktion', true),
  'aktion' => get_post_meta($product_id, '_aktion', true),
  // ... rest
];
$product['jaeger_meta'] = $jaeger_meta;
```

---

## ✅ Vorteile

1. **Konsistenz**: Alle häufig verwendeten Felder auf Root-Level
2. **Einfacherer Code**: Kein Optional Chaining (`?.`) nötig
3. **Performance**: Direkter Zugriff ohne Objekt-Traversierung
4. **Typsicherheit**: TypeScript Interface einfacher
5. **Dokumentation**: Einheitliche Zugriffsmuster

---

## 📊 Verwendung im Frontend

`einheit_short` wird in **18+ Komponenten** verwendet:

### Häufigste Verwendung:
```typescript
// Preisanzeige mit Einheit
<span>
  {price.toFixed(2).replace('.', ',')} €/{einheit_short}
</span>

// Beispiel:
// 34,99 €/m²
// 12,50 €/lfm
// 5,99 €/Stück
```

### Komponenten die einheit_short nutzen:
- `ProductCard.tsx` (Produktkarten überall)
- `BestsellerSlider.tsx` (Startseite)
- `SaleProductSlider.tsx` (Startseite)
- `ProductInfo.tsx` (Produktdetailseite)
- `SetAngebot.tsx` (Set-Angebot Bereich)
- `TotalPrice.tsx` (Gesamtpreis Berechnung)
- `CartSingleItem.tsx` (Warenkorb)
- `CartSetItem.tsx` (Warenkorb Set-Artikel)
- ... und viele mehr

**→ einheit_short ist eines der meist-verwendeten Custom-Felder!**

---

## 🔄 Alternative: Frontend anpassen

**Falls Backend-Änderung nicht möglich ist**, müssten wir im Frontend ändern:

```typescript
// In 18+ Komponenten ändern von:
const einheit = product.einheit_short || 'm²';

// Zu:
const einheit = product.jaeger_meta?.einheit_short || 'm²';
```

**Nachteile**:
- ❌ Inkonsistent mit anderen Root-Level Feldern
- ❌ Optional Chaining in allen Komponenten
- ❌ Fehleranfällig wenn jaeger_meta undefined ist
- ❌ Längerer Code

---

## 📚 Referenzen

- **API Test**: `backend/API_TEST_ERGEBNISSE_2025-11-16.md` (Sektion 2.1)
- **Root-Level Felder**: `backend/ROOT_LEVEL_FIELDS.md`
- **Datenfluss**: `backend/FRONTEND_BACKEND_DATENFLUSS.md`

---

## 🎯 Zusammenfassung

**Request**: Bitte `einheit_short` auf Root-Level verfügbar machen

**Begründung**: Konsistenz mit anderen Custom-Feldern, einfacherer Frontend-Code

**Impact**: Niedrig - nur eine Zeile PHP-Code

**Dringlichkeit**: Medium - Frontend funktioniert mit Fallback, aber inkonsistent

---

**Erstellt**: 16. November 2025
**Status**: ⏳ Warte auf Backend-Feedback
**Frontend-Workaround**: Verwende `product.jaeger_meta?.einheit_short || 'm²'` bis Backend-Änderung
