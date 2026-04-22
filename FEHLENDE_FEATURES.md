# Fehlende Features & Offene Aufgaben - Bodenjäger

**Stand:** 21. April 2026
**Projekt-Status:** Core-Funktionalität implementiert, E-Commerce-Integration fehlt

---

## 🔴 KRITISCH (Projekt nicht produktionsbereit ohne diese)

### 1. WooCommerce Checkout-Integration
**Status:** UI vorhanden, Backend-Integration fehlt komplett

**Was fehlt:**
- [ ] Warenkorb → WooCommerce Order Sync
- [ ] Set-Angebote als WooCommerce Line Items speichern
- [ ] Order-Erstellung über WooCommerce API
- [ ] Zahlungs-Gateway Integration (PayPal, Stripe, Klarna, etc.)
- [ ] Bestellbestätigung per E-Mail
- [ ] Order-Tracking für Kunden
- [ ] Admin-Benachrichtigung bei neuer Bestellung

**Betroffene Dateien:**
- `src/app/checkout/page.tsx` - Nur UI, keine API-Calls
- `src/contexts/CartContext.tsx` - LocalStorage only, kein Backend-Sync
- Neu zu erstellen: `src/lib/woocommerce-checkout.ts`

**Aufwand:** Hoch (3-5 Tage)

---

### 2. Backend: `verrechnung` Feld fehlt
**Status:** Frontend-Fallback vorhanden, Backend muss nachziehen

**Problem:**
Das `verrechnung` Feld ist essentiell für die Set-Angebot Preisberechnung bei Premium-Produkten. Aktuell berechnet Frontend die Differenz selbst, was zu Inkonsistenzen führen kann.

**Was fehlt:**
- [ ] `verrechnung` Feld zur Jäger API hinzufügen
- [ ] Berechnung im Backend: `Math.max(0, produktPreis - standardPreis)`
- [ ] Für alle Produkte in `daemmung_option_ids` und `sockelleisten_option_ids`

**Dokumentation:** `backend/VERRECHNUNG_FELD_BACKEND.md`

**Frontend-Fallback:** `src/components/product/ProductPageContent.tsx:77`
```typescript
const verrechnung = product.verrechnung ?? Math.max(0, price - standardPrice);
```

**Aufwand:** Mittel (Backend-Entwickler, 1-2 Tage)

---

### 3. "In den Warenkorb" Button fehlt
**Status:** Warenkorb-UI vorhanden, aber kein Button auf Produktseite

**Was fehlt:**
- [ ] "In den Warenkorb" Button in `ProductPageContent.tsx`
- [ ] Set-Angebot zum Warenkorb hinzufügen (Floor + Dämmung + Sockelleiste)
- [ ] Validierung: Mindestmenge, Paketgrößen
- [ ] Success-Feedback für Benutzer
- [ ] Mini-Cart in Header aktualisieren

**Betroffene Dateien:**
- `src/components/product/ProductPageContent.tsx` - Button hinzufügen
- `src/contexts/CartContext.tsx` - `addSetToCart()` Funktion erweitern

**Aufwand:** Niedrig (1 Tag)

---

## 🔴 WordPress-Backend: E-Mail-Zustellung & Rechtspflichten (vor B2C-Launch)

### 3a. WP Mail SMTP installieren & konfigurieren
**Status:** Offen — im alten Shop installiert, muss im neuen WP-Backend nach Migration wieder eingerichtet werden

**Warum kritisch:**
Alle Kunden-Mails (Bestellbestätigung, Zahlungseingang, Versand, Passwort-Reset, Newsletter Double-Opt-In) laufen über WordPress. Ohne dedizierten SMTP-Versand nutzt WP die PHP-`mail()`-Funktion → landet typischerweise im Spam oder wird gar nicht zugestellt (fehlende SPF/DKIM/DMARC, Blacklist-Gefahr).

