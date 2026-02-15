# Prompt: Produkt-Cards für Bodenübersichtsseiten

## Kontext & Projektumgebung

Du entwickelst Product Cards für einen Next.js 15.5.3 E-Commerce Shop (Bodenjäger) mit WooCommerce Backend. Die Cards werden auf Kategorieseiten und in Sliders auf der Homepage verwendet.

**Tech Stack:**
- Next.js 15.5.3 (App Router, React 19, TypeScript)
- Tailwind CSS v4 (keine tailwind.config.js - alles in CSS)
- WooCommerce Custom API mit 41 Root-Level Custom Fields
- Client Components (`'use client'`)

## Zielsetzung

Entwickle eine `ProductCard.tsx` Komponente für die Grid-Darstellung von Bodenprodukten in Kategorie-Übersichtsseiten. Die Card muss das komplexe Set-Angebot System visualisieren und alle relevanten Produktinformationen übersichtlich darstellen.

## Technische Anforderungen

### TypeScript Interface

```typescript
import { StoreApiProduct } from '@/lib/woocommerce';

interface ProductCardProps {
  product: StoreApiProduct;
  showDescription?: boolean; // Zeige Beschreibungspunkte (nur für Boden-Kategorien)
}
```

### Backend Integration (KRITISCH)

**WICHTIG:** Alle Daten kommen aus dem Backend als ROOT-LEVEL Fields (nicht nested!):

```typescript
// ✅ KORREKT - Root-Level Zugriff
product.price
product.regular_price
product.einheit_short
product.setangebot_ersparnis_prozent

// ❌ FALSCH - Kein nested access
product.jaeger_meta?.price
```

### Verfügbare Custom Fields (Root-Level)

**Basis-Produktdaten:**
- `name: string` - Produktname
- `slug: string` - URL-Slug für Link
- `images: Array<{src: string, alt: string}>` - Produktbilder
- `price: number` - Aktueller Preis (Sale-Preis bei Aktion)
- `regular_price: number` - Regulärer Preis (UVP)
- `on_sale: boolean` - Produkt im Sale
- `einheit_short: string` - Preiseinheit (z.B. "m²", "lfm", "Pkg")

**Set-Angebot System:**
- `show_setangebot: boolean` - Set-Angebot anzeigen
- `setangebot_titel: string` - Set-Angebot Überschrift
- `setangebot_ersparnis_prozent: number` - Rabatt in Prozent (vom Backend berechnet)
- `daemmung_id: number | null` - ID der Standard-Dämmung
- `sockelleisten_id: number | null` - ID der Standard-Sockelleiste

**Badges & Aktionen:**
- `show_aktion: boolean` - Aktion-Badge anzeigen
- `aktion: string` - Aktion-Text (z.B. "Restposten", "Neu")
- `show_angebotspreis_hinweis: boolean` - Angebotspreis-Hinweis anzeigen
- `angebotspreis_hinweis: string` - Hinweis-Text für Angebotspreis

**Zusätzliche Informationen:**
- `show_text_produktuebersicht: boolean` - Übersichtstext anzeigen
- `text_produktuebersicht: string` - Text für Produktübersicht
- `show_lieferzeit: boolean` - Lieferzeit anzeigen
- `lieferzeit: string` - Lieferzeit-Text (z.B. "Sofort lieferbar", "2-3 Werktage")
- `short_description: string` - Kurzbeschreibung (HTML)
- `description: string` - Vollständige Beschreibung (HTML)

## Layout-Struktur

Die Card ist in zwei Hauptbereiche unterteilt:

```
┌─────────────────────────────────┐
│   IMAGE SECTION (aspect-[4/3])  │
│   ┌─────────────────────────┐   │
│   │  Sale Badge (-X%)       │   │ ← Top Left
│   │                         │   │
│   │      Main Image         │   │
│   │    (mit Slider)         │   │
│   │                         │   │
│   │  [Aktion Badge]         │   │ ← Top Right
│   │                         │   │
│   │  ← Prev    Indicators   │   │
│   │            Next →       │   │
│   │                         │   │
│   │ [💖] [📐] [🎨]          │   │ ← Bottom Buttons
│   └─────────────────────────┘   │
│   [testen 1]    [testen 2]      │ ← Border Buttons (-5px overlap)
├─────────────────────────────────┤
│         CONTENT SECTION         │
│   Produktname (h3)              │
│   [Beschreibungspunkte]         │ ← Nur wenn showDescription=true
│   ─────────────────────────     │ ← Border-Top Trenner
│   Set-Angebot Sektion           │
│   │  Set-Angebot Titel          │
│   │  Inkl. Text                 │
│   │  [UVP durchgestrichen]      │
│   │  HAUPTPREIS (rot/fett)      │
│   │  [Angebotspreis-Hinweis]    │
│   ─────────────────────────     │
│   [Produktübersichtstext]       │
│   🚚 Lieferzeit                  │
└─────────────────────────────────┘
```

