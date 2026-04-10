# Bezahlfunktionen - Einrichtung & Status

**Stand:** 10.04.2026

---

## 1. Uebersicht: Was ist implementiert?

| Zahlungsmethode | Code | API Keys | Status |
|----------------|------|----------|--------|
| **Vorkasse / Ueberweisung** | Fertig | Nicht noetig | **Sofort einsatzbereit** |
| **Kreditkarte (Stripe)** | Fertig | PLACEHOLDER | **Blockiert — Keys fehlen** |
| **Sofortueberweisung (Stripe)** | Fertig | PLACEHOLDER | **Blockiert — Keys fehlen** |
| **PayPal** | Fertig | PLACEHOLDER | **Blockiert — Keys fehlen** |

**Der gesamte Code ist produktionsreif.** Es muessen nur die API-Credentials eingetragen werden.

---

## 2. Dateien-Uebersicht

| Datei | Funktion |
|-------|----------|
| `src/app/checkout/page.tsx` | Checkout-Formular (4 Zahlungsmethoden, Formvalidierung, Versandkosten) |
| `src/app/api/checkout/create-order/route.ts` | Order erstellen + Payment Session starten |
| `src/lib/stripe.ts` | Stripe Checkout Session erstellen, Webhook verarbeiten |
| `src/lib/paypal.ts` | PayPal Order erstellen, Zahlung capturen |
| `src/lib/woocommerce-checkout.ts` | WooCommerce Order API (erstellen, Status, Notizen) |
| `src/app/api/checkout/stripe/webhook/route.ts` | Stripe Webhook-Empfaenger |
| `src/app/api/checkout/paypal/capture/route.ts` | PayPal Rueckleitung nach Zahlung |
| `src/app/checkout/success/page.tsx` | Bestellbestaetigung (Cart leeren, Status anzeigen) |
| `src/lib/shippingConfig.ts` | Versandkosten-Berechnung |
| `src/components/checkout/TrustBadges.tsx` | Vertrauens-Badges im Checkout |
| `src/components/checkout/OrderSummary.tsx` | Bestelluebersicht im Checkout |

---

## 3. Payment Flows im Detail

### 3a. Vorkasse / Ueberweisung (BACS) — FUNKTIONIERT

```
Kunde waehlt "Vorkasse"
  → POST /api/checkout/create-order
  → WooCommerce Order erstellt (Status: "pending")
  → Order-Status auf "on-hold" gesetzt
  → Redirect zu /checkout/success?order={id}
  → Kunde ueberweist manuell
  → Shop-Admin setzt auf "processing" nach Zahlungseingang
```

**Kein externer Service noetig.** WooCommerce sendet automatisch E-Mails mit Bankdaten (muss in WooCommerce unter Einstellungen > Zahlungen > Bankueberweisung konfiguriert sein).

---

### 3b. Kreditkarte (Stripe) — KEYS FEHLEN

```
Kunde waehlt "Kreditkarte"
  → POST /api/checkout/create-order
  → WooCommerce Order erstellt (Status: "pending")
  → Stripe Checkout Session erstellt (src/lib/stripe.ts)
  → Redirect zu Stripe Checkout (gehostete Zahlungsseite)
  → Kunde gibt Kartendaten ein
  → Erfolg: Redirect zu /checkout/success?order={id}&session_id={stripe_session}
  → Abbruch: Redirect zu /checkout?cancelled=true&order={id}
  → Stripe Webhook POST /api/checkout/stripe/webhook
    → "checkout.session.completed" → Order-Status "processing"
    → "checkout.session.expired" → Order-Status "failed"
```

**Benoetigte Keys:**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

### 3c. Sofortueberweisung — KEYS FEHLEN

Identisch mit Stripe (wird ueber Stripe abgewickelt), nur mit `payment_method_types: ['sofort']` statt `['card']`. Benoetigt dieselben Stripe-Keys.

---

### 3d. PayPal — KEYS FEHLEN

```
Kunde waehlt "PayPal"
  → POST /api/checkout/create-order
  → WooCommerce Order erstellt (Status: "pending")
  → PayPal Order erstellt (src/lib/paypal.ts)
  → Redirect zu PayPal Checkout (paypal.com)
  → Kunde meldet sich an und bestaetigt
  → PayPal redirected zu /api/checkout/paypal/capture?order={id}&token={paypal_order_id}
  → Capture-Route:
    → PayPal Zahlung capturen
    → reference_id Verifizierung (Sicherheitscheck)
    → Order-Status "processing" + Notiz mit Transaction ID
    → Redirect zu /checkout/success?order={id}&paypal=success
  → Bei Fehler: Order-Status "failed", Redirect zu /checkout?error=payment_failed
```

