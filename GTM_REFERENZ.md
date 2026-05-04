# GTM-Referenzdatei — Bodenjäger Tracking-Implementierung

**Stand:** 04. Mai 2026
**Quelle:** Direkte Analyse des GTM-Containers `GTM-MW5G8DXD` durch Jo (Entwickler) am 04.05.2026
**Zweck:** Vollständige Spezifikation als Grundlage für den Claude-Code-Implementierungs-Prompt
**Vor-Kontext:** E-Mail-Austausch mit Oskar (Upside Marketing) vom 29.04.2026

---

## 1. Stammdaten / IDs

| Wert | ID | Speicherort |
|------|-----|-------------|
| GTM-Container | `GTM-MW5G8DXD` | bereits in `bodenjaeger.de` eingebunden |
| GA4 Mess-ID | `G-YDNQ71B2K0` | im GTM-Tag konfiguriert (Frontend braucht das nicht) |
| Google Ads Konto-ID | `AW-10896856419` | im GTM-Tag konfiguriert |
| Facebook Pixel ID | `844360507312401` | im GTM-Tag konfiguriert |
| Live-Version GTM | Version 18 (vor 8 Monaten von mccdamcon@gmail.com) |  |
| Workspace-Änderungen | 6 Form-Variablen aktiviert (vor 6 Tagen von upma.upside.marketing@gmail.com) — irrelevant für unsere Aufgabe |  |

**Konsequenz für Frontend:** Es muss nur die Container-ID `GTM-MW5G8DXD` kennen. Alle Plattform-IDs (GA4, Ads, FB) sind GTM-intern.

---

## 2. Container-Qualitäts-Issues (vom GTM gemeldet)

1. **"Weitere Domains gefunden, die konfiguriert werden sollten"** — vermutlich Alt-Domain `plan-dein-ding.de`. Harmlos, löst sich nach Cleanup.
2. **"Einige Ihrer Seiten sind nicht getaggt"** — direkte Bestätigung für SPA-Page-View-Problem. Wird durch `page_view`-Push bei Routenwechsel gelöst.

---

## 3. Vollständige Tag-Liste (35 Tags)

### 3.1 Konfigurations-Tags (laufen auf "All Pages" / "Initialization")

| Tag | Typ | Trigger | Bemerkung |
|-----|-----|---------|-----------|
| G-Tag GA4 Konfig. (G-YDNQ71B2K0) | Google-Tag | Initialization - All Pages | GA4-Basis |
| G-Tag G-Ads Konfig. (AW-10896856419) | Google-Tag | Initialization - All Pages | Google Ads-Basis |
| Google Ads - Conversions Linker | Conversion-Verknüpfung | All Pages | URL-Parameter für Cross-Domain |
| Google Consent Mode - Default | Consent Mode | Consent Initialization - All Pages | **VORHANDEN** — wartet auf default-Call vom Frontend |
| Google Consent Mode - Update | Consent Mode | Initialization - All Pages | **VORHANDEN** — wartet auf update-Call vom Frontend |
| Persist campaign Data \| Cookies | Persist Campaign Data | All Pages | Cookies _gcl_aw, _fbc setzen |

### 3.2 Page-View / Page-Tracking

| Tag | Trigger |
|-----|---------|
| GA4 - page_view | All Pages |
| Facebook \| 1 \| - page_view | All Pages |

**Kritisch für SPA:** "All Pages" feuert in Next.js nur beim ersten Pageload. Bei Client-Side-Navigation **muss das Frontend manuell** ein `page_view`-Event pushen.

### 3.3 E-Commerce-Funnel-Events

| Event | GA4-Tag | Facebook-Tag | Google-Ads-Tag |
|-------|---------|--------------|----------------|
| view_item | ✓ | ✓ (view_content) | ✓ |
| add_to_cart | ✓ | ✓ | ✓ |
| view_cart | ✓ | — | — |
| remove_from_cart | ✓ | — | — |
| begin_checkout | ✓ | ✓ (initiate_checkout) | ✓ |
| add_payment_info | ✓ | — | — |
| purchase | ✓ | ✓ | ✓ |

### 3.4 Spezial-Tags (Musterbestellung)

| Tag | Trigger | Sinn |
|-----|---------|------|
| GA4 - muster_bestellen | purchase \| muster_bestellen \| value = 0 | GA4-Event für Musterbestellung |
| Facebook \| 8 \| - muster_bestellen | gleicher Trigger | FB-Lead-Event |
| Google Ads - \| 8 \| muster_bestellen \| value = 0 | gleicher Trigger | Ads-Conversion |
| cImage - Musterbestellungen \| Lead | Custom Image | Custom Image Pixel mit FBCLID/GCLID |

