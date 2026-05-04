# Claude Code Prompt: GTM-Tracking-Implementierung Bodenjäger

## Aufgabe (Übersicht)

Implementiere das vollständige Conversion-Tracking für `bodenjaeger.de` (Next.js 15.5.9, App Router, Headless WooCommerce). Der Google-Tag-Manager-Container `GTM-MW5G8DXD` ist bereits eingebunden, aber das Frontend pusht **keinerlei** `dataLayer`-Events. Diese Lücke muss geschlossen werden.

Die vollständige Spezifikation liegt in der Datei **`GTM_REFERENZ.md`** (Single Source of Truth — direkt aus dem GTM-Container ausgelesen). Diese Datei MUSST du als Erstes vollständig lesen, bevor du irgendetwas anderes anfasst. Sie enthält alle IDs, Schemas, Trigger-Bedingungen und Mapping-Regeln, die du brauchst.

## Arbeitsweise — bitte exakt einhalten

- **Sehr genaues Arbeiten, aber strikt nach Anweisung.** Keine ungefragte Eigeninitiative über den Auftrag hinaus.
- **Phasenweise vorgehen.** Pro Phase: Bestand prüfen → Implementieren → kompilieren lassen → kurz zusammenfassen, was gemacht wurde → ZUR NÄCHSTEN PHASE.
- **Stop-Bedingungen ernst nehmen.** Wenn etwas vom Erwarteten abweicht (Datei nicht da, andere API als beschrieben, vorhandene Implementierung unklar), STOPPE und stelle Rückfragen, statt zu raten.
- **TypeScript strict mode.** Keine `any`-Casts ohne Begründung. Eigene Typen für Event-Payloads.
- **Keine neuen Dependencies.** `next/script`, `next/navigation` und React-Hooks reichen. Falls du etwas brauchst, was nicht da ist, frag nach — nicht installieren.
- **Pro Event-Push am Ende ein kompakter Console-Test-Hinweis** (z.B. „Test im Browser: `dataLayer.filter(e => e.event === 'view_item')` muss nach Produktseiten-Aufruf einen Eintrag liefern").

---

## Phase 0 — Bestandsanalyse (Pflicht, NICHT überspringen)

Bevor du eine einzige Datei schreibst:

1. **Lies `GTM_REFERENZ.md` vollständig.** Diese Datei ist autoritativ. Bei Konflikt zwischen diesem Prompt und der Referenz: Referenz gewinnt.
2. **Lies `PROJEKT_ZUSAMMENFASSUNG.md`** für den Gesamtkontext (Set-Angebot-System, Provider-Hierarchy, Datenfluss).
3. **Lies die folgenden bestehenden Dateien** und mache dir Notizen zu deren API:
   - `src/components/GoogleTagManager.tsx` (existiert seit 27.04.2026 — wird in Phase 2 umgebaut)
   - `src/contexts/CookieConsentContext.tsx` (Hook-Name, Rückgabe-Werte, Kategorie-Feldnamen)
   - `src/components/CookieConsent.tsx` (wann wird Consent gesetzt?)
   - `src/contexts/CartContext.tsx` (CartItem-Struktur, setId-Logik, addSetToCart)
   - `src/lib/woocommerce.ts` (StoreApiProduct-Typ — vor allem die 41 Custom Fields)
   - `src/components/cart/CartDrawer.tsx` (CartSetItem vs CartSingleItem, Discriminated Union)
   - `src/app/checkout/success/page.tsx` (wie kommen Order-Daten dort an?)
   - `src/app/api/checkout/order/[id]/route.ts` (welche Daten liefert die API zurück?)
   - `src/components/Footer.tsx` (Telefonnummer-Stelle finden)
   - `src/components/FachmarktSubpage.tsx` Zeile 142 (Tippfehler `+4924339388840`)
   - `src/components/FachmarktPage.tsx` Zeile 355 (Klartext-Telefonnummer)
4. **Suche per grep** nach Restbeständen, die wir nicht doppelt machen wollen:
   ```bash
   grep -rn "dataLayer\|gtag\|googletagmanager" src/
   ```
5. **Berichte am Ende von Phase 0** in einer kurzen Liste:
   - Wie der Cookie-Consent-Hook aktuell heißt (z.B. `useCookieConsent()`) und welche Felder er zurückgibt
   - Ob `GoogleTagManager.tsx` aktuell als Hard-Gate (kein GTM ohne `analytics`) implementiert ist (laut Referenz: ja)
   - Welche Datenfelder die API `/api/checkout/order/[id]` zurückgibt (Order-Items, Total, Currency, Payment Method)
   - Welche grep-Treffer es zu `dataLayer` gibt (sollte = 0 sein, abgesehen vom GTM-Loader)

**Wenn etwas nicht passt zu dem, was in der Referenz beschrieben ist: STOP, melden, nicht raten.**

---

## Phase 1 — Foundation: Helper-Bibliothek + Page-View-Tracker

### 1.1 Verzeichnisstruktur anlegen

```
src/lib/analytics/
  ├── types.ts        # TypeScript-Typen für GA4-Events
  ├── mapItem.ts      # StoreApiProduct → GA4-Item-Mapping
  └── track.ts        # Public API mit allen track.*-Funktionen
```

### 1.2 `src/lib/analytics/types.ts`

Definiere TypeScript-Typen, die exakt dem GA4-Standard-Schema entsprechen (siehe `GTM_REFERENZ.md` Abschnitt 5.2):

```typescript
export interface GA4Item {
  item_id: string;
  item_name: string;
  price: number;          // pro Einheit, NICHT * quantity
  quantity: number;
  item_category?: string;
  item_brand?: string;
  item_variant?: string;
}

export interface EcommercePayload {
  transaction_id?: string | number;  // nur bei purchase
  value: number;
  currency: 'EUR';
  coupon?: string;
  shipping?: number;
  tax?: number;
  payment_type?: string;
  items: GA4Item[];
}

export type PaymentType = 'stripe' | 'paypal' | 'bacs';

export interface ConsentCategories {
  necessary: true;       // immer true
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}
```

Erweitere die `Window`-Schnittstelle um `dataLayer` (in `types.ts` oder einer existierenden Globals-Datei — Konsistenz mit Projekt-Stil prüfen):

```typescript
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}
```

### 1.3 `src/lib/analytics/mapItem.ts`

Eine Funktion, die ein `StoreApiProduct` in ein GA4-`Item` konvertiert. **Item-Mapping bis zur endgültigen Klärung mit Oskar (offen, siehe Referenz Abschnitt 9.2):**

```typescript
import type { StoreApiProduct } from '@/lib/woocommerce';
import type { GA4Item } from './types';

export function mapProductToItem(
  product: StoreApiProduct,
  quantity: number,
  options?: { variant?: string; pricePerUnitOverride?: number }
): GA4Item {
  return {
    item_id: String(product.id),
    item_name: product.name,
    price: options?.pricePerUnitOverride ?? Number(product.price ?? 0),
    quantity,
    item_category: product.categories?.[0]?.name,  // erste Kategorie
    item_brand: 'Bodenjäger',                      // bis zur Klärung als Konstante
    item_variant: options?.variant,
  };
}
```

### 1.4 `src/lib/analytics/track.ts` (Kern-Helper)

Implementiere alle Tracking-Funktionen. **Wichtige Regeln:**
- Vor jedem Push: `if (typeof window === 'undefined') return;` (SSR-Schutz)
- Vor jedem `ecommerce`-Push: `window.dataLayer.push({ ecommerce: null });` (Reset, sonst mischen sich Daten zwischen Events — GA4-Best-Practice)
- Currency immer `'EUR'`
- Werte als Number (nicht String)
- `transaction_id` als Number (Order-ID), nicht String — siehe Referenz 5.4

```typescript
export const track = {
  pageView(url: string, title: string): void { ... },
  viewItem(product: StoreApiProduct, quantity?: number): void { ... },
  addToCart(items: GA4Item[], totalValue: number): void { ... },
  viewCart(items: GA4Item[], totalValue: number): void { ... },
  removeFromCart(item: GA4Item): void { ... },
  beginCheckout(items: GA4Item[], totalValue: number): void { ... },
  addPaymentInfo(items: GA4Item[], totalValue: number, paymentType: PaymentType): void { ... },
  purchase(args: {
    orderId: number;
    items: GA4Item[];
    value: number;
    currency: 'EUR';
    paymentType: PaymentType;
    shipping?: number;
    tax?: number;
  }): void { ... },
};

export const consent = {
  setDefault(): void { ... },              // gtag('consent', 'default', { ...all denied except security })
  update(c: ConsentCategories): void { ... }, // gtag('consent', 'update', { mapping })
};
```

**Mapping-Tabelle für `consent.update`** (aus Referenz Abschnitt 6.2):

| ConsentCategory | Consent-Mode-Felder |
|----------------|---------------------|
| `necessary`    | `security_storage: 'granted'` (immer) |
| `functional`   | `functionality_storage`, `personalization_storage` |
| `analytics`    | `analytics_storage` |
| `marketing`    | `ad_storage`, `ad_user_data`, `ad_personalization` |

### 1.5 `src/components/PageViewTracker.tsx`

Client-Component, die bei jedem Routenwechsel ein `page_view`-Event pusht (siehe Referenz 7.1):

```typescript
'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { track } from '@/lib/analytics/track';

function PageViewTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');
    track.pageView(window.location.origin + url, document.title);
  }, [pathname, searchParams]);

  return null;
}

export default function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerInner />
    </Suspense>
  );
}
```

In `src/app/layout.tsx` einbinden (innerhalb des Provider-Trees, am besten neben `GoogleTagManager`).

### Phase-1-Akzeptanzkriterium
- `npm run build` läuft ohne Fehler
- TypeScript strict mode bleibt sauber
- `track.*` Funktionen sind implementiert, aber noch nirgendwo aufgerufen (außer `pageView` durch den Tracker)
- Im Browser nach Build/Dev-Start: `window.dataLayer` existiert, `page_view` erscheint bei Routenwechsel

→ **STOP, kurze Zusammenfassung, dann Phase 2.**

---

## Phase 2 — Consent Mode v2 (Refactoring `GoogleTagManager.tsx`)

### 2.1 Aktuelles Verhalten (laut Referenz)
GTM lädt **nur**, wenn `consent.analytics === true` (Hard-Gate). Vor Consent: kein Tracking, nicht mal anonymisiert.

### 2.2 Neues Verhalten

GTM lädt **immer** (sobald die Komponente gemountet ist), aber:
- **Vor dem GTM-Load:** `consent.setDefault()` aufrufen → alles auf `denied` außer `security_storage`. Mit `wait_for_update: 500`.
- **Nach Consent-Aktion durch User (Banner-Klick / Footer-Link):** `consent.update(c)` aufrufen.

### 2.3 Implementierungsdetails

In `src/components/GoogleTagManager.tsx`:

1. **Default-Call SOFORT beim ersten Mount** (in einem `useLayoutEffect`, damit es vor dem GTM-Script-Tag passiert):
   ```typescript
   useLayoutEffect(() => {
     consent.setDefault();
   }, []);
   ```
2. **GTM-Script unbedingt laden** — Hard-Gate-Bedingung entfernen.
3. **Update-Call bei jeder Änderung** des Consent-Objekts:
   ```typescript
   const cookieConsent = useCookieConsent();  // Hook-Name aus Phase 0 verwenden
   useEffect(() => {
     if (cookieConsent.hasResponded) {        // erst pushen, wenn User aktiv entschieden hat
       consent.update(cookieConsent.categories);
     }
   }, [cookieConsent.categories, cookieConsent.hasResponded]);
   ```

   **Hinweis:** Falls der CookieConsentContext kein `hasResponded`-Flag hat: aus dem Banner-Status ableiten oder neues Feld einführen — frag in dem Fall vorher nach.

4. **noscript-Iframe** bleibt wie bisher.

### 2.4 Edge-Cases
- **User hat in einer Vor-Session bereits abgelehnt:** beim nächsten Pageload soll trotzdem `setDefault` (denied) → dann `update` mit gespeicherten Werten kommen. Reihenfolge: Default IMMER, Update danach falls Entscheidung vorliegt.
- **Niemals `update` ohne vorheriges `default` pushen.** Reihenfolge muss garantiert sein.

### Phase-2-Akzeptanzkriterium
- Im Browser-Devtools (Tab: Application → Storage → localStorage): nach Banner-Annahme „Alle" sollten in `window.dataLayer` zwei Consent-Einträge sein (default, update).
- GTM lädt jetzt **immer** (Network-Tab: `gtm.js` wird geladen, auch wenn User „nur notwendige" wählt).

→ **STOP, kurze Zusammenfassung, dann Phase 3.**

---

## Phase 3 — E-Commerce-Events einbinden

Bitte in **dieser Reihenfolge** umsetzen — keine parallelen Änderungen, weil sich Datenflüsse überlappen.

### 3.1 `view_item` — Produktseite
**Datei:** `src/components/product/ProductPageContent.tsx` (oder, falls dort kein Mount-Effekt sinnvoll, in der Server Component `src/app/products/[slug]/page.tsx` über einen Client-Component-Wrapper).

```typescript
useEffect(() => {
  track.viewItem(product, 1);
}, [product.id]);
```

### 3.2 `add_to_cart` — Standard-Produkt (kein Set)
**Datei:** Die Komponente, die den „In den Warenkorb"-Button für ein einzelnes Produkt rendert (vermutlich `src/components/product/ProductInfo.tsx` oder direkt in `ProductPageContent.tsx`).

```typescript
const handleAddToCart = () => {
  // bestehende Logik...
  const item = mapProductToItem(product, quantity);
  track.addToCart([item], item.price * item.quantity);
};
```

### 3.3 `add_to_cart` — Set-Bundle (Boden + Dämmung + Sockelleiste)
**Datei:** `src/components/product/SetAngebot.tsx` UND `src/components/product/SetAngebotMobile.tsx`. Falls Set-Logik zentral in `ProductPageContent.tsx` läuft (siehe Referenz: „Single Source of Truth"), genügt eine Stelle.

**Bestätigt durch Oskar (04.05.2026):** EIN Event mit drei Items im `items[]`-Array.

```typescript
const items: GA4Item[] = [];
items.push(mapProductToItem(boden, bodenQty, { variant: 'Set: Boden', pricePerUnitOverride: bodenSetPrice }));
if (daemmungSelected) {
  items.push(mapProductToItem(daemmung, daemmungQty, { variant: 'Set: Dämmung', pricePerUnitOverride: daemmungSetPrice }));
}
if (sockelleisteSelected) {
  items.push(mapProductToItem(sockel, sockelQty, { variant: 'Set: Sockelleiste', pricePerUnitOverride: sockelSetPrice }));
}
track.addToCart(items, totalSetPrice);
```

**Wichtig:** `pricePerUnitOverride` nutzt die **Set-Preise** (nicht regulärer Einzelpreis), weil GA4 `value` aus `sum(price * quantity)` berechnet. Standard-/Billiger-Artikel haben im Set `price: 0` (siehe Set-Logik in der Projektdoku).

### 3.4 `add_to_cart` — Muster-Bestellung
**Datei:** Da, wo der „Muster bestellen"-Button rendert (vermutlich `ProductInfo.tsx` oder eigene Komponente).

```typescript
const item = mapProductToItem(product, 1, { variant: 'Muster' });
item.price = 0;  // erste 3 Muster kostenlos — bei kostenpflichtigen Mustern: 3 EUR setzen
item.item_category = 'Muster';
track.addToCart([item], item.price);
```

**Hinweis zur Pricing-Logik:** Erste 3 Muster = 0 €, danach 3 € pro Muster (siehe `src/lib/sampleUtils.ts`). Die Funktion soll den **tatsächlich berechneten Preis** für dieses Muster pushen, nicht pauschal 0.

### 3.5 `view_cart` — Warenkorb anzeigen
**Zwei Stellen:**

1. **`src/app/cart/page.tsx`** — Mount der Warenkorb-Seite:
   ```typescript
   useEffect(() => {
     const items = cartItems.map(/* → GA4Item */);
     track.viewCart(items, cartTotal);
   }, []);  // nur einmal beim Mount
   ```
2. **`src/components/cart/CartDrawer.tsx`** — Öffnen des Drawers:
   ```typescript
   useEffect(() => {
     if (isOpen) {
       const items = cartItems.map(/* → GA4Item */);
       track.viewCart(items, cartTotal);
     }
   }, [isOpen]);
   ```

**Set-Items im Cart:** Für `view_cart` werden die Set-Bestandteile als einzelne Items geliefert (gleiches Schema wie bei `add_to_cart` Set-Bundle). Nutze die Discriminated Union `CartSetItem | CartSingleItem` zur Konvertierung.

### 3.6 `remove_from_cart`
**Stellen:** Die Stellen, an denen ein Cart-Item entfernt wird (`CartDrawer.tsx`, `cart/page.tsx`).

**Bei Set-Items:** Wenn ein Set komplett entfernt wird → ein Event pro Bestandteil ODER ein Event mit `items[]`-Array. Da der GTM-Trigger nur auf `event === 'remove_from_cart'` matcht, ist beides möglich. **Entscheidung: ein Event mit allen entfernten Items im `items[]`-Array** (analog zum `add_to_cart`-Verhalten — konsistent).

### 3.7 `begin_checkout`
**Datei:** `src/app/checkout/page.tsx` (oder die erste Step-Komponente, vermutlich `ContactStep.tsx`).

```typescript
useEffect(() => {
  const items = cartItems.map(/* → GA4Item */);
  track.beginCheckout(items, cartTotal);
}, []);  // nur einmal beim Mount des Checkouts
```

**Wichtig:** Bei Step-Wechsel innerhalb des Checkouts (Contact → Shipping → Payment → Review) NICHT erneut feuern.

### 3.8 `add_payment_info`
**Datei:** `src/components/checkout/PaymentStep.tsx` oder `PaymentOptions.tsx`.

```typescript
const handlePaymentSelect = (method: PaymentType) => {
  // bestehende Logik...
  track.addPaymentInfo(items, cartTotal, method);
};
```

**Mehrfach-Auswahl:** Wenn der User die Zahlungsart wechselt, **erneut feuern** — GA4 erlaubt mehrere `add_payment_info`-Events pro Session.

### 3.9 `purchase` — Success Page (KRITISCH)
**Datei:** `src/app/checkout/success/page.tsx`.

**Anforderungen:**
1. **Order-Daten via API-Refetch holen** (`/api/checkout/order/[id]`) — nicht aus `localStorage`/Query-Params allein, weil `value` und `items` zuverlässig sein müssen.
2. **Doppel-Event-Schutz** mit `sessionStorage`:
   ```typescript
   const flagKey = `purchase_tracked_${orderId}`;
   if (sessionStorage.getItem(flagKey)) return;  // bereits getrackt, abbrechen
   // ... track.purchase(...) ...
   sessionStorage.setItem(flagKey, '1');
   ```
3. **Funktioniert für ALLE drei Payment-Methoden** (Stripe, PayPal, BACS) gleich — Vorgabe Oskar 04.05.2026 (BACS vereinfacht „beim Laden der Dankeseite feuern").

```typescript
useEffect(() => {
  if (!orderId) return;
  const flagKey = `purchase_tracked_${orderId}`;
  if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(flagKey)) return;

  fetch(`/api/checkout/order/${orderId}`)
    .then(r => r.json())
    .then(order => {
      const items: GA4Item[] = order.line_items.map(/* → GA4Item, siehe Hinweis */);
      track.purchase({
        orderId: Number(order.id),
        items,
        value: Number(order.total),
        currency: 'EUR',
        paymentType: order.payment_method as PaymentType,
        shipping: Number(order.shipping_total ?? 0),
        tax: Number(order.total_tax ?? 0),
      });
      sessionStorage.setItem(flagKey, '1');
    })
    .catch(err => console.error('[track.purchase] Order-Fetch failed:', err));
}, [orderId]);
```

**Hinweis zum Item-Mapping aus WooCommerce-Line-Items:**
- `item_id`: `line_item.product_id` (als String)
- `item_name`: `line_item.name`
- `price`: `line_item.subtotal / line_item.quantity` (Einzelpreis aus Subtotal teilen, weil `line_item.price` in WC manchmal inklusive Quantity ist — bitte vorher in der API-Antwort prüfen)
- `quantity`: `line_item.quantity`
- `item_variant`: aus `line_item.meta_data` rauspflücken, falls Set-Bestandteil markiert ist (`set_position` o.ä. — falls nicht vorhanden: weglassen, ist optional)

**Wenn die `line_items`-Struktur unklar ist: STOP, melde dich, ich schaue mit dir die API-Antwort an.**

### 3.10 Musterbestellung (purchase mit value=0)

Eine Musterbestellung erzeugt eine WooCommerce-Order mit `total: 0`. Auf der Success Page läuft genau derselbe Code wie oben — der einzige Unterschied: `value: 0`. **GTM unterscheidet automatisch** durch den Trigger `dlv - ecommerce.value ist gleich 0`. KEINE Sonderbehandlung im Frontend nötig.

### Phase-3-Akzeptanzkriterium
- Mit `npm run dev` durch den kompletten Flow gehen (Produkt → Set hinzufügen → Cart → Checkout → BACS → Success)
- In Browser-Console: `dataLayer.filter(e => typeof e.event === 'string').map(e => e.event)` muss in dieser Reihenfolge ausgeben:
  ```
  ['page_view', 'view_item', 'add_to_cart', 'page_view', 'view_cart', 'page_view', 'begin_checkout', 'add_payment_info', 'page_view', 'purchase']
  ```
- Bei Reload der Success Page darf `purchase` NICHT erneut erscheinen.

→ **STOP, kurze Zusammenfassung, dann Phase 4.**

---

## Phase 4 — Footer-Telefonnummer & Tippfehler-Fixes

Diese Phase ist klein, aber wichtig für das Tracking (`Link Click | tel`-Trigger im GTM erwartet exakt `tel:+492433938884`).

### 4.1 Footer
**Datei:** `src/components/Footer.tsx`

Suche die Telefonnummer (vermutlich als reiner Text dargestellt) und mache sie zu einem Link:
```tsx
<a href="tel:+492433938884">02433 / 938884</a>
```

### 4.2 FachmarktSubpage Tippfehler
**Datei:** `src/components/FachmarktSubpage.tsx`, Zeile 142

Aktuell: `tel:+4924339388840` (eine Null zu viel am Ende → falsche Nummer).
Korrigiere auf: `tel:+492433938884`.

### 4.3 FachmarktPage Klartext → Link
**Datei:** `src/components/FachmarktPage.tsx`, Zeile 355

Aktuell: Telefonnummer als Klartext.
Korrigiere zu: `<a href="tel:+492433938884">…</a>`.

### Phase-4-Akzeptanzkriterium
- `grep -rn "tel:" src/components/` zeigt nur noch `tel:+492433938884` (nichts anderes)
- `grep -rn "938884" src/components/` — alle Treffer entweder als `tel:+492433938884`-Link oder als Anzeigetext daneben

→ **STOP, kurze Gesamt-Zusammenfassung.**

---

## Phase 5 — End-To-End-Test-Anleitung (KEIN Code, nur Dokumentation)

Erstelle am Ende eine Datei `TRACKING_TEST_GUIDE.md` im Projekt-Root mit:

1. **Test-Szenarien** für jeden Event-Typ (was klicken, was im dataLayer erwartet)
2. **GTM Preview Mode-Anweisung** für Oskar (wie er prüft, ob Tags richtig feuern)
3. **Bekannte Einschränkungen** (z.B. `purchase` für BACS feuert vor Zahlungseingang)
4. **Rollback-Plan**, falls etwas im Live-Betrieb schiefläuft (`GoogleTagManager.tsx` deaktivieren oder Hard-Gate temporär zurückbringen)

---

## Sicherheitsnetze / häufige Fallstricke

- **Niemals `dataLayer.push` ohne `event`-Feld** außer für `ecommerce: null`-Resets.
- **`ecommerce: null`-Reset vor jedem E-Commerce-Push** — sonst „klebt" das letzte ecommerce-Objekt zwischen Events.
- **`transaction_id` als Number**, nicht String (siehe Referenz 5.4: GTM hat eine cjs-Variable, die String→Number konvertiert — wir umgehen das durch direktes Number-Pushen).
- **`currency` immer als String `'EUR'`**, niemals leer.
- **Bei Set-Items im Cart**: nicht das Bundle als ein Item pushen, sondern die einzelnen Bestandteile (siehe Referenz 7.3).
- **Doppel-`purchase`-Event vermeiden**: sessionStorage-Flag VOR dem fetch prüfen, nach erfolgreichem Push setzen.
- **SSR-Safety**: jeder `track.*`-Aufruf prüft intern `typeof window === 'undefined'`. In Komponenten sind Aufrufe in `useEffect` (nicht im Render-Body).

---

## Mitgelieferte Dateien

- `GTM_REFERENZ.md` — autoritative Spezifikation (zuerst lesen)
- `PROJEKT_ZUSAMMENFASSUNG.md` — Gesamtkontext

## Wenn etwas unklar ist

**Lieber einmal nachfragen als raten.** Insbesondere bei:
- Cookie-Consent-Hook-API (Feldnamen, `hasResponded`-Flag)
- WooCommerce-Order-API-Struktur (`line_items`, `meta_data`)
- Set-Item-Repräsentation im CartContext (wie kommt man von `setId` zu allen drei Bestandteilen?)