## Design-Spezifikationen

### Image Section

**Container:**
- Background: `bg-gray-100`
- Aspect Ratio: `aspect-[4/3]`
- Position: `relative` für absolute Child-Elemente

**Main Image:**
- Component: Next.js `<Image>` mit `fill` prop
- Object Fit: `object-cover`
- Sizes: `"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
- Loading: `lazy` (nicht priority)
- Quality: 80
- Placeholder: `blur` mit blurDataURL

**Sale Badge (Top Left):**
- Position: `absolute top-3 left-3`
- Style: `bg-red-600 text-white px-2 py-1 rounded text-sm font-bold`
- Content: `-${Math.round(discount)}%` (gerundet, kein Dezimalstellen)
- Conditional: Nur wenn `product.on_sale === true`
- Datenquelle: `product.setangebot_ersparnis_prozent`

**Aktion Badge (Top Right):**
- Position: `absolute top-3 right-3`
- Style: `bg-gray-900 text-white px-3 py-1 rounded text-sm font-medium`
- Content: `{product.aktion}`
- Conditional: Nur wenn `product.show_aktion && product.aktion`

**Image Slider Navigation:**

Nur anzeigen wenn `images.length > 1`:

*Previous Button:*
- Position: `absolute left-2 top-1/2 -translate-y-1/2`
- Style: `w-8 h-8 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full`
- Icon: Chevron Left SVG
- onClick: `setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)`

*Next Button:*
- Position: `absolute right-2 top-1/2 -translate-y-1/2`
- Style: Wie Previous, aber rechts
- Icon: Chevron Right SVG
- onClick: `setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)`

*Image Indicators (Dots):*
- Position: `absolute bottom-2 left-1/2 -translate-x-1/2`
- Container: `flex space-x-1`
- Dots: `w-2 h-2 rounded-full transition-colors`
  - Active: `bg-white`
  - Inactive: `bg-white bg-opacity-50`
- onClick: `setCurrentImageIndex(index)`

**Action Buttons (Bottom of Image):**
- Position: `absolute bottom-3 left-3 right-3`
- Container: `flex justify-center space-x-2`
- Buttons: `bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-3 py-1 rounded text-xs font-medium`

3 Buttons:
1. "💖 Merkliste"
2. "📐 Bodenplaner"
3. "🎨 Muster"

**Test Buttons (On Border):**
- Position: `absolute -bottom-[5px] left-0 right-0`
- Container: `flex justify-between px-4 z-10`
- Style:
  - `backgroundColor: 'var(--color-bg-darkest)'` (CSS Variable)
  - `height: '10px'`
  - `padding: '2%'`
  - `text-white text-xs font-medium`
- Buttons:
  - "testen 1" (links)
  - "testen 2" (rechts)

### Content Section

**Container:**
- Padding: `p-4`
- Background: `bg-white` (von Parent Card)

**Produktname:**
- Element: `<Link href={/products/${product.slug}}>`
- Style: `text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-3`
- Max Lines: 2 (mit Ellipsis)

**Beschreibungspunkte (Conditional):**

Nur wenn `showDescription === true` UND Punkte vorhanden:

```typescript
// Parse HTML description into bullet points
const getDescriptionPoints = () => {
  if (!showDescription) return [];

  const description = product.short_description || product.description || '';
  if (!description) return [];

  // Remove HTML tags
  const cleanText = description
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n')
    .replace(/<\/li>/gi, '')
    .replace(/<ul[^>]*>|<\/ul>/gi, '')
    .replace(/<ol[^>]*>|<\/ol>/gi, '')
    .replace(/<p[^>]*>|<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

  // Split und filtern
  const points = cleanText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && line.length < 200);

  return points.slice(0, 6); // Max 6 Punkte
};
```

Display:
- Container: `mb-4`
- List: `<ul className="space-y-1">`
- Item: `flex items-start text-sm text-gray-600`
- Checkmark Icon: `/images/Icons/Haken schieferschwarz.png` (16x16px, mr-2)

**Set-Angebot Section (Conditional):**

Nur wenn `product.show_setangebot === true`:

Container: `border-t pt-4`

*Titel & Inkl. Text:*
```tsx
<h4 className="text-sm font-semibold text-gray-900 mb-1">
  {product.setangebot_titel || 'Set-Angebot'}
</h4>
<p className="text-xs text-gray-600">
  {/* Dynamisch basierend auf vorhandenen Komponenten */}
  {product.daemmung_id && product.sockelleisten_id
    ? 'Inkl. Sockelleiste und Dämmung'
    : product.sockelleisten_id
    ? 'Inkl. Sockelleiste'
    : product.daemmung_id
    ? 'Inkl. Dämmung'
    : 'Set-Angebot'}
</p>
```

*Preisanzeige:*
- Container: `space-y-1`

1. **Strike Price (UVP):**
   - Conditional: Nur wenn `getStrikePrice() !== null`
   - Style: `text-sm text-gray-500 line-through`
   - Format: `XX,XX €/m²` (Komma als Dezimaltrennzeichen)
   - Logic:
     ```typescript
     const getStrikePrice = () => {
       if (!product.on_sale || regularPrice <= price) return null;
       return `${regularPrice.toFixed(2).replace('.', ',')} €/${einheitShort}`;
     };
     ```

2. **Hauptpreis:**
   - Style: `text-xl font-bold text-red-600` (rot wenn Sale, sonst gray-900)
   - Format: `XX,XX €/m²`
   - Logic:
     ```typescript
     const getMainPrice = () => {
       return `${price.toFixed(2).replace('.', ',')} €/${einheitShort}`;
     };
     ```

3. **Angebotspreis-Hinweis:**
   - Conditional: `product.show_angebotspreis_hinweis && product.angebotspreis_hinweis`
   - Style: `text-xs text-gray-500`
   - Content: `{product.angebotspreis_hinweis}`

**Regular Pricing (wenn KEIN Set-Angebot):**

Wenn `!product.show_setangebot`:
- Gleiche Preisanzeige wie Set-Angebot
- ABER: Hauptpreis ist `text-gray-900` (nicht rot)
- Keine "Inkl."-Text

**Produktübersichtstext (Conditional):**
- Conditional: `product.show_text_produktuebersicht && product.text_produktuebersicht`
- Style: `mt-3 text-sm text-gray-600`
- Content: `{product.text_produktuebersicht}`

**Lieferzeit (Conditional):**
- Conditional: `product.show_lieferzeit && product.lieferzeit`
- Style: `mt-2 text-xs text-green-600`
- Content: `🚚 {product.lieferzeit}`

## State Management

```typescript
const [currentImageIndex, setCurrentImageIndex] = useState(0);

const images = product.images || [];
const hasMultipleImages = images.length > 1;

const price = product.price || 0;
const regularPrice = product.regular_price || 0;
const einheitShort = product.einheit_short || 'm²';
const discount = product.setangebot_ersparnis_prozent;
```

## CSS Custom Properties

**Verwende diese Farben aus globals.css:**

```css
/* Bereits definierte Variablen */
--color-primary: #ed1b24;        /* Bodenjäger Red */
--color-bg-darkest: #2e2d32;     /* Dark Gray für Test Buttons */
--color-text-primary: #2e2d32;   /* Text Dark */
```

## Responsive Behavior

**Breakpoints:**
- Mobile: Default Styling (Stack)
- Tablet (md:): Grid 2 Spalten
- Desktop (lg:): Grid 3 Spalten
- Large (xl:): Grid 4 Spalten

**Image:**
- Alle Viewports: aspect-[4/3] bleibt gleich

**Text:**
- Produktname: Immer 2 Zeilen max mit line-clamp-2
- Beschreibungspunkte: Max 6, automatisches Umbruch

**Buttons:**
- Action Buttons: Immer horizontal, Text kann auf Mobile kleiner werden
- Test Buttons: Immer 2 Buttons nebeneinander

## Edge Cases & Error Handling

**Fehlende Bilder:**
```tsx
{images.length > 0 ? (
  <Image src={images[currentImageIndex]?.src} ... />
) : (
  <div className="w-full h-full flex items-center justify-center bg-gray-200">
    <span className="text-gray-400">Kein Bild</span>
  </div>
)}
```

**Fehlende Custom Fields:**
- Immer Fallback-Werte verwenden: `product.field || defaultValue`
- Conditional Rendering mit `&&` für optionale Elemente

**Sehr lange Produktnamen:**
- `line-clamp-2` verhindert Overflow
- `mb-3` sorgt für Abstand

**Sehr viele Bilder:**
- Slider unterstützt beliebig viele Bilder
- Indicators werden automatisch generiert

**Fehlende Set-Angebot Daten:**
- Fallback auf "Set-Angebot" als Titel
- Fallback auf "Set-Angebot" als Inkl.-Text

## Performance-Optimierungen

**Image Loading:**
- `loading="lazy"` für alle Bilder
- `priority={false}` (nur Hero-Bilder sollten priority haben)
- `quality={80}` (Balance zwischen Qualität und Größe)
- Placeholder Blur für bessere UX

**Component:**
- Client Component wegen Image Slider State
- Keine unnötigen Re-Renders (State nur für currentImageIndex)

**Hover States:**
- Alle interaktiven Elemente haben `transition-*` Klassen
- Shadow-Effekte auf Card: `shadow-md hover:shadow-lg transition-shadow duration-300`

## Verwendung der Komponente

**In Category Page:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
      showDescription={true} // Für Boden-Kategorien
    />
  ))}
</div>
```

