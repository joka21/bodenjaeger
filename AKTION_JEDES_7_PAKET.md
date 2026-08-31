# Aktion „Jedes 7. Paket gratis"

Start: **14.09.2026, 00:00 Uhr** (Europe/Berlin) — hinterlegt in `src/lib/promo.ts`.
Ende: **offen** (`endsAt: null`) → muss noch festgelegt werden, sonst läuft die
Aktion unbefristet weiter.

## Regel

- **Pro Warenkorb-Position** gezählt: 7 Pakete desselben Bodens → 1 gratis,
  14 → 2, 21 → 3 (`Math.floor`).
  4 Pakete Laminat + 3 Pakete Vinyl ergeben **kein** Gratis-Paket.
- Gilt nur für **Bodenprodukte**: Vinyl, Laminat, Parkett inkl. der
  Marken-Kategorien (COREtec, primeCORE, O.R.C.A.) — Liste in
  `AKTION_CATEGORY_SLUGS`.
- Gilt **auch für den Boden innerhalb eines Set-Angebots**. Der Wert eines
  Gratis-Pakets ist dann der Set-Paketpreis, nicht der UVP.
- Ausgenommen: Dämmung, Sockelleisten (im Set ohnehin kostenlos), Zubehör, Muster.
- Der Rabatt mindert den Warenwert **vor** der Versandstaffel. Eine Bestellung,
  die durch die Aktion unter 999 € fällt, bekommt also wieder Versandkosten.
- Stapelt mit Gutscheincodes: erst Aktionsrabatt, dann Gutschein.

## Vor dem Start testen (Kunde)

Die Aktion wird auf einem **Vercel-Preview-Deployment** dauerhaft
eingeschaltet, während `bodenjaeger.de` unberührt bleibt.

1. Branch pushen (z.B. `feat/aktion-jedes-7-paket`). Vercel legt automatisch
   eine Preview-URL an.
2. **Nichts weiter zu tun.** Der Vorschau-Modus erkennt Vercels eigene
   Umgebungskennung `VERCEL_ENV === 'preview'` und schaltet sich auf jedem
   Preview-Deployment selbst ein. Produktion (`production`) bleibt unberührt.
3. Preview-URL an den Kunden geben. Dort ist die Aktion sofort aktiv,
   unabhängig vom Datum.

Sollte der Vorschau-Modus auf dem Preview ausbleiben, ist in den
Projekt-Einstellungen „Automatically expose System Environment Variables"
abgeschaltet. Dann greift der manuelle Weg: Variable
`NEXT_PUBLIC_AKTION_FORCE` = `1`, Environment **nur „Preview"**, anschließend
Redeploy.

**Lokal testen:** `NEXT_PUBLIC_AKTION_FORCE=1` in `.env.local` und den
Dev-Server neu starten.

**Testfälle:**

| Warenkorb | Erwartung |
|---|---|
| 6 Pakete Laminat | kein Rabatt |
| 7 Pakete Laminat | 1 Paket gratis, Rabatt = 1 Paketpreis |
| 14 Pakete Laminat | 2 Pakete gratis |
| 4 Pakete Laminat + 3 Pakete Vinyl | kein Rabatt (getrennt gezählt) |
| Set-Angebot mit 7 Paketen Boden | 1 Paket gratis zum Set-Preis |
| 7 Pakete Dämmung, kein Boden | kein Rabatt |
| 7 Muster | kein Rabatt |

Zu prüfen sind Warenkorb-Drawer, `/cart`, `/checkout` und die entstandene
Bestellung im WooCommerce-Backoffice (die Positionen zeigen dort UVP als
Zwischensumme und den reduzierten Betrag als Total).

## Was den Live-Shop schützt

**Wichtig:** Preview und Produktion sprechen mit **demselben WooCommerce**
(`2025.bodenjaeger.de`). Es gibt kein Staging-Backend. Eine Testbestellung ist
darum eine echte Bestellung: echte Bestellnummer, Bestellbestätigung per Mail,
Billbee-Übernahme, Lagerbestand wird reduziert (Storno gibt ihn zurück).

Im Vorschau-Modus (Preview-Deployment oder gesetztes
`NEXT_PUBLIC_AKTION_FORCE=1`) greifen deshalb zwei Schutzmechanismen:

