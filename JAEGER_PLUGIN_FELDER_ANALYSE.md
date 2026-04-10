# Bodenjaeger - Technische Analyse

# Frage 1: Jaeger Plugin Felder - Analyse der tatsachlich befullten Felder

**Stand:** 10.04.2026
**Datenbasis:** 435 Produkte im Shop (100 Produkte Stichprobe + gezielte Kategorie-Analyse)

---

## 1. Zusammenfassung

Von den **49 Custom Fields** im Jaeger Plugin sind in der Praxis:
- **~18 Felder** bei fast allen Produkten befuellt (Kernfelder)
- **~12 Felder** nur bei Boden-Produkten (Laminat/Vinyl/Parkett) befuellt
- **~19 Felder** praktisch immer leer/null (Styling-Felder, Platzhalter, ungenutzt)

---

## 2. Feld-Befuellung nach Kategorie

### Legende
- `+++` = 95-100% befuellt
- `++` = 50-94% befuellt
- `+` = 1-49% befuellt
- `-` = 0% befuellt (nie befuellt)

| Feld | Alle (100) | Laminat (57) | Vinyl (51) | Parkett (10) | Sockelleisten (47) | Zubehoer |
|------|-----------|-------------|-----------|-------------|-------------------|---------|
| **KERN-PRODUKTFELDER** | | | | | | |
| `paketpreis` | 82% ++ | +++ | +++ | +++ | +++ | - |
| `paketpreis_s` (Set-Paketpreis) | 15% + | 98% +++ | +++ | 30% + | - | - |
| `paketinhalt` | 82% ++ | +++ | +++ | +++ | +++ | - |
| `einheit` | 82% ++ | +++ | +++ | +++ | +++ | - |
| `einheit_short` | 100% +++ | +++ | +++ | +++ | +++ | +++ |
| `verpackungsart` | 82% ++ | +++ | +++ | +++ | +++ | - |
| `verpackungsart_short` | 81% ++ | +++ | +++ | +++ | +++ | - |
| `verschnitt` | 100% +++ | +++ | +++ | +++ | +++ | +++ |
| **SET-ANGEBOT SYSTEM** | | | | | | |
| `show_setangebot` | 100% +++ | +++ | +++ | +++ | +++ | +++ |
| `setangebot_titel` | 100% +++ | +++ | +++ | +++ | +++ | +++ |
| `setangebot_einzelpreis` | 82% ++ | +++ | +++ | +++ | +++ | - |
| `setangebot_gesamtpreis` | 82% ++ | +++ | +++ | +++ | +++ | - |
| `setangebot_ersparnis_euro` | 15% + | +++ | +++ | +++ | - | - |
| `setangebot_ersparnis_prozent` | 15% + | +++ | +++ | +++ | - | - |
| `setangebot_rabatt` | 0% - | - | - | - | - | - |
| `daemmung_id` | 0% - | **100% +++** | **0% -** | 90% +++ | - | - |
| `sockelleisten_id` | 14% + | +++ | 94% +++ | 90% +++ | - | - |
| `daemmung_option_ids` | 0% - | +++ | 4% + | +++ | - | - |
| `sockelleisten_option_ids` | 15% + | +++ | +++ | +++ | - | - |
| **TEXT & BESCHREIBUNG** | | | | | | |
| `artikelbeschreibung` | 35% + | +++ | 98% +++ | ++ | - | - |
| `text_produktuebersicht` | 96% +++ | +++ | +++ | +++ | +++ | +++ |
| `lieferzeit` | 82% ++ | +++ | +++ | +++ | +++ | - |
| `show_lieferzeit` | 34% + | +++ | ++ | ++ | + | - |
| **AKTION/ANGEBOTS-BADGES** | | | | | | |
| `aktion` (Defaulttext) | 96% +++ | +++ | +++ | +++ | +++ | +++ |
| `show_aktion` | 2% + | + | + | + | + | - |
| `angebotspreis_hinweis` (Default) | 82% ++ | +++ | +++ | +++ | +++ | - |
| `show_angebotspreis_hinweis` | 2% + | + | + | + | + | - |
| `show_discount_badge` | 2% + | + | + | + | + | - |
| **ZUBEHOER-OPTIONEN** | | | | | | |
| `option_products_untergrundvorbereitung` | 15% + | ++ | ++ | ++ | - | - |
| `option_products_werkzeug` | 15% + | ++ | ++ | ++ | - | - |
| `option_products_montagekleber_silikon` | 15% + | ++ | ++ | - | - | - |
| `option_products_reinigung_pflege` | 15% + | ++ | ++ | ++ | - | - |
| `option_products_zubehoer_fuer_sockelleisten` | 47% ++ | - | - | - | +++ | - |
| `option_products_kleber` | 0% - | - | - | - | - | - |
| `option_products_schienen_profile` | 0% - | - | - | - | - | - |

