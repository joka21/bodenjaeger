# SetAngebot-System - Vollständige Dokumentation

**Projekt:** Bodenjäger - Next.js 15.5.3 Headless E-Commerce
**Stand:** 2026-01-17
**System:** Bundle-Preissystem für Bodenbeläge

---

## 📋 Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Bundle-Komponenten](#bundle-komponenten)
3. [Design & UI-Komponenten](#design--ui-komponenten)
4. [Preis-Kategorien](#preis-kategorien)
5. [Berechnungslogik](#berechnungslogik)
6. [Datenfluss](#datenfluss)
7. [Komponenten-Architektur](#komponenten-architektur)
8. [Backend-Felder](#backend-felder)
9. [Beispiel-Berechnungen](#beispiel-berechnungen)
10. [Rundungsregeln](#rundungsregeln)

---

## 1. Überblick

Das **SetAngebot-System** ist das Herzstück des Bodenjäger-Shops. Es ermöglicht Kunden, Bodenbeläge mit passenden Zusatzprodukten (Dämmung, Sockelleiste) zu kaufen und dabei automatische Rabatte zu erhalten.

### Kernprinzip

**Frontend:** Berechnet MENGEN (Pakete, m², lfm)
**Backend:** Liefert PREISE (Set-Preise, Vergleichspreise, Ersparnis)

```
Kunde gibt ein: 20 m² Boden
    ↓
Frontend berechnet:
  - 8 Pakete Boden (à 2,67 m² = 21,36 m²)
  - 8 Pakete Dämmung (21,36 m²)
  - 9 Pakete Sockelleiste (21,36 lfm)
    ↓
Backend liefert Preise:
  - Boden: 13,99 €/m² (Set) vs 24,00 €/m² (Einzelkauf)
  - Dämmung: 0,00 €/m² (kostenlos im Set)
  - Sockelleiste: 0,00 €/lfm (kostenlos im Set)
    ↓
Frontend zeigt:
  - Gesamtpreis: 298,50 €
  - Vergleichspreis: 664,32 €
  - Ersparnis: 365,82 € (-55%)
```

---

## 2. Bundle-Komponenten

Ein Set-Angebot besteht aus 3 Komponenten:

### 2.1 Boden (Floor) - Pflicht

- **Rolle:** Hauptprodukt, immer dabei
- **Berechnung:** Eingabe vom Kunden (m²) → Pakete (aufgerundet)
- **Verschnitt:** 5% Abfall wird einberechnet
- **Preis:** Set-Preis (`setangebot_gesamtpreis`)
- **Rundung:** IMMER `Math.ceil()` - Kunde bekommt volle Pakete

**Beispiel:**
```
Kunde will: 20 m²
Verschnitt: 5% = 1 m²
Benötigt: 21 m²
Paketinhalt: 2,67 m²/Paket
Pakete: Math.ceil(21 / 2,67) = 8 Pakete
Tatsächlich: 8 × 2,67 = 21,36 m²
```

### 2.2 Dämmung (Insulation) - Optional

- **Rolle:** Trittschalldämmung, Standard ODER Premium
- **Berechnung:** Basiert auf Boden-m² (1:1 Verhältnis)
- **Preis-Typen:**
  - **Standard:** KOSTENLOS (0,00 €)
  - **Premium:** Nur DIFFERENZ wird berechnet (`verrechnung`)
  - **Günstiger:** Auch KOSTENLOS (keine Rückerstattung)
- **Rundung:**
  - Kostenlos: `Math.floor()` (kundenfreundlich)
  - Premium: `Math.ceil()` (faire Abrechnung)

**Beispiel Standard:**
```
Boden: 21,36 m²
Standard-Dämmung: 2,67 m²/Paket
Pakete: Math.floor(21,36 / 2,67) = 8 Pakete
Tatsächlich: 8 × 2,67 = 21,36 m²
Preis: 0,00 € (kostenlos)
```

**Beispiel Premium:**
```
Boden: 21,36 m²
Premium-Dämmung: 2,67 m²/Paket, +5,00 €/m² Aufpreis
Pakete: Math.ceil(21,36 / 2,67) = 8 Pakete
Tatsächlich: 8 × 2,67 = 21,36 m²
Preis: 21,36 × 5,00 = 106,80 €
```

### 2.3 Sockelleiste (Baseboard) - Optional

- **Rolle:** Fußleiste, Standard ODER Premium
- **Berechnung:** Linear meters (lfm) = Boden-m² × 1.0
- **Industrie-Standard:** Umfang ≈ Fläche (typische Raumproportionen)
- **Preis-Typen:** Wie Dämmung (Standard/Premium/Günstiger)
- **Rundung:** Wie Dämmung (floor/ceil je nach Typ)

**Beispiel:**
```
Boden: 21,36 m²
Benötigt: 21,36 lfm (Faktor 1.0)
Standard-Sockelleiste: 2,5 lfm/Paket
Pakete: Math.floor(21,36 / 2,5) = 8 Pakete
Tatsächlich: 8 × 2,5 = 20 lfm
Preis: 0,00 € (kostenlos)
```

---

## 3. Design & UI-Komponenten

### 3.1 Layout-Struktur

```
┌─────────────────────────────────────────────────────────┐
│  [Dein Set-Angebot] ← Roter Badge (schwebt)            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  Grauer Container (#e5e5e5)                         │ │
│ │                                                       │ │
│ │  ┌─────────┐  ┌─────────────┐  ┌─────────────┐     │ │
│ │  │  BODEN  │  │  DÄMMUNG    │  │ SOCKELLEISTE│     │ │
│ │  │         │  │ [Button >]  │  │  [Button >] │     │ │
│ │  │ [Bild]  │  │  [Bild]     │  │   [Bild]    │     │ │
│ │  │ Name    │  │  Name       │  │   Name      │     │ │
│ │  │ 24€→13€ │  │  0,55€→0€   │  │   3,50€→0€  │     │ │
│ │  └─────────┘  └─────────────┘  └─────────────┘     │ │
│ │                                                       │ │
│ │  ──────────────────────────────────────────────────  │ │
│ │  Gesamt    ~~664,32 €~~  298,50 €      [-55%]      │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Farben & Styling

**Container:**
- Hintergrund: `#e5e5e5` (Hellgrau)
- Radius: `rounded-md` (6px)
- Padding: `p-4 sm:p-6` (16-24px)

**Badge (Roter Header):**
- Hintergrund: `#ed1b24` (Bodenjäger Rot)
- Text: Weiß, fett
- Position: `mb-[-36px]` (schwebt auf Container-Kante)
- Radius: `rounded-full`

**Produktkarten:**
- Hintergrund: `#ffffff` (Weiß)
- Radius: `rounded-xl` (12px)
- Shadow: `shadow-sm hover:shadow-xl`
- Transition: `duration-300`

**Preisanzeige:**
- Durchgestrichen: `text-gray-400 line-through` (Vergleichspreis)
- Set-Preis: `text-red-600 font-bold` (Rabattpreis)
- Kostenlos: `text-green-600` (0,00 €)
- Aufpreis: `text-red-600` (+5,00 €)

**Ersparnis-Badge:**
- Hintergrund: `bg-red-600` (Rot)
- Text: `text-white font-bold text-xl`
- Format: `-55%`
- Shadow: `shadow-lg`

### 3.3 Responsive Design

**Desktop (md+):**
- 3-Spalten-Grid: `grid-cols-3`
- Buttons ÜBER den Karten (Dämmung, Sockelleiste)
- Große Produktbilder (400×400px)
- Horizontale Preisanzeige

**Mobile (<md):**
- Vertikales Layout
- 3-Spalten pro Zeile: `[Bild 1.4fr | Name 1.2fr | Preis 1.2fr]`
- Buttons UNTER dem Namen
- Kompakte Produktbilder (aspect-ratio 4:3)
- Stackable Preise

### 3.4 Buttons & Interaktion

**"Andere Dämmung wählen" / "Andere Sockelleiste wählen":**
- Style: `bg-gray-800 hover:bg-gray-700`
- Text: `text-white text-[11px]`
- Icon: `>` Pfeil rechts
- Action: Öffnet Modal mit Produkt-Optionen

**Modal:**
- Overlay: `bg-black bg-opacity-60`
- Container: `bg-white rounded-2xl max-w-3xl`
- Header: `bg-gradient-to-r from-red-600 to-red-700`
- Produkt-Auswahl: Radio Buttons, Bild, Name, Preis, Differenz-Badge

---

## 4. Preis-Kategorien

### 4.1 Standard-Artikel (`verrechnung = 0`)

**Merkmale:**
- Im Bundle KOSTENLOS
- Vergleichspreis durchgestrichen
- Set-Preis: 0,00 €

**Rundung:** `Math.floor()` (abrunden, kundenfreundlich)

**Beispiel:**
```
Standard-Dämmung:
  Regulärer Preis: 0,55 €/m²
  Im Set: 0,00 €/m²
  Anzeige: ~~0,55 €~~ 0,00 €/m²
```

**Logik:**
```typescript
if (verrechnung === 0) {
  isFree = true;
  packages = Math.floor(targetM2 / paketinhalt);
  setPrice = 0;
}
```

### 4.2 Premium-Artikel (`verrechnung > 0`)

**Merkmale:**
- Nur die DIFFERENZ zum Standard wird berechnet
- Vergleichspreis = Vollpreis des Premium-Produkts
- Set-Preis = Aufpreis (Differenz)

**Rundung:** `Math.ceil()` (aufrunden, faire Abrechnung)

**Beispiel:**
```
Premium-Dämmung:
  Produkt-Preis: 9,99 €/m²
  Standard-Preis: 4,99 €/m²
  Verrechnung: 5,00 €/m²
  Im Set: +5,00 €/m²
  Anzeige: ~~9,99 €~~ +5,00 €/m²
```

**Logik:**
```typescript
if (verrechnung > 0) {
  isFree = false;
  packages = Math.ceil(targetM2 / paketinhalt);
  setPrice = actualM2 × verrechnung;
}
```

### 4.3 Günstigere Alternative (`price < standardPrice`)

**Merkmale:**
- Auch KOSTENLOS (keine Rückerstattung)
- Kunde profitiert bereits vom Bundle-Rabatt
- Vergleichspreis = Preis der günstigeren Alternative

**Rundung:** `Math.floor()` (abrunden, kundenfreundlich)

**Beispiel:**
```
Günstige Dämmung:
  Produkt-Preis: 3,99 €/m²
  Standard-Preis: 4,99 €/m²
  Verrechnung: 0 € (keine negative Verrechnung)
  Im Set: 0,00 €/m²
  Anzeige: ~~3,99 €~~ 0,00 €/m²
```

**Logik:**
```typescript
const verrechnung = Math.max(0, productPrice - standardPrice);
// Ergebnis: 0 (weil 3,99 - 4,99 < 0)
isFree = true;
packages = Math.floor(targetM2 / paketinhalt);
setPrice = 0;
```

---

## 5. Berechnungslogik

### 5.1 Frontend-Berechnungen (Mengen)

**Datei:** `src/lib/setCalculations.ts`

#### Boden (Floor)

```typescript
function calculateFloorQuantity(
  wantedM2: number,
  paketinhalt: number,
  verschnitt: number = 0.05
): FloorQuantity {
  // 1. Verschnitt addieren (5% Abfall)
  const m2WithVerschnitt = wantedM2 * (1 + verschnitt);

  // 2. IMMER aufrunden (Kunde braucht volle Pakete)
  const packages = Math.ceil(m2WithVerschnitt / paketinhalt);

  // 3. Tatsächliche m² berechnen
  const actualM2 = packages * paketinhalt;

  return { packages, actualM2, verschnitt };
}
```

**Beispiel:**
```
Input: 20 m², Paketinhalt: 2.67 m², Verschnitt: 5%
→ 20 × 1.05 = 21 m²
→ Math.ceil(21 / 2.67) = 8 Pakete
→ 8 × 2.67 = 21.36 m² (tatsächlich)
```

#### Dämmung (Insulation)

```typescript
function calculateInsulationQuantity(
  floorM2: number,
  paketinhalt: number,
  isFree: boolean
): InsulationQuantity {
  if (isFree) {
    // KOSTENLOS: Abrunden (kundenfreundlich)
    const packages = Math.floor(floorM2 / paketinhalt);
    const actualM2 = packages * paketinhalt;
    return { packages, actualM2, isFree: true };
  } else {
    // AUFPREIS: Aufrunden (faire Abrechnung)
    const packages = Math.ceil(floorM2 / paketinhalt);
    const actualM2 = packages * paketinhalt;
    return { packages, actualM2, isFree: false };
  }
}
```

**Beispiel Standard (kostenlos):**
```
Input: 21.36 m², Paketinhalt: 2.67 m²
→ Math.floor(21.36 / 2.67) = 8 Pakete
→ 8 × 2.67 = 21.36 m²
→ Preis: 0 €
```

**Beispiel Premium (+5 €/m²):**
```
Input: 21.36 m², Paketinhalt: 2.67 m²
→ Math.ceil(21.36 / 2.67) = 8 Pakete
→ 8 × 2.67 = 21.36 m²
→ Preis: 21.36 × 5 = 106.80 €
```

#### Sockelleiste (Baseboard)

```typescript
function calculateBaseboardQuantity(
  floorM2: number,
  paketinhalt: number,
  isFree: boolean
): BaseboardQuantity {
  // Laufmeter = Bodenfläche × 1.0 (Industrie-Standard)
  const wantedLfm = floorM2 * 1.0;

  if (isFree) {
    const packages = Math.floor(wantedLfm / paketinhalt);
    const actualLfm = packages * paketinhalt;
    return { packages, actualLfm, isFree: true };
  } else {
    const packages = Math.ceil(wantedLfm / paketinhalt);
    const actualLfm = packages * paketinhalt;
    return { packages, actualLfm, isFree: false };
  }
}
```

**Beispiel:**
```
Input: 21.36 m² Boden, Paketinhalt: 2.5 lfm/Paket
→ Benötigt: 21.36 lfm (m² × 1.0)
→ Math.floor(21.36 / 2.5) = 8 Pakete
→ 8 × 2.5 = 20 lfm
→ Preis: 0 € (kostenlos)
```

### 5.2 Backend-Berechnungen (Preise)

**Backend liefert (Custom Jäger API):**

```typescript
interface BackendPricing {
  // Set-Angebot Preise (PRE-CALCULATED)
  setangebot_einzelpreis: 24.00;      // Einzelkauf-Preis
  setangebot_gesamtpreis: 13.99;      // Set-Preis
  setangebot_ersparnis_euro: 10.01;   // Ersparnis in €
  setangebot_ersparnis_prozent: 41.7; // Ersparnis in %

  // Zusatzprodukt-Verrechnung
  verrechnung: 5.00;  // Aufpreis für Premium-Varianten
}
```

**Frontend verwendet diese Werte DIREKT:**

```typescript
// Boden-Preis
const bodenSetPrice = product.setangebot_gesamtpreis; // 13.99 €
const bodenComparisonPrice = product.setangebot_einzelpreis; // 24.00 €

// Dämmung-Preis (falls Premium)
const daemmungSetPrice = selectedDaemmung.verrechnung
  ? actualM2 × verrechnung  // z.B. 21.36 × 5 = 106.80 €
  : 0;                       // Kostenlos

// Sockelleiste-Preis (falls Premium)
const sockelleisteSetPrice = selectedSockelleiste.verrechnung
  ? actualLfm × verrechnung
  : 0;
```

### 5.3 Gesamtpreis-Berechnung

**Datei:** `src/components/product/ProductPageContent.tsx` (Zeilen 56-169)

```typescript
// SCHRITT 1: BODEN
const bodenSetPrice = product.setangebot_gesamtpreis || product.price;
const bodenSetPriceTotal = quantities.floor.actualM2 × bodenSetPrice;

const bodenComparisonPrice = product.setangebot_einzelpreis || product.uvp || product.price;
const bodenComparisonPriceTotal = quantities.floor.actualM2 × bodenComparisonPrice;

// SCHRITT 2: DÄMMUNG
let daemmungSetPrice = 0;
let daemmungRegularPrice = 0;

if (selectedDaemmung && quantities.insulation) {
  const verrechnung = selectedDaemmung.verrechnung
    ?? Math.max(0, selectedDaemmung.price - standardDaemmung.price);

  if (quantities.insulation.isFree) {
    daemmungSetPrice = 0;  // Kostenlos
  } else {
    daemmungSetPrice = quantities.insulation.actualM2 × verrechnung;  // Aufpreis
  }

  // Regulärer Preis (für Vergleich)
  const paketeRegular = Math.ceil(quantities.floor.actualM2 / daemmungPaketinhalt);
  const m2Regular = paketeRegular × daemmungPaketinhalt;
  daemmungRegularPrice = m2Regular × selectedDaemmung.price;
}

// SCHRITT 3: SOCKELLEISTE (analog zu Dämmung)
// ...

// SCHRITT 4: GESAMTPREISE
const comparisonPriceTotal = bodenComparisonPriceTotal + daemmungRegularPrice + sockelleisteRegularPrice;
const totalDisplayPrice = bodenSetPriceTotal + daemmungSetPrice + sockelleisteSetPrice;
const savings = comparisonPriceTotal - totalDisplayPrice;
const savingsPercent = (savings / comparisonPriceTotal) × 100;
```

---

## 6. Datenfluss

### 6.1 Backend → Frontend

```
WordPress Backend (plan-dein-ding.de)
    ↓
Custom Jäger Plugin
    ↓
REST API: /wp-json/jaeger/v1/products
    ↓
41 Root-Level Custom Fields
    ├─ paketinhalt, paketpreis, verschnitt
    ├─ setangebot_einzelpreis, setangebot_gesamtpreis
    ├─ setangebot_ersparnis_euro, setangebot_ersparnis_prozent
    ├─ daemmung_id, daemmung_option_ids
    ├─ sockelleisten_id, sockelleisten_option_ids
    └─ verrechnung (für Premium-Produkte)
    ↓
Next.js API Client (src/lib/woocommerce.ts)
    ↓
TypeScript Interface: StoreApiProduct
    ↓
Server-Side Rendering (app/products/[slug]/page.tsx)
    ├─ Batch-Load: Main Product + Related Products
    └─ Props → ProductPageContent (Client Component)
```

### 6.2 User Interaction Flow

```
1. Kunde gibt m² ein
    ↓ QuantitySelector
    │ onChange(packages, sqm)
    ↓
2. ProductPageContent State Update
    ↓ setWantedM2(sqm)
    │ useMemo triggers recalculation
    ↓
3. calculateSetQuantities()
    ├─ Floor: packages, actualM2
    ├─ Insulation: packages, actualM2, isFree
    └─ Baseboard: packages, actualLfm, isFree
    ↓
4. Price Calculation (useMemo)
    ├─ Backend prices (setangebot_*)
    ├─ Verrechnung (for premium products)
    └─ Total, Comparison, Savings
    ↓
5. Display Components
    ├─ SetAngebot: Bundle cards + Gesamt
    ├─ TotalPrice: Final price + "Add to Cart"
    └─ QuantityDisplay: Package counts
    ↓
6. Add to Cart
    ↓ prepareSetForCart()
    │ Creates SetBundle object
    ↓ CartContext.addSetToCart()
    │ Stores in localStorage
    ↓
7. Cart Display
    └─ CartSetItem: Shows bundle breakdown
```

### 6.3 Component Hierarchy

```
ProductPageContent (Master Orchestrator)
│
├─ State Management
│   ├─ wantedM2: number
│   ├─ selectedDaemmung: StoreApiProduct | null
│   └─ selectedSockelleiste: StoreApiProduct | null
│
├─ Calculations (useMemo)
│   ├─ quantities = calculateSetQuantities(...)
│   └─ prices = { totalDisplayPrice, comparisonPriceTotal, savings, savingsPercent }
│
├─ Left Column
│   └─ ImageGallery
│
└─ Right Column
    ├─ ProductInfo
    │   ├─ Product Title + Features
    │   └─ SetAngebot (Desktop) / SetAngebotMobile (Mobile)
    │       ├─ Boden Card (no button)
    │       ├─ Dämmung Card (+ "Andere wählen" button → Modal)
    │       ├─ Sockelleiste Card (+ "Andere wählen" button → Modal)
    │       └─ Gesamt Row (comparison vs set price)
    │
    ├─ QuantitySelector
    │   ├─ Input: Packages or m²
    │   └─ onChange → setWantedM2()
    │
    └─ TotalPrice
        ├─ Gesamtsumme Display
        ├─ Ersparnis Display
        ├─ "In den Warenkorb" Button → addSetToCart()
        └─ "Individuelles Angebot" Button
```

---

## 7. Komponenten-Architektur

### 7.1 ProductPageContent.tsx (Master)

**Rolle:** Orchestriert alle Berechnungen und verwaltet State

**Props:** (from Server-Side)
```typescript
{
  product: StoreApiProduct,              // Main product
  daemmungProduct: StoreApiProduct,      // Standard insulation
  sockelleisteProduct: StoreApiProduct,  // Standard baseboard
  daemmungOptions: StoreApiProduct[],    // Alternative insulations
  sockelleisteOptions: StoreApiProduct[] // Alternative baseboards
}
```

**State:**
```typescript
const [wantedM2, setWantedM2] = useState(10);
const [selectedDaemmung, setSelectedDaemmung] = useState(daemmungProduct);
const [selectedSockelleiste, setSelectedSockelleiste] = useState(sockelleisteProduct);
```

**Calculations:**
```typescript
// 1. Quantities (useMemo)
const quantities = calculateSetQuantities(wantedM2, product, ...);

// 2. Prices (useMemo)
const prices = {
  totalDisplayPrice: ...,
  comparisonPriceTotal: ...,
  savings: ...,
  savingsPercent: ...
};
```

**File:** 362 lines
**Location:** `src/components/product/ProductPageContent.tsx`

### 7.2 SetAngebot.tsx (Desktop Display)

**Rolle:** Zeigt Bundle-Komponenten und Gesamt-Preis (Desktop)

**Props:**
```typescript
{
  // Product Info
  productName: string,
  productImage: string,
  basePrice: number,        // Set-Preis pro m²
  regularPrice: number,     // Vergleichspreis pro m²
  einheit: string,          // "m²"

  // Dämmung
  daemmungName: string,
  daemmungImage: string,
  daemmungPrice: number,
  daemmungRegularPrice: number,
  daemmungOptions: StoreApiProduct[],

  // Sockelleiste
  sockelleisteName: string,
  sockelleisteImage: string,
  sockelleistePrice: number,
  sockelleisteRegularPrice: number,
  sockelleisteOptions: StoreApiProduct[],

  // Gesamt-Preise (from ProductPageContent)
  comparisonPriceTotal: number,
  totalDisplayPrice: number,
  savingsAmount: number,
  savingsPercent: number,

  // Callbacks
  onProductSelection: (daemmung, sockelleiste) => void
}
```

**Features:**
- 3-Spalten Grid (Boden, Dämmung, Sockelleiste)
- "Andere wählen" Buttons für Dämmung & Sockelleiste
- Modal für Produkt-Auswahl
- Gesamt-Zeile mit Vergleichspreis und Ersparnis-Badge

**File:** 650 lines
**Location:** `src/components/product/SetAngebot.tsx`

### 7.3 SetAngebotMobile.tsx (Mobile Display)

**Rolle:** Vereinfachte Version für Mobile (ohne Modal)

**Unterschiede zu Desktop:**
- Vertikales Layout statt Grid
- Kompakte Produktkarten (3-Spalten: Bild | Name+Button | Preis)
- Keine Modals (direkte Auswahl)
- Kleinere Schrift und Icons

**File:** ~400 lines (geschätzt)
**Location:** `src/components/product/SetAngebotMobile.tsx`

### 7.4 ProductInfo.tsx (Wrapper)

**Rolle:** Verbindet Produktinfos mit SetAngebot

**Berechnet:**
```typescript
// Boden-Preise
const basePrice = paketpreis_s / paketinhalt || paketpreis / paketinhalt;
const regularPrice = product.setangebot_einzelpreis || product.uvp || paketpreis / paketinhalt;

// Dämmung-Preise
const daemmungSetPrice = 0;  // Standard immer kostenlos
const daemmungRegularPrice = daemmungPaketpreis / daemmungPaketinhalt;

// Sockelleiste-Preise (analog)
```

**Rendert:**
- Desktop: `<SetAngebot />` (mit Modal)
- Mobile: `<SetAngebotMobile />` (ohne Modal)

**File:** 194 lines
**Location:** `src/components/product/ProductInfo.tsx`

### 7.5 TotalPrice.tsx (Checkout Action)

**Rolle:** Zeigt finalen Preis und "In den Warenkorb" Button

**Props:**
```typescript
{
  quantities: SetQuantityCalculation,
  prices: SetPrices,
  einheit: string,
  product: StoreApiProduct,
  selectedDaemmung: StoreApiProduct | null,
  selectedSockelleiste: StoreApiProduct | null,
  daemmungProduct: StoreApiProduct | null,
  sockelleisteProduct: StoreApiProduct | null,
  lieferzeit: string
}
```

**Features:**
- Gesamtsumme (inkl. MwSt.)
- Ersparnis-Anzeige (grün)
- "In den Warenkorb" Button → `addSetToCart()`
- "Individuelles Angebot anfragen" Button
- Lieferzeit-Info
- Success Message nach Add-to-Cart

**Warenkorb-Logik:**
```typescript
const handleAddToCart = () => {
  // Preise nochmal berechnen (analog zu ProductPageContent)
  const setBundle = {
    floor: { product, packages, actualM2, setPricePerUnit, regularPricePerUnit },
    insulation: { product, packages, actualM2, setPricePerUnit, regularPricePerUnit },
    baseboard: { product, packages, actualLfm, setPricePerUnit, regularPricePerUnit }
  };

  addSetToCart(setBundle);
  setAddedToCart(true);
  setTimeout(() => setAddedToCart(false), 3000);
};
```

**File:** 265 lines
**Location:** `src/components/product/TotalPrice.tsx`

### 7.6 QuantitySelector.tsx (Input)

**Rolle:** Ermöglicht Eingabe von Paketen ODER m²

**Props:**
```typescript
{
  paketinhalt: number,
  einheit: string,
  onQuantityChange: (packages: number, sqm: number) => void
}
```

**Features:**
- Toggle: Pakete ↔ Quadratmeter
- +/- Buttons (Increment/Decrement)
- Manuelle Eingabe (Input Field)
- Blur-Validation (mindestens 1)
- Automatische Umrechnung

**Logik:**
```typescript
const handleSqmChange = (newSqm: number) => {
  const newPackages = Math.ceil(newSqm / paketinhalt);
  onQuantityChange(newPackages, newSqm);
};

const handlePackagesChange = (newPackages: number) => {
  const newSqm = newPackages * paketinhalt;
  onQuantityChange(newPackages, newSqm);
};
```

**File:** 254 lines
**Location:** `src/components/product/QuantitySelector.tsx`

---

## 8. Backend-Felder

### 8.1 Root-Level Custom Fields (41 Total)

**API Endpoint:** `/wp-json/jaeger/v1/products`

#### Paket-Information (9 Felder)

```typescript
paketpreis?: number;          // 52.99 (Preis pro Paket)
paketpreis_s?: number | null; // 37.32 (Sale-Preis pro Paket, optional)
paketinhalt?: number;         // 2.67 (m² oder lfm pro Paket)
einheit?: string;             // "Quadratmeter"
einheit_short?: string;       // "m²", "lfm", "m"
verpackungseinheit?: string;  // "Paket"
verschnitt?: number;          // 0.05 (5% Abfall)
paketpreis_einheit?: number;  // 19.99 (Preis pro Einheit, berechnet)
paketpreis_s_einheit?: number;// 13.99 (Sale-Preis pro Einheit, berechnet)
```

#### UVP-System (3 Felder)

```typescript
show_uvp?: boolean;         // true/false (UVP anzeigen?)
uvp?: number | null;        // 24.00 (Unverbindliche Preisempfehlung)
uvp_paketpreis?: number;    // 64.08 (UVP pro Paket)
```

#### Set-Angebot Preise (4 Felder) ⭐ WICHTIG

```typescript
setangebot_einzelpreis?: number;       // 24.00 (Einzelkauf-Preis pro m²)
setangebot_gesamtpreis?: number;       // 13.99 (Set-Preis pro m²)
setangebot_ersparnis_euro?: number;    // 10.01 (Ersparnis in €)
setangebot_ersparnis_prozent?: number; // 41.71 (Ersparnis in %)
```

#### Set-Angebot Config (6 Felder)

```typescript
show_setangebot?: boolean;           // true/false
setangebot_titel?: string;           // "Dein Set-Angebot"
setangebot_text_color?: string;      // "#ffffff"
setangebot_bg_color?: string;        // "#ed1b24"
setangebot_font_weight?: string;     // "bold"
setangebot_font_size?: string;       // "18px"
```

#### Produkt-Links (4 Felder)

```typescript
daemmung_id?: number;              // 123 (Standard-Dämmung ID)
sockelleisten_id?: number;         // 456 (Standard-Sockelleiste ID)
daemmung_option_ids?: number[];    // [123, 124, 125] (Alternative Dämmungen)
sockelleisten_option_ids?: number[]; // [456, 457, 458] (Alternative Sockelleisten)
```

#### Verrechnung (1 Feld) ⭐ KRITISCH

```typescript
verrechnung?: number;  // 5.00 (Aufpreis für Premium-Varianten)
```

**Berechnung (wenn Backend nicht liefert):**
```typescript
const verrechnung = product.verrechnung
  ?? Math.max(0, productPrice - standardPrice);
```

#### Lieferzeit (2 Felder)

```typescript
show_lieferzeit?: boolean;  // true/false
lieferzeit?: string;        // "3-7 Arbeitstage"
```

#### Weitere Felder (12 Felder)

```typescript
// Marketing
show_text_produktuebersicht?: boolean;
text_produktuebersicht?: string;
artikelbeschreibung?: string;

// Badges
show_aktion?: boolean;
aktion?: string;
show_angebotspreis_hinweis?: boolean;
angebotspreis_hinweis?: string;
show_empfehlung?: boolean;
show_neuheit?: boolean;
show_sale?: boolean;

// Testing
testdummy?: string;
```

### 8.2 Standard WooCommerce Fields

```typescript
id: number;                    // 123
name: string;                  // "Laminat Torgas Eiche"
slug: string;                  // "laminat-torgas-eiche"
price: number;                 // 13.99
regular_price: number;         // 19.99
sale_price: number | null;     // 13.99
sku: string;                   // "LAM-TORGAS-OAK"
description: string;           // HTML
short_description: string;     // HTML
images: Array<{
  id: number;
  src: string;
  name: string;
  alt: string;
}>;
categories: Array<{
  id: number;
  name: string;
  slug: string;
}>;
```

---

## 9. Beispiel-Berechnungen

### Beispiel 1: Standard-Set (Alles kostenlos)

**Eingabe:**
- Boden: 20 m²
- Dämmung: Standard (kostenlos)
- Sockelleiste: Standard (kostenlos)

**Backend-Werte:**
```
Boden:
  setangebot_einzelpreis: 24.00 €/m²
  setangebot_gesamtpreis: 13.99 €/m²
  paketinhalt: 2.67 m²/Paket
  verschnitt: 5%

Dämmung (Standard):
  price: 0.55 €/m²
  paketinhalt: 2.67 m²/Paket
  verrechnung: 0

Sockelleiste (Standard):
  price: 3.50 €/lfm
  paketinhalt: 2.5 lfm/Paket
  verrechnung: 0
```

**Mengen-Berechnung:**
```
1. BODEN:
   Eingabe: 20 m²
   Mit Verschnitt: 20 × 1.05 = 21 m²
   Pakete: Math.ceil(21 / 2.67) = 8 Pakete
   Tatsächlich: 8 × 2.67 = 21.36 m²

2. DÄMMUNG (kostenlos):
   Basis: 21.36 m² (vom Boden)
   Pakete: Math.floor(21.36 / 2.67) = 8 Pakete
   Tatsächlich: 8 × 2.67 = 21.36 m²

3. SOCKELLEISTE (kostenlos):
   Basis: 21.36 lfm (vom Boden × 1.0)
   Pakete: Math.floor(21.36 / 2.5) = 8 Pakete
   Tatsächlich: 8 × 2.5 = 20 lfm
```

**Preis-Berechnung:**
```
BODEN:
  Set: 21.36 × 13.99 = 298.77 €
  Vergleich: 21.36 × 24.00 = 512.64 €

DÄMMUNG:
  Set: 0 € (kostenlos)
  Vergleich: 21.36 × 0.55 = 11.75 €

SOCKELLEISTE:
  Set: 0 € (kostenlos)
  Vergleich: 20 × 3.50 = 70.00 €

GESAMT:
  Set-Preis: 298.77 €
  Vergleichspreis: 512.64 + 11.75 + 70.00 = 594.39 €
  Ersparnis: 594.39 - 298.77 = 295.62 €
  Prozent: (295.62 / 594.39) × 100 = 49.73%
```

**Anzeige:**
```
┌─────────────────────────────────────┐
│  Boden           ~~24,00~~ 13,99 €  │
│  Dämmung         ~~0,55~~   0,00 €  │
│  Sockelleiste    ~~3,50~~   0,00 €  │
│  ────────────────────────────────────│
│  Gesamt  ~~594,39~~  298,77 €  -50% │
└─────────────────────────────────────┘
```

### Beispiel 2: Premium-Dämmung (+5 €/m²)

**Eingabe:**
- Boden: 20 m²
- Dämmung: Premium (+5 €/m²)
- Sockelleiste: Standard (kostenlos)

**Backend-Werte:**
```
Dämmung (Premium):
  price: 9.99 €/m²
  paketinhalt: 2.67 m²/Paket
  verrechnung: 5.00 €/m²
```

**Mengen-Berechnung:**
```
BODEN: (wie Beispiel 1)
  8 Pakete = 21.36 m²

DÄMMUNG (Premium, Aufpreis):
  Basis: 21.36 m²
  Pakete: Math.ceil(21.36 / 2.67) = 8 Pakete
  Tatsächlich: 8 × 2.67 = 21.36 m²

SOCKELLEISTE: (wie Beispiel 1)
  8 Pakete = 20 lfm
```

**Preis-Berechnung:**
```
BODEN:
  Set: 21.36 × 13.99 = 298.77 €
  Vergleich: 21.36 × 24.00 = 512.64 €

DÄMMUNG:
  Set: 21.36 × 5.00 = 106.80 € (nur Aufpreis!)
  Vergleich: 21.36 × 9.99 = 213.39 € (Vollpreis)

SOCKELLEISTE:
  Set: 0 € (kostenlos)
  Vergleich: 20 × 3.50 = 70.00 €

GESAMT:
  Set-Preis: 298.77 + 106.80 + 0 = 405.57 €
  Vergleichspreis: 512.64 + 213.39 + 70.00 = 796.03 €
  Ersparnis: 796.03 - 405.57 = 390.46 €
  Prozent: (390.46 / 796.03) × 100 = 49.04%
```

**Anzeige:**
```
┌─────────────────────────────────────┐
│  Boden           ~~24,00~~ 13,99 €  │
│  Dämmung         ~~9,99~~  +5,00 €  │
│  Sockelleiste    ~~3,50~~   0,00 €  │
│  ────────────────────────────────────│
│  Gesamt  ~~796,03~~  405,57 €  -49% │
└─────────────────────────────────────┘
```

### Beispiel 3: Günstigere Dämmung (3,99 €/m²)

**Eingabe:**
- Boden: 20 m²
- Dämmung: Günstiger (3,99 €/m², billiger als Standard 4,99 €)
- Sockelleiste: Standard (kostenlos)

**Backend-Werte:**
```
Dämmung (Günstig):
  price: 3.99 €/m²
  paketinhalt: 2.67 m²/Paket
  verrechnung: 0 (weil 3.99 < 4.99)
```

**Verrechnung-Berechnung:**
```typescript
const verrechnung = Math.max(0, 3.99 - 4.99);
// = Math.max(0, -1.00)
// = 0 (keine negative Verrechnung)
```

**Mengen-Berechnung:**
```
DÄMMUNG (kostenlos, weil günstiger):
  Basis: 21.36 m²
  Pakete: Math.floor(21.36 / 2.67) = 8 Pakete (ABRUNDEN)
  Tatsächlich: 8 × 2.67 = 21.36 m²
```

**Preis-Berechnung:**
```
BODEN:
  Set: 298.77 €
  Vergleich: 512.64 €

DÄMMUNG:
  Set: 0 € (kostenlos, keine Rückerstattung!)
  Vergleich: 21.36 × 3.99 = 85.23 €

SOCKELLEISTE:
  Set: 0 €
  Vergleich: 70.00 €

GESAMT:
  Set-Preis: 298.77 €
  Vergleichspreis: 512.64 + 85.23 + 70.00 = 667.87 €
  Ersparnis: 667.87 - 298.77 = 369.10 €
  Prozent: (369.10 / 667.87) × 100 = 55.27%
```

**Anzeige:**
```
┌─────────────────────────────────────┐
│  Boden           ~~24,00~~ 13,99 €  │
│  Dämmung         ~~3,99~~   0,00 €  │
│  Sockelleiste    ~~3,50~~   0,00 €  │
│  ────────────────────────────────────│
│  Gesamt  ~~667,87~~  298,77 €  -55% │
└─────────────────────────────────────┘
```

**Wichtig:** Kunde bekommt KEINE Rückerstattung für günstigere Dämmung, profitiert aber vom höheren Bundle-Rabatt insgesamt.

---

## 10. Rundungsregeln

### 10.1 Übersicht

| Komponente | Kontext | Rundung | Begründung |
|------------|---------|---------|------------|
| **Boden** | Immer | `Math.ceil()` | Kunde braucht volle Pakete |
| **Dämmung** | Kostenlos | `Math.floor()` | Kundenfreundlich, weniger Abfall |
| **Dämmung** | Premium | `Math.ceil()` | Faire Abrechnung des Aufpreises |
| **Sockelleiste** | Kostenlos | `Math.floor()` | Kundenfreundlich |
| **Sockelleiste** | Premium | `Math.ceil()` | Faire Abrechnung des Aufpreises |
| **Vergleichspreis** | Immer | `Math.ceil()` | Maximale Ersparnis zeigen |

### 10.2 Code-Beispiele

**Boden (immer aufrunden):**
```typescript
const packages = Math.ceil(m2WithVerschnitt / paketinhalt);
// Beispiel: Math.ceil(21.00 / 2.67) = Math.ceil(7.865) = 8
```

**Dämmung Standard (abrunden):**
```typescript
if (isFree) {
  const packages = Math.floor(floorM2 / paketinhalt);
  // Beispiel: Math.floor(21.36 / 2.67) = Math.floor(8.00) = 8
}
```

**Dämmung Premium (aufrunden):**
```typescript
if (!isFree) {
  const packages = Math.ceil(floorM2 / paketinhalt);
  // Beispiel: Math.ceil(21.36 / 2.67) = Math.ceil(8.00) = 8
}
```

**Vergleichspreis (immer aufrunden):**
```typescript
const daemmungPaketeRegular = Math.ceil(quantities.floor.actualM2 / daemmungPaketinhalt);
const daemmungM2Regular = daemmungPaketeRegular × daemmungPaketinhalt;
daemmungRegularPrice = daemmungM2Regular × daemmungPricePerM2;
// Zeigt maximalen Vergleichspreis (höchste Ersparnis)
```

### 10.3 Edge Cases

**Fall 1: Exakte Teilung**
```
21.36 m² ÷ 2.67 m²/Paket = 8.00 (exakt)
→ Math.ceil(8.00) = 8
→ Math.floor(8.00) = 8
→ Kein Unterschied
```

**Fall 2: Kleine Reste**
```
20.5 m² ÷ 2.67 m²/Paket = 7.678 (Rest: 0.68 m²)
→ Math.ceil(7.678) = 8 Pakete (21.36 m²)
→ Math.floor(7.678) = 7 Pakete (18.69 m²)
→ Unterschied: 1 Paket = 2.67 m²
```

**Fall 3: Große Reste**
```
25.0 m² ÷ 2.67 m²/Paket = 9.363 (Rest: 0.97 m²)
→ Math.ceil(9.363) = 10 Pakete (26.7 m²)
→ Math.floor(9.363) = 9 Pakete (24.03 m²)
→ Unterschied: 1 Paket = 2.67 m²
```

### 10.4 Auswirkung auf Preis

**Kostenlose Dämmung (Standard):**
```
Math.floor: 7 Pakete → 0 € (weniger Material, aber kostenlos)
Math.ceil:  8 Pakete → 0 € (mehr Material, aber kostenlos)
→ Für Kunden: floor() ist besser (weniger Abfall)
```

**Premium-Dämmung (+5 €/m²):**
```
Math.floor: 7 Pakete = 18.69 m² × 5 € = 93.45 €
Math.ceil:  8 Pakete = 21.36 m² × 5 € = 106.80 €
→ Für Shop: ceil() ist fairer (korrekte Abrechnung)
→ Für Kunde: floor() ist günstiger, aber zu wenig Material
```

**Kompromiss:** Premium verwendet `ceil()` um genug Material und faire Preise zu garantieren.

---

## 11. Implementierungs-Checkliste

### Backend-Anforderungen

- [ ] **Custom Jäger Plugin** konfiguriert
- [ ] **41 Custom Fields** alle befüllt
- [ ] `setangebot_einzelpreis` vorhanden (Vergleichspreis)
- [ ] `setangebot_gesamtpreis` vorhanden (Set-Preis)
- [ ] `verrechnung` für Premium-Produkte gesetzt
- [ ] `daemmung_id`, `sockelleisten_id` verlinkt
- [ ] `daemmung_option_ids`, `sockelleisten_option_ids` gefüllt
- [ ] Alle Preise in € (nicht Cent)
- [ ] API Endpoint `/wp-json/jaeger/v1/products` funktioniert

### Frontend-Anforderungen

- [ ] Next.js 15.5.3 mit App Router
- [ ] TypeScript strict mode
- [ ] Tailwind CSS v4 konfiguriert
- [ ] `src/lib/setCalculations.ts` implementiert
- [ ] `ProductPageContent.tsx` orchestriert Berechnungen
- [ ] `SetAngebot.tsx` zeigt Bundle korrekt
- [ ] `TotalPrice.tsx` handled Add-to-Cart
- [ ] `CartContext` speichert SetBundles korrekt
- [ ] localStorage persistence funktioniert

### Testing

- [ ] Standard-Set (alles kostenlos) funktioniert
- [ ] Premium-Dämmung-Upgrade (+Aufpreis) funktioniert
- [ ] Premium-Sockelleiste-Upgrade (+Aufpreis) funktioniert
- [ ] Günstigere Alternativen (kostenlos, keine Rückerstattung)
- [ ] Rundungslogik korrekt (floor vs ceil)
- [ ] Verschnitt wird einberechnet (5%)
- [ ] Modal öffnet/schließt korrekt
- [ ] Produkt-Auswahl updated Preise sofort
- [ ] Add-to-Cart erstellt korrektes SetBundle
- [ ] Warenkorb zeigt Bundle richtig an
- [ ] Mobile Responsive Design funktioniert

### Performance

- [ ] `useMemo` für teure Berechnungen
- [ ] Server-Side Rendering für Produktseiten
- [ ] Batch-Loading von Related Products
- [ ] Images optimiert (Next.js Image component)
- [ ] API-Calls minimiert (keine redundanten Requests)

---

## 12. Häufige Probleme & Lösungen

### Problem 1: Vergleichspreis = Set-Preis

**Symptom:** Durchgestrichener Preis ist gleich wie Set-Preis

**Ursache:**
- Backend-Feld `setangebot_einzelpreis` fehlt oder ist null
- Fallback verwendet `product.price` (ist gleich wie Set-Preis)

**Lösung:**
```typescript
// ProductInfo.tsx
const regularPrice = product.setangebot_einzelpreis
  || product.uvp
  || (paketpreis / paketinhalt);

// ProductPageContent.tsx
const bodenComparisonPricePerM2 = product.setangebot_einzelpreis
  || product.uvp
  || product.price;
```

### Problem 2: Dämmung wird nicht kostenlos

**Symptom:** Dämmung zeigt Preis statt 0,00 €

**Ursache:**
- `verrechnung` nicht 0
- `isFree` Flag falsch berechnet

**Lösung:**
```typescript
const verrechnung = product.verrechnung
  ?? Math.max(0, productPrice - standardPrice);

const isFree = verrechnung === 0;
```

### Problem 3: Falsche Paketanzahl

**Symptom:** Zu wenig oder zu viel Pakete

**Ursache:**
- Falsche Rundung (ceil vs floor)
- Verschnitt nicht berücksichtigt

**Lösung:**
```typescript
// Boden: IMMER aufrunden + Verschnitt
const m2WithVerschnitt = wantedM2 * (1 + verschnitt);
const packages = Math.ceil(m2WithVerschnitt / paketinhalt);

// Dämmung: Abhängig von isFree
const packages = isFree
  ? Math.floor(targetM2 / paketinhalt)
  : Math.ceil(targetM2 / paketinhalt);
```

### Problem 4: Ersparnis negativ

**Symptom:** Ersparnis zeigt negative Werte oder 0%

**Ursache:**
- Vergleichspreis niedriger als Set-Preis
- Backend-Felder vertauscht

**Lösung:**
```typescript
const savings = comparisonPriceTotal - totalDisplayPrice;

// Nur positive Ersparnis zeigen
if (savings > 0) {
  savingsPercent = (savings / comparisonPriceTotal) * 100;
} else {
  // Keine Ersparnis anzeigen
  savingsPercent = 0;
}
```

### Problem 5: Modal öffnet nicht

**Symptom:** "Andere wählen" Button ohne Reaktion

**Ursache:**
- State nicht initialisiert
- Options-Array leer

**Lösung:**
```typescript
// Check if options exist
const hasDaemmungOptions = daemmungOptions && daemmungOptions.length > 0;

// Only show button if options available
{hasDaemmungOptions && (
  <button onClick={() => openModal('daemmung')}>
    Andere Dämmung wählen
  </button>
)}
```

---

## 13. Zukünftige Erweiterungen

### Mögliche Features

1. **Variable Verschnitt-Faktoren**
   - Aktuell: Fest 5%
   - Zukünftig: Abhängig von Verlegemuster, Raumform

2. **Dynamische Sockelleiste-Berechnung**
   - Aktuell: m² × 1.0
   - Zukünftig: Raumplaner mit exakten Maßen

3. **Multi-Raum-Sets**
   - Mehrere Räume gleichzeitig planen
   - Gesamt-Bundle über alle Räume

4. **Live-Preis-Updates vom Backend**
   - WebSocket-Verbindung
   - Echtzeit-Preisänderungen

5. **3D-Visualisierung**
   - Boden im Raum visualisieren
   - AR-Integration (Smartphone)

6. **Persönliche Empfehlungen**
   - KI-basierte Produktvorschläge
   - Basierend auf Raumtyp, Budget, Stil

7. **Bundle-Templates**
   - Vorgefertigte Sets ("Wohnzimmer-Paket")
   - Schnelle Auswahl für typische Anwendungen

---

## 14. Zusammenfassung

Das **SetAngebot-System** ist ein ausgeklügeltes Bundle-Preissystem, das:

✅ **Kundenfreundlich** ist durch:
- Automatische Rabatte
- Kostenlose Standard-Zusatzprodukte
- Klare Preisvergleiche

✅ **Technisch robust** ist durch:
- Klare Trennung: Frontend (Mengen) ↔ Backend (Preise)
- Type-safe TypeScript
- Fallback-Logik für fehlende Felder

✅ **Performance-optimiert** ist durch:
- Server-Side Rendering
- useMemo für teure Berechnungen
- Batch-Loading von Produkten

✅ **Design-konsistent** ist durch:
- Tailwind CSS v4
- CSS Custom Properties
- Responsive Mobile/Desktop

**Kernprinzip:**
> Backend berechnet Preise, Frontend berechnet Mengen.
> Rundungslogik abhängig vom Produkt-Typ (Standard/Premium).
> Ersparnis wird transparent kommuniziert.

---

**Ende der Dokumentation**