**Wichtig:** Die normalen `purchase`-Tags (GA4, FB, Google Ads) haben jeweils **Ausnahme** auf den `purchase | muster_bestellen | value = 0`-Trigger. Damit wird verhindert, dass eine Musterbestellung doppelt gezählt wird.

### 3.5 Auto-Tracking (kein Frontend-Code nötig)

| Tag | Trigger | Voraussetzung |
|-----|---------|---------------|
| GA4 - click_phone | Link Click \| tel | `tel:+492433938884`-Link im DOM |
| GA4 - click_email | Link Click \| email | `mailto:`-Link im DOM |
| Google Ads - click_phone | gleicher Trigger | wie oben |
| Google Ads - click_email | gleicher Trigger | wie oben |
| Google Ads - Anrufe über Webseite | All Pages | Tag-Konfig im GTM |
| GA4 - funnelform_submit | Element Visibility + Form Submit auf `/professioneller-verlegeservice/` | Seite und Formular müssen existieren |
| Google Ads - funnelform_submit | gleicher Trigger | wie oben |

---

## 4. Vollständige Trigger-Liste (14 Trigger)

| Trigger-Name | Typ | Bedingung |
|--------------|-----|-----------|
| add_payment_info | Benutzerdefiniertes Ereignis | event = `add_payment_info` |
| add_to_cart | Benutzerdefiniertes Ereignis | event = `add_to_cart` |
| begin_checkout | Benutzerdefiniertes Ereignis | event = `begin_checkout` |
| purchase | Benutzerdefiniertes Ereignis | event = `purchase` |
| remove_from_cart | Benutzerdefiniertes Ereignis | event = `remove_from_cart` |
| view_cart | Benutzerdefiniertes Ereignis | event = `view_cart` |
| view_item | Benutzerdefiniertes Ereignis | event = `view_item` |
| **purchase \| muster_bestellen \| value = 0** | Benutzerdefiniertes Ereignis | event = `purchase` UND `dlv - ecommerce.value` ist gleich `0` |
| purchase \| muster_bestellen \| value = 0 + FBCLID | wie oben | + Cookie `_fbc` ≠ undefined |
| purchase \| muster_bestellen \| value = 0 + GCLID | wie oben | + Cookie `_gcl_aw` ≠ undefined |
| Element Visibility \| Form Submit \| Page Path = /professioneller-verlegeservice/ | Elementsichtbarkeit | Pfad-Check |
| Form Submit | Formulareinreichung | unbenutzt |
| Link Click \| email | Nur Links | Click URL enthält `mailto:` |
| Link Click \| tel | Nur Links | Click URL enthält `tel:+492433938884` |

**Wichtigste Erkenntnisse:**
- Alle Trigger matchen ausschließlich auf den `event`-Namen im dataLayer (plus optional `value === 0` für Musterbestellung)
- Keine zusätzlichen Conditions wie URL-Pfad oder Hostname
- Telefon-Trigger ist auf `tel:+492433938884` festgenagelt — Footer-Link MUSS exakt diese Nummer haben

---

## 5. Datenstruktur (`dataLayer`-Schema)

### 5.1 Schema-Stil: GA4 Standard mit `ecommerce`-Wrapper

Bestätigt durch Variablen `dlv - ecommerce.*`. Schema ist:

```javascript
window.dataLayer.push({
  event: '<event_name>',
  ecommerce: {
    transaction_id: '...',  // nur bei purchase
    value: 49.90,
    currency: 'EUR',
    coupon: '...',          // optional, aktuell ungenutzt
    shipping: 5.99,         // optional
    tax: 7.96,              // optional
    payment_type: 'stripe', // optional, bei add_payment_info / purchase
    items: [/* siehe 5.2 */]
  }
});
```

### 5.2 Item-Struktur (`ecommerce.items[]`)

Oskar hat **keine spezifischen Item-Variablen** im GTM angelegt — er liest das gesamte `items`-Array als Ganzes. Daher: GA4-Standard-Schema verwenden.

```javascript
{
  item_id: '12345',           // Pflicht — Produkt-ID als String
  item_name: 'Vinylboden XYZ',// Pflicht
  price: 24.99,               // Number, pro Einheit (NICHT * quantity!)
  quantity: 11,               // Number
  item_category: 'Vinylboden',// optional, aber empfohlen
  item_brand: 'Bodenjäger',   // optional
  item_variant: 'Set: Boden'  // optional, z.B. Set-Bestandteil
}
```

