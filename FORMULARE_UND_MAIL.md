# Formulare & E-Mail-Versand — Bodenjäger

Diese Datei dokumentiert **alle Formulare** der Bodenjäger-Webseite, wohin
die E-Mails gehen, und wie das mit dem WordPress-Backend zusammenhängt.

Stand: 2026-05-29

---

## TL;DR (Wichtigste Erkenntnisse)

1. **Das Kontaktformular auf `/kontakt` versendet KEINE E-Mail.** Es ist
   aktuell eine Simulation (`setTimeout` 1500 ms) ohne API-Aufruf. Im Code
   steht: `// Simulate form submission - replace with actual endpoint`.
2. **Der Newsletter funktioniert** — er ruft eine Next.js-API-Route auf,
   die wiederum einen WordPress-Endpoint anspricht (`/wp-json/newsletter/v1/subscribe`).
3. **Bestellbestätigungs-E-Mails** werden vollständig von **WooCommerce
   im WordPress-Backend** verschickt — nicht von Next.js.
4. **Alle "Kontakt"-Buttons in Drawer/Footer** sind `mailto:`-Links auf
   `info@bodenjaeger.de` — sie öffnen den E-Mail-Client des Nutzers.

---

## 1. Übersicht aller Formulare

| Formular | Route / Komponente | Funktional? | Ziel |
|---|---|---|---|
| **Kontaktformular** | `/kontakt` — `src/components/KontaktPage.tsx` | ❌ **NEIN — Simulation** | (geplant: info@bodenjaeger.de) |
| **Newsletter (Footer)** | überall — `src/components/FooterNewsletterSignup.tsx` | ✅ Ja | WordPress: `/wp-json/newsletter/v1/subscribe` |
| **Newsletter (Inline)** | `src/components/NewsletterSignup.tsx` | ✅ Ja (gleicher Endpoint) | WordPress: `/wp-json/newsletter/v1/subscribe` |
| **Checkout** | `/checkout` — `src/app/checkout/page.tsx` | ✅ Ja | WooCommerce REST API `/wp-json/wc/v3/orders` |
| **Login / Passwort vergessen / Konto-Einstellungen** | `/login`, `/passwort-vergessen`, `/konto/einstellungen` | ✅ Ja | WordPress / WooCommerce Auth |
| **Karriere-Bewerbung** | `/karriere` — `src/components/KarrierePage.tsx` | ✅ Externes Widget | Drittanbieter: **join.com** (kein eigener Mailversand) |

Es gibt darüber hinaus **keine eigenständige Formular-Engine** im Frontend
(kein Contact Form 7, kein Gravity Forms, kein Resend-Setup o. ä.).

---

## 2. Kontaktformular — `/kontakt`

### Wo es lebt
- Route: `src/app/kontakt/page.tsx` (lädt WordPress-Page über `getPageBySlug`)
- Komponente: `src/components/KontaktPage.tsx`

### Felder
| Feld | Pflicht? | Typ |
|---|---|---|
| `name` | ja | Text |
| `email` | ja | E-Mail |
| `phone` | nein | Telefon |
| `subject` | ja | Select (Beratung / Bestellung / Reklamation / Lieferung / Fachmarkt / Sonstiges) |
| `message` | ja | Textarea |

### Was beim Absenden tatsächlich passiert
**Aktuell nichts.** Der `handleSubmit`-Handler (Zeile 38–50) wartet 1,5 s
und setzt dann den Status auf `success`, ohne irgendeinen Backend-Call:

```ts
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setFormStatus('sending');

  // Simulate form submission - replace with actual endpoint
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFormStatus('success');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  } catch {
    setFormStatus('error');
  }
};
```

> ⚠️ **Konsequenz:** Der Kunde sieht "Nachricht gesendet!", aber **niemand
> bekommt die Nachricht**. Das Formular muss noch an einen echten Endpoint
> angebunden werden (z. B. eine Next.js API-Route `/api/contact`, die per
> SMTP / Resend / WordPress-Plugin eine E-Mail an `info@bodenjaeger.de`
> verschickt — oder ein WordPress-Endpoint analog zum Newsletter).

### Mailziel (geplant)
- `info@bodenjaeger.de` (überall in der Seite als Kontaktadresse genannt)

---

## 3. Newsletter-Formular

### Frontend-Komponenten
- **Footer:** `src/components/FooterNewsletterSignup.tsx` (überall im Footer eingebunden)
- **Inline:** `src/components/NewsletterSignup.tsx` (z. B. auf der Newsletter-Seite)

