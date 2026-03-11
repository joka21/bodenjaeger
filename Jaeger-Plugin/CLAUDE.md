# CLAUDE.md

Dieses Dokument bietet eine vollständige Anleitung für Claude Code (claude.ai/code) beim Arbeiten mit dem Code in diesem Repository.

## Plugin-Übersicht

Das **Jaeger Plugin** ist ein umfassendes WordPress-Plugin für die Verwaltung von Produkt-Paketen in WooCommerce E-Commerce-Seiten. Es bietet erweiterte Produktkonfiguratoren, Slider-Komponenten und Set-basierte Produktangebote mit dynamischen Preisberechnungen.

### Plugin-Details
- **Name**: Jaeger Plugin
- **Version**: 1.0.1
- **Autor**: Jo Kalenberg
- **Lizenz**: Private
- **Kompatibilität**: WordPress 5.0+, PHP 7.4+, WooCommerce 5.0+, HPOS-kompatibel

## Dateistruktur

```
Jaeger-Plugin/
├── JaegerPlugin.php                    # Hauptplugin-Datei (Bootstrap)
├── function.php                        # Theme-Funktionen (Elementor Pro Safety)
├── wp-config.php                       # WordPress-Konfiguration
├── debug.log                          # Plugin-Debug-Log
├── CLAUDE.md                          # Diese Dokumentation
│
├── includes/                          # Kernklassen
│   ├── class-autoloader.php          # PSR-4 Autoloader
│   └── class-error-handler.php       # Unified Error Handling
│
├── backend/                           # Admin-Funktionalitäten
│   ├── backend-functions.php         # Core Admin-Funktionen
│   ├── backend-zusatzfelder.php      # Benutzerdefinierte Produktfelder
│   ├── backend-setangebot.php        # Set-Angebot Backend-Integration
│   ├── backend-aktionen.php          # Admin-Aktionen und Styling
│   ├── acf-migration.php             # Advanced Custom Fields Migration
│   ├── shortcodes-cards.php          # Shortcodes für Preisanzeigen
│   ├── warenkorb-integration.php     # WooCommerce Warenkorb-Integration
│   ├── checkout-wc-compatibility.php # CheckoutWC Kompatibilität
│   ├── css/                          # Admin-Styles
│   │   ├── admin-style.css           # Allgemeine Admin-Styles
│   │   ├── aktionen.css              # Aktions-Styles
│   │   └── setangebot.css            # Set-Angebot Admin-Styles
│   └── js/                           # Admin-JavaScript
│       ├── calculations.js           # Grundlegende Berechnungen
│       ├── jaeger-plugin.js          # Plugin-Admin-Logik
│       ├── jaeger-product-calculations.js # Produktberechnungen
│       ├── setangebot-calculations.js # Set-Angebot Berechnungen
│       └── debug.log                 # JavaScript Debug-Log
│
├── frontend/                         # Frontend-Komponenten
│   ├── frontend.php                  # Frontend-Controller
│   ├── css/                          # Frontend-Styles
│   │   ├── konfigurator.css          # Konfigurator-Styles
│   │   └── product-card.css          # Produktkarten-Styles
│   ├── js/                           # Frontend-JavaScript
│   │   ├── konfigurator.js           # Konfigurator-Logik
│   │   └── product-card.js           # Produktkarten-Logik
│   │
│   ├── product-slider/               # Produktslider-Komponente
│   │   ├── data-handler.php          # Datenhandling
│   │   ├── display-handler.php       # Anzeige-Logik
│   │   ├── product-slider.css        # Slider-Styles
│   │   ├── product-slider.js         # Slider-JavaScript
│   │   ├── produkt-slider.css        # Alternative Slider-Styles
│   │   └── produkt-slider.js         # Alternative Slider-JavaScript
│   │
│   ├── set-angebot/                  # Set-Angebot Komponente
│   │   ├── data-handler.php          # Datenverarbeitung
│   │   ├── display-handler.php       # HTML-Ausgabe
│   │   ├── ajax-handler.php          # AJAX-Endpunkte
│   │   ├── set-angebot.css           # Set-Angebot Styles
│   │   ├── set-angebot.js            # Set-Angebot JavaScript
│   │   ├── set-angebot-calculations.js # Preisberechnungen
│   │   └── set-angebot-ui.js         # UI-Interaktion und Modal
│   │
│   └── zubehoer-slider/              # Zubehör-Slider Komponente
│       ├── data-handler.php          # Zubehör-Datenhandling
│       ├── display-handler.php       # Zubehör-Anzeige
│       ├── frontend-konfigurator.php # Konfigurator-Integration
│       ├── functions.php             # Hilfsfunktionen
│       ├── zubehoer-slider.css       # Zubehör-Styles
│       └── zubehoer-slider.js        # Zubehör-JavaScript
│
└── network/                          # WordPress Multisite-Dateien
    ├── [Verschiedene WordPress-Admin-Dateien]
    └── [WARNUNG: Potentiell WordPress-Core-Dateien]
```

