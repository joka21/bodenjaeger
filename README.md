# Bodenjäger - Premium Bodenbeläge Online

Ein moderner, performanter E-Commerce Shop für Bodenbeläge, gebaut mit Next.js 15 und einer Headless WooCommerce-Integration.

## Projektübersicht

**Bodenjäger** ist eine vollständig funktionsfähige E-Commerce-Lösung für den Verkauf von Bodenbelägen, Dämmungen und Zubehör. Das Projekt nutzt eine moderne Headless-Architektur mit Next.js 15 als Frontend und WordPress/WooCommerce als Backend.

### Technologie-Stack

- **Frontend**: Next.js 15.5.3 (App Router) + React 19.1.0 + TypeScript 5.x
- **Styling**: Tailwind CSS 4.0 + Custom CSS Variables
- **Backend**: WordPress + WooCommerce + Custom Jaeger Plugin
- **API**: WooCommerce Store API + REST API
- **State Management**: React Context API (CartContext, CheckoutContext)
- **Caching**: Vercel KV (optional)
- **Deployment**: Vercel-ready

### Hauptfunktionen

#### E-Commerce Core
- Vollständiger Produktkatalog mit Kategorien und Filter
- Produktdetailseiten mit Bildergalerien
- Warenkorb mit LocalStorage-Persistierung
- 4-Stufen Checkout-Prozess
- Bestellbestätigung

#### Besondere Features

**1. Set-Angebot System**
- Bundle-Konfiguration (Boden + Dämmung + Sockelleisten)
- Automatische m²-basierte Mengenberechnung
- Verschnitt-Faktor Integration
- Preisberechnung mit Rabatt
- Standard- und optionale Zusatzprodukte

**2. Jaeger Plugin Integration**
Das Custom WordPress-Plugin erweitert WooCommerce um 30+ Meta-Fields:
- UVP (Unverbindliche Preisempfehlung)
- Paketpreis und Paketinhalt
- Lieferzeit-Informationen
- Aktions-Badges
- Zusatzprodukt-Kategorien

**3. Homepage Sections**
- Hero Slider
- Vorteile Slider (Service Features)
- Bodenkategorien Grid
- Sale Products Slider
- Bestseller Slider
- Google Reviews Testimonials

**4. Fachmarkt Services**
Dedizierte Unterseiten für:
- Fachberatung
- Warenlagerung
- Anhänger- und Werkzeugverleih
- Verlegeservice
- Lieferservice
- Schausonntag Events

### Projektstruktur

```
bodenjäger/
├── src/
│   ├── app/                    # Next.js App Router (31 Pages)
│   │   ├── page.tsx            # Homepage
│   │   ├── products/           # Produktseiten
│   │   ├── checkout/           # Checkout-Flow
│   │   ├── cart/               # Warenkorb
│   │   ├── fachmarkt-hueckelhoven/  # Service-Seiten
│   │   └── api/                # API Routes
│   │
│   ├── components/             # 29 React Komponenten
│   │   ├── Header.tsx          # Sticky Header
│   │   ├── Footer.tsx
│   │   ├── product/            # 6 Produkt-Komponenten
│   │   ├── cart/               # 5 Warenkorb-Komponenten
│   │   ├── checkout/           # 6 Checkout-Komponenten
│   │   └── sections/home/      # 6 Homepage-Sections
│   │
│   ├── contexts/               # State Management
│   │   ├── CartContext.tsx     # Warenkorb-State
│   │   └── CheckoutContext.tsx # Checkout-State
│   │
│   ├── lib/                    # API & Utilities
│   │   ├── woocommerce.ts      # WooCommerce API Client (511 Zeilen)
│   │   ├── setCalculations.ts  # Set-Bundle Berechnungen (430 Zeilen)
│   │   ├── cache.ts            # Caching Layer
│   │   └── cart-utils.ts       # Warenkorb-Logik
│   │
│   └── types/                  # TypeScript Interfaces (40+ Types)
│       ├── product.ts
│       ├── checkout.ts
│       └── cart-drawer.ts
│
├── public/                     # Static Assets
│   ├── images/
│   │   ├── logo/
│   │   ├── Icons/
│   │   └── sliderbilder/
│
└── Dokumentation/
    ├── PROJEKT_ZUSAMMENFASSUNG.md
    ├── BACKEND-FELDER-DOKUMENTATION.md
    └── VERCEL_KV_SETUP.md
```