**Was zu tun ist:**
- [ ] Plugin **WP Mail SMTP** im neuen WordPress-Backend installieren
- [ ] Mailer konfigurieren (bevorzugt derselbe Provider wie im alten Shop — Zugangsdaten/API-Keys übernehmen)
- [ ] Von-Adresse fest auf `info@bodenjaeger.de` (oder gewünschte Absenderadresse) setzen
- [ ] SPF/DKIM für Domain prüfen und setzen
- [ ] Test-Mail über Plugin senden
- [ ] Ende-zu-Ende Testbestellung durchführen und prüfen, ob Bestellbestätigung ankommt

**Optional zu evaluieren:** Statt klassisches SMTP direkt auf transaktionalen Provider mit API umsteigen (Brevo, Postmark, Resend) — bessere Logs, Bounce-Tracking, Template-Versionierung. WP Mail SMTP unterstützt diese Provider direkt.

**Aufwand:** Niedrig (0,5 Tage, falls Provider-Zugangsdaten vorhanden)

---

### 3b. AGB + Widerrufsbelehrung als PDF an Bestellbestätigung anhängen
**Status:** Offen — derzeit werden keine Rechtsdokumente an Mails angehängt

**Warum kritisch:**
**Gesetzliche Pflicht bei B2C-Fernabsatz in Deutschland.** AGB und Widerrufsbelehrung müssen dem Kunden „in Textform" (PDF-Anhang oder vollständig im Mail-Body) mit der Bestellbestätigung zugehen. Nur auf der Website verlinken reicht nicht — Abmahngefahr.

**Empfohlene Lösung: WooCommerce Germanized (Free-Version)**
- [ ] Plugin **WooCommerce Germanized** installieren
- [ ] AGB-PDF und Widerrufsbelehrung-PDF erstellen (Inhalte aus `/agb` und `/widerruf` im Frontend, mit Datum/Version im Footer)
- [ ] PDFs unter *WooCommerce → Germanized → E-Mails* hochladen
- [ ] Anhänge an „Neue Bestellung" + „Bestellbestätigung" aktivieren
- [ ] Testbestellung: Anhänge in E-Mail prüfen