### Immer leer / ungenutzt (0% bei allen Produkten):

| Feld | Status |
|------|--------|
| `show_uvp` | Immer `false` |
| `uvp` | Immer `null` |
| `uvp_paketpreis` | Immer `null` |
| `show_text_produktuebersicht` | Immer `false` (Text existiert aber, wird nicht angezeigt) |
| `setangebot_rabatt` | Immer `0` |
| `setangebot_text_color` | Immer leer |
| `setangebot_text_size` | Immer leer |
| `setangebot_button_style` | Immer leer |
| `aktion_text_color` | 2% (fast nie) |
| `aktion_text_size` | 1% (fast nie) |
| `aktion_button_style` | 2% (fast nie) |
| `angebotspreis_text_color` | 2% (fast nie) |
| `angebotspreis_text_size` | 1% (fast nie) |
| `angebotspreis_button_style` | 2% (fast nie) |
| `testdummy` | 3% (Testfeld) |
| `option_products_kleber` | Immer `null` |
| `option_products_schienen_profile` | Immer `null` |

---

## 3. Wichtige Erkenntnisse

### Vinyl hat KEINE Daemmung!
- `daemmung_id`: **0% bei Vinyl** vs. 100% bei Laminat
- `daemmung_option_ids`: **4% bei Vinyl** (2 von 51) vs. 100% bei Laminat
- **Grund:** Rigid-Vinyl hat integrierte Daemmung, braucht keine separate

### Styling-Felder werden nicht genutzt
Die 6 Styling-Felder (`*_text_color`, `*_text_size`, `*_button_style`) fuer Setangebot, Aktion und Angebotspreis sind bei 98-100% der Produkte leer. Das Plugin liefert sie mit, aber im WordPress-Backend werden sie praktisch nie befuellt.

### Default-Texte vs. Show-Flags
Felder wie `aktion` ("Restposten") und `angebotspreis_hinweis` ("Black Sale") haben bei 82-96% einen Defaultwert gespeichert, aber `show_aktion` und `show_angebotspreis_hinweis` sind bei 98% `false`. Das heisst: **Der Text existiert, wird aber nicht angezeigt.**

### UVP-System komplett ungenutzt
`show_uvp`, `uvp`, `uvp_paketpreis` - alle drei Felder sind bei 100% der Produkte leer/false.

---

## 4. Beispiel: Vollstaendiges Laminat-Produkt (Jaeger API)

**Produkt:** Laminat Berga Eiche (ID: 1445)
**Endpoint:** `GET /wp-json/jaeger/v1/products?include=1445`

