# Gutschein-System — Setup & Test

Dieses Dokument beschreibt, wie Coupons im WooCommerce-Backend angelegt werden, damit das Frontend-Coupon-System (eingeführt mit der Phase-Plan-PR) korrekt arbeitet. Ohne den **Muster-Ausschluss** weist der `/api/checkout/validate-coupon`-Endpoint den Code als `CONFIG_ERROR` zurück.

## 1. Was das System tut

- Kunden geben einen Code in der `OrderSummary` ein (rechte Spalte im Checkout, klappbar).
- Der Code wird per `POST /api/checkout/validate-coupon` gegen WooCommerce validiert (Rate-Limit: 10 Versuche/Min/IP).
- Bei valid wird der Rabatt im Frontend angezeigt; bei Order-Submit wird der Code als `coupon_lines` an WC weitergereicht.
- **WooCommerce ist Source of Truth.** Der `discount_total` der Order, der Versand und das `order.total` kommen direkt von WC zurück — Stripe/PayPal werden mit diesem authoritativen Wert befüttert.

Out of Scope: Auto-Apply via URL, mehrere Coupons gleichzeitig, BOGO, Versand-Rabatt jenseits `free_shipping`, „Meine Gutscheine" im Kundenkonto, localStorage-Persistenz.

## 2. Voraussetzungen im WC-Backend

### 2.1 Coupons aktivieren

`WooCommerce → Einstellungen → Allgemein → Gutscheine aktivieren` muss aktiv sein. Verifiziert via `GET /wp-json/wc/v3/settings/general/woocommerce_enable_coupons` (`value: "yes"`).

### 2.2 Muster-Kategorie

Die Kategorie „Muster" (ID `66`, Slug `muster`) muss existieren. Sie wird zentral als `SAMPLE_CATEGORY_ID` in `src/lib/sampleUtils.ts` referenziert.

## 3. Coupon im WC-Backend anlegen

`WooCommerce → Marketing → Gutscheine → Hinzufügen`

### Allgemein

| Feld | Wert |
|------|------|
| Gutscheincode | Frei wählbar, **wird intern in lowercase gespeichert**. Frontend normalisiert per `.toUpperCase()` zur Anzeige. |
| Beschreibung | Interner Hinweis, z.B. „Insta-Promo Sep 2026". Wird nicht im Frontend gezeigt. |
| Rabattart | `Prozentualer Rabatt` / `Pauschalrabatt auf Warenkorb` / `Pauschalrabatt auf Produkte` |
| Coupon-Betrag | Bei `Pauschalrabatt auf Warenkorb`: **BRUTTO** eintragen (s.u.). Bei Prozent: einfach den Prozentsatz (z.B. `10`). |
| Kostenlosen Versand erlauben | Optional. Bei Aktivierung wird `shipping_lines.total = 0.00` deterministisch vom Frontend gesendet — inkl. Muster-Aufschlag. |
| Ablaufdatum des Gutscheins | Optional. Frontend liest `date_expires_gmt`. |

### Nutzungseinschränkung — **Pflicht!**

| Feld | Wert |
|------|------|
| Mindestausgabe | Optional. Wird geprüft gegen den diskontierfähigen Subtotal (nach Filtern). |
| Höchstausgabe | Optional. Wird ebenfalls gegen diskontierfähigen Subtotal geprüft. |
| Nur individuelle Verwendung | Empfohlen `ja` — wir unterstützen ohnehin nur einen Coupon pro Order. |
| Reduzierte Artikel ausschließen | Bei `ja` werden Sale-Items aus der Rabattberechnung gefiltert (via `item.product.on_sale`). |
| Produkte | Leer = alle. Whitelist: Produkt-IDs, auf die der Coupon greift. |
| Produkte ausschließen | Blacklist. |
| Produktkategorien | Whitelist. Leer = alle Kategorien zulässig. |
| **Ausgeschlossene Produktkategorien** | **MUSS `Muster` enthalten**. Andernfalls weist `validateAndCalculateCoupon` mit `CONFIG_ERROR` ab. |
| E-Mail-Beschränkungen | Optional. |

