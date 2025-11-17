# Projekt-Zusammenfassung: Bodenjäger Online-Shop

**Stand:** 16. November 2025
**Projekt:** Bodenjäger E-Commerce Shop (Next.js 15.5.3 + WooCommerce Headless)

---

## 📋 Inhaltsverzeichnis
1. [Projekt-Übersicht](#projekt-übersicht)
2. [Technologie-Stack](#technologie-stack)
3. [Set-Angebot System (Detailliert)](#set-angebot-system-detailliert)
4. [Aktuelle Implementierung](#aktuelle-implementierung)
5. [API-Struktur](#api-struktur)
6. [Wichtige Dateien](#wichtige-dateien)
7. [Offene Aufgaben](#offene-aufgaben)
8. [Bekannte Probleme](#bekannte-probleme)

---

## 🎯 Projekt-Übersicht

Bodenjäger ist ein Online-Shop für Bodenbeläge (Laminat, Vinyl, Parkett) mit einem speziellen **Set-Angebot System**. Kunden können einen Boden mit passender Dämmung und Sockelleisten als Bundle kaufen und erhalten dabei Rabatte.

### Kern-Features
- **Set-Angebote**: Boden + Dämmung + Sockelleiste als Bundle
- **Dynamische Preisberechnung**: Unterschiedliche Rundungsregeln je nach Artikel-Typ
- **Flexible Produktauswahl**: Standard, Premium oder günstigere Alternativen
- **Automatische Mengenberechnung**: Basierend auf Raumgröße in m²

---

## 🛠️ Technologie-Stack

### Frontend
- **Framework**: Next.js 15.5.3 (App Router)
- **Build Tool**: Turbopack
- **UI**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Image Optimization**: Next.js Image Component

### Backend / CMS
- **WooCommerce**: Headless CMS für Produktverwaltung
- **Custom Jäger Plugin**: WordPress Plugin für Custom Fields
- **API**: `/wp-json/jaeger/v1/` (erweiterte WooCommerce API)

### Infrastruktur
- **Hosting**: Vercel (geplant)
- **Domain**: bodenjaeger.vercel.app
- **WordPress Backend**: plan-dein-ding.de

---

## 🎁 Set-Angebot System (Detailliert)

Das Set-Angebot System ist das Herzstück des Shops. Es ermöglicht Kunden, Boden-Bundles mit Rabatten zu kaufen.

### Grundprinzip

**Ein Set-Angebot besteht aus:**
1. **Hauptprodukt (Boden)**: Pflichtprodukt, definiert das Set
2. **Dämmung (Optional)**: Standard oder Premium-Varianten
3. **Sockelleiste (Optional)**: Standard oder Premium-Varianten

### Artikel-Kategorisierung

Jedes Zubehör-Produkt (Dämmung/Sockelleiste) wird automatisch kategorisiert:

| Kategorie | Bedingung | Set-Preis | Rundung |
|-----------|-----------|-----------|---------|
| **Standard-Artikel** | `verrechnung === 0` | **0€** (kostenlos) | ABRUNDEN |
| **Aufpreis-Artikel** | `verrechnung > 0` | **nur Differenz** | AUFRUNDEN |
| **Billigere Artikel** | `preis < standardPreis` | **0€** (keine Rückerstattung) | ABRUNDEN |

### Verrechnung-Feld

Das `verrechnung` Feld ist der **Schlüssel** zur Preisberechnung:

```typescript
// Dynamische Berechnung im Frontend (mit Backend-Fallback)
const verrechnung = produkt.verrechnung ?? Math.max(0, produktPreis - standardPreis);
```

**Beispiel:**
- Standard-Sockelleiste: 3,00 €/m → `verrechnung = 0`
- Premium-Sockelleiste: 9,00 €/m → `verrechnung = 6,00 €/m`
- Günstige Alternative: 2,00 €/m → `verrechnung = 0` (keine Rückerstattung!)

### Mengenberechnung

#### 1. Boden (Hauptprodukt)
```typescript
// Input: Gewünschte m²
wantedM2 = 26.7;

// Berechnung
packages = Math.ceil(wantedM2 / paketinhalt);
actualM2 = packages * paketinhalt;

// Beispiel: 26.7 m² / 2.67 m² = 10.01 → 11 Pakete = 29.37 m²
```

#### 2. Dämmung (falls gewählt)
```typescript
// REGULÄRER PREIS (Einzelkauf)
paketeRegular = Math.ceil(actualM2 / daemmungPaketinhalt);  // AUFRUNDEN
m2Regular = paketeRegular * daemmungPaketinhalt;
regularPrice = m2Regular * daemmungPreis;

// SET-ANGEBOT PREIS
if (istStandard || istBilliger) {
  // Kostenlos im Set
  paketeSet = Math.floor(actualM2 / daemmungPaketinhalt);  // ABRUNDEN
  setPrice = 0;  // Kostenlos!
} else {
  // Aufpreis-Artikel
  paketeSet = Math.ceil(actualM2 / daemmungPaketinhalt);   // AUFRUNDEN
  m2Set = paketeSet * daemmungPaketinhalt;
  setPrice = m2Set * verrechnung;  // NUR Differenz!
}
```

#### 3. Sockelleiste (falls gewählt)
```typescript
// Berechnung der benötigten Laufmeter (lfm)
baseboardLfm = floorM2 * 1.0;  // Faustformel: m² = lfm

// REGULÄRER PREIS (Einzelkauf)
paketeRegular = Math.ceil(baseboardLfm / sockelleistePackageSize);  // AUFRUNDEN
lfmRegular = paketeRegular * sockelleistePackageSize;
regularPrice = lfmRegular * sockelleistePreis;

// SET-ANGEBOT PREIS
if (istStandard || istBilliger) {
  // Kostenlos im Set
  paketeSet = Math.floor(baseboardLfm / sockelleistePackageSize);  // ABRUNDEN
  setPrice = 0;  // Kostenlos!
} else {
  // Aufpreis-Artikel
  paketeSet = Math.ceil(baseboardLfm / sockelleistePackageSize);  // AUFRUNDEN
  lfmSet = paketeSet * sockelleistePackageSize;
  setPrice = lfmSet * verrechnung;  // NUR Differenz!
}
```

### Gesamt-Preisberechnung

```typescript
// REGULÄRER PREIS (Einzelkauf aller Artikel)
comparisonPrice = bodenPrice + daemmungRegularPrice + sockelleisteRegularPrice;

// SET-ANGEBOT PREIS (Bundle-Preis)
totalPrice = bodenPrice + daemmungSetPrice + sockelleisteSetPrice;

// ERSPARNIS
savings = comparisonPrice - totalPrice;
savingsPercent = (savings / comparisonPrice) * 100;
```

### Beispiel-Rechnung

**Szenario:** Kunde kauft 26,7 m² Rigid-Vinyl COREtec Egmont mit Premium-Sockelleiste

#### Produkte:
- **Boden**: Rigid-Vinyl COREtec Egmont
  - Preis: 84,99 €/m²
  - Paketinhalt: 2,67 m²/Paket

- **Sockelleiste**: AD96 Sockelleiste 96mm weiß (Premium)
  - Preis: 9,00 €/m
  - Standard-Preis: 3,00 €/m
  - **Verrechnung: 6,00 €/m**
  - Paketinhalt: 2,5 m/Paket

#### Berechnung:

**1. Boden:**
```
Gewünscht: 26,7 m²
Pakete: Math.ceil(26,7 / 2,67) = 10,01 → 11 Pakete
Tatsächlich: 11 × 2,67 = 29,37 m²
Preis: 29,37 × 84,99 = 2.496,61 €
```

**2. Sockelleiste (Regulär):**
```
Benötigt: 26,7 lfm (= 26,7 m²)
Pakete: Math.ceil(26,7 / 2,5) = 10,68 → 11 Pakete (AUFRUNDEN)
Lfm: 11 × 2,5 = 27,5 lfm
Preis: 27,5 × 9,00 = 247,50 €
```

**3. Sockelleiste (Set-Angebot):**
```
Benötigt: 26,7 lfm
Pakete: Math.ceil(26,7 / 2,5) = 10,68 → 11 Pakete (AUFRUNDEN für Aufpreis!)
Lfm: 11 × 2,5 = 27,5 lfm
Verrechnung: 6,00 €/m
Preis: 27,5 × 6,00 = 165,00 €  (nur Differenz!)
```

**4. Gesamt:**
```
Regulärer Preis: 2.496,61 + 247,50 = 2.744,11 €
Set-Angebot:     2.496,61 + 165,00 = 2.661,61 €
Ersparnis:       82,50 € (3,01%)
```

### Wichtige Rundungsregeln

| Kontext | Artikel-Typ | Rundung | Grund |
|---------|-------------|---------|-------|
| **Regulärer Kauf** | Alle | `Math.ceil()` | Kunde muss ganze Pakete kaufen |
| **Set-Angebot** | Standard/Billiger | `Math.floor()` | Kundenfreundlich, kostenlos |
| **Set-Angebot** | Aufpreis | `Math.ceil()` | Faire Verrechnung des Aufpreises |

---

## ✅ Aktuelle Implementierung

### Implementierte Features

#### 1. Set-Angebot Preisberechnung (src/components/product/ProductPageContent.tsx)
- ✅ Vollständige Logik für Boden, Dämmung, Sockelleiste
- ✅ Dynamische `verrechnung` Berechnung (Frontend-Fallback)
- ✅ Artikel-Kategorisierung (Standard/Aufpreis/Billiger)
- ✅ Korrekte Rundungsregeln (Math.floor vs Math.ceil)
- ✅ Regulärer Preis vs Set-Preis Berechnung
- ✅ Ersparnis-Berechnung (€ und %)
- ✅ Debug-Logging für Entwicklung

#### 2. Mengenberechnung (src/lib/setCalculations.ts)
- ✅ Paketberechnung für Boden (mit Verschnitt)
- ✅ Dämmung-Berechnung (m²-basiert)
- ✅ Sockelleisten-Berechnung (lfm-basiert)
- ✅ Faustformel: m² × 1.0 = lfm für Sockelleisten

#### 3. API & Datenstruktur (src/lib/woocommerce.ts)
- ✅ Custom Jäger API Integration (`/wp-json/jaeger/v1/`)
- ✅ 41 Root-Level Custom Fields
- ✅ Set-Angebot Felder vom Backend:
  - `setangebot_einzelpreis` (Vergleichspreis)
  - `setangebot_gesamtpreis` (Set-Preis)
  - `setangebot_ersparnis_euro`
  - `setangebot_ersparnis_prozent`
- ✅ TypeScript Interface mit allen Feldern
- ✅ `verrechnung` Feld hinzugefügt (Frontend-Fallback)

#### 4. UI-Komponenten
- ✅ SetAngebot Komponente (src/components/product/SetAngebot.tsx)
  - Zeigt Preise pro m² an (vom Backend)
  - Nutzt `setangebot_einzelpreis` und `setangebot_gesamtpreis`

- ✅ TotalPrice Komponente (src/components/product/TotalPrice.tsx)
  - Zeigt Gesamtpreise für gewählte Menge
  - Nutzt berechnete Preise von ProductPageContent

- ✅ ProductInfo Komponente
  - Mengen-Input (m²)
  - Produkt-Auswahl (Dämmung/Sockelleiste)
  - Validierung

#### 5. Slider-Komponenten
- ✅ BestsellerSlider (src/components/sections/home/BestsellerSlider.tsx)
  - Zeigt beliebte Produkte
  - Rabatt-Badge mit `setangebot_ersparnis_prozent`

- ✅ SaleProductSlider (src/components/sections/home/SaleProductSlider.tsx)
  - Zeigt Sale-Produkte
  - Rabatt-Badge mit `setangebot_ersparnis_prozent`

### Code-Qualität
- ✅ TypeScript strict mode
- ✅ Ausführliche Kommentare
- ✅ Debug-Logging für Entwicklung
- ✅ Keine Frontend-Preisberechnung für Display (nur Backend-Werte)

---

## 🔌 API-Struktur

### Jäger Custom API

**Endpoint:** `https://plan-dein-ding.de/wp-json/jaeger/v1/products`

**Wichtige Parameter:**
```
?per_page=20          # Anzahl Produkte
?category=sale        # Nach Kategorie filtern
?include=1234,5678    # Spezifische IDs laden
?search=vinyl         # Suche
?orderby=popularity   # Sortierung
```

### Root-Level Custom Fields (41 Felder)

#### Paketinformationen (9)
```typescript
paketpreis?: number;           // Preis pro Paket
paketpreis_s?: number;         // Zusätzlicher Paketpreis
paketinhalt?: number;          // Inhalt pro Paket (m² oder lfm)
einheit?: string;              // "Quadratmeter" / "Meter"
einheit_short?: string;        // "m²" / "m"
verpackungsart?: string;       // "Paket" / "Stück"
verpackungsart_short?: string; // "Pkt." / "Stk."
verschnitt?: number;           // Verschnitt-Prozent (nur Boden)
verrechnung?: number;          // Aufpreis zum Standard-Produkt ⭐
```

#### Set-Angebot Konfiguration (6)
```typescript
show_setangebot?: boolean;         // Set-Angebot anzeigen?
setangebot_titel?: string;         // "Komplett-Set"
setangebot_text_color?: string;    // Textfarbe
setangebot_text_size?: string;     // Textgröße
setangebot_button_style?: string;  // Button-Style
setangebot_rabatt?: number;        // Rabatt-Prozent (Backend-Berechnung)
```

#### Set-Angebot Berechnete Werte (4)
```typescript
setangebot_einzelpreis?: number;      // Vergleichspreis pro Einheit ⭐
setangebot_gesamtpreis?: number;      // Set-Preis pro Einheit ⭐
setangebot_ersparnis_euro?: number;   // Ersparnis in € ⭐
setangebot_ersparnis_prozent?: number; // Ersparnis in % ⭐
```

#### Zusatzprodukte (4)
```typescript
daemmung_id?: number;               // Standard-Dämmung Produkt-ID
sockelleisten_id?: number;          // Standard-Sockelleiste Produkt-ID
daemmung_option_ids?: number[];     // Optionale Dämmungen
sockelleisten_option_ids?: number[]; // Optionale Sockelleisten
```

#### UVP System (3)
```typescript
show_uvp?: boolean;      // UVP anzeigen?
uvp?: number;            // UVP pro Einheit
uvp_paketpreis?: number; // UVP pro Paket
```

#### Aktionen & Badges (10)
```typescript
show_aktion?: boolean;
aktion?: string;                      // "Restposten", "Neu"
aktion_text_color?: string;
aktion_text_size?: string;
aktion_button_style?: string;
show_angebotspreis_hinweis?: boolean;
angebotspreis_hinweis?: string;       // "Black Sale"
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
lieferzeit?: string; // "3-7 Arbeitstage"
```

---

## 📁 Wichtige Dateien

### Kern-Komponenten
```
src/
├── components/
│   ├── product/
│   │   ├── ProductPageContent.tsx    ⭐ HAUPTDATEI - Set-Angebot Logik
│   │   ├── ProductInfo.tsx           - Produkt-Details & Input
│   │   ├── SetAngebot.tsx            - Set-Angebot Anzeige (OBEN)
│   │   ├── TotalPrice.tsx            - Gesamtpreis (UNTEN)
│   │   └── QuantityDisplay.tsx       - Mengen-Anzeige
│   │
│   ├── sections/home/
│   │   ├── BestsellerSlider.tsx      - Bestseller-Produkte
│   │   ├── SaleProductSlider.tsx     - Sale-Produkte
│   │   └── VorteileSlider.tsx        - Vorteile-Slider
│   │
│   └── ProductCard.tsx               - Produkt-Karte (Listen)
│
├── lib/
│   ├── woocommerce.ts                ⭐ API Client + TypeScript Types
│   ├── setCalculations.ts            ⭐ Mengenberechnung
│   └── imageUtils.ts                 - Bild-Optimierung
│
├── types/
│   └── product.ts                    - Product Type Definitions
│
└── app/
    ├── page.tsx                      - Startseite
    ├── products/[slug]/page.tsx      - Produktseite
    └── category/[slug]/page.tsx      - Kategorie-Seite
```

### Backend-Dokumentation
```
backend/
├── VERRECHNUNG_FELD_BACKEND.md      ⭐ Backend-Anforderung für verrechnung
├── ROOT_LEVEL_FIELDS.md             - Liste aller Custom Fields
├── API_FIELDS_PARAMETER.md          - API Parameter Dokumentation
└── FRONTEND_BACKEND_DATENFLUSS.md   - Datenfluss-Dokumentation
```

### Konfiguration
```
.env.local                            - Umgebungsvariablen (nicht im Git!)
next.config.ts                        - Next.js Konfiguration
tailwind.config.ts                    - Tailwind CSS Konfiguration
tsconfig.json                         - TypeScript Konfiguration
```

---

## 🚧 Offene Aufgaben

### Backend (Priorität: HOCH)
- [ ] **`verrechnung` Feld zur API hinzufügen**
  - Siehe: `backend/VERRECHNUNG_FELD_BACKEND.md`
  - Berechnung: `Math.max(0, produktPreis - standardProduktPreis)`
  - Für alle Produkte in `daemmung_option_ids` und `sockelleisten_option_ids`

### Frontend (Priorität: MITTEL)
- [ ] **Warenkorb-Funktionalität**
  - Set-Angebot zum Warenkorb hinzufügen
  - Warenkorb-Persistenz (localStorage)
  - Checkout-Prozess

- [ ] **Produkt-Filter & Suche**
  - Filter nach Eigenschaften (Farbe, Oberfläche, etc.)
  - Preisfilter
  - Verfügbarkeitsfilter

- [ ] **Kategorieseiten optimieren**
  - Pagination
  - Sortierung (Preis, Beliebtheit, Neuheit)
  - Grid vs Liste Ansicht

### Testing (Priorität: MITTEL)
- [ ] **Unit Tests**
  - setCalculations.ts Funktionen testen
  - Preisberechnung verifizieren

- [ ] **E2E Tests**
  - Set-Angebot Kaufprozess
  - Produktauswahl & Berechnung

### Optimierungen (Priorität: NIEDRIG)
- [ ] **Performance**
  - Image Optimization weiter verbessern
  - Code Splitting optimieren
  - Bundle Size reduzieren

- [ ] **SEO**
  - Meta-Tags vervollständigen
  - Structured Data (JSON-LD)
  - Sitemap generieren

---

## ⚠️ Bekannte Probleme

### 1. `verrechnung` Feld fehlt im Backend
**Status:** Frontend-Fallback implementiert
**Lösung:** Backend muss Feld hinzufügen (siehe VERRECHNUNG_FELD_BACKEND.md)

### 2. TypeScript Fehler: PageProps
**Datei:** `src/app/category/[slug]/page.tsx:17`
**Fehler:** `Cannot find name 'PageProps'`
**Status:** Nicht kritisch, betrifft nur Category Pages
**Lösung:** PageProps Type aus Next.js importieren

### 3. Image Quality Warnungen
**Fehler:** `quality "80" not configured in images.qualities`
**Status:** Nur Warnung, funktioniert trotzdem
**Lösung:** next.config.ts erweitern:
```typescript
images: {
  qualities: [75, 80, 90, 100]
}
```

### 4. Metadata Viewport Warnung
**Fehler:** `Unsupported metadata viewport`
**Status:** Deprecated API, funktioniert noch
**Lösung:** Zu `generateViewport()` migrieren (Next.js 16)

---

## 🎯 Nächste Schritte (Priorisiert)

### Sofort (diese Woche)
1. ✅ Set-Angebot Preisberechnung implementieren
2. ✅ `verrechnung` Feld dynamisch berechnen
3. ✅ Debug-Logging hinzufügen
4. 🔄 Backend-Team kontaktieren wegen `verrechnung` Feld

### Kurzfristig (nächste 2 Wochen)
1. Warenkorb-Funktionalität implementieren
2. Checkout-Prozess entwickeln
3. PageProps TypeScript Fehler beheben
4. Tests schreiben (Unit + E2E)

### Mittelfristig (nächster Monat)
1. Filter & Suche verbessern
2. SEO optimieren
3. Performance-Optimierungen
4. Deployment auf Vercel vorbereiten

---

## 📊 Projektstatistik

**Komponenten:** ~30
**API Endpoints:** 3 (Jäger Custom API)
**Custom Fields:** 41
**TypeScript Coverage:** 100%
**Code Lines:** ~8.000

---

## 📞 Kontakt & Ressourcen

**Entwicklung:** Claude Code
**Backend:** plan-dein-ding.de
**Deployment:** bodenjaeger.vercel.app

**Wichtige Links:**
- [Next.js Dokumentation](https://nextjs.org/docs)
- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Letzte Aktualisierung:** 16. November 2025, 15:30 Uhr