```json
{
  "id": 1445,
  "name": "Laminat Berga Eiche",
  "slug": "laminat-berga-eiche",
  "permalink": "https://2025.bodenjaeger.de/produkt/laminat-berga-eiche/",
  "type": "simple",
  "sku": "100134511",
  "featured": false,
  "virtual": false,
  "downloadable": false,
  "short_description": "<ul>\r\n \t<li>7mm stark</li>\r\n \t<li>Abriebklasse AC3</li>\r\n \t<li>Made in Germany</li>\r\n</ul>",
  "price": 13.99,
  "regular_price": 19.95,
  "sale_price": 13.99,
  "on_sale": true,
  "discount_percent": 30,
  "images": [
    {
      "id": "769",
      "src": "https://2025.bodenjaeger.de/wp-content/uploads/2025/03/7mm-4511-Berga.jpg",
      "alt": "",
      "name": "7mm-4511-Berga.jpg",
      "sizes": {
        "thumbnail": "...-150x150.jpg",
        "medium": "...-300x236.jpg",
        "large": "...-1024x806.jpg",
        "full": ".../7mm-4511-Berga.jpg",
        "woocommerce_thumbnail": "...-300x300.jpg",
        "woocommerce_single": "...-600x472.jpg"
      }
    }
  ],
  "categories": [
    { "id": 25, "name": "Laminat", "slug": "laminat" }
  ],
  "stock_status": "instock",
  "stock_quantity": null,
  "average_rating": "0",
  "rating_count": 0,

  "paketpreis": 53.27,
  "paketpreis_s": 37.35,
  "paketinhalt": 2.67,
  "einheit": "Quadratmeter",
  "einheit_short": "m²",
  "verpackungsart": "Paket(e)",
  "verpackungsart_short": "Pak.",
  "verschnitt": 5,

  "show_uvp": false,
  "uvp": null,
  "uvp_paketpreis": null,

  "show_text_produktuebersicht": false,
  "text_produktuebersicht": "inkl. Standard & Daemmung",
  "artikelbeschreibung": "<strong>Laminat Berga Eiche 7mm</strong>\r\n\r\nErlebe die natürliche Schönheit...",

  "show_setangebot": true,
  "show_discount_badge": false,

  "show_aktion": false,
  "aktion": "Restposten",
  "aktion_text_color": null,
  "aktion_text_size": null,
  "aktion_button_style": null,

  "show_angebotspreis_hinweis": false,
  "angebotspreis_hinweis": "Black Sale",
  "angebotspreis_text_color": null,
  "angebotspreis_text_size": null,
  "angebotspreis_button_style": null,

  "show_lieferzeit": true,
  "lieferzeit": "3-7 Arbeitstage oder im Markt abholen",

  "testdummy": null,

  "option_products_untergrundvorbereitung": "1514,1247",
  "option_products_werkzeug": "1689,1515,1301",
  "option_products_kleber": null,
  "option_products_montagekleber_silikon": "1298,1299,1294",
  "option_products_zubehoer_fuer_sockelleisten": null,
  "option_products_schienen_profile": null,
  "option_products_reinigung_pflege": "1672",

  "setangebot_titel": "Komplett-Set",
  "setangebot_rabatt": 0,
  "setangebot_text_color": "",
  "setangebot_text_size": "",
  "setangebot_button_style": "",
  "setangebot_einzelpreis": 24,
  "setangebot_gesamtpreis": 13.99,
  "setangebot_ersparnis_euro": 10.01,
  "setangebot_ersparnis_prozent": 41.71,

  "daemmung_id": 1246,
  "sockelleisten_id": 1250,
  "daemmung_option_ids": [1242, 1243, 1244, 1245, 1246],
  "sockelleisten_option_ids": [1605, 1592, 1258, 1257, 1256, 1255, 1254, 1253, 1252, 1251, 1249, 1250]
}
```

---

## 5. Vergleich: Jaeger API vs. WooCommerce REST API v3

### Jaeger API (`/wp-json/jaeger/v1/products`)
- **49 Custom Fields** auf Root-Level (flach)
- Preise als **Number** (`price: 13.99`)
- Images mit **vorberechneten Sizes** (thumbnail, medium, large, full, woo_thumbnail, woo_single)
- Schlanke Response: ~3-4 KB pro Produkt
- **Was FEHLT:** `description` (HTML-Tabelle fuer Eigenschaften-Tab), `weight`, `dimensions`, `tags`, `date_created`

### WooCommerce REST API v3 (`/wp-json/wc/v3/products/{id}`)
- Custom Fields als **meta_data Array** (key/value Paare mit `_`-Prefix)
- Preise als **String** (`price: "13.99"`)
- Enthalt **~80+ meta_data Eintraege** inkl. Yoast SEO, Rank Math, Elementor, Germanized, Google Merchant etc.
- Schwere Response: ~15-20 KB pro Produkt
- Enthalt `description` (HTML mit Eigenschaften-Tabelle)

### meta_data Muell in WC v3 Response (nicht im Jaeger API):

| Key-Prefix | Anzahl | Beschreibung |
|------------|--------|-------------|
| `_yoast_wpseo_*` | 5 | Yoast SEO |
| `rank_math_*` | 5 | Rank Math SEO |
| `_elementor_*` | 4 | Elementor Page Builder |
| `_wc_gla_*` | 5 | Google Listings & Ads |
| `_ts_*`, `_hs_code` | 3 | Trusted Shops / Zoll |
| `cmplz_*` | 1 | Cookie Compliance |
| `__*` (doppelt Underscore) | 20+ | Duplizierte/Legacy-Felder (alle leer!) |
| `_wp_page_template` | 1 | WordPress |
| `setpreis`, `_setpreis` | 2 | Legacy ACF Felder |
| `teppichboden_width` | 1 | Irrelevant |
| `_wt_product_coupon` | 1 | WooCommerce |
| `_breite_in_cm` | 1 | Leer |

