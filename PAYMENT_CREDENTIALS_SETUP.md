# 🔑 Payment Credentials Setup - Schnellanleitung

Diese Anleitung zeigt dir, wo du die fehlenden Payment-Credentials für `.env.local` herbekommst.

---

## ✅ Bereits konfiguriert:

- ✅ WooCommerce API Keys
- ✅ Site URL (localhost:3000)
- ✅ Revalidate Secret

---

## 🔴 FEHLT NOCH: Stripe Credentials

### Schritt 1: Stripe Account erstellen/einloggen
👉 **https://dashboard.stripe.com/register**

### Schritt 2: Test-API-Keys holen
1. Gehe zu: **Entwickler → API-Schlüssel**
2. Stelle sicher, dass **"Testmodus"** aktiviert ist (Toggle oben rechts)
3. Kopiere die Keys:
   - **Publishable Key** (beginnt mit `pk_test_...`)
   - **Secret Key** (beginnt mit `sk_test_...`) - **GEHEIM HALTEN!**

### Schritt 3: Webhook Secret erstellen
1. Gehe zu: **Entwickler → Webhooks**
2. Klicke **"Endpunkt hinzufügen"**
3. Webhook URL eingeben:
   - **Entwicklung:** `http://localhost:3000/api/checkout/stripe/webhook`
   - **Produktion:** `https://bodenjaeger.vercel.app/api/checkout/stripe/webhook`
4. Events auswählen:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Webhook erstellen
6. Kopiere den **Signierungsschlüssel** (beginnt mit `whsec_...`)

### Schritt 4: In .env.local eintragen
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC...
STRIPE_SECRET_KEY=sk_test_51DEF...
STRIPE_WEBHOOK_SECRET=whsec_GHI...
```

### Schritt 5: Dev-Server neu starten
```bash
# Strg+C um Server zu stoppen
npm run dev
```

---

## 🟡 FEHLT NOCH: PayPal Credentials

### Schritt 1: PayPal Developer Account
👉 **https://developer.paypal.com/dashboard/**

### Schritt 2: Sandbox App erstellen
1. Gehe zu: **Dashboard → My Apps & Credentials**
2. Stelle sicher, dass **"Sandbox"** ausgewählt ist
3. Klicke **"Create App"**
4. App-Name eingeben (z.B. "Bodenjäger Dev")
5. App erstellen

### Schritt 3: Credentials kopieren
1. Klicke auf deine neue App
2. Kopiere:
   - **Client ID** (öffentlich)
   - **Secret** (geheim) - **GEHEIM HALTEN!**

### Schritt 4: In .env.local eintragen
```env
PAYPAL_CLIENT_ID=AWxyz123...
PAYPAL_CLIENT_SECRET=ELabc456...
```

### Schritt 5: Dev-Server neu starten
```bash
# Strg+C um Server zu stoppen
npm run dev
```

---

## 🧪 Testen

### Stripe Test-Kreditkarten:
```
✅ Erfolg:     4242 4242 4242 4242
❌ Abgelehnt:  4000 0000 0000 9995
🔒 3D Secure:  4000 0025 0000 3155
```
- **Ablaufdatum:** Beliebig in der Zukunft (z.B. 12/34)
- **CVC:** Beliebig 3 Ziffern (z.B. 123)
- **PLZ:** Beliebig 5 Ziffern (z.B. 12345)

### PayPal Sandbox Test-Accounts:
- Gehe zu: **Sandbox → Accounts**
- Verwende vorgefertigte Test-Accounts:
  - **Personal:** Käufer-Account
  - **Business:** Verkäufer-Account

---

## 🚀 Für Produktion (später):

### Stripe Live-Mode aktivieren:
1. Stripe Dashboard → Toggle auf **"Live-Modus"**
2. Live API Keys kopieren (beginnen mit `pk_live_...` und `sk_live_...`)
3. Neuen Webhook für Produktions-URL erstellen
4. In `.env.local` (auf Vercel) die Live-Keys eintragen

### PayPal Live-Mode aktivieren:
1. PayPal Developer Dashboard → **"Live"** auswählen
2. Live App erstellen
3. Live Credentials kopieren
4. In `.env.local` (auf Vercel) die Live-Keys eintragen

---

## 📝 Checkliste

- [ ] Stripe Test-Keys erstellt
- [ ] Stripe Webhook erstellt und Secret kopiert
- [ ] PayPal Sandbox App erstellt
- [ ] PayPal Credentials kopiert
- [ ] Alle Keys in `.env.local` eingetragen
- [ ] Dev-Server neugestartet
- [ ] Test-Bestellung mit Stripe durchgeführt
- [ ] Test-Bestellung mit PayPal durchgeführt

---

## ⚠️ WICHTIG: Sicherheit

1. **NIE** die `.env.local` Datei in Git committen!
2. **NIE** Secret Keys öffentlich teilen!
3. Für Produktion separate Live-Keys verwenden!
4. Webhook Secrets regelmäßig rotieren!

---

## 🆘 Hilfe

**Stripe Dokumentation:** https://stripe.com/docs/payments/checkout
**PayPal Dokumentation:** https://developer.paypal.com/docs/checkout/

**Oder besuche:** `/payment-setup` im Browser für weitere Details
