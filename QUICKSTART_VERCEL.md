# 🚀 Vercel Quickstart - Bodenjäger

**Zeit: ~15 Minuten** | [Vollständige Anleitung: VERCEL_SETUP.md](./VERCEL_SETUP.md)

---

## Schritt 1: Stripe Keys holen (5 Min)

1. **Gehe zu:** https://dashboard.stripe.com/apikeys
2. **Toggle:** "Test mode" → **"Live mode"**
3. **Kopiere:**
   - ✅ Publishable key (`pk_live_...`)
   - ✅ Secret key (`sk_live_...`) - Klick "Reveal"

---

## Schritt 2: Vercel Environment Variables (5 Min)

**Gehe zu:** https://vercel.com/dashboard → Dein Projekt → Settings → Environment Variables

### Pflicht-Variablen eintragen:

| Variable | Wert | Env |
|----------|------|-----|
| `NEXT_PUBLIC_WORDPRESS_URL` | `https://plan-dein-ding.de` | Alle |
| `WC_CONSUMER_KEY` | `ck_8fd49c60d0ba20673159fe2d1ff1c64dd30db676` | Alle |
| `WC_CONSUMER_SECRET` | `cs_674a4aab966043b0552766780d964f1d420dcfd2` | Alle |
| `NEXT_PUBLIC_SITE_URL` | `https://bodenjaeger.vercel.app` | Production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (aus Schritt 1) | Production |
| `STRIPE_SECRET_KEY` | `sk_live_...` (aus Schritt 1) | Production |
| `REVALIDATE_SECRET` | `T3njoka21!` | Alle |

⚠️ **WICHTIG:** Für jede Variable "Environment" = **"Production"** auswählen!

> `STRIPE_WEBHOOK_SECRET` kommt später (nach erstem Deployment)

---

## Schritt 3: Deployment (2 Min)

### Option A: Git Push (empfohlen)
```bash
git add .
git commit -m "Ready for Vercel production"
git push origin main
```
→ Vercel deployed automatisch

### Option B: Vercel CLI
```bash
vercel --prod
```

**Warte auf:** ✅ Deployment erfolgreich

---

## Schritt 4: Stripe Webhook (3 Min)

**Nach** erfolgreichem Deployment:

1. **Gehe zu:** https://dashboard.stripe.com/webhooks
2. **Live Mode aktivieren** (Toggle oben rechts)
3. **Klick:** "Add endpoint"
4. **Eingabe:**
   - URL: `https://bodenjaeger.vercel.app/api/checkout/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
5. **Klick:** "Add endpoint"
6. **Kopiere:** Signing secret (`whsec_...`)
7. **Zurück zu Vercel Dashboard:**
   - Environment Variables
   - Neue Variable hinzufügen:
     - Name: `STRIPE_WEBHOOK_SECRET`
     - Value: `whsec_...` (aus Schritt 6)
     - Environment: Production
8. **Redeploy:** `vercel --prod --force` ODER im Dashboard: "Redeploy"

---

## ✅ Fertig! Teste jetzt:

### 1. WooCommerce API Test
```
https://bodenjaeger.vercel.app/api/test-wc-auth
```
**Erwartung:** `"success": true`

### 2. Shop öffnen
```
https://bodenjaeger.vercel.app
```
**Check:** Produkte werden angezeigt

### 3. Test-Bestellung
1. Produkt in Warenkorb
2. Checkout
3. Stripe Test Card: `4242 4242 4242 4242`
4. ✅ Bestellung in WooCommerce Admin sichtbar

---

## 🆘 Probleme?

| Problem | Lösung |
|---------|--------|
| "Environment variable not defined" | Vercel ENV Vars prüfen → Redeploy |
| WooCommerce 401 Error | WC Keys prüfen (Schritt 2) |
| Stripe Webhook 403 | STRIPE_WEBHOOK_SECRET prüfen (Schritt 4) |
| Bilder laden nicht | `next.config.ts` prüfen (sollte OK sein) |

**Vollständiges Troubleshooting:** [VERCEL_SETUP.md](./VERCEL_SETUP.md#11-troubleshooting)

---

## 🎯 Nächste Schritte

- [ ] PayPal hinzufügen (optional): [VERCEL_SETUP.md](./VERCEL_SETUP.md#2-paypal-setup)
- [ ] Custom Domain verbinden (z.B. bodenjaeger.de): [VERCEL_SETUP.md](./VERCEL_SETUP.md#10-domains--custom-domain-setup)
- [ ] Vercel Analytics aktivieren
- [ ] Google Analytics integrieren

---

**Alles bereit? Dein Shop ist live! 🎉**

Bei Fragen: Siehe [VERCEL_SETUP.md](./VERCEL_SETUP.md) für Details.
