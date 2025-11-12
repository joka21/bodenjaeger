# Bodenjäger - WooCommerce Headless Shop Zusammenfassung

## 📋 Projektübersicht
**Projektname**: Bodenjäger
**Typ**: Headless WooCommerce E-Commerce Shop mit Jaeger Plugin Integration
**Framework**: Next.js 15 mit React 19
**Entwicklungsstand**: Vollständig funktionsfähige E-Commerce-Lösung mit API-Extension (~75% Feature Complete)
**Code-Umfang**: 76 TypeScript/TSX Dateien (~4,195 Zeilen Code)
**Komponenten**: 29 wiederverwendbare React Komponenten
**Seiten/Routes**: 31 voll funktionsfähige Seiten (inkl. dynamische Routen)
**API Routes**: 5 Server-Side Endpoints (Products, Revalidate, Store-API-Proxy)
**Type Safety**: 40+ TypeScript Interfaces (vollständig typisiert)
**Letztes Update**: 11. November 2025
**Deployment**: Vercel (bodenjaeger.vercel.app)
**Backend**: WordPress/WooCommerce (plan-dein-ding.de)

## 🛠 Technologie-Stack
- **Frontend**: Next.js 15.5.3 mit App Router
- **UI Framework**: React 19.1.0
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React + Inline SVG
- **TypeScript**: Vollständig typisiert
- **Backend**: WooCommerce Store API Integration + WordPress Plugin Extension
- **API Proxy**: Server-Side Proxy für CORS-freie API-Calls
- **Deployment**: Vercel (Build-ready)

## 📁 Projektstruktur
```
bodenjäger/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   ├── products/             # WooCommerce Produkt-APIs (GET mit Paginierung)
│   │   │   │   └── [slug]/          # Einzelprodukt-API (GET by Slug)
│   │   │   └── store-api-test/       # Proxy API für CORS-freie Store API Calls
│   │   ├── api-test/                 # API Test-Seite für Jaeger Meta Fields
│   │   ├── cart/                     # Warenkorb-Seite
│   │   ├── category/[slug]/          # Kategorie-Seiten mit Filter & Sortierung
│   │   ├── products/[slug]/          # Produktdetail-Seiten (dynamisch)
│   │   ├── checkout/                 # Multi-Step Checkout System
│   │   │   ├── page.tsx             # 4-Stufen Checkout (Kontakt/Versand/Zahlung/Review)
│   │   │   └── success/             # Bestellbestätigungs-Seite
│   │   ├── fachmarkt-hueckelhoven/  # Fachmarkt-Unterseiten (9 Seiten)
│   │   ├── blog/                     # Blog-Übersicht
│   │   ├── fonts/                    # Poppins Font Files (10 Varianten)
│   │   ├── layout.tsx                # Root Layout mit CartProvider & Metadata
│   │   ├── page.tsx                  # Homepage mit 6 Sektionen
│   │   └── globals.css               # Globale Styles (Tailwind CSS 4.0)
│   ├── components/                   # React Komponenten (29 Komponenten)
│   │   ├── cart/                     # Warenkorb-Komponenten (5)
│   │   │   ├── CartDrawer.tsx       # Slide-in Warenkorb Seitenleiste
│   │   │   ├── CartSingleItem.tsx   # Einzelprodukte im Warenkorb
│   │   │   ├── CartSetItem.tsx      # Set-Angebote im Warenkorb
│   │   │   ├── QuantityStepper.tsx  # Mengensteuerung mit +/- Buttons
│   │   │   └── CartFooter.tsx       # Gesamtsumme & Checkout-Button
│   │   ├── product/                  # Produkt-Komponenten (6)
│   │   │   ├── ProductPageContent.tsx  # Container für Produktseiten (~100 Zeilen)
│   │   │   ├── ProductInfo.tsx      # Produktinformationen (~120 Zeilen)
│   │   │   ├── ImageGallery.tsx     # Bildergalerie mit Zoom (~150 Zeilen)
│   │   │   ├── QuantitySelector.tsx # Mengenauswahl mit Live-Preis (~80 Zeilen)
│   │   │   ├── TotalPrice.tsx       # Preisanzeige (~60 Zeilen)
│   │   │   └── SetAngebot.tsx       # Set-Bundle-Konfiguration (~520 Zeilen) ⚠️ GROSS
│   │   ├── checkout/                 # Checkout-Komponenten (6)
│   │   │   ├── CheckoutLayout.tsx   # Layout-Container
│   │   │   ├── ProgressIndicator.tsx # Fortschrittsbalken (4 Schritte)
│   │   │   ├── ContactStep.tsx      # Schritt 1: Kontaktdaten
│   │   │   ├── PaymentStep.tsx      # Schritt 3: Zahlungsmethode
│   │   │   ├── ReviewStep.tsx       # Schritt 4: Bestellübersicht
│   │   │   └── OrderSummary.tsx     # Warenkorb-Zusammenfassung
│   │   ├── category/                 # Kategorie-Komponenten (1)
│   │   │   └── CategoryPageClient.tsx  # Filter & Sortierung
│   │   ├── sections/home/            # Homepage-Sektionen (6)
│   │   │   ├── BodenkategorienSection.tsx  # Boden-Kategorien Grid
│   │   │   ├── VorteileSlider.tsx    # Vorteile-Slider
│   │   │   ├── BestsellerSlider.tsx  # Bestseller-Produkt-Slider
│   │   │   ├── SaleProductSlider.tsx # Sale-Produkt-Slider
│   │   │   ├── GoogleReviewsSlider.tsx # Google Reviews Testimonials
│   │   │   └── home-company.tsx      # ❌ FEHLT - Alta Via Applications Sektion
│   │   ├── startseite/               # Weitere Startseiten-Komponenten
│   │   │   └── HeroSlider.tsx       # Hauptslider auf Homepage
│   │   ├── Header.tsx                # Desktop Header (~350 Zeilen, 200px Höhe)
│   │   ├── HeaderWrapper.tsx         # Client-Side Wrapper (~50 Zeilen)
│   │   ├── Footer.tsx                # Footer mit Links (~150 Zeilen)
│   │   ├── ProductCard.tsx           # Standard Produktkarte (~80 Zeilen)
│   │   └── StandardProductCard.tsx   # Erweiterte Produktkarte (~100 Zeilen)
│   ├── contexts/                     # React Context API (2)
│   │   ├── CartContext.tsx           # Warenkorb State Management + LocalStorage (~80 Zeilen)
│   │   └── CheckoutContext.tsx       # Checkout State (in Entwicklung)
│   ├── lib/                          # Utilities & APIs (8+)
│   │   ├── woocommerce.ts            # WooCommerce Store API Client (511 Zeilen) ⚠️ GROSS
│   │   ├── setCalculations.ts        # Set-Angebote Kalkulation (430 Zeilen) ⚠️ GROSS
│   │   ├── cart-utils.ts             # Warenkorb-Hilfsfunktionen
│   │   ├── woocommerce-checkout.ts   # Checkout-API Integration
│   │   ├── cache.ts                  # Caching-Logik (Vercel KV)
│   │   ├── imageUtils.ts             # Bild-Optimierungen
│   │   ├── dummy-data.ts             # Legacy Dummy-Daten
│   │   └── mock-products.ts          # Mock-Produktdaten für Tests
│   ├── types/                        # TypeScript Definitionen
│   │   ├── product.ts                # Produkt-Typen (159 Zeilen, 40+ Interfaces)
│   │   ├── checkout.ts               # Checkout-Typen (175 Zeilen)
│   │   ├── cart-drawer.ts            # Warenkorb-Typen (59 Zeilen)
│   │   └── wp-store-api-extension/   # WordPress Plugin
│   │       └── wp-store-api-extension.php  # Jaeger Meta Fields Integration
│   └── data/                         # Daten & Mock-Daten
│       └── google-reviews.json       # Mock Google Reviews
├── public/                    # Statische Dateien
│   └── images/               # Bilder-Assets (54 Dateien)
│       ├── logo/             # Logo-Dateien (SVG weiß)
│       ├── Icons/            # UI-Icons (36 PNG: schieferschwarz & weiß)
│       ├── sliderbilder/     # Slider-Bilder (2 WebP: COREtec, primeCORE)
│       └── Startseite/       # Startseiten-Bilder (14 WebP: Kategorien, Vorteile)
├── .env.local                 # Umgebungsvariablen (gitignored)
├── .git/                     # Git Repository
├── package.json              # Dependencies (React 19, Next.js 15.5.3, Tailwind 4.0)
├── tsconfig.json             # TypeScript Konfiguration (strict mode)
├── next.config.ts            # Next.js Config (Image Optimization, Remote Patterns)
├── eslint.config.mjs         # ESLint Konfiguration
├── postcss.config.mjs        # PostCSS Konfiguration
└── DOKUMENTATION/            # Projektdokumentation
    ├── PROJEKT_ZUSAMMENFASSUNG.md      # Diese Datei (20KB)
    ├── BACKEND-FELDER-DOKUMENTATION.md # Jaeger Meta Fields Referenz (27KB)
    ├── PRODUCT_DETAIL_STRUCTURE.md     # Produktseiten-Architektur (2.6KB)
    └── VERCEL_KV_SETUP.md              # Redis Caching Anleitung (4.4KB)
```