**Zusätzlicher Nutzen von Germanized:** Deckt weitere DE-Pflichten ab (Button-Lösung „Zahlungspflichtig bestellen", Grundpreis-Angabe, Preis-inkl-MwSt-Hinweise, Versandkosten-Info).

**Alternativen, falls Germanized nicht gewünscht:**
- Reines Attachment-Plugin (*WooCommerce Email Attachments*)
- Custom-Code in Child-Theme via `woocommerce_email_attachments`-Filter

**Aufwand:** Niedrig (0,5–1 Tag inkl. PDF-Erstellung)

---

## 🟠 WICHTIG (Für Launch notwendig)

### 4. Produkt-Suche & Filter
**Status:** Basis-Suche vorhanden, Filter fehlen komplett

**Was fehlt:**
- [ ] Erweiterte Suche (Volltext über Produktname, Beschreibung)
- [ ] Filter nach:
  - [ ] Produktkategorie (Laminat, Vinyl, Parkett)
  - [ ] Preisspanne
  - [ ] Farbe / Oberfläche
  - [ ] Verfügbarkeit (auf Lager, Lieferzeit)
  - [ ] Eigenschaften (Nutzungsklasse, Dicke, etc.)
- [ ] Filter-UI Komponente
- [ ] URL-Parameter für Filter (SEO-friendly)
- [ ] Filter-Reset Funktion

**Betroffene Dateien:**
- Neu: `src/components/filters/ProductFilters.tsx`
- Neu: `src/lib/filterUtils.ts`
- Update: `src/app/category/[slug]/page.tsx`

**Aufwand:** Mittel (2-3 Tage)

---

### 5. Kategorieseiten Optimierung
**Status:** Basic Grid vorhanden, Features fehlen

**Was fehlt:**
- [ ] Pagination (derzeit nur 20 Produkte pro Seite)
- [ ] Sortierung:
  - [ ] Preis aufsteigend/absteigend
  - [ ] Beliebtheit
  - [ ] Neueste zuerst
  - [ ] A-Z / Z-A
- [ ] Grid vs. Listen-Ansicht Toggle
- [ ] "Mehr laden" Button (Infinite Scroll alternative)
- [ ] Produkt-Zähler ("23 Produkte gefunden")

**Betroffene Dateien:**
- `src/app/category/[slug]/page.tsx`
- Neu: `src/components/category/CategoryControls.tsx`

**Aufwand:** Mittel (2 Tage)

---

### 6. SEO Optimierung
**Status:** Basic Meta-Tags vorhanden, strukturierte Daten fehlen

**Was fehlt:**
- [ ] Structured Data (JSON-LD):
  - [ ] Product Schema
  - [ ] Offer Schema
  - [ ] BreadcrumbList Schema
  - [ ] Organization Schema
- [ ] Dynamische Meta-Tags vervollständigen:
  - [ ] OG-Images für Social Sharing
  - [ ] Twitter Cards
  - [ ] Canonical URLs
- [ ] Sitemap.xml generieren
- [ ] Robots.txt optimieren
- [ ] Alt-Texte für alle Bilder
- [ ] Semantische HTML-Struktur prüfen

**Betroffene Dateien:**
- Alle `page.tsx` Dateien (Metadata-Exports)
- Neu: `src/app/sitemap.ts`
- Neu: `src/lib/structuredData.ts`

**Aufwand:** Mittel (2-3 Tage)

---

## 🟡 MEDIUM (Verbessert UX deutlich)

### 7. User Account System
**Status:** Nicht vorhanden

**Was fehlt:**
- [ ] Registrierung / Login
- [ ] "Mein Konto" Seite
- [ ] Bestellhistorie
- [ ] Adressbuch (Liefer- & Rechnungsadressen)
- [ ] Wunschliste / Favoriten
- [ ] Passwort zurücksetzen
- [ ] WooCommerce Customer API Integration

**Aufwand:** Hoch (5-7 Tage)

---

### 8. Produktseite: Zusätzliche Features
**Status:** Core-Features vorhanden, nice-to-have fehlen

**Was fehlt:**
- [ ] Produktbewertungen (WooCommerce Reviews)
- [ ] Ähnliche Produkte Slider
- [ ] "Zuletzt angesehen" Produkte
- [ ] Social Share Buttons
- [ ] Verfügbarkeits-Benachrichtigung (wenn ausverkauft)
- [ ] Produktvergleich
- [ ] Zoom-Funktion für Produktbilder

**Betroffene Dateien:**
- `src/components/product/ProductPageContent.tsx`
- Neu: `src/components/product/ProductReviews.tsx`
- Neu: `src/components/product/RelatedProducts.tsx`

**Aufwand:** Mittel (3-4 Tage)

---

### 9. Mobile Optimierung
**Status:** Responsive vorhanden, UX-Verbesserungen nötig

**Was fehlt:**
- [ ] Mobile Menü optimieren
- [ ] Touch-Gestures für Slider
- [ ] Mobile Filter-Drawer
- [ ] Vereinfachte Checkout-Steps für Mobile
- [ ] Performance auf Mobile prüfen (Lighthouse Score)
- [ ] iOS Safari spezifische Fixes
- [ ] Android Chrome spezifische Fixes

**Aufwand:** Mittel (2-3 Tage)

---

### 10. Warenkorb-Features
**Status:** Basic Cart vorhanden, Features fehlen

**Was fehlt:**
- [ ] Warenkorb-Persistenz über Sessions (nicht nur localStorage)
- [ ] Mini-Cart Dropdown in Header
- [ ] "Gespeichert für später" Funktion
- [ ] Gutschein-Code Eingabe
- [ ] Versandkosten-Berechnung
- [ ] Kostenloser Versand ab X Euro Hinweis
- [ ] Cross-Sell Produkte im Warenkorb

**Betroffene Dateien:**
- `src/app/cart/page.tsx`
- `src/contexts/CartContext.tsx`
- Neu: `src/components/cart/MiniCart.tsx`

**Aufwand:** Mittel (2-3 Tage)

---

## 🟢 NIEDRIG (Nice-to-have, kann später)

### 11. Testing
**Status:** Keine Tests vorhanden

**Was fehlt:**
- [ ] Unit Tests:
  - [ ] `setCalculations.ts` Funktionen
  - [ ] Preisberechnungs-Logik
  - [ ] Utility-Funktionen
- [ ] Integration Tests:
  - [ ] WooCommerce API Calls
  - [ ] Cart Context
- [ ] E2E Tests (Playwright/Cypress):
  - [ ] Produktauswahl & Set-Angebot Konfiguration
  - [ ] Warenkorb-Prozess
  - [ ] Checkout-Flow
- [ ] Visual Regression Tests

**Setup benötigt:**
- Jest für Unit Tests
- React Testing Library
- Playwright oder Cypress für E2E

**Aufwand:** Hoch (5-7 Tage für vollständige Test-Suite)

---

### 12. Performance-Optimierungen
**Status:** Next.js Defaults gut, weitere Optimierungen möglich

**Was fehlt:**
- [ ] Image Optimization:
  - [ ] AVIF Format nutzen
  - [ ] Blur Placeholder für alle Bilder
  - [ ] Lazy Loading optimieren
- [ ] Bundle Size reduzieren:
  - [ ] Tree Shaking prüfen
  - [ ] Unused Dependencies entfernen
  - [ ] Code Splitting optimieren
- [ ] API Caching optimieren:
  - [ ] Vercel KV für häufige Queries
  - [ ] ISR (Incremental Static Regeneration) erweitern
  - [ ] Stale-While-Revalidate Pattern
- [ ] Core Web Vitals optimieren:
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1

**Aufwand:** Mittel (2-3 Tage)

---

### 13. Admin / CMS Features
**Status:** Alle Inhalte über WordPress, Frontend-Editor fehlt

**Was fehlt:**
- [ ] Produkt-Preview für unveröffentlichte Produkte
- [ ] Content-Management für Landingpages
- [ ] A/B Testing für Set-Angebot Preise
- [ ] Analytics Dashboard
- [ ] Inventory Management Hinweise

**Aufwand:** Hoch (7-10 Tage)

---

### 14. Zusätzliche Seiten/Features
**Status:** Basis-Seiten vorhanden, erweiterte Features fehlen

**Was fehlt:**
- [ ] Blog-Integration (WordPress Posts)
- [ ] FAQ Seite mit Suchfunktion
- [ ] Ratgeber / Produktberatung
- [ ] Showroom-Finder (Fachmarkt Hückelhoven)
- [ ] Newsletter-Anmeldung
- [ ] Live-Chat / WhatsApp Business Integration
- [ ] Video-Tutorials

**Aufwand:** Variabel (1-2 Tage pro Feature)

---

## ⚠️ Bekannte Bugs & Warnungen

### TypeScript Fehler
- **PageProps nicht gefunden** in `src/app/category/[slug]/page.tsx:17`
  - Lösung: `import type { PageProps } from 'next';` (Next.js 15 API)

### Build-Warnungen
- **Image Quality nicht konfiguriert**: `quality "80" not in images.qualities`
  - Lösung: `next.config.ts` erweitern mit `qualities: [75, 80, 90, 100]`

- **Metadata Viewport deprecated**: `Unsupported metadata viewport`
  - Lösung: Zu `generateViewport()` migrieren (Next.js 16)

### Runtime-Issues
- Keine bekannten Runtime-Fehler aktuell

---

## 📊 Priorisierungs-Matrix

| Feature | Priorität | Aufwand | Business-Impact | Empfohlene Reihenfolge |
|---------|-----------|---------|-----------------|------------------------|
| WooCommerce Checkout | 🔴 KRITISCH | Hoch | 🔥 Sehr Hoch | 1 |
| "In den Warenkorb" Button | 🔴 KRITISCH | Niedrig | 🔥 Sehr Hoch | 2 |
| `verrechnung` Backend-Feld | 🔴 KRITISCH | Mittel | 🔥 Sehr Hoch | 3 |
| WP Mail SMTP (Mail-Zustellung) | 🔴 KRITISCH | Niedrig | 🔥 Sehr Hoch | 3a |
| AGB/Widerruf PDF-Anhang | 🔴 KRITISCH (legal) | Niedrig | 🔥 Sehr Hoch | 3b |
| SEO Optimierung | 🟠 WICHTIG | Mittel | ⚡ Hoch | 4 |
| Produkt-Suche & Filter | 🟠 WICHTIG | Mittel | ⚡ Hoch | 5 |
| Kategorieseiten Optimierung | 🟠 WICHTIG | Mittel | ⚡ Hoch | 6 |
| Mobile Optimierung | 🟡 MEDIUM | Mittel | ⚡ Hoch | 7 |
| Warenkorb-Features | 🟡 MEDIUM | Mittel | 💡 Mittel | 8 |
| Produktseite Features | 🟡 MEDIUM | Mittel | 💡 Mittel | 9 |
| User Account System | 🟡 MEDIUM | Hoch | 💡 Mittel | 10 |
| Performance-Optimierungen | 🟢 NIEDRIG | Mittel | 💡 Mittel | 11 |
| Testing | 🟢 NIEDRIG | Hoch | 💡 Mittel | 12 |
| Zusätzliche Features | 🟢 NIEDRIG | Variabel | 📌 Niedrig | 13 |

---

## 🎯 Empfohlene Roadmap

### Phase 1: MVP Launch (2-3 Wochen)
1. ✅ Set-Angebot System (DONE)
2. "In den Warenkorb" Button implementieren
3. WooCommerce Checkout-Integration
4. `verrechnung` Backend-Feld
5. WP Mail SMTP im neuen WP-Backend einrichten
6. AGB + Widerrufsbelehrung als PDF-Anhang (Germanized)
7. Basic SEO (Meta-Tags, Sitemap)
8. TypeScript-Fehler beheben

**Ziel:** Funktionsfähiger Online-Shop mit Set-Angeboten

---

### Phase 2: UX & Marketing (2-3 Wochen)
1. Produkt-Suche & Filter
2. Kategorieseiten Optimierung
3. Mobile Optimierung
4. SEO Structured Data
5. Warenkorb-Features (Mini-Cart, Gutscheine)
6. Performance-Optimierung

**Ziel:** Professionelle UX, SEO-optimiert, schnell

---

### Phase 3: Growth Features (3-4 Wochen)
1. User Account System
2. Produktbewertungen
3. Newsletter & Marketing
4. Blog-Integration
5. Analytics & Tracking
6. A/B Testing

**Ziel:** Customer Retention, Marketing-Tools

---

### Phase 4: Enterprise Features (fortlaufend)
1. Vollständige Test-Suite
2. Admin Dashboard
3. Erweiterte Analytics
4. Mehrsprachigkeit (i18n)
5. B2B Features (Großkunden-Preise)

**Ziel:** Skalierbarkeit, Wartbarkeit

---

## 💰 Geschätzter Gesamt-Aufwand

- **MVP (Phase 1):** ~80-120 Stunden
- **UX & Marketing (Phase 2):** ~80-100 Stunden
- **Growth Features (Phase 3):** ~120-160 Stunden
- **Enterprise Features (Phase 4):** ~200+ Stunden

**Gesamt für vollständige Plattform:** ~500-600 Stunden

---

## 📝 Notizen

### Was bereits gut funktioniert:
- ✅ Set-Angebot Preisberechnung (Frontend)
- ✅ Produktseiten mit Set-Konfiguration
- ✅ Responsive Design
- ✅ WooCommerce API Integration (Lesen)
- ✅ TypeScript Type Safety
- ✅ Image Optimization
- ✅ Next.js 15 App Router

### Technische Schulden:
- Frontend-Fallback für `verrechnung` sollte entfernt werden, sobald Backend liefert
- Warenkorb localStorage → Backend-Sync für bessere UX
- Test-Coverage aktuell 0%

---

**Letzte Aktualisierung:** 21. April 2026
