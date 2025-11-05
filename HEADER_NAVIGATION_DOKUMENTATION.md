# Header Navigation & Layout - Bodenjäger E-Commerce

## Übersicht

Der Header ist das zentrale Navigationselement des Bodenjäger Online-Shops. Er besteht aus zwei Hauptbereichen und bietet vollständige E-Commerce-Funktionalität mit Sticky-Positionierung.

**Hauptdatei**: `src/components/Header.tsx`
**Typ**: Client Component (`'use client'`)
**Position**: Sticky Top (bleibt beim Scrollen sichtbar)
**Z-Index**: 50

---

## Architektur & Integration

### Root Layout (`src/app/layout.tsx`)

Der Header wird über das Root Layout in die gesamte Anwendung integriert:

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        {/* Preconnect to WooCommerce backend */}
        <link rel="preconnect" href="https://plan-dein-ding.de" />
        <link rel="dns-prefetch" href="https://plan-dein-ding.de" />

        {/* Preconnect to external image sources */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className={`${poppinsRegular.variable} ${poppinsBold.variable} antialiased`}>
        <CartProvider>
          <HeaderWrapper />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
```

**Features im Layout**:
- **HTML Lang**: `de` (Deutsch für SEO)
- **Font Loading**: Poppins Regular (400) + Bold (700) als lokale WOFF-Dateien
- **CSS Variables**: `--font-poppins-regular`, `--font-poppins-bold`
- **Font Display**: `swap` für optimale Performance
- **Preconnect**: DNS-Prefetch für schnellere API-Calls zu WooCommerce Backend
- **CartProvider**: Wraps gesamte App für globalen Warenkorb-State

**Metadata**:
```typescript
export const metadata: Metadata = {
  title: "Bodenjäger - Premium Bodenbeläge Online",
  description: "Hochwertige Vinyl-, Laminat- und Parkettböden von COREtec, primeCORE und mehr.",
  keywords: "Bodenbelag, Vinyl, Laminat, Parkett, COREtec, primeCORE, Rigid-Vinyl, Klebe-Vinyl",
  authors: [{ name: "Bodenjäger" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};
```

**⚠️ Bekannte Warnung**: Next.js 15.5.3 empfiehlt `viewport` in separate `generateViewport` Funktion auszulagern.

---

### HeaderWrapper (`src/components/HeaderWrapper.tsx`)

Einfacher Client-Component-Wrapper für den Header:

```typescript
'use client';

import Header from './Header';

export default function HeaderWrapper() {
  return <Header />;
}
```

**Zweck**:
- Ermöglicht Server-Side Rendering im Layout
- Header selbst kann Client-Component sein (für interaktive Features)
- Clean Separation of Concerns

---

### Footer (`src/components/Footer.tsx`)

Der Footer ergänzt den Header und ist in 2 Sektionen unterteilt:

#### Sektion 1: Haupt-Footer (Dark - `#2e2d32`)
**Layout**: 3-Spalten Grid (responsive zu 1 Spalte auf Mobile)

##### Spalte 1: "Hast du Fragen?"
- **Icon**: `/images/Icons/Kontakt weiß.png` (40x40px)
- **Telefon**: 02433938884 (großer Text)
- **Öffnungszeiten**:
  - Mo-Fr: 9:00 - 18:30 Uhr
  - Sa: 9:00 - 14:00 Uhr

##### Spalte 2: "Über Bodenjäger"
Links zu:
- Fachmarkt Hückelhoven
- Jobs & Karriere
- Datenschutzerklärung
- Impressum
- AGB

##### Spalte 3: "Kundenservice"
Links zu:
- Kontakt
- Servicebereich
- Versand & Lieferzeit
- Widerrufsbelehrung & Widerrufsformular
- Blog

**Link-Styling**:
- Text-Size: `text-xl` (20px)
- Hover: Underline
- Bullet: `>` Symbol (links)
- Color: Weiß

#### Sektion 2: Bottom Bar (Darker - `#4c4c4c`)
- **Höhe**: 20px (fixiert)
- **Inhalt**: Aktuell leer (reserviert für Copyright/Legal Links)

---

## Struktur & Layout

### 1. Top Section - Hauptbereich
**Höhe**:
- Mobile: `100px`
- Desktop (md+): `150px`

**Hintergrund**: `#2e2d32` (Dunkelgrau - Bodenjäger CI)

**Layout**: Horizontales Flex-Layout mit 3 Hauptbereichen:
```
┌─────────────────────────────────────────────────────────┐
│  [LOGO]     [SUCHFELD]     [KONTAKT|FAV|CART|ACCOUNT]  │
└─────────────────────────────────────────────────────────┘
```

**Max-Width**: `1300px` (zentriert)

#### 1.1 Logo
- **Position**: Links
- **Datei**: `/images/logo/logo-bodenjaeger-fff.svg`
- **Höhe**:
  - Mobile: `48px` (h-12)
  - Desktop: `80px` (h-20)
- **Link**: `/` (Homepage)
- **Verhalten**: Flex-shrink-0 (behält immer volle Größe)

#### 1.2 Suchfeld
- **Sichtbarkeit**:
  - Mobile (< sm): Versteckt
  - Tablet+ (sm+): Sichtbar
- **Breite**:
  - Tablet (sm): `200px`
  - Desktop (lg+): `250px`
- **Design**:
  - Hintergrund: Weiß
  - Höhe: `48px` (h-12)
  - Border-Radius: `12%` (abgerundete Ecken)
  - Icon: `/images/Icons/Lupe schieferschwarz.png` (rechts, 24x24px)
- **Placeholder**: "Suche..."
- **Status**: UI vorhanden, Funktionalität noch nicht implementiert

#### 1.3 Icon-Leiste (Rechts)
4 Hauptfunktionen in horizontaler Anordnung:

##### a) **Kontakt-Button** (NEU - 2025-11-05)
- **Typ**: Button (öffnet ContactDrawer)
- **Icon**: `/images/Icons/Kontakt weiß.png`
- **Design**:
  - Hintergrund: `#ed1b24` (Bodenjäger Rot)
  - Form: Rund (`rounded-full`)
  - Größe: 40x40px (md: 48x48px)
  - Shadow: `shadow-md`
- **Hover**: Scale-Effekt (`hover:scale-105`)
- **Funktion**: Öffnet ContactDrawer mit allen Kontaktinformationen

##### b) **Favoriten**
- **Typ**: Link
- **Ziel**: `/favoriten`
- **Icon**: `/images/Icons/Favoriten weiß.png`
- **Größe**:
  - Mobile: 24x24px (w-6 h-6)
  - Desktop: 32x32px (w-8 h-8)
- **Container**: 40x40px (md: 48x48px)
- **Hover**: Opacity-Reduktion (80%)
- **Status**: UI vorhanden, Backend-Integration ausstehend

##### c) **Warenkorb**
- **Typ**: Button (öffnet CartDrawer)
- **Icon**: `/images/Icons/Warenkorb weiß.png`
- **Größe**:
  - Mobile: 24x24px
  - Desktop: 32x32px
- **Badge**:
  - Position: Oben rechts (-top-1, -right-1)
  - Hintergrund: `#dc2626` (red-600)
  - Schrift: Weiß, fett, xs
  - Shape: Rounded, min-width 20px
  - Content: Artikel-Anzahl aus CartContext
  - Sichtbarkeit: Nur wenn `itemCount > 0`
- **Hover**: Opacity-Reduktion (80%)
- **Funktion**: Öffnet CartDrawer (Side Panel)

##### d) **Kundenkonto**
- **Typ**: Link
- **Ziel**: `/kundenkonto`
- **Icon**: `/images/Icons/Kundenkonto weiß.png`
- **Größe**: Wie Favoriten
- **Container**: 40x40px (md: 48x48px)
- **Hover**: Opacity-Reduktion (80%)
- **Status**: UI vorhanden, Authentifizierung ausstehend

---

### 2. Bottom Section - Hauptnavigation
**Höhe**: `50px` (fixiert)
**Hintergrund**: `#4c4c4c` (Mittleres Grau)

**Sichtbarkeit**:
- Desktop (lg+): Horizontale Navigation mit Kategorien
- Mobile/Tablet (< lg): Hamburger-Menü-Button

#### 2.1 Desktop Navigation (lg+)

**Layout**: Horizontal zentriert, `space-x-8` (32px Abstand)

**Kategorien** (7 Hauptkategorien):

1. **Vinylboden** (mit Dropdown)
   - Link: `/category/vinylboden`
   - Unterkategorien:
     - Klebe-Vinyl → `/category/klebe-vinyl`
     - Rigid-Vinyl → `/category/rigid-vinyl`
   - Dropdown:
     - Breite: `192px` (w-48)
     - Hintergrund: Weiß
     - Shadow: `shadow-lg`
     - Hover-Trigger: CSS `:hover` auf Parent
     - Animation: `opacity-0 invisible` → `opacity-100 visible`

2. **Laminat**
   - Link: `/category/laminat`

3. **Parkett**
   - Link: `/category/parkett`

4. **Teppichboden**
   - Link: `/category/teppichboden`

5. **Sockelleisten**
   - Link: `/category/sockelleisten`

6. **Dämmung**
   - Link: `/category/daemmung`

7. **Zubehör**
   - Link: `/category/zubehoer`

**Link-Styling**:
- Farbe: Weiß
- Hover: `text-gray-200`
- Font: Medium Weight
- Transition: Colors (smooth)

#### 2.2 Mobile Navigation (< lg)

**Button**:
- Typ: Hamburger-Icon (3 horizontale Linien)
- Icon: SVG (24x24px)
- Position: Zentriert
- Farbe: Weiß
- Hover: `text-gray-200`

**Status**: UI vorhanden, Mobile-Menü noch nicht implementiert

---

## Integrierte Komponenten

### CartDrawer
**Datei**: `src/components/cart/CartDrawer.tsx`
**Typ**: Slide-in Side Panel von rechts
**State**: `isCartDrawerOpen` (boolean)
**Trigger**: Warenkorb-Button Click

**Props**:
```typescript
{
  isOpen: boolean;
  onClose: () => void;
}
```

**Features**:
- Zeigt alle Warenkorb-Items
- Gesamtsumme-Berechnung
- Quantity-Stepper
- Set-Angebote Support
- Zur Kasse-Button

### ContactDrawer (NEU - 2025-11-05)
**Datei**: `src/components/ContactDrawer.tsx`
**Typ**: Slide-in Side Panel von rechts
**State**: `isContactDrawerOpen` (boolean)
**Trigger**: Roter Kontakt-Button Click

**Props**:
```typescript
{
  isOpen: boolean;
  onClose: () => void;
}
```

**Features**:
- Live-Erreichbarkeits-Indikator (grün/rot)
- Telefon: 02433 938884 (klickbar)
- Link zum Kontaktformular
- Öffnungszeiten: Mo-Fr 9-18:30, Sa 9-14
- Adresse: Parkhofstraße 61, 41836 Hückelhoven
- E-Mail: info@bodenjaeger.de
- Quick Links zu Fachmarkt & Service
- Escape-Taste zum Schließen
- Body-Scroll-Lock bei geöffnetem Drawer

---

## State Management

### React State (lokaler Component State)

```typescript
const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
```

### Context API

```typescript
const { itemCount } = useCart();
```

**CartContext** liefert:
- `itemCount`: Gesamtanzahl Artikel im Warenkorb
- Wird für Badge-Anzeige verwendet

---

## Responsive Breakpoints

| Breakpoint | Beschreibung | Verhalten |
|------------|--------------|-----------|
| **< 640px** (xs) | Mobile | Logo klein, keine Suche, Icons klein, Hamburger-Menü |
| **640px - 767px** (sm) | Tablet Portrait | Suche erscheint (200px), Icons mittel |
| **768px - 1023px** (md) | Tablet Landscape | Header 150px, Icons groß (48px) |
| **1024px+** (lg) | Desktop | Vollständige Navigation, Suche 250px, Dropdown-Menüs |

---

## Styling & Design

### Farben
```css
/* Header Background */
--header-top: #2e2d32;        /* Dunkelgrau (Top Section) */
--header-nav: #4c4c4c;         /* Mittleres Grau (Nav Section) */

/* Kontakt Button */
--contact-button: #ed1b24;     /* Bodenjäger Rot */

/* Cart Badge */
--badge-bg: #dc2626;           /* Rot (red-600) */

/* Links */
--link-color: #ffffff;         /* Weiß */
--link-hover: #e5e7eb;         /* Hell-Grau (gray-200) */
```

### Animationen & Transitions
- **Icon Hover**: `transition-opacity` (Duration: 200ms)
- **Kontakt Button Hover**: `transition-transform` mit `scale-105`
- **Navigation Links**: `transition-colors` (smooth)
- **Dropdown**: `transition-all duration-200`

### Shadows
- **Kontakt Button**: `shadow-md`
- **Dropdown**: `shadow-lg`

---

## Icons & Assets

### Verwendete Icons (alle weiß auf dunkel)

| Icon | Datei | Größe | Verwendung |
|------|-------|-------|------------|
| Logo | `/images/logo/logo-bodenjaeger-fff.svg` | 48-80px | Haupt-Logo |
| Suche | `/images/Icons/Lupe schieferschwarz.png` | 24x24px | Suchfeld (schwarz auf weiß) |
| **Kontakt** | `/images/Icons/Kontakt weiß.png` | 20-24px | **Kontakt-Button** |
| Favoriten | `/images/Icons/Favoriten weiß.png` | 24-32px | Favoriten-Link |
| Warenkorb | `/images/Icons/Warenkorb weiß.png` | 24-32px | Warenkorb-Button |
| Kundenkonto | `/images/Icons/Kundenkonto weiß.png` | 24-32px | Account-Link |

**⚠️ Bekanntes Problem**: Icon-Dateien mit Umlauten verursachen URL-Encoding-Fehler (404):
- `Kontakt weiß.png` → `Kontaktwei%C3%83%C2%9F.png`
- Empfehlung: Dateien ohne Umlaute umbenennen (z.B. `kontakt-weiss.png`)

---

## Accessibility

### ARIA Labels
```tsx
aria-label="Kontakt öffnen"     // Kontakt-Button
aria-label="Bodenjäger Logo"    // Logo
```

### Keyboard Navigation
- Alle Links und Buttons sind mit Tab erreichbar
- Escape-Taste schließt geöffnete Drawers
- Focus-States sind visuell erkennbar

### Screen Reader
- Alt-Texte für alle Icons
- Semantisches HTML (`<header>`, `<nav>`)
- Role-Attribute in Drawers (`role="dialog"`)

---

## Performance Optimierungen

### Code Splitting
- CartDrawer und ContactDrawer nur geladen wenn benötigt
- Lazy-Loading durch conditional rendering

### Asset Optimization
- SVG für Logo (skalierbar, klein)
- PNG Icons (optimiert)
- Next.js automatische Image-Optimization (wenn Image-Component verwendet)

---

## Technische Details

### Dependencies
```typescript
import Link from 'next/link';          // Next.js Navigation
import { useState } from 'react';      // State Management
import { useCart } from '@/contexts/CartContext';  // Warenkorb-Context
import CartDrawer from './cart/CartDrawer';
import ContactDrawer from './ContactDrawer';
```

### Component Type
```typescript
'use client';  // Client Component (wegen interaktivem State)
```

### TypeScript
Vollständig typisiert, keine Prop-Interface nötig (lokaler State).

---

## Zukünftige Erweiterungen

### Geplante Features
1. **Suchfunktionalität**:
   - Echtzeit-Produktsuche
   - Autocomplete
   - Suchhistorie

2. **Mobile Menu**:
   - Slide-in Navigation
   - Kategorie-Akkordeon
   - Vollständige Kategorie-Bäume

3. **Favoriten Backend**:
   - Persistierung in Datenbank
   - User-spezifische Favoriten
   - Badge mit Anzahl

4. **Authentifizierung**:
   - Kundenkonto-Seite
   - Login/Logout
   - User-Profil im Header

5. **Mehrsprachigkeit**:
   - i18n Integration
   - Sprachauswahl im Header

6. **Sticky Cart Preview**:
   - Mini-Warenkorb-Vorschau on Hover
   - Quick-Add Feedback

---

## Testing Checklist

- [x] Logo verlinkt auf Homepage
- [x] Kontakt-Button öffnet ContactDrawer
- [x] Warenkorb-Button öffnet CartDrawer
- [x] Cart Badge zeigt korrekte Anzahl
- [x] Favoriten-Link funktioniert
- [x] Kundenkonto-Link funktioniert
- [x] Navigation-Links funktionieren
- [x] Vinylboden Dropdown erscheint on Hover
- [x] Responsive Breakpoints funktionieren
- [x] Sticky Position bleibt beim Scrollen
- [ ] Suchfeld funktional (noch nicht implementiert)
- [ ] Mobile Menü funktional (noch nicht implementiert)
- [ ] Icon-Dateien ohne URL-Encoding-Fehler

---

## Bekannte Issues

### 1. Icon URL-Encoding Fehler
**Problem**: Umlaute in Dateinamen verursachen 404-Fehler
```
GET /images/Icons/Kontaktwei%C3%83%C2%9F.png 404
```

**Lösung**: Dateien umbenennen:
```bash
# Vorher:
/images/Icons/Kontakt weiß.png
/images/Icons/Favoriten weiß.png
/images/Icons/Warenkorb weiß.png
/images/Icons/Kundenkonto weiß.png
/images/Icons/Lupe schieferschwarz.png

# Nachher:
/images/Icons/kontakt-weiss.png
/images/Icons/favoriten-weiss.png
/images/Icons/warenkorb-weiss.png
/images/Icons/kundenkonto-weiss.png
/images/Icons/lupe-schieferschwarz.png
```

### 2. Suchfunktion nicht implementiert
Input-Feld ist UI-only, keine Backend-Anbindung.

### 3. Mobile Menu fehlt
Hamburger-Button vorhanden, aber Menü noch nicht entwickelt.

---

## Code-Beispiele

### Kontakt-Button Integration
```tsx
<button
  onClick={() => setIsContactDrawerOpen(true)}
  className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#ed1b24] rounded-full hover:scale-105 transition-transform shadow-md"
  aria-label="Kontakt öffnen"
>
  <img
    src="/images/Icons/Kontakt weiß.png"
    alt="Kontakt"
    className="w-5 h-5 md:w-6 md:h-6"
  />
</button>
```

### Dropdown-Navigation
```tsx
<div className="relative group">
  <Link href="/category/vinylboden" className="text-white hover:text-gray-200 transition-colors font-medium">
    Vinylboden
  </Link>
  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
    <Link href="/category/klebe-vinyl" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
      Klebe-Vinyl
    </Link>
    <Link href="/category/rigid-vinyl" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
      Rigid-Vinyl
    </Link>
  </div>
</div>
```

---

## Zusammenfassung

Der Bodenjäger Header ist ein modernes, responsive Navigations-Element mit:
- ✅ Sticky Positionierung
- ✅ 4 Icon-Buttons (Kontakt, Favoriten, Warenkorb, Account)
- ✅ 7 Produkt-Kategorien
- ✅ Dropdown-Navigation
- ✅ CartDrawer Integration
- ✅ ContactDrawer Integration (NEU)
- ✅ Warenkorb-Badge
- ✅ Mobile-ready Layout
- ⏳ Suche (UI vorhanden, Backend ausstehend)
- ⏳ Mobile Menu (Button vorhanden, Menü ausstehend)

**Entwicklungsstand**: 85% komplett
**Letzte Aktualisierung**: 2025-11-05 (ContactDrawer hinzugefügt)

---

## Komplette Seitenstruktur

### Page Layout Hierarchie

```
RootLayout (src/app/layout.tsx)
├── <html lang="de">
│   ├── <head>
│   │   ├── Preconnect Links (WooCommerce, Images)
│   │   └── Metadata (Title, Description, Keywords)
│   │
│   └── <body className="poppins antialiased">
│       └── <CartProvider>
│           ├── <HeaderWrapper>
│           │   └── <Header> (Sticky, z-50)
│           │       ├── Top Section (100-150px)
│           │       │   ├── Logo
│           │       │   ├── Suchfeld
│           │       │   └── Icon-Leiste
│           │       │       ├── Kontakt-Button → ContactDrawer
│           │       │       ├── Favoriten-Link
│           │       │       ├── Warenkorb-Button → CartDrawer
│           │       │       └── Kundenkonto-Link
│           │       │
│           │       ├── Bottom Section (50px)
│           │       │   └── Hauptnavigation (7 Kategorien)
│           │       │
│           │       ├── <CartDrawer> (Slide-in, z-50)
│           │       └── <ContactDrawer> (Slide-in, z-50)
│           │
│           ├── {children} - Page Content
│           │   └── (z.B. Homepage, Produktseiten, Checkout, etc.)
│           │
│           └── <Footer>
│               ├── Haupt-Footer (3 Spalten)
│               │   ├── Kontakt & Öffnungszeiten
│               │   ├── Über Bodenjäger
│               │   └── Kundenservice
│               │
│               └── Bottom Bar (20px)
```

### Z-Index Stack

| Element | Z-Index | Beschreibung |
|---------|---------|--------------|
| **Drawers** (Cart, Contact) | 50 | Höchste Ebene - überdeckt alles |
| **Drawer Backdrop** | 40 | Dunkler Overlay hinter Drawers |
| **Header** (Sticky) | 50 | Bleibt im Viewport beim Scrollen |
| **Dropdown-Menüs** | 10 | Vinylboden-Unterkategorien |
| **Page Content** | auto | Standard-Inhalt |
| **Footer** | auto | Ganz unten |

### Scroll-Verhalten

1. **Header**:
   - Position: `sticky top-0`
   - Bleibt beim Scrollen sichtbar
   - Gesamt-Höhe: 150-200px (Mobile: 150px, Desktop: 200px)

2. **Page Content**:
   - Scrollt normal
   - Min-Height für volle Viewport-Auslastung

3. **Footer**:
   - Position: Ende des Contents
   - `mt-auto` für Sticky-Footer-Effekt (bei kurzem Content)

4. **Drawers offen**:
   - Body Scroll wird deaktiviert (`overflow: hidden`)
   - Verhindert doppeltes Scrollen (Drawer + Body)

### Performance-Optimierungen im Layout

#### 1. Font Loading
```typescript
const poppinsRegular = localFont({
  src: "./fonts/Poppins-Regular.woff",
  variable: "--font-poppins-regular",
  weight: "400",
  display: "swap",  // FOIT vermeiden
});
```

**Vorteile**:
- Lokale WOFF-Dateien (keine externen Requests)
- `display: swap` verhindert Flash of Invisible Text (FOIT)
- CSS Variables für flexible Nutzung

#### 2. Preconnect & DNS Prefetch
```html
<link rel="preconnect" href="https://plan-dein-ding.de" />
<link rel="dns-prefetch" href="https://plan-dein-ding.de" />
```

**Effekt**:
- DNS-Auflösung vor ersten API-Calls
- Schnellere WooCommerce-Backend-Verbindung
- Reduziert Time-to-First-Byte (TTFB)

#### 3. CartProvider auf Root-Level
```typescript
<CartProvider>
  <HeaderWrapper />
  {children}
  <Footer />
</CartProvider>
```

**Vorteile**:
- Warenkorb-State global verfügbar
- Kein Prop-Drilling
- State bleibt bei Navigation erhalten

### Responsive Layout-Strategie

| Viewport | Header-Höhe | Navigation | Footer |
|----------|-------------|------------|--------|
| **< 640px** (Mobile) | 100px | Hamburger-Menü | 1 Spalte |
| **640-767px** (Tablet P) | 150px | Hamburger-Menü | 1 Spalte |
| **768-1023px** (Tablet L) | 150px | Hamburger-Menü | 2 Spalten |
| **1024px+** (Desktop) | 150px | Vollständige Nav | 3 Spalten |

---

## Global CSS Variables

Das Layout verwendet folgende CSS-Variablen (definiert in `globals.css`):

```css
:root {
  /* Typography */
  --font-poppins-regular: /* WOFF Variable */;
  --font-poppins-bold: /* WOFF Variable */;

  /* Brand Colors */
  --color-primary: #ed1b24;
  --color-accent: #ed1b24;

  /* Text Colors */
  --color-text-primary: #2e2d32;
  --color-text-light: #ffffff;
  --color-text-dark: #4c4c4c;

  /* Background Colors */
  --color-bg-white: #ffffff;
  --color-bg-light: #f9f9fb;
  --color-bg-gray: #e5e5e5;
  --color-bg-dark: #4c4c4c;
  --color-bg-darkest: #2e2d32;

  /* Gradients */
  --gradient-mid-to-sky: radial-gradient(circle at center, #a8dcf4 0%, #5095cb 100%);
}
```

**Verwendung im Footer**:
```typescript
style={{
  backgroundColor: 'var(--color-bg-darkest)'  // #2e2d32
}}
```

---

## SEO & Meta-Optimierungen

### Metadata (Root Layout)
- **Title**: "Bodenjäger - Premium Bodenbeläge Online"
- **Description**: Optimiert für Suchmaschinen
- **Keywords**: Relevante Produkt-Keywords
- **Lang**: `de` für deutsche Inhalte
- **Viewport**: Mobile-optimiert (max-scale: 5)

### Semantic HTML
```html
<header> - Header-Wrapper
  <nav> - Hauptnavigation
<main> - Page Content (implizit durch {children})
<footer> - Footer
```

### Accessibility im Layout
- Semantische HTML5-Elemente
- ARIA-Labels in interaktiven Komponenten
- Keyboard-Navigation in allen Bereichen
- Focus-States visuell erkennbar
- Screen-Reader-freundliche Struktur

---

## Deployment-Konfiguration

### Vercel-Optimierungen
Das Layout ist optimiert für Vercel-Deployment:

1. **Preconnect-Hints**: Automatisch von Vercel erkannt
2. **Font-Loading**: Vercel Font Optimization kompatibel
3. **Image-Loading**: Next.js Image Optimization
4. **Static Generation**: Layout wird nur 1x gebaut

### Environment Variables
Benötigt im Root Layout (indirekt über API):
```env
NEXT_PUBLIC_WORDPRESS_URL=https://plan-dein-ding.de
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...
```

---

## Testing-Strategie für komplettes Layout

### Unit Tests
- [ ] CartProvider liefert korrekten State
- [ ] Header rendert alle Icon-Buttons
- [ ] Footer rendert alle 3 Spalten
- [ ] Font-Loading funktioniert

### Integration Tests
- [ ] Navigation zwischen Seiten
- [ ] Warenkorb bleibt bei Navigation erhalten
- [ ] Drawers öffnen/schließen korrekt
- [ ] Body-Scroll-Lock bei geöffneten Drawers

### E2E Tests
- [ ] Kompletter User-Flow (Browse → Add to Cart → Checkout)
- [ ] Mobile vs Desktop Verhalten
- [ ] Sticky Header beim Scrollen
- [ ] Footer ist immer am Ende sichtbar

### Performance Tests
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Time to Interactive (TTI) < 3s
- [ ] Cumulative Layout Shift (CLS) < 0.1

---

## Maintenance & Updates

### Regelmäßige Checks
1. **Icon-Dateien**: Umlaute in Dateinamen beheben
2. **Viewport Warning**: Auf `generateViewport` migrieren
3. **Image Quality**: Next.js 16 `images.qualities` Config hinzufügen
4. **Dependencies**: Next.js, React, TypeScript aktuell halten

### Breaking Changes (Next.js 16)
⚠️ Vorbereiten für Next.js 16:
- `viewport` aus Metadata entfernen → `generateViewport` nutzen
- `images.qualities` in `next.config.ts` definieren
- Deprecated APIs checken

---

## Zusammenfassung der Gesamtstruktur

Das Bodenjäger Layout ist ein modernes, performantes System mit:

✅ **Root Layout** mit globalen Providern
✅ **Sticky Header** mit 4 Icon-Buttons + Navigation
✅ **CartProvider** für globalen State
✅ **ContactDrawer** für schnelle Kontaktaufnahme
✅ **CartDrawer** für Warenkorb-Management
✅ **3-Spalten Footer** mit allen wichtigen Links
✅ **Responsive Design** (Mobile-First)
✅ **Performance-Optimiert** (Preconnect, Font-Loading, Code-Splitting)
✅ **SEO-Freundlich** (Metadata, Semantic HTML)
✅ **Accessibility** (ARIA, Keyboard Navigation)

**Gesamter Code-Umfang**:
- `layout.tsx`: 58 Zeilen
- `HeaderWrapper.tsx`: 7 Zeilen
- `Header.tsx`: 189 Zeilen
- `Footer.tsx`: 129 Zeilen
- `ContactDrawer.tsx`: ~200 Zeilen
- `CartDrawer.tsx`: ~300 Zeilen

**Total**: ~883 Zeilen für komplette Layout-Infrastruktur

**Entwicklungsstand**: 90% komplett (Suche + Mobile Menu ausstehend)
**Letzte vollständige Aktualisierung**: 2025-11-05