## Getting Started

### Voraussetzungen

- Node.js 18+
- npm/yarn/pnpm
- WordPress/WooCommerce Backend mit Jaeger Plugin

### Installation

1. Repository klonen und Dependencies installieren:
```bash
npm install
```

2. Environment Variables konfigurieren (`.env.local`):
```env
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.de
WC_CONSUMER_KEY=ck_your_consumer_key
WC_CONSUMER_SECRET=cs_your_consumer_secret
REVALIDATE_SECRET=your_secret_key
```

3. Development Server starten:
```bash
npm run dev
# oder
yarn dev
# oder
pnpm dev
```

4. Browser öffnen: [http://localhost:3000](http://localhost:3000)

### Build & Deployment

Production Build erstellen:
```bash
npm run build
npm start
```

Das Projekt ist optimiert für Deployment auf [Vercel](https://vercel.com):
- Automatische Image Optimization
- Server-Side Rendering (SSR)
- Optional: Vercel KV für Caching

## API Integration

### WooCommerce Store API

Das Projekt nutzt die WooCommerce Store API für:
- Produktdaten (`/wp-json/wc/store/v1/products`)
- Kategorien (`/wp-json/wc/store/v1/products/categories`)
- Single Products by Slug

### Custom Jaeger Meta-Fields

Beispiel Produkt-Meta-Daten:
```typescript
{
  jaeger_meta: {
    paketpreis: 45.90,
    paketinhalt: 2.5,
    einheit_short: "m²",
    uvp: 55.00,
    lieferzeit: "2-3 Werktage",
    setangebot_titel: "Komplettset Vinylboden",
    standard_addition_daemmung: 1234,
    option_products_sockelleisten: "5678,5679"
  }
}
```

## Komponenten-Highlights

### SetAngebot.tsx (~520 Zeilen)
Die größte Komponente des Projekts - verwaltet komplette Bundle-Konfiguration mit:
- Automatischer Mengenberechnung basierend auf m²
- Standard- und optionalen Zusatzprodukten
- 7 Zubehör-Kategorien
- Preisberechnung mit Rabatten
- Verschnitt-Faktor Integration

### CartContext.tsx
Zentrales State Management für Warenkorb mit:
- LocalStorage-Persistierung
- Set-Bundle Support
- Automatische Gesamtpreis-Berechnung
- Server-Safe Implementation

## Design System

### Farben
```css
:root {
  --color-primary: #ed1b24;        /* Bodenjäger Rot */
  --color-text-primary: #2e2d32;   /* Dunkelgrau */
  --color-bg-light: #f9f9fb;       /* Heller Hintergrund */
}
```

### Typography
- **Font**: Poppins (Regular 400, Bold 700)
- Lokale WOFF-Dateien für optimale Performance

## Performance Features

- **Dynamic Imports**: Below-the-fold Komponenten
- **Image Optimization**: Next.js Image mit AVIF/WebP Support
- **Code Splitting**: Automatisch per Route
- **Caching Layer**: Optional mit Vercel KV
- **Lazy Loading**: Product Cards und Slider

## Dokumentation

Weitere Details in den Dokumentations-Dateien:
- `PROJEKT_ZUSAMMENFASSUNG.md` - Vollständige Komponenten-Übersicht
- `BACKEND-FELDER-DOKUMENTATION.md` - Jaeger Plugin Meta-Keys
- `VERCEL_KV_SETUP.md` - Caching Setup

## Support & Entwicklung

### NPM Scripts
```bash
npm run dev          # Development mit Turbopack
npm run build        # Production Build
npm start            # Start Production Server
npm run lint         # ESLint Check
```

## License

Proprietary - Bodenjäger E-Commerce Platform