## Backend-Funktionalitäten

### WooCommerce Integration

Das Plugin erweitert WooCommerce um umfangreiche Funktionen:

#### Custom Product Data Tabs
- **Zusatzprodukte Tab**: Verwaltung von Dämmung, Sockelleisten und Zubehör
- **Set-Angebot Tab**: Konfiguration von Bundle-Angeboten mit Rabattberechnungen

#### Benutzerdefinierte Produktfelder
```php
// Wichtige Meta-Keys
'_standard_addition_daemmung'       // Standard-Dämmungsprodukt
'_standard_addition_sockelleisten'  // Standard-Sockelleistenprodukt
'_option_products_daemmung'         // Auswahlbare Dämmungsprodukte
'_option_products_sockelleisten'    // Auswahlbare Sockelleistenprodukte
'_show_setangebot'                  // Set-Angebot aktivieren
'_setangebot_rabatt'                // Zusätzlicher Set-Rabatt in %
'_setangebot_einzelpreis'           // Berechneter Einzelpreis
'_setangebot_gesamtpreis'           // Berechneter Set-Preis
'_setangebot_ersparnis_euro'        // Ersparnis in Euro
'_setangebot_ersparnis_prozent'     // Ersparnis in Prozent
'_paketpreis'                       // Preis pro Paket
'_paketpreis_s'                     # Sonderpreis pro Paket
'_paketinhalt'                      // Paketinhalt in m²/lfm
'_verschnitt'                       // Verschnitt in %
'_uvp'                              // Unverbindliche Preisempfehlung
'_show_uvp'                         // UVP anzeigen
```

#### Preisberechnungslogik
```php
// Set-Angebot Preisberechnung
$einzelpreis = $hauptprodukt_preis + $daemmung_preis + $sockelleisten_preis;
$gesamtpreis = $hauptprodukt_sale_preis * (1 - $zusatz_rabatt/100);
$ersparnis_euro = $einzelpreis - $gesamtpreis;
$ersparnis_prozent = ($ersparnis_euro / $einzelpreis) * 100;
```

### Produktkategorien-Management

#### Unterstützte Kategorien
- **Hauptkategorien**: Laminat, Vinyl, Parkett, Teppichboden
- **Dämmung**: Trittschalldämmung, Feuchtigkeitssperre
- **Sockelleisten**: Verschiedene Profile und Materialien
- **Zubehör**: 
  - Untergrundvorbereitung
  - Werkzeug
  - Kleber
  - Montagekleber und Silikon
  - Zubehör für Sockelleisten
  - Schienen und Profile
  - Reinigung und Pflege

#### Produktdaten-Caching
```php
// Cache-Mechanismus
$cache_key = 'jaeger_products_' . md5(implode('_', $categories));
$options = get_transient($cache_key); // 12 Stunden Cache
```

## Frontend-Komponenten

### Architektur-Pattern

Alle Frontend-Komponenten folgen einem einheitlichen MVC-Pattern:

```php
// Pattern für jede Komponente
ComponentName/
├── data-handler.php    // Model: Datenabfrage und -verarbeitung
├── display-handler.php // View: HTML-Ausgabe und Rendering
└── ajax-handler.php    // Controller: AJAX-Endpunkte und Logik
```