### Nutzungslimits

| Feld | Wert |
|------|------|
| Nutzungslimit pro Coupon | Optional. Bei Überschreitung → `USAGE_LIMIT_REACHED`. |
| Nutzungslimit pro Benutzer | Optional. WC prüft das beim Order-Create selbst — Frontend signalisiert es bei `valid:false` weiter. |

## 4. `fixed_cart`-BRUTTO / Netto-Subtilität

WooCommerce speichert intern Preise als Netto (oder Brutto, je nach Setting), wendet aber bei `coupon_lines` während des Order-Creates Steuer-Aufschläge auf Netto-Basis an.

**Konvention für dieses Projekt:** `fixed_cart`-Beträge werden so eingetragen, wie der Kunde sie wahrnehmen soll — **BRUTTO**. Beispiel: „20 € Rabatt" → Coupon-Betrag = `20`.

**Verifikations-Schritt nach Anlage eines neuen `fixed_cart`-Coupons:**

1. Test-Cart von 100 € im Frontend anlegen (z.B. ein Boden-Produkt mit passender Menge).
2. Coupon eingeben.
3. Checkout abschicken (Vorkasse / BACS reicht — kein echtes Stripe-Capture nötig).
4. WC-Backend → Bestellung öffnen.
   - Erwartet: `discount_total = 20.00` (Brutto).
   - Erwartet: `total = 80.00 + Versand`.
5. **Wenn `discount_total ≠ 20.00` ist** (z.B. `16.81` = `20 / 1.19`): Coupon-Betrag im Backend von `20` auf `23.80` (`= 20 × 1.19`) ändern und Test wiederholen. In dem Fall diesen Workaround hier ergänzen.

## 5. Empfohlene Test-Coupons (Marketing/Dev)

Lege diese drei Codes im Backend an, um den Flow vollständig abzudecken:

| Code | Typ | Betrag | Nutzungseinschränkung | Test deckt ab |
|------|-----|--------|----------------------|----------------|
| `TEST10` | Prozentualer Rabatt | `10` | Mindestausgabe leer, Muster ausgeschlossen | 10 %-Pfad, Anzeige Rabattzeile |
| `TEST20FIX` | Pauschalrabatt Warenkorb | `20` | Mindestausgabe `50`, Muster ausgeschlossen | Brutto-`fixed_cart`-Verifikation (s. Abschnitt 4) |
| `TESTFREE` | Prozent (oder Pauschal `0`) | beliebig | „Kostenlosen Versand erlauben" = JA, Muster ausgeschlossen | Strike-Through-Versand, „bereits kostenlos"-Hinweis |

## 6. End-to-End Test-Plan

Vor jedem Merge in `main` durchgehen. Frontend muss `npm run dev` laufen, Backend muss Coupons aus Abschnitt 5 angelegt haben.

