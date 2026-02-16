# Vercel Deployment Setup Guide

> **Bodenjäger E-Commerce Shop - Produktionsdeployment auf Vercel**

---

## 🚀 Quick Start Checklist

- [ ] Stripe Keys erstellen (Live Mode)
- [ ] PayPal Credentials erstellen (Live Mode)
- [ ] Environment Variables in Vercel Dashboard eintragen
- [ ] Erste Deployment durchführen
- [ ] Stripe Webhook konfigurieren
- [ ] WooCommerce API testen
- [ ] Test-Bestellung durchführen

---

## 1. Stripe Setup (KRITISCH für Zahlungen)

### 1.1 Stripe Account & API Keys

1. **Gehe zu Stripe Dashboard:**
   - https://dashboard.stripe.com/register (Account erstellen falls nötig)
   - Account verifizieren (Geschäftsdaten, Bankverbindung)

2. **API Keys abrufen:**
   - Navigiere zu: https://dashboard.stripe.com/apikeys
   - **WICHTIG:** Toggle von "Test mode" auf **"Live mode"**
   - Kopiere folgende Keys:
     - `Publishable key` (beginnt mit `pk_live_...`)
     - `Secret key` (beginnt mit `sk_live_...`) - erst nach Klick auf "Reveal live key"

3. **Webhook Secret (später):**
   - Wird nach erstem Vercel Deployment konfiguriert
   - Siehe Abschnitt 4 unten

### 1.2 Test Keys (für lokale Entwicklung)

Falls noch nicht geschehen, für lokale `.env.local`:
- Toggle zu "Test mode" in Stripe Dashboard
- Kopiere Test Keys (beginnen mit `pk_test_...` und `sk_test_...`)

---

## 2. PayPal Setup (OPTIONAL aber empfohlen)

### 2.1 PayPal Developer Account

1. **Gehe zu PayPal Developer Portal:**
   - https://developer.paypal.com/dashboard/
   - Login mit bestehendem PayPal Account

2. **Live App erstellen:**
   - Navigiere zu "My Apps & Credentials"
   - Tab: **"Live"** (nicht Sandbox!)
   - Klicke "Create App"
   - App Name: z.B. "Bodenjäger Shop"
   - App Type: "Merchant"

3. **Credentials kopieren:**
   - Nach App-Erstellung siehst du:
     - `Client ID` (beginnt meist mit `A...`)
     - `Secret` (erst nach Klick auf "Show" sichtbar)

### 2.2 PayPal Webhook (später)

Nach Deployment:
- Webhook URL: `https://bodenjaeger.vercel.app/api/checkout/paypal/webhook`
- Events: `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`

---

## 3. Vercel Environment Variables Setup

### 3.1 Vercel Dashboard öffnen

1. Gehe zu: https://vercel.com/dashboard
2. Wähle dein Projekt: **bodenjäger** (oder erstelle neues Projekt)
3. Navigiere zu: **Settings → Environment Variables**

### 3.2 Environment Variables eintragen

**WICHTIG:** Alle Variablen müssen für **"Production"** Environment eingetragen werden!

#### WordPress & WooCommerce Backend

```bash
# Variable Name: NEXT_PUBLIC_WORDPRESS_URL
Value: https://plan-dein-ding.de
Environment: Production, Preview, Development

# Variable Name: WC_CONSUMER_KEY
Value: [DEIN_WC_CONSUMER_KEY]
Environment: Production, Preview, Development

# Variable Name: WC_CONSUMER_SECRET
Value: [DEIN_WC_CONSUMER_SECRET]
Environment: Production, Preview, Development
```

#### Site Configuration

```bash
# Variable Name: NEXT_PUBLIC_SITE_URL
Value: https://bodenjaeger.vercel.app
Environment: Production

# FÜR PREVIEW/DEVELOPMENT:
Value: https://bodenjaeger-git-main-dein-username.vercel.app
Environment: Preview, Development
```

⚠️ **WICHTIG:** Ersetze `bodenjaeger.vercel.app` mit deiner tatsächlichen Vercel URL!

#### Stripe Payment Gateway