### Set-Angebot Komponente

#### Datenfluss
1. **Data Handler** lädt Produktdaten und berechnet Preise
2. **Display Handler** rendert HTML mit Produktauswahl
3. **AJAX Handler** verarbeitet Produktwechsel und Warenkorb-Aktionen
4. **UI JavaScript** steuert Interaktionen und Modal-Dialoge

#### Preisberechnung Frontend
```javascript
// Preisberechnung im Frontend
calculateTotals() {
    const regular_total = this.getRegularTotal();
    const sale_total = this.getSaleTotal(); 
    const savings = regular_total - sale_total;
    const savingsPercentage = (savings / regular_total) * 100;
    return { total: sale_total, savings, savingsPercentage };
}
```

### Modal-System

#### Produktauswahl-Modal
- **Responsive Design**: Funktioniert auf Desktop und Mobile
- **Forced Visibility**: Überschreibt Theme-CSS-Konflikte
- **Emergency Close**: Mehrere Schließmechanismen für Kompatibilität
- **Product Cards**: Feature-Listen und Preisanzeige

### Warenkorb-Integration

#### Bundle-System
```php
// Bundle-Struktur im Warenkorb
$cart_item_data = [
    'jaeger_set_bundle_id' => $bundle_id,
    'jaeger_set_type' => 'main|daemmung|sockelleisten',
    'jaeger_set_quadratmeter' => $quadratmeter,
    'jaeger_set_pakete' => $pakete,
    'jaeger_set_price_per_unit' => $set_price,
    'jaeger_set_original_price' => $original_price,
    'jaeger_set_discount_percent' => $rabatt,
];
```

#### Mengen-Synchronisation
- **Hauptprodukt**: Editierbare Menge
- **Bundle-Items**: Automatische Synchronisation
- **Sockelleisten**: Spezialberechnung basierend auf Umfang

## JavaScript-Integration

### Globale Objekte

#### JaegerKonfigurator
```javascript
window.JaegerKonfigurator = {
    currentProducts: {
        main: product_id,
        daemmung: daemmung_id,
        sockelleisten: sockelleisten_id
    },
    nonce: 'wp_nonce_value',
    ajax_url: 'admin-ajax.php'
};
```

#### SetAngebotCalculations
```javascript
// Preisberechnungsklasse
class SetAngebotCalculations {
    static State = class {
        calculateTotals() { /* Preislogik */ }
        formatPrice(price) { /* Formatierung */ }
        parsePrice(priceString) { /* Parsing */ }
    }
}
```

### AJAX-Sicherheit

Alle AJAX-Anfragen verwenden WordPress-Nonces:
```php
check_ajax_referer('set_angebot_nonce', 'nonce');
```

## CSS und Styling

### Admin-Styles

#### Produktbearbeitungsseite
- **Tab-Integration**: Nahtlose WooCommerce-Integration
- **Responsive Tables**: Preisberechnungstabellen
- **Color Coding**: Visuelle Hervorhebung von Rabatten und Ersparnissen

#### Set-Angebot Styles
```css
/* Wichtige CSS-Klassen */
.setangebot-calculation table { /* Berechnungstabelle */ }
.jaeger-set-info { /* Warenkorb-Zusatzinfo */ }
.bundle-quantity { /* Bundle-Mengenanzeige */ }
```

### Frontend-Styles

#### Set-Angebot Komponente
```css
/* Hauptcontainer */
.set-angebot-wrapper { /* Flex-Layout */ }
.set-angebot-products { /* Produktliste */ }
.set-angebot-calculation { /* Mengenberechnung */ }
.set-angebot-cart { /* Warenkorb-Aktionen */ }
```

#### Modal-Styles
```css
/* Modal-System */
.set-angebot-modal { /* Overlay */ }
.set-angebot-modal-content { /* Content-Container */ }
.set-angebot-product-grid { /* Produktraster */ }
.set-angebot-product-option { /* Einzelprodukt-Karte */ }
```

## Datenbank-Integration

### Meta-Keys und Taxonomien