## 🔗 WooCommerce Integration
**WordPress URL**: https://plan-dein-ding.de
**API**: WooCommerce Store API (`/wp-json/wc/store/v1/`)

### Architektur-Übersicht
```
┌─────────────────────────────────────────────┐
│  FRONTEND (Next.js 15 + React 19)           │
│  - Deployed auf: Vercel                     │
│  - URL: bodenjaeger.vercel.app              │
│  - Lokales Git Repository                   │
└──────────────────┬──────────────────────────┘
                   │ REST API
                   │ WooCommerce Store API v1
                   ↓
┌─────────────────────────────────────────────┐
│  BACKEND (WordPress + WooCommerce)          │
│  - URL: https://plan-dein-ding.de          │
│  - Jaeger Plugin v1.0.1 (30+ Custom Fields) │
│  - Webhook Integration (Echtzeit-Sync)     │
└─────────────────────────────────────────────┘
```

### Konfigurierte Umgebungsvariablen:
- `NEXT_PUBLIC_WORDPRESS_URL`: WordPress-Basis-URL (https://plan-dein-ding.de)
- `WC_CONSUMER_KEY`: WooCommerce API Schlüssel
- `WC_CONSUMER_SECRET`: WooCommerce API Secret
- `REVALIDATE_SECRET`: Webhook Secret für Cache-Revalidierung (T3njoka21!)
- `KV_REST_API_URL`: Vercel KV Redis URL (auto-configured)
- `KV_REST_API_TOKEN`: Vercel KV Token (auto-configured)

### API Features:
- ✅ Produktliste mit Paginierung (per_page, page, search)
- ✅ Produktdetails per Slug (mit Caching: 5min Browser, 60min Stale-While-Revalidate)
- ✅ Kategorie-Support (Filter & Sortierung)
- ✅ Bilder-Integration (Next.js Image Optimization: AVIF, WebP)
- ✅ Preise und Angebote (inkl. UVP, Paketpreise)
- ✅ Fehlerbehandlung (umfassend mit Logging)
- ✅ **Jaeger Plugin Integration**: WordPress Plugin für 30+ Custom Fields
- ✅ **API Proxy**: Server-Side Proxy für CORS-freie Entwicklung (In-Memory Cache: 2min, Max 100 Entries)
- ✅ **Multi-Layer Caching**: Browser-Cache (5min) + In-Memory (2min) + Vercel KV (30sec)
- ✅ **TypeScript Typisierung**: 40+ Interfaces für vollständige Type-Safety
- ✅ **Webhook Integration**: Echtzeit-Synchronisation bei Backend-Änderungen (30sec statt 5min)

## 🛒 E-Commerce Features
### Implementierte Funktionen:
- **Produktkatalog**: Responsive Grid-Layout mit Produktkarten
  - StandardProductCard für reguläre Produkte
  - BestsellerSlider & SaleProductSlider auf Homepage
- **Produktdetails**: Detailseiten mit erweiterten Features
  - ImageGallery mit Zoom-Funktion
  - QuantitySelector mit Live-Preisberechnung
  - Set-Angebote Integration (Bundle-Produkte)
  - TotalPrice Komponente mit Einzelpreis-/Gesamtpreis-Anzeige
  - Dynamische Produktinformationen
- **Warenkorb**: Vollständiges Shopping Cart System
  - LocalStorage-Persistierung
  - Mengenänderungen mit QuantityStepper
  - Preisberechnung für Einzelprodukte & Set-Angebote
  - Cart Context für globales State Management
  - Separate Cart Items für Singles (CartSingleItem) und Sets (CartSetItem)
- **Checkout**: Multi-Step Checkout System (Shopify-inspiriert)
  - ContactStep: Persönliche Daten & E-Mail
  - ShippingStep: Lieferadresse
  - PaymentStep: Zahlungsmethode
  - ReviewStep: Bestellübersicht
  - ProgressIndicator für Schritt-Navigation
  - OrderSummary für Warenkorbübersicht
- **Navigation**: Responsive Header mit Warenkorb-Icon und Kategorie-Dropdown
- **Responsive Design**: Mobile-first Tailwind CSS

### Warenkorb-System:
- React Context API für State Management
- LocalStorage für Persistierung zwischen Sessions
- Automatische Preisberechnung für Einzel- & Set-Produkte
- Item Counter und Gesamtsumme
- CRUD-Operationen für Cart Items
- **CartDrawer**: Slide-in Seitenleiste mit Set-Angebote Support
- **Header Integration**: Cart-Icon mit Item-Counter
- **CartFooter**: Gesamtsummen-Anzeige und Checkout-Button

## 🎨 UI/UX Design
- **Design-System**: Modernes, minimalistisches Design
- **Farbschema**:
  - Header Top: `#2e2d32` (150px)
  - Header Bottom/Navigation: `#4c4c4c` (50px)
  - Weiße Akzente für Suchfeld und Content
- **Typografie**: Geist Sans & Geist Mono Fonts
- **Header Design**:
  - 200px Gesamthöhe (2 Sektionen)
  - 1300px Breite für oberen Bereich
  - Logo (SVG) + Suchfeld (200px, 12% Abrundung) + 3 Icons (Favoriten, Warenkorb, Kundenkonto)
  - Zentrierte Navigation mit weißer Schrift
- **Icons**: Custom PNG Icons in schieferschwarz & weiß Varianten
- **Responsive**: Desktop-First für Header, Mobile-Optimierung geplant
- **Animationen**: CSS Transitions für Hover-Effekte

## 📱 Seiten & Routen
1. **Homepage (`/`)**: Produktübersicht mit WooCommerce Integration, HeroSlider, Bestseller & Sale Produkte
2. **Produktdetails (`/products/[slug]`)**: Einzelprodukt-Ansicht mit ImageGallery, QuantitySelector, Set-Angebote
3. **Kategorie (`/category/[slug]`)**: Kategorieseiten mit Filter- und Sortierfunktion
4. **Warenkorb (`/cart`)**: Shopping Cart mit Set-Angebote Support
5. **Checkout (`/checkout`)**: Multi-Step Checkout (Kontakt → Versand → Zahlung → Überprüfung)
6. **Checkout Success (`/checkout/success`)**: Bestellbestätigung
7. **Fachmarkt Hückelhoven (`/fachmarkt-hueckelhoven`)**: Lokaler Fachmarkt mit Unterseiten
   - Set-Angebote, Verlegeservice, Lieferservice, Werkzeugverleih, etc.
8. **Rechtliches**: AGB, Datenschutz, Impressum, Widerruf, Versand & Lieferzeit
9. **Weitere Seiten**: Kontakt, Service, Blog, Karriere, Sitemap
10. **API Test (`/api-test`)**: WordPress Plugin & Store API Testing Interface
11. **API Routes (`/api/products`)**: Server-side Datenabfrage
12. **API Proxy (`/api/store-api-test`)**: CORS-freier Store API Zugriff

## 🚀 Aktuelle Features Status
### ✅ Funktionsfähig:
- WooCommerce API Verbindung
- Produktanzeige mit echten Daten (Katalog + Detailseiten)
- Responsive Design
- Warenkorb-Funktionalität mit CartDrawer & Set-Angebote Support
- Multi-Step Checkout System (4 Schritte)
- Image Optimization & ImageGallery
- TypeScript Integration (vollständig typisiert)
- WordPress Plugin für Jaeger Custom Fields
- API Testing Interface
- Server-Side API Proxy
- Kategorie-Seiten mit Filter & Sortierung
- HeroSlider auf Homepage
- Bestseller & Sale Product Sliders
- Footer mit allen wichtigen Links
- Rechtliche Seiten (AGB, Datenschutz, Impressum, etc.)
- Fachmarkt Hückelhoven Unterseiten

### 🔧 Kürzlich behoben:
- Set-Angebote Berechnungsfehler (Preiskalkulation korrigiert)
- CartDrawer Integration mit Set-Produkten
- Checkout Flow Bugs
- Produktdetail-Seite 404 Fehler
- Image Loading für Next.js 15
- Server Component Kompatibilität
- CartContext Integration
- TypeScript Compilation Errors
- Lucide React Import Issues (ersetzt durch Inline SVG)
- WordPress Plugin Store API Hooks
- CORS Issues mit API Proxy

## 🔧 Entwicklung & Build
```bash
# Entwicklungsserver starten
npm run dev --turbopack

# Produktions-Build
npm run build

# Linting
npm run lint
```

## 🌐 Deployment & Hosting

### Vercel Deployment-Konfiguration

| Aspekt | Wert | Details |
|--------|------|---------|
| **Deployment-Platform** | Vercel | Automatische Deployments bei Git Push |
| **Node.js Version** | 19+ | Via package.json engines (optional) |
| **Build Command** | `next build` | Production Build mit Turbopack (optional) |
| **Start Command** | `next start` | Production Server |
| **Dev Server** | `next dev --turbopack` | Entwicklungsmodus mit Turbopack |
| **Output Directory** | `.next` | Next.js Build-Ordner |
| **Install Command** | `npm install` | Automatisch (oder `yarn install`) |
| **Environment Variables** | 4 Required | NEXT_PUBLIC_WORDPRESS_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET, REVALIDATE_SECRET |

### Erforderliche Umgebungsvariablen (.env.local)

```bash
# WordPress & WooCommerce API
NEXT_PUBLIC_WORDPRESS_URL=https://plan-dein-ding.de
WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Revalidation & Caching
REVALIDATE_SECRET=<your-secret-token>

# Optional: Vercel KV (Redis) - Auto-configured on Vercel
KV_REST_API_URL=<auto-configured>
KV_REST_API_TOKEN=<auto-configured>
```

### Vercel-Spezifische Konfiguration

**next.config.ts - Image Optimization:**
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'plan-dein-ding.de',
      pathname: '/wp-content/uploads/**'
    },
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      pathname: '/**'
    },
    {
      protocol: 'https',
      hostname: 'via.placeholder.com',
      pathname: '/**'
    }
  ],
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
}
```

### Deployment-Checkliste

**Vor Production Deployment:**
- [x] Environment Variables auf Vercel konfiguriert
- [x] Next.js Build erfolgreich (`npm run build`)
- [x] TypeScript Compilation ohne Fehler
- [x] ESLint ohne Warnungen
- [ ] WordPress Plugin auf Live-Server aktiviert
- [ ] Vercel KV (Redis) konfiguriert (optional, aber empfohlen)
- [ ] Domain DNS konfiguriert (falls Custom Domain)
- [ ] SSL-Zertifikat aktiv (automatisch via Vercel)
- [ ] Performance-Tests durchgeführt
- [ ] SEO Meta Tags überprüft

**Post-Deployment Monitoring:**
- [ ] Vercel Analytics aktiviert
- [ ] Error Tracking eingerichtet (z.B. Sentry)
- [ ] Uptime Monitoring (z.B. UptimeRobot)
- [ ] Google Analytics/Tag Manager integriert

## 🔌 API Routes & Endpoints

### REST API Endpunkte (src/app/api/)

| Route | Methode | Query Parameters | Response | Caching |
|-------|---------|------------------|----------|---------|
| **`/api/products`** | GET | `per_page` (default: 20), `page` (default: 1), `search` (optional) | `{ data: Product[], total: number, total_pages: number }` | Browser: 5min |
| **`/api/products/[slug]`** | GET | `slug` (Path Parameter) | `Product` (Single) | Browser: 5min, Stale-While-Revalidate: 60min |
| **`/api/products/by-ids`** | GET | `ids` (comma-separated) | `Product[]` | Browser: 5min |
| **`/api/revalidate`** | POST | `secret` (query param), `paths` (optional) | `{ revalidated: true, paths: [...] }` | Webhook Trigger |
| **`/api/revalidate`** | GET | - | `{ message: "Revalidation endpoint" }` | Info-Endpoint |
| **`/api/store-api-test`** | GET | `per_page` (default: '12'), `page` (default: '1'), `category`, `orderby` (default: 'date'), `order` (default: 'desc'), `search` | WooCommerce Store API Response | In-Memory: 2min (max 100 entries), Browser: 5min |
| **`/api/store-api-test`** | OPTIONS | - | CORS Headers | - |

### Webhook Integration
**Revalidate Endpoint (`/api/revalidate`)**:
- **Zweck**: Cache-Invalidierung bei Backend-Änderungen (WordPress/WooCommerce)
- **Trigger Events**: Product Updated, Created, Deleted, Meta Updated
- **Secret**: `T3njoka21!` (REVALIDATE_SECRET)
- **Workflow**:
  ```
  WordPress Backend → Produktänderung
         ↓
  WooCommerce Native Webhook
         ↓
  POST /api/revalidate?secret=T3njoka21!
         ↓
  Cache leeren (Vercel KV + Next.js ISR)
         ↓
  Nächster Request lädt frische Daten (30sec)
  ```
- **Cache-Zeit**: Vorher 5 Minuten → Jetzt 30 Sekunden

### API Proxy Features
**Store-API-Test Proxy (`/api/store-api-test`)**:
- **Zweck**: CORS-freie Entwicklung mit WooCommerce Store API
- **In-Memory Cache**: 2 Minuten TTL, Max. 100 Einträge
- **Browser Cache**: 5 Minuten
- **CORS Headers**: Access-Control-Allow-Origin: *
- **Fehlerbehandlung**: Try-Catch mit detailliertem Logging
- **Query Parameter Forwarding**: Alle Query-Parameter werden an WooCommerce weitergeleitet

---

## 🧬 TypeScript Types & Interfaces

### Produkt-Typen (src/types/product.ts - 159 Zeilen)

| Interface | Properties | Beschreibung |
|-----------|------------|--------------|
| **`Product`** | 59 Properties | Hauptprodukt-Interface mit allen WooCommerce & Jaeger Fields |
| **`ProductVariation`** | 54 Properties | Produktvariationen (z.B. Größen, Farben) |
| **`ProductImage`** | 4 Properties | Bild-Metadaten (id, src, name, alt) |
| **`ProductDimensions`** | 3 Properties | Abmessungen (length, width, height) |
| **`ProductCategory`** | 4 Properties | Kategorie-Informationen (id, name, slug, link) |
| **`ProductTag`** | 3 Properties | Produkt-Tags (id, name, slug) |
| **`ProductAttribute`** | 3 Properties | Produkt-Attribute (id, name, options) |
| **`ProductsResponse`** | 3 Properties | API Response für Produktliste (data, total, total_pages) |
| **`CategoriesResponse`** | 2 Properties | API Response für Kategorien (data, total) |
| **`Category`** | 8+ Properties | Kategorie-Details |

### Checkout-Typen (src/types/checkout.ts - 175 Zeilen)

| Type/Interface | Properties/Values | Beschreibung |
|----------------|-------------------|--------------|
| **`CheckoutStep`** | 'contact' \| 'payment' \| 'review' | Multi-Step Checkout Schritte |
| **`ShippingAddress`** | 8 Fields | Lieferadresse (firstName, lastName, address1, address2, city, postcode, country, phone) |
| **`BillingAddress`** | extends ShippingAddress | Rechnungsadresse (erbt von ShippingAddress) |
| **`ShippingMethod`** | 4 Properties | Versandmethode (id, label, cost, description) |
| **`PaymentMethod`** | 4 Properties | Zahlungsmethode (id, label, description, enabled) |
| **`CheckoutFormData`** | 3 Sections | Vollständige Checkout-Daten (contact, shipping, billing, shippingMethod, paymentMethod) |
| **`CheckoutValidationErrors`** | Record<string, string> | Validierungsfehler-Map |
| **`CheckoutContextType`** | 14 Properties/Methods | Context Interface (formData, errors, currentStep, validation methods) |
| **`WooCommerceCheckoutRequest`** | - | Request für WooCommerce Checkout API |
| **`WooCommerceCheckoutResponse`** | - | Response von WooCommerce Checkout API |

### Warenkorb-Typen (src/types/cart-drawer.ts - 59 Zeilen)

| Type/Interface | Beschreibung |
|----------------|--------------|
| **`ProductUnit`** | Type: 'Pak.' \| 'Rol.' \| 'Stk.' \| 'm²' \| 'm' \| 'lfm' |
| **`toProductUnit()`** | Safe Conversion-Funktion für Produkt-Einheiten |
| **`CartItemBase`** | Basis-Interface für Warenkorb-Items |
| **`CartSetItem`** | Interface für Set-Angebote (Bundle-Produkte) |
| **`CartSingleItem`** | Interface für Einzelprodukte |
| **`CartDrawerItem`** | Union Type: CartSetItem \| CartSingleItem |
| **`CartDrawerData`** | Warenkorb-Daten (items, totalPrice, itemCount) |
| **`CartDrawerContextType`** | Context Interface für CartDrawer |

---

## 🔌 WordPress Plugin Integration
**Plugin-Datei**: `src/types/wp-store-api-extension/wp-store-api-extension.php`

### Jaeger Custom Fields:
Das WordPress Plugin erweitert die WooCommerce Store API um 20 Jaeger-spezifische Meta-Felder:
- **Preise**: `_uvp`, `_paketpreis`, `_paketpreis_s`, `_angebotspreis_hinweis`
- **Anzeige-Flags**: `_show_uvp`, `_show_text_produktuebersicht`, `_show_lieferzeit`, etc.
- **Produktdaten**: `_paketinhalt`, `_einheit_short`, `_verpackungsart_short`, `_verschnitt`
- **Zusatzfelder**: `_lieferzeit`, `_aktion`, `_setangebot_titel`

### Plugin Features:
- ✅ Store API Response Modification (`rest_request_after_callbacks`)
- ✅ Automatische Feldtyp-Formatierung (Boolean, Float, String)
- ✅ Debug-Logging für Entwicklung
- ✅ WooCommerce-Abhängigkeits-Prüfung
- ✅ Kompatibilität mit Store API v1

## 🧪 API Testing & Debugging
**Test-URL**: `/api-test` - Umfassende API Testing Interface

### Testing Features:
- Produktliste mit Jaeger Meta Fields Anzeige
- Einzelprodukt API Calls
- Raw JSON Response Viewer
- Console Logging für Debugging
- Store API vs REST API Vergleich

## 📊 Git-Historie (Letzte Commits):
1. **Set-Angebote Berechnungen**: Fix für Set-Angebote Kalkulationsfehler
2. **Mini-Cart Drawer**: Implementierung mit Set-Angebote Unterstützung
3. **Multi-Step Checkout**: Shopify-inspiriertes mehrstufiges Checkout-System
4. **Header Redesign**: 200px Desktop-Header mit 2-Section Layout
5. **Image Assets**: Logo, Icons und Startseiten-Bilder hinzugefügt (56 Dateien)
6. **WordPress Plugin**: Jaeger Custom Fields Store API Integration
7. **WooCommerce Integration**: Echte API-Daten statt Dummy-Daten

## ⚠️ Aktueller Status & To-Do
### 🔄 In Bearbeitung:
- **Payment Integration**: Zahlungsanbieter-Integration für Live-Checkout
- **Bestellabwicklung**: Backend-Integration für Bestellverarbeitung

### ❌ Fehlende Komponenten (PRIORITÄT):
- **home-company.tsx**: Alta Via Applications Unternehmenssektion für Homepage
  - Gradient Background (Sky Blue zu Mid Blue)
  - Zentrierter Content mit H2 und 2 Absätzen
  - Text: "Alta Via Applications: Produktentwicklung mit Weitblick"

### ⚠️ Unvollständige Features:
- **Blog Einzelartikel**: `/blog/[slug]` Route fehlt (Blog-Übersicht existiert)
- **Favoriten-System**: Header-Icon vorhanden, aber keine `/favoriten` Seite
- **Kundenkonto**: Header-Icon vorhanden, aber keine `/kundenkonto` Seite/System
- **Kontaktformular**: UI vorhanden, aber keine Backend-Funktionalität
- **Newsletter**: Anmelde-UI im Footer, aber keine Integration
- **Produktsuche**: Suchfeld im Header, aber keine Backend-Funktionalität

### 🎯 Nächste Entwicklungsschritte:
1. **home-company.tsx erstellen** (siehe CLAUDE.md für Details)
2. **Payment Gateway Integration**: Stripe/PayPal/etc. implementieren
3. **Backend Order Processing**: WooCommerce Order API Integration
4. **Blog Einzelartikel**: Dynamic Route `/blog/[slug]` implementieren
5. **Benutzer-Authentifizierung**: Login/Registrierung implementieren
6. **Kundenkonto-Seiten**: Dashboard, Bestellhistorie, Profil
7. **Suchfunktionalität**: Backend für Live-Suche im Header
8. **Favoriten-System**: Vollständige Wunschliste/Favoriten Implementierung
9. **Mobile-Header**: Responsive Mobile-Version optimieren
10. **SEO-Optimierung**: Meta Tags, Structured Data, Sitemap
11. **Performance-Optimierung**: Weitere Code Splitting, Lazy Loading
12. **WordPress Plugin Deployment**: Plugin auf Live-Server aktivieren
13. **Testing**: E2E Tests, Unit Tests
14. **Analytics**: Google Analytics/Tag Manager Integration

## 📝 Technische Notizen
- Projekt nutzt die neuesten React 19 und Next.js 15 Features
- Vollständig typisiert mit TypeScript (strict mode)
- Server Components für optimale Performance
- Modulare Architektur für einfache Erweiterungen (29 wiederverwendbare Komponenten)
- Defensive Fehlerbehandlung implementiert
- WordPress Plugin für Store API Extension entwickelt
- API Testing Infrastructure implementiert
- Vollständige Warenkorb-Funktionalität mit persistentem State (LocalStorage)
- Multi-Layer Caching-Strategie (Browser + In-Memory + Vercel KV)
- Dynamic Imports für Below-the-Fold Komponenten (Performance-Optimierung)
- Turbopack aktiviert für schnellere Entwicklungs-Builds
- Code-Umfang: 76 TypeScript/TSX Dateien (~4,195 Zeilen)
- Image Optimization: AVIF & WebP mit Next.js Image Component
- 3 große Dateien identifiziert für mögliches Refactoring:
  - SetAngebot.tsx (520 Zeilen)
  - woocommerce.ts (511 Zeilen)
  - setCalculations.ts (430 Zeilen)

## 📋 Komponenten-Übersicht
### Frontend Komponenten:
- **Header** (src/components/Header.tsx):
  - 200px Desktop-Header mit 2-Section Design
  - Obere Sektion (150px): Logo, Suchfeld (200px, 12% rund, Lupe rechts), Icons
  - Untere Sektion (50px): Navigation mit Kategorien und Dropdowns
  - Icons: Favoriten, Warenkorb (mit Counter Badge), Kundenkonto
  - Sticky Position, 1300px Container-Breite
- **HeaderWrapper** (src/components/HeaderWrapper.tsx): Client-Side Wrapper für Header
- **Footer** (src/components/Footer.tsx): Vollständiger Footer mit Links und Copyright
- **Warenkorb-Komponenten** (`/components/cart/`):
  - **CartDrawer**: Slide-in Warenkorb mit Animationen
  - **CartSingleItem**: Einzelprodukte im Warenkorb
  - **CartSetItem**: Set-Angebote im Warenkorb
  - **QuantityStepper**: Mengensteuerung mit +/- Buttons
  - **CartFooter**: Gesamtsumme und Checkout-Button
- **Produkt-Komponenten** (`/components/product/`):
  - **ProductPageContent**: Haupt-Container für Produktseiten
  - **ProductInfo**: Produktinformationen & Details
  - **ImageGallery**: Bildergalerie mit Zoom
  - **QuantitySelector**: Mengenauswahl mit Live-Preis
  - **TotalPrice**: Preisanzeige (Einzel- & Gesamtpreis)
  - **SetAngebot**: Set-Angebote Bundle-Darstellung
- **Produktkarten**:
  - **ProductCard**: Standard Produktkarte
  - **StandardProductCard**: Erweiterte Produktkarte mit mehr Features
- **Checkout-Komponenten** (`/components/checkout/`):
  - **CheckoutLayout**: Layout-Container für Checkout
  - **ProgressIndicator**: Fortschrittsbalken
  - **ContactStep**: Schritt 1 - Kontaktdaten
  - **ShippingStep**: Schritt 2 - Versandadresse (implizit)
  - **PaymentStep**: Schritt 3 - Zahlungsmethode
  - **ReviewStep**: Schritt 4 - Bestellübersicht
  - **OrderSummary**: Warenkorb-Zusammenfassung im Checkout
- **Homepage-Komponenten** (`/components/sections/home/`):
  - **HeroSlider**: Hauptslider auf Startseite
  - **BestsellerSlider**: Bestseller-Produkt-Slider
  - **SaleProductSlider**: Angebots-Produkt-Slider
- **Kategorie-Komponenten** (`/components/category/`):
  - **CategoryPageClient**: Client-Side Kategorieseite mit Filter & Sortierung

### Assets & Images:
- **Logo**: SVG-Logo in weiß (`logo-bodenjaeger-fff.svg`)
- **Icons**: 36 PNG-Icons in beiden Farbvarianten (schieferschwarz/weiß)
  - Warenkorb, Favoriten, Kundenkonto, Lupe, Telefon, etc.
- **Slider-Bilder**: 2 WebP-Bilder (COREtec, primeCORE)
- **Startseiten-Assets**: 14 WebP-Bilder für Kategorien und Vorteile

### API & Backend:
- **Store API Proxy**: `/api/store-api-test` für CORS-freie Entwicklung
- **WordPress Plugin**: Jaeger Custom Fields Integration
- **API Test Interface**: `/api-test` für debugging

---

## 🎓 Know-How Transfer & Kritische Dateien

### Kritische Dateien zum Verständnis der Architektur

1. **src/lib/woocommerce.ts** (511 Zeilen)
   - Komplette WooCommerce Store API Integration
   - Jaeger Meta Fields Handling (20+ Custom Fields)
   - Automatische Feldtyp-Formatierung (Boolean, Float, String)
   - Caching-Logik & Fehlerbehandlung
   - **Zweck**: Zentrale API-Schnittstelle für alle Produkt- & Kategoriedaten

2. **src/lib/setCalculations.ts** (430 Zeilen)
   - Komplexe Kalkulation für Boden-Set-Angebote
   - Preislogik: Standard-Produkte KOSTENLOS, Premium-Produkte nur Aufpreis
   - Berechnungen: Boden (mit Verschnitt), Dämmung, Sockelleisten (m² × 1.0)
   - Vergleichspreis vs. Set-Preis Berechnung
   - **Zweck**: Geschäftslogik für Bundle-Produkte

3. **src/components/product/SetAngebot.tsx** (520 Zeilen)
   - Größte Komponente des Projekts
   - UI für Set-Konfiguration (Boden + Dämmung + Sockelleiste)
   - Standard/Option/Premium Produkte Auswahl
   - Live-Preisberechnung & Vergleichspreis-Anzeige
   - **Zweck**: Benutzeroberfläche für Bundle-Produkte

4. **src/contexts/CartContext.tsx** (~80 Zeilen)
   - Globales State Management für Warenkorb
   - LocalStorage Persistierung
   - CRUD-Operationen für Einzelprodukte & Set-Angebote
   - **Zweck**: Zentrales Warenkorb-System

### Komplexe Logik & Geschäftsregeln

**Set-Angebote Preisberechnung:**
```typescript
// Standard Zusatzprodukte sind KOSTENLOS!
if (productType === 'standard') {
  price = 0; // Kostenlos im Set enthalten
}