**In Slider (vereinfacht):**
```tsx
{products.map((product) => (
  <ProductCard
    key={product.id}
    product={product}
    showDescription={false} // Keine Beschreibung in Sliders
  />
))}
```

## Testing-Checkliste

**Funktional:**
- [ ] Image Slider funktioniert (Prev/Next/Indicators)
- [ ] Sale Badge zeigt korrekten Prozentsatz (gerundet)
- [ ] Aktion Badge erscheint nur wenn vorhanden
- [ ] Set-Angebot wird korrekt angezeigt
- [ ] "Inkl."-Text passt sich an Komponenten an
- [ ] UVP-Durchstreichung nur bei echtem Sale
- [ ] Preis in roter Farbe nur bei Set-Angebot
- [ ] Lieferzeit erscheint nur wenn vorhanden
- [ ] Link zu Produktdetailseite funktioniert

**Design:**
- [ ] aspect-[4/3] für alle Bilder
- [ ] Test Buttons überlappen Border um 5px
- [ ] Alle Abstände/Paddings korrekt
- [ ] Hover-States funktionieren
- [ ] Text-Truncation bei langen Namen
- [ ] Responsive Layout auf allen Breakpoints

**Edge Cases:**
- [ ] Kein Bild vorhanden (Placeholder)
- [ ] Nur 1 Bild (keine Slider-Navigation)
- [ ] Kein Set-Angebot (Regular Pricing)
- [ ] Fehlende Custom Fields (Fallbacks)
- [ ] Sehr lange Produktnamen
- [ ] Sehr viele Beschreibungspunkte (max 6)

**Performance:**
- [ ] Lazy Loading für Bilder aktiv
- [ ] Keine unnötigen Re-Renders
- [ ] Blur Placeholder erscheint

## Kritische Don'ts

❌ **NIEMALS** Preise im Frontend berechnen - nur Backend-Werte anzeigen
❌ **NIEMALS** nested access auf Custom Fields (z.B. `product.meta.field`)
❌ **NIEMALS** inline Math.floor/ceil für Preise (immer .toFixed(2))
❌ **NIEMALS** harte Farben (#ed1b24) - CSS Variables verwenden
❌ **NIEMALS** priority={true} für Card-Bilder (Performance)
❌ **NIEMALS** englische Texte (alle Texte deutsch)

## Zusammenfassung

Diese Card ist das zentrale Element der Produktübersicht. Sie muss:
1. **Visuell ansprechend** sein (Bilder, Badges, Spacing)
2. **Informativ** sein (Set-Angebot, Preis, Lieferzeit)
3. **Interaktiv** sein (Slider, Hover, Links)
4. **Performance** optimiert sein (Lazy Loading, keine unnötigen Renders)
5. **Responsive** sein (4 Breakpoints)
6. **Type-Safe** sein (TypeScript strict mode)
7. **Backend-getrieben** sein (keine Frontend-Preisberechnungen)

Die Card ist der erste Touchpoint des Kunden mit dem Produkt - sie muss Vertrauen schaffen und zum Klick animieren!