### 5.3 Vorhandene Datenschicht-Variablen im GTM

**`ecommerce.*`:**
- `dlv - ecommerce.transaction_id`
- `dlv - ecommerce.value`
- `dlv - ecommerce.currency`
- `dlv - ecommerce.items`
- `dlv - ecommerce.coupon`
- `dlv - ecommerce.shipping`
- `dlv - ecommerce.tax`
- `dlv - ecommerce.payment_type`

**`eventModel.*`:** (Googles Auto-Wrapper, von uns nicht zu bedienen)
- `dlv - eventModel.transaction_id`
- `dlv - eventModel.value`
- `dlv - eventModel.currency`

**Facebook-spezifische Variablen** (werden im GTM **automatisch** aus `ecommerce.items` generiert — Frontend muss nichts FB-Spezifisches pushen):
- `dlv - content_category | Facebook` (Datenschichtvariable)
- `dlv - content_ids | Facebook` (Facebook Parameter Generator)
- `dlv - content_name | Facebook` (Facebook Parameter Generator)
- `dlv - contents | Facebook` (Facebook Parameter Generator)
- `dlv - num_items | Facebook` (Facebook Parameter Generator)
- `dlv - value | Facebook` (Facebook Parameter Generator)
- `dlv - ecommerce.value | Facebook`
- `dlv - ecommerce.currency | Facebook`
- `dlv - ecommerce.items | Facebook`

**Sonstige:**
- `dlv - ga | external_id | Facebook` (First-Party-Cookie, GTM-intern)
- `Facebook | Unique ID` (Unique Event ID, GTM-intern)
- `FPC - _fbc`, `FPC - _gcl_aw`, `FPC - __gtm_campaign_url` (Cookies, GTM-intern)

### 5.4 Custom-JavaScript-Variablen (GTM-intern, kein Frontend-Bezug)

- `cjs - extract email`
- `cjs - extraction of GCLID | Trim`
- `cjs - timestamp | google ads format for offline conversion`
- `cjs - transaction_id | text to number` → **Hinweis:** transaction_id wird ggf. zu Number konvertiert. Empfehlung: direkt als Number pushen (also `123`, nicht `'123'`).

---

## 6. Consent Mode v2

### 6.1 Aktueller Zustand

- **Im GTM bereits konfiguriert** mit zwei Tags: `Default` und `Update`
- **Frontend ruft beide Calls bisher NICHT** → daher kein Tracking, wenn User Cookies ablehnt
- Oskars Wunsch (E-Mail vom 04.05.2026): Consent Mode v2 nutzen, um anonymisierte Conversion-Daten auch ohne Zustimmung zu erhalten

### 6.2 Was das Frontend liefern muss

**1. Default-Call (vor jedem `gtm.js`-Load):**
```javascript
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'security_storage': 'granted',
  'wait_for_update': 500
});
```

**2. Update-Call (nach Consent-Aktion durch User):**
Mapping `CookieConsentContext` (necessary / functional / analytics / marketing) → Consent-Mode-Felder:

| CookieConsent-Kategorie | Consent-Mode-Felder |
|------------------------|---------------------|
| necessary (immer true) | `security_storage: 'granted'` |
| functional | `functionality_storage`, `personalization_storage` |
| analytics | `analytics_storage` |
| marketing | `ad_storage`, `ad_user_data`, `ad_personalization` |

```javascript
gtag('consent', 'update', {
  'analytics_storage': consent.analytics ? 'granted' : 'denied',
  'ad_storage': consent.marketing ? 'granted' : 'denied',
  'ad_user_data': consent.marketing ? 'granted' : 'denied',
  'ad_personalization': consent.marketing ? 'granted' : 'denied',
  'functionality_storage': consent.functional ? 'granted' : 'denied',
  'personalization_storage': consent.functional ? 'granted' : 'denied'
});
```

### 6.3 Auswirkung auf bestehende GTM-Lade-Logik

**Aktuell** (in `src/components/GoogleTagManager.tsx` aus Implementierung 27.04.2026):
> GTM lädt nur, wenn `consent.analytics === true` (Hard-Gate)

**Nach Umstellung:**
> GTM lädt **immer** (sobald Banner angezeigt wurde — oder sogar vor Banner-Anzeige mit `default: denied`). Tags warten via Consent Mode v2 selbst auf Freigabe.

Das ist die **eigentliche Änderung** in `GoogleTagManager.tsx`. Banner-Text muss ggf. angepasst werden (Datenschutz-Abstimmung mit Dominik).

---

## 7. Pflichtenheft: Was das Frontend liefern muss