// Premium Zusatzprodukte: Nur Aufpreis wird berechnet
if (productType === 'premium') {
  upcharge = premiumPrice - standardPrice;
  price = upcharge * quantity;
}

// Vergleichspreis: Alle Produkte Einzelpreise
comparePrice = floorPrice + insulationPrice + baseboardPrice;

// Set-Preis: Boden + Aufschläge
setPrice = floorPrice + premiumUpcharges;
```

**Warenkorb Persistierung:**
```typescript
// LocalStorage Sync
useEffect(() => {
  localStorage.setItem('woocommerce-cart', JSON.stringify(cartItems));
}, [cartItems]);
```

**Multi-Step Checkout:**
```typescript
// 4 Schritte: contact → payment → review → success
type CheckoutStep = 'contact' | 'payment' | 'review';
```

### Performance-Optimierungen im Projekt

1. **Dynamic Imports für Below-the-Fold Komponenten**
   - Lazy Loading für nicht sofort sichtbare Komponenten
   - Reduziert Initial Bundle Size

2. **Multi-Layer Caching-Strategie**
   - **Browser Cache**: 5 Minuten (Cache-Control Headers)
   - **In-Memory Cache**: 2 Minuten (max. 100 Einträge)
   - **Vercel KV (Redis)**: Server-Side Caching
   - **Stale-While-Revalidate**: 60 Minuten für Produkte

3. **Image Optimization**
   - Next.js Image Component mit automatischer Optimierung
   - AVIF & WebP Format Support
   - Responsive Breakpoints: 640px - 3840px
   - Remote Patterns für WooCommerce & Placeholder Images

4. **Turbopack Build Tool**
   - Schnellere Entwicklungs-Builds (aktiviert via `--turbopack` Flag)
   - Ersetzt Webpack im Dev-Modus

5. **TypeScript Strict Mode**
   - Type-Safety zur Compile-Zeit
   - Reduziert Runtime-Fehler

### Refactoring-Empfehlungen

**3 große Dateien identifiziert:**
1. **SetAngebot.tsx** (520 Zeilen)
   - Aufteilen in kleinere Sub-Komponenten
   - Logik in Custom Hooks extrahieren (z.B. `useSetConfiguration`)

2. **woocommerce.ts** (511 Zeilen)
   - Modularisierung möglich:
     - `product-api.ts` (Produkt-Funktionen)
     - `category-api.ts` (Kategorie-Funktionen)
     - `field-formatter.ts` (Jaeger Fields Formatting)

3. **setCalculations.ts** (430 Zeilen)
   - Funktionen gruppieren nach Berechnungstyp
   - Unit Tests hinzufügen für Kalkulation-Logik

---
**Status**: E-Commerce Lösung in aktiver Entwicklung - Core Features implementiert (~75% Feature Complete)
**Letztes Update**: 11. November 2025
**Entwickler**: Claude Code (mit Jokal)
**Code-Umfang**: 76 TypeScript/TSX Dateien, ~4,195 Zeilen Code, 29 Komponenten, 31 Seiten
**Deployment**: Vercel (bodenjaeger.vercel.app)
**Backend**: WordPress/WooCommerce (plan-dein-ding.de)

## 🆕 Neueste Änderungen

### 11. November 2025 - Suchfunktion & Kategorieseiten-Optimierung

#### ✅ Live-Suche implementiert
- **LiveSearch Komponente** (`src/components/LiveSearch.tsx`):
  - Live-Vorschläge während dem Tippen (300ms Debounce)
  - Kategorisierte Ergebnisse (Kategorien + Produkte)
  - Dropdown mit Produktbildern, Namen, Kategorie und Preis
  - "Alle Ergebnisse anzeigen" Link zur vollständigen Suchseite
  - Click-Outside Detection & Loading-States

- **Such-API** (`/api/products/search`):
  - Durchsucht WooCommerce Produktkatalog
  - Gibt bis zu 50 Ergebnisse zurück
  - Integration mit bestehendem WooCommerce Client

- **Suchseite** (`/app/search/page.tsx`):
  - Vollständige Suchergebnisse mit Produktkarten
  - Suspense Boundary für Next.js 15 Kompatibilität
  - Responsive Grid-Layout

#### ✅ Kategorieseiten verbessert
- **Produktanzahl-Anzeige**:
  - Zeigt Gesamtanzahl über alle Seiten (nicht nur aktuelle Seite)
  - Format: "57 Produkte gefunden (Seite 1 von 5)"
  - Nutzt X-WP-Total Header aus API-Response

- **Layout-Optimierung**:
  - Kategorienamen in Beschreibungsbox verschoben (nicht mehr darüber)
  - Text Primary Farbe (#2e2d32) für bessere Lesbarkeit
  - Größere Schrift: Mobile `text-base`, Desktop `text-lg`
  - Höhere Line-Height: Mobile `leading-relaxed`, Desktop `leading-loose`
  - Desktop: 400 Zeichen Preview (vorher 200)
  - Suchfeld entfernt (globale Suche im Header ausreichend)

- **Pagination**:
  - Aktive Seite in Primary/Accent Farbe (#ed1b24)
  - Bessere visuelle Hervorhebung

- **Beschreibungstext-Formatierung**:
  - H2/H3 Überschriften mit größeren Abständen
  - Text Primary Farbe für alle Elemente
  - `prose-lg` statt `prose-sm` für größere Schrift
  - Bessere Spacing zwischen Absätzen und Listen

#### 🐛 Bug-Fixes
- **Suspense Boundary**: useSearchParams() korrekt gewrappt für Next.js 15
- **Z-Index Problem**: Such-Dropdown erscheint jetzt über anderen Elementen
- **Header Overflow**: `overflow-visible` für korrekte Dropdown-Anzeige
- **TypeScript Fehler**: Ungültige Parameter aus API-Calls entfernt

### 11. November 2025 - Projekt-Analyse & Dokumentation
- **PROJEKT_ZUSAMMENFASSUNG.md**: Umfassende Aktualisierung mit detaillierter Architektur-Übersicht
- **API Routes**: Vollständige Dokumentation aller 5 Endpoints (inkl. Webhook)
- **Webhook Integration**: Cache-Revalidierung dokumentiert (30sec Sync statt 5min)
- **Deployment-Status**: Vercel-Konfiguration aktualisiert
- **Environment Variables**: Vollständige Liste mit Beschreibungen

### 21. Oktober 2025 - Set-Angebote & Cart System
- **Set-Angebote Berechnungen**: Kalkulationsfehler behoben
  - Korrekte Preisberechnung für Bundle-Produkte
  - Einzelpreis- vs. Gesamtpreis-Anzeige
- **Mini-Cart Drawer**: Vollständige Implementierung
  - Support für Einzelprodukte und Set-Angebote
  - CartSingleItem & CartSetItem Komponenten
  - QuantityStepper für Mengenänderungen
  - CartFooter mit Gesamtsumme

### Multi-Step Checkout:
- **Shopify-inspiriertes Checkout-System** implementiert
  - 4 Schritte: Kontakt → Versand → Zahlung → Überprüfung
  - ProgressIndicator für visuelle Navigation
  - ContactStep, PaymentStep, ReviewStep Komponenten
  - OrderSummary Integration
  - CheckoutLayout als Container

### Komponenten-Struktur:
- **Produkt-Komponenten** aufgeteilt in separate Module
  - ImageGallery, QuantitySelector, TotalPrice
  - ProductInfo, ProductPageContent, SetAngebot
- **Cart-Komponenten** modularisiert
- **Checkout-Komponenten** als eigenständige Module
- **Homepage-Sliders**: BestsellerSlider & SaleProductSlider

### Bug Fixes:
- Set-Angebote Preisberechnungen korrigiert
- CartDrawer Integration verbessert
- Checkout Flow stabilisiert
- TypeScript Fehler behoben

---

## 📊 Entwicklungsstatistiken

| Metrik | Wert | Details |
|--------|------|---------|
| **TypeScript/TSX Dateien** | 76 | Vollständig typisiert (strict mode) |
| **Code-Zeilen (gesamt)** | ~4,195 | Ohne node_modules & Dependencies |
| **React Komponenten** | 29 | Wiederverwendbar & modular |
| **API Routes** | 3 | Products (GET), Products/[slug] (GET), Store-API-Test (GET/OPTIONS) |
| **Seiten/Routes** | 31 | Inkl. dynamische Routen & Fachmarkt-Unterseiten |
| **Type Interfaces** | 40+ | Product (59 Properties), ProductVariation (54 Properties), etc. |
| **Context Providers** | 2 | CartContext (~80 Zeilen), CheckoutContext (in Entwicklung) |
| **Utility Libraries** | 8+ | woocommerce.ts (511 Zeilen), setCalculations.ts (430 Zeilen) |
| **Public Assets** | 54 Dateien | Logo (1 SVG), Icons (36 PNG), Slider (2 WebP), Startseite (14 WebP) |
| **Font Files** | 10 Varianten | Poppins (Regular, Bold, ExtraBold, Italic, etc.) |

### Code-Qualität Metriken

| Metrik | Status | Details |
|--------|--------|---------|
| **TypeScript Coverage** | ✅ 100% | Alle Dateien vollständig typisiert |
| **ESLint** | ✅ Konfiguriert | eslint.config.mjs mit Next.js Rules |
| **Code Style** | ✅ Konsistent | Tailwind CSS Standards, Poppins Font |
| **Komponenten-Architektur** | ✅ Modular | 29 separate, wiederverwendbare Komponenten |
| **API Error Handling** | ✅ Umfassend | Try-Catch, Logging, Fallback-Werte |
| **Caching Strategy** | ✅ Multi-Layer | Browser (5min), In-Memory (2min, 100 max), Vercel KV |
| **Performance** | ✅ Optimiert | Dynamic Imports, Turbopack, Image Optimization (AVIF/WebP) |
| **Unit Tests** | ❌ Keine | **TO-DO** - Empfohlen für setCalculations.ts |
| **E2E Tests** | ❌ Keine | **TO-DO** - Kritisch für Checkout-Flow |
| **Storybook** | ❌ Nicht konfiguriert | Optional - Komponenten-Dokumentation |

---

## 📊 Aktueller Projekt-Status (26. Oktober 2025)

### ✅ Vollständig Implementiert (75% Feature Complete)

**E-Commerce Kern:**
- WooCommerce Store API Integration mit 511-Zeilen Client
- 31 Seiten vollständig implementiert (inkl. dynamische Routen)
- Komplexes Set-Angebote System (Boden + Dämmung + Sockelleiste)
- 3-stufiger Checkout-Prozess
- Warenkorb mit LocalStorage Persistierung
- Vercel KV Caching für Performance

**Frontend Komponenten:**
- 6 Homepage-Sektionen (HeroSlider, Kategorien, Vorteile, Bestseller, Sale, Google Reviews)
- 10+ Produkt-Komponenten (ImageGallery, QuantitySelector, SetAngebot, etc.)
- 5 Cart-Komponenten (Drawer, Single/Set Items, Stepper, Footer)
- 6 Checkout-Komponenten (Layout, Steps, Progress, Summary)
- Responsive Header & Footer
- Dynamic Imports für Performance

**Content & Seiten:**
- Homepage mit 6 Sektionen + WooCommerce Produkte
- Produktdetailseiten mit komplexer Set-Konfiguration
- Kategorieseiten mit Filter & Sortierung
- 9 Fachmarkt Hückelhoven Unterseiten
- Blog-Übersicht mit Mock-Daten
- Alle rechtlichen Seiten (AGB, Datenschutz, Impressum, etc.)
- Service-, Kontakt-, Karriere-Seiten

### ❌ Kritische Mängel & Fehlende Features

**PRIORITÄT 1 - Sofort erforderlich:**
1. **home-company.tsx** - Alta Via Applications Sektion fehlt komplett
2. **Payment Gateway** - Checkout führt nirgendwohin (keine Zahlungsabwicklung)
3. **Order Backend** - Keine Bestellverarbeitung/WooCommerce Order API

**PRIORITÄT 2 - Wichtige Features:**
4. **Blog Einzelartikel** - `/blog/[slug]` Route fehlt
5. ~~**Produktsuche**~~ - ✅ **IMPLEMENTIERT** (Live-Suche mit Dropdown & Suchseite)
6. **Kundenkonto** - Keine Authentifizierung/Login-System
7. **Favoriten** - Icon im Header, aber keine Funktionalität

**PRIORITÄT 3 - Nice-to-have:**
8. **Newsletter** - Anmelde-UI, keine Backend-Integration
9. **Kontaktformular** - Keine Backend-Verarbeitung
10. **Mobile-Header** - Weitere Optimierung erforderlich
11. **SEO** - Meta Tags, Structured Data fehlen
12. **Testing** - Keine E2E/Unit Tests vorhanden
13. **Analytics** - Keine Tracking-Integration

### 🎯 Empfohlene Reihenfolge der Implementierung

**Phase 1 - Fehlende Komponenten (1-2 Tage):**
- [ ] home-company.tsx erstellen (CLAUDE.md Anforderungen)
- [ ] Blog Einzelartikel Route implementieren

**Phase 2 - E-Commerce Funktionalität (1-2 Wochen):**
- [ ] Payment Gateway Integration (Stripe/PayPal)
- [ ] WooCommerce Order API Integration
- [ ] Order Confirmation Emails

**Phase 3 - Benutzer-Features (1-2 Wochen):**
- [ ] Authentifizierung (Login/Registrierung)
- [ ] Kundenkonto Dashboard
- [ ] Bestellhistorie
- [ ] Favoriten/Wunschliste System

**Phase 4 - Suche & Filter (1 Woche):**
- [x] Backend Produktsuche ✅ **IMPLEMENTIERT**
- [x] Live-Suche im Header ✅ **IMPLEMENTIERT**
- [ ] Erweiterte Filter/Facets

**Phase 5 - Optimierung & Launch (1-2 Wochen):**
- [ ] SEO (Meta Tags, Structured Data, Sitemap)
- [ ] Performance-Optimierung
- [ ] E2E Testing
- [ ] Analytics Integration
- [ ] WordPress Plugin Deployment

### 💡 Technische Schulden & Verbesserungen

**Code-Qualität:**
- SetAngebot.tsx ist 22KB groß - Refactoring empfohlen
- woocommerce.ts ist 511 Zeilen - könnte modularisiert werden
- Mehr TypeScript Interfaces für API Responses

**Performance:**
- Weitere Code Splitting möglich
- Image Optimization (WebP, Lazy Loading) für Slider-Bilder
- API Response Caching erweitern

**Testing:**
- Keine Tests vorhanden - Unit Tests für Utils/Calculations
- E2E Tests für Checkout-Flow kritisch

**Dokumentation:**
- API Dokumentation erweitern
- Component Storybook erwägen
- Deployment Guide erstellen