#### Produkt-Meta-Keys
```sql
-- Paketinformationen
_paketpreis            DECIMAL(10,2)  -- Preis pro Paket
_paketpreis_s          DECIMAL(10,2)  -- Sonderpreis pro Paket  
_paketinhalt           DECIMAL(8,3)   -- Paketinhalt in m²/lfm
_verschnitt            DECIMAL(5,2)   -- Verschnitt in %

-- UVP-System
_uvp                   DECIMAL(10,2)  -- Unverbindliche Preisempfehlung
_show_uvp              VARCHAR(3)     -- 'yes'/'no'

-- Set-Angebot
_show_setangebot       VARCHAR(3)     -- 'yes'/'no'
_setangebot_rabatt     DECIMAL(5,2)   -- Zusatzrabatt in %
_setangebot_einzelpreis DECIMAL(10,2) -- Berechneter Einzelpreis
_setangebot_gesamtpreis DECIMAL(10,2) -- Berechneter Set-Preis
_setangebot_ersparnis_euro DECIMAL(10,2) -- Ersparnis in Euro
_setangebot_ersparnis_prozent DECIMAL(5,2) -- Ersparnis in %

-- Zusatzprodukte
_standard_addition_daemmung INT(11)   -- Standard-Dämmung ID
_standard_addition_sockelleisten INT(11) -- Standard-Sockelleiste ID
_option_products_daemmung TEXT        -- Kommagetrennte IDs
_option_products_sockelleisten TEXT   -- Kommagetrennte IDs
```

#### Produktkategorien (WooCommerce Taxonomien)
```sql
-- Hauptkategorien
laminat, vinylboden, parkett, teppichboden

-- Zusatzkategorien  
daemmung, sockelleisten

-- Zubehör-Kategorien
untergrundvorbereitung, werkzeug, kleber, 
montagekleber-silikon, zubehoer-fuer-sockelleisten,
schienen-profile, reinigung-pflege
```

### Caching-Strategie

#### Transient-Caches
```php
// Produktlisten (12 Stunden)
set_transient('jaeger_products_' . $cache_key, $data, 12 * HOUR_IN_SECONDS);

// Fehlerlogs (7 Tage)
set_transient('jaeger_plugin_errors', $errors, 7 * DAY_IN_SECONDS);
```

#### Cache-Invalidierung
```php
// Bei Produktänderungen
jaeger_invalidate_product_caches();
```

## API und AJAX-Endpoints

### AJAX-Actions

#### Frontend-Actions
```php
// Set-Angebot Aktionen
'wp_ajax_get_product_options'        // Produktoptionen laden
'wp_ajax_nopriv_get_product_options' // Für nicht-eingeloggte Benutzer
'wp_ajax_add_set_to_cart'            // Set zum Warenkorb hinzufügen
'wp_ajax_nopriv_add_set_to_cart'     // Für nicht-eingeloggte Benutzer

// Einzelprodukt-Aktionen  
'wp_ajax_add_to_cart'                // Einzelprodukt hinzufügen
'wp_ajax_nopriv_add_to_cart'         // Für nicht-eingeloggte Benutzer
```

#### Backend-Actions
```php
// Set-Angebot Preisberechnung
'wp_ajax_jaeger_calculate_setangebot' // Preise neu berechnen

// Warenkorb-Integration
'wp_ajax_jaeger_add_set_to_cart'      // Set zum Warenkorb (Backend)
```

### API-Request-Format

#### Produktoptionen abrufen
```javascript
{
    action: 'get_product_options',
    category: 'daemmung|sockelleisten',
    product_id: 123,
    nonce: 'wp_nonce_value'
}
```

#### Set zum Warenkorb hinzufügen
```javascript
{
    action: 'jaeger_add_set_to_cart',
    main_product_id: 123,
    daemmung_id: 456,
    sockelleisten_id: 789,
    quadratmeter: 25.5,
    pakete: 12,
    nonce: 'wp_nonce_value'
}
```

### API-Response-Format

#### Erfolgreiche Antwort
```json
{
    "success": true,
    "data": {
        "message": "Set erfolgreich hinzugefügt",
        "cart_count": 3,
        "cart_total": "€ 1.234,56",
        "redirect_url": "/checkout/",
        "bundle_id": "jaeger_set_1640995200_1234"
    }
}
```