```bash
# Variable Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_live_DEIN_STRIPE_PUBLISHABLE_KEY  # Aus Schritt 1.1
Environment: Production

# Variable Name: STRIPE_SECRET_KEY
Value: sk_live_DEIN_STRIPE_SECRET_KEY  # Aus Schritt 1.1
Environment: Production

# Variable Name: STRIPE_WEBHOOK_SECRET
Value: whsec_...  # Wird nach Webhook Setup ausgefüllt (siehe Schritt 4)
Environment: Production
```

#### PayPal Payment Gateway (Optional)

```bash
# Variable Name: PAYPAL_CLIENT_ID
Value: DEIN_PAYPAL_CLIENT_ID  # Aus Schritt 2.1
Environment: Production

# Variable Name: PAYPAL_CLIENT_SECRET
Value: DEIN_PAYPAL_SECRET  # Aus Schritt 2.1
Environment: Production
```

#### Cache & Security

```bash
# Variable Name: REVALIDATE_SECRET
Value: [DEIN_REVALIDATE_SECRET]
Environment: Production, Preview, Development
```

#### Vercel KV (Optional - für Rate Limiting)

```bash
# Variable Name: KV_REST_API_URL
Value: [Wird automatisch von Vercel gesetzt wenn KV Storage hinzugefügt]
Environment: Production

# Variable Name: KV_REST_API_TOKEN
Value: [Wird automatisch von Vercel gesetzt]
Environment: Production
```

**Hinweis:** Vercel KV muss separat über "Storage" Tab aktiviert werden.

---

## 4. Erstes Deployment

### 4.1 Deployment durchführen

**Option A: Git Push (empfohlen)**
```bash
git add .
git commit -m "Configure for Vercel production deployment"
git push origin main
```
→ Vercel deployed automatisch bei jedem Push auf `main` Branch

**Option B: Vercel CLI**
```bash
npm install -g vercel
vercel login
vercel --prod
```

### 4.2 Deployment URL prüfen

Nach erfolgreichem Deployment:
1. Notiere die Production URL (z.B. `https://bodenjaeger.vercel.app`)
2. Öffne die URL und teste:
   - Startseite lädt
   - Produkte werden angezeigt (mit Bildern)
   - Produktdetailseite funktioniert

### 4.3 WooCommerce API testen

Teste ob die WooCommerce Verbindung funktioniert:
```bash
https://bodenjaeger.vercel.app/api/test-wc-auth
```

✅ **Erwartetes Ergebnis:**
```json
{
  "success": true,
  "message": "All WooCommerce API tests passed!",
  "results": {
    "baseUrl": "https://plan-dein-ding.de",
    "credentialsSet": true,
    "tests": {
      "systemStatus": { "success": true, "status": 200 },
      "listOrders": { "success": true, "status": 200 },
      "listProducts": { "success": true, "status": 200 }
    }
  }
}
```

❌ **Falls Fehler:**
- Überprüfe WC_CONSUMER_KEY und WC_CONSUMER_SECRET in Vercel Dashboard
- Stelle sicher, dass Keys für "Production" Environment gesetzt sind
- Redeploy erzwingen: `vercel --prod --force`

---

## 5. Stripe Webhook konfigurieren

⚠️ **WICHTIG:** Dieser Schritt muss nach dem ersten Deployment durchgeführt werden!

### 5.1 Webhook in Stripe erstellen

1. **Gehe zu Stripe Dashboard:**
   - https://dashboard.stripe.com/webhooks
   - **Stelle sicher:** Du bist im **"Live mode"** (nicht Test mode)

2. **Webhook Endpoint hinzufügen:**
   - Klicke "Add endpoint"
   - Endpoint URL: `https://bodenjaeger.vercel.app/api/checkout/stripe/webhook`
   - Description: "Bodenjäger Payment Confirmations"

3. **Events auswählen:**
   - Klicke "Select events"
   - Wähle folgende Events:
     - ✅ `checkout.session.completed`
     - ✅ `payment_intent.succeeded`
     - ✅ `payment_intent.payment_failed`
   - Klicke "Add events"

4. **Webhook erstellen:**
   - Klicke "Add endpoint"
   - **WICHTIG:** Kopiere sofort den **Signing Secret** (beginnt mit `whsec_...`)

### 5.2 Webhook Secret in Vercel eintragen

