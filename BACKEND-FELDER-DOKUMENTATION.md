# Backend-Felder und Berechnungen - Jaeger Plugin

**Dokumentation für Frontend-Entwickler**
**Stand:** 2025-01-13
**Plugin Version:** 1.0.1

---

## Inhaltsverzeichnis

1. [Produktfelder (Meta-Keys)](#produktfelder-meta-keys)
2. [Set-Angebot Felder](#set-angebot-felder)
3. [Preisberechnungen](#preisberechnungen)
4. [Zusatzprodukte-System](#zusatzprodukte-system)
5. [AJAX-Endpoints](#ajax-endpoints)
6. [Beispiele](#beispiele)

---

## Produktfelder (Meta-Keys)

### Basis-Produktinformationen

| Meta-Key | Typ | Beschreibung | Beispiel |
|----------|-----|--------------|----------|
| `_paketpreis` | `float` | Preis pro Paket in Euro | `45.99` |
| `_paketpreis_s` | `float` | Sonderpreis pro Paket (Angebotspreis) | `39.99` |
| `_paketinhalt` | `float` | Inhalt eines Pakets in m² oder lfm | `2.22` |
| `_verschnitt` | `float` | Verschnitt in Prozent | `5` (= 5%) |
| `_einheit` | `string` | Einheit ausgeschrieben | `Quadratmeter` oder `Laufmeter` |
| `_einheit_short` | `string` | Einheit Abkürzung | `m²` oder `lfm` |
| `_verpackungsart` | `string` | Verpackungsart | `Paket` |
| `_verpackungsart_short` | `string` | Verpackungsart Abkürzung | `Pak` |

### UVP (Unverbindliche Preisempfehlung)

| Meta-Key | Typ | Beschreibung | Beispiel |
|----------|-----|--------------|----------|
| `_show_uvp` | `string` | UVP anzeigen? | `yes` oder `no` |
| `_uvp` | `float` | UVP in Euro pro m²/lfm | `49.99` |
| `_uvp_paketpreis` | `float` | UVP pro Paket | `110.98` |

**Wichtig:** Der UVP wird als Vergleichspreis verwendet, wenn `_show_uvp` = `yes` ist!

### Lieferzeit

| Meta-Key | Typ | Beschreibung | Beispiel |
|----------|-----|--------------|----------|
| `_show_lieferzeit` | `string` | Lieferzeit anzeigen? | `yes` oder `no` |
| `_lieferzeit` | `string` | Lieferzeit-Text | `3-7 Arbeitstage oder im Markt abholen` |

### Produktbeschreibung

| Meta-Key | Typ | Beschreibung |
|----------|-----|--------------|
| `_artikelbeschreibung` | `text` | Vollständige Produktbeschreibung (HTML) |
| `_text_produktuebersicht` | `string` | Kurztext für Produktübersicht |
| `_show_text_produktuebersicht` | `string` | Text anzeigen? (`yes`/`no`) |

---

## Set-Angebot Felder

### Set-Angebot Konfiguration

| Meta-Key | Typ | Beschreibung | Beispiel |
|----------|-----|--------------|----------|
| `_show_setangebot` | `string` | Set-Angebot aktiviert? | `yes` oder `no` |
| `_setangebot_titel` | `string` | Titel für Set-Angebot | `Komplett-Set` |
| `_setangebot_rabatt` | `float` | Zusätzlicher Rabatt in % | `5` (= 5% extra) |

### Set-Angebot Styling

| Meta-Key | Typ | Beschreibung | Werte |
|----------|-----|--------------|-------|
| `_setangebot_text_color` | `string` | Textfarbe | CSS-Klasse |
| `_setangebot_text_size` | `string` | Textgröße | CSS-Klasse |
| `_setangebot_button_style` | `string` | Button-Stil | CSS-Klasse |

### Set-Angebot Berechnete Preise (automatisch)

| Meta-Key | Typ | Beschreibung | Berechnung |
|----------|-----|--------------|------------|
| `_setangebot_einzelpreis` | `float` | Vergleichspreis (Einzelkauf) | Siehe [Preisberechnung](#vergleichspreis-einzelkauf) |
| `_setangebot_gesamtpreis` | `float` | Set-Preis | Siehe [Preisberechnung](#set-preis) |
| `_setangebot_ersparnis_euro` | `float` | Ersparnis in Euro | `Einzelpreis - Gesamtpreis` |
| `_setangebot_ersparnis_prozent` | `float` | Ersparnis in Prozent | `(Ersparnis / Einzelpreis) × 100` |

---

## Zusatzprodukte-System

### Standard-Zusatzprodukte

Diese Produkte sind kostenlos im Set enthalten:

| Meta-Key | Typ | Beschreibung |
|----------|-----|--------------|
| `_standard_addition_daemmung` | `int` | Produkt-ID der Standard-Dämmung |
| `_standard_addition_sockelleisten` | `int` | Produkt-ID der Standard-Sockelleiste |

### Optionale Zusatzprodukte

Auswählbare Alternativprodukte (mit möglichem Aufpreis):

| Meta-Key | Typ | Beschreibung |
|----------|-----|--------------|
| `_option_products_daemmung` | `string` | Kommagetrennte Produkt-IDs für Dämmung-Optionen |
| `_option_products_sockelleisten` | `string` | Kommagetrennte Produkt-IDs für Sockelleisten-Optionen |

**Beispiel:**
```php
_option_products_daemmung = "123,456,789"
_option_products_sockelleisten = "234,567,890"
```

### Zubehör-Kategorien

Zusätzliche Zubehör-Optionen:

| Meta-Key | Kategorie | Beispiele |
|----------|-----------|-----------|
| `_option_products_untergrundvorbereitung` | Untergrundvorbereitung | Grundierung, Spachtelmasse |
| `_option_products_werkzeug` | Werkzeug | Cutter, Zollstock |
| `_option_products_kleber` | Kleber | Bodenkleber |
| `_option_products_montagekleber-silikon` | Montagekleber/Silikon | Montagekleber |
| `_option_products_zubehoer-fuer-sockelleisten` | Sockelleisten-Zubehör | Clips, Endkappen |
| `_option_products_schienen-profile` | Schienen/Profile | Übergangsprofil |
| `_option_products_reinigung-pflege` | Reinigung/Pflege | Bodenreiniger |

---

## Preisberechnungen

### 1. Vergleichspreis (Einzelkauf)

**Logik:** Höchstmöglicher Preis für maximale Ersparnis-Darstellung

```php
// Schritt 1: Hauptprodukt - UVP oder Regulärpreis
if (_show_uvp === 'yes' && _uvp > 0) {
    $main_comparison_price = _uvp;
} else {
    $main_comparison_price = regular_price ?: price;
}

// Schritt 2: Dämmung - UVP oder Regulärpreis
if (daemmung_show_uvp === 'yes' && daemmung_uvp > 0) {
    $daemmung_comparison_price = daemmung_uvp;
} else {
    $daemmung_comparison_price = daemmung_regular_price ?: daemmung_price;
}

// Schritt 3: Sockelleiste - UVP oder Regulärpreis
if (sockel_show_uvp === 'yes' && sockel_uvp > 0) {
    $sockel_comparison_price = sockel_uvp;
} else {
    $sockel_comparison_price = sockel_regular_price ?: sockel_price;
}

// Schritt 4: Gesamter Vergleichspreis
$einzelpreis = $main_comparison_price + $daemmung_comparison_price + $sockel_comparison_price;
```

**Beispiel:**
```
Hauptprodukt UVP:     49,99 €/m²
Dämmung UVP:           4,99 €/m²
Sockelleiste Preis:    5,99 €/lfm
───────────────────────────────
Einzelpreis gesamt:   60,97 €
```

### 2. Set-Preis

**Logik:** Niedrigster Preis + Aufpreise für Nicht-Standard-Produkte

```php
// Schritt 1: Hauptprodukt Sale-Preis (niedrigster Preis)
$main_set_price = sale_price ?: price;

// Schritt 2: Dämmung Aufpreis (nur wenn NICHT Standard)
$daemmung_surcharge = 0;
if (selected_daemmung_id != standard_daemmung_id) {
    $daemmung_surcharge = max(0, selected_daemmung_price - standard_daemmung_price);
}

// Schritt 3: Sockelleiste Aufpreis (nur wenn NICHT Standard)
$sockelleisten_surcharge = 0;
if (selected_sockelleisten_id != standard_sockelleisten_id) {
    $sockelleisten_surcharge = max(0, selected_sockelleisten_price - standard_sockelleisten_price);
}

// Schritt 4: Zusätzlicher Set-Rabatt
if (_setangebot_rabatt > 0) {
    $rabatt_faktor = 1 - (_setangebot_rabatt / 100);
} else {
    $rabatt_faktor = 1;
}

// Schritt 5: Finaler Set-Preis
$set_price = ($main_set_price + $daemmung_surcharge + $sockelleisten_surcharge) * $rabatt_faktor;
```

**Beispiel:**
```
Hauptprodukt Sale:    39,99 €/m²
Dämmung (Standard):   +0,00 €/m² (kostenlos)
Sockelleiste (Premium): +2,00 €/lfm (Aufpreis)
Zusatzrabatt:         -5%
───────────────────────────────
Set-Preis:            39,89 €
```

### 3. Ersparnis

```php
$ersparnis_euro = $einzelpreis - $set_price;
$ersparnis_prozent = ($ersparnis_euro / $einzelpreis) * 100;
```

**Beispiel:**
```
Einzelpreis:          60,97 €
Set-Preis:            39,89 €
───────────────────────────────
Ersparnis:            21,08 € (34,6%)
```

---

## Paketpreise vs. m²/lfm-Preise

### WICHTIG: Zwei verschiedene Preissysteme!

#### 1. WooCommerce Standard-Preise (m²/lfm)

Diese werden in WooCommerce-Produkten gespeichert:
- `$product->get_price()` → Aktueller Preis pro m² oder lfm
- `$product->get_regular_price()` → Regulärer Preis pro m² oder lfm
- `$product->get_sale_price()` → Angebotspreis pro m² oder lfm

**Verwendung:** Produktanzeige, Preisvergleich, Aufpreis-Berechnung

#### 2. Paketpreise (Custom Fields)

Diese werden in Post-Meta gespeichert:
- `_paketpreis` → Preis für ein gesamtes Paket
- `_paketpreis_s` → Sonderpreis für ein gesamtes Paket
- `_paketinhalt` → Inhalt des Pakets in m²/lfm

**Verwendung:** Warenkorb, Gesamtsumme

### Umrechnung

```php
// m²/lfm → Paketpreis
$paketpreis = $preis_pro_einheit * $paketinhalt;

// Paketpreis → m²/lfm
$preis_pro_einheit = $paketpreis / $paketinhalt;
```

### Beispiel

```
Produkt: Laminat
─────────────────────────────────────
WooCommerce-Preis:     18,00 €/m²
Paketinhalt:           2,22 m²
Paketpreis:            39,96 €
```

---

## AJAX-Endpoints

### 1. Produktoptionen abrufen

**Action:** `jaeger_get_product_options`

**Request:**
```javascript
{
    action: 'jaeger_get_product_options',
    product_id: 123,              // Hauptprodukt-ID
    category: 'daemmung',         // 'daemmung' oder 'sockelleisten'
    nonce: 'wp_nonce_value'
}
```

**Response:**
```javascript
{
    success: true,
    data: {
        products: [
            {
                id: 456,
                name: "Dämmung Basic PE-Schaum 2mm",
                price: 0.95,                        // m²/lfm-Preis
                formatted_price: "0,95 €",
                image: [...],
                is_standard: true,
                surcharge: 0,                       // Aufpreis in €/m² oder €/lfm
                formatted_surcharge: null,
                is_free_in_set: true
            },
            {
                id: 457,
                name: "Dämmung Premium XPS 3mm",
                price: 2.95,                        // m²/lfm-Preis
                formatted_price: "2,95 €",
                image: [...],
                is_standard: false,
                surcharge: 2.00,                    // Aufpreis: 2,95 - 0,95
                formatted_surcharge: "2,00 €",
                is_free_in_set: false
            }
        ],
        category: 'daemmung'
    }
}
```

### 2. Produkt wechseln

**Action:** `jaeger_change_setangebot_product`

**Request:**
```javascript
{
    action: 'jaeger_change_setangebot_product',
    product_id: 123,                    // Hauptprodukt-ID
    category: 'daemmung',               // 'daemmung' oder 'sockelleisten'
    selected_product_id: 457,           // Gewähltes Zusatzprodukt
    current_daemmung: 456,              // Aktuell gewählte Dämmung
    current_sockelleisten: 789,         // Aktuell gewählte Sockelleiste
    packages: 5,                        // Anzahl Pakete
    sqm: 11.1,                          // Quadratmeter
    nonce: 'wp_nonce_value'
}
```

**Response:**
```javascript
{
    success: true,
    data: {
        id: 457,
        name: "Dämmung Premium XPS 3mm",
        price: 2.95,                    // m²/lfm-Preis
        image_url: "https://...",
        is_standard: false,
        is_free: false,
        surcharge: 2.00,                // Aufpreis in €/m² oder €/lfm
        formatted_price: "2,95 €",
        formatted_surcharge: "2,00 €",
        clean_surcharge: 2.00,          // Saubere Zahl für JS

        // Preisvergleich für oberen Bereich
        price_comparison: {
            einzelkauf_total: 60.97,
            set_preis: 41.99,
            ersparnis_euro: 18.98,
            ersparnis_prozent: 31.13,
            formatted_einzelkauf_total: "60,97 €",
            formatted_set_preis: "41,99 €",
            formatted_ersparnis_euro: "18,98 €"
        },

        // Gesamtsumme für unteren Bereich
        order_summary: {
            gesamtpreis_pro_paket: 44.40,          // Paketpreis inkl. ALLER Aufpreise
            formatted_gesamtpreis_pro_paket: "44,40 €"
        }
    }
}
```

**WICHTIG:**
- `surcharge` und `clean_surcharge` sind **m²/lfm-Preise** (für Produktanzeige)
- `order_summary.gesamtpreis_pro_paket` ist der **Paketpreis** (für Gesamtsumme)

### 3. Set zum Warenkorb hinzufügen

**Action:** `jaeger_add_set_to_cart`

**Request:**
```javascript
{
    action: 'jaeger_add_set_to_cart',
    product_id: 123,                    // Hauptprodukt-ID
    packages: 5,                        // Anzahl Pakete
    sqm: 11.1,                          // Quadratmeter
    selected_daemmung: 457,             // Gewählte Dämmung
    selected_sockelleisten: 789,        // Gewählte Sockelleiste
    nonce: 'wp_nonce_value'
}
```

**Response:**
```javascript
{
    success: true,
    data: {
        message: "Set erfolgreich zum Warenkorb hinzugefügt.",
        cart_item_key: "abc123",
        redirect_url: "https://.../warenkorb/"
    }
}
```

---

## Frontend-Integration Beispiele

### 1. Initiale Produktdaten laden

```javascript
// Diese Daten werden vom PHP-Template als JavaScript-Variable übergeben
const JaegerSetAngebot = {
    ajax_url: '/wp-admin/admin-ajax.php',
    nonce: 'wp_nonce_value',
    product_id: 123,
    paketinhalt: 2.22,
    verschnitt: 5,
    basePrice: 39.99,              // Sale-Preis des Hauptprodukts (m²)
    paketpreis: 88.76,             // Paketpreis regulär
    paketpreis_s: 79.99,           // Paketpreis Sonderangebot
    currency_symbol: '€'
};
```

### 2. Preisanzeige in Produktkarte

```html
<!-- Dämmung Card -->
<div class="product-card daemmung-card" data-category="daemmung" data-product-id="456">
    <div class="product-info">
        <div class="product-name">Dämmung Basic PE-Schaum 2mm</div>
        <div class="product-prices">
            <!-- Durchgestrichener Preis (UVP oder Regular) -->
            <div class="original-price">0,95 €/m²</div>
            <!-- Roter Preis (kostenlos oder Aufpreis) -->
            <div class="free-price">0,00 €/m²</div>
        </div>
    </div>
</div>

<!-- Bei Nicht-Standard mit Aufpreis -->
<div class="product-card daemmung-card" data-category="daemmung" data-product-id="457">
    <div class="product-info">
        <div class="product-name">Dämmung Premium XPS 3mm</div>
        <div class="product-prices">
            <div class="original-price">2,95 €/m²</div>
            <!-- Aufpreis anzeigen -->
            <div class="free-price">+2,00 €/m²</div>
        </div>
    </div>
</div>
```

### 3. Preisvergleich aktualisieren (nach Produktwechsel)

```javascript
// Nach AJAX-Response
if (response.data.price_comparison) {
    const pc = response.data.price_comparison;

    // Oberer Bereich: Preisvergleich
    $('.individual-total').html(pc.formatted_einzelkauf_total);
    $('.set-total').html(pc.formatted_set_preis + '/m²');
    $('.savings-badge').text('-' + Math.round(pc.ersparnis_prozent) + '%');
}
```

### 4. Gesamtsumme aktualisieren

```javascript
// Nach AJAX-Response
if (response.data.order_summary) {
    const os = response.data.order_summary;
    const packages = parseInt($('#packages-input').val()) || 1;

    // WICHTIG: Verwende Paketpreis vom Backend
    const totalPrice = os.gesamtpreis_pro_paket * packages;

    // Unterer Bereich: Gesamtsumme
    $('#total-amount').html(formatPrice(totalPrice));
}
```

### 5. Produktkarte nach Wechsel aktualisieren

```javascript
function updateProductCard(category, productData) {
    // Normalisiere Kategorie (sockelleisten → sockelleiste)
    const normalizedCategory = (category === 'sockelleisten') ? 'sockelleiste' : category;

    // Finde Card
    const $card = $(`.product-card[data-category="${normalizedCategory}"]`);

    // Bild aktualisieren
    $card.find('.product-image').attr('src', productData.image_url);

    // Name aktualisieren
    $card.find('.product-name').text(productData.name);

    // Original-Preis aktualisieren
    const unit = (category === 'daemmung') ? '/m²' : '/lfm';
    $card.find('.original-price').html(productData.formatted_price + unit);

    // Free-Preis aktualisieren
    if (productData.is_free || productData.clean_surcharge <= 0) {
        $card.find('.free-price').text('0,00 €' + unit);
    } else {
        const formattedSurcharge = formatPrice(productData.clean_surcharge);
        $card.find('.free-price').text('+' + formattedSurcharge + unit);
    }

    // data-product-id aktualisieren
    $card.attr('data-product-id', productData.id);
}
```

---

## Typische Probleme und Lösungen

### Problem 1: Kategorie-Inkonsistenz

**Symptom:** Cards werden nicht gefunden
**Ursache:** PHP verwendet `sockelleiste` (singular), JS verwendet `sockelleisten` (plural)
**Lösung:** Immer normalisieren:

```javascript
const normalizedCategory = (category === 'sockelleisten') ? 'sockelleiste' : category;
```

### Problem 2: Falsche Preise nach Produktwechsel

**Symptom:** Gesamtsumme stimmt nicht nach Produktwechsel
**Ursache:** m²/lfm-Preise statt Paketpreise verwendet
**Lösung:** Immer `order_summary.gesamtpreis_pro_paket` vom Backend verwenden

```javascript
// FALSCH
const totalPrice = response.data.price * packages;

// RICHTIG
const totalPrice = response.data.order_summary.gesamtpreis_pro_paket * packages;
```

### Problem 3: UVP wird nicht berücksichtigt

**Symptom:** Ersparnis zu niedrig
**Ursache:** Backend-Preisberechnung verwendet UVP, aber Frontend nicht
**Lösung:** Backend-Daten aus `price_comparison` verwenden

```javascript
// FALSCH - Frontend berechnet selbst
const savings = oldPrice - newPrice;

// RICHTIG - Backend-Daten verwenden
const savings = response.data.price_comparison.ersparnis_euro;
```

---

## Debugging-Tipps

### Backend-Logs prüfen

```bash
# WordPress Debug-Log
tail -f wp-content/debug.log | grep "Jaeger"

# Plugin Debug-Log
tail -f wp-content/debug-jaeger-plugin.log
```

### Frontend-Konsole

```javascript
// Debug-Modus aktivieren
JaegerSetAngebot.debug = true;

// Dann werden diese Variablen verfügbar:
window.SetAngebotManager  // Manager-Instanz
window.setData            // Aktuelle Set-Daten
```

### AJAX-Requests monitoren

Browser DevTools → Network Tab → Filter: `admin-ajax.php`

**Wichtige Felder in Response prüfen:**
- `response.data.price_comparison` → Preisvergleich-Daten
- `response.data.order_summary` → Gesamtsummen-Daten
- `response.data.clean_surcharge` → Sauberer Aufpreis (Zahl, nicht formatiert)

---

## Kontakt & Support

**Backend-Entwickler:** Jo Kalenberg
**Plugin-Dokumentation:** `CLAUDE.md` im Plugin-Root
**Technische Fragen:** Siehe Error-Logs oder AJAX-Response-Debug-Ausgaben

---

**Letzte Aktualisierung:** 2025-01-13
**Dokumentiert von:** Claude (AI-Assistant)