#### Fehlerantwort
```json
{
    "success": false,
    "data": "Fehlermeldung für Benutzer"
}
```

## Hooks und Events

### WordPress-Hooks

#### Plugin-Initialisierung
```php
// Plugin-Aktivierung/Deaktivierung
register_activation_hook(JAEGER_PLUGIN_FILE, 'activate');
register_deactivation_hook(JAEGER_PLUGIN_FILE, 'deactivate');

// Plugin-Laden
add_action('plugins_loaded', 'init');
```

#### Admin-Hooks
```php
// WooCommerce Produkt-Tabs
add_filter('woocommerce_product_data_tabs', 'jaeger_add_product_data_tab');
add_action('woocommerce_product_data_panels', 'jaeger_add_product_data_panels');

// Speichern
add_action('woocommerce_admin_process_product_object', 'jaeger_save_custom_fields_to_product');
```

#### Frontend-Hooks
```php
// Asset-Loading
add_action('wp_enqueue_scripts', 'load_assets');

// WooCommerce-Integration
add_action('woocommerce_before_calculate_totals', 'before_calculate_totals');
add_filter('woocommerce_cart_item_name', 'cart_item_name');
add_filter('woocommerce_cart_item_quantity', 'cart_item_quantity');
```

### Custom-Hooks

#### Plugin-spezifische Hooks
```php
// Preisberechnung
do_action('jaeger_before_price_calculation', $product_id);
do_action('jaeger_after_price_calculation', $product_id, $prices);

// Cache-Invalidierung
do_action('jaeger_cache_invalidated', $cache_keys);

// Fehlerbehandlung
do_action('jaeger_error_logged', $error_data);
```

### JavaScript-Events

#### DOM-Events
```javascript
// Produktauswahl
$(document).on('click', '.change-product', handleProductChange);

// Mengenänderung
$(document).on('change', '.package-quantity', handleQuantityChange);

// Warenkorb
$(document).on('click', '.add-to-cart', handleAddToCart);
```

#### Custom-Events
```javascript
// Set-Angebot Events
$(document).trigger('jaeger:product:selected', [productData]);
$(document).trigger('jaeger:price:calculated', [priceData]);
$(document).trigger('jaeger:cart:added', [cartResponse]);
```

## Shortcodes

### Preisanzeige-Shortcodes

#### Einzelpreise
```php
[einzelpreis prefix="statt " suffix="" format="true"]
// Ausgabe: "statt 45,99 €/m²"

[gesamtpreis prefix="" suffix="" format="true" size="large"]
// Ausgabe: "39,99 €/m²"

[ersparnis_euro prefix="Sie sparen " suffix="" format="true"]  
// Ausgabe: "Sie sparen 6,00 €"

[ersparnis_prozent prefix="-" suffix="%" style="badge" round="true"]
// Ausgabe: "-13%" (als Badge)
```

#### Kombinierte Shortcodes
```php
[setangebot_display title="Set-Angebot" text="Inkl. Sockelleiste und Dämmung" 
                    show_stattpreis="true" show_ersparnis="false" preisgroesse="large"]

[produktcard show_image="true" show_title="true" show_rabatt="true" 
            image_size="woocommerce_thumbnail" title="Set-Angebot" 
            text="Inkl. Sockelleiste und Dämmung"]
```

### Komponenten-Shortcodes

#### Frontend-Komponenten
```php
[jaeger_product_slider product_id="123"]
// Produktslider für spezifisches Produkt

[zubehoer_slider product_id="123"]  
// Zubehör-Slider für spezifisches Produkt

[set_angebot product_id="123"]
// Set-Angebot Komponente für spezifisches Produkt
```

#### Verwendung in Templates
```php
// In Template-Dateien
echo do_shortcode('[set_angebot product_id="' . get_the_ID() . '"]');

// In Elementor/Page-Buildern
[setangebot_display show_ersparnis="true"]
[ersparnis_prozent style="badge"]
```

## Konfiguration und Einstellungen

### Plugin-Konstanten

