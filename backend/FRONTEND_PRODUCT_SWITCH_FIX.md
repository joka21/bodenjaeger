# Frontend Produkt-Wechsel Fix

## Problem
Nach dem Produktwechsel im Modal wird im Frontend das alte Produkt angezeigt, obwohl die Meldung "Produkt wurde gewechselt" erscheint.

## Ursache
Die Produkt-Daten (Bild, Name, Preis) werden nicht von der API nachgeladen und im Frontend aktualisiert.

---

## Lösung: API-Call nach Produktwechsel

### 1. Nach erfolgreichem Produktwechsel → API aufrufen

```typescript
// In deiner Set-Angebot Component (z.B. SetAngebotCalculator.tsx)

async function handleProductChange(
  category: 'daemmung' | 'sockelleisten',
  newProductId: number
) {
  try {
    // 1. Produktwechsel an Backend senden (macht ihr bereits)
    const response = await fetch('/api/change-product', {
      method: 'POST',
      body: JSON.stringify({ category, productId: newProductId })
    });

    if (response.ok) {
      // 2. NEU: Produktdaten von WordPress API laden
      const productData = await fetch(
        `https://plan-dein-ding.de/wp-json/jaeger/v1/products/${newProductId}`
      );

      const product = await productData.json();

      // 3. State aktualisieren mit neuen Produktdaten
      if (category === 'daemmung') {
        setDaemmungProduct(product);
      } else {
        setSockelleistenProduct(product);
      }

      // 4. Preise neu berechnen
      recalculateTotals();

      // 5. Success Message
      toast.success('Produkt wurde gewechselt');
    }
  } catch (error) {
    console.error('Produktwechsel fehlgeschlagen:', error);
    toast.error('Fehler beim Produktwechsel');
  }
}
```

---

## Vollständiges Beispiel: React Component

```typescript
// components/set-angebot/SetAngebotCalculator.tsx

'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  images: Array<{ src: string; alt: string }>;
  jaeger_fields: {
    paketpreis: number;
    paketpreis_s: number;
    paketinhalt: number;
    einheit_short: string;
  };
}

interface SetAngebotCalculatorProps {
  mainProductId: number;
  initialDaemmung: Product;
  initialSockelleisten: Product;
}

