# GTM-Tracking Test-Guide — Bodenjäger

**Stand:** 2026-05-04
**Container:** `GTM-MW5G8DXD`
**Implementierung:** Siehe `CLAUDE_CODE_PROMPT.md` und `GTM_REFERENZ.md`.

Dieses Dokument beschreibt, wie das implementierte Tracking manuell verifiziert wird, was im GTM-Preview-Mode zu sehen sein muss, welche bekannten Einschränkungen es gibt und wie ein Rollback aussieht.

---

## 1. Voraussetzungen

- Lokaler Dev-Server: `npm run dev` (auf `http://localhost:3000`).
- Browser: Chrome/Firefox mit DevTools.
- Optional: GTM-Preview-Mode (siehe Abschnitt 4) für Tag-Level-Verifikation.
- Cookie-Banner muss bei jeder Test-Session frisch angezeigt werden — vorab im DevTools `localStorage.removeItem('bodenjaeger-cookie-consent')` und Reload.

---

## 2. Console-Helper

Praktische Snippets in der DevTools-Console:

```js
// Alle bisher gefeuerten Events (chronologisch)
dataLayer.filter(e => typeof e.event === 'string').map(e => e.event)

// Letztes ecommerce-Event
[...dataLayer].reverse().find(e => e.ecommerce)

// Anzahl pro Event-Typ
dataLayer.filter(e => typeof e.event === 'string').reduce((acc, e) => {
  acc[e.event] = (acc[e.event] || 0) + 1; return acc;
}, {})

// Consent-Calls
dataLayer.filter(e => Array.isArray(e) ? e[0] === 'consent' : false)
// alternativ (gtag-Args werden als pseudo-Array gepusht):
dataLayer.filter(e => e[0] === 'consent')
```

---

## 3. Test-Szenarien

### 3.1 Cold Start — Consent Mode v2

**Setup:** `localStorage.clear()`, danach Reload `/`.

**Erwartet (in Reihenfolge):**
1. **Vor jedem GTM-Tag:** `dataLayer[0]` enthält `gtag('consent', 'default', { ad_storage: 'denied', …, security_storage: 'granted', wait_for_update: 500 })`.
2. **Network-Tab:** `gtm.js` wird geladen — auch wenn der User noch nicht entschieden hat.
3. **Cookie-Banner** erscheint.
4. **Klick „Alle akzeptieren":** ein zweiter Eintrag mit `gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted', … })`.
5. **Klick „Nur notwendige":** ebenfalls `update`, aber alle nicht-notwendigen Felder `'denied'`.

**Check-Befehl:**
```js
dataLayer.filter(e => e[0] === 'consent').map(e => [e[1], e[2]])
// → [['default', {…}], ['update', {…}]]
```

### 3.2 Page-View bei Routenwechsel

**Setup:** Cookie-Consent erteilt.

**Schritte:**
1. Auf `/` → Klick „Vinylboden"-Kategorie → Klick auf Produkt → zurück zur Startseite.
2. In der Console: `dataLayer.filter(e => e.event === 'page_view').map(e => e.page_path)`.

**Erwartet:** Mindestens 4 Einträge mit den jeweiligen Pfaden.

### 3.3 view_item — Produktseite

**Schritte:** `/products/<slug>` aufrufen.

**Erwartet:** **Genau ein** `view_item`-Event direkt nach dem `page_view`.

```js
const v = [...dataLayer].reverse().find(e => e.event === 'view_item');
console.log(v.ecommerce.items[0]); // → { item_id, item_name, price, quantity:1, item_brand:'Bodenjäger', item_category }
```

### 3.4 add_to_cart — Standard-Produkt (Zubehör)

**Schritte:** Auf einer Produktseite aus der Kategorie `zubehoer` (`/products/<slug>` mit Single-Layout): „In den Warenkorb" klicken.

**Erwartet:** Ein `add_to_cart`-Event mit einem Item, `price = product.price × paketinhalt`, `quantity = packages`.

### 3.5 add_to_cart — Set-Bundle (Boden + Dämmung + Sockelleiste)

**Schritte:** Floor-Produkt öffnen, Dämmung Premium wählen, Sockelleiste Premium wählen, „In den Warenkorb".

**Erwartet:** **Ein** `add_to_cart`-Event mit drei Items im `items[]`-Array, jeweils `item_variant: 'Set: Boden' | 'Set: Dämmung' | 'Set: Sockelleiste'`. Standard-/freie Bestandteile haben `price: 0`. `value` = `setTotal` (Boden + Aufpreise).