#### Pfade und URLs
```php
define('JAEGER_PLUGIN_VERSION', '1.0.1');
define('JAEGER_PLUGIN_FILE', __FILE__);
define('JAEGER_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('JAEGER_PLUGIN_URL', plugin_dir_url(__FILE__));
define('JAEGER_PLUGIN_BASENAME', plugin_basename(__FILE__));
```

### Konfigurationsdateien

#### Autoloader-Konfiguration
```php
// includes/class-autoloader.php
private static $class_map = array(
    'Jaeger_Frontend' => 'frontend/class-jaeger-frontend.php',
    'Set_Angebot_Display_Handler' => 'frontend/set-angebot/display-handler.php',
    // weitere Klassen...
);
```

#### Error-Handler-Konfiguration
```php
// includes/class-error-handler.php
const ERROR_LEVEL_FATAL = 'fatal';
const ERROR_LEVEL_ERROR = 'error';
const ERROR_LEVEL_WARNING = 'warning';
const ERROR_LEVEL_INFO = 'info';
const ERROR_LEVEL_DEBUG = 'debug';
```

### WordPress-Integration

#### HPOS-Kompatibilität
```php
// WooCommerce High-Performance Order Storage
\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
    'custom_order_tables', 
    JAEGER_PLUGIN_FILE, 
    true
);
```

#### CheckoutWC-Kompatibilität
```php
// Checkout für WooCommerce Plugin
if (function_exists('cfw_get_checkout_url')) {
    add_filter('cfw_cart_item_data', 'checkout_wc_item_data');
}
```

### Performance-Einstellungen

#### Asset-Loading-Optimierung
```php
// Conditional Loading
if (is_product() || has_shortcode($post->post_content, 'set_angebot')) {
    wp_enqueue_script('set-angebot-ui');
}
```

#### Cache-Konfiguration
```php
// Transient-Zeiten
$cache_duration = 12 * HOUR_IN_SECONDS; // Produktdaten
$error_retention = 7 * DAY_IN_SECONDS;  // Fehlerlogs
$log_rotation_size = 5 * 1024 * 1024;   // 5MB Log-Rotation
```

## Entwicklungsrichtlinien

### Code-Standards

#### PHP-Standards
- WordPress Coding Standards befolgen
- Alle Eingaben sanitisieren: `sanitize_text_field()`, `absint()`
- Ausgaben escapen: `esc_html()`, `esc_attr()`, `esc_url()`
- Nonce-Verificierung für alle AJAX-Requests

#### JavaScript-Standards
- Strict Mode verwenden: `'use strict';`
- jQuery-Kapselung: `(function($) { ... })(jQuery);`
- Error-Handling für alle AJAX-Requests
- Konsistente Namensgebung: `SetAngebotUI`, `ProductModal`

#### CSS-Standards
- BEM-Methodologie: `.set-angebot__element--modifier`
- Mobile-First-Ansatz
- CSS-Custom-Properties für Themes
- Präfix für Plugin-Klassen: `.jaeger-`

### Debugging und Logging

#### Debug-Aktivierung
```php
// wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

#### Logging-Verwendung
```php
// Plugin-spezifisches Logging
Jaeger_Error_Handler::log_error($message, $level, $context);

// JavaScript-Debugging
if (setAngebotAjax.debug) {
    console.log('Debug-Information:', data);
}
```

#### Log-Dateien
- `wp-content/debug.log` - WordPress-Standardlog
- `wp-content/debug-jaeger-plugin.log` - Plugin-spezifisches Log
- `backend/js/debug.log` - JavaScript-Fehler

### Testing-Strategie

#### PHP-Syntax-Prüfung
```bash
# Einzeldatei prüfen
php -l JaegerPlugin.php

# Alle PHP-Dateien prüfen
find . -name "*.php" -exec php -l {} \;
```

#### WooCommerce-Testing
```bash
# Plugin aktivieren
wp plugin activate jaeger-plugin