1. Gehe zurück zu Vercel Dashboard
2. Settings → Environment Variables
3. Suche `STRIPE_WEBHOOK_SECRET` (sollte bereits existieren aber leer sein)
4. Klicke "Edit"
5. Füge den Signing Secret ein: `whsec_...`
6. Environment: **Production**
7. Save

### 5.3 Redeploy erzwingen

```bash
# Im Terminal:
vercel --prod --force

# ODER in Vercel Dashboard:
# Deployments Tab → Klicke "..." neben letztem Deployment → "Redeploy"
```

### 5.4 Webhook testen

1. Gehe zu Stripe Dashboard → Webhooks
2. Klicke auf deinen neu erstellten Webhook
3. Tab "Testing"
4. Klicke "Send test webhook"
5. Wähle `checkout.session.completed`
6. ✅ **Erwartung:** Status 200, keine Fehler

---

## 6. PayPal Webhook konfigurieren (Optional)

Falls PayPal aktiviert:

1. **PayPal Developer Dashboard:**
   - https://developer.paypal.com/dashboard/applications/live
   - Wähle deine App

2. **Webhook hinzufügen:**
   - Scrolle zu "Webhooks"
   - Webhook URL: `https://bodenjaeger.vercel.app/api/checkout/paypal/webhook`
   - Event types:
     - ✅ `PAYMENT.CAPTURE.COMPLETED`
     - ✅ `PAYMENT.CAPTURE.DENIED`
     - ✅ `CHECKOUT.ORDER.APPROVED`

3. **Save & Test:**
   - Simulator verwenden zum Testen

---

## 7. Finale Tests

### 7.1 Test-Bestellung durchführen

1. **Produkt auswählen:**
   - Gehe zu `https://bodenjaeger.vercel.app`
   - Wähle ein Produkt (z.B. aus Sale-Kategorie)
   - Konfiguriere Set-Angebot (m² eingeben)

2. **In den Warenkorb:**
   - Klicke "In den Warenkorb"
   - Überprüfe Warenkorbseite: `/cart`
   - Preise korrekt?

3. **Checkout:**
   - Klicke "Zur Kasse"
   - Fülle alle Pflichtfelder aus
   - Wähle Zahlungsmethode: **Stripe (Kreditkarte)**

4. **Test-Zahlung mit echten Stripe Test Cards:**

   ⚠️ **WICHTIG:** Für Live-Modus solltest du eine echte Kreditkarte verwenden!

   Für Test-Modus (falls du zuerst testen willst):
   - Karte: `4242 4242 4242 4242`
   - Ablaufdatum: beliebiges zukünftiges Datum (z.B. 12/30)
   - CVC: beliebige 3 Ziffern (z.B. 123)
   - PLZ: beliebig (z.B. 12345)

5. **Bestellung verifizieren:**
   - Success Page sollte erscheinen: `/checkout/success?order_id=...`
   - E-Mail Benachrichtigung sollte ankommen
   - **WooCommerce Admin prüfen:**
     - https://plan-dein-ding.de/wp-admin/edit.php?post_type=shop_order
     - Neue Bestellung sollte vorhanden sein
     - Status: "Processing" (bei erfolgreicher Zahlung)

### 7.2 Image Loading testen

1. Gehe zu verschiedenen Produktseiten
2. ✅ Überprüfe:
   - Produktbilder laden von `plan-dein-ding.de`
   - Next.js Image Optimization funktioniert (WebP/AVIF)
   - Keine 403/404 Fehler in Browser Console

### 7.3 API Performance

Öffne Browser Developer Tools (F12) → Network Tab:

1. **Startseite laden:**
   - API Calls zu `/api/products?category=sale` sollten < 2s sein
   - Bestseller-Daten laden schnell

2. **Produktseite:**
   - SSR sollte Produkt-Daten liefern (kein Loading-Spinner)
   - Bilder sollten lazy-load

---

## 8. Monitoring & Logs

### 8.1 Vercel Dashboard Logs

**Real-time Logs ansehen:**
1. Vercel Dashboard → Dein Projekt
2. Tab: **Logs**
3. Filter: "Production"

**Häufige Log-Meldungen:**
- `✓ Compiled` - Erfolgreiche Page-Kompilierung
- `POST /api/checkout/create-order` - Bestellungen
- `POST /api/checkout/stripe/webhook` - Stripe Webhooks

### 8.2 Error Tracking (Optional)