**Fazit:** Die Jaeger API liefert exakt das, was das Frontend braucht. Die WC v3 API hat ~50 irrelevante meta_data-Felder dabei.

---

## 6. Empfehlungen

### Felder die man aus der Jaeger API entfernen koennte:
1. **`show_uvp`, `uvp`, `uvp_paketpreis`** - 0% befuellt, nie genutzt
2. **`setangebot_rabatt`** - Immer 0
3. **6 Styling-Felder** (`*_text_color`, `*_text_size`, `*_button_style`) - 98-100% leer
4. **`testdummy`** - Testfeld, 97% leer
5. **`option_products_kleber`** - 0% befuellt
6. **`option_products_schienen_profile`** - 0% befuellt
7. **`show_text_produktuebersicht`** - Immer false (Text existiert aber wird nie angezeigt)
8. **`show_discount_badge`** - 98% false

**Potenzielle Einsparung:** ~19 Felder weniger = schlankere API Response

### Felder die FEHLEN (im Frontend gebraucht aber nicht in Jaeger API):
1. **`verrechnung`** - Wird fuer Premium/Standard-Unterscheidung gebraucht, Frontend hat Fallback
2. **`description`** (HTML-Tabelle) - Wird separat von WC v3 geholt (extra API Call!)

### WC v3 meta_data aufraeumen:
Die **20+ doppelten Underscore-Felder** (`__show_aktion`, `__paketpreis` etc.) sind alle leer und scheinen ein Migration-Artefakt zu sein. Koennen im WordPress-Backend geloescht werden.

---
---

# Frage 2: Aktuelle Next.js Struktur - Router, Head, Metadata

## 1. Router-Typ

**100% App Router** (`src/app/`). Es gibt **kein** `src/pages/` oder `pages/` Verzeichnis. Das Projekt nutzt ausschliesslich den Next.js 15 App Router.

- **38 page.tsx Dateien** insgesamt
- Next.js Version: **15.5.9**
- Turbopack fuer Dev-Server

---

## 2. Head-Management

### `next/head` wird NICHT verwendet
Null Treffer fuer `import.*next/head` im gesamten `src/`-Verzeichnis. Das Legacy-System ist komplett abgeloest.

### Next.js Metadata API wird verwendet
Das Projekt nutzt die moderne **Metadata API** (App Router):
- `export const metadata: Metadata` (statisch) in **7 Seiten**
- `export async function generateMetadata()` (dynamisch) in **2 Seiten**
- **Root Layout** definiert globale Fallback-Metadata

### Manueller `<head>`-Block im Root Layout
Zusaetzlich zu den Metadata-Exports wird im Root Layout direkt im `<head>` Tag geschrieben:

```tsx
// src/app/layout.tsx
<html lang="de">
  <head>
    <link rel="preconnect" href="https://2025.bodenjaeger.de" />
    <link rel="dns-prefetch" href="https://2025.bodenjaeger.de" />
    <link rel="preconnect" href="https://images.unsplash.com" />
    <link rel="dns-prefetch" href="https://images.unsplash.com" />
  </head>
  <body>...</body>
</html>
```

---