# WooCommerce-Integration testen
wp wc product list
wp wc customer list
```

#### Frontend-Testing
- Produktseiten mit verschiedenen Kategorien testen
- Modal-Funktionalität in verschiedenen Themes
- AJAX-Requests mit Browser-Entwicklertools überwachen
- Mobile-Responsiveness prüfen

## Fehlerbehebung

### Häufige Probleme

#### Modal wird nicht angezeigt
```javascript
// CSS-Konflikte prüfen
console.log('Modal display:', $('.set-angebot-modal').css('display'));
console.log('Modal z-index:', $('.set-angebot-modal').css('z-index'));

// Forced Visibility aktivieren
$('.set-angebot-modal').css({
    'display': 'block !important',
    'z-index': '2147483647 !important'
});
```

#### AJAX-Requests schlagen fehl
```php
// Nonce-Probleme debuggen
if (!check_ajax_referer('set_angebot_nonce', 'nonce', false)) {
    error_log('Nonce verification failed: ' . $_POST['nonce']);
}

// Produktdaten validieren
if (!wc_get_product($product_id)) {
    error_log('Product not found: ' . $product_id);
}
```

#### Preisberechnungen inkorrekt
```php
// Debug-Ausgaben aktivieren
error_log('Price calculation debug: ' . json_encode([
    'regular_price' => $regular_price,
    'sale_price' => $sale_price,
    'discount' => $discount_percent
]));
```

### Performance-Probleme

#### Langsame Produktabfragen
```php
// Query-Optimierung
$products = wc_get_products([
    'limit' => 200,
    'return' => 'objects',
    'status' => 'publish',
    'stock_status' => 'instock'
]);

// Cache verwenden
$cache_key = 'products_' . md5(serialize($args));
if (!$data = get_transient($cache_key)) {
    $data = expensive_query();
    set_transient($cache_key, $data, 12 * HOUR_IN_SECONDS);
}
```

#### Große JavaScript-Dateien
```javascript
// Lazy Loading implementieren
if (typeof setAngebotHandler === 'undefined') {
    import('./set-angebot-ui.js').then(module => {
        window.setAngebotHandler = new module.SetAngebotUI();
    });
}
```

### Kompatibilitätsprobleme

#### Theme-Konflikte
```css
/* CSS Specificity erhöhen */
body .set-angebot-modal {
    display: block !important;
}

/* JavaScript-Konflikte isolieren */
(function($) {
    'use strict';
    // Plugin-Code hier
})(jQuery.noConflict());
```

#### Plugin-Konflikte
```php
// Andere Plugins prüfen
if (is_plugin_active('conflicting-plugin/plugin.php')) {
    add_action('init', 'handle_plugin_conflict', 15);
}

// Hook-Prioritäten anpassen
add_action('woocommerce_before_calculate_totals', 'callback', 99);
```

## Wartung und Updates

### Update-Sicherheit

#### Vor Updates prüfen
1. Vollständige Datenbank-Sicherung
2. Plugin-Dateien sichern
3. Test-Environment verwenden
4. WooCommerce-Kompatibilität prüfen

#### Nach Updates testen
1. Frontend-Funktionalität
2. Admin-Bereiche
3. AJAX-Endpunkte
4. Preisberechnungen
5. Warenkorb-Integration

### Monitoring

#### Error-Monitoring
```php
// Stored Errors abrufen
$errors = Jaeger_Error_Handler::get_stored_errors();
foreach ($errors as $error) {
    // Error-Review-Logic
}

// Errors löschen nach Review
Jaeger_Error_Handler::clear_stored_errors();
```

#### Performance-Monitoring
```javascript
// Page Load Time messen
if (performance.timing) {
    const loadTime = performance.timing.loadEventEnd - 
                    performance.timing.navigationStart;
    console.log('Load time:', loadTime + 'ms');
}
```

## Sicherheitsrichtlinien

### Input-Validierung

#### PHP-Sicherheit
```php
// Alle Eingaben validieren
$product_id = absint($_POST['product_id']);
$quantity = floatval($_POST['quantity']);
$text_input = sanitize_text_field($_POST['text']);