```js
const a = [...dataLayer].reverse().find(e => e.event === 'add_to_cart');
console.log(a.ecommerce.items.map(i => [i.item_variant, i.price, i.quantity]));
```

### 3.6 add_to_cart — Cross-Selling (ZubehoerSlider)

**Schritte:** Auf einer Produkt-Detailseite weiter unten zum Zubehör-Slider scrollen, auf dem Warenkorb-Icon eines Zubehörartikels klicken.

**Erwartet:** Ein `add_to_cart`-Event mit einem Item, `quantity: 1`, `price = paketpreis`.

### 3.7 add_to_cart — Muster-Bestellung

**Schritte:** Floor-Produktseite → „Kostenloses Muster bestellen".

**Erwartet:** Ein `add_to_cart`-Event mit einem Item: `item_variant: 'Muster'`, `item_category: 'Muster'`, `price: 0`, `quantity: 1`. `value: 0`.

### 3.8 view_cart — `/cart` und CartDrawer

**Schritte:**
1. Drawer öffnen (Header-Warenkorb-Icon) → ein `view_cart`-Event.
2. Drawer schließen, erneut öffnen → ein weiteres `view_cart`-Event (semantisch zwei Views, beabsichtigt).
3. Auf `/cart` navigieren → ein weiteres `view_cart`-Event.

**Erwartet:** `items[]` enthält alle nicht-leeren Cart-Items inkl. Set-Bestandteilen als separate Items.

### 3.9 remove_from_cart

**Single-Item entfernen** (im Drawer oder auf `/cart`): ein Event mit einem Item.

