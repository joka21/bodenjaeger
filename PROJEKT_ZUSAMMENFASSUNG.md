# Projekt-Zusammenfassung: Bodenjaeger Online-Shop

**Stand:** 23. April 2026
**Projekt:** Bodenjaeger E-Commerce Shop (Next.js 15.5.9 + WooCommerce Headless)
**Status:** MVP vollstaendig funktionsfaehig | Backend migriert auf 2025.bodenjaeger.de | Payment-Architektur auf WordPress-Proxy umgestellt | Vercel-Migration steht noch an

---

## Inhaltsverzeichnis
1. [Projekt-Uebersicht](#projekt-uebersicht)
2. [Aktueller Status - April 2026](#aktueller-status---april-2026)
3. [MIGRATION: Vercel & WordPress Umzug (TODOs)](#migration-vercel--wordpress-umzug-todos)
4. [Design System & Farben](#design-system--farben)
5. [Technologie-Stack](#technologie-stack)
6. [Set-Angebot System (Detailliert)](#set-angebot-system-detailliert)
7. [Aktuelle Implementierung](#aktuelle-implementierung)
8. [API-Struktur](#api-struktur)
9. [Vollstaendige Dateistruktur](#vollstaendige-dateistruktur)
10. [Environment Variables](#environment-variables)
11. [Externe Dienste & Integrationen](#externe-dienste--integrationen)
12. [Offene Aufgaben](#offene-aufgaben)
13. [Bekannte Probleme](#bekannte-probleme)
14. [Naechste Schritte](#naechste-schritte-priorisiert)
15. [Projektstatistik](#projektstatistik)
16. [Meilensteine](#meilensteine)

---

## Projekt-Uebersicht

Bodenjaeger ist ein Online-Shop fuer Bodenbelaege (Laminat, Vinyl, Parkett) mit einem speziellen **Set-Angebot System**. Kunden koennen einen Boden mit passender Daemmung und Sockelleisten als Bundle kaufen und erhalten dabei Rabatte.

### Kern-Features
- **Set-Angebote**: Boden + Daemmung + Sockelleiste als Bundle
- **Dynamische Preisberechnung**: Unterschiedliche Rundungsregeln je nach Artikel-Typ
- **Flexible Produktauswahl**: Standard, Premium oder guenstigere Alternativen
- **Automatische Mengenberechnung**: Basierend auf Raumgroesse in m2
- **Warenkorb-System**: Persistenter Warenkorb mit localStorage
- **Checkout-Prozess**: Vollstaendiger Bestellablauf mit Kundenformular
- **Payment-Integration via WordPress-Proxy**: Stripe, PayPal und Bankueberweisung — Credentials liegen auf WordPress
- **Order-Management**: WooCommerce Order API Integration
- **Authentifizierung**: Login, Registrierung, Passwort-Reset ueber WordPress
- **Wunschliste**: WishlistContext mit localStorage
- **Cookie-Consent (DSGVO)**: CookieConsentContext mit 4 Kategorien (necessary/functional/analytics/marketing)
- **SEO/Structured Data**: JSON-LD (Organization, WebSite, Product) via `JsonLd`-Komponente
- **Newsletter**: Anmeldung ueber WordPress-Backend
- **Blog**: Dynamische Blog-Uebersicht + Blog-Detail-Seiten (WordPress-Content)
- **Fachmarkt-Seiten**: Dynamische `[slug]`-Route mit WordPress-Content (statische Subpages entfernt im Refactoring April 2026)

---

## Aktueller Status - April 2026

### Was funktioniert (MVP Complete)

Der Bodenjaeger Online-Shop ist **vollstaendig funktionsfaehig** und bereit fuer den Echtbetrieb:

#### Produkt-Display
- Produkt-Katalog mit allen WooCommerce-Produkten
- Produktdetailseiten mit Set-Angebot System
- Dynamische Preisberechnung (Frontend + Backend-Werte)
- Mengenberechnung mit korrekten Rundungsregeln
- Bestseller & Sale-Produkt Slider auf Homepage
- Kategorieseiten mit Produktuebersicht
- Muster-Bestellung (erste 3 kostenlos, danach 3 EUR/Stueck)

#### Warenkorb & Checkout
- **Warenkorb**: Vollstaendig mit localStorage, CartDrawer mit Set-Gruppierung
- **Checkout-Formular**: Alle Felder mit Validierung, abweichende Rechnungsadresse
- **Order-Erstellung**: WooCommerce API Integration mit Set-Angebot Meta-Daten

#### Payment-Integration (via WordPress-Proxy seit April 2026)
- **Architektur**: Frontend ruft WordPress-Proxy-Endpoints auf (`/wp-json/bodenjaeger/v1/...`). Stripe/PayPal-Credentials bleiben auf WordPress-Server (nicht mehr in Vercel ENV).
- **ENV-Variablen**: `PAYMENT_PROXY_URL`, `PAYMENT_PROXY_KEY` (Auth via `X-Bodenjaeger-Key` Header)
- **npm-SDKs entfernt**: `stripe` und `@stripe/stripe-js` nicht mehr in `package.json`
- **Stripe**: Kreditkarte + SOFORT via Checkout Session (vom WP-Proxy erstellt) + Webhook (weitergeleitet zu `/api/checkout/stripe/webhook`)
- **PayPal**: Order Creation & Capture via WP-Proxy (Return-URL-Flow, kein Webhook). Smart Buttons via `NEXT_PUBLIC_PAYPAL_CLIENT_ID`.
- **Bank Transfer (BACS)**: Vorkasse, Order Status "on-hold"
- **Status Stand 23.04.2026**: Code produktionsreif. Keys noch als Placeholder in `.env.local` (`DEIN_STRIPE_*_HIER` / `DEIN_PAYPAL_*_HIER`). Siehe `PAYMENT_SETUP.md`.

#### Cookie-Consent (DSGVO, April 2026)
- `CookieConsentContext` mit 4 Kategorien: necessary (always true), functional, analytics, marketing
- `CookieConsent.tsx` Banner-UI + `CookieSettingsLink.tsx` Footer-Link fuer spaetere Aenderung
- Persistenz in localStorage mit Version-Field

#### SEO & Structured Data (April 2026)
- `src/lib/schema.ts` generiert JSON-LD-Schemas (Organization, WebSite, Product)
- `src/components/JsonLd.tsx` rendert Schemas im `<head>` (Organization/WebSite global in `layout.tsx`, Product pro Produktseite)
- `buildProductSchema()` nutzt `StoreApiProduct`-Daten (Preis, Beschreibung, Bilder, Verfuegbarkeit)

#### Authentifizierung & Konto
- Login/Registrierung ueber WordPress Custom Endpoints
- AuthContext mit JWT-Token in localStorage (jetzt im Provider-Tree aktiv)
- Konto-Seite mit Bestellhistorie (`/konto/bestellungen` + `/konto/bestellungen/[id]`)
- Adressenverwaltung (`/konto/adressen`)
- Passwort-Reset-Funktion

#### Weitere Features
- Wunschliste (WishlistContext)
- Newsletter-Anmeldung
- Google Reviews Slider
- Floating Contact Button
- Responsive Design (Desktop + Mobile SetAngebot-Varianten)
- Versandkosten-Logik implementiert (kostenlos ab 200 EUR, 6 EUR ab 49 EUR, 50 EUR unter 49 EUR)

### Was in Arbeit ist

- **Payment-Keys produktiv einrichten**: WordPress-Proxy-Code ist fertig, Stripe-/PayPal-Credentials liegen als Placeholder in `.env.local` — Live-Keys muessen im WordPress-Backend hinterlegt werden
- **SMTP-Konfiguration**: E-Mails landen oft im Spam
- **Newsletter-Backend**: WordPress-Endpoint noch nicht vollstaendig (Fallback im Code)
- **MIGRATION**: Backend migriert auf `2025.bodenjaeger.de` (abgeschlossen). Vercel-Account-Migration steht noch an (siehe Migrations-Sektion)

### Deployment-Status

**Aktuell:**
- Frontend: `bodenjaeger.vercel.app` (Vercel)
- Backend: `2025.bodenjaeger.de` (WordPress + WooCommerce) — migriert von `plan-dein-ding.de`
- Build erfolgreich (`npm run build`)
- TypeScript strict mode ohne Fehler
- 24 API Routes funktionsfaehig

---

## MIGRATION: Vercel & WordPress Umzug (TODOs)

**KRITISCH: Das Projekt muss auf einen neuen Vercel-Account und ein neues WordPress-Projekt umziehen.**

### Uebersicht der Abhaengigkeiten

| System | Aktuell | Muss migriert werden |
|--------|---------|---------------------|
| **Vercel Hosting** | `bodenjaeger.vercel.app` | Neuer Vercel-Account |
| **WordPress Backend** | `2025.bodenjaeger.de` (migriert von `plan-dein-ding.de`) | Neues WordPress-Projekt |
| **Stripe** | Test-/Live-Keys gebunden an Account | Neue Keys oder Account-Transfer |
| **PayPal** | Sandbox/Live-Credentials | Neue Keys oder Account-Transfer |
| **Vercel KV (Redis)** | Optional, Upstash-basiert | Neues KV-Store erstellen |
| **Domain** | `bodenjaeger.vercel.app` | Custom Domain konfigurieren |

---

### Phase 1: Vorbereitung (VOR dem Umzug)

#### 1.1 WordPress-Backend vorbereiten
- [ ] **Neues WordPress + WooCommerce installieren** auf neuem Host
- [ ] **Custom Jaeger Plugin migrieren** — das Plugin stellt die Custom API bereit (`/wp-json/jaeger/v1/products`)
  - Plugin-Dateien kopieren und aktivieren
  - Alle 41 Custom Fields muessen verfuegbar sein (siehe `backend/ROOT_LEVEL_FIELDS.md`)
  - API-Endpoint testen: `GET /wp-json/jaeger/v1/products` muss JSON mit root-level Feldern liefern
- [ ] **WooCommerce-Produkte migrieren**
  - Alle Produkte mit Custom Fields exportieren/importieren
  - Produktbilder muessen auf dem neuen Host erreichbar sein
  - Produkt-IDs koennen sich aendern! → Auswirkung auf `daemmung_id`, `sockelleisten_id`, `daemmung_option_ids`, `sockelleisten_option_ids`
- [ ] **WooCommerce REST API Credentials erstellen**
  - Neuen Consumer Key + Secret generieren (WooCommerce > Settings > REST API)
  - Berechtigungen: Read/Write
- [ ] **WooCommerce-Einstellungen pruefen**
  - Zahlungsmethoden (BACS Bankdaten)
  - E-Mail-Templates (Bestellbestaetigung, Admin-Benachrichtigung)
  - Versandoptionen
  - Steuereinstellungen
- [ ] **WordPress Custom Endpoints pruefen**
  - `/wp-json/newsletter/v1/subscribe` (Newsletter)
  - Auth-Endpoints fuer Login/Register/Reset-Password
  - WooCommerce Customer API

#### 1.2 Inventar der hardcodierten URLs erstellen
- [ ] **`plan-dein-ding.de`** — kommt in 40+ Dateien vor. Vollstaendige Liste:

  **Konfiguration:**
  - `.env.local` → `NEXT_PUBLIC_WORDPRESS_URL`
  - `next.config.ts` → `remotePatterns` (Image-Domains)
  - `src/app/layout.tsx` → `<link rel="preconnect">` und `<link rel="dns-prefetch">`

  **API-Clients (werden automatisch ueber ENV-Variable gesteuert):**
  - `src/lib/woocommerce.ts` → liest `NEXT_PUBLIC_WORDPRESS_URL`
  - `src/lib/woocommerce-checkout.ts` → liest `NEXT_PUBLIC_WORDPRESS_URL`
  - `src/lib/auth.ts` → liest `NEXT_PUBLIC_WORDPRESS_URL`
  - `src/lib/cache.ts` → liest `NEXT_PUBLIC_WORDPRESS_URL`

  **Hardcodierte Referenzen (MUESSEN manuell geaendert werden):**
  - `src/lib/paypal.ts` → Fallback-URL `process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://plan-dein-ding.de'`
  - `src/lib/stripe.ts` → Fallback-URL
  - `src/app/api/store-api-test/route.ts` → Fallback-URL
  - Komponenten mit hardcodierten Bild-URLs (z.B. Fachmarkt-Seiten)
  - Backend-Dokumentation (`backend/*.md`)

- [ ] **`bodenjaeger.vercel.app`** — kommt in folgenden Dateien vor:
  - `src/lib/stripe.ts` → Success/Cancel URLs
  - `src/lib/paypal.ts` → Return/Cancel URLs
  - Dokumentationsdateien

- [ ] **`bodenjaeger.de`** — Image-Domain in `next.config.ts`

- [ ] **E-Mail-Adressen:**
  - `info@bodenjaeger.de` → in 15+ Dateien (Footer, Kontakt, Karriere, Impressum, etc.)
  - `support@bodenjaeger.de` → Checkout Success Page

#### 1.3 Stripe & PayPal vorbereiten
- [ ] **Stripe**: Entscheiden ob gleicher Account oder neuer Account
  - Gleicher Account: Webhook-URL aendern
  - Neuer Account: Neue API-Keys generieren, Webhook neu konfigurieren
- [ ] **PayPal**: Entscheiden ob gleicher Account oder neuer Account
  - Credentials aktualisieren
  - `PAYPAL_MODE` von `sandbox` auf `live` setzen fuer Production

---

### Phase 2: Frontend-Migration (Vercel)

#### 2.1 Neuen Vercel-Account einrichten
- [ ] **Neues Vercel-Projekt erstellen**
  - Git-Repository verknuepfen
  - Framework: Next.js (automatisch erkannt)
  - Build Command: `npm run build` (Standard)
  - Output Directory: `.next` (Standard)

#### 2.2 Environment Variables im neuen Vercel-Projekt setzen

**ERFORDERLICH:**
```
NEXT_PUBLIC_WORDPRESS_URL=https://[NEUE-WORDPRESS-URL]
NEXT_PUBLIC_SITE_URL=https://[NEUE-FRONTEND-URL]
WC_CONSUMER_KEY=ck_[NEUER_KEY]
WC_CONSUMER_SECRET=cs_[NEUES_SECRET]
PAYMENT_PROXY_URL=https://[NEUE-WORDPRESS-URL]/wp-json/bodenjaeger/v1
PAYMENT_PROXY_KEY=[PROXY_AUTH_KEY]
REVALIDATE_SECRET=[NEUES_SECRET]
```

**OPTIONAL:**
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=[CLIENT_ID_FUER_BROWSER_SDK]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[KEY]   # nur falls Stripe Elements clientseitig genutzt werden
KV_REST_API_URL=https://[NEUER_KV_STORE].upstash.io
KV_REST_API_TOKEN=[NEUER_TOKEN]
```

**Hinweis (April 2026):** Stripe-Secret-Key, Stripe-Webhook-Secret, PayPal-Secret liegen seit dem Proxy-Refactoring NICHT mehr im Frontend, sondern im WordPress-Backend. Das Frontend benoetigt nur noch `PAYMENT_PROXY_URL` und `PAYMENT_PROXY_KEY`.

- [ ] Variables fuer alle Environments setzen (Production, Preview, Development)
- [ ] `npm run check-env` nach erstem Deployment ausfuehren

#### 2.3 Code-Aenderungen fuer Migration

- [ ] **`next.config.ts`** — Image Remote Patterns aktualisieren:
  ```typescript
  remotePatterns: [
    { protocol: 'https', hostname: '[NEUE-WORDPRESS-URL]', pathname: '/wp-content/uploads/**' },
    // bodenjaeger.de beibehalten falls weiterhin relevant
  ]
  ```

- [ ] **`src/app/layout.tsx`** — Preconnect/DNS-Prefetch URLs aendern:
  ```html
  <link rel="preconnect" href="https://[NEUE-WORDPRESS-URL]" />
  <link rel="dns-prefetch" href="https://[NEUE-WORDPRESS-URL]" />
  ```

- [ ] **Hardcodierte Fallback-URLs entfernen/aktualisieren** in:
  - `src/lib/paypal.ts`
  - `src/lib/stripe.ts`
  - `src/app/api/store-api-test/route.ts`

- [ ] **Hardcodierte Bild-URLs aktualisieren** in Fachmarkt-Seiten und anderen Komponenten

- [ ] **E-Mail-Adressen pruefen** — falls neue Domain, muessen `info@bodenjaeger.de` und `support@bodenjaeger.de` aktualisiert werden

#### 2.4 Domain-Konfiguration
- [ ] **Custom Domain in Vercel hinzufuegen** (z.B. `bodenjaeger.de` oder neue Domain)
- [ ] **DNS-Records setzen** (A-Record oder CNAME auf Vercel)
- [ ] **SSL-Zertifikat** wird automatisch von Vercel bereitgestellt
- [ ] **`NEXT_PUBLIC_SITE_URL`** auf finale Domain aktualisieren

---

### Phase 3: WordPress-Backend Migration

#### 3.1 WordPress aufsetzen
- [ ] **WordPress + WooCommerce installieren**
- [ ] **Custom Jaeger Plugin installieren und aktivieren**
- [ ] **WooCommerce konfigurieren:**
  - Waehrung: EUR
  - Steuereinstellungen
  - Versandoptionen
  - Zahlungsmethoden (BACS mit Bankdaten)
  - E-Mail-Templates

#### 3.2 Daten migrieren
- [ ] **Produkte exportieren/importieren**
  - WooCommerce CSV Export/Import oder Plugin (z.B. WP All Import)
  - ACHTUNG: Custom Fields (41 Felder) muessen mitmigriert werden
  - Produkt-IDs werden sich wahrscheinlich aendern
- [ ] **Produkt-Verknuepfungen pruefen:**
  - `daemmung_id` und `sockelleisten_id` zeigen auf Produkt-IDs
  - `daemmung_option_ids` und `sockelleisten_option_ids` sind ID-Arrays
  - Diese muessen auf die neuen Produkt-IDs gemappt werden!
- [ ] **Produktbilder migrieren**
  - Alle Bilder aus `/wp-content/uploads/` kopieren
  - URLs in Produkten pruefen
- [ ] **Kategorien migrieren**
  - Kategorie-Slugs muessen identisch sein (Frontend nutzt Slugs fuer Routing)
  - Wichtige Slugs: `vinylboden`, `laminat`, `parkett`, `zubehoer`, `sale`
- [ ] **Seiten/Blog-Inhalte migrieren** (falls vorhanden)

#### 3.3 API-Funktionalitaet verifizieren
- [ ] **Jaeger API testen**: `GET https://[NEUE-URL]/wp-json/jaeger/v1/products`
  - Alle 41 Custom Fields auf Root-Level vorhanden?
  - Pagination funktioniert?
  - Filter (category, search, include) funktionieren?
- [ ] **WooCommerce REST API testen**: `GET https://[NEUE-URL]/wp-json/wc/v3/orders`
  - Authentifizierung mit neuen Credentials?
  - Order-Erstellung funktioniert?
- [ ] **Produkt-Beschreibung API testen**: `GET https://[NEUE-URL]/wp-json/wc/v3/products/{id}`
  - HTML-Tabelle fuer Eigenschaften-Tab vorhanden?
- [ ] **Auth-Endpoints testen**:
  - Login, Register, Password-Reset
- [ ] **Newsletter-Endpoint testen**:
  - `POST /wp-json/newsletter/v1/subscribe`

#### 3.4 WordPress-Plugins pruefen
- [ ] **SMTP-Plugin installieren** (WP Mail SMTP oder aehnlich)
  - E-Mail-Zustellung konfigurieren (SendGrid, Mailgun, etc.)
- [ ] **CORS-Einstellungen pruefen**
  - Neue Frontend-Domain muss zugelassen sein
- [ ] **Permalink-Struktur** auf "Beitragsname" setzen (fuer REST API)

---

### Phase 4: Webhooks & Externe Dienste

#### 4.1 Stripe Webhooks
- [ ] **Neuen Webhook erstellen** im Stripe Dashboard:
  - URL: `https://[NEUE-FRONTEND-URL]/api/checkout/stripe/webhook`
  - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
- [ ] **Webhook Secret** in Vercel Environment setzen (`STRIPE_WEBHOOK_SECRET`)
- [ ] **Test-Zahlung durchfuehren** und Webhook-Empfang pruefen

#### 4.2 Cache Revalidation Webhook
- [ ] **WordPress Webhook einrichten** (WooCommerce > Settings > Webhooks oder Plugin):
  - URL: `https://[NEUE-FRONTEND-URL]/api/revalidate?secret=[REVALIDATE_SECRET]`
  - Events: Product Created, Product Updated, Product Deleted
  - Payload: `{ "product_id": id, "product_slug": slug, "action": "updated" }`

#### 4.3 PayPal (falls aktiviert)
- [ ] PayPal Return/Cancel URLs werden dynamisch ueber `NEXT_PUBLIC_SITE_URL` generiert
- [ ] Testen ob Capture-Flow funktioniert

#### 4.4 Vercel KV (falls genutzt)
- [ ] **Neuen KV-Store erstellen** im neuen Vercel-Dashboard
- [ ] KV-Credentials in Environment Variables setzen
- [ ] Cache-Funktionalitaet testen

---

### Phase 5: Testen & Go-Live

#### 5.1 Vollstaendiger Funktionstest
- [ ] **Produktseiten laden** — Bilder, Preise, Custom Fields korrekt?
- [ ] **Set-Angebot-System testen** — Daemmung/Sockelleiste Auswahl, Preisberechnung
- [ ] **Mengenberechnung testen** — m2-Eingabe, Paket-Rundung
- [ ] **Warenkorb testen** — Hinzufuegen, Entfernen, Set-Gruppierung
- [ ] **Checkout-Flow komplett durchspielen:**
  - [ ] Stripe-Zahlung (Testkarte `4242 4242 4242 4242`)
  - [ ] PayPal-Zahlung (Sandbox)
  - [ ] Bankueberweisung (BACS)
- [ ] **Order in WooCommerce pruefen** — wurde korrekt erstellt?
- [ ] **E-Mail-Zustellung pruefen** — Bestellbestaetigung erhalten?
- [ ] **Success Page** — Order-Details korrekt angezeigt?
- [ ] **Login/Register testen**
- [ ] **Newsletter-Anmeldung testen**
- [ ] **Wunschliste testen**
- [ ] **Muster-Bestellung testen**
- [ ] **Kategorieseiten testen** — Slugs korrekt, Produkte geladen?
- [ ] **Fachmarkt-Seiten testen** — Bilder laden?
- [ ] **Mobile Ansicht testen** — SetAngebotMobile funktioniert?

#### 5.2 Performance & SEO
- [ ] **Lighthouse-Test** auf neuer Domain
- [ ] **Bilder-Loading** — kein 404 fuer WordPress-Bilder?
- [ ] **ISR/Revalidation testen** — Produkt aendern, Cache aktualisieren
- [ ] **Sitemap pruefen** (falls vorhanden)
- [ ] **robots.txt pruefen**

#### 5.3 Go-Live Checkliste
- [ ] **DNS umstellen** auf neue Vercel-Deployment
- [ ] **Stripe auf Live-Mode umstellen** (`pk_live_`, `sk_live_`)
- [ ] **PayPal auf Live-Mode umstellen** (`PAYPAL_MODE=live`)
- [ ] **Alte Vercel-Deployment deaktivieren/loeschen**
- [ ] **Altes WordPress-Backend: Redirect oder Abschaltung planen**
- [ ] **Monitoring einrichten** — Vercel Analytics oder externe Loesung

---

### Migrations-Risiken & Fallstricke

| Risiko | Impact | Mitigation |
|--------|--------|------------|
| **Produkt-IDs aendern sich** | Set-Angebot-Verknuepfungen brechen | ID-Mapping-Tabelle erstellen, alle `*_id` Felder aktualisieren |
| **Custom Fields fehlen** | Preisanzeige/Set-System bricht | Jaeger Plugin zuerst installieren & testen |
| **CORS blockiert** | Frontend kann Backend nicht erreichen | WordPress CORS-Header fuer neue Domain konfigurieren |
| **Bilder 404** | Produktseiten ohne Bilder | Upload-Pfade pruefen, `next.config.ts` Remote Patterns anpassen |
| **Stripe Webhook fehlt** | Zahlungsstatus wird nicht aktualisiert | Webhook VOR Go-Live konfigurieren und testen |
| **Kategorie-Slugs anders** | 404-Seiten fuer Kategorien | Slugs identisch halten oder Redirects einrichten |
| **E-Mails im Spam** | Kunden erhalten keine Bestellbestaetigung | SMTP-Plugin mit verifizierter Domain konfigurieren |

---

## Design System & Farben

### Brand Colors
```css
--color-primary: #ed1b24;        /* Bodenjaeger Rot - Hauptfarbe/Accent */
--color-accent: #ed1b24;         /* Alias fuer Primary */
```

### Text Colors
```css
--color-text-primary: #2e2d32;   /* Haupt-Textfarbe (Dunkelgrau) */
--color-text-light: #ffffff;     /* Text auf dunklem Hintergrund */
--color-text-dark: #4c4c4c;      /* Dunklerer Text */
```

### Background Colors
```css
--color-bg-white: #ffffff;       /* Weisser Hintergrund */
--color-bg-light: #f9f9fb;       /* Heller Hintergrund */
--color-bg-gray: #e5e5e5;        /* Grauer Hintergrund */
--color-bg-dark: #4c4c4c;        /* Dunkler Hintergrund */
--color-bg-darkest: #2e2d32;     /* Dunkelster Hintergrund */
```

### Gradients
```css
--gradient-mid-to-sky: radial-gradient(circle at center, #a8dcf4 0%, #5095cb 100%);
/* Sky Blue #a8dcf4 -> Mid Blue #5095cb */
```

### Tailwind v4 Farb-Utilities (definiert in `@theme inline`)
- `text-brand / bg-brand` -> `#ed1b24`
- `text-dark / bg-dark` -> `#2e2d32`, `text-mid / bg-mid` -> `#4c4c4c`
- `text-ash / bg-ash / border-ash` -> `#e5e5e5`, `bg-pale` -> `#f9f9fb`
- `text-navy / bg-navy` -> `#1e40af`, `text-ocean / bg-ocean` -> `#5095cb`
- `text-success / bg-success` -> `#28a745`

### Verwendung
Alle Farben sind als CSS Custom Properties in `src/app/globals.css` definiert:
```css
background-color: var(--color-primary);
color: var(--color-text-primary);
background: var(--gradient-mid-to-sky);
```

---

## Technologie-Stack

### Frontend
- **Framework**: Next.js 15.5.9 (App Router)
- **Build Tool**: Turbopack
- **UI**: React 19.1.0 + TypeScript 5
- **Styling**: Tailwind CSS v4 + CSS Custom Properties (kein `tailwind.config.js`, nur CSS)
- **Icons**: Lucide React 0.544.0
- **State Management**: React Context API (CookieConsent, Auth, Cart, Wishlist)
- **Storage**: localStorage (Warenkorb, Wunschliste, Auth-Token, Cookie-Consent)
- **Image Optimization**: Next.js Image Component (AVIF + WebP)
- **Fonts**: Poppins (lokal, Regular + Bold)
- **Dependencies (Runtime)**: nur `@vercel/kv`, `clsx`, `lucide-react`, `next`, `react`, `react-dom` (Stripe-/PayPal-SDKs entfernt, Payment laeuft ueber WordPress-Proxy)

### Backend / CMS
- **WooCommerce**: Headless CMS fuer Produktverwaltung
- **Custom Jaeger Plugin**: WordPress Plugin fuer 41 Custom Fields
- **API**:
  - `/wp-json/jaeger/v1/` (Produkt-API mit Root-Level Custom Fields)
  - `/wp-json/wc/v3/` (Order-API, Produkt-Beschreibung)
  - Custom Auth-Endpoints (Login, Register, Reset)
  - Custom Newsletter-Endpoint

### Payments (via WordPress-Proxy seit April 2026)
- **Proxy**: `https://2025.bodenjaeger.de/wp-json/bodenjaeger/v1/*` (Auth via `X-Bodenjaeger-Key`)
- **Stripe**: Kreditkarten + SOFORT (Checkout Session vom WP-Proxy)
- **PayPal**: Return-URL-Flow (Order Creation + Capture vom WP-Proxy)
- **Bank Transfer**: BACS (Vorkasse/Ueberweisung)
- **npm-SDKs**: nicht mehr benoetigt (keine Stripe/PayPal-Pakete im `package.json`)

### Infrastruktur
- **Hosting**: Vercel (automatisches Deployment via Git)
- **Domain**: bodenjaeger.vercel.app (aktuell)
- **WordPress Backend**: 2025.bodenjaeger.de (migriert von plan-dein-ding.de)
- **Caching**: Vercel KV / Upstash Redis (optional, 30s TTL)
- **CI/CD**: Keine GitHub Actions, Vercel Git Integration

---

## Set-Angebot System (Detailliert)

Das Set-Angebot System ist das Herzstueck des Shops. Es ermoeglicht Kunden, Boden-Bundles mit Rabatten zu kaufen.

### Grundprinzip

**Ein Set-Angebot besteht aus:**
1. **Hauptprodukt (Boden)**: Pflichtprodukt, definiert das Set
2. **Daemmung (Optional)**: Standard oder Premium-Varianten
3. **Sockelleiste (Optional)**: Standard oder Premium-Varianten

### Artikel-Kategorisierung

Jedes Zubehoer-Produkt (Daemmung/Sockelleiste) wird automatisch kategorisiert:

| Kategorie | Bedingung | Set-Preis | Rundung |
|-----------|-----------|-----------|---------|
| **Standard-Artikel** | `verrechnung === 0` | **0 EUR** (kostenlos) | ABRUNDEN |
| **Aufpreis-Artikel** | `verrechnung > 0` | **nur Differenz** | AUFRUNDEN |
| **Billigere Artikel** | `preis < standardPreis` | **0 EUR** (keine Rueckerstattung) | ABRUNDEN |

### Verrechnung-Feld

Das `verrechnung` Feld ist der **Schluessel** zur Preisberechnung:

```typescript
// Dynamische Berechnung im Frontend (mit Backend-Fallback)
const verrechnung = produkt.verrechnung ?? Math.max(0, produktPreis - standardPreis);
```

**Beispiel:**
- Standard-Sockelleiste: 3,00 EUR/m -> `verrechnung = 0`
- Premium-Sockelleiste: 9,00 EUR/m -> `verrechnung = 6,00 EUR/m`
- Guenstige Alternative: 2,00 EUR/m -> `verrechnung = 0` (keine Rueckerstattung!)

### Mengenberechnung

#### 1. Boden (Hauptprodukt)
```typescript
wantedM2 = 26.7;
packages = Math.ceil(wantedM2 / paketinhalt);
actualM2 = packages * paketinhalt;
// Beispiel: 26.7 m2 / 2.67 m2 = 10.01 -> 11 Pakete = 29.37 m2
```

#### 2. Daemmung (falls gewaehlt)
```typescript
// REGULAER (Einzelkauf): AUFRUNDEN
paketeRegular = Math.ceil(actualM2 / daemmungPaketinhalt);

// SET-ANGEBOT: Standard/Billiger = ABRUNDEN + kostenlos, Aufpreis = AUFRUNDEN + nur Differenz
if (istStandard || istBilliger) {
  paketeSet = Math.floor(actualM2 / daemmungPaketinhalt);
  setPrice = 0;
} else {
  paketeSet = Math.ceil(actualM2 / daemmungPaketinhalt);
  setPrice = paketeSet * daemmungPaketinhalt * verrechnung;
}
```

#### 3. Sockelleiste (falls gewaehlt)
```typescript
// Faustformel: m2 * 1.0 = lfm
baseboardLfm = floorM2 * 1.0;

// Gleiche Rundungslogik wie Daemmung, aber lfm-basiert
```

### Gesamt-Preisberechnung
```typescript
comparisonPrice = bodenPrice + daemmungRegularPrice + sockelleisteRegularPrice;
totalPrice = bodenPrice + daemmungSetPrice + sockelleisteSetPrice;
savings = comparisonPrice - totalPrice;
savingsPercent = (savings / comparisonPrice) * 100;
```

### Zwei unabhaengige Preis-Anzeigen (MUESSEN getrennt bleiben)

1. **"Gesamt" (SetAngebot.tsx - Oben)**: Statischer Preis pro Einheit (EUR/m2). Aendert sich NUR bei Daemmung/Sockelleiste-Wechsel, NICHT bei m2-Eingabe.
2. **"Gesamtsumme" (TotalPrice.tsx - Unten)**: Dynamischer Gesamtpreis. Aendert sich mit m2-Eingabe.

Alle Preise berechnet in `ProductPageContent.tsx` (Single Source of Truth) und als Props weitergegeben.

### Wichtige Rundungsregeln

| Kontext | Artikel-Typ | Rundung | Grund |
|---------|-------------|---------|-------|
| **Regulaerer Kauf** | Alle | `Math.ceil()` | Kunde muss ganze Pakete kaufen |
| **Set-Angebot** | Standard/Billiger | `Math.floor()` | Kundenfreundlich, kostenlos |
| **Set-Angebot** | Aufpreis | `Math.ceil()` | Faire Verrechnung des Aufpreises |

---

## Aktuelle Implementierung

### Implementierte Features

#### 1. Set-Angebot Preisberechnung (src/components/product/ProductPageContent.tsx)
- Vollstaendige Logik fuer Boden, Daemmung, Sockelleiste (~600+ Zeilen)
- Dynamische `verrechnung` Berechnung (Frontend-Fallback)
- `handleProductSelection` mit `useCallback` (verhindert Race Condition Desktop/Mobile)
- Produkt-Typ-Erkennung via Kategorie-Slug

#### 2. Mengenberechnung (src/lib/setCalculations.ts)
- Paketberechnung fuer Boden (mit Verschnitt)
- Daemmung-Berechnung (m2-basiert)
- Sockelleisten-Berechnung (lfm-basiert)
- Keine Preis-Logik in dieser Datei

#### 3. API & Datenstruktur (src/lib/woocommerce.ts)
- Custom Jaeger API Integration
- 41 Root-Level Custom Fields
- Singleton `wooCommerceClient` Klasse mit Lazy Config Init
- Optional: Redis/KV Cache via `@vercel/kv` (30s TTL, fails gracefully)
- `StoreApiProduct` Interface (massgeblicher Typ)

#### 4. Zwei separate API-Clients (NICHT austauschbar!)
- `woocommerce.ts` → Jaeger API, Produkt-Fetching (SSR), `btoa()` Auth
- `woocommerce-checkout.ts` → WC REST API v3, Orders (Server-Side), `Buffer.from()` Auth

#### 5. Warenkorb-System (src/contexts/CartContext.tsx)
- Set-Items verknuepft durch `setId`
- `addSetToCart()` generiert `setId = set-${Date.now()}-${random}`
- Muster-Pricing: erste 3 kostenlos, dann 3 EUR/Stueck
- `isCartDrawerOpen` lebt im CartContext
- CartDrawer konvertiert `CartItem[]` zu `CartSetItem | CartSingleItem` (Discriminated Union)

#### 6. Checkout-Prozess
- Eigener `useState` (NICHT CheckoutContext)
- Branching: stripe -> Checkout Session, paypal -> Approval URL, bacs -> on-hold
- Success Page liest Query Params und cleared localStorage

#### 7. Versandkosten (zwei getrennte Systeme!)
- `cart-utils.ts`: `calculateShipping()` gibt immer 0 zurueck (CartDrawer: "Kostenlos")
- `shippingConfig.ts`: Echte Staffelung (kostenlos ab 200 EUR, 6 EUR ab 49 EUR, 50 EUR unter 49 EUR) — NUR im Checkout

---

## API-Struktur

### Jaeger Custom API (Produkte)

**Endpoint:** `https://[WORDPRESS_URL]/wp-json/jaeger/v1/products`

**Parameter:**
```
?per_page=20          # Anzahl Produkte
?category=sale        # Nach Kategorie filtern
?include=1234,5678    # Spezifische IDs laden
?search=vinyl         # Suche
?orderby=popularity   # Sortierung
?slug=produkt-name    # Nach Slug
?id=123               # Nach ID
```

### WooCommerce REST API v3 (Orders + Beschreibungen)

**Endpoint:** `https://[WORDPRESS_URL]/wp-json/wc/v3/`

```
POST   /wc/v3/orders              # Order erstellen
GET    /wc/v3/orders/{id}         # Order abrufen
PUT    /wc/v3/orders/{id}         # Order aktualisieren
POST   /wc/v3/orders/{id}/notes   # Notiz hinzufuegen
GET    /wc/v3/products/{id}       # Produkt-Beschreibung (HTML-Tabelle)
```

### Next.js API Routes (24 Routen)

**Produkte (5):**
```
GET    /api/products                    # Alle Produkte (gefiltert)
GET    /api/products/[slug]             # Produkt nach Slug
POST   /api/products/by-ids             # Batch nach IDs
GET    /api/products/search             # Produkt-Suche
GET    /api/products/samples            # Muster-Pricing
```

**Checkout & Payments (5):**
```
POST   /api/checkout/create-order       # WooCommerce Order erstellen
GET    /api/checkout/order/[id]         # Order-Status abrufen
POST   /api/checkout/stripe/webhook     # Stripe Payment Webhook
GET    /api/checkout/paypal/capture      # PayPal Payment Capture
POST   /api/newsletter/subscribe        # Newsletter-Anmeldung
```

**Authentifizierung (8):**
```
POST   /api/auth/register              # Registrierung
POST   /api/auth/login                 # Login
POST   /api/auth/logout                # Logout
GET    /api/auth/me                    # Aktueller User
GET    /api/auth/customer              # Kundendaten
GET    /api/auth/orders                # Bestellungen
GET    /api/auth/orders/[id]           # Einzelne Bestellung
POST   /api/auth/reset-password        # Passwort-Reset
```

**Cache & System (1):**
```
POST   /api/revalidate                  # ISR Cache invalidieren (mit Secret)
```

**Test/Debug (5):** — Alle geben 403 in Production zurueck
```
GET    /api/test-wc-auth
GET    /api/test-wc
GET    /api/test-order
GET    /api/test-connection
GET    /api/store-api-test
```

### Root-Level Custom Fields (41 Felder)

#### Paketinformationen (9)
```typescript
paketpreis?: number;           // Preis pro Paket
paketpreis_s?: number;         // Zusaetzlicher Paketpreis
paketinhalt?: number;          // Inhalt pro Paket (m2 oder lfm)
einheit?: string;              // "Quadratmeter" / "Meter"
einheit_short?: string;        // "m2" / "m"
verpackungsart?: string;       // "Paket" / "Stueck"
verpackungsart_short?: string; // "Pkt." / "Stk."
verschnitt?: number;           // Verschnitt-Prozent (nur Boden)
verrechnung?: number;          // Aufpreis zum Standard-Produkt
```

#### Set-Angebot Konfiguration (6)
```typescript
show_setangebot?: boolean;
setangebot_titel?: string;
setangebot_text_color?: string;
setangebot_text_size?: string;
setangebot_button_style?: string;
setangebot_rabatt?: number;
```

#### Set-Angebot Berechnete Werte (4)
```typescript
setangebot_einzelpreis?: number;
setangebot_gesamtpreis?: number;
setangebot_ersparnis_euro?: number;
setangebot_ersparnis_prozent?: number;
```

#### Zusatzprodukte (4)
```typescript
daemmung_id?: number;
sockelleisten_id?: number;
daemmung_option_ids?: number[];
sockelleisten_option_ids?: number[];
```

#### UVP System (3)
```typescript
show_uvp?: boolean;
uvp?: number;
uvp_paketpreis?: number;
```

#### Aktionen & Badges (10)
```typescript
show_aktion?: boolean;
aktion?: string;
aktion_text_color?: string;
aktion_text_size?: string;
aktion_button_style?: string;
show_angebotspreis_hinweis?: boolean;
angebotspreis_hinweis?: string;
angebotspreis_text_color?: string;
angebotspreis_text_size?: string;
angebotspreis_button_style?: string;
```

#### Produktbeschreibung (3)
```typescript
show_text_produktuebersicht?: boolean;
text_produktuebersicht?: string;
artikelbeschreibung?: string;
```

#### Lieferzeit (2)
```typescript
show_lieferzeit?: boolean;
lieferzeit?: string;
```

---

## Vollstaendige Dateistruktur

### Source Code
```
src/
├── app/
│   ├── globals.css                       # Tailwind v4 + CSS Custom Properties
│   ├── layout.tsx                        # Root Layout (Provider Hierarchy)
│   ├── page.tsx                          # Startseite
│   ├── fonts/                            # Poppins Font-Dateien (lokal)
│   │
│   ├── products/[slug]/page.tsx          # Produktseite (SSR, revalidate: 30)
│   ├── category/[slug]/page.tsx          # Kategorieseite
│   ├── cart/page.tsx                     # Warenkorb
│   ├── checkout/
│   │   ├── page.tsx                      # Checkout-Formular
│   │   └── success/page.tsx              # Bestellbestaetigung
│   ├── login/page.tsx                    # Login
│   ├── konto/page.tsx                    # Kundenkonto
│   ├── newsletter/page.tsx               # Newsletter
│   ├── blog/
│   │   ├── page.tsx                      # Blog-Uebersicht (dynamisch)
│   │   └── [slug]/page.tsx               # Blog-Detail (WordPress-Post)
│   │
│   ├── fachmarkt-hueckelhoven/           # Fachmarkt-Seiten (dynamisch seit April 2026)
│   │   ├── page.tsx                      # Hauptseite
│   │   └── [slug]/page.tsx               # Dynamische Subpage (WordPress-Content via FachmarktSubpage.tsx)
│   │
│   ├── konto/                            # Kundenkonto (mit Layout)
│   │   ├── page.tsx                      # Konto-Dashboard
│   │   ├── layout.tsx                    # Konto-Layout mit Navigation
│   │   ├── bestellungen/page.tsx         # Bestellhistorie
│   │   ├── bestellungen/[id]/page.tsx    # Einzelne Bestellung
│   │   ├── adressen/page.tsx             # Gespeicherte Adressen
│   │   └── einstellungen/page.tsx        # Konto-Einstellungen
│   │
│   ├── bestseller/page.tsx               # Bestseller-Produkte
│   ├── sale/page.tsx                     # Sale-Produkte
│   ├── search/page.tsx                   # Produkt-Suche
│   ├── favoriten/page.tsx                # Wunschliste/Favoriten
│   ├── kontakt/page.tsx                  # Kontakt-Seite
│   ├── karriere/page.tsx                 # Karriere-Seite
│   ├── service/page.tsx                  # Service-Uebersicht
│   ├── passwort-vergessen/page.tsx       # Passwort-Reset
│   │
│   ├── agb/, datenschutz/, impressum/    # Rechtsseiten
│   ├── widerruf/, versand-lieferzeit/
│   │
│   ├── styleguide/page.tsx               # Design System Doku
│   ├── sitemap-page/page.tsx             # Sitemap
│   ├── product-cards/page.tsx            # Produktkarten-Demo
│   ├── api-test/page.tsx                 # API-Test Interface
│   ├── todo/page.tsx                     # Aufgaben-Tracking
│   ├── payment-setup/, woocommerce-setup/ # Debug-Seiten
│   │
│   └── api/                              # 24 API Routes (siehe API-Struktur)
│       ├── products/                     # 5 Produkt-Routes
│       ├── checkout/                     # 4 Checkout-Routes
│       ├── auth/                         # 8 Auth-Routes
│       ├── newsletter/                   # 1 Newsletter-Route
│       ├── revalidate/                   # 1 Cache-Route
│       └── test-*/                       # 5 Debug-Routes
│
├── components/
│   ├── product/
│   │   ├── ProductPageContent.tsx        # Haupt-Orchestrator (600+ Zeilen)
│   │   ├── ProductInfo.tsx               # Produkt-Details & Input
│   │   ├── SetAngebot.tsx                # Set-Angebot Desktop
│   │   ├── SetAngebotMobile.tsx          # Set-Angebot Mobile
│   │   ├── TotalPrice.tsx                # Gesamtpreis (dynamisch)
│   │   ├── QuantitySelector.tsx          # Mengen-Eingabe (+/- Buttons)
│   │   ├── ImageGallery.tsx              # Bildgalerie mit Zoom/Thumbnails
│   │   └── ZubehoerSlider.tsx            # Zubehoer-Karussell (Cross-Selling)
│   │
│   ├── cart/
│   │   ├── CartDrawer.tsx                # Warenkorb-Drawer (Set-Gruppierung)
│   │   ├── CartFooter.tsx                # Drawer-Footer mit Checkout-Button
│   │   ├── CartSingleItem.tsx            # Einzelprodukt im Warenkorb
│   │   ├── CartSetItem.tsx               # Bundle/Set im Warenkorb
│   │   └── QuantityStepper.tsx           # Mengen-Stepper im Warenkorb
│   │
│   ├── checkout/
│   │   ├── CheckoutLayout.tsx            # Checkout Layout Wrapper
│   │   ├── ProgressIndicator.tsx         # Schritt-Anzeige
│   │   ├── ContactStep.tsx               # Kontakt-Schritt
│   │   ├── ContactForm.tsx               # E-Mail/Telefon Formular
│   │   ├── ShippingForm.tsx              # Versandadresse Formular
│   │   ├── PaymentStep.tsx               # Zahlungsart-Auswahl
│   │   ├── PaymentOptions.tsx            # Zahlungs-Buttons
│   │   ├── ReviewStep.tsx                # Bestelluebersicht
│   │   ├── OrderSummary.tsx              # Warenkorb-Zusammenfassung
│   │   ├── ExpressCheckout.tsx           # Schnell-Checkout (PayPal/Apple Pay)
│   │   └── TrustBadges.tsx               # Vertrauens-Badges
│   │
│   ├── navigation/
│   │   ├── MobileMenu.tsx                # Mobile Navigation (3-Level)
│   │   ├── MobileMenuHeader.tsx          # Mobile Menu Header
│   │   ├── MobileMenuLevel1.tsx          # Ebene 1: Hauptkategorien
│   │   ├── MobileMenuLevel2.tsx          # Ebene 2: Unterkategorien
│   │   └── MobileMenuLevel3.tsx          # Ebene 3: Produkte/Blatt
│   │
│   ├── category/
│   │   └── CategoryPageClient.tsx        # Kategorieseite mit Filter/Sortierung
│   │
│   ├── sections/home/
│   │   ├── BestsellerSlider.tsx          # Bestseller-Karussell
│   │   ├── SaleProductSlider.tsx         # Sale-Produkt-Karussell
│   │   ├── BodenkategorienSection.tsx    # Bodenkategorien Showcase
│   │   ├── VorteileSlider.tsx            # Vorteile-Karussell
│   │   └── GoogleReviewsSlider.tsx       # Google Reviews Karussell (Quelle: src/data/google-reviews.json)
│   │
│   ├── startseite/
│   │   └── HeroSlider.tsx                # Hero-Banner Karussell (verschoben April 2026)
│   │
│   ├── Header.tsx                        # Hauptnavigation
│   ├── HeaderWrapper.tsx                 # Header Wrapper
│   ├── Footer.tsx                        # Seiten-Footer
│   ├── FloatingContactButton.tsx         # Sticky Kontakt-Button
│   ├── ContactDrawer.tsx                 # Kontakt-Drawer (Slide-out)
│   ├── CookieConsent.tsx                 # DSGVO Cookie-Banner (NEU April 2026)
│   ├── CookieSettingsLink.tsx            # Footer-Link zum Cookie-Consent neu oeffnen
│   ├── JsonLd.tsx                        # JSON-LD Structured Data Renderer (NEU April 2026)
│   ├── LiveSearch.tsx                    # Echtzeit-Produktsuche mit Autocomplete
│   ├── AlertModal.tsx                    # Generischer Modal-Dialog
│   ├── ProductCard.tsx                   # Generische Produktkarte
│   ├── StandardProductCard.tsx           # Standard Produktkarte
│   ├── UnifiedProductCard.tsx            # Unified Produktkarte (mehrere Modi)
│   ├── NewsletterSignup.tsx              # Newsletter-Formular
│   ├── FooterNewsletterSignup.tsx        # Footer-Newsletter
│   ├── FachmarktPage.tsx                 # Fachmarkt-Hauptseite Template
│   ├── FachmarktSubpage.tsx              # Fachmarkt-Subpage Template (WP-Content, NEU April 2026)
│   ├── ServicePage.tsx                   # Service-Seitentemplate
│   ├── KontaktPage.tsx                   # Kontakt-Seite
│   ├── KarrierePage.tsx                  # Karriere-Seite
│   ├── VersandLieferzeitPage.tsx         # Versand-Info
│   └── WordPressPage.tsx                 # Dynamische WP-Content Seite
│
├── contexts/
│   ├── CookieConsentContext.tsx          # DSGVO Cookie-Consent (NEU April 2026)
│   ├── AuthContext.tsx                   # Authentifizierung (JWT in localStorage)
│   ├── CartContext.tsx                   # Warenkorb (localStorage: 'woocommerce-cart')
│   ├── WishlistContext.tsx               # Wunschliste
│   └── CheckoutContext.tsx               # DEAD CODE — nicht im Provider-Tree!
│
├── lib/
│   ├── woocommerce.ts                    # Produkt-API Client + StoreApiProduct Type
│   ├── woocommerce-checkout.ts           # Order-API Client (Server-Side Only!)
│   ├── setCalculations.ts                # Mengenberechnung (KEINE Preise)
│   ├── sampleUtils.ts                    # Muster-Pricing Utilities (NEU April 2026)
│   ├── schema.ts                         # JSON-LD Schema Builder (NEU April 2026)
│   ├── stripe.ts                         # Stripe via WordPress-Proxy (refactored April 2026)
│   ├── paypal.ts                         # PayPal via WordPress-Proxy (refactored April 2026)
│   ├── auth.ts                           # WordPress Auth-Client
│   ├── cache.ts                          # Vercel KV Cache (optional)
│   ├── shippingConfig.ts                 # Versandkosten-Staffelung
│   ├── cart-utils.ts                     # formatPrice(), calculateShipping() (= 0)
│   ├── rate-limit.ts                     # In-Memory Rate Limiting
│   ├── imageUtils.ts                     # Bild-Optimierung
│   ├── productHelpers.ts                 # Produkt-Hilfsfunktionen (Kategorie-Erkennung)
│   ├── wordpress.ts                      # WordPress REST API Client (Pages/Posts)
│   ├── dummy-data.ts                     # Mock-Daten fuer Entwicklung
│   ├── mock-products.ts                  # Mock-Produkt-Fixtures
│   └── api/
│       ├── adapters.ts                   # VERALTET — liest jaeger_meta.* statt Root-Level
│       ├── jaegerApi.ts                  # Jaeger Plugin REST API Client
│       ├── product-full.ts               # Vollstaendige Produktdaten
│       ├── product-options.ts            # Produkt-Optionen/Varianten
│       └── products-critical.ts          # Critical-Path Produkt-Optimierung
│
├── data/
│   └── google-reviews.json               # Google Reviews Quelle (NEU April 2026)
│
├── types/
│   ├── product.ts                        # Product Type Definitions
│   ├── product-optimized.ts              # Geplante Types (nicht primaer)
│   ├── checkout.ts                       # Checkout-Types (Steps, Adressen, Versand)
│   ├── cart-drawer.ts                    # Cart-Drawer Types (CartSetItem, CartSingleItem)
│   └── mobile-menu.ts                    # Mobile-Menu Types (Kategorien, Navigation)
│
└── scripts/
    └── check-env.js                      # Environment Variable Validator
```

### Weitere Projekt-Dateien
```
Root:
├── .env.local                            # Environment Variables (NICHT in Git!)
├── next.config.ts                        # Next.js + Image Remote Patterns
├── postcss.config.mjs                    # PostCSS mit @tailwindcss/postcss
├── tsconfig.json                         # TypeScript Konfiguration
├── eslint.config.mjs                     # ESLint 9 (Flat Config)
├── vercel.json                           # Minimal: { "framework": "nextjs" }
├── package.json                          # Dependencies & Scripts
├── CLAUDE.md                             # Projekt-Anweisungen fuer Claude
└── PROJEKT_ZUSAMMENFASSUNG.md            # Diese Datei

public/images/
├── logo/                                 # Bodenjaeger Logo (SVG, weiss)
├── Icons/                                # 38 UI-Icons (dunkel + hell Varianten)
│   └── schieferschwarz/, weiss/          # Warenkorb, Favoriten, Kontakt, Lupe, etc.
├── sliderbilder/                         # Hero-Carousel (COREtec, primeCORE)
├── Startseite/                           # Homepage-Bilder (Kategorien + Vorteile)
└── vorlagen/                             # Layout-Vorlagen (ist/ + soll/ Mockups)

backend/
├── ROOT_LEVEL_FIELDS.md                  # Alle 41 Custom Fields
├── VERRECHNUNG_FELD_BACKEND.md           # Backend-Anforderung
├── API_FIELDS_PARAMETER.md               # API-Parameter Doku
├── API_FELDER_MAPPING.md                 # Feld-Mapping Frontend <-> WooCommerce
├── API_TEST_ERGEBNISSE_2025-11-16.md     # API-Testergebnisse
├── BACKEND_FIX_COMPLETED.md              # Abgeschlossene Backend-Fixes
├── BACKEND_REQUEST_EINHEIT_SHORT_ROOT_LEVEL.md # Einheiten-Feld Konfiguration
├── FEHLENDE_API_FELDER.md                # Fehlende API-Felder
└── FRONTEND_BACKEND_DATENFLUSS.md        # Datenfluss-Doku

Jaeger-Plugin/                             # WordPress Custom Plugin
├── JaegerPlugin.php                      # Plugin-Bootstrap
├── includes/                             # Autoloader, Error Handler
├── backend/                              # Admin: Custom Fields, API, Shortcodes (10+ Dateien)
├── frontend/                             # Konfigurator, Produkt-Slider
│   ├── product-slider/                   # Produkt-Slider (Data + Display Handler)
│   ├── set-angebot/                      # Set-Bundle UI (AJAX, Berechnungen)
│   └── zubehoer-slider/                  # Zubehoer-Slider
└── CLAUDE.md                             # Plugin-Dokumentation (28KB)
```

### Provider Hierarchy (layout.tsx)
```
CookieConsentProvider
  AuthProvider
    CartProvider
      WishlistProvider
        CookieConsent (Banner)
        HeaderWrapper (enthaelt CartDrawer Trigger)
        FloatingContactButton
        {children}
        Footer
```

Der Root-Layout injiziert ausserdem globale JSON-LD-Schemas (Organization + WebSite) via `<JsonLd>` in `<head>`.

---

## Environment Variables

### Erforderlich

| Variable | Typ | Beschreibung |
|----------|-----|-------------|
| `NEXT_PUBLIC_WORDPRESS_URL` | Public | WordPress Backend URL |
| `NEXT_PUBLIC_SITE_URL` | Public | Frontend Domain (fuer Redirects, Payment URLs) |
| `WC_CONSUMER_KEY` | Secret | WooCommerce API Key |
| `WC_CONSUMER_SECRET` | Secret | WooCommerce API Secret |
| `PAYMENT_PROXY_URL` | Secret | WordPress Payment-Proxy Basis-URL (z.B. `https://2025.bodenjaeger.de/wp-json/bodenjaeger/v1`) |
| `PAYMENT_PROXY_KEY` | Secret | Auth-Key fuer den Proxy (`X-Bodenjaeger-Key` Header) |
| `NEXT_PUBLIC_SITE_URL` | Public | fuer Payment Return/Cancel URLs |
| `REVALIDATE_SECRET` | Secret | Cache Revalidation Authentifizierung |

### Optional

| Variable | Typ | Beschreibung | Fallback |
|----------|-----|-------------|----------|
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Public | PayPal Smart Buttons Client-SDK (Browser) | PayPal Buttons deaktiviert |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public | Stripe Browser Key (nur falls Stripe Elements clientseitig) | — |
| `KV_REST_API_URL` | Secret | Vercel KV/Upstash URL | Caching deaktiviert |
| `KV_REST_API_TOKEN` | Secret | Vercel KV Auth Token | Caching deaktiviert |

**Hinweis**: Seit April 2026 liegen Stripe-Secret-Key, Stripe-Webhook-Secret und PayPal-Credentials auf dem WordPress-Server (nicht mehr in Vercel). Das Frontend benoetigt nur noch Proxy-URL und Proxy-Key.

### Validierung
```bash
npm run check-env    # Prueft alle erforderlichen Variables
```

---

## Externe Dienste & Integrationen

### Payment-Proxy (WordPress)
- **Architektur**: Alle Payment-Requests laufen ueber `https://2025.bodenjaeger.de/wp-json/bodenjaeger/v1/*`
- **Auth**: `X-Bodenjaeger-Key` Header (ENV: `PAYMENT_PROXY_KEY`)
- **Vorteil**: Stripe-/PayPal-Credentials liegen nicht in Vercel, sondern ausschliesslich auf WordPress
- **npm-SDKs entfernt**: `stripe`, `@stripe/stripe-js` sind nicht mehr in `package.json`

### Stripe (via WP-Proxy)
- **Flow**: Frontend ruft `/api/checkout/create-order` auf → WordPress-Proxy erstellt Stripe Checkout Session → Redirect zu Stripe → Rueckkehr zu `/checkout/success`
- **Webhook**: `POST /api/checkout/stripe/webhook` (WordPress leitet Stripe-Events weiter)
- **Methoden**: Kreditkarte (Visa/MC/Amex), SOFORT-Ueberweisung
- **Config**: `src/lib/stripe.ts`

### PayPal (via WP-Proxy, Optional)
- **Flow**: Return-URL basiert (kein Webhook), Smart Buttons clientseitig via `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
- **Capture**: `GET /api/checkout/paypal/capture?order={id}` (ruft WP-Proxy auf, der PayPal captured)
- **Config**: `src/lib/paypal.ts`

### Vercel KV / Upstash Redis (Optional)
- **Paket**: `@vercel/kv`
- **TTL**: 30 Sekunden fuer Produkte
- **Keys**: `product:{slug}`, `products:batch:{ids}`
- **Graceful Fallback**: Alle Operationen scheitern leise
- **Config**: `src/lib/cache.ts`

### WordPress/WooCommerce Backend
- **Produkt-API**: Jaeger Custom API (41 Root-Level Felder)
- **Order-API**: WooCommerce REST API v3
- **Auth**: Basic Auth (Consumer Key + Secret)
- **E-Mails**: WooCommerce sendet alle transaktionalen E-Mails

### Image-Domains (next.config.ts)
1. `2025.bodenjaeger.de` — WordPress Uploads (migriert von `plan-dein-ding.de`)
2. `bodenjaeger.de` — Alternative Upload-Domain
3. `images.unsplash.com` — Stock-Fotos
4. `via.placeholder.com` — Platzhalter-Bilder

### NICHT konfiguriert (Setup empfohlen)
- Kein Google Analytics / Conversion Tracking (Cookie-Consent-System bereits vorbereitet)
- Kein Sentry / Error Tracking
- Kein SMTP-Service (E-Mails ueber WordPress Mail)
- Newsletter-Endpoint nicht vollstaendig implementiert
- Keine WordPress-Webhooks fuer Cache-Revalidation eingerichtet
- Payment-Live-Keys fehlen noch auf dem WordPress-Proxy

---

## Offene Aufgaben

### KRITISCH: Migration (siehe Migrations-Sektion oben)
- [ ] Neues WordPress + WooCommerce aufsetzen
- [ ] Custom Jaeger Plugin migrieren
- [ ] Produkte mit Custom Fields migrieren (ID-Mapping!)
- [ ] Neuen Vercel-Account einrichten
- [ ] Environment Variables setzen
- [ ] Hardcodierte URLs aktualisieren
- [ ] Stripe/PayPal Webhooks umkonfigurieren
- [ ] Vollstaendiger Funktionstest

### Backend (Prioritaet: HOCH)
- [ ] **`verrechnung` Feld zur API hinzufuegen**
  - Siehe: `backend/VERRECHNUNG_FELD_BACKEND.md`
  - Frontend-Fallback funktioniert, Backend-Feld fehlt noch

### E-Commerce (Prioritaet: MITTEL)
- [ ] **Payment Live-Keys hinterlegen** (Stripe + PayPal im WordPress-Proxy)
- [ ] **SMTP fuer E-Mails konfigurieren** (SendGrid/Mailgun)
- [ ] **Versandkosten im CartDrawer anzeigen** (aktuell immer "Kostenlos")
- [ ] **Gutschein-System** (WooCommerce Coupon API)
- [ ] **Warenkorb-Backend-Sync** (optional, fuer Cross-Device)

### Frontend (Prioritaet: MITTEL)
- [ ] **Produkt-Filter & Suche** verbessern
- [ ] **Kategorieseiten** optimieren (Pagination, Sortierung)
- [ ] **Order-Tracking** Seite fuer Kunden (Public, mit E-Mail-Verifikation)

### Technische Schulden
- [ ] **CheckoutContext.tsx entfernen** — Dead Code, nicht im Provider-Tree
- [ ] **adapters.ts entfernen oder aktualisieren** — liest `jaeger_meta.*` statt Root-Level
- [ ] **Set-Quantity-Duplikation** in CartDrawer entfernen (floor/ceil inline statt `setCalculations.ts`)

### Optimierungen (Prioritaet: NIEDRIG)
- [ ] **Analytics** (Google Analytics, Conversion Tracking, E-Commerce Events)
- [ ] **SEO** (Meta-Tags, Structured Data/JSON-LD, Sitemap, OpenGraph)
- [ ] **Performance** (Bundle Size, Lazy Loading)
- [ ] **Testing** (Unit Tests fuer setCalculations.ts, E2E fuer Checkout-Flow)

---

## Bekannte Probleme

### 1. `verrechnung` Feld fehlt im Backend
**Prioritaet:** HOCH
**Status:** Frontend-Fallback implementiert, funktioniert
**Loesung:** Backend muss Feld hinzufuegen (siehe `backend/VERRECHNUNG_FELD_BACKEND.md`)

### 2. Cart nur in localStorage
**Prioritaet:** MITTEL
**Details:** Nicht synchronisiert zwischen Geraeten, geht verloren bei Browser-Datenloesung
**Loesung:** Optional WooCommerce Session API

### 3. E-Mails im Spam
**Prioritaet:** MITTEL
**Details:** WordPress Mail-System ohne SMTP-Provider
**Loesung:** SMTP-Plugin mit verifizierter Domain (SendGrid, Mailgun)

### 4. Versandkosten-Anzeige im CartDrawer
**Prioritaet:** NIEDRIG
**Details:** CartDrawer zeigt immer "Kostenlos", echte Staffelung erst im Checkout
**Loesung:** `shippingConfig.ts` auch im CartDrawer nutzen

### 5. Stripe Webhook in Development
**Prioritaet:** NIEDRIG
**Details:** Webhook laeuft nur auf Production (localhost nicht erreichbar)
**Loesung:** Stripe CLI fuer lokale Webhooks

### 6. Dual Type System
**Prioritaet:** NIEDRIG
**Details:** `StoreApiProduct` (aktiv) vs `ProductCritical/ProductFull` (geplant, nicht primaer), `adapters.ts` liest veraltete Pfade
**Loesung:** Geplante Types entfernen oder migrieren

### 7. Newsletter-Endpoint
**Prioritaet:** NIEDRIG
**Details:** WordPress-Backend-Endpoint nicht vollstaendig, Frontend hat Fallback
**Loesung:** WordPress-seitig implementieren

---

## Naechste Schritte (Priorisiert)

### Abgeschlossen
1. Set-Angebot Preisberechnung
2. `verrechnung` Frontend-Fallback
3. Warenkorb-System
4. Checkout-Prozess
5. Stripe + PayPal + BACS Integration
6. WooCommerce Order API
7. Success Page
8. Auth-System (Login, Register, Konto)
9. Wunschliste
10. Versandkosten-Logik (im Checkout)
11. Muster-Bestellungen

### Sofort: Migration durchfuehren
1. Neues WordPress-Backend aufsetzen + Jaeger Plugin
2. Produkte migrieren (mit ID-Mapping!)
3. Neuen Vercel-Account + Projekt erstellen
4. Environment Variables konfigurieren
5. Hardcodierte URLs aktualisieren
6. Stripe Webhook auf neue URL umstellen
7. Vollstaendiger End-to-End Test
8. Go-Live

### Nach Migration
1. SMTP fuer E-Mails konfigurieren
2. WordPress Cache-Revalidation Webhook einrichten
3. Analytics einrichten (Google Analytics)
4. SEO optimieren
5. Newsletter-Backend fertigstellen

### Mittelfristig
1. Gutschein-System
2. Filter & Suche verbessern
3. Performance-Optimierungen
4. Technische Schulden abbauen (Dead Code, Duplikate)

---

## Projektstatistik

**Komponenten:** ~90+
**Pages:** 40+ (Home, Product, Category, Cart, Checkout, Success, Login, Konto mit 4 Unterseiten, Fachmarkt-Hauptseite + dynamische [slug]-Subpages, Blog-Uebersicht + [slug], Bestseller, Sale, Search, Favoriten, Kontakt, Karriere, Service, 5 Rechtsseiten, Styleguide, Sitemap, Dev-Seiten)
**API Routes:** 24 (5 Produkte, 5 Checkout, 8 Auth, 1 Newsletter, 1 Revalidation, 5 Debug)
**Custom Fields:** 41
**Contexts:** 4 aktiv (CookieConsent, Auth, Cart, Wishlist) + 1 Dead Code (Checkout)
**Payment Methods:** 3 (Stripe, PayPal, BACS) — alle via WordPress-Proxy
**TypeScript Coverage:** 100%
**Dependencies:** 6 Runtime (next, react, react-dom, @vercel/kv, clsx, lucide-react) + 9 Dev — Stripe/PayPal-SDKs entfernt

### Implementierungsstand
- **Produkt-Display**: 100%
- **Set-Angebot System**: 100%
- **Warenkorb**: 100%
- **Checkout**: 100%
- **Payment Integration (Code)**: 100% (WordPress-Proxy-Refactoring abgeschlossen)
- **Payment Keys (Live)**: 0% (Placeholder in .env.local, Live-Keys im WP-Backend einzutragen)
- **Order Management**: 100%
- **Auth-System**: 100%
- **Wunschliste**: 100%
- **Cookie-Consent (DSGVO)**: 100%
- **SEO / Structured Data**: 80% (JSON-LD fuer Organization/WebSite/Product, Meta-Tags vorhanden)
- **Versandkosten (Checkout)**: 100%
- **E-Mail System**: 80% (SMTP fehlt)
- **Newsletter**: 50% (Backend-Endpoint fehlt)
- **Testing**: 0% (kein Test-Framework)
- **Filter & Suche**: 30%
- **Analytics**: 0%

---

## Kontakt & Ressourcen

**Backend (aktuell):** 2025.bodenjaeger.de
**Frontend (aktuell):** bodenjaeger.vercel.app
**E-Mail:** info@bodenjaeger.de

**Dokumentation:**
- `CLAUDE.md` — Entwicklungs-Anweisungen
- `PAYMENT_SETUP.md` — Payment-Proxy Einrichtung (Stand 10.04.2026)
- `WORDPRESS_CONTENT_MANAGEMENT.md` — Fachmarkt-Subpages & WordPress-Content
- `JAEGER_PLUGIN_FELDER_ANALYSE.md` — Jaeger-Plugin Custom-Fields Analyse
- `FEHLENDE_FEATURES.md` — Offene Features & Roadmap
- `backend/ROOT_LEVEL_FIELDS.md` — Custom Fields
- `backend/VERRECHNUNG_FELD_BACKEND.md` — Verrechnung-Logik
- `backend/FRONTEND_BACKEND_DATENFLUSS.md` — Datenfluss

---

## Meilensteine

### Version 1.0 - MVP (Abgeschlossen: Januar 2026)
- Produkt-Katalog mit Set-Angeboten
- Warenkorb-System
- Checkout-Prozess
- Payment-Integration (Stripe, PayPal, BACS)
- WooCommerce Order-Integration

### Version 1.1 - Erweiterungen (Abgeschlossen: Maerz 2026)
- Auth-System (Login, Register, Konto)
- Wunschliste
- Versandkosten-Staffelung im Checkout
- Muster-Bestellungen
- Blog-Seiten
- Fachmarkt-Seiten

### Version 1.2 - Sicherheit, SEO & Compliance (Abgeschlossen: April 2026)
- Payment-Architektur auf WordPress-Proxy umgestellt (Credentials-Isolierung)
- Stripe/PayPal npm-SDKs aus Frontend entfernt
- DSGVO Cookie-Consent-System (CookieConsentContext + Banner + Footer-Link)
- JSON-LD Structured Data (Organization, WebSite, Product)
- Fachmarkt-Subpages refactored (dynamische `[slug]`-Route mit WordPress-Content)
- Blog-Uebersicht + dynamische Blog-Detail-Seiten
- Kategorieseiten-Optimierung + SEO
- Google Reviews aus JSON-Quelle
- HeroSlider nach `components/startseite/` verschoben

### Version 1.3 - Migration (In Arbeit)
- Umzug auf neuen Vercel-Account
- Umzug auf neues WordPress-Projekt
- Live-Payment-Keys im WP-Backend hinterlegen
- SMTP-Konfiguration
- Analytics-Setup

### Version 2.0 - Erweiterungen (Geplant)
- Gutschein-System
- Erweiterte Filter & Suche
- Bestellhistorie im Kundenkonto
- Order-Tracking fuer Kunden
- Performance-Optimierungen

---

**Letzte Aktualisierung:** 23. April 2026
**Aktueller Status:** MVP vollstaendig funktionsfaehig, Backend migriert auf 2025.bodenjaeger.de, Payment-Architektur auf WordPress-Proxy umgestellt, Cookie-Consent + SEO/JSON-LD live, Vercel-Account-Migration steht noch an