// SQL-Injection verhindern
$prepared = $wpdb->prepare("SELECT * FROM table WHERE id = %d", $id);
```

#### JavaScript-Sicherheit
```javascript
// XSS-Schutz
const safeData = {
    id: parseInt(data.id, 10),
    name: $('<div>').text(data.name).html(),
    price: parseFloat(data.price) || 0
};
```

### Nonce-System

#### Nonce-Generierung
```php
// Backend
wp_create_nonce('set_angebot_nonce');

// Frontend-Übertragung
wp_localize_script('script-handle', 'ajaxData', [
    'nonce' => wp_create_nonce('action_name')
]);
```

#### Nonce-Verifikation
```php
// Strenge Verifikation
if (!check_ajax_referer('set_angebot_nonce', 'nonce', false)) {
    wp_send_json_error('Security check failed');
    return;
}
```

### Berechtigungsprüfung

#### Admin-Berechtigungen
```php
// Produkt-Bearbeitung
if (!current_user_can('edit_post', $post_id)) {
    wp_die('Insufficient permissions');
}

// Shop-Management
if (!current_user_can('manage_woocommerce')) {
    return;
}
```

## Erweiterte Konfiguration

### Theme-Integration

#### CSS-Variablen
```css
:root {
    --jaeger-primary-color: #2c5aa0;
    --jaeger-secondary-color: #f8f9fa;
    --jaeger-success-color: #28a745;
    --jaeger-danger-color: #dc3545;
    --jaeger-border-radius: 4px;
}
```

#### Theme-Hooks
```php
// Theme-spezifische Anpassungen
add_action('after_setup_theme', function() {
    // Theme-Support hinzufügen
    add_theme_support('jaeger-plugin');
    
    // Custom-Styles deregistrieren falls gewünscht
    add_action('wp_enqueue_scripts', function() {
        wp_dequeue_style('jaeger-frontend-styles');
    }, 11);
});
```

### Multisite-Unterstützung

#### Network-Aktivierung
```php
// Plugin für gesamtes Netzwerk aktivieren
if (is_multisite()) {
    add_action('network_admin_menu', 'add_network_admin_menu');
}
```

### Lokalisierung

#### Übersetzungen
```php
// Text-Domain laden
load_plugin_textdomain('jaeger-plugin', false, 
    dirname(plugin_basename(__FILE__)) . '/languages');

// Übersetzbare Strings
__('Set-Angebot', 'jaeger-plugin');
_e('Zum Warenkorb hinzufügen', 'jaeger-plugin');
sprintf(__('Sie sparen %s€'), $savings);
```

---

## Wichtige Hinweise für Entwickler

### NIEMALS ändern ohne Backup
- WooCommerce-Hooks
- Preisberechnungslogik  
- Datenbank-Meta-Keys
- AJAX-Security-Nonces

### Immer testen
- Verschiedene WooCommerce-Versionen
- Verschiedene WordPress-Themes
- Mobile und Desktop
- Verschiedene PHP-Versionen

### Performance beachten
- Asset-Loading nur bei Bedarf
- Caching für teure Operationen
- Lazy Loading für JavaScript
- Optimierte Datenbankabfragen

### Security First
- Alle Eingaben validieren
- Alle Ausgaben escapen
- Nonces für AJAX verwenden
- Berechtigungen prüfen

---

Dieses Plugin ist ein komplexes System mit vielen beweglichen Teilen. Bei Änderungen immer systematisch vorgehen und gründlich testen. Die modulare Architektur ermöglicht es, einzelne Komponenten zu erweitern, ohne das gesamte System zu gefährden.
- ok, jetzt verrutsscht nichts mehr, ich bekomme  auch die meldung produkt wurde gewechselt , aber im frontend she ich das alte produkt
- Was jetzt zu tun ist:

  1. Backend PHP erstellen:
    - api-endpoints.php - Die 4 REST API Endpunkte
    - api-product-data.php - Produkt-API mit allen Feldern (scheint laut Doku schon zu existieren?)
    - Integration in jaeger-plugin.php
  2. Frontend API-Client installieren:
    - FRONTEND_API_CLIENT.ts nach src/lib/api/jaegerApi.ts kopieren
  3. Testen:
    - Backend-Endpunkte mit Postman testen
    - Frontend-Integration testen
- next.js 3 nein