## 3. Root Layout Metadata

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: "Bodenjaeger - Premium Bodenbelaege Online",
  description: "Hochwertige Vinyl-, Laminat- und Parkettboeden von COREtec, primeCORE und mehr...",
  keywords: "Bodenbelag, Vinyl, Laminat, Parkett, COREtec, primeCORE, Rigid-Vinyl, Klebe-Vinyl",
  authors: [{ name: "Bodenjaeger" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};
```

**Was fehlt im Root Layout:**
- Kein `metadataBase` (fuer absolute OG-URLs)
- Keine Open Graph Defaults
- Keine Twitter Card Defaults
- Kein `robots` Default
- Kein Favicon/Icons-Config (falls nicht via `app/favicon.ico`)

---

## 4. Produktseite - Metadata im Detail

**Datei:** `src/app/products/[slug]/page.tsx`

Dies ist die **einzige Seite mit Open Graph Tags** im ganzen Projekt:

```typescript
export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const { slug } = await params;
    const product = await wooCommerceClient.getProduct(slug);

    if (!product) {
      return { title: 'Produkt nicht gefunden' };
    }

    return {
      title: `${product.name} | Bodenjaeger`,
      description: product.short_description
        || product.description?.substring(0, 160)
        || `${product.name} bei Bodenjaeger kaufen`,
      openGraph: {
        title: product.name,
        description: product.short_description || product.description?.substring(0, 160),
        images: product.images?.[0]?.src ? [product.images[0].src] : [],
      },
    };
  } catch {
    return { title: 'Bodenjaeger - Hochwertige Bodenbelaege' };
  }
}
```

**Luecken in der Produktseite:**
- Open Graph hat kein `type: 'product'` oder `type: 'website'`
- Keine `url` in Open Graph
- Keine Twitter Card Tags
- `short_description` enthaelt HTML-Tags (nicht gestrippt fuer Meta Description)
- Kein `alternates` / `canonical` URL
- Kein strukturiertes Daten (JSON-LD / Schema.org Product)

Zusaetzlich:
- `export const revalidate = 30;` (ISR, 30 Sekunden)
- `generateStaticParams()` prebaut die **Top-10-Produkte** nach Popularity

---

## 5. Vollstaendige Metadata-Uebersicht aller Seiten

### Seiten MIT Metadata (9 von 38)

| Route | Typ | Title | Open Graph | Twitter |
|-------|-----|-------|-----------|---------|
| `/` (Root Layout) | `const metadata` | "Bodenjaeger - Premium Bodenbelaege Online" | Nein | Nein |
| `/products/[slug]` | `generateMetadata()` | "{Produktname} \| Bodenjaeger" | **JA** (einzige!) | Nein |
| `/fachmarkt-hueckelhoven/[slug]` | `generateMetadata()` | "{Seitenname} \| Fachmarkt Hueckelhoven \| Bodenjaeger" | Nein | Nein |
| `/bestseller` | `const metadata` | "Bestseller - Beliebteste Bodenbelaege \| Bodenjaeger" | Nein | Nein |
| `/sale` | `const metadata` | "Sale - Reduzierte Bodenbelaege \| Bodenjaeger" | Nein | Nein |
| `/newsletter` | `const metadata` | "Newsletter \| Bodenjaeger" | Nein | Nein |
| `/styleguide` | `const metadata` | "Styleguide \| Bodenjaeger" | Nein | Nein |
| `/sitemap-page` | `const metadata` | "Sitemap \| Bodenjaeger" | Nein | Nein |
| `/todo` | `const metadata` | "Todo \| Bodenjaeger" + `robots: noindex` | Nein | Nein |

### Seiten OHNE eigene Metadata (29 von 38)

Diese Seiten erben nur den Root-Layout-Fallback-Title:

**SEO-kritisch (oeffentliche Seiten):**
- `/` (Startseite!) - hat **KEINE eigene Metadata**
- `/category/[slug]` - Kategorieseiten ohne Title/Description
- `/blog` und `/blog/[slug]` - Blog ohne Metadata
- `/search` - Suchseite
- `/kontakt`, `/service`, `/karriere`

**Rechtsseiten (sollten eigenen Title haben):**
- `/agb`, `/datenschutz`, `/impressum`, `/widerruf`, `/versand-lieferzeit`

**Interne Seiten (weniger kritisch):**
- `/cart`, `/checkout`, `/checkout/success`
- `/login`, `/passwort-vergessen`
- `/konto/*` (4 Unterseiten)
- `/favoriten`
- `/api-test`, `/payment-setup`, `/woocommerce-setup`, `/product-cards`

---

## 6. Layout-Hierarchie

```
src/app/layout.tsx                    ← Root (Metadata + Provider-Tree + Header/Footer)
  ├── src/app/konto/layout.tsx        ← Verschachteltes Layout (Client Component, Auth-Guard + Tab-Nav)
  └── (alle anderen Seiten)           ← Kein eigenes Layout
```

**Root Layout Provider-Hierarchie:**
```
<AuthProvider>
  <CartProvider>
    <WishlistProvider>
      <HeaderWrapper />
      <FloatingContactButton />
      {children}
      <Footer />
    </WishlistProvider>
  </CartProvider>
</AuthProvider>
```

Das Konto-Layout (`src/app/konto/layout.tsx`) ist ein **Client Component** (`'use client'`) mit Auth-Guard und Tab-Navigation, hat aber **keine eigenen Metadaten**.

---

## 7. Zusammenfassung & Bewertung

| Aspekt | Status | Detail |
|--------|--------|--------|
| Router | **App Router** | 100%, kein Pages Router |
| Head-Management | **Metadata API** | Kein `next/head` |
| Root Metadata | **Vorhanden** | Title, Description, Keywords, Authors, Viewport |
| Dynamische Metadata | **2 Seiten** | Produkte + Fachmarkt-Subseiten |
| Statische Metadata | **7 Seiten** | Bestseller, Sale, Newsletter, etc. |
| Open Graph | **Nur Produktseite** | 37/38 Seiten ohne OG |
| Twitter Cards | **Nirgends** | 0/38 |
| Structured Data | **Nirgends** | Kein JSON-LD/Schema.org |
| Canonical URLs | **Nirgends** | Kein `alternates` |
| `metadataBase` | **Fehlt** | Im Root Layout nicht gesetzt |

**Groesste SEO-Luecken:**
1. **Startseite** hat keine eigene Metadata (nutzt nur Root-Fallback)
2. **Kategorieseiten** (`/category/[slug]`) komplett ohne Metadata
3. **Blog-Artikel** (`/blog/[slug]`) komplett ohne Metadata
4. **Open Graph** nur bei 1/38 Seiten
5. **Twitter Cards** bei 0/38 Seiten
6. **Kein `metadataBase`** → Open Graph Images sind relative URLs
7. **Kein JSON-LD** fuer Produkte (Google Shopping/Rich Results)

---
---

# Frage 3: Set-Angebot Pricing - Grundpreis oder Set-abhaengig?

## Kurzantwort

**Es gibt KEINEN festen Grundpreis pro m².** Der Preis ist immer **set-abhaengig** und wird im Frontend **dynamisch** berechnet — aus `product.price` (Boden) plus dem `verrechnung`-Aufpreis der gewaehlten Daemmung und Sockelleiste.

Die Backend-Felder `setangebot_einzelpreis` und `setangebot_gesamtpreis` sind **statische Snapshots** fuer Produktkarten/Uebersichten, werden aber **NICHT** fuer die dynamische Preisberechnung auf der Produktseite verwendet.

---

## 1. Die 7 Preis-Felder und ihre Bedeutung

| Feld | Typ | Beispiel (Laminat Berga) | Verwendung |
|------|-----|-------------------------|------------|
| `price` | Number | `13.99` | **Aktueller WooCommerce-Preis** = Set-Basispreis pro m² |
| `regular_price` | Number | `19.95` | **Streichpreis** (Einzelkauf ohne Set) |
| `sale_price` | Number | `13.99` | Identisch mit `price` wenn Angebot aktiv |
| `paketpreis` | Number | `53.27` | Preis pro **Paket** zum Regulaerpreis (`regular_price × paketinhalt`) |
| `paketpreis_s` | Number | `37.35` | Preis pro **Paket** zum Set-Preis (`price × paketinhalt`) |
| `setangebot_einzelpreis` | Number | `24.00` | **Statisch** - Summe Boden+Daemmung+Sockelleiste zum Regulaerpreis (fuer Streichpreis-Anzeige) |
| `setangebot_gesamtpreis` | Number | `13.99` | **Statisch** - Set-Preis mit Standard-Optionen (= oft identisch mit `price`) |

### Wichtig: Was das Frontend tatsaechlich nutzt

```
Dynamische Berechnung (ProductPageContent.tsx):
  ✅ product.price              → Boden-Preis pro m²
  ✅ product.regular_price      → Streichpreis pro m²
  ✅ selectedDaemmung.price     → Daemmungs-Preis pro m²
  ✅ selectedSockelleiste.price → Sockelleisten-Preis pro lfm
  ✅ *.verrechnung              → Aufpreis gegenueber Standard

Statisch aus Backend (NUR fuer Anzeige, nicht Berechnung):
  ⚠️ setangebot_ersparnis_prozent → Wird in TotalPrice.tsx direkt angezeigt
  ⚠️ setangebot_einzelpreis       → Nicht in Produktseite verwendet
  ⚠️ setangebot_gesamtpreis       → Nicht in Produktseite verwendet
```

---

## 2. Wie der Preis berechnet wird - Schritt fuer Schritt

### Schritt 1: Boden (immer)

```
Set-Preis pro m²     = product.price              (z.B. 13.99€)
Streichpreis pro m²  = product.regular_price       (z.B. 19.95€)
Boden-Total          = actualM2 × product.price    (z.B. 26.7m² × 13.99€ = 373.53€)
```

`actualM2` = aufgerundete Menge nach Paket-Rounding (`Math.ceil(m² / paketinhalt) × paketinhalt`).

### Schritt 2: Daemmung (optional)

```
daemmungPricePerM2      = selectedDaemmung.price           (z.B. 3.99€)
standardDaemmungPrice   = defaultDaemmung.price            (z.B. 2.49€)

verrechnung = selectedDaemmung.verrechnung
              ?? Math.max(0, daemmungPricePerM2 - standardDaemmungPrice)

Im Set:
  Standard-Daemmung → verrechnung = 0    → KOSTENLOS im Set
  Premium-Daemmung  → verrechnung = 1.50 → NUR Aufpreis wird berechnet
  Billigere Option  → verrechnung = 0    → Auch kostenlos (Math.max verhindert Negativpreis)

daemmungSetPrice = quantities.insulation.actualM2 × verrechnung
```

### Schritt 3: Sockelleiste (optional)

Identische Logik, aber in **lfm** statt m²:

```
sockelleisteVerrechnung = selectedSockelleiste.verrechnung
                          ?? Math.max(0, sockelPreis - standardSockelPreis)

sockelleisteSetPrice = quantities.baseboard.actualLfm × sockelleisteVerrechnung
```

### Schritt 4: Zusammenfuehrung

```
┌──────────────────────────────────────────────────────────────┐
│ ANZEIGE "GESAMT" (SetAngebot.tsx - oben, pro m²):           │
│                                                              │
│ setAngebotPreisProM2 = product.price                        │
│                      + daemmungVerrechnung                   │
│                      + sockelleisteVerrechnung               │
│                                                              │
│ Beispiel Standard:  13.99 + 0.00 + 0.00 = 13.99 €/m²      │
│ Beispiel Premium:   13.99 + 1.50 + 0.80 = 16.29 €/m²      │
│                                                              │
│ → Aendert sich NUR bei Daemmung/Sockelleisten-Wechsel      │
│ → Aendert sich NICHT bei m²-Eingabe                         │
├──────────────────────────────────────────────────────────────┤
│ ANZEIGE "GESAMTSUMME" (TotalPrice.tsx - unten, absolut):    │
│                                                              │
│ totalDisplayPrice = bodenPriceTotal                          │
│                   + daemmungSetPrice                         │
│                   + sockelleisteSetPrice                     │
│                                                              │
│ Beispiel 25m²:  (26.7×13.99) + (26.7×0) + (25lfm×0)       │
│                = 373.53€ + 0€ + 0€ = 373.53€               │
│                                                              │
│ → Aendert sich bei m²-Eingabe UND Produktwechsel            │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Das `verrechnung`-Feld im Detail

Das **Schlueffelfeld** des gesamten Set-Systems. Es bestimmt, was der Kunde fuer eine Addon-Option zahlt:

```typescript
// ProductPageContent.tsx, Zeile ~129
const daemmungVerrechnung = selectedDaemmung.verrechnung
  ?? Math.max(0, daemmungPricePerM2 - standardDaemmungPrice);
```

| Szenario | verrechnung | Bedeutung | Rounding |
|----------|-------------|-----------|----------|
| Standard-Daemmung (=default) | `0` | Kostenlos im Set | `Math.floor` (kundenfreundlich) |
| Premium-Daemmung (teurer) | `> 0` (z.B. 1.50) | Nur Aufpreis wird berechnet | `Math.ceil` (volle Pakete) |
| Billigere Alternative | `0` (via Math.max) | Auch kostenlos, kein Rabatt | `Math.floor` |

**Problem:** Das `verrechnung`-Feld existiert im Backend noch NICHT als eigenes Feld. Das Frontend berechnet es als Fallback. Wenn das Backend es explizit liefern wuerde, koennte man z.B. auch Sonder-Aufpreise definieren.

---

## 4. Mengen-Rounding und sein Einfluss auf Preise

Die Mengenberechnung in `setCalculations.ts` hat **direkten Einfluss auf den Gesamtpreis**, weil der Preis auf der tatsaechlich gelieferten Menge basiert (nicht der gewuenschten):

```
Kunde will:     25.0 m²
Paketinhalt:    2.67 m²
Pakete noetig:  Math.ceil(25 / 2.67) = 10 Pakete
actualM2:       10 × 2.67 = 26.70 m²     ← DAS wird berechnet

Preis:          26.70 × 13.99 = 373.53€  (nicht 25 × 13.99 = 349.75€!)
```

**Verschnitt** wird vorher addiert:
```
Gewuenscht:     25.0 m²
+ 5% Verschnitt: 25 × 1.05 = 26.25 m²
Pakete:         Math.ceil(26.25 / 2.67) = 10 Pakete
actualM2:       26.70 m²
```

Fuer **kostenlose** Addons (Standard-Daemmung im Set) wird abgerundet (`Math.floor`), damit der Kunde weniger bekommt aber nichts zahlt.

---

## 5. Warenkorb-Speicherung

Beim Hinzufuegen zum Cart wird pro Set-Item gespeichert:

```typescript
CartItem {
  // Identifikation
  setId: "set-1712345678-abc123"    // Verknuepft Boden + Daemmung + Sockelleiste
  isSetItem: true
  setRole: "floor" | "insulation" | "baseboard"

  // Preise
  setPricePerUnit: number           // 0 (kostenlos) oder Aufpreis
  regularPricePerUnit: number       // Voller Einzelkauf-Preis (fuer Streichpreis)

  // Mengen
  quantity: number                  // Pakete (z.B. 10)
  actualM2: number                  // Tatsaechliche m² nach Rounding (z.B. 26.70)
  wantedM2: number                  // Vom Kunden gewuenschte m² (z.B. 25)
}
```

**Warenkorb-Total:**
```typescript
// CartContext.tsx
total += item.setPricePerUnit * item.actualM2;
// Boden:        13.99 × 26.70 = 373.53€
// Std-Daemmung:  0.00 × 26.70 =   0.00€
// Std-Sockel:    0.00 × 25.00 =   0.00€
// Set-Total:                    373.53€
```

---

## 6. Preisfluss-Diagramm

```
BACKEND (WordPress/WooCommerce)
┌─────────────────────────────┐
│ product.price = 13.99       │ ← WooCommerce Sale Price
│ product.regular_price = 19.95│
│ daemmung.price = 2.49       │ ← Standard-Daemmung
│ premium_daemmung.price = 3.99│ ← Premium-Option
│ sockelleiste.price = 5.00   │ ← Standard-Sockelleiste
│ premium_sockel.price = 7.50 │ ← Premium-Option
│ verrechnung = ???           │ ← FEHLT IM BACKEND
│                             │
│ setangebot_einzelpreis = 24 │ ← Statisch, nicht dynamisch
│ setangebot_gesamtpreis = 13.99│← Statisch
└──────────────┬──────────────┘
               │ Jaeger API
               ▼
FRONTEND (ProductPageContent.tsx)
┌─────────────────────────────────────────────────────┐
│                                                     │
│ 1. prices = useMemo(() => {                         │
│      bodenPrice = product.price          = 13.99    │
│      daemmungVerr = max(0, 3.99 - 2.49)  = 1.50    │ ← Dynamisch berechnet!
│      sockelVerr = max(0, 7.50 - 5.00)    = 2.50    │
│                                                     │
│      setPreisProM2 = 13.99 + 1.50 + 2.50 = 17.99   │
│    }, [product, selectedDaemmung, selectedSockel])   │
│                                                     │
│ 2. quantities = useMemo(() => {                     │
│      calculateSetQuantities(25m², ...)              │
│    }, [wantedM2, ...])                              │
│                                                     │
│ 3. Weiterreichen als Props:                         │
│    → SetAngebot:  setPreisProM2 (€/m² Anzeige)    │
│    → TotalPrice:  totalDisplayPrice (Gesamtsumme)  │
│    → AddToCart:   setPricePerUnit + actualM2        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 7. Zusammenfassung

| Frage | Antwort |
|-------|---------|
| Gibt es einen festen Grundpreis pro m²? | **Nein.** `product.price` ist der Boden-Basispreis, aber der angezeigte Set-Preis ist immer die Summe aus Boden + Addons |
| Ist der Preis set-abhaengig? | **Ja, komplett.** Wechsel von Standard auf Premium aendert den Preis |
| Wo wird der Preis berechnet? | **Frontend** (`ProductPageContent.tsx` useMemo), nicht Backend |
| Was liefert das Backend? | Einzelpreise pro Produkt + statische Snapshots (`setangebot_*`) |
| Was ist `verrechnung`? | Aufpreis einer Premium-Option vs. Standard (existiert noch nicht als Backend-Feld) |
| Aendert sich der m²-Preis bei Mengenaenderung? | **Nein.** Nur die Gesamtsumme aendert sich |
| Werden `setangebot_einzelpreis`/`gesamtpreis` genutzt? | **Nicht fuer dynamische Berechnung.** Nur `setangebot_ersparnis_prozent` wird direkt angezeigt |
