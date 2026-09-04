# WordPress-Endpoint `/wp-json/jaeger/v1/contact`

Dieser Endpoint nimmt Anfragen vom Next.js-Kontaktformular entgegen und
verschickt sie als E-Mail an das **zum Betreff passende Fachpostfach**, mit
`dd@bodenjaeger.de` immer in **CC** (Auswertung der eingehenden Anfragen).

## Empfaenger je Betreff

Der Betreff kommt als **Slug** aus dem `<select name="subject">` in
`src/components/KontaktPage.tsx`.

| Auswahl im Formular | Slug (`subject`) | An | CC |
|---|---|---|---|
| Bitte waehlen… / unbekannt | `''` (bzw. alles Unbekannte) | `info@bodenjaeger.de` | `dd@bodenjaeger.de` |
| Produktberatung | `beratung` | `verkauf@bodenjaeger.de` | `dd@bodenjaeger.de` |
| Frage zur Bestellung | `bestellung` | `service@bodenjaeger.de` | `dd@bodenjaeger.de` |
| Reklamation | `reklamation` | `service@bodenjaeger.de` | `dd@bodenjaeger.de` |
| Versand & Lieferung | `lieferung` | `service@bodenjaeger.de` | `dd@bodenjaeger.de` |
| Verlegeservice | `verlegeservice` | `verkauf@bodenjaeger.de` | `dd@bodenjaeger.de` |
| Fachmarkt Hueckelhoven | `fachmarkt` | `verkauf@bodenjaeger.de` | `dd@bodenjaeger.de` |
| Sonstiges | `sonstiges` | `info@bodenjaeger.de` | `dd@bodenjaeger.de` |

> „Bitte waehlen…" ist im Formular ein Pflichtfeld und kann normalerweise nicht
> abgeschickt werden — der Fall deckt deshalb zugleich den **Fallback** ab:
> jeder Slug, der nicht in der Tabelle steht (z. B. nach einer Aenderung der
> Auswahlliste im Frontend), geht an `info@bodenjaeger.de`. Es geht also nie
> eine Anfrage verloren, sie landet nur im allgemeinen Postfach.

## ⚠️ Wo der Endpoint TATSAECHLICH liegt

Die real deployte Implementierung ist **nicht** das Snippet weiter unten, sondern:

```
Jaeger-Plugin/backend/api-contact.php   →  class Jaeger_Contact_Endpoint
```

Geladen wird sie ueber die Datei-Liste in `JaegerPlugin.php`
(`load_dependencies()`, Eintrag `'backend/api-contact.php'`). Lokale
Arbeitskopie des Plugins:
`OneDrive/Desktop/Projekte/jäger/Jaeger-Plugin/` — **nicht** der veraltete
Stand in `Projekte/jäger/_plugins/Jaeger-Plugin/` (Januar 2026, enthaelt den
Endpoint gar nicht).

Dort heissen die Konstanten:

| Konstante | Bedeutung |
|---|---|
| `Jaeger_Contact_Endpoint::ROUTING` | Betreff-Slug => Fachpostfach (Tabelle oben) |
| `Jaeger_Contact_Endpoint::RECIPIENT` | Fallback-Postfach fuer unbekannte Slugs |
| `Jaeger_Contact_Endpoint::CC_RECIPIENT` | CC bei jeder Anfrage (`dd@bodenjaeger.de`) |
| `Jaeger_Contact_Endpoint::FROM_EMAIL` | Absender (`service@bodenjaeger.de`) |

Weitere Abweichungen der echten Datei gegenueber dem Snippet unten:
Secret-Pruefung passiert **im Handler** (nicht im `permission_callback`), damit
alle Fehler das Format `{"success":false,"error":"…"}` haben; zusaetzlich wird
der Legacy-Header `X-Jaeger-Contact-Secret` als Fallback akzeptiert.

> Das PHP-Snippet weiter unten ist die **urspruengliche Vorlage** und dient nur
> noch als Referenz fuer Aufbau und Empfaengerlogik.

> **Wo Empfaenger und CC definiert sind:** ausschliesslich in der PHP-Datei
> (`ROUTING` / `RECIPIENT` / `CC_RECIPIENT`). Die Next.js-Route
> `src/app/api/contact/route.ts` verschickt **keine** Mail — sie validiert nur
> (Honeypot, Pflichtfelder, Turnstile) und leitet an diesen Endpoint weiter.
> Eine Aenderung am Empfaengerkreis ist deshalb **immer** eine Aenderung in
> WordPress, nie im Next.js-Repo.

## Voraussetzung in `wp-config.php`

```php
define('JAEGER_CONTACT_SECRET', 'd320b2a23089b464110cbf6e398cf46783a5a30f226a33046c7ab03a42c86ae8');
```

(Steht bereits drin — siehe Commit `86f718a` lokal in wp-config.php.)

## Snippet — in das Jaeger-Plugin einfuegen

Lege z. B. die Datei `Jaeger-Plugin/includes/contact-endpoint.php` an und
binde sie aus der Haupt-Plugin-Datei mit
`require_once __DIR__ . '/includes/contact-endpoint.php';` ein.

```php
<?php
/**
 * Custom REST-Endpoint fuer das Next.js-Kontaktformular.
 *
 * Empfaengt JSON von Next.js (/api/contact) mit Shared Secret im Header
 * X-Jaeger-Secret und verschickt eine E-Mail via wp_mail().
 */

defined('ABSPATH') || exit;

/**
 * Empfaenger der Kontaktformular-Mails.
 *
 * JAEGER_CONTACT_ROUTING     = Betreff-Slug (aus dem <select> im Frontend)
 *                              => zustaendiges Fachpostfach.
 * JAEGER_CONTACT_TO_FALLBACK = Postfach fuer alle Slugs, die nicht im Routing
 *                              stehen (z. B. nach Aenderung der Auswahlliste).
 * JAEGER_CONTACT_CC          = zusaetzliche Adressen in CC, komma-separiert.
 *                              dd@bodenjaeger.de wertet die eingehenden
 *                              Anfragen aus. Leerstring = kein CC.
 *
 * Bewusst als Konstanten oben in der Datei, damit der Empfaengerkreis an genau
 * einer Stelle steht und ohne Eingriff in die Handler-Logik geaendert werden kann.
 */
const JAEGER_CONTACT_ROUTING = [
    'beratung'       => 'verkauf@bodenjaeger.de',  // Produktberatung
    'bestellung'     => 'service@bodenjaeger.de',  // Frage zur Bestellung
    'reklamation'    => 'service@bodenjaeger.de',  // Reklamation
    'lieferung'      => 'service@bodenjaeger.de',  // Versand & Lieferung
    'verlegeservice' => 'verkauf@bodenjaeger.de',  // Verlegeservice
    'fachmarkt'      => 'verkauf@bodenjaeger.de',  // Fachmarkt Hueckelhoven
    'sonstiges'      => 'info@bodenjaeger.de',     // Sonstiges
];
const JAEGER_CONTACT_TO_FALLBACK = 'info@bodenjaeger.de';
const JAEGER_CONTACT_CC          = 'dd@bodenjaeger.de';

/**
 * Zustaendiges Postfach zum Betreff-Slug. Unbekannter/leerer Slug => Fallback,
 * damit keine Anfrage verloren geht.
 */
function jaeger_contact_recipient(string $subject): string {
    return JAEGER_CONTACT_ROUTING[$subject] ?? JAEGER_CONTACT_TO_FALLBACK;
}

add_action('rest_api_init', function () {
    register_rest_route('jaeger/v1', '/contact', [
        'methods'             => 'POST',
        'callback'            => 'jaeger_handle_contact',
        'permission_callback' => 'jaeger_check_contact_secret',
    ]);
});

function jaeger_check_contact_secret(WP_REST_Request $request): bool {
    $provided = $request->get_header('x-jaeger-secret');
    if (!defined('JAEGER_CONTACT_SECRET') || !$provided) {
        return false;
    }
    return hash_equals(JAEGER_CONTACT_SECRET, $provided);
}

function jaeger_handle_contact(WP_REST_Request $request): WP_REST_Response {
    $params = $request->get_json_params();

    $name    = sanitize_text_field($params['name']    ?? '');
    $email   = sanitize_email($params['email']        ?? '');
    $phone   = sanitize_text_field($params['phone']   ?? '');
    $subject = sanitize_text_field($params['subject'] ?? '');
    $message = sanitize_textarea_field($params['message'] ?? '');

    if (!$name || !$email || !$subject || !$message) {
        return new WP_REST_Response(
            ['success' => false, 'error' => 'Pflichtfelder fehlen.'],
            400
        );
    }

    $to      = jaeger_contact_recipient($subject);
    $mail_subject = sprintf('[Kontaktformular] %s', $subject);
    $body    = sprintf(
        "Neue Nachricht vom Kontaktformular bodenjaeger.de\n\n"
        . "Name: %s\nE-Mail: %s\nTelefon: %s\nBetreff: %s\n\nNachricht:\n%s\n",
        $name, $email, $phone, $subject, $message
    );

    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        sprintf('Reply-To: %s <%s>', $name, $email),
    ];

    // CC nur setzen, wenn konfiguriert — ein leerer Cc-Header laesst manche
    // SMTP-Relays die Mail komplett verwerfen.
    if (JAEGER_CONTACT_CC !== '') {
        $headers[] = 'Cc: ' . JAEGER_CONTACT_CC;
    }

    $sent = wp_mail($to, $mail_subject, $body, $headers);

    if (!$sent) {
        return new WP_REST_Response(
            ['success' => false, 'error' => 'Mail-Versand fehlgeschlagen.'],
            500
        );
    }

    return new WP_REST_Response(['success' => true], 200);
}
```