### 7.1 Page-View bei Routenwechsel

Bei jeder Client-Side-Navigation in Next.js (App Router):

```javascript
window.dataLayer.push({
  event: 'page_view',
  page_location: window.location.href,
  page_path: window.location.pathname,
  page_title: document.title
});
```

Implementierung über `usePathname()` + `useSearchParams()` aus `next/navigation` in einem Client-Component-Hook.

### 7.2 E-Commerce-Events

| Event | Wann feuern? | Datenquelle |
|-------|--------------|-------------|
| `view_item` | Mount Produktseite (`src/app/products/[slug]/page.tsx` → ProductPageContent) | `StoreApiProduct` |
| `add_to_cart` | Klick "In den Warenkorb" / Set-CTA / Muster-Button / Re-Order | aktueller Produktzustand + Menge |
| `view_cart` | Mount `/cart` ODER Öffnen CartDrawer | CartContext |
| `remove_from_cart` | Klick Entfernen-Button im CartDrawer / `/cart` | Item, das entfernt wurde |
| `begin_checkout` | Mount `/checkout` (ContactStep) | CartContext |
| `add_payment_info` | Auswahl Zahlungsart in PaymentStep | Cart + ausgewählte Methode |
| `purchase` | Mount `/checkout/success` | API-Refetch via `/api/checkout/order/[id]` |

### 7.3 Set-Bundle-Behandlung (bestätigt durch Oskar 04.05.2026)

> **Ein** `add_to_cart`-Event mit drei Items im `items[]`-Array.

Beispiel:
```javascript
{
  event: 'add_to_cart',
  ecommerce: {
    value: 156.78,
    currency: 'EUR',
    items: [
      { item_id: 'boden_id', item_name: 'Vinyl XY', item_variant: 'Set: Boden', price: 24.99, quantity: 11 },
      { item_id: 'daemmung_id', item_name: 'Trittschall ABC', item_variant: 'Set: Dämmung', price: 0, quantity: 4 },
      { item_id: 'sockel_id', item_name: 'Sockelleiste DEF', item_variant: 'Set: Sockelleiste', price: 0, quantity: 30 }
    ]
  }
}
```

### 7.4 Musterbestellung

> Normales `purchase`-Event mit `value: 0`. KEIN separater Event-Name, KEIN extra Marker.
> GTM erkennt es automatisch durch den Trigger `dlv - ecommerce.value ist gleich 0`.

```javascript
{
  event: 'purchase',
  ecommerce: {
    transaction_id: 12345,
    value: 0,           // ← der entscheidende Wert
    currency: 'EUR',
    items: [
      { item_id: 'sample_xyz', item_name: 'Muster Vinyl XYZ', price: 0, quantity: 1, item_category: 'Muster' }
    ]
  }
}
```

### 7.5 BACS / Vorkasse — vereinfachte Lösung

**Oskars Antwort vom 04.05.2026:** Idealerweise erst nach Zahlungseingang feuern. Falls technisch nicht abbildbar: beim Laden der Dankeseite feuern und hoffen, dass die Zahlung kommt.

**Pragmatische Entscheidung:** Beim Laden der Dankeseite feuern (gleicher Flow wie Stripe/PayPal). Einfacher, einheitlicher, keine zusätzliche Backend-Logik nötig.

### 7.6 Doppel-Event-Schutz auf Success-Page

Bei Reload der `/checkout/success?order=123` darf `purchase` **nicht zweimal** feuern.

Lösung: `sessionStorage`-Flag `purchase_tracked_<order_id>`. Vor dem Push prüfen, nach dem Push setzen.

### 7.7 `tel:`-Link im Footer

- **Korrekte Form:** `<a href="tel:+492433938884">02433/938884</a>`
- **Bug-Fix gleichzeitig:** `src/components/FachmarktSubpage.tsx:142` (`+4924339388840` → eine 0 zu viel) und `src/components/FachmarktPage.tsx:355` (Klartext, kein Link)

---

## 8. Architektur der Implementierung

### 8.1 Dateien (neu / geändert)

**Neu:**
- `src/lib/analytics/track.ts` — zentrale Helper-Funktionen
- `src/lib/analytics/types.ts` — TypeScript-Typen für E-Commerce-Events
- `src/lib/analytics/mapItem.ts` — `StoreApiProduct` → GA4-Item-Mapper
- `src/components/PageViewTracker.tsx` — Client-Component für Routenwechsel-Tracking

