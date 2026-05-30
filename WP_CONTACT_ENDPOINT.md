# WordPress-Endpoint `/wp-json/jaeger/v1/contact`

Dieser Endpoint nimmt Anfragen vom Next.js-Kontaktformular entgegen und
verschickt sie als E-Mail an `info@bodenjaeger.de`.

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

    $to      = 'info@bodenjaeger.de';
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
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Hallo"}'
```

Erwartete Antwort: `{"success":true}`