**Set-Bundle als Ganzes entfernen** (Drawer „×" auf einem Set): **ein** Event mit zwei oder drei Items im `items[]`-Array — analog zum Set-`add_to_cart`-Verhalten.

### 3.10 begin_checkout

**Schritte:** Vom Cart auf „Zur Kasse" klicken → `/checkout`.

**Erwartet:** Genau **ein** `begin_checkout`-Event beim Mount der Checkout-Seite. Wechsel zwischen Versandart/Adressfeldern darf das Event NICHT erneut auslösen.

### 3.11 add_payment_info

**Schritte:** Auf `/checkout` zwischen den Zahlungsarten hin und her klicken (Kreditkarte → PayPal → Vorkasse → Kreditkarte).

**Erwartet:** Bei jedem Wechsel ein neues `add_payment_info`-Event mit dem aktuellen `payment_type`. Beim ersten Mount (Default `stripe`) feuert ein erstes Event.

```js
dataLayer.filter(e => e.event === 'add_payment_info').map(e => e.ecommerce.payment_type)
```

### 3.12 purchase — BACS / Vorkasse

**Schritte:** Cart befüllen → Checkout → Vorkasse → „Jetzt kaufen".

**Erwartet:**
1. Während des Submits, **vor** dem Redirect: ein Eintrag in `localStorage[order_<id>_tracking]` (kannst du im DevTools prüfen, wenn du die Redirect-Schritte langsam machst, oder dafür im Network-Tab Throttling setzen).
2. Nach Redirect auf `/checkout/success?order=<id>&key=<key>`:
   - `dataLayer` enthält ein `purchase`-Event mit `transaction_id: <id>` (Number), `value`, `currency: 'EUR'`, `payment_type: 'bacs'`.
   - `sessionStorage.getItem('purchase_tracked_<id>')` gibt `'1'` zurück.
   - `localStorage.getItem('order_<id>_tracking')` gibt `null` (Puffer entfernt).
   - `localStorage.getItem('woocommerce-cart')` gibt `null` (Cart geleert).

### 3.13 purchase — Stripe

**Setup:** Stripe-Test-Mode-Keys in `.env.local`.

**Schritte:** Cart befüllen → Checkout → Kreditkarte → „Jetzt kaufen" → Stripe-Test-Karte (`4242 4242 4242 4242`) → Submit.

**Erwartet:** Nach Stripe-Redirect zurück auf `/checkout/success?order=<id>&key=<key>&session_id=cs_test_…`:
- Gleicher `purchase`-Event-Inhalt wie BACS, aber `payment_type: 'stripe'`.
- Doppel-Event-Schutz greift bei Reload der Success-Page (siehe 3.15).

### 3.14 purchase — PayPal

**Schritte:** Cart befüllen → Checkout → PayPal → „Jetzt kaufen" → PayPal-Sandbox approval → Redirect.

**Erwartet:** Auf `/checkout/success?order=<id>&paypal=success`:
- `purchase` mit `payment_type: 'paypal'`.

### 3.15 Doppel-Event-Schutz beim Reload

**Schritte:** Nach erfolgreichem Kauf (Szenario 3.12/3.13/3.14) die Success-Page **reloaden** (F5).

**Erwartet:**
- KEIN zweites `purchase`-Event in `dataLayer`.
- `dataLayer.filter(e => e.event === 'purchase').length === 1`.
- Der Cart bleibt geleert, die Tracking-Daten bleiben gelöscht.

### 3.16 Muster-purchase (`value: 0`)

**Schritte:** Cart enthält **nur** Muster (keine anderen Produkte) → Checkout → BACS → Submit → Success.

**Erwartet:** `purchase` mit `value: 0` und ggf. `shipping > 0` (Muster-Aufschlag ab 4. Muster). GTM-Trigger `purchase | muster_bestellen | value = 0` matcht und feuert die Sonder-Tags. Das normale `purchase`-Tag hat eine Ausnahme auf diesen Trigger und feuert NICHT mehrfach (vgl. GTM_REFERENZ.md 3.4).

### 3.17 Auto-Tracking — Telefon- und E-Mail-Klicks

**Voraussetzung:** Marketing-Consent erteilt.

**Schritte:**
1. Auf einem beliebigen `tel:+492433938884`-Link klicken (z.B. Footer, Kontakt, Fachmarkt).
2. Auf einem `mailto:`-Link klicken (z.B. Footer, Newsletter).

**Erwartet (im GTM-Preview-Mode):**
- `Link Click | tel`-Trigger feuert → `GA4 - click_phone` und `Google Ads - click_phone` Tags.
- `Link Click | email`-Trigger feuert → `GA4 - click_email` und `Google Ads - click_email` Tags.

**Im dataLayer** (ohne Preview-Mode): Standard `gtm.linkClick`-Events; konkrete Tag-Auslösung nur im Preview sichtbar.

---

## 4. GTM Preview-Mode (für Oskar / Marketing)

1. Im GTM-Container `GTM-MW5G8DXD` oben rechts auf „Preview" klicken.
2. Die Seite [https://bodenjaeger.de](https://bodenjaeger.de) (oder lokal `http://localhost:3000`) eingeben.
3. Connect → Tag Assistant öffnet sich in neuem Tab.
4. Im Bodenjäger-Tab: Cookie-Banner annehmen (Marketing+Analytics).
5. Im Tag-Assistant-Tab: **Summary**-Sidebar zeigt jeden Event mit `Tags Fired` / `Tags Not Fired`.

**Erwartete Reihenfolge (Beispiel: Set-Kauf via BACS):**

| dataLayer-Event | Tags Fired (mind.) |
|-----------------|--------------------|
| Container Loaded | Google Consent Mode - Default, GA4 Konfig., Google Ads Konfig., GA4 - page_view, Facebook - page_view |
| consent (update) | Google Consent Mode - Update |
| view_item | GA4 - view_item, Facebook - view_content, Google Ads - view_item |
| add_to_cart | GA4 - add_to_cart, Facebook - add_to_cart, Google Ads - add_to_cart |
| view_cart | GA4 - view_cart |
| begin_checkout | GA4 - begin_checkout, Facebook - initiate_checkout, Google Ads - begin_checkout |
| add_payment_info | GA4 - add_payment_info |
| purchase | GA4 - purchase, Facebook - purchase, Google Ads - purchase |

**Bei Muster-Bestellung** (`value: 0`): Statt der drei normalen `purchase`-Tags feuern: `GA4 - muster_bestellen`, `Facebook | 8 | - muster_bestellen`, `Google Ads - | 8 | muster_bestellen | value = 0`, `cImage - Musterbestellungen | Lead`.

---

## 5. Bekannte Einschränkungen

### 5.1 BACS (Vorkasse) — `purchase` feuert vor Zahlungseingang
Das `purchase`-Event wird beim Laden der Dankeseite gefeuert, NICHT erst nach Geldeingang. Wenn der Kunde nach „Jetzt kaufen" nicht überweist, ist der Event trotzdem in GA4 / FB / Ads gelandet. Bewusste Vereinfachung (vgl. GTM_REFERENZ.md 7.5). Korrektur wäre möglich, würde aber Backend-Webhook auf WooCommerce-Status `processing`/`completed` erfordern.

### 5.2 Tracking-Puffer im localStorage
Wenn der Browser zwischen Checkout-Submit und Success-Page abstürzt oder ein Ad-Blocker den localStorage blockt, fehlt der Puffer auf der Success-Page → `purchase` wird **nicht** gefeuert. Console-Warning: `[track.purchase] tracking payload missing for order <id>`. Cart wird trotzdem geleert. Kein User-Impact.

### 5.3 Stale Tracking-Puffer beim Abbruch
Wenn der Kunde Stripe/PayPal abbricht und nie zur Success-Page kommt, bleibt `localStorage[order_<id>_tracking]` stehen, bis er die nächste Order erstellt (überschreibt den Puffer mit anderer Order-ID). Harmlos — wird nie irrtümlich getrackt, weil Success-Page den Key nur bei passender Order-ID in der URL liest.

### 5.4 Doppel-`view_cart` zwischen Drawer und `/cart`
Wenn der User den Drawer öffnet und dann auf „Zum Warenkorb" klickt, sind das zwei `view_cart`-Events. **Beabsichtigt** — semantisch zwei separate Views (vgl. Vorgabe in Phase 3).

### 5.5 Page-View bei Routenwechsel
Bei sehr schnellen Klicks (Routenwechsel innerhalb 50 ms) kann `document.title` noch nicht aktualisiert sein, sodass der `page_title` veraltet wirken kann. GA4 nutzt primär `page_location`, daher kein Reporting-Impact.

### 5.6 GTM-Container-Issue „Weitere Domains"
Eine GTM-interne Warnung verweist vermutlich auf die Alt-Domain `plan-dein-ding.de`. Nicht durch Frontend-Code behebbar. Reine GTM-Aufräumaktion.

---

## 6. Rollback-Plan

Wenn nach dem Live-Deploy etwas schiefläuft, gibt es zwei Eskalationsstufen:

### Stufe 1 — Tracking deaktivieren ohne Code-Revert
In `src/components/GoogleTagManager.tsx` als ersten Effekt einbauen:
```tsx
return null;
```
GTM lädt nicht mehr. Page-View-Tracker und alle `track.*`-Aufrufe pushen zwar weiter ins lokale `dataLayer`-Array, das aber nirgendwohin weiterläuft. Cookie-Consent-Banner bleibt funktional. Auswirkung: Keine GA4/Ads/FB-Events.

### Stufe 2 — Hard-Gate wiederherstellen (Pre-Phase-2-Zustand)
Wenn Consent Mode v2 Probleme macht (z.B. weil Datenschutz-Abstimmung nicht durch ist):

```tsx
'use client';
import Script from 'next/script';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

const GTM_ID = 'GTM-MW5G8DXD';
declare global { interface Window { dataLayer: Record<string, unknown>[]; } }

export default function GoogleTagManager() {
  const { isAllowed } = useCookieConsent();
  if (!isAllowed('analytics')) return null;
  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
      </noscript>
    </>
  );
}
```

Zusätzlich in `src/app/layout.tsx` den `<script id="gtm-consent-default">` aus dem `<head>` entfernen.

### Stufe 3 — Vollständiger Revert
Git-Revert auf den Commit vor der Tracking-Implementierung. Phase 4 (Telefon-Tippfehler-Fix) sollte separat erhalten bleiben, da unabhängig vom Tracking.

---

## 7. Offene Punkte / Klärung

Vgl. GTM_REFERENZ.md Abschnitt 9:

- **Item-Mapping** (Custom-Fields → `item_category`/`item_brand`/`item_variant`): Wir nutzen aktuell die erste Produktkategorie und `Brand: 'Bodenjäger'` als Konstante. Sollte Oskar konkrete Felder priorisieren wollen, sind das die zwei Funktionen in `src/lib/analytics/mapItem.ts`: `mapProductToItem` und `mapCartItemToGA4Item`.
- **Datenschutz-Abstimmung Cookie-Banner-Text**: Mit Dominik. Falls der Text wegen Consent Mode v2 angepasst werden muss, betrifft das ausschließlich `src/components/CookieConsent.tsx`.
- **Funnelform-Tracking** auf `/professioneller-verlegeservice/`: Seite existiert/existiert nicht prüfen, Form-Submit-Trigger ist GTM-seitig schon vorhanden.