Für Production empfohlen:
- **Sentry**: https://sentry.io/signup/
- **LogRocket**: https://logrocket.com/

Integration:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### 8.3 Vercel Analytics

1. Vercel Dashboard → Dein Projekt
2. Tab: **Analytics**
3. Aktiviere "Enable Analytics"
4. Überwache:
   - Page Load Times
   - Core Web Vitals
   - Top Pages by Traffic

---

## 9. Security Checklist

### 9.1 Environment Variables Audit

✅ **Überprüfe:**
- [ ] Keine `.env.local` Datei im Git Repository
- [ ] `.gitignore` enthält `.env*` Pattern
- [ ] Stripe Secret Keys nur in Vercel Dashboard (nicht in Code)
- [ ] WooCommerce Keys haben minimale Permissions (Read/Write Orders + Products only)

### 9.2 HTTPS & SSL

✅ **Vercel handhabt automatisch:**
- SSL Zertifikate für alle Domains
- Automatisches HTTP → HTTPS Redirect
- A+ Rating auf SSL Labs

### 9.3 Rate Limiting (Optional mit Vercel KV)

Falls aktiviert:
```typescript
// src/middleware.ts (erstellen falls noch nicht vorhanden)
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});
```

---

## 10. Domains & Custom Domain Setup

### 10.1 Custom Domain hinzufügen (z.B. bodenjaeger.de)

1. **Vercel Dashboard:**
   - Settings → Domains
   - Klicke "Add Domain"
   - Eingabe: `bodenjaeger.de` und `www.bodenjaeger.de`

2. **DNS Konfiguration:**

   Bei deinem Domain-Registrar (z.B. IONOS, Namecheap, etc.):

   **A Record:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21  # Vercel IP
   TTL: 3600
   ```

   **CNAME Record:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

3. **Environment Variable Update:**

   Nach Domain-Aktivierung:
   - Vercel Dashboard → Settings → Environment Variables
   - `NEXT_PUBLIC_SITE_URL` ändern zu: `https://bodenjaeger.de`
   - Redeploy

4. **Stripe & PayPal Webhooks updaten:**
   - Neue Webhook URLs mit Custom Domain erstellen
   - Alte `.vercel.app` Webhooks deaktivieren oder löschen

---

## 11. Troubleshooting

### Problem: "Environment variable is not defined"

**Symptome:**
- Fehler in Vercel Logs: `NEXT_PUBLIC_WORDPRESS_URL is not defined`

**Lösung:**
1. Vercel Dashboard → Settings → Environment Variables
2. Überprüfe, dass Variable für **"Production"** Environment gesetzt ist
3. Redeploy: `vercel --prod --force`

### Problem: WooCommerce API 401 Unauthorized

**Symptome:**
- `/api/test-wc-auth` zeigt `"success": false, "status": 401`

**Lösung:**
1. Überprüfe WC_CONSUMER_KEY und WC_CONSUMER_SECRET
2. In WooCommerce Admin (plan-dein-ding.de):
   - WooCommerce → Settings → Advanced → REST API
   - Regeneriere Keys falls nötig
3. Update Keys in Vercel Dashboard
4. Redeploy

### Problem: Stripe Webhook 403 Forbidden

**Symptome:**
- Stripe Dashboard zeigt Webhook Fehler
- Zahlungen werden nicht bestätigt

**Lösung:**
1. Überprüfe STRIPE_WEBHOOK_SECRET in Vercel
2. Webhook URL korrekt? `https://deine-domain.com/api/checkout/stripe/webhook`
3. Teste Webhook in Stripe Dashboard (Send test webhook)
4. Check Vercel Logs für Details

### Problem: Bilder laden nicht (403 Errors)

**Symptome:**
- Produktbilder zeigen Platzhalter
- Browser Console: `403 Forbidden` für Bilder von plan-dein-ding.de

**Lösung:**
1. Überprüfe `next.config.ts` → `remotePatterns` enthält `plan-dein-ding.de`
2. WordPress Hotlink Protection deaktivieren (falls aktiviert)
3. Cloudflare/CDN Settings überprüfen

### Problem: Build Fehler auf Vercel

**Symptome:**
- Deployment schlägt fehl mit TypeScript Errors