## Empfaenger / CC aendern

Nur die Konstanten am Dateianfang anpassen, sonst nichts:

```php
const JAEGER_CONTACT_ROUTING = [ 'beratung' => 'verkauf@bodenjaeger.de', /* … */ ];
const JAEGER_CONTACT_TO_FALLBACK = 'info@bodenjaeger.de';
const JAEGER_CONTACT_CC          = 'dd@bodenjaeger.de';
```

- **Anderes Postfach fuer einen Betreff:** die passende Zeile in
  `JAEGER_CONTACT_ROUTING` aendern. Der Schluessel ist der Slug aus dem
  `<option value="…">` in `KontaktPage.tsx` — **nicht** der angezeigte Text.
- **Neue Betreff-Option im Frontend:** unbedingt hier eine Zeile ergaenzen,
  sonst geht sie stillschweigend an `JAEGER_CONTACT_TO_FALLBACK`.
- Mehrere CC-Adressen: komma-separiert, z. B.
  `'dd@bodenjaeger.de, marketing@bodenjaeger.de'`.
- Kein CC gewuenscht: `''` (Leerstring) setzen — der Header wird dann weggelassen.
- **Bcc statt Cc**, falls die Adresse im Postfach von `info@` nicht sichtbar sein
  soll: `$headers[] = 'Bcc: ' . JAEGER_CONTACT_CC;`. Da beide Adressen intern
  sind, ist Cc hier bewusst gewaehlt (nachvollziehbar, wer mitliest).
- Der Absender bleibt unveraendert; `Reply-To` zeigt weiterhin auf den Kunden,
  eine Antwort aus dem CC-Postfach geht also direkt an den Anfragenden.

## Setup-Checkliste

1. Snippet in `Jaeger-Plugin` einfuegen und Plugin neu aktivieren.
2. WordPress-Backend: WP Mail SMTP (oder vergleichbares Plugin) muss konfiguriert
   sein, sonst landet die Mail im Spam oder geht gar nicht raus.
3. **Vercel Environment Variables** ergaenzen (Production + Preview + Development):
   - `TURNSTILE_SECRET_KEY` = `0x4AAAAAADZTkfsmoU5FD-JY-CFP5r3ChTg`
   - `JAEGER_CONTACT_SECRET` = `d320b2a23089b464110cbf6e398cf46783a5a30f226a33046c7ab03a42c86ae8`
4. Vercel **Redeploy ohne Build-Cache** ausloesen.

## Test (mit curl)

```bash
curl -X POST https://2025.bodenjaeger.de/wp-json/jaeger/v1/contact \
  -H "Content-Type: application/json" \
  -H "X-Jaeger-Secret: d320b2a23089b464110cbf6e398cf46783a5a30f226a33046c7ab03a42c86ae8" \
  -d '{"name":"Test","email":"test@example.com","subject":"beratung","message":"Hallo"}'
```

Erwartete Antwort: `{"success":true}`

Zum Pruefen des Routings jeweils `subject` durchtauschen (`beratung`,
`bestellung`, `reklamation`, `lieferung`, `verlegeservice`, `fachmarkt`,
`sonstiges`) und kontrollieren, in welchem Postfach die Mail landet — `dd@`
muss dabei **jedes Mal** im CC stehen. Ein Wert wie `"Test"` ist kein bekannter
Slug und landet daher (korrekt) beim Fallback `info@`.