| # | Szenario | Erwartung |
|---|----------|-----------|
| 1 | Boden 100 €, Coupon `TEST10` | Rabattzeile −10,00 €; OrderSummary-Total = 90,00 € + Versand. |
| 2 | Boden 30 €, Coupon `TEST20FIX` (min `50`) | Inline-Fehler „Mindestbestellwert 50,00 € nicht erreicht" — Coupon wird nicht angewendet. |
| 3 | Boden 100 € + 1 Muster, Coupon `TEST10` | Rabattzeile −10,00 € (nur auf Boden). Muster bleibt 0 €. |
| 4 | Cart 80 €, Coupon `TESTFREE` | Versand: ~~59,99 €~~ 0,00 € (Gutschein). |
| 5 | Cart 1010 €, Coupon `TESTFREE` | Versand 0 € + grüner Hinweis „✓ Code angewendet — Versand ist bereits kostenlos." |
| 6 | Set Boden+Dämmung (200 € Set-Preis), Coupon `TEST10` | Rabattzeile −20,00 € auf Set-Preis. |
| 7 | Coupon aktiv, Hauptprodukt aus Cart entfernen (zurück in Cart, Item raus) | Beim erneuten Aufrufen Checkout: Re-Validation schlägt fehl → Coupon entfernt, amber Notice „Code … wurde entfernt: …". |
| 8 | Tippfehler `IINSTA10` | Inline-Fehler `NOT_FOUND`. |
| 9 | DevTools: `appliedCoupon.discountAmount` manuell auf 999 ändern | Order wird trotzdem korrekt mit echtem WC-Discount erstellt — Stripe-Betrag = `order.total`, nicht das manipulierte Wert. |
| 10 | Coupon ohne Muster-Ausschluss anlegen, im Frontend anwenden | Inline-Fehler „Dieser Gutschein ist aktuell nicht verfügbar." + `console.error` im Server-Log mit Hinweis auf das fehlende Backend-Setting. |
| 11 | Coupon `TEST10` aktivieren, dann im WC-Backend deaktivieren, im Frontend Submit klicken | HTTP 400 vom Server, Notice „Code … wurde entfernt", Coupon im UI gelöscht. |
| 12 | Code `insta10` (lowercase) eingeben | Wird zu `INSTA10` normalisiert; Anzeige uppercase. |
| 13 | Stripe-Zahlung mit Coupon `TEST10` (Cart 100 €) | Stripe-Checkout-Betrag = `order.total` (90 € + Versand). Stripe-LineItem zeigt „Bodenjäger Bestellung #…". |
| 14 | Coupon `TEST10` aktiv, dann Code `TESTFREE` eingeben | `TEST10` wird durch `TESTFREE` ersetzt; blaue Notice „Code „TEST10" durch „TESTFREE" ersetzt." (5 s Auto-Dismiss). |
| 15 | Coupon aktiv, Mengenstepper im Cart-Drawer ändert `totalPrice` | useEffect re-validiert; bei gleichbleibender Gültigkeit silent State-Update auf neuen `discountAmount`. |
| 16 | Rate-Limit: > 10 Apply-Versuche/Min von gleicher IP | HTTP 429, Inline-Fehler „Zu viele Versuche. Bitte einen Moment warten." |
| **17** | **`TEST20FIX` (20 € BRUTTO) auf Cart 100 €** | **WC-Order `discount_total === 20.00`; Stripe/PayPal-Betrag = `total - 20.00 + Versand`. Bei Abweichung Abschnitt 4 anpassen.** |

## 7. Auswertung im WC-Admin

| Wo | Was |
|----|-----|
| `Marketing → Gutscheine` | Spalte „Nutzung / X" zeigt `usage_count / usage_limit`. |
| `WooCommerce → Berichte → Gutscheine` | Aggregierte Einlösungen + Discount-Summe pro Zeitraum. |
| Einzelne Bestellung | `discount_total` und `coupon_lines` werden in der Order-Übersicht und in der Kunden-E-Mail (Standard-WC-Template) angezeigt. |

## 8. Bei `usage_count` und Storno

Wenn ein Stripe-/PayPal-Session-Aufbau nach erfolgreichem `createWooCommerceOrder` fehlschlägt, setzt das Frontend die Order auf `cancelled` (bei aktivem Coupon) — WC zieht dann automatisch `usage_count -= 1`, sodass keine Promo-Slots verbrannt werden. Ohne Coupon wird die Order auf `failed` gesetzt. Beide Pfade hinterlassen eine interne Order-Notiz mit dem Payment-Fehler.

## 9. Bekannte Grenzen

- **Race zwischen Apply und Submit (~Millisekunden):** Wenn der Coupon zwischen UI-Apply und Order-Submit im Backend deaktiviert wird, weist der Server die Order mit HTTP 400 und `errorCode` ab. Frontend entfernt den Coupon und zeigt eine permanente Notice. Order wird nicht erstellt.
- **Keine localStorage-Persistenz:** Nach Page-Reload muss der Code erneut eingegeben werden.
- **`exclude_sale_items` benötigt `product.on_sale`-Flag**, das die Jaeger-API liefert. Wenn das Feld fehlt (sollte nicht passieren), wird das Item als „nicht im Sale" behandelt.
