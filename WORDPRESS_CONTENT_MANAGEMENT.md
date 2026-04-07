# WordPress & Next.js Content Management Guide

**Projekt**: Bodenjäger — Headless E-Commerce Shop
**Backend**: WordPress + WooCommerce + Jäger Plugin (`2025.bodenjaeger.de`)
**Frontend**: Next.js 15 (Vercel: `bodenjaeger.vercel.app`)

---

## Inhaltsverzeichnis

1. [Architektur-Überblick](#1-architektur-überblick)
2. [Was wird wo gepflegt?](#2-was-wird-wo-gepflegt)
3. [Produkte anlegen & verwalten (WooCommerce)](#3-produkte-anlegen--verwalten-woocommerce)
4. [Set-Angebot System (Bundle-Konfiguration)](#4-set-angebot-system-bundle-konfiguration)
5. [Kategorien verwalten](#5-kategorien-verwalten)
6. [Sale & Aktionen steuern](#6-sale--aktionen-steuern)
7. [Rechtliche Seiten (WordPress Pages)](#7-rechtliche-seiten-wordpress-pages)
8. [Blog-Beiträge](#8-blog-beiträge)
9. [Bilder & Medien](#9-bilder--medien)
10. [Cache & Aktualisierung](#10-cache--aktualisierung)
11. [Hardcoded Inhalte (nur per Code änderbar)](#11-hardcoded-inhalte-nur-per-code-änderbar)
12. [API-Endpunkte Referenz](#12-api-endpunkte-referenz)
13. [Alle 41 Jäger-Plugin Felder](#13-alle-41-jäger-plugin-felder)
14. [Bestellungen & Zahlungen](#14-bestellungen--zahlungen)
15. [Kundenkonto & Authentifizierung](#15-kundenkonto--authentifizierung)

---

## 1. Architektur-Überblick

```
┌─────────────────────────┐         ┌──────────────────────────┐
│   WordPress Backend     │         │   Next.js Frontend       │
│   2025.bodenjaeger.de   │◄────────│   bodenjaeger.vercel.app │
│                         │         │                          │
│  ┌───────────────────┐  │  APIs   │  ┌────────────────────┐  │
│  │ WooCommerce       │──┼────────►│  │ Produktseiten      │  │
│  │ + Jäger Plugin    │  │         │  │ Kategorie-Seiten   │  │
│  └───────────────────┘  │         │  │ Warenkorb/Checkout  │  │
│  ┌───────────────────┐  │         │  └────────────────────┘  │
│  │ WordPress Pages   │──┼────────►│  ┌────────────────────┐  │
│  │ (Rechtstexte)     │  │         │  │ AGB, Datenschutz,  │  │
│  └───────────────────┘  │         │  │ Impressum, etc.    │  │
│  ┌───────────────────┐  │         │  └────────────────────┘  │
│  │ Medien-Bibliothek │──┼────────►│  Bilder (next/image)    │
│  └───────────────────┘  │         │                          │
└─────────────────────────┘         └──────────────────────────┘
```

### Drei APIs im Einsatz

| API | Basis-URL | Zweck |
|-----|-----------|-------|
| **Jäger API** | `/wp-json/jaeger/v1/products` | Produktdaten + 41 Custom Fields (Hauptquelle) |
| **WooCommerce REST API v3** | `/wp-json/wc/v3/` | Bestellungen, Kunden, Produktbeschreibungen |
| **WordPress REST API v2** | `/wp-json/wp/v2/` | Seiten (AGB, Impressum etc.), Blog-Beiträge |

### Authentifizierung

- **Jäger API & WooCommerce REST API**: HTTP Basic Auth mit `WC_CONSUMER_KEY` + `WC_CONSUMER_SECRET`
- **Kunden-Login**: JWT Token über `/wp-json/jwt-auth/v1/token` (WordPress JWT Plugin)

---

## 2. Was wird wo gepflegt?

### Im WordPress-Backend änderbar (ohne Code)

| Inhalt | Wo in WordPress | Aktualisierung im Frontend |
|--------|----------------|---------------------------|
| **Produkte** (Name, Preis, Bilder, Beschreibung) | WooCommerce → Produkte | Automatisch nach ~30 Sek. (ISR) |
| **Jäger Custom Fields** (Paketpreis, Set-Angebot, Badges) | Produkt bearbeiten → Jäger Felder | Automatisch nach ~30 Sek. |
| **Kategorien** (Name, Bild, Beschreibung) | WooCommerce → Kategorien | Automatisch nach ~30 Sek. |
| **Sale-Produkte** | Produkt der Kategorie "Sale" zuweisen + Sale-Preis setzen | Automatisch nach ~30 Sek. |
| **Bestseller** | Produkt der Kategorie "Bestseller" zuweisen | Automatisch nach ~30 Sek. |
| **AGB** | WP-Seite: `allgemeine-geschaeftsbedingungen` | Automatisch nach ~30 Sek. |
| **Datenschutz** | WP-Seite: `datenschutzerklaerung-2` | Automatisch nach ~30 Sek. |
| **Impressum** | WP-Seite: `impressum` | Automatisch nach ~30 Sek. |
| **Widerruf** | WP-Seite: `widerrufsbelehrung-widerrufsformular` | Automatisch nach ~30 Sek. |
| **Versand & Lieferzeit** | WP-Seite: `versandkosten-lieferzeit` | Automatisch nach ~30 Sek. |
| **Kontakt-Seite** | WP-Seite: `beratung` | Automatisch nach ~30 Sek. |
| **Karriere-Seite** | WP-Seite: `karriere` | Automatisch nach ~30 Sek. |
| **Fachmarkt Hauptseite** | WP-Seite: `filiale-hueckelhoven` | Automatisch nach ~30 Sek. |
| **Blog-Beiträge** | WP-Beiträge | Automatisch nach ~30 Sek. |
| **Produktbilder** | Medien-Bibliothek | Sofort (CDN-Cache ~60 Sek.) |

### NUR per Code änderbar (Next.js Deployment nötig)

| Inhalt | Datei(en) |
|--------|-----------|
| **Header / Navigation** | `src/components/Header.tsx` |
| **Footer** (Links, Öffnungszeiten, Telefon) | `src/components/Footer.tsx` |
| **Homepage-Struktur** (Abschnitte, Slider-Layout) | `src/app/page.tsx` + `src/components/sections/home/` |
| **Google-Bewertungen** | `src/data/google-reviews.json` |
| **Fachmarkt-Unterseiten** (8 Seiten) | `src/app/fachmarkt-hueckelhoven/*/page.tsx` |
| → Anhängerverleih, Fachberatung, Lieferservice, Schausonntag, Set-Angebote, Verlegeservice, Warenlagerung, Werkzeugverleih | |
| **Newsletter-Seite** | `src/app/newsletter/page.tsx` |
| **Checkout-Formular** (Felder, Zahlungsarten) | `src/app/checkout/page.tsx` |
| **Versandkosten-Staffelung** | `src/lib/shippingConfig.ts` |
| **Bestellbestätigungs-Seite** | `src/app/checkout/success/page.tsx` |
| **Kontakt-Drawer** (Floating Button) | `src/components/ContactDrawer.tsx` |
| **Vorteile-Slider** (Homepage) | `src/components/sections/home/VorteileSlider.tsx` |
| **Bodenkategorien-Sektion** (Homepage) | `src/components/sections/home/BodenkategorienSection.tsx` |

---

## 3. Produkte anlegen & verwalten (WooCommerce)

### Neues Produkt erstellen

**WordPress → WooCommerce → Produkte → Neu hinzufügen**

#### Standard WooCommerce-Felder

| Feld | Beschreibung | Frontend-Anzeige |
|------|-------------|-----------------|
| **Produktname** | z.B. "Rigid-Vinyl Eiche Newstead" | Titel auf Produktseite + Karten |
| **Regulärer Preis** (`regular_price`) | Normalpreis pro Einheit (z.B. 34.99) | Streichpreis bei Sale |
| **Angebotspreis** (`sale_price`) | Reduzierter Preis → setzt `on_sale: true` | Aktueller Preis (rot) |
| **SKU** | Artikelnummer | Produktdetails |
| **Kurzbeschreibung** | Kurztext | Oberhalb der Produktdetails |
| **Beschreibung** | Volltext mit HTML-Tabelle | Tab "Eigenschaften" |
| **Produktbild** | Hauptbild | Produktgalerie erstes Bild |
| **Produktgalerie** | Weitere Bilder | Galerie-Slider |
| **Kategorien** | z.B. Vinylboden, Laminat, Sale | Filterung, Seiten-Zuordnung |
| **Lagerverwaltung** | Bestandsmenge, Status | "Auf Lager" / "Nicht verfügbar" |

#### Jäger Plugin Custom Fields (41 Felder)

Diese Felder erscheinen im Produkteditor als eigene Metabox. Siehe [Abschnitt 13](#13-alle-41-jäger-plugin-felder) für die vollständige Liste.

### Produkttyp-Erkennung

Das Frontend erkennt den Produkttyp automatisch anhand der Kategorie:

| Kategorie-Slug | Produkttyp | Frontend-Verhalten |
|----------------|-----------|-------------------|
| `vinylboden`, `laminat`, `parkett` | Bodenbelag | Set-Angebot UI (Bundle mit Dämmung + Sockelleiste) |
| `zubehoer` | Zubehör | Einfaches Produkt-Layout |
| `muster` | Muster/Probe | Muster-Pricing (erste 3 gratis, dann 3€) |
| `sockelleisten` | Sockelleiste | Als Bundle-Addon nutzbar |
| `daemmung` | Dämmung | Als Bundle-Addon nutzbar |

---

## 4. Set-Angebot System (Bundle-Konfiguration)

### Konzept

Ein Set-Angebot besteht aus:
1. **Boden** (Pflicht) — Das Hauptprodukt
2. **Dämmung** (Optional) — Standard oder Premium
3. **Sockelleiste** (Optional) — Standard oder Premium

### Im Backend konfigurieren

**Produkt bearbeiten → Jäger Custom Fields:**

| Feld | Wert | Beschreibung |
|------|------|-------------|
| `show_setangebot` | `yes` | Set-Angebot aktivieren |
| `setangebot_titel` | z.B. "Komplett-Set" | Label über dem Set-Bereich |
| `setangebot_rabatt` | z.B. `10` | Rabattprozent für das Bundle |
| `daemmung_id` | Produkt-ID | Standard-Dämmung (kostenlos im Set) |
| `sockelleisten_id` | Produkt-ID | Standard-Sockelleiste (kostenlos im Set) |
| `daemmung_option_ids` | IDs kommasepariert | Alternative Dämmungen zur Auswahl |
| `sockelleisten_option_ids` | IDs kommasepariert | Alternative Sockelleisten zur Auswahl |

### Automatisch berechnete Felder (Backend → Frontend)

Diese Felder werden vom Jäger Plugin berechnet und an das Frontend geliefert:

| Feld | Beispiel | Beschreibung |
|------|---------|-------------|
| `setangebot_einzelpreis` | 47.95 | Summe der Einzelpreise ohne Rabatt |
| `setangebot_gesamtpreis` | 34.99 | Tatsächlicher Set-Preis mit Rabatt |
| `setangebot_ersparnis_euro` | 12.96 | Ersparnis in Euro |
| `setangebot_ersparnis_prozent` | 27.03 | Ersparnis in Prozent (für Badge) |

### Verrechnung (Standard vs. Premium Addons)

Das Feld `verrechnung` bestimmt, wie ein Addon im Set bepreist wird:

| `verrechnung`-Wert | Bedeutung | Berechnung |
|--------------------|-----------|-----------|
| `0` | Standard (kostenlos im Set) | Pakete: `Math.floor` (abrunden) |
| `> 0` | Premium (Aufpreis = Differenz) | Pakete: `Math.ceil` (aufrunden) |
| Preis < Standardpreis | Günstigere Alternative (kostenlos) | Pakete: `Math.floor` |

**Hinweis**: Das `verrechnung`-Feld fehlt aktuell im Backend. Das Frontend hat einen Fallback: `product.verrechnung ?? Math.max(0, price - standardPrice)`

---

## 5. Kategorien verwalten

**WordPress → WooCommerce → Produkte → Kategorien**

### Wichtige Kategorien

| Slug | Name | Spezielle Funktion |
|------|------|-------------------|
| `vinylboden` | Vinylboden | Bodenbelag → Set-Angebot UI |
| `klebe-vinyl` | Klebe-Vinyl | Unterkategorie Vinyl |
| `rigid-vinyl` | Rigid-Vinyl | Unterkategorie Vinyl |
| `laminat` | Laminat | Bodenbelag → Set-Angebot UI |
| `parkett` | Parkett | Bodenbelag → Set-Angebot UI |
| `sockelleisten` | Sockelleisten | Bundle-Addon |
| `daemmung` | Dämmung | Bundle-Addon |
| `zubehoer` | Zubehör | Einfaches Layout |
| **`sale`** | Sale | **Homepage Sale-Slider + /sale Seite** |
| **`bestseller`** | Bestseller | **Homepage Bestseller-Slider** |

### Kategorie-Bilder

Jede Kategorie kann ein Bild haben, das auf der Kategorieseite als Header angezeigt wird. Hochladen über **WooCommerce → Kategorien → Kategorie bearbeiten → Bild**.

---

## 6. Sale & Aktionen steuern

### Ein Produkt in den Sale setzen

**Drei Schritte:**

1. **Sale-Preis setzen**: Produkt → Preis → "Angebotspreis" eintragen
   - Setzt automatisch `on_sale: true`
   - `price` wird zum Sale-Preis, `regular_price` bleibt der Originalpreis

2. **Kategorie "Sale" zuweisen**: Produkt → Kategorien → "Sale" anhaken
   - Produkt erscheint im Homepage Sale-Slider
   - Produkt erscheint auf `/sale` Seite

3. **Rabatt-Badge** (optional): Jäger Plugin Felder:
   - `setangebot_ersparnis_prozent` → Zeigt "-XX%" Badge
   - Badge wird nur angezeigt wenn `on_sale: true` UND `setangebot_ersparnis_prozent > 0`

### Aktion-Badges konfigurieren

Über Jäger Plugin Felder im Produkteditor:

| Feld | Beispiel | Beschreibung |
|------|---------|-------------|
| `show_aktion` | `yes` | Aktion-Badge aktivieren |
| `aktion` | "NEU" oder "AKTION" | Badge-Text |
| `aktion_text_color` | `#ffffff` | Textfarbe (optional) |
| `aktion_button_style` | CSS-Klasse | Button-Style (optional) |
| `show_angebotspreis_hinweis` | `yes` | Zweites Badge aktivieren |
| `angebotspreis_hinweis` | "NUR ONLINE" | Zweites Badge Text |

### UVP (Unverbindliche Preisempfehlung)

| Feld | Beschreibung |
|------|-------------|
| `show_uvp` | UVP anzeigen (yes/no) |
| `uvp` | UVP-Preis pro Einheit |
| `uvp_paketpreis` | UVP-Preis pro Paket |

---

## 7. Rechtliche Seiten (WordPress Pages)

Diese Seiten werden als **WordPress-Seiten** gepflegt und automatisch im Frontend angezeigt.

### Bearbeiten

**WordPress → Seiten → [Seite auswählen] → Bearbeiten**

| Frontend-URL | WordPress Seiten-Slug | Inhalt |
|-------------|----------------------|--------|
| `/agb` | `allgemeine-geschaeftsbedingungen` | Allgemeine Geschäftsbedingungen |
| `/datenschutz` | `datenschutzerklaerung-2` | Datenschutzerklärung |
| `/impressum` | `impressum` | Impressum |
| `/widerruf` | `widerrufsbelehrung-widerrufsformular` | Widerrufsbelehrung |
| `/versand-lieferzeit` | `versandkosten-lieferzeit` | Versandkosten & Lieferzeit |
| `/kontakt` | `beratung` | Kontaktseite |
| `/karriere` | `karriere` | Karriere/Jobs |
| `/fachmarkt-hueckelhoven` | `filiale-hueckelhoven` | Fachmarkt Hauptseite |

**Wichtig**: Der **Slug** darf nicht geändert werden, sonst findet das Frontend die Seite nicht mehr!

### Formatierung

- HTML ist erlaubt (Tabellen, Listen, etc.)
- Der WordPress-Editor (Gutenberg/Classic) kann verwendet werden
- Änderungen sind nach ~30 Sekunden im Frontend sichtbar

---

## 8. Blog-Beiträge

**WordPress → Beiträge → Neuer Beitrag**

- Beiträge erscheinen automatisch auf `/blog`
- Einzelne Beiträge unter `/blog/[slug]`
- Beitragsbilder (Featured Image) werden als Header angezeigt
- Unterstützt `_embed=true` für eingebettete Medien

---

## 9. Bilder & Medien

### Bildverwaltung

**WordPress → Medien → Datei hinzufügen**

- Bilder werden in WordPress hochgeladen und in der Medien-Bibliothek gespeichert
- URL-Format: `https://2025.bodenjaeger.de/wp-content/uploads/YYYY/MM/dateiname.jpg`
- Next.js optimiert Bilder automatisch (AVIF/WebP, responsive Größen)
- Minimum Cache TTL: 60 Sekunden

### Produktbilder

- **Hauptbild**: Produkt → Produktbild setzen
- **Galerie**: Produkt → Produktgalerie → Bilder hinzufügen
- Empfohlenes Format: Mind. 800x600px, JPG/PNG
- Das Frontend zeigt Bilder als Galerie-Slider an

### Kategorie-Bilder

- WooCommerce → Kategorien → Kategorie bearbeiten → Miniaturansicht
- Wird als Header auf der Kategorieseite verwendet

---

## 10. Cache & Aktualisierung

### Automatische Aktualisierung (ISR)

| Inhaltstyp | Aktualisierungsintervall |
|-----------|------------------------|
| Produktseiten | 30 Sekunden |
| Kategorieseiten | 30 Sekunden |
| WordPress-Seiten (AGB etc.) | 30 Sekunden |
| Produktbeschreibung (REST API) | 5 Minuten (300 Sek.) |
| Bilder | 60 Sekunden (CDN) |

**So funktioniert es**: Nach Änderung im WordPress-Backend wird die Seite beim nächsten Besuch nach Ablauf des Intervalls im Hintergrund neu generiert. Der erste Besucher sieht noch die alte Version, alle folgenden die neue.

### Sofortige Aktualisierung (Webhook)

Für sofortige Updates kann ein Webhook eingerichtet werden:

**WordPress → WooCommerce → Einstellungen → Erweitert → Webhooks → Webhook hinzufügen**

| Einstellung | Wert |
|------------|------|
| Name | Cache Revalidation |
| Status | Aktiv |
| Thema | Produkt aktualisiert / erstellt / gelöscht |
| Auslieferungs-URL | `https://bodenjaeger.vercel.app/api/revalidate?secret=REVALIDATE_SECRET` |
| Geheimschlüssel | (wird automatisch generiert) |

### Manuell Cache leeren

```
POST https://bodenjaeger.vercel.app/api/revalidate?secret=REVALIDATE_SECRET
Body: { "product_slug": "produkt-slug", "clear_all": false }
```

Oder für alle Produkte: `{ "clear_all": true }`

---

## 11. Hardcoded Inhalte (nur per Code änderbar)

Diese Inhalte sind direkt im Next.js Code und erfordern ein neues Deployment auf Vercel.

### Fachmarkt-Unterseiten (8 Seiten)

| Seite | Datei | Hardcoded Inhalte |
|-------|-------|------------------|
| Anhängerverleih | `src/app/fachmarkt-hueckelhoven/anhaengerverleih/page.tsx` | Preise (15€/25€), Mietbedingungen |
| Fachberatung | `src/app/fachmarkt-hueckelhoven/fachberatung/page.tsx` | Beratungsthemen, Ablauf |
| Lieferservice | `src/app/fachmarkt-hueckelhoven/lieferservice/page.tsx` | Preise (39€/69€/89€), Gebiete |
| Schausonntag | `src/app/fachmarkt-hueckelhoven/schausonntag/page.tsx` | Termine, Uhrzeiten |
| Set-Angebote | `src/app/fachmarkt-hueckelhoven/set-angebote/page.tsx` | 4 Pakete mit Preisen |
| Verlegeservice | `src/app/fachmarkt-hueckelhoven/verlegeservice/page.tsx` | Leistungen, Ablauf |
| Warenlagerung | `src/app/fachmarkt-hueckelhoven/warenlagerung/page.tsx` | Bedingungen, Preise |
| Werkzeugverleih | `src/app/fachmarkt-hueckelhoven/werkzeugverleih/page.tsx` | Werkzeugkatalog mit Preisen |

### Layout & Navigation

| Element | Datei | Was ist hardcoded? |
|---------|-------|--------------------|
| Header | `src/components/Header.tsx` | Logo, Navigation, Links |
| Footer | `src/components/Footer.tsx` | Links, Telefon (02433 938884), Öffnungszeiten |
| Kontakt-Drawer | `src/components/ContactDrawer.tsx` | Telefonnummer, E-Mail |
| Bestellbestätigung | `src/app/checkout/success/page.tsx` | Danke-Text, Kontaktdaten |

### Homepage-Sektionen

| Sektion | Datei | Dynamisch? |
|---------|-------|-----------|
| Hero Slider | `src/components/sections/home/HeroSlider.tsx` | Nein — Bilder/Texte hardcoded |
| Vorteile Slider | `src/components/sections/home/VorteileSlider.tsx` | Nein — Icons/Texte hardcoded |
| Bodenkategorien | `src/components/sections/home/BodenkategorienSection.tsx` | Nein — Kategorie-Kacheln hardcoded |
| Sale Slider | `src/components/sections/home/SaleProductSlider.tsx` | **Ja** — Produkte aus Kategorie "sale" |
| Bestseller Slider | `src/components/sections/home/BestsellerSlider.tsx` | **Ja** — Produkte aus Kategorie "bestseller" |
| Google Bewertungen | `src/components/sections/home/GoogleReviewsSlider.tsx` | Nein — Daten aus `src/data/google-reviews.json` |

### Sonstiges

| Inhalt | Datei |
|--------|-------|
| Versandkosten-Staffelung | `src/lib/shippingConfig.ts` (≥999€ gratis, ≥500€: 29,99€, <500€: 59,99€) |
| Newsletter-Seite (FAQ, Vorteile) | `src/app/newsletter/page.tsx` |
| Google Reviews Daten | `src/data/google-reviews.json` |

---

## 12. API-Endpunkte Referenz

### Produkt-Endpunkte (Next.js → WordPress)

| Methode | Endpunkt | Zweck |
|---------|----------|-------|
| GET | `/wp-json/jaeger/v1/products` | Alle Produkte (mit 41 Custom Fields) |
| GET | `/wp-json/jaeger/v1/products?category=sale` | Sale-Produkte |
| GET | `/wp-json/jaeger/v1/products?search=vinyl` | Produktsuche |
| GET | `/wp-json/jaeger/v1/products?include=123,456` | Produkte nach IDs |
| GET | `/wp-json/wc/v3/products/{id}` | Einzelprodukt (für Beschreibungs-Tabelle) |

**Jäger API Parameter**: `per_page`, `page`, `search`, `category`, `tag`, `include`, `orderby`, `order`, `on_sale`, `min_price`, `max_price`

### Bestell-Endpunkte

| Methode | Endpunkt | Zweck |
|---------|----------|-------|
| POST | `/wp-json/wc/v3/orders` | Bestellung erstellen |
| GET | `/wp-json/wc/v3/orders/{id}` | Bestelldetails abrufen |
| PUT | `/wp-json/wc/v3/orders/{id}` | Bestellstatus ändern |
| POST | `/wp-json/wc/v3/orders/{id}/notes` | Bestellnotiz hinzufügen |

### Seiten & Blog

| Methode | Endpunkt | Zweck |
|---------|----------|-------|
| GET | `/wp-json/wp/v2/pages?slug=impressum` | WordPress-Seite laden |
| GET | `/wp-json/wp/v2/posts` | Blog-Beiträge laden |
| GET | `/wp-json/wp/v2/posts?slug=beitrag` | Einzelnen Beitrag laden |

### Kategorien

| Methode | Endpunkt | Zweck |
|---------|----------|-------|
| GET | `/wp-json/wc/store/v1/products/categories` | Alle Kategorien |

### Authentifizierung

| Methode | Endpunkt | Zweck |
|---------|----------|-------|
| POST | `/wp-json/jwt-auth/v1/token` | Login (JWT Token) |
| GET | `/wp-json/wc/v3/customers/{id}` | Kundenprofil |
| PUT | `/wp-json/wc/v3/customers/{id}` | Profil aktualisieren |

---

## 13. Alle 41 Jäger-Plugin Felder

### Paketinformationen (8 Felder)

| API-Feld | WP Meta Key | Typ | Beschreibung |
|----------|------------|-----|-------------|
| `paketpreis` | `_paketpreis` | float | Preis pro Paket |
| `paketpreis_s` | `_paketpreis_s` | float | Kleinerer Paketpreis |
| `paketinhalt` | `_paketinhalt` | float | Inhalt pro Paket (z.B. 2.22 m²) |
| `einheit` | `_einheit` | string | Einheit ("Quadratmeter", "Lfm") |
| `einheit_short` | `_einheit_short` | string | Kurzform ("m²", "lfm") |
| `verpackungsart` | `_verpackungsart` | string | "Paket(e)", "Rolle(n)" |
| `verpackungsart_short` | `_verpackungsart_short` | string | "Pak.", "Rol." |
| `verschnitt` | `_verschnitt` | float | Verschnitt in % (Standard: 5) |

### UVP System (3 Felder)

| API-Feld | Typ | Beschreibung |
|----------|-----|-------------|
| `show_uvp` | boolean | UVP anzeigen? |
| `uvp` | float/null | UVP pro Einheit |
| `uvp_paketpreis` | float/null | UVP pro Paket |

### Produktbeschreibung (3 Felder)

| API-Feld | Typ | Beschreibung |
|----------|-----|-------------|
| `show_text_produktuebersicht` | boolean | Übersichtstext anzeigen? |
| `text_produktuebersicht` | string/null | Übersichtstext (HTML) |
| `artikelbeschreibung` | string/null | Artikelbeschreibung (HTML) |

### Set-Angebot Konfiguration (6 Felder)

| API-Feld | Typ | Beschreibung |
|----------|-----|-------------|
| `show_setangebot` | boolean | Set-Angebot aktiviert? |
| `setangebot_titel` | string | Titel ("Komplett-Set") |
| `setangebot_text_color` | string/null | Badge Textfarbe (Hex) |
| `setangebot_text_size` | string/null | Badge Textgröße |
| `setangebot_button_style` | string/null | Button-Style |
| `setangebot_rabatt` | float | Rabattprozent |

### Set-Angebot Berechnete Werte (4 Felder)

| API-Feld | Typ | Beschreibung |
|----------|-----|-------------|
| `setangebot_einzelpreis` | float/null | Vergleichspreis (ohne Rabatt) |
| `setangebot_gesamtpreis` | float/null | Set-Preis (mit Rabatt) |
| `setangebot_ersparnis_euro` | float/null | Ersparnis in € |
| `setangebot_ersparnis_prozent` | float/null | Ersparnis in % |

### Zusatzprodukte (4 Felder)

| API-Feld | WP Meta Key | Typ | Beschreibung |
|----------|------------|-----|-------------|
| `daemmung_id` | `_standard_addition_daemmung` | int/null | Standard-Dämmung Produkt-ID |
| `sockelleisten_id` | `_standard_addition_sockelleisten` | int/null | Standard-Sockelleiste Produkt-ID |
| `daemmung_option_ids` | `_option_products_daemmung` | int[] | Alternative Dämmungen (IDs) |
| `sockelleisten_option_ids` | `_option_products_sockelleisten` | int[] | Alternative Sockelleisten (IDs) |

### Aktionen & Badges (10 Felder)

| API-Feld | Typ | Beschreibung |
|----------|-----|-------------|
| `show_aktion` | boolean | Aktion-Badge anzeigen? |
| `aktion` | string/null | Badge-Text ("NEU", "SALE") |
| `aktion_text_color` | string/null | Textfarbe |
| `aktion_text_size` | string/null | Textgröße |
| `aktion_button_style` | string/null | Button-Style |
| `show_angebotspreis_hinweis` | boolean | Zweites Badge anzeigen? |
| `angebotspreis_hinweis` | string/null | Zweites Badge Text |
| `angebotspreis_text_color` | string/null | Textfarbe |
| `angebotspreis_text_size` | string/null | Textgröße |
| `angebotspreis_button_style` | string/null | Button-Style |

### Lieferzeit (2 Felder)

| API-Feld | Typ | Beschreibung |
|----------|-----|-------------|
| `show_lieferzeit` | boolean | Lieferzeit anzeigen? |
| `lieferzeit` | string/null | Text (z.B. "3-5 Werktage") |

### Zubehör-Kategorien (7 Felder)

| API-Feld | Typ | Beschreibung |
|----------|-----|-------------|
| `option_products_untergrundvorbereitung` | string/null | Produkt-IDs (kommasepariert) |
| `option_products_werkzeug` | string/null | Produkt-IDs |
| `option_products_kleber` | string/null | Produkt-IDs |
| `option_products_montagekleber_silikon` | string/null | Produkt-IDs |
| `option_products_zubehoer_fuer_sockelleisten` | string/null | Produkt-IDs |
| `option_products_schienen_profile` | string/null | Produkt-IDs |
| `option_products_reinigung_pflege` | string/null | Produkt-IDs |

### Sonstiges (2 Felder)

| API-Feld | Typ | Beschreibung |
|----------|-----|-------------|
| `verrechnung` | float | Premium-Aufpreis Logik (**fehlt im Backend**) |
| `testdummy` | string/null | Testfeld |

---

## 14. Bestellungen & Zahlungen

### Bestellablauf

```
Warenkorb → Checkout-Formular → Bestellung in WooCommerce erstellen → Zahlung → Bestätigung
```

### Zahlungsmethoden

| Methode | WooCommerce `payment_method` | Ablauf |
|---------|------------------------------|--------|
| **Kreditkarte** | `stripe` | Stripe Checkout Session → Redirect → Webhook bestätigt |
| **PayPal** | `paypal` | PayPal Order erstellen → Approval URL → Capture |
| **Sofortüberweisung** | `stripe_sofort` | Stripe Session (SOFORT) → Redirect → Webhook |
| **Vorkasse** | `bacs` | Bestellung auf "On Hold" → Kunde überweist → Manuell bestätigen |

### Bestellstatus-Lifecycle

```
pending → payment (Zahlung läuft)
       → on-hold (Vorkasse: Warten auf Überweisung)
       → processing (Zahlung bestätigt)
       → completed (Versendet)
       → failed (Zahlung fehlgeschlagen)
       → cancelled (Storniert)
       → refunded (Erstattet)
```

### Versandkosten

| Bestellwert | Versandkosten |
|------------|--------------|
| ≥ 999 € | Kostenlos |
| ≥ 500 € | 29,99 € |
| < 500 € | 59,99 € |
| Nur Zubehör | 4,99 € |
| Nur Muster | Kostenlos |

**Hinweis**: Im Warenkorb-Drawer wird immer "Kostenlos" angezeigt. Echte Versandkosten erst im Checkout.

---

## 15. Kundenkonto & Authentifizierung

### Login-System

- WordPress JWT Authentication Plugin
- Token-Laufzeit: 7 Tage (httpOnly Cookie)
- Gastbestellung möglich (kein Konto nötig)

### Kunden-Features

| Feature | Beschreibung |
|---------|-------------|
| Registrierung | E-Mail + Passwort → WooCommerce Customer |
| Login | JWT Token → Cookie `auth_token` |
| Bestellhistorie | Alle vergangenen Bestellungen einsehen |
| Adressverwaltung | Liefer- und Rechnungsadresse speichern |
| Passwort zurücksetzen | Reset-E-Mail über WordPress |

### API-Endpunkte (Frontend → Next.js API → WordPress)

| Frontend-Route | Next.js API | WordPress API |
|---------------|-------------|---------------|
| `/login` | `POST /api/auth/login` | `POST /jwt-auth/v1/token` |
| `/login` (Register) | `POST /api/auth/register` | `POST /wc/v3/customers` |
| `/konto` | `GET /api/auth/me` | `GET /wc/v3/customers/{id}` |
| `/konto` (Orders) | `GET /api/auth/orders` | `GET /wc/v3/orders?customer={id}` |

---

## Zusammenfassung: Content-Pflege Checkliste

### Tägliche Aufgaben (WordPress Backend)

- [ ] Neue Produkte anlegen (WooCommerce → Produkte)
- [ ] Preise aktualisieren (Regulär + Sale)
- [ ] Produktbilder hochladen
- [ ] Set-Angebot konfigurieren (Jäger Fields)
- [ ] Bestellungen verwalten (WooCommerce → Bestellungen)

### Regelmäßige Aufgaben (WordPress Backend)

- [ ] Kategorien pflegen (neue anlegen, Bilder aktualisieren)
- [ ] Sale-Kategorie aktualisieren (Produkte hinzufügen/entfernen)
- [ ] Bestseller-Kategorie aktualisieren
- [ ] Blog-Beiträge schreiben
- [ ] Rechtstexte aktualisieren (AGB, Datenschutz etc.)

### Bei Bedarf (Code-Änderung + Deployment)

- [ ] Navigation/Footer ändern
- [ ] Fachmarkt-Unterseiten aktualisieren (Preise, Termine)
- [ ] Google-Bewertungen aktualisieren
- [ ] Homepage-Sektionen umstrukturieren
- [ ] Versandkosten-Staffelung ändern
- [ ] Neue statische Seiten erstellen