**Geändert:**
- `src/components/GoogleTagManager.tsx` — Consent Mode v2 Default+Update statt Hard-Gate
- `src/contexts/CookieConsentContext.tsx` — Consent-Update nach `gtag('consent', 'update', ...)` triggern (oder als Effect in GoogleTagManager)
- `src/app/layout.tsx` — `<PageViewTracker />` einhängen
- `src/components/Footer.tsx` — `tel:`-Link
- `src/components/FachmarktSubpage.tsx` — Tippfehler-Fix `+4924339388840` → `+492433938884`
- `src/components/FachmarktPage.tsx` — Klartext zu `tel:`-Link
- `src/app/products/[slug]/page.tsx` ODER `ProductPageContent.tsx` — `view_item` bei Mount
- `src/components/cart/CartDrawer.tsx` — `view_cart` beim Öffnen, `remove_from_cart` bei Entfernen
- `src/app/cart/page.tsx` — `view_cart` bei Mount, `remove_from_cart` bei Entfernen
- `src/components/product/SetAngebot.tsx` + `SetAngebotMobile.tsx` — `add_to_cart` mit Bundle-Items
- `src/components/product/ProductInfo.tsx` (Standard-Add-to-Cart) — `add_to_cart` mit einem Item
- `src/app/checkout/page.tsx` (ContactStep) — `begin_checkout` bei Mount
- `src/components/checkout/PaymentStep.tsx` — `add_payment_info` bei Auswahl
- `src/app/checkout/success/page.tsx` — `purchase` mit API-Refetch + Doppel-Schutz

### 8.2 Helper-API (Vorschlag)

```typescript
// src/lib/analytics/track.ts
export const track = {
  pageView: (url: string, title: string) => void,
  viewItem: (product: StoreApiProduct, qty?: number) => void,
  addToCart: (items: GA4Item[], totalValue: number) => void,
  viewCart: (cartItems: CartItem[], totalValue: number) => void,
  removeFromCart: (item: GA4Item) => void,
  beginCheckout: (cartItems: CartItem[], totalValue: number) => void,
  addPaymentInfo: (cartItems: CartItem[], totalValue: number, paymentType: 'stripe'|'paypal'|'bacs') => void,
  purchase: (orderId: number, items: GA4Item[], value: number, paymentType: string, shipping?: number, tax?: number) => void,
};

export const consent = {
  setDefault: () => void,
  update: (consent: ConsentCategories) => void,
};
```

---

## 9. Offene Punkte / Klärungsbedarf

### 9.1 Mit Dominik (intern)
- [ ] Cookie-Banner-Text-Anpassung wegen Consent Mode v2 (Datenschutz-Abstimmung)

### 9.2 Mit Oskar (extern, nicht blockierend)
- [x] Set-Bundle = 1 Event mit 3 Items — **bestätigt 04.05.2026**
- [x] Weitere Events (view_item, view_cart, remove_from_cart, add_payment_info) gerne mitnehmen — **bestätigt 04.05.2026**
- [x] BACS: vereinfacht auf Dankeseite feuern — **abgestimmt 04.05.2026 (mit Vorbehalt)**
- [x] Consent Mode v2 — **gewünscht, sofern Anpassungen vom Entwickler kommen**
- [ ] Item-Felder-Mapping: Welche Custom Fields aus den 41 Root-Level-Feldern sollen als `item_category`, `item_brand`, `item_variant` gemappt werden? (Annahme bis zur Klärung: `item_category` aus erster Produktkategorie, `item_brand: 'Bodenjäger'` als Konstante, `item_variant` für Set-Bestandteile)

### 9.3 Technische Schuld / Nice-to-Have
- [ ] Funnelform-Tracking auf `/professioneller-verlegeservice/` — Seite muss prüfen, ob im Next.js Frontend existiert (separate Aufgabe)
- [ ] Container-Qualitäts-Issue 1 (weitere Domains) — nach Cleanup im GTM nochmal prüfen

---

## 10. Cross-Referenzen

- **CookieConsentContext-Implementierung:** `src/contexts/CookieConsentContext.tsx`
- **Bestehende GTM-Einbindung (Implementierung 27.04.2026):** `src/components/GoogleTagManager.tsx`
- **Bestehende Consent-Logik (zu refactorn):** `src/components/CookieConsent.tsx`
- **Stand der Projekt-Arbeit:** `PROJEKT_ZUSAMMENFASSUNG.md` (Stand 27.04.2026)
- **Vor-Analyse (vor Container-Einsicht):** Chat-Verlauf vom 29.04.2026 (`GTM DataLayer Events implementieren`)
- **E-Mail-Austausch mit Oskar:** 29.04.2026 (Jo → Oskar) und 04.05.2026 (Oskar → Jo)
