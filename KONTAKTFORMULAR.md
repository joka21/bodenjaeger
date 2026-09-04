# Kontaktformular – Dokumentation & Fehlerbehebung

Diese Datei beschreibt das Kontaktformular von bodenjaeger.de **vollständig**: alle
beteiligten Dateien, den kompletten Datenfluss, alle erforderlichen Umgebungs-
variablen und – am wichtigsten – **wo die wiederkehrenden Fehler herkommen** und wie
man sie behebt.

> Kurzfassung: Wenn das Formular „Es ist ein Fehler aufgetreten" zeigt, liegt es in
> **>90 % der Fälle an einer fehlenden/falschen Environment-Variable in Vercel** oder
> daran, dass der **WordPress-Endpoint die Mail nicht versenden kann** (SMTP).
> → Springe direkt zu [Fehler-Diagnose](#fehler-diagnose).

---

## 1. Überblick: Was passiert beim Absenden?

```
┌─────────────────────┐   POST /api/contact   ┌──────────────────────┐
│  KontaktPage.tsx    │ ────────────────────► │  app/api/contact      │
│  (Browser, Client)  │   JSON + Turnstile    │  route.ts (Next-API)  │
└─────────────────────┘                       └──────────┬───────────┘
        ▲                                                 │
        │ 1. Cloudflare Turnstile (Captcha)               │ 2. Turnstile serverseitig
        │    erzeugt Token im Browser                     │    verifizieren
        │                                                 │ (challenges.cloudflare.com)
        │                                                 ▼
        │                                      ┌──────────────────────┐
        │  { success: true/false }   POST      │  WordPress            │
        └──────────────────────────────────────│  /wp-json/jaeger/v1/  │
                                       3. Mail  │  contact              │
                                                │  → wp_mail() →        │
                                                │  An:  je nach Betreff │
                                                │       (info@/verkauf@/│
                                                │        service@)      │
                                                │  CC:  dd@ (immer)     │
                                                └──────────────────────┘
```

Es gibt **drei** Stationen, an denen es scheitern kann:

1. **Browser** – Turnstile-Widget lädt nicht / liefert keinen Token.
2. **Next.js API-Route** (`/api/contact`) – Validierung, Turnstile-Verifizierung,
   Konfiguration.
3. **WordPress-Endpoint** (`/wp-json/jaeger/v1/contact`) – Mailversand via SMTP.

---

## 2. Beteiligte Dateien

| Datei | Rolle |
|-------|-------|
| `src/components/KontaktPage.tsx` | Das eigentliche Formular (Client-Component). State, Validierung, Turnstile-Widget, `fetch('/api/contact')`. |
| `src/app/kontakt/page.tsx` | Server-Route. Lädt die WordPress-Seite (`slug: 'beratung'`) und rendert `KontaktPage`. |
| `src/app/api/contact/route.ts` | Next.js-Backend. Honeypot-Check, Pflichtfeld-Check, Turnstile-Verifizierung, Weiterleitung an WordPress. |
| `WP_CONTACT_ENDPOINT.md` | Doku + PHP-Snippet für den WordPress-Endpoint. |
| `src/components/ContactDrawer.tsx` | Das seitliche Kontakt-Panel (Telefon/Mail/Öffnungszeiten). **Enthält KEIN Formular**, verlinkt nur auf `/kontakt`. |
| `src/components/FloatingContactButton.tsx` | Schwebender Button unten rechts, öffnet `ContactDrawer`. |

> **Wichtig:** Es existiert genau **ein** echtes Kontaktformular: `KontaktPage.tsx`.
> Die Checkout-Komponenten (`ContactForm.tsx`, `ContactStep.tsx`) gehören zum
> Bestell-Prozess und haben mit dem Kontaktformular **nichts** zu tun.

---

## 3. Die Formularfelder

| Feld | `name` | Pflicht | Typ | Anmerkung |
|------|--------|---------|-----|-----------|
| Name | `name` | ✅ | text | |
| E-Mail | `email` | ✅ | email | |
| Telefon | `phone` | ❌ | tel | optional |
| Betreff | `subject` | ✅ | select | feste Optionen (beratung, bestellung, reklamation, …) — **steuert den Empfänger**, siehe unten |
| Nachricht | `message` | ✅ | textarea | |
| Website | `website` | – | text | **Honeypot** – versteckt, muss leer bleiben (Bot-Falle) |
| (Captcha) | `turnstileToken` | ✅ | – | wird von Cloudflare Turnstile erzeugt |

### Betreff → Empfänger

Der Betreff-Slug entscheidet, welches Fachpostfach die Anfrage bekommt.
`dd@bodenjaeger.de` ist **bei jeder** Anfrage in CC (Auswertung).

| Auswahl | Slug | An | CC |
|---|---|---|---|
| Bitte wählen… / unbekannt | `''` | `info@bodenjaeger.de` | `dd@bodenjaeger.de` |
| Produktberatung | `beratung` | `verkauf@bodenjaeger.de` | `dd@bodenjaeger.de` |
| Frage zur Bestellung | `bestellung` | `service@bodenjaeger.de` | `dd@bodenjaeger.de` |
| Reklamation | `reklamation` | `service@bodenjaeger.de` | `dd@bodenjaeger.de` |
| Versand & Lieferung | `lieferung` | `service@bodenjaeger.de` | `dd@bodenjaeger.de` |
| Verlegeservice | `verlegeservice` | `verkauf@bodenjaeger.de` | `dd@bodenjaeger.de` |
| Fachmarkt Hückelhoven | `fachmarkt` | `verkauf@bodenjaeger.de` | `dd@bodenjaeger.de` |
| Sonstiges | `sonstiges` | `info@bodenjaeger.de` | `dd@bodenjaeger.de` |

> ⚠️ **Wird eine `<option>` in `KontaktPage.tsx` ergänzt oder ihr `value`
> geändert, muss die Routing-Tabelle im WordPress-Endpoint mitgezogen werden**
> (`Jaeger_Contact_Endpoint::ROUTING` in `Jaeger-Plugin/backend/api-contact.php`,
> siehe `WP_CONTACT_ENDPOINT.md`). Sonst landet die neue
> Option stillschweigend beim Fallback `info@bodenjaeger.de` — kein Fehler,
> aber im falschen Postfach.

### Honeypot
Ein verstecktes Feld `website` (per CSS off-screen positioniert). Menschen sehen es
nicht. Füllt ein Bot es aus, antwortet die API **bewusst mit `success: true`**
(Station 2), verschickt aber **keine** Mail. So lernt der Bot nichts.

### Cloudflare Turnstile (Captcha)
- Paket: `@marsidev/react-turnstile` (`^1.5.2`)
- Im Browser erzeugt das Widget einen Token (`onSuccess`).
- Ohne gültigen Token ist der Absenden-Button **deaktiviert**
  (`disabled={... || !turnstileToken}`).
- Der Token wird nach jedem Submit zurückgesetzt (`turnstileRef.current?.reset()`).

---

## 4. Datenfluss im Detail

### Station 1 – Browser (`KontaktPage.tsx`)
1. `handleSubmit` verhindert das Default-Submit, setzt Status `sending`.
2. **Kein Token** → sofort Status `error`, Widget-Reset, Abbruch.
3. `fetch('/api/contact')` mit `{ ...formData, turnstileToken, website }`.
4. Antwort: nur bei `res.ok && data.success === true` → Status `success`,
   Formular wird geleert. Sonst → Status `error`.

### Station 2 – Next.js API (`src/app/api/contact/route.ts`)
Der Reihe nach (jeder Schritt kann mit einem bestimmten HTTP-Status fehlschlagen):

| # | Prüfung | Bei Fehler | Status |
|---|---------|-----------|--------|
| 1 | JSON parsbar? | „Ungueltiger Request-Body" | 400 |
| 2 | Honeypot `website` leer? | (still) `success: true`, keine Mail | 200 |
| 3 | Pflichtfelder `name/email/subject/message` vorhanden? | „Pflichtfelder fehlen." | 400 |
| 4 | `turnstileToken` vorhanden? | „Sicherheitscheck fehlt." | 400 |
| 5 | `TURNSTILE_SECRET_KEY` gesetzt? | „Server-Konfiguration unvollstaendig." | **500** |
| 6 | Turnstile bei Cloudflare verifizieren | „Sicherheitscheck fehlgeschlagen." | 400 |
| 6b | Cloudflare nicht erreichbar | „Sicherheitscheck nicht erreichbar." | 502 |
| 7 | `NEXT_PUBLIC_WORDPRESS_URL` + `JAEGER_CONTACT_SECRET` gesetzt? | „Server-Konfiguration unvollstaendig." | **500** |
| 8 | POST an WordPress, Antwort `ok`? | „Nachricht konnte nicht zugestellt werden." | 502 |
| 8b | WordPress-Fetch wirft Exception | „Nachricht konnte nicht zugestellt werden." | 502 |

> Jeder Fehler wird serverseitig per `console.error` / `console.warn` geloggt
> (Präfix `[api/contact]`). **Diese Logs sind die schnellste Diagnose-Quelle**
> → in Vercel unter *Logs* / *Functions* sichtbar.

### Station 3 – WordPress (`/wp-json/jaeger/v1/contact`)
- Authentifizierung über Header `X-Jaeger-Secret` (= `JAEGER_CONTACT_SECRET`),
  Vergleich mit `hash_equals()`.
- Sanitisiert Felder, baut die Mail, ruft `wp_mail()` an das zum Betreff
  gehörende Postfach (Tabelle oben) mit `dd@bodenjaeger.de` in **CC**.
- **Empfaengerkreis wird ausschliesslich hier definiert** — in
  `Jaeger-Plugin/backend/api-contact.php`, Konstanten `ROUTING` / `RECIPIENT` /
  `CC_RECIPIENT` (siehe `WP_CONTACT_ENDPOINT.md`).
  Im Next.js-Repo gibt es keinen Mailversand — eine Aenderung an Empfaenger oder
  CC ist immer eine WordPress-Aenderung.
- Schlägt `wp_mail()` fehl → `{ success: false }`, Status 500 → Next.js gibt 502 an
  den Browser → Formular zeigt „Fehler".

---

## 5. Erforderliche Environment-Variablen

Diese **vier** Variablen müssen in **jeder** Umgebung gesetzt sein, in der das
Formular laufen soll (lokal `.env.local` **und** Vercel: Production + Preview +
Development):

| Variable | Wo benutzt | Sichtbarkeit | Zweck |
|----------|-----------|--------------|-------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Browser (`KontaktPage.tsx`) | public | Turnstile-Widget anzeigen |
| `TURNSTILE_SECRET_KEY` | Server (`route.ts`) | secret | Token bei Cloudflare verifizieren |
| `NEXT_PUBLIC_WORDPRESS_URL` | Server (`route.ts`) | public | Ziel-URL des WP-Endpoints |
| `JAEGER_CONTACT_SECRET` | Server (`route.ts`) + WP `wp-config.php` | secret | Shared Secret Next ↔ WordPress |

Zusätzlich in WordPress `wp-config.php`:
```php
define('JAEGER_CONTACT_SECRET', '…derselbe Wert wie in Vercel…');
```

> ⚠️ **`JAEGER_CONTACT_SECRET` muss in Vercel und in `wp-config.php` BYTE-GLEICH
> sein.** Wird er auf einer Seite geändert, schlägt jede Anfrage mit 502 fehl
> (WP antwortet 401/403 wegen `hash_equals`-Mismatch).

> ⚠️ **`.env.example` dokumentiert diese vier Variablen aktuell NICHT.** Wer das
> Projekt neu aufsetzt, übersieht sie leicht → Formular „funktioniert nicht".
> Siehe [bekannte Schwachstellen](#7-bekannte-schwachstellen--verbesserungsideen).

---

## 6. Fehler-Diagnose

So grenzt man den Fehler systematisch ein. Reihenfolge = schnellster Weg.

### Schritt A – Welche Meldung zeigt der Browser?
Die Browser-Meldung ist immer dieselbe („Es ist ein Fehler aufgetreten…"), egal
welche Station scheitert. Deshalb: **Netzwerk-Tab öffnen** und die Antwort von
`POST /api/contact` ansehen.

| Status | `error`-Text | Ursache | Lösung |
|--------|-------------|---------|--------|
| 400 | „Pflichtfelder fehlen." | Feld leer übermittelt | Formular vollständig ausfüllen |
| 400 | „Sicherheitscheck fehlt." | Kein Turnstile-Token | Captcha lädt nicht → Schritt B |
| 400 | „Sicherheitscheck fehlgeschlagen." | Falscher/abgelaufener Token oder falscher Secret-Key | Schritt B + C |
| **500** | „Server-Konfiguration unvollstaendig." | **ENV-Variable fehlt** (`TURNSTILE_SECRET_KEY` ODER `WORDPRESS_URL`/`JAEGER_CONTACT_SECRET`) | Schritt C |
| 502 | „Sicherheitscheck nicht erreichbar." | Cloudflare nicht erreichbar (selten) | später erneut |
| 502 | „Nachricht konnte nicht zugestellt werden." | **WordPress / Mailversand** scheitert | Schritt D |

### Schritt B – Lädt das Turnstile-Widget?
- Wird das Captcha-Widget auf `/kontakt` angezeigt? Wenn **nein**:
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` fehlt oder ist falsch → Widget bleibt leer,
    Button bleibt deaktiviert.
  - Site-Key gehört zur **falschen Domain** in Cloudflare (Turnstile-Keys sind
    domaingebunden). Prüfen: Cloudflare-Dashboard → Turnstile → erlaubte Hostnames
    (`bodenjaeger.de`, `www.bodenjaeger.de`, ggf. `localhost`).
- Nach `NEXT_PUBLIC_*`-Änderung in Vercel **immer neu deployen** (public Vars
  werden zur Build-Zeit eingebacken!).

### Schritt C – ENV-Variablen in Vercel prüfen
1. Vercel → Project → Settings → Environment Variables.
2. Sind alle vier Variablen aus [Abschnitt 5](#5-erforderliche-environment-variablen)
   gesetzt – **für Production UND Preview**?
3. Werte ohne führende/abschließende Leerzeichen? (Der Code macht `.trim()`, aber
   trotzdem sauber halten.)
4. **`TURNSTILE_SECRET_KEY` und `NEXT_PUBLIC_TURNSTILE_SITE_KEY` müssen ein Paar
   aus demselben Cloudflare-Widget sein.** Site-Key von Widget A + Secret von
   Widget B → „Sicherheitscheck fehlgeschlagen."
5. Nach jeder Änderung: **Redeploy ohne Build-Cache**.

### Schritt D – WordPress-Endpoint direkt testen
Wenn der Browser **502 „Nachricht konnte nicht zugestellt werden."** zeigt, liegt
das Problem hinter Next.js – in WordPress. Direkt testen (curl):

```bash
curl -X POST https://2025.bodenjaeger.de/wp-json/jaeger/v1/contact \
  -H "Content-Type: application/json" \
  -H "X-Jaeger-Secret: <JAEGER_CONTACT_SECRET>" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Hallo"}'
```

> Hinweis: `"subject":"Test"` ist kein bekannter Slug → die Testmail geht an den
> Fallback `info@bodenjaeger.de` (CC `dd@`). Für einen Routing-Test stattdessen
> einen echten Slug einsetzen, z. B. `"subject":"reklamation"` → `service@`.

| curl-Antwort | Bedeutung | Lösung |
|--------------|-----------|--------|
| `{"success":true}` | Endpoint + Mail OK → Fehler liegt bei ENV/Secret-Mismatch in Next.js | Schritt C, Secret abgleichen |
| 401/403 / leer | Secret-Mismatch oder Endpoint nicht registriert | `JAEGER_CONTACT_SECRET` in `wp-config.php` ↔ Vercel abgleichen; Jaeger-Plugin neu aktivieren |
| `{"success":false,"error":"Mail-Versand fehlgeschlagen."}` | `wp_mail()` schlägt fehl | **SMTP in WordPress reparieren** (WP Mail SMTP Plugin konfigurieren) |
| 404 | Endpoint existiert nicht | PHP-Snippet aus `WP_CONTACT_ENDPOINT.md` ins Jaeger-Plugin einfügen, Plugin neu aktivieren |

> **Häufigste Ursache der wiederkehrenden Fehler:** WordPress kann keine Mail
> versenden. Ohne korrekt konfiguriertes SMTP-Plugin (WP Mail SMTP o.Ä.) liefert
> `wp_mail()` `false`, oder die Mail landet im Spam. Das ist **keine** Frontend-
> Sache – es muss im WordPress-Backend gelöst werden.

### Schritt E – Server-Logs lesen
Vercel → Project → Logs (Runtime/Functions). Nach Präfix **`[api/contact]`**
filtern. Dort steht die exakte Ursache (z. B. „TURNSTILE_SECRET_KEY fehlt",
„WordPress error: 401", „Turnstile verify failed: [...]").

---

## 7. Bekannte Schwachstellen / Verbesserungsideen

Diese erklären, **warum es „immer wieder" Fehler gibt**:

1. **`.env.example` ist unvollständig.** Die vier Kontakt-relevanten Variablen
   (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`,
   `JAEGER_CONTACT_SECRET`, und der Kontakt-Nutzen von `NEXT_PUBLIC_WORDPRESS_URL`)
   fehlen dort und werden auch von `npm run check-env` **nicht** geprüft. → Bei
   einem neuen Deployment / neuer Umgebung werden sie leicht vergessen.

2. **`NEXT_PUBLIC_TURNSTILE_SITE_KEY` ist build-time-gebunden.** Wird die Variable
   in Vercel nachträglich gesetzt, aber **nicht neu deployt**, bleibt das Widget
   leer und der Button dauerhaft deaktiviert.

3. **Secret-Mismatch ist „silent".** Stimmt `JAEGER_CONTACT_SECRET` zwischen Vercel
   und `wp-config.php` nicht überein, sieht der Nutzer nur „Fehler" – ohne Hinweis
   auf die wahre Ursache. Nur die curl-/Log-Diagnose deckt es auf.

4. **SMTP-Abhängigkeit in WordPress.** Der gesamte Erfolg hängt am Mailversand des
   WordPress-Backends. Bricht das SMTP-Plugin / der Mail-Provider weg, schlägt das
   Formular fehl, obwohl im Next.js-Code nichts geändert wurde.

5. **Turnstile-Hostname-Bindung.** Wird die Domain gewechselt (z. B. `www.` vs.
   ohne `www`), und der Hostname ist nicht in Cloudflare freigegeben, schlägt die
   Verifizierung fehl.

### Empfohlene Härtung (optional, nicht ohne Rücksprache umsetzen)
- Die vier Variablen in `.env.example` **und** in `scripts/check-env.js` ergänzen.
- Für lokale Entwicklung Cloudflares **Test-Keys** dokumentieren
  (`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`).
- In `KontaktPage.tsx` die konkrete `data.error`-Meldung des Servers anzeigen statt
  des generischen Texts (erleichtert Support, gibt aber minimal mehr Info preis).

---

## 8. Schnell-Checkliste bei „Formular geht nicht"

- [ ] Netzwerk-Tab: Status + `error`-Text von `POST /api/contact` notiert?
- [ ] Turnstile-Widget sichtbar auf `/kontakt`?
- [ ] Alle 4 ENV-Variablen in Vercel (Production **und** Preview) gesetzt?
- [ ] Nach ENV-Änderung **Redeploy ohne Cache** gemacht?
- [ ] `JAEGER_CONTACT_SECRET` in Vercel == `wp-config.php`?
- [ ] curl-Test gegen WordPress-Endpoint erfolgreich (`{"success":true}`)?
- [ ] WP Mail SMTP im WordPress-Backend konfiguriert & Test-Mail kommt an?
- [ ] Vercel-Logs nach `[api/contact]` durchsucht?
```