### Felder
| Feld | Pflicht? |
|---|---|
| `email` | ja |
| `firstName`, `lastName` | optional (in der API-Route vorgesehen) |
| Checkbox: Datenschutz akzeptieren | ja |

### Datenfluss

```
Browser
   │
   │  POST /api/newsletter/subscribe
   │  { email, firstName?, lastName? }
   ▼
Next.js API-Route
   src/app/api/newsletter/subscribe/route.ts
   │
   │  POST {WORDPRESS_URL}/wp-json/newsletter/v1/subscribe
   │  Authorization: Basic <WC_CONSUMER_KEY:WC_CONSUMER_SECRET>
   │  { email, first_name, last_name, source: "website_footer", timestamp }
   ▼
WordPress (2025.bodenjaeger.de)
   → Newsletter-Plugin verschickt Double-Opt-In-Mail an den Empfänger
```

### Wichtig zum WordPress-Endpoint
- Erwartet wird ein **Custom Endpoint `/wp-json/newsletter/v1/subscribe`** im WordPress-Backend
  (vermutlich vom Jäger-Plugin oder einem klassischen Newsletter-Plugin bereitgestellt).
- Auth: **Basic Auth** mit `WC_CONSUMER_KEY` / `WC_CONSUMER_SECRET` aus `.env.local`.
- Bei Fehler liefert die API einen 503 mit dem Hinweis, der WordPress-Endpoint sei nicht verfügbar
  (`Newsletter subscription failed — WordPress endpoint not available`).
- Antwort an den User: "Fast geschafft! Wir haben Ihnen eine Bestätigungs-E-Mail geschickt." (Double-Opt-In)

### Mailziel
- **Empfänger der Bestätigungs-Mail:** der/die anmeldende Nutzer:in.
- **Absender:** WordPress (siehe Abschnitt 6 "WordPress Mail-Konfiguration").

---

## 4. Checkout — Bestellbestätigungen

### Frontend
- Formular: `src/app/checkout/page.tsx` (eigene `useState`-Verwaltung, nutzt **nicht** `CheckoutContext`)
- Submit → `POST /api/checkout/create-order` (Next.js)

### Server-seitig
- `src/lib/woocommerce-checkout.ts` legt die Bestellung über die
  **WooCommerce REST API v3** (`/wp-json/wc/v3/orders`) im WordPress-Backend an.
- Zahlungsmethoden:
  - **Stripe** → Stripe Checkout Session
  - **PayPal** → PayPal Approval URL
  - **BACS (Vorkasse)** → Bestellung wird auf `on-hold` gesetzt

### E-Mail-Versand
**Alle Bestell-E-Mails verschickt WooCommerce selbst** (nicht Next.js):

| WooCommerce-Mail | Empfänger | Wann |
|---|---|---|
| Neue Bestellung | **Admin** (Shop-Betreiber) | Bei jeder neuen Bestellung |
| In Bearbeitung | Kunde | Nach Zahlung (Stripe/PayPal) |
| Abgeschlossen | Kunde | Nach Versand (optional/manuell) |
| Rechnung / Vorkasse | Kunde | Bei BACS, Status "on-hold" |
| Storniert / Rückerstattet | Admin / Kunde | Je nach Status |
| Passwort zurücksetzen / Neues Konto | Kunde | Bei Account-Aktionen |

Konfiguriert wird das im WordPress-Admin unter
**WooCommerce → Einstellungen → E-Mails**.

### Service-/Support-Adresse
Auf der Success-Seite (`src/app/checkout/success/page.tsx`) wird als
Support-Kontakt **`service@bodenjaeger.de`** angegeben — diese Adresse
wird aktuell nur für Rückfragen referenziert (mailto), nicht für
automatischen Versand.

---

## 5. Direkte Mailto-Links (Kein Formular, aber relevant)

Diese Links öffnen den E-Mail-Client des Nutzers, ohne dass die Bodenjäger-
Infrastruktur involviert ist:

| Komponente | Adresse |
|---|---|
| `src/components/ContactDrawer.tsx` | `info@bodenjaeger.de` |
| `src/components/KontaktPage.tsx` (3×) | `info@bodenjaeger.de` |
| `src/components/FachmarktPage.tsx` | `info@bodenjaeger.de` |
| `src/app/checkout/success/page.tsx` | `service@bodenjaeger.de` |

**Telefon (überall):** `02433 938884`
**Fachmarkt-Adresse:** Neckarstraße 9, 41836 Hückelhoven

---

