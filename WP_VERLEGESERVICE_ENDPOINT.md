# WordPress-Endpoint `/wp-json/jaeger/v1/verlegeservice`

Nimmt die Verlegeservice-Anfrage vom Next.js-Formular entgegen
(`/api/verlegeservice-anfrage`) und verschickt sie **mit Foto-Anhängen** als
E-Mail an **`verkauf@bodenjaeger.de`**.

> **Bewusst ein EIGENER Endpoint** (nicht der bestehende `/contact` erweitert):
> - Die funktionierende Kontaktstrecke bleibt unangetastet.
> - Der Empfänger wird **serverseitig** gesetzt — **kein** client-übergebener
>   `to`-Parameter (Open-Relay-Vermeidung, falls das Secret je leakt).
>
> **WICHTIG:** Die Verlegeservice-Seite darf erst live gehen bzw. das Formular
> erst aktiviert werden (`VERLEGE_FORM_ENABLED = true` in
> `src/content/verlegeservice.ts`), **nachdem** dieser Endpoint deployed ist.

## Voraussetzung in `wp-config.php`
Das bestehende Shared Secret wird wiederverwendet (bereits vorhanden):
```php
define('JAEGER_CONTACT_SECRET', '…');
```
Next sendet es als Header `X-Jaeger-Secret`.

## Snippet — in das Jaeger-Plugin einfügen
Lege z. B. `Jaeger-Plugin/includes/verlegeservice-endpoint.php` an und binde es
aus der Haupt-Plugin-Datei mit `require_once` ein.

```php
<?php
/**
 * Custom REST-Endpoint für das Next.js-Verlegeservice-Anfrageformular.
 * Empfängt JSON von Next.js (/api/verlegeservice-anfrage) mit Shared Secret
 * im Header X-Jaeger-Secret und verschickt eine E-Mail via wp_mail()
 * inkl. Foto-Anhängen an verkauf@bodenjaeger.de.
 */

defined('ABSPATH') || exit;

add_action('rest_api_init', function () {
    register_rest_route('jaeger/v1', '/verlegeservice', [
        'methods'             => 'POST',
        'callback'            => 'jaeger_handle_verlegeservice',
        'permission_callback' => 'jaeger_check_contact_secret', // gleicher Check wie /contact
    ]);
});

// jaeger_check_contact_secret() existiert bereits (contact-endpoint.php).
// Falls dieser Endpoint eigenständig deployed wird, hier eine Kopie einfügen.

function jaeger_handle_verlegeservice(WP_REST_Request $request): WP_REST_Response {
    $params = $request->get_json_params();

    $name    = sanitize_text_field($params['name']    ?? '');
    $plzOrt  = sanitize_text_field($params['plzOrt']  ?? '');
    $email   = sanitize_email($params['email']        ?? '');
    $message = sanitize_textarea_field($params['message'] ?? '');
    $atts    = is_array($params['attachments'] ?? null) ? $params['attachments'] : [];

    if (!$name || !$email || !$message) {
        return new WP_REST_Response(['success' => false, 'error' => 'Pflichtfelder fehlen.'], 400);
    }

    // ---- Empfänger SERVERSEITIG (nicht vom Client) ----
    $to           = 'verkauf@bodenjaeger.de';
    $mail_subject = sprintf('[Verlegeservice] %s, %s', $name, $plzOrt);

    // ---- Anhänge: serverseitige Prüfung (Anzahl / MIME / Größe) ----
    $ALLOWED  = ['image/jpeg', 'image/png', 'image/heic', 'image/webp'];
    $MAX_FILE = 5 * 1024 * 1024;   // 5 MB je Datei
    $MAX_TOTAL= 15 * 1024 * 1024;  // 15 MB gesamt
    $MAX_N    = 5;

    if (count($atts) > $MAX_N) {
        return new WP_REST_Response(['success' => false, 'error' => 'Zu viele Dateien.'], 400);
    }

    $tmp_files = [];
    $total = 0;
    $upload_dir = wp_upload_dir();
    $base = trailingslashit($upload_dir['basedir']) . 'verlegeservice-tmp';
    if (!file_exists($base)) { wp_mkdir_p($base); }

    foreach ($atts as $a) {
        $mime = $a['mime'] ?? '';
        $b64  = $a['dataBase64'] ?? '';
        if (!in_array($mime, $ALLOWED, true) || !$b64) {
            jaeger_cleanup_tmp($tmp_files);
            return new WP_REST_Response(['success' => false, 'error' => 'Nicht erlaubtes Format.'], 400);
        }
        $data = base64_decode($b64, true);
        if ($data === false) {
            jaeger_cleanup_tmp($tmp_files);
            return new WP_REST_Response(['success' => false, 'error' => 'Anhang defekt.'], 400);
        }
        $size = strlen($data);
        $total += $size;
        if ($size > $MAX_FILE || $total > $MAX_TOTAL) {
            jaeger_cleanup_tmp($tmp_files);
            return new WP_REST_Response(['success' => false, 'error' => 'Datei(en) zu groß.'], 400);
        }
        $ext  = ['image/jpeg'=>'jpg','image/png'=>'png','image/heic'=>'heic','image/webp'=>'webp'][$mime];
        $safe = sanitize_file_name(($a['filename'] ?? 'foto') . '.' . $ext);
        $path = trailingslashit($base) . uniqid('vs_', true) . '_' . $safe;
        file_put_contents($path, $data);
        $tmp_files[] = $path;
    }

    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        sprintf('Reply-To: %s <%s>', $name, $email),
    ];

    $sent = wp_mail($to, $mail_subject, $message, $headers, $tmp_files);

    jaeger_cleanup_tmp($tmp_files);

    if (!$sent) {
        return new WP_REST_Response(['success' => false, 'error' => 'Mail-Versand fehlgeschlagen.'], 500);
    }
    return new WP_REST_Response(['success' => true], 200);
}

function jaeger_cleanup_tmp(array $files): void {
    foreach ($files as $f) { if (file_exists($f)) { @unlink($f); } }
}
```

## Setup-Checkliste
1. Snippet ins Jaeger-Plugin einfügen, Plugin neu aktivieren.
2. WP Mail SMTP muss konfiguriert sein (sonst Spam/kein Versand).
3. Postfach **`verkauf@bodenjaeger.de`** muss existieren/erreichbar sein.
4. Env-Vars sind bereits gesetzt (gleiches Secret wie /contact:
   `JAEGER_CONTACT_SECRET`, `TURNSTILE_SECRET_KEY`).
5. Danach in `src/content/verlegeservice.ts` `VERLEGE_FORM_ENABLED = true` setzen
   und deployen.

## Test (mit curl)
```bash
curl -X POST https://2025.bodenjaeger.de/wp-json/jaeger/v1/verlegeservice \
  -H "Content-Type: application/json" \
  -H "X-Jaeger-Secret: <JAEGER_CONTACT_SECRET>" \
  -d '{"name":"Test","plzOrt":"41836 Hückelhoven","email":"test@example.com","message":"Test","attachments":[]}'
```
Erwartete Antwort: `{"success":true}`