export default function SetAngebotCalculator({
  mainProductId,
  initialDaemmung,
  initialSockelleisten
}: SetAngebotCalculatorProps) {

  // State für ausgewählte Produkte
  const [daemmung, setDaemmung] = useState<Product>(initialDaemmung);
  const [sockelleisten, setSockelleisten] = useState<Product>(initialSockelleisten);
  const [isLoading, setIsLoading] = useState(false);

  // Produktwechsel Handler
  async function changeProduct(
    category: 'daemmung' | 'sockelleisten',
    newProductId: number
  ) {
    setIsLoading(true);

    try {
      // 1. Produktdaten von WordPress API laden
      const response = await fetch(
        `https://plan-dein-ding.de/wp-json/jaeger/v1/products/${newProductId}`
      );

      if (!response.ok) {
        throw new Error('Produkt konnte nicht geladen werden');
      }

      const product: Product = await response.json();

      // 2. State aktualisieren → triggert Re-Render
      if (category === 'daemmung') {
        setDaemmung(product);
      } else {
        setSockelleisten(product);
      }

      // 3. Success Message
      toast.success(`${product.name} wurde ausgewählt`);

    } catch (error) {
      console.error('Produktwechsel fehlgeschlagen:', error);
      toast.error('Fehler beim Produktwechsel');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="set-angebot-calculator">

      {/* Dämmung Anzeige */}
      <div className="product-card">
        <h3>Dämmung</h3>

        {/* Produktbild - wird automatisch aktualisiert wenn State sich ändert */}
        <img
          src={daemmung.images[0]?.src}
          alt={daemmung.images[0]?.alt}
          className="product-image"
        />

        {/* Produktname */}
        <p className="product-name">{daemmung.name}</p>

        {/* Preis */}
        <p className="product-price">
          {daemmung.jaeger_fields.paketpreis_s || daemmung.jaeger_fields.paketpreis}€
        </p>

        {/* Produkt ändern Button */}
        <button
          onClick={() => openProductModal('daemmung')}
          disabled={isLoading}
        >
          Produkt ändern
        </button>
      </div>

      {/* Sockelleisten Anzeige */}
      <div className="product-card">
        <h3>Sockelleisten</h3>

        <img
          src={sockelleisten.images[0]?.src}
          alt={sockelleisten.images[0]?.alt}
          className="product-image"
        />

        <p className="product-name">{sockelleisten.name}</p>

        <p className="product-price">
          {sockelleisten.jaeger_fields.paketpreis_s || sockelleisten.jaeger_fields.paketpreis}€
        </p>

        <button
          onClick={() => openProductModal('sockelleisten')}
          disabled={isLoading}
        >
          Produkt ändern
        </button>
      </div>

      {/* Modal für Produktauswahl */}
      <ProductSelectionModal
        isOpen={modalOpen}
        category={modalCategory}
        onSelectProduct={changeProduct}  {/* ← Diese Funktion aufrufen */}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
```

---

## Checkliste für die Fehlerbehebung

### ✅ Backend (WordPress)
- [ ] API-Endpunkt funktioniert: `GET /wp-json/jaeger/v1/products/{id}`
- [ ] Response enthält alle Felder (Bilder, Name, Preise)
- [ ] CORS ist aktiviert (falls Next.js auf anderer Domain)

### ✅ Frontend (Next.js)
- [ ] Nach Produktwechsel wird API aufgerufen
- [ ] Response wird im State gespeichert
- [ ] State-Änderung triggert Re-Render
- [ ] Produktbild zeigt `daemmung.images[0].src` (nicht gecached)
- [ ] Produktname zeigt `daemmung.name` (nicht gecached)
- [ ] Preis wird neu berechnet

---

## Debugging

### 1. Browser Console öffnen

```javascript
// Nach Produktwechsel im Modal

// Prüfe ob API aufgerufen wird
console.log('Calling API for product:', newProductId);

// Prüfe Response
console.log('Product data received:', product);

// Prüfe State
console.log('Current daemmung state:', daemmung);
```

### 2. Network Tab prüfen

- Öffne DevTools → Network Tab
- Klicke "Produkt ändern"
- Prüfe ob Request zu `/wp-json/jaeger/v1/products/{id}` erscheint
- Prüfe Response-Daten

### 3. React DevTools

- Installiere React DevTools Extension
- Prüfe ob Component State sich ändert
- Prüfe ob Props aktualisiert werden

---

## Häufige Fehler

### ❌ Fehler 1: Kein API-Call nach Produktwechsel

```typescript
// FALSCH - nur Message zeigen
function handleProductChange(newId: number) {
  toast.success('Produkt gewechselt'); // ← Aber Daten nicht geladen!
}

// RICHTIG - Daten laden und State aktualisieren
async function handleProductChange(newId: number) {
  const product = await fetchProduct(newId); // ← API-Call
  setDaemmung(product); // ← State aktualisieren
  toast.success('Produkt gewechselt');
}
```

### ❌ Fehler 2: Daten gecacht statt live

```typescript
// FALSCH - Daten aus initialProps (veraltet)
<img src={initialDaemmung.images[0].src} />

// RICHTIG - Daten aus State (aktuell)
<img src={daemmung.images[0].src} />
```

### ❌ Fehler 3: State nicht aktualisiert

```typescript
// FALSCH - Lokale Variable (kein Re-Render)
let currentDaemmung = initialDaemmung;

// RICHTIG - React State (triggert Re-Render)
const [daemmung, setDaemmung] = useState(initialDaemmung);
```

---

## Next.js Caching Problem

Falls Next.js die Produktdaten cached:

```typescript
// App Router: Cache deaktivieren für Produktdaten
export const revalidate = 0; // Keine Caching

// Oder: ISR mit kurzer Revalidierung
export const revalidate = 60; // 60 Sekunden

// Oder: Force Dynamic
export const dynamic = 'force-dynamic';
```

---

## Zusammenfassung

**Problem:** Frontend zeigt alte Produktdaten nach Wechsel

**Lösung:**
1. ✅ Nach Produktwechsel → API aufrufen
2. ✅ Produktdaten laden (`/wp-json/jaeger/v1/products/{id}`)
3. ✅ State aktualisieren (z.B. `setDaemmung(product)`)
4. ✅ React rendert automatisch neu mit neuen Daten

**Wichtig:**
- Immer aus State rendern, nicht aus initialProps
- Nach jedem Produktwechsel API aufrufen
- State-Änderung triggert automatisch Re-Render