**Benoetigte Keys:**
```
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

**Zusaetzlich optional:**
```
PAYPAL_MODE=sandbox    # oder "live" fuer Produktion (Default: sandbox)
```

---

## 4. Versandkosten-Logik

Implementiert in `src/lib/shippingConfig.ts`, verwendet im Checkout:

| Warenkorb-Inhalt | Warenwert | Versandkosten |
|------------------|-----------|---------------|
| Nur Muster | egal | **Kostenlos** |
| Nur Zubehoer (kein Boden) | egal | **4,99 EUR** |
| Mit Boden/Set | ab 999 EUR | **Kostenlos** |
| Mit Boden/Set | ab 500 EUR | **29,99 EUR** |
| Mit Boden/Set | unter 500 EUR | **59,99 EUR** |

Zusaetzlich: Abholung im Fachmarkt = immer kostenlos (shipping_method: "pickup").

---

## 5. Einrichtung Schritt fuer Schritt

### Schritt 1: Stripe einrichten

1. **Stripe-Account erstellen/einloggen:** https://dashboard.stripe.com
2. **Test-API-Keys holen:**
   - Dashboard → Developers → API Keys
   - `Publishable key` (beginnt mit `pk_test_`)
   - `Secret key` (beginnt mit `sk_test_`)
3. **Webhook einrichten:**
   - Dashboard → Developers → Webhooks → "Add endpoint"
   - URL: `https://bodenjaeger.de/api/checkout/stripe/webhook`
   - Events: `checkout.session.completed`, `checkout.session.expired`
   - Webhook Secret kopieren (beginnt mit `whsec_`)
4. **Keys in `.env.local` eintragen:**
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```
5. **Testen** mit Testkarte: `4242 4242 4242 4242` (Ablauf: beliebig in der Zukunft, CVC: beliebig)

**Fuer Produktion:** Live-Keys im Stripe Dashboard unter "Live mode" holen und in Vercel Env Vars eintragen.

---

### Schritt 2: PayPal einrichten

1. **PayPal Developer Account:** https://developer.paypal.com
2. **App erstellen:**
   - Dashboard → Apps & Credentials → "Create App"
   - App Name: "Bodenjaeger Shop"
   - Sandbox Client ID und Secret kopieren
3. **Keys in `.env.local` eintragen:**
   ```
   PAYPAL_CLIENT_ID=xxxxx
   PAYPAL_CLIENT_SECRET=xxxxx
   ```
4. **Testen** mit PayPal Sandbox-Accounts (werden automatisch erstellt unter Developer Dashboard → Sandbox → Accounts)

**Fuer Produktion:** Im PayPal Developer Dashboard auf "Live" umschalten, Live-Credentials kopieren und:
```
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=live_xxxxx
PAYPAL_CLIENT_SECRET=live_xxxxx
```

---

### Schritt 3: WooCommerce Bankdaten konfigurieren (Vorkasse)

1. WordPress Admin → WooCommerce → Einstellungen → Zahlungen
2. "Bankueberweisung (BACS)" aktivieren
3. Bankverbindung eintragen:
   - Kontoinhaber
   - IBAN
   - BIC
   - Bankname
   - Verwendungszweck-Hinweis
4. Speichern — WooCommerce fuegt die Bankdaten automatisch in "on-hold" E-Mails ein

---

### Schritt 4: NEXT_PUBLIC_SITE_URL anpassen

**Aktuell:** `http://localhost:3000` (Entwicklung)

**Fuer Produktion:** In `.env.local` und Vercel Env Vars aendern zu:
```
NEXT_PUBLIC_SITE_URL=https://bodenjaeger.de
```

**WICHTIG:** Alle Payment-Redirects (Stripe Success/Cancel, PayPal Return/Cancel) verwenden diese URL. Falsche URL = Zahlungsbestaetigung geht ins Leere.

---

### Schritt 5: Vercel Environment Variables synchronisieren

Alle Keys muessen auch in Vercel eingetragen werden:

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Folgende Variablen eintragen (Production):