## 6. WordPress / WooCommerce — Mail-Konfiguration

### Backend-Basis
- **WordPress-URL:** `https://2025.bodenjaeger.de`
- **Frontend-Live:** `bodenjaeger.de` (Next.js auf Vercel)
- Backend liefert Produkte über **Custom Jäger-Plugin** (`/wp-json/jaeger/v1/products`)
- Bestellungen laufen über **WooCommerce REST API v3** (`/wp-json/wc/v3/orders`)

### Pflicht-Plugin: WP Mail SMTP
Laut interner Setup-Doku (`src/app/woocommerce-setup/page.tsx`) ist
**WP Mail SMTP** dringend empfohlen, weil das Standard-`mail()` von PHP
unzuverlässig ist und E-Mails sonst im Spam landen.

Empfohlene SMTP-Anbieter:
- **SendGrid**
- **Mailgun**
- **Amazon SES**
- Alternative: **Post SMTP** (Plugin)

### E-Mail-Absender (im WooCommerce-Admin einstellen)
- **Absender-Name:** "Bodenjäger" (oder "Jäger GmbH")
- **Absender-Adresse:** `info@2025.bodenjaeger.de` (oder `shop@...`)
- Header-Logo: optional
- Fußzeile: Impressum / Kontakt anpassen

> Pfad im WP-Admin: **WooCommerce → Einstellungen → E-Mails**

### Newsletter-Plugin (WordPress)
Damit der Newsletter-Endpoint `/wp-json/newsletter/v1/subscribe`
funktioniert, muss im WordPress ein Plugin/Custom Code aktiv sein, der
diesen Endpoint registriert (z. B. das Jäger-Plugin oder ein klassisches
Newsletter-Plugin wie "Newsletter" / "MailPoet" mit REST-Endpoint).

---

## 7. Relevante Environment-Variablen (`.env.local`)

```bash
# WordPress / WooCommerce
NEXT_PUBLIC_WORDPRESS_URL=https://2025.bodenjaeger.de
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...

# Stripe (Checkout-Mails kommen von WooCommerce, nicht Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...

# PayPal (optional)
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Cache (optional)
KV_REST_API_URL=...
KV_REST_API_TOKEN=...

# Revalidate-Webhook
REVALIDATE_SECRET=...
```

Für E-Mail-Versand aus Next.js heraus (z. B. künftiger Kontaktformular-
Endpoint) existieren **aktuell keine** Variablen wie `SMTP_HOST`,
`RESEND_API_KEY` o. ä. Das müsste beim Anbinden des Formulars ergänzt werden.

---

## 8. Offene Punkte / Empfehlung

1. **Kontaktformular anbinden** — Optionen:
   - **a)** Neuer WordPress-Endpoint `/wp-json/jaeger/v1/contact` (analog
     zum Newsletter), der per `wp_mail()` an `info@bodenjaeger.de`
     verschickt. Vorteil: SMTP-Setup bereits vorhanden (WP Mail SMTP).
   - **b)** Next.js API-Route `/api/contact` mit **Resend** / **SendGrid** /
     **Nodemailer**. Vorteil: unabhängig vom WordPress.
2. **Newsletter-Endpoint testen** — bei aktuellem Fehlerstatus 503 prüfen,
   ob das Plugin im WordPress wirklich aktiv ist.
3. **service@bodenjaeger.de vs. info@bodenjaeger.de** — vereinheitlichen
   oder klar trennen (Support vs. allgemein).

---

## Anhang: Datei-Index

| Thema | Datei |
|---|---|
| Kontaktformular UI | `src/components/KontaktPage.tsx` |
| Kontakt-Route (WordPress-Page-Loader) | `src/app/kontakt/page.tsx` |
| Newsletter UI (Footer) | `src/components/FooterNewsletterSignup.tsx` |
| Newsletter UI (Inline) | `src/components/NewsletterSignup.tsx` |
| Newsletter API-Route | `src/app/api/newsletter/subscribe/route.ts` |
| Checkout UI | `src/app/checkout/page.tsx` |
| Checkout API | `src/app/api/checkout/create-order/route.ts` |
| WooCommerce-Order-Client (server-only) | `src/lib/woocommerce-checkout.ts` |
| WordPress-Page-Loader | `src/lib/wordpress.ts` |
| Setup-Doku (intern) | `src/app/woocommerce-setup/page.tsx` |
| Kontakt-Drawer | `src/components/ContactDrawer.tsx` |
| Kontakt im Footer | `src/components/Footer.tsx` |