**Lösung:**
1. Lokal builden: `npm run build`
2. Fehler fixen
3. Commit & Push
4. Falls weiterhin Fehler: Check Node.js Version in Vercel Settings

---

## 12. Backup & Recovery Plan

### 12.1 Environment Variables Backup

**WICHTIG:** Sichere alle ENV Vars lokal (verschlüsselt):

```bash
# Erstelle backup-env.txt (NICHT committen!)
# Vercel Dashboard → Settings → Environment Variables
# Kopiere alle Werte in verschlüsseltes Dokument (z.B. 1Password, Bitwarden)
```

### 12.2 WooCommerce Order Backup

Regelmäßiges Backup in WordPress:
- Plugin: "UpdraftPlus" oder "BackWPup"
- Frequenz: Täglich
- Speicherort: Google Drive, Dropbox, oder S3

### 12.3 Disaster Recovery

Falls Vercel Projekt gelöscht wird:

1. **Neues Vercel Projekt erstellen:**
   - Import from GitHub Repository
   - Wähle `bodenjaeger` Repo

2. **Environment Variables wiederherstellen:**
   - Aus verschlüsseltem Backup kopieren
   - Alle Variablen neu eintragen

3. **Webhooks neu konfigurieren:**
   - Stripe Webhooks mit neuer URL
   - PayPal Webhooks mit neuer URL

4. **DNS Update:**
   - Falls Custom Domain: neue Vercel DNS Records

---

## 13. Post-Launch Checklist

Nach erfolgreichem Launch:

### Week 1:
- [ ] Täglich Logs überprüfen (Vercel Dashboard)
- [ ] Test-Bestellungen durchführen
- [ ] E-Mail Zustellung verifizieren
- [ ] Performance Monitoring aktivieren (Vercel Analytics)

### Week 2-4:
- [ ] Google Search Console einrichten
- [ ] Google Analytics / Matomo hinzufügen
- [ ] Conversion Tracking (Stripe → Google Analytics)
- [ ] User Feedback sammeln

### Ongoing:
- [ ] Wöchentliche Backup-Checks
- [ ] Monatliche Security Audits
- [ ] Stripe Dashboard für fehlgeschlagene Zahlungen checken
- [ ] WooCommerce Orders vs. Stripe Payments abgleichen

---

## 14. Support & Resources

### Official Docs:
- **Vercel**: https://vercel.com/docs
- **Next.js 15**: https://nextjs.org/docs
- **Stripe**: https://docs.stripe.com/
- **WooCommerce API**: https://woocommerce.github.io/woocommerce-rest-api-docs/

### Community:
- **Next.js Discord**: https://nextjs.org/discord
- **Vercel Support**: https://vercel.com/support

### Emergency Contacts:
- **Stripe Support**: https://support.stripe.com/
- **Vercel Status Page**: https://www.vercel-status.com/

---

## Zusammenfassung der erforderlichen Keys

| Service | Key Name | Wo zu finden | Kritisch? |
|---------|----------|--------------|-----------|
| WordPress | `NEXT_PUBLIC_WORDPRESS_URL` | plan-dein-ding.de | ✅ JA |
| WooCommerce | `WC_CONSUMER_KEY` | WP Admin → WooCommerce → REST API | ✅ JA |
| WooCommerce | `WC_CONSUMER_SECRET` | WP Admin → WooCommerce → REST API | ✅ JA |
| Stripe | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | dashboard.stripe.com/apikeys | ✅ JA |
| Stripe | `STRIPE_SECRET_KEY` | dashboard.stripe.com/apikeys | ✅ JA |
| Stripe | `STRIPE_WEBHOOK_SECRET` | Nach Webhook Erstellung | ✅ JA |
| PayPal | `PAYPAL_CLIENT_ID` | developer.paypal.com | ⚠️ Optional |
| PayPal | `PAYPAL_CLIENT_SECRET` | developer.paypal.com | ⚠️ Optional |
| Security | `REVALIDATE_SECRET` | Selbst gewählt | ✅ JA |
| Site | `NEXT_PUBLIC_SITE_URL` | Deine Vercel URL | ✅ JA |

---

**Viel Erfolg mit deinem Bodenjäger E-Commerce Launch! 🚀**

Bei Fragen: siehe `/api/test-wc-auth` für API Debugging.