1. **Nur Vorkasse.** Stripe, Klarna, PayPal und der PayPal-Express-Button sind
   im Checkout ausgeblendet, die Zahlart startet auf Vorkasse. Ein Test kann
   damit keine echte Zahlung auslösen. Oben im Checkout steht ein gelber
   Hinweis „Vorschau-Modus — Testbestellung".
2. **Bestellung wird markiert.** Jede Bestellung aus dem Vorschau-Modus
   bekommt das Meta-Feld `_testbestellung = yes` und die Bestellnotiz
   „⚠️ TESTBESTELLUNG aus dem Vorschau-Deployment … bitte stornieren."
   Damit ist sie in WooCommerce und Billbee sofort erkennbar.

Beides hängt allein am Vorschau-Modus, also an `isAktionForced()` in
`promo.ts`. In Produktion ist `VERCEL_ENV === 'production'` und die Variable
nicht gesetzt — dort ändert sich nichts, alle Zahlarten bleiben verfügbar.

Nebenwirkung, bewusst in Kauf genommen: **jedes** Preview-Deployment zeigt jetzt
die Aktion und lässt nur Vorkasse zu — auch Previews anderer Branches. Weil
Previews auf denselben Live-Shop und potenziell auf Live-Zahlungskeys zeigen,
ist das die sicherere Voreinstellung. Wer auf einem Preview eine echte
Stripe-Zahlung testen muss, muss diese Sperre in `checkout/page.tsx`
(`isVorschauModus`) vorübergehend aushängen.

Trotzdem gilt: Testbestellung mit erkennbarem Namen (z.B. „TEST AKTION")
aufgeben, danach in WooCommerce stornieren und in Billbee prüfen.
Wer regelmäßig mit Bestellungen testen will, braucht ein Staging-WordPress und
ein darauf zeigendes `NEXT_PUBLIC_WORDPRESS_URL` im Preview.

## Live-Gang am 14.09.

Nichts zu tun. In Produktion ist `NEXT_PUBLIC_AKTION_FORCE` nicht gesetzt, die
Aktion schaltet sich über `PAKET_AKTION.startsAt` selbst ein. Voraussetzung ist
nur, dass der Branch bis dahin auf `main` gemerged und deployt ist.

Termin verschieben: `startsAt` in `src/lib/promo.ts` ändern und neu deployen.
Beim Wechsel in die Winterzeit (ab 25.10.) lautet der Offset `+01:00`.

## Wo der Rabatt auftaucht

| Ort | Datei |
|---|---|
| Regel, Laufzeit, Berechnung (einzige Quelle) | `src/lib/promo.ts` |
| Warenkorb-Drawer | `src/lib/cart-utils.ts` → `calculateCartData`, `src/components/cart/CartFooter.tsx` |
| Warenkorb-Seite | `src/app/cart/page.tsx` |
| Checkout-Summe | `src/components/checkout/OrderSummary.tsx` |
| WooCommerce-Order (Standard-Checkout) | `src/app/checkout/page.tsx` — reduziert `line_items.total`, `subtotal` bleibt voll |
| WooCommerce-Order (PayPal Express) | `src/app/api/checkout/paypal/express-capture/route.ts` — negative `fee_line` |
| PayPal-Betrag (Express) | `src/app/api/checkout/paypal/express-create/route.ts` |
| Vorschau-Schutz (nur Vorkasse, Hinweisbox) | `src/app/checkout/page.tsx` → `isVorschauModus` |
| Test-Markierung der Bestellung | `src/app/api/checkout/create-order/route.ts` → `isTestOrder` |

## Noch nicht enthalten

- **Kein Hinweis auf der Produktseite.** Der Kunde sieht die Aktion erst im
  Warenkorb. `getPackagesUntilNextFree()` in `promo.ts` ist für einen Hinweis
  wie „Noch 2 Pakete bis zum Gratis-Paket" vorbereitet, aber nirgends
  eingebunden.
- **Kein Werbebanner** (Header/Startseite).
- **Keine serverseitige Nachprüfung.** Der Rabatt wird im Browser berechnet und
  mit den Line-Item-Totals gesendet — wie die Preise im Checkout generell.
  Ein manipulierter Browser könnte sich einen höheren Rabatt geben. Das ist
  eine bestehende Eigenschaft des Checkouts, keine neue Lücke.
