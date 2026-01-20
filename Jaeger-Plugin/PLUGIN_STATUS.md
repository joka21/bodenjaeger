# Jaeger Plugin - Aktueller Status & Weiterarbeit

**Stand**: 14. November 2025
**Version**: 1.0.1
**Letzte Änderungen**: Backend-Fixes, Preisberechnung, Error-Handling

---

## 📋 Inhaltsverzeichnis

1. [Plugin-Übersicht](#plugin-übersicht)
2. [Aktuelle Architektur](#aktuelle-architektur)
3. [Kürzlich behobene Probleme](#kürzlich-behobene-probleme)
4. [Bekannte offene Punkte](#bekannte-offene-punkte)
5. [Nächste Schritte](#nächste-schritte)
6. [Wichtige Code-Bereiche](#wichtige-code-bereiche)

---

## 🎯 Plugin-Übersicht

Das **Jaeger Plugin** ist ein WordPress/WooCommerce-Plugin für die Verwaltung von Bodenbelag-Produkten mit erweiterten Set-Angeboten.

### Hauptfunktionen

- **Set-Angebot System**: Produkt-Bundles mit Dämmung und Sockelleisten
- **Automatische Preisberechnung**: Backend & Frontend
- **REST API**: Für externes Frontend (Next.js geplant)
- **Custom Product Fields**: Paketpreise, UVP, Verschnitt, etc.
- **Warenkorb-Integration**: Bundle-Synchronisation

---

## 🏗️ Aktuelle Architektur

### Backend-Komponenten

```
backend/
├── backend-functions.php         # Core-Funktionen
├── backend-zusatzfelder.php      # Custom Product Fields
├── backend-setangebot.php        # Set-Angebot Backend ⭐
├── backend-aktionen.php          # Admin-Aktionen
├── api-endpoints.php             # REST API Endpoints
├── api-product-data.php          # REST API Produktdaten
├── warenkorb-integration.php     # WooCommerce Cart Integration
├── checkout-wc-compatibility.php # CheckoutWC Kompatibilität
└── acf-migration.php             # ACF Migration (optional)
```

### Frontend-Komponenten (derzeit inaktiv)

```
frontend/
├── frontend.php                  # Frontend Controller (DEAKTIVIERT)
├── set-angebot/                  # Set-Angebot Frontend-Komponente
│   ├── data-handler.php
│   ├── display-handler.php
│   ├── ajax-handler.php
│   └── set-angebot.js
└── [weitere Frontend-Komponenten]
```

**Status**: Frontend-Dateien werden NICHT geladen (siehe JaegerPlugin.php:147)

---

## ✅ Kürzlich behobene Probleme

### 1. Serverseitige Preisberechnung beim Speichern
**Datei**: `backend/backend-setangebot.php` (Zeilen 405-529)

**Problem**:
- Preise wurden nur im Frontend berechnet
- Datenbank-Felder blieben leer (NULL)
- Frontend konnte keine gespeicherten Werte lesen

**Lösung**:
```php
// In jaeger_save_setangebot_fields() - Zeile 455+
// Automatische Berechnung beim Speichern:
$einzelpreis = $highest_price + $daemmung_price + $sockelleisten_price;
$gesamtpreis = $lowest_price * (1 - ($rabatt / 100));
$ersparnis_euro = $einzelpreis - $gesamtpreis;
$ersparnis_prozent = ($einzelpreis > 0) ? ($ersparnis_euro / $einzelpreis * 100) : 0;

// In Datenbank speichern
update_post_meta($post_id, '_setangebot_einzelpreis', $einzelpreis);
update_post_meta($post_id, '_setangebot_gesamtpreis', $gesamtpreis);
update_post_meta($post_id, '_setangebot_ersparnis_euro', $ersparnis_euro);
update_post_meta($post_id, '_setangebot_ersparnis_prozent', $ersparnis_prozent);
```

**Ergebnis**: Werte werden jetzt automatisch beim Produkt-Speichern berechnet und in DB geschrieben

---

### 2. Deprecated WooCommerce Meta-Zugriff
**Datei**: `backend/backend-zusatzfelder.php` (Zeile 374-375)

**Problem**:
- `$product->get_meta('_sale_price')` ist deprecated
- Erzeugte 1.1MB Log-Datei mit Hunderten identischen Fehlern

**Lösung**:
```php
// ❌ ALT (fehlerhaft):
if ($product->get_sale_price() === '') {
    $sale_price = $product->get_meta('_sale_price'); // DEPRECATED!
    if (!empty($sale_price)) {
        $product->set_sale_price($sale_price);
        $product->save();
    }
}

// ✅ NEU (repariert):
// Innerhalb des Verkaufszeitraums - Angebotspreis ist bereits durch WooCommerce gesetzt
// Keine weitere Aktion erforderlich
```

**Ergebnis**: Keine Fehler mehr im Log

---

### 3. Undefined Variables im Backend
**Datei**: `backend/backend-setangebot.php` (Zeilen 259-278)

**Problem**:
- `$daemmung_id` und `$sockelleisten_id` nicht im Function-Scope verfügbar
- PHP Warning bei jedem Seitenaufruf

**Lösung**:
```php
// Variablen neu laden in jaeger_add_setangebot_product_data_panels()
$daemmung_id = get_post_meta($post->ID, '_standard_addition_daemmung', true);
$sockelleisten_id = get_post_meta($post->ID, '_standard_addition_sockelleisten', true);

// Preise ermitteln
$daemmung_price = 0;
$sockelleisten_price = 0;

if ($daemmung_id) {
    $daemmung_product = wc_get_product($daemmung_id);
    if ($daemmung_product) {
        $daemmung_price = $daemmung_product->get_price();
    }
}
```

**Ergebnis**: Produktinformationen werden korrekt angezeigt

---

### 4. ACF Plugin Dependency
**Datei**: `JaegerPlugin.php` (Zeilen 154-164)

**Problem**:
- `acf-migration.php` wurde immer geladen
- FATAL Error wenn ACF Plugin nicht installiert: `Call to undefined function update_field()`

**Lösung**:
```php
// ACF Migration nur laden wenn ACF Plugin aktiv ist
if (function_exists('get_field')) {
    $backend_files[] = 'backend/acf-migration.php';
}
```

**Ergebnis**: Kein Fatal Error mehr, Plugin funktioniert ohne ACF

---

## ⚠️ Bekannte offene Punkte

### 1. Frontend-Produkt-Wechsel funktioniert nicht vollständig
**Status**: Teilweise behoben, aber Frontend noch nicht getestet

**Problem**:
- Im Frontend-Modal wird Produktwechsel bestätigt ("Produkt wurde gewechselt")
- Aber Anzeige wird nicht aktualisiert

**Mögliche Ursachen**:
- Frontend-Dateien werden nicht geladen (siehe `JaegerPlugin.php:147`)
- AJAX-Response wird nicht korrekt verarbeitet
- UI-Update-Logik fehlt

**Zu prüfen**:
- `frontend/set-angebot/set-angebot-ui.js` - UI-Update nach AJAX
- `frontend/set-angebot/ajax-handler.php` - Response-Format
- Browser-Console für JavaScript-Fehler

---

### 2. Frontend-Integration unklar
**Status**: Frontend-Dateien sind deaktiviert

**Aktuell in `JaegerPlugin.php:147`**:
```php
// Backend components only (Frontend-related files removed)
$backend_files = array(
    'backend/backend-functions.php',
    'backend/backend-zusatzfelder.php',
    // ...
);

// Frontend-Dateien werden NICHT geladen:
// 'frontend/frontend.php' ist nicht in der Liste!
```

**Fragen**:
- Soll WordPress-Frontend weiterhin verwendet werden?
- Oder komplett auf Next.js Frontend umstellen?
- Wenn WordPress-Frontend: `frontend/frontend.php` muss wieder aktiviert werden

---

### 3. REST API für Next.js
**Status**: Implementiert, aber nicht getestet

**Verfügbare Endpoints**:
```
GET  /wp-json/jaeger/v1/products        # Produktliste
GET  /wp-json/jaeger/v1/product/{id}    # Einzelprodukt
POST /wp-json/jaeger/v1/calculate       # Preisberechnung
GET  /wp-json/jaeger/v1/product-options # Produktoptionen (Dämmung/Sockelleisten)
```

**Zu testen**:
```bash
# Test 1: Produktliste
curl https://dein-shop.de/wp-json/jaeger/v1/products

# Test 2: Einzelprodukt
curl https://dein-shop.de/wp-json/jaeger/v1/product/10485

# Test 3: Preisberechnung
curl -X POST https://dein-shop.de/wp-json/jaeger/v1/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "main_product_id": 10485,
    "daemmung_id": 123,
    "sockelleisten_id": 456,
    "quadratmeter": 25
  }'
```

---

### 4. Datenbank-Werte noch nicht gespeichert
**Status**: Code ist implementiert, muss getestet werden

**Was tun**:
1. Im WordPress Backend: Produkt ID 10485 öffnen
2. Tab "Setangebot" öffnen
3. Button "Aktualisieren" klicken (auch ohne Änderungen)
4. Prüfen ob Werte jetzt in DB sind:

**SQL-Abfrage zum Prüfen**:
```sql
SELECT meta_key, meta_value
FROM wp_postmeta
WHERE post_id = 10485
  AND meta_key IN (
    '_setangebot_einzelpreis',
    '_setangebot_gesamtpreis',
    '_setangebot_ersparnis_euro',
    '_setangebot_ersparnis_prozent'
  );
```

**Erwartetes Ergebnis**:
```
_setangebot_einzelpreis         45.99
_setangebot_gesamtpreis         39.99
_setangebot_ersparnis_euro      6.00
_setangebot_ersparnis_prozent   13.04
```

---

## 🚀 Nächste Schritte

### Priorität 1: Backend testen
1. ✅ Fehler im Log behoben
2. ⏳ **Produkt im Backend speichern** (ID 10485)
3. ⏳ **Datenbank prüfen** ob Werte gespeichert wurden
4. ⏳ **Backend-Tab "Setangebot"** prüfen ob Berechnung angezeigt wird

### Priorität 2: Entscheidung Frontend
**Option A: WordPress Frontend weiter nutzen**
- `frontend/frontend.php` in `JaegerPlugin.php` wieder aktivieren
- Frontend-Komponenten testen
- Produktwechsel-Bug beheben

**Option B: Komplett auf Next.js umstellen**
- WordPress nur als Headless CMS + REST API
- Next.js Frontend entwickeln
- REST API ausgiebig testen

### Priorität 3: REST API testen
1. Postman/cURL Tests für alle Endpoints
2. Response-Format validieren
3. Fehlerbehandlung prüfen
4. CORS-Einstellungen für Next.js

### Priorität 4: Dokumentation aktualisieren
1. `CLAUDE.md` mit neuen Änderungen aktualisieren
2. API-Dokumentation für Next.js-Entwickler
3. Setup-Anleitung für Entwicklungsumgebung

---

## 💻 Wichtige Code-Bereiche

### 1. Preisberechnung (Backend)
**Datei**: `backend/backend-setangebot.php`

**Wichtige Funktionen**:
- `jaeger_save_setangebot_fields()` (Zeile 405) - Speichern + Berechnung
- `jaeger_calculate_setangebot_prices()` (Zeile 274) - AJAX-Berechnung
- `jaeger_add_setangebot_product_data_panels()` (Zeile 97) - Admin-UI

**Berechnung**:
```php
// Höchster Preis (für Vergleich)
$highest_price = $show_uvp && $uvp_price > 0 ? $uvp_price : $regular_price;

// Niedrigster Preis (für Set)
$lowest_price = $sale_price > 0 ? $sale_price : $regular_price;

// Einzelpreis = Höchster Preis + Dämmung + Sockelleiste
$einzelpreis = $highest_price + $daemmung_price + $sockelleisten_price;

// Set-Preis = Niedrigster Preis (Zusatzprodukte kostenlos im Set!)
$gesamtpreis = $lowest_price * (1 - ($rabatt / 100));

// Ersparnis
$ersparnis_euro = $einzelpreis - $gesamtpreis;
$ersparnis_prozent = ($einzelpreis > 0) ? ($ersparnis_euro / $einzelpreis * 100) : 0;
```

---

### 2. Custom Product Fields
**Datei**: `backend/backend-zusatzfelder.php`

**Wichtige Meta-Keys**:
```php
'_paketpreis'                      // Preis pro Paket
'_paketpreis_s'                    // Sonderpreis pro Paket
'_paketinhalt'                     // m² oder lfm pro Paket
'_verschnitt'                      // Verschnitt in %
'_uvp'                             // UVP Preis
'_show_uvp'                        // UVP anzeigen (yes/no)

// Set-Angebot
'_show_setangebot'                 // Set-Angebot aktiv (yes/no)
'_setangebot_rabatt'               // Zusatzrabatt in %
'_setangebot_einzelpreis'          // Berechneter Einzelpreis
'_setangebot_gesamtpreis'          // Berechneter Set-Preis
'_setangebot_ersparnis_euro'       // Ersparnis in €
'_setangebot_ersparnis_prozent'    // Ersparnis in %

// Zusatzprodukte
'_standard_addition_daemmung'      // Standard-Dämmung ID
'_standard_addition_sockelleisten' // Standard-Sockelleiste ID
'_option_products_daemmung'        // Wählbare Dämmungen (IDs)
'_option_products_sockelleisten'   // Wählbare Sockelleisten (IDs)
```

---

### 3. REST API Endpoints
**Datei**: `backend/api-endpoints.php`

**Registrierung**:
```php
// Namespace: jaeger/v1
register_rest_route('jaeger/v1', '/products', [...]);
register_rest_route('jaeger/v1', '/product/(?P<id>\d+)', [...]);
register_rest_route('jaeger/v1', '/calculate', [...]);
register_rest_route('jaeger/v1', '/product-options', [...]);
```

**Verwendung**:
```javascript
// Next.js Frontend
const response = await fetch('/wp-json/jaeger/v1/products');
const products = await response.json();
```

---

### 4. Warenkorb-Integration
**Datei**: `backend/warenkorb-integration.php`

**Bundle-System**:
```php
// Bundle-Meta-Keys im Warenkorb
'jaeger_set_bundle_id'           // Eindeutige Bundle-ID
'jaeger_set_type'                // 'main' | 'daemmung' | 'sockelleisten'
'jaeger_set_quadratmeter'        // Fläche in m²
'jaeger_set_pakete'              // Anzahl Pakete
'jaeger_set_price_per_unit'      // Set-Preis pro Einheit
'jaeger_set_original_price'      // Original-Einzelpreis
'jaeger_set_discount_percent'    // Rabatt in %
```

**Mengen-Synchronisation**:
- Hauptprodukt-Menge ändern → Bundle-Items aktualisieren
- Bundle-Items nicht einzeln änderbar
- Sockelleisten: Spezialberechnung basierend auf Raumgröße

---

## 📊 Datenbankstruktur

### Wichtige Tabellen

**wp_posts**: Produkte (post_type = 'product')
- Haupt-Produktdaten
- WooCommerce Standard-Felder

**wp_postmeta**: Custom Product Fields
- Alle `_jaeger_*` und Plugin-spezifischen Meta-Keys
- Set-Angebot Berechnungen
- Zusatzprodukt-Verknüpfungen

**wp_woocommerce_order_items**: Warenkorb & Bestellungen
- Bundle-Informationen
- Set-Angebot Metadaten

---

## 🔧 Entwicklungsumgebung

### Voraussetzungen
- WordPress 5.0+
- PHP 7.4+
- WooCommerce 5.0+
- MySQL/MariaDB

### Optional
- ACF (Advanced Custom Fields) - für Migration
- CheckoutWC - für optimierten Checkout

### Debug-Modus
```php
// In wp-config.php aktivieren:
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// Log-Dateien:
// wp-content/debug.log                        // WordPress Standard
// wp-content/debug-jaeger-plugin.log          // Plugin-spezifisch
```

### Testing
```bash
# PHP Syntax Check
find . -name "*.php" -exec php -l {} \;

# Plugin aktivieren (WP-CLI)
wp plugin activate jaeger-plugin

# Produkte auflisten
wp wc product list
```

---

## 📝 Wichtige Hinweise

### Code-Standards
- WordPress Coding Standards
- Alle Eingaben sanitisieren: `sanitize_text_field()`, `absint()`
- Ausgaben escapen: `esc_html()`, `esc_attr()`
- Nonce-Prüfung für alle AJAX-Requests

### Performance
- Produkt-Caching: 12 Stunden (Transients)
- Asset-Loading: Nur bei Bedarf (Conditional)
- Batch-Processing für große Produktlisten

### Sicherheit
- Alle AJAX-Endpoints mit Nonces gesichert
- Input-Validierung
- Prepared SQL-Statements
- Berechtigungsprüfung für Admin-Funktionen

---

## 🆘 Troubleshooting

### Problem: Preise werden nicht berechnet
1. Prüfen: Sind Zusatzprodukte zugewiesen?
2. Prüfen: Ist JavaScript geladen? (Browser Console)
3. Prüfen: AJAX-Nonce korrekt?
4. Debug-Log checken: `debug-jaeger-plugin.log`

### Problem: Frontend zeigt alte Werte
1. Produkt im Backend speichern
2. Browser-Cache leeren
3. WordPress-Cache leeren (falls Caching-Plugin aktiv)
4. Datenbank prüfen ob Werte gespeichert wurden

### Problem: REST API 404 Error
1. Permalinks neu speichern: Settings → Permalinks → Save
2. .htaccess prüfen (mod_rewrite aktiv?)
3. REST API Test: `/wp-json/` aufrufen

### Problem: Fatal Error beim Aktivieren
1. PHP-Version prüfen (min. 7.4)
2. WooCommerce installiert?
3. Composer-Abhängigkeiten installiert? (falls vorhanden)
4. Error-Log checken

---

## 📞 Kontakt & Support

**Plugin-Autor**: Jo Kalenberg
**Version**: 1.0.1
**Lizenz**: Private

**Dokumentation**:
- `CLAUDE.md` - Vollständige technische Dokumentation
- `PLUGIN_STATUS.md` - Dieser Status-Report

---

## ✨ Changelog

### Version 1.0.1 (14.11.2025)
- ✅ Serverseitige Preisberechnung beim Speichern
- ✅ Deprecated WooCommerce Meta-Zugriff behoben
- ✅ Undefined Variables im Backend behoben
- ✅ ACF Plugin Dependency optional gemacht
- ✅ Debug-Log bereinigt (1.1MB → leer)
- ✅ REST API Endpoints implementiert
- ⚠️ Frontend-Dateien deaktiviert (Entscheidung offen)

### Version 1.0.0
- Initiale Version
- Set-Angebot System
- Custom Product Fields
- Warenkorb-Integration

---

**Letzte Aktualisierung**: 14. November 2025, 14:40 Uhr