```
NEXT_PUBLIC_WORDPRESS_URL=https://2025.bodenjaeger.de
WC_CONSUMER_KEY=ck_...
WC_CONSUMER_SECRET=cs_...
NEXT_PUBLIC_SITE_URL=https://bodenjaeger.de
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=live_...
PAYPAL_CLIENT_SECRET=live_...
PAYPAL_MODE=live
REVALIDATE_SECRET=...
```

---

## 6. Test-Checkliste

### Vorkasse
- [ ] Checkout abschliessen mit "Vorkasse"
- [ ] Order in WooCommerce pruefen (Status: "on-hold")
- [ ] Bestellbestaetigungs-E-Mail mit Bankdaten erhalten
- [ ] Success-Page zeigt Bestellnummer

### Stripe (Kreditkarte)
- [ ] Checkout abschliessen → Redirect zu Stripe
- [ ] Testkarte `4242 4242 4242 4242` eingeben
- [ ] Redirect zurueck zur Success-Page
- [ ] Order in WooCommerce pruefen (Status: "processing")
- [ ] Stripe Webhook-Log pruefen (Dashboard → Developers → Webhooks → Events)
- [ ] Abbruch testen: Stripe-Seite schliessen → Checkout mit `?cancelled=true`
- [ ] Fehlschlag testen: Karte `4000 0000 0000 0002` (declined)

### Stripe (Sofortueberweisung)
- [ ] Checkout mit "Sofortueberweisung" → Redirect zu Stripe SOFORT-Seite
- [ ] Testzahlung durchfuehren
- [ ] Success-Page + Order-Status pruefen

### PayPal
- [ ] Checkout abschliessen → Redirect zu PayPal
- [ ] Mit Sandbox-Account einloggen und zahlen
- [ ] Redirect zurueck ueber /api/checkout/paypal/capture
- [ ] Success-Page zeigt "PayPal Zahlung erfolgreich"
- [ ] Order in WooCommerce (Status: "processing", Notiz mit Transaction ID)
- [ ] Abbruch testen: PayPal-Seite abbrechen → Checkout mit `?cancelled=true`

### Versandkosten
- [ ] Nur Muster im Warenkorb → 0 EUR Versand
- [ ] Nur Zubehoer → 4,99 EUR
- [ ] Boden unter 500 EUR → 59,99 EUR
- [ ] Boden ab 500 EUR → 29,99 EUR
- [ ] Boden ab 999 EUR → 0 EUR
- [ ] Abholung im Markt → 0 EUR

---

## 7. Bekannte Einschraenkungen

1. **Kein Retry bei PayPal Capture-Fehler:** Wenn die PayPal Capture-Anfrage fehlschlaegt (z.B. Netzwerk-Timeout), wird die Order auf "failed" gesetzt. Es gibt keinen automatischen Retry.

2. **Stripe Webhook im Development:** Fuer lokales Testen muss `stripe listen --forward-to localhost:3000/api/checkout/stripe/webhook` laufen (Stripe CLI). Alternativ: ngrok Tunnel.

3. **Kundenprofil-Update ist fire-and-forget:** Wenn der eingeloggte Kunde bestellt, werden Billing/Shipping-Adressen im Hintergrund aktualisiert. Ein Fehler dabei wird still ignoriert.

4. **Keine Bestellbestaetigung per E-Mail aus Next.js:** E-Mails werden von WooCommerce gesendet (bei Status-Aenderung). Next.js sendet selbst keine E-Mails. Die WooCommerce E-Mail-Templates muessen im WordPress-Admin konfiguriert sein.

5. **Cart Drawer zeigt immer "Kostenlos" fuer Versand:** Die echten Versandkosten erscheinen erst im Checkout. Das ist beabsichtigt (siehe CLAUDE.md "Shipping Discrepancy").

---

## 8. Sicherheits-Features (bereits implementiert)

- **Order-Validierung:** Alle Pflichtfelder werden serverseitig geprueft (Billing, Shipping, Line Items, Payment Method)
- **E-Mail-Validierung:** Regex-Pruefung bei Order-Erstellung
- **Stripe Webhook-Signatur:** Jeder Webhook wird mit `stripe-signature` Header verifiziert
- **PayPal reference_id Check:** Nach PayPal-Capture wird geprueft ob die PayPal reference_id zur WooCommerce Order ID passt
- **Auth-Token-Pruefung:** Eingeloggte Kunden werden ueber JWT-Token identifiziert (optional, Gastbestellung moeglich)
- **Raw Body fuer Stripe:** Webhook-Route empfaengt unverarbeiteten Body (nicht JSON-geparsed) fuer korrekte Signatur-Verifizierung
