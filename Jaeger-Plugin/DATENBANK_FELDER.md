# Jaeger Plugin - Datenbank-Felder Übersicht

**Stand**: 14. November 2025 (aktualisiert 16:30 Uhr)
**Tabelle**: `wp_postmeta` (Custom Product Fields)
**Post Type**: `product` (WooCommerce Produkte)

⚠️ **WICHTIGE ÄNDERUNGEN HEUTE:**
- Set-Angebot ist jetzt **standardmäßig aktiviert** für neue Produkte
- REST API liefert Set-Angebot-Felder auf **Root-Ebene** (nicht nur verschachtelt)
- Zwei neue Scripts verfügbar: `activate-setangebot-all-products.php` und `calculate-all-setangebot-prices.php`

---

## 📋 Inhaltsverzeichnis

1. [Paketinformationen](#paketinformationen)
2. [UVP (Unverbindliche Preisempfehlung)](#uvp-unverbindliche-preisempfehlung)
3. [Produktübersicht & Beschreibung](#produktübersicht--beschreibung)
4. [Set-Angebot Konfiguration](#set-angebot-konfiguration)
5. [Set-Angebot Berechnete Werte](#set-angebot-berechnete-werte)
6. [Zusatzprodukte (Dämmung & Sockelleisten)](#zusatzprodukte-dämmung--sockelleisten)
7. [Aktionen & Badges](#aktionen--badges)
8. [Lieferzeit](#lieferzeit)
9. [WooCommerce Standard-Felder](#woocommerce-standard-felder)
10. [Testing & Debug-Felder](#testing--debug-felder)

---

## 📦 Paketinformationen

### `_paketpreis`
- **Typ**: `DECIMAL(10,2)`
- **Beschreibung**: Regulärer Preis pro Paket/Karton in Euro
- **Beispiel**: `39.99` (= 39,99 €/Paket)
- **Verwendung**: Wird für Mengenberechnungen verwendet
- **Gespeichert in**: `backend/backend-zusatzfelder.php`

### `_paketpreis_s`
- **Typ**: `DECIMAL(10,2)`
- **Beschreibung**: Sonderpreis/Aktionspreis pro Paket in Euro
- **Beispiel**: `34.99` (= 34,99 €/Paket im Angebot)
- **Verwendung**: Angebotspreis, wird im Frontend mit durchgestrichenem Normalpreis angezeigt
- **Optional**: Kann leer sein wenn kein Angebot aktiv
- **Gespeichert in**: `backend/backend-zusatzfelder.php`

### `_paketinhalt`
- **Typ**: `DECIMAL(8,3)`
- **Beschreibung**: Inhalt eines Pakets in m² (Bodenbeläge) oder lfm (Sockelleisten)
- **Beispiel**: `2.500` (= 2,5 m² pro Paket)
- **Verwendung**:
  - Für Berechnung: Anzahl Pakete = (Fläche + Verschnitt) / Paketinhalt
  - Frontend-Anzeige: "2,5 m² pro Paket"
- **Gespeichert in**: `backend/backend-zusatzfelder.php`

### `_einheit`
- **Typ**: `VARCHAR(50)`
- **Beschreibung**: Einheit (ausgeschrieben) des Paketinhalts
- **Beispiel**: `"Quadratmeter"` oder `"Laufmeter"`
- **Verwendung**:
  - Frontend-Anzeige: "2,5 Quadratmeter pro Paket"
  - Vollständige Bezeichnung der Einheit
- **Gespeichert in**: `backend/backend-zusatzfelder.php`

### `_einheit_short`
- **Typ**: `VARCHAR(10)`
- **Beschreibung**: Einheit (Kurzform/Abkürzung) des Paketinhalts
- **Beispiel**: `"m²"` oder `"lfm"` oder `"m"`
- **Verwendung**:
  - Frontend-Anzeige: "34,99 €/m²"
  - Preis-Label
  - Produktkarten
- **Standard**: `"m²"` wenn leer
- **Gespeichert in**: `backend/backend-zusatzfelder.php`

### `_verpackungsart`
- **Typ**: `VARCHAR(50)`
- **Beschreibung**: Verpackungsart (ausgeschrieben)
- **Beispiel**: `"Paket(e)"` oder `"Karton"`
- **Verwendung**: Frontend-Anzeige bei Mengenberechnung
- **Gespeichert in**: `backend/backend-zusatzfelder.php`

### `_verpackungsart_short`
- **Typ**: `VARCHAR(10)`
- **Beschreibung**: Verpackungsart (Kurzform)
- **Beispiel**: `"Pak."` oder `"Krt."`
- **Verwendung**: Kompakte Frontend-Anzeige
- **Gespeichert in**: `backend/backend-zusatzfelder.php`

### `_verschnitt`
- **Typ**: `DECIMAL(5,2)`
- **Beschreibung**: Verschnitt/Verschleiß in Prozent
- **Beispiel**: `10.00` (= 10% Verschnitt)
- **Verwendung**:
  - Bei 25 m² mit 10% Verschnitt = 27,5 m² benötigt
  - Formel: `benötigte_menge = eingabe * (1 + verschnitt/100)`
- **Typische Werte**: 5-15% je nach Verlegemuster
- **Standard**: `5` wenn leer
- **Gespeichert in**: `backend/backend-zusatzfelder.php`

---

## 💰 UVP (Unverbindliche Preisempfehlung)

### `_uvp`
- **Typ**: `DECIMAL(10,2)`
- **Beschreibung**: Unverbindliche Preisempfehlung (UVP) des Herstellers in Euro
- **Beispiel**: `49.99` (= 49,99 €/m²)
- **Verwendung**:
  - Wird als durchgestrichener "Statt-Preis" angezeigt
  - Höchster Preis für Ersparnis-Berechnung im Set-Angebot
  - Nur angezeigt wenn `_show_uvp = 'yes'`
- **Optional**: Kann leer sein
- **Gespeichert in**: `backend/backend-zusatzfelder.php`

### `_show_uvp`
- **Typ**: `VARCHAR(3)`
- **Werte**: `'yes'` oder `'no'`
- **Beschreibung**: Steuert ob UVP im Frontend angezeigt wird
- **Beispiel**: `'yes'` = UVP wird angezeigt
- **Verwendung**:
  - Frontend: Zeigt "statt 49,99 €" an
  - Backend: Toggle-Checkbox
  - Preisberechnung: Verwendet UVP als Basis für Ersparnis wenn aktiv
- **Gespeichert in**: `backend/backend-zusatzfelder.php`

### `_uvp_paketpreis`
- **Typ**: `DECIMAL(10,2)`
- **Beschreibung**: UVP berechnet auf Paketbasis (nicht pro m²)
- **Beispiel**: `124.99` (= 124,99 € pro Paket)
- **Verwendung**: Wird aus `_uvp * _paketinhalt` berechnet
- **Optional**: Kann leer sein
- **Gespeichert in**: `backend/backend-zusatzfelder.php`

---

## 📝 Produktübersicht & Beschreibung

### `_show_text_produktuebersicht`
- **Typ**: `VARCHAR(3)`
- **Werte**: `'yes'` oder `'no'`
- **Beschreibung**: Aktiviert/Deaktiviert die Anzeige eines benutzerdefinierten Textes in der Produktübersicht
- **Beispiel**: `'yes'` = Benutzerdefinierter Text wird angezeigt
- **Verwendung**: Toggle für zusätzliche Produktinformationen in Übersichtsseiten
- **Gespeichert in**: `backend/backend-zusatzfelder.php:51`

### `_text_produktuebersicht`
- **Typ**: `TEXT`
- **Beschreibung**: Benutzerdefinierter Text für die Produktübersicht
- **Beispiel**: `"Neu eingetroffen!"` oder `"Limitierte Auflage"`
- **Verwendung**:
  - Zusätzliche Informationen in Produktlisten
  - Spezielle Hinweise für Kunden
  - Kann HTML enthalten
- **Optional**: Nur angezeigt wenn `_show_text_produktuebersicht = 'yes'`
- **Gespeichert in**: `backend/backend-zusatzfelder.php:72`

### `_artikelbeschreibung`
- **Typ**: `TEXT` (WYSIWYG Editor)
- **Beschreibung**: Erweiterte Produktbeschreibung
- **Beispiel**: HTML-formatierter Text mit Produktdetails
- **Verwendung**:
  - Detaillierte Produktinformationen
  - Technische Spezifikationen
  - Anwendungshinweise
  - Unterstützt vollständiges HTML
- **Gespeichert in**: `backend/backend-zusatzfelder.php:80`

---

## ⚙️ Set-Angebot Konfiguration

### `_show_setangebot`
- **Typ**: `VARCHAR(3)`
- **Werte**: `'yes'` oder `'no'`
- **Beschreibung**: Aktiviert/Deaktiviert das Set-Angebot für dieses Produkt
- **Beispiel**: `'yes'` = Set-Angebot wird angezeigt
- **Default**: `'yes'` ⭐ **NEU: Standardmäßig aktiviert seit heute!**
- **Verwendung**:
  - Steuert ob Bundle-Option im Frontend verfügbar ist
  - Nur wenn 'yes': Dämmung + Sockelleisten werden angeboten
  - Bei neuen Produkten automatisch auf 'yes' gesetzt
- **Gespeichert in**: `backend/backend-setangebot.php:450`
- **Bulk-Aktivierung**: Verwende `activate-setangebot-all-products.php` um für alle existierenden Produkte zu aktivieren

### `_setangebot_titel`
- **Typ**: `VARCHAR(255)`
- **Beschreibung**: Anzeige-Titel für das Set-Angebot
- **Beispiel**: `"Komplett-Set"` oder `"Spar-Bundle"`
- **Default**: `"Komplett-Set"`
- **Verwendung**: Frontend-Überschrift für Set-Angebot Box
- **Gespeichert in**: `backend/backend-setangebot.php:454`

### `_setangebot_text_color`
- **Typ**: `VARCHAR(50)`
- **Beschreibung**: CSS-Klasse für Textfarbe im Set-Angebot
- **Beispiel**: `"text-primary"`, `"text-success"`, `"text-danger"`
- **Verwendung**: Styling der Set-Angebot Komponente
- **Optional**: Kann leer sein (dann Standard-Theme-Farbe)
- **Gespeichert in**: `backend/backend-setangebot.php:459`

### `_setangebot_text_size`
- **Typ**: `VARCHAR(50)`
- **Beschreibung**: CSS-Klasse für Textgröße
- **Beispiel**: `"text-lg"`, `"text-xl"`, `"text-sm"`
- **Verwendung**: Größe der Set-Angebot Preisanzeige
- **Optional**: Kann leer sein (dann Standard-Größe)
- **Gespeichert in**: `backend/backend-setangebot.php:463`

### `_setangebot_button_style`
- **Typ**: `VARCHAR(50)`
- **Beschreibung**: CSS-Klasse für Button-Styling
- **Beispiel**: `"btn-primary"`, `"btn-success"`, `"btn-outline"`
- **Verwendung**: Styling des "In den Warenkorb" Buttons
- **Optional**: Kann leer sein (dann Standard-Button)
- **Gespeichert in**: `backend/backend-setangebot.php:467`

### `_setangebot_rabatt`
- **Typ**: `DECIMAL(5,2)`
- **Beschreibung**: Zusätzlicher Rabatt in Prozent für das Set-Angebot
- **Beispiel**: `5.00` (= 5% zusätzlicher Rabatt)
- **Verwendung**:
  - Wird auf den Sale-Preis angewendet (nicht auf Regular!)
  - Formel: `set_preis = sale_preis * (1 - rabatt/100)`
  - Optional: Kann 0 sein (dann nur Sale-Preis ohne Extra-Rabatt)
- **Range**: 0-100
- **Gespeichert in**: `backend/backend-setangebot.php:474`

---

## 🧮 Set-Angebot Berechnete Werte

**Wichtig**: Diese Werte werden **automatisch beim Speichern** des Produkts berechnet!

### `_setangebot_einzelpreis`
- **Typ**: `DECIMAL(10,2)`
- **Beschreibung**: Berechneter Einzelpreis = Summe aller Einzelkomponenten
- **Berechnung**:
  ```php
  $einzelpreis = $highest_price + $daemmung_price + $sockelleisten_price;
  ```
  - `$highest_price` = UVP (wenn aktiv) oder Regular Price
  - Plus Dämmung Einzelpreis
  - Plus Sockelleiste Einzelpreis
- **Beispiel**: `45.99` (= 45,99 €/m²)
- **Verwendung**:
  - "Statt-Preis" im Set-Angebot
  - Basis für Ersparnis-Berechnung
- **Gespeichert in**: `backend/backend-setangebot.php:544`
- **Berechnet in**: `jaeger_save_setangebot_fields()` beim Produkt-Speichern

### `_setangebot_gesamtpreis`
- **Typ**: `DECIMAL(10,2)`
- **Beschreibung**: Berechneter Set-Gesamtpreis (mit Rabatt)
- **Berechnung**:
  ```php
  $gesamtpreis = $lowest_price * (1 - ($rabatt / 100));
  ```
  - `$lowest_price` = Sale Price (wenn vorhanden) oder Regular Price
  - Zusatzprodukte sind im Set KOSTENLOS enthalten!
  - Optional: Minus zusätzlicher Rabatt
- **Beispiel**: `39.99` (= 39,99 €/m²)
- **Verwendung**:
  - Aktiver Preis im Set-Angebot
  - "Nur XX,XX €/m² im Set"
- **Gespeichert in**: `backend/backend-setangebot.php:545`
- **Berechnet in**: `jaeger_save_setangebot_fields()` beim Produkt-Speichern

### `_setangebot_ersparnis_euro`
- **Typ**: `DECIMAL(10,2)`
- **Beschreibung**: Berechnete Ersparnis in Euro
- **Berechnung**:
  ```php
  $ersparnis_euro = $einzelpreis - $gesamtpreis;
  ```
- **Beispiel**: `6.00` (= 6,00 € Ersparnis)
- **Verwendung**:
  - Frontend-Anzeige: "Sie sparen 6,00 €"
  - Badge mit Ersparnis
- **Gespeichert in**: `backend/backend-setangebot.php:546`
- **Berechnet in**: `jaeger_save_setangebot_fields()` beim Produkt-Speichern

### `_setangebot_ersparnis_prozent`
- **Typ**: `DECIMAL(5,2)`
- **Beschreibung**: Berechnete Ersparnis in Prozent
- **Berechnung**:
  ```php
  $ersparnis_prozent = ($einzelpreis > 0)
      ? ($ersparnis_euro / $einzelpreis * 100)
      : 0;
  ```
- **Beispiel**: `13.04` (= 13,04% Ersparnis)
- **Verwendung**:
  - Frontend-Anzeige: "-13%"
  - Rabatt-Badge
  - Sortierung nach Ersparnis
- **Gespeichert in**: `backend/backend-setangebot.php:547`
- **Berechnet in**: `jaeger_save_setangebot_fields()` beim Produkt-Speichern

---

## 🔧 Zusatzprodukte (Dämmung & Sockelleisten)

### `_standard_addition_daemmung`
- **Typ**: `INT(11)`
- **Beschreibung**: Produkt-ID der Standard-Dämmung für dieses Produkt
- **Beispiel**: `10234` (WooCommerce Product ID)
- **Verwendung**:
  - Wird automatisch im Set-Angebot vorausgewählt
  - User kann andere Dämmung aus Option-Liste wählen
  - Wird in Preisberechnung einbezogen
- **Kategorie**: Produkte aus Kategorie "daemmung"
- **Gespeichert in**: WooCommerce Custom Fields (automatisch)

### `_option_products_daemmung`
- **Typ**: `TEXT` (kommagetrennte IDs)
- **Beschreibung**: Liste der wählbaren Dämmungs-Produkte
- **Beispiel**: `"10234,10235,10236"` (Product IDs)
- **Verwendung**:
  - Dropdown im Frontend: "Dämmung wählen"
  - User kann zwischen diesen Optionen wechseln
  - Modal mit Produktkarten
- **Format**: Kommagetrennte Product IDs
- **Gespeichert in**: WooCommerce Custom Fields (automatisch)

### `_standard_addition_sockelleisten`
- **Typ**: `INT(11)`
- **Beschreibung**: Produkt-ID der Standard-Sockelleiste für dieses Produkt
- **Beispiel**: `10567` (WooCommerce Product ID)
- **Verwendung**:
  - Wird automatisch im Set-Angebot vorausgewählt
  - User kann andere Sockelleiste aus Option-Liste wählen
  - Wird in Preisberechnung einbezogen
  - **Besonderheit**: Menge wird anders berechnet (Raumgröße → Umfang)
- **Kategorie**: Produkte aus Kategorie "sockelleisten"
- **Gespeichert in**: WooCommerce Custom Fields (automatisch)

### `_option_products_sockelleisten`
- **Typ**: `TEXT` (kommagetrennte IDs)
- **Beschreibung**: Liste der wählbaren Sockelleisten-Produkte
- **Beispiel**: `"10567,10568,10569"` (Product IDs)
- **Verwendung**:
  - Dropdown im Frontend: "Sockelleiste wählen"
  - User kann zwischen diesen Optionen wechseln
  - Modal mit Produktkarten
- **Format**: Kommagetrennte Product IDs
- **Gespeichert in**: WooCommerce Custom Fields (automatisch)

---

## 🏷️ Aktionen & Badges

**Beschreibung**: System für Produkt-Aktionen und Angebotskennzeichnungen

### `_show_aktion`
- **Typ**: `VARCHAR(3)`
- **Werte**: `'yes'` oder `'no'`
- **Beschreibung**: Aktiviert/Deaktiviert die Anzeige eines Aktions-Badges
- **Beispiel**: `'yes'` = Aktions-Badge wird angezeigt
- **Verwendung**:
  - Badge für Sonderaktionen (z.B. "Restposten")
  - Produkt-Highlights
  - Aufmerksamkeits-Label
- **Gespeichert in**: `backend/backend-aktionen.php:83`

### `_aktion`
- **Typ**: `VARCHAR(255)`
- **Beschreibung**: Text für den Aktions-Badge
- **Beispiel**: `"Restposten"`, `"Neu"`, `"Bestseller"`
- **Default**: `"Restposten"`
- **Verwendung**: Text im Badge auf Produktkachel
- **Gespeichert in**: `backend/backend-aktionen.php:91`

### `_aktion_text_color`
- **Typ**: `VARCHAR(50)`
- **Beschreibung**: CSS-Klasse für Textfarbe des Aktions-Badges
- **Beispiel**: `"text-danger"`, `"text-warning"`, `"text-info"`
- **Verwendung**: Farbliches Styling des Badges
- **Optional**: Standard-Theme-Farbe wenn leer
- **Gespeichert in**: `backend/backend-aktionen.php:103`

### `_aktion_text_size`
- **Typ**: `VARCHAR(50)`
- **Beschreibung**: CSS-Klasse für Textgröße des Aktions-Badges
- **Beispiel**: `"text-sm"`, `"text-md"`, `"text-lg"`
- **Verwendung**: Größe des Badge-Textes
- **Optional**: Standard-Größe wenn leer
- **Gespeichert in**: `backend/backend-aktionen.php:112`

### `_aktion_button_style`
- **Typ**: `VARCHAR(50)`
- **Beschreibung**: CSS-Klasse für Button-Styling des Aktions-Badges
- **Beispiel**: `"btn-danger"`, `"btn-warning"`, `"badge-pill"`
- **Verwendung**: Vollständiges Button/Badge-Styling
- **Optional**: Standard-Button wenn leer
- **Gespeichert in**: `backend/backend-aktionen.php:121`

---

### `_show_angebotspreis_hinweis`
- **Typ**: `VARCHAR(3)`
- **Werte**: `'yes'` oder `'no'`
- **Beschreibung**: Aktiviert/Deaktiviert die Anzeige eines Angebots-Hinweis-Badges
- **Beispiel**: `'yes'` = Angebots-Badge wird angezeigt
- **Verwendung**:
  - Badge für Sonderangebote (z.B. "Black Sale")
  - Sale-Kennzeichnung
  - Rabatt-Aktionen
- **Gespeichert in**: `backend/backend-aktionen.php:135`

### `_angebotspreis_hinweis`
- **Typ**: `VARCHAR(255)`
- **Beschreibung**: Text für den Angebots-Hinweis-Badge
- **Beispiel**: `"Black Sale"`, `"Summer Sale"`, `"20% Rabatt"`
- **Default**: `"Black Sale"`
- **Verwendung**: Text im Angebots-Badge auf Produktkachel
- **Gespeichert in**: `backend/backend-aktionen.php:143`

### `_angebotspreis_text_color`
- **Typ**: `VARCHAR(50)`
- **Beschreibung**: CSS-Klasse für Textfarbe des Angebots-Badges
- **Beispiel**: `"text-success"`, `"text-danger"`, `"text-primary"`
- **Verwendung**: Farbliches Styling des Angebots-Badges
- **Optional**: Standard-Theme-Farbe wenn leer
- **Gespeichert in**: `backend/backend-aktionen.php:155`

### `_angebotspreis_text_size`
- **Typ**: `VARCHAR(50)`
- **Beschreibung**: CSS-Klasse für Textgröße des Angebots-Badges
- **Beispiel**: `"text-sm"`, `"text-md"`, `"text-lg"`
- **Verwendung**: Größe des Angebots-Badge-Textes
- **Optional**: Standard-Größe wenn leer
- **Gespeichert in**: `backend/backend-aktionen.php:164`

### `_angebotspreis_button_style`
- **Typ**: `VARCHAR(50)`
- **Beschreibung**: CSS-Klasse für Button-Styling des Angebots-Badges
- **Beispiel**: `"btn-success"`, `"btn-outline-danger"`, `"badge-pill"`
- **Verwendung**: Vollständiges Button/Badge-Styling für Angebote
- **Optional**: Standard-Button wenn leer
- **Gespeichert in**: `backend/backend-aktionen.php:173`

---

## 📅 Lieferzeit

### `_show_lieferzeit`
- **Typ**: `VARCHAR(3)`
- **Werte**: `'yes'` oder `'no'`
- **Beschreibung**: Aktiviert/Deaktiviert die Lieferzeit-Anzeige
- **Beispiel**: `'yes'` = Lieferzeit wird angezeigt
- **Verwendung**: Toggle für Frontend-Anzeige
- **Gespeichert in**: `backend/backend-zusatzfelder.php`

### `_lieferzeit`
- **Typ**: `VARCHAR(255)`
- **Beschreibung**: Lieferzeit als Text
- **Beispiel**: `"2-3 Werktage"` oder `"Sofort lieferbar"`
- **Verwendung**:
  - Frontend-Anzeige auf Produktseite
  - Kann HTML enthalten
- **Optional**: Nur angezeigt wenn `_show_lieferzeit = 'yes'`
- **Gespeichert in**: `backend/backend-zusatzfelder.php`

---

## 🛒 WooCommerce Standard-Felder

Diese Felder werden von WooCommerce selbst verwaltet, sind aber wichtig für das Plugin:

### `_regular_price`
- **Typ**: `DECIMAL(10,2)`
- **Beschreibung**: Regulärer Verkaufspreis (WooCommerce Standard)
- **Beispiel**: `42.99`
- **Verwendung**:
  - Basis-Preis ohne Rabatt
  - Fallback wenn kein Sale-Price vorhanden
  - Wird in Set-Angebot Berechnung verwendet
- **Zugriff**: `$product->get_regular_price()`

### `_sale_price`
- **Typ**: `DECIMAL(10,2)`
- **Beschreibung**: Aktionspreis (WooCommerce Standard)
- **Beispiel**: `39.99`
- **Verwendung**:
  - Angebotspreis
  - Wird als Basis für Set-Preis verwendet
  - Nur aktiv wenn innerhalb von Sale-Datum-Range
- **Optional**: Kann leer sein
- **Zugriff**: `$product->get_sale_price()`

### `_sale_price_dates_from`
- **Typ**: `TIMESTAMP`
- **Beschreibung**: Start-Datum des Angebots
- **Beispiel**: `2025-11-01 00:00:00`
- **Verwendung**: Sale-Price ist nur zwischen From und To aktiv
- **Zugriff**: `$product->get_date_on_sale_from()`

### `_sale_price_dates_to`
- **Typ**: `TIMESTAMP`
- **Beschreibung**: End-Datum des Angebots
- **Beispiel**: `2025-11-30 23:59:59`
- **Verwendung**: Sale-Price ist nur zwischen From und To aktiv
- **Zugriff**: `$product->get_date_on_sale_to()`

### `_price`
- **Typ**: `DECIMAL(10,2)`
- **Beschreibung**: Aktiver Preis (automatisch berechnet von WooCommerce)
- **Berechnung**:
  - Wenn Sale aktiv: `_price = _sale_price`
  - Sonst: `_price = _regular_price`
- **Verwendung**: Der tatsächlich angezeigte Preis
- **Zugriff**: `$product->get_price()`

---

## 🗄️ Warenkorb-Metadaten

Diese Felder werden im Warenkorb gespeichert (nicht in `wp_postmeta`):

### Bundle-Meta-Keys
Wenn ein Set-Angebot in den Warenkorb gelegt wird:

```php
'jaeger_set_bundle_id'           // Eindeutige Bundle-ID (Timestamp)
'jaeger_set_type'                // 'main' | 'daemmung' | 'sockelleisten'
'jaeger_set_quadratmeter'        // Fläche in m²
'jaeger_set_pakete'              // Anzahl Pakete
'jaeger_set_price_per_unit'      // Set-Preis pro m²
'jaeger_set_original_price'      // Original Einzelpreis
'jaeger_set_discount_percent'    // Rabatt in %
```

---

## 📊 Beispiel-Datensatz

Vollständiges Produkt mit allen Feldern:

```php
// Produkt: "Velando Rustic Oak Laminat"
post_id = 10485

// Paketinformationen
_paketpreis = 42.99                      // 42,99 € regulär
_paketpreis_s = 39.99                    // 39,99 € im Angebot
_paketinhalt = 2.500                     // 2,5 m² pro Paket
_einheit = 'Quadratmeter'                // Einheit ausgeschrieben
_einheit_short = 'm²'                    // Einheit Kurzform
_verpackungsart = 'Paket(e)'             // Verpackungsart
_verpackungsart_short = 'Pak.'           // Verpackungsart Kurzform
_verschnitt = 10.00                      // 10% Verschnitt

// UVP
_uvp = 49.99                             // 49,99 € UVP
_show_uvp = 'yes'                        // UVP anzeigen
_uvp_paketpreis = 124.98                 // 49.99 * 2.5

// Produktbeschreibung
_show_text_produktuebersicht = 'yes'     // Übersichtstext anzeigen
_text_produktuebersicht = 'Neu eingetroffen!' // Übersichtstext
_artikelbeschreibung = '<p>Detaillierte Beschreibung...</p>' // WYSIWYG Content

// Set-Angebot Konfiguration
_show_setangebot = 'yes'                 // Set-Angebot aktiv
_setangebot_titel = 'Komplett-Set'      // Titel
_setangebot_text_color = 'text-success' // Grüne Farbe
_setangebot_text_size = 'text-lg'       // Große Schrift
_setangebot_button_style = 'btn-primary'// Primärer Button
_setangebot_rabatt = 5.00                // 5% Extra-Rabatt

// Set-Angebot Berechnungen (automatisch)
_setangebot_einzelpreis = 56.99          // UVP + Dämmung + Sockelleiste
_setangebot_gesamtpreis = 37.99          // Sale-Preis minus 5% Rabatt
_setangebot_ersparnis_euro = 19.00       // 19,00 € gespart
_setangebot_ersparnis_prozent = 33.33    // 33,33% Ersparnis

// Zusatzprodukte
_standard_addition_daemmung = 10234      // Standard Dämmung ID
_option_products_daemmung = '10234,10235,10236' // Wählbare Dämmungen
_standard_addition_sockelleisten = 10567 // Standard Sockelleiste ID
_option_products_sockelleisten = '10567,10568' // Wählbare Sockelleisten

// Aktionen & Badges
_show_aktion = 'yes'                     // Aktion anzeigen
_aktion = 'Restposten'                   // Aktions-Text
_aktion_text_color = 'text-danger'       // Rote Farbe
_aktion_text_size = 'text-md'            // Mittlere Größe
_aktion_button_style = 'btn-danger'      // Roter Button

_show_angebotspreis_hinweis = 'yes'      // Angebots-Badge anzeigen
_angebotspreis_hinweis = 'Black Sale'    // Badge-Text
_angebotspreis_text_color = 'text-success' // Grüne Farbe
_angebotspreis_text_size = 'text-lg'     // Große Schrift
_angebotspreis_button_style = 'btn-success' // Grüner Button

// Lieferzeit
_show_lieferzeit = 'yes'                 // Lieferzeit anzeigen
_lieferzeit = '2-3 Werktage'             // Lieferzeit-Text

// Testing
_testdummy = ''                          // Nicht verwendet im Produktivbetrieb

// WooCommerce Standard
_regular_price = 42.99                   // Regulärer Preis
_sale_price = 39.99                      // Sale-Preis
_price = 39.99                           // Aktiver Preis (= Sale)
_sale_price_dates_from = '2025-11-01 00:00:00'
_sale_price_dates_to = '2025-11-30 23:59:59'
```

---

## 🔍 SQL-Abfragen für Testing

### Alle Set-Angebot Felder für ein Produkt anzeigen:

```sql
SELECT
    meta_key,
    meta_value
FROM wp_postmeta
WHERE post_id = 10485
    AND meta_key LIKE '%setangebot%'
ORDER BY meta_key;
```

### Alle Produkte mit aktivem Set-Angebot:

```sql
SELECT
    p.ID,
    p.post_title,
    pm.meta_value as show_setangebot
FROM wp_posts p
INNER JOIN wp_postmeta pm ON p.ID = pm.post_id
WHERE p.post_type = 'product'
    AND pm.meta_key = '_show_setangebot'
    AND pm.meta_value = 'yes'
ORDER BY p.post_title;
```

### Produkte mit höchster Ersparnis:

```sql
SELECT
    p.ID,
    p.post_title,
    pm1.meta_value as ersparnis_prozent,
    pm2.meta_value as ersparnis_euro
FROM wp_posts p
INNER JOIN wp_postmeta pm1 ON p.ID = pm1.post_id AND pm1.meta_key = '_setangebot_ersparnis_prozent'
INNER JOIN wp_postmeta pm2 ON p.ID = pm2.post_id AND pm2.meta_key = '_setangebot_ersparnis_euro'
WHERE p.post_type = 'product'
ORDER BY CAST(pm1.meta_value AS DECIMAL(5,2)) DESC
LIMIT 10;
```

### Prüfen ob Werte gespeichert sind (NULL-Check):

```sql
SELECT
    post_id,
    COUNT(*) as felder_gesetzt,
    SUM(CASE WHEN meta_value IS NULL OR meta_value = '' THEN 1 ELSE 0 END) as felder_leer
FROM wp_postmeta
WHERE post_id = 10485
    AND meta_key IN (
        '_setangebot_einzelpreis',
        '_setangebot_gesamtpreis',
        '_setangebot_ersparnis_euro',
        '_setangebot_ersparnis_prozent'
    )
GROUP BY post_id;
```

**Erwartetes Ergebnis**: `felder_gesetzt = 4`, `felder_leer = 0`

---

## 🔄 Datenfluss beim Speichern

### Wann werden die Felder gespeichert?

1. **User bearbeitet Produkt im WordPress Backend**
2. **User klickt "Aktualisieren" oder "Veröffentlichen"**
3. **WordPress Hook**: `woocommerce_process_product_meta` wird gefeuert
4. **Plugin-Funktion**: `jaeger_save_setangebot_fields()` wird ausgeführt
5. **Schritte**:
   - Manuelle Eingaben werden gespeichert (Titel, Rabatt, etc.)
   - Zusatzprodukt-IDs werden aus POST-Request geladen
   - Preise werden berechnet
   - **Berechnete Werte werden in DB geschrieben**
6. **Debug-Log**: Entry mit Berechnungsergebnis

### Hook-Priorität:
```php
add_action('woocommerce_process_product_meta', 'jaeger_save_setangebot_fields');
```

Läuft **nach** WooCommerce Standard-Feldern, damit `_regular_price` und `_sale_price` bereits gespeichert sind!

---

## 📝 Wichtige Hinweise

### Datentypen beachten:
- Preise immer mit 2 Dezimalstellen: `DECIMAL(10,2)`
- Prozente mit 2 Dezimalstellen: `DECIMAL(5,2)`
- IDs als Integer: `INT(11)`
- Ja/Nein als: `VARCHAR(3)` mit Werten `'yes'` / `'no'`

### NULL vs. 0 vs. '':
- **NULL**: Wert wurde noch nie gespeichert
- **0 / 0.00**: Wert ist explizit Null (z.B. kein Rabatt)
- **''** (leerer String): Feld ist leer (bei Text-Feldern)

### Sanitization:
```php
// Beim Speichern IMMER sanitizen:
$text = sanitize_text_field($_POST['field']);
$number = floatval($_POST['field']);
$id = absint($_POST['field']);
```

### Getter/Setter für WooCommerce-Felder:
```php
// ❌ FALSCH (deprecated):
$price = $product->get_meta('_sale_price');
update_post_meta($id, '_sale_price', $price);

// ✅ RICHTIG:
$price = $product->get_sale_price();
$product->set_sale_price($price);
$product->save();
```

---

## 🆘 Troubleshooting

### Werte sind NULL in Datenbank:
1. Produkt im Backend öffnen
2. "Aktualisieren" klicken (auch ohne Änderung)
3. Debug-Log prüfen: `debug-jaeger-plugin.log`
4. Sollte Entry sehen: `"SAVE SETANGEBOT - Product 10485: ..."`

### Werte werden nicht berechnet:
1. Prüfen: Sind Zusatzprodukte zugewiesen?
2. Prüfen: Haben Zusatzprodukte Preise?
3. Prüfen: Hat Hauptprodukt `_regular_price`?
4. Debug-Log checken auf Fehler

### Falsche Berechnungen:
1. UVP Check: Ist `_show_uvp = 'yes'` und `_uvp` gesetzt?
2. Sale Check: Ist Sale-Datum aktiv?
3. Rabatt Check: Ist `_setangebot_rabatt` korrekt?
4. Debug in `backend-setangebot.php:550` aktivieren

---

## 🌐 REST API Zugriff (Next.js Frontend)

### API-Endpoint
```
GET /wp-json/jaeger/v1/products/{id}
```

### Beispiel-Response
```json
{
  "id": 1134,
  "name": "Rigid-Vinyl Eiche Newstead",
  "prices": {
    "price": "34.99",
    "regular_price": "42.95",
    "sale_price": "34.99"
  },

  // Set-Angebot Felder auf Root-Ebene (NEU!)
  "setangebot_einzelpreis": 47.95,
  "setangebot_gesamtpreis": 34.99,
  "setangebot_ersparnis_euro": 12.96,
  "setangebot_ersparnis_prozent": 27.028154327424,
  "setangebot_titel": "Komplett-Set",
  "setangebot_rabatt": 0,

  // Zusatzprodukt-IDs auf Root-Ebene (NEU!)
  "daemmung_id": null,
  "sockelleisten_id": 1605,
  "daemmung_option_ids": [],
  "sockelleisten_option_ids": [1605, 1592, 1258, ...],

  // Zusätzlich auch verschachtelt in jaeger_fields
  "jaeger_fields": {
    "setangebot": {
      "einzelpreis": 47.95,
      "gesamtpreis": 34.99,
      ...
    }
  }
}
```

### Wichtige Änderungen heute (14.11.2025):
- ✅ **Set-Angebot-Felder auf Root-Ebene** - Direkt zugänglich ohne Verschachtelung
- ✅ **Zusatzprodukt-IDs auf Root-Ebene** - `daemmung_id` und `sockelleisten_id` direkt verfügbar
- ✅ **FATAL ERROR behoben** - `get_product_url()` nur für External Products
- ✅ **Alle Werte werden gespeichert** - Serverseitige Berechnung beim Speichern

### Verwendung im Next.js Frontend
```typescript
// TypeScript Interface
interface ProductData {
  id: number;
  name: string;
  setangebot_einzelpreis: number;
  setangebot_gesamtpreis: number;
  setangebot_ersparnis_euro: number;
  setangebot_ersparnis_prozent: number;
  daemmung_id: number | null;
  sockelleisten_id: number | null;
  daemmung_option_ids: number[];
  sockelleisten_option_ids: number[];
}

// API Call
const response = await fetch('/wp-json/jaeger/v1/products/1134');
const product: ProductData = await response.json();

console.log(product.setangebot_einzelpreis); // 47.95 ✅
```

---

## 🛠️ Bulk-Operations Scripts

### Script 1: Set-Angebot für alle Produkte aktivieren
**Datei**: `activate-setangebot-all-products.php`

**Verwendung**:
1. In WordPress Root-Verzeichnis hochladen
2. Im Browser aufrufen: `https://deine-domain.de/activate-setangebot-all-products.php`
3. Zeigt Live-Progress für jedes Produkt
4. Nach Ausführung löschen!

**Was es tut**:
- Setzt `_show_setangebot = 'yes'` für alle Produkte
- Zeigt bereits aktive Produkte
- Zählt aktivierte, bereits aktive und Fehler

### Script 2: Preise für alle Produkte berechnen
**Datei**: `calculate-all-setangebot-prices.php`

**Verwendung**:
1. NACH Script 1 ausführen!
2. In WordPress Root-Verzeichnis hochladen
3. Im Browser aufrufen: `https://deine-domain.de/calculate-all-setangebot-prices.php`
4. Kann mehrere Minuten dauern bei vielen Produkten
5. Nach Ausführung löschen!

**Was es tut**:
- Lädt alle Produkte mit `_show_setangebot = 'yes'`
- Berechnet für jedes Produkt:
  - Einzelpreis
  - Set-Preis (mit Rabatt)
  - Ersparnis in € und %
- Speichert Werte in Datenbank
- Zeigt Live-Progress mit Details

**Wichtig**:
- Timeout ist auf 5 Minuten gesetzt
- Zeigt alle 10 Produkte einen Flush für Browser-Output
- Admin-Berechtigung erforderlich

---

## 🧪 Testing & Debug-Felder

### `_testdummy`
- **Typ**: `VARCHAR(255)`
- **Beschreibung**: Test-Feld für Entwicklungszwecke
- **Beispiel**: `"test"` oder beliebiger Test-Text
- **Verwendung**:
  - Nur für Entwickler
  - Testing von Custom-Field-Funktionalität
  - Kann ignoriert werden im Produktivbetrieb
- **Gespeichert in**: `backend/backend-zusatzfelder.php:44`

---

## 📊 Komplette Feldliste (Alphabetisch)

Alle 40+ Custom Fields des Jaeger Plugins:

**Aktionen & Badges (10 Felder)**
- `_aktion`
- `_aktion_button_style`
- `_aktion_text_color`
- `_aktion_text_size`
- `_angebotspreis_button_style`
- `_angebotspreis_hinweis`
- `_angebotspreis_text_color`
- `_angebotspreis_text_size`
- `_show_aktion`
- `_show_angebotspreis_hinweis`

**Paketinformationen (7 Felder)**
- `_einheit`
- `_einheit_short`
- `_paketinhalt`
- `_paketpreis`
- `_paketpreis_s`
- `_verpackungsart`
- `_verpackungsart_short`
- `_verschnitt`

**Produktbeschreibung (3 Felder)**
- `_artikelbeschreibung`
- `_show_text_produktuebersicht`
- `_text_produktuebersicht`

**Set-Angebot (10 Felder)**
- `_setangebot_button_style`
- `_setangebot_einzelpreis`
- `_setangebot_ersparnis_euro`
- `_setangebot_ersparnis_prozent`
- `_setangebot_gesamtpreis`
- `_setangebot_rabatt`
- `_setangebot_text_color`
- `_setangebot_text_size`
- `_setangebot_titel`
- `_show_setangebot`

**Zusatzprodukte (4 Felder)**
- `_option_products_daemmung`
- `_option_products_sockelleisten`
- `_standard_addition_daemmung`
- `_standard_addition_sockelleisten`

**UVP (3 Felder)**
- `_show_uvp`
- `_uvp`
- `_uvp_paketpreis`

**Lieferzeit (2 Felder)**
- `_lieferzeit`
- `_show_lieferzeit`

**Testing (1 Feld)**
- `_testdummy`

**Gesamt: 40 Custom Fields**

---

**Letzte Aktualisierung**: 14. November 2025, 18:00 Uhr
**Vollständigkeit**: ✅ ALLE Felder aus allen Backend-Dateien dokumentiert
