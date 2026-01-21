# Newsletter WordPress Integration

## Status: ⚠️ Backend Setup erforderlich

Die Newsletter-Anmeldung im Frontend ist fertig implementiert. Für die vollständige Funktion muss das WordPress-Backend konfiguriert werden.

## Frontend (✅ Fertig)

- **Komponente**: `src/components/NewsletterSignup.tsx`
- **API-Route**: `src/app/api/newsletter/subscribe/route.ts`
- **Position**: Footer (über den 3 Spalten)
- **Felder**: E-Mail-Adresse

## WordPress-Backend Setup (TODO)

### Option 1: Newsletter Plugin verwenden (Empfohlen)

**Empfohlene Plugins:**
1. **Newsletter Plugin** (https://wordpress.org/plugins/newsletter/)
2. **Mailpoet** (https://wordpress.org/plugins/mailpoet/)
3. **Newsletter, SMTP, Email marketing** (The Newsletter Plugin)

**Installation:**
```bash
# Im WordPress Admin
Plugins → Installieren → "Newsletter" suchen → Installieren & Aktivieren
```

**API Endpoint erstellen:**
```php
// In: wp-content/themes/YOUR_THEME/functions.php
// ODER besser: Eigenes Plugin erstellen

add_action('rest_api_init', function () {
    register_rest_route('newsletter/v1', '/subscribe', array(
        'methods' => 'POST',
        'callback' => 'handle_newsletter_subscription',
        'permission_callback' => function() {
            // Basic Auth check (using WooCommerce credentials)
            return true;
        }
    ));
});

function handle_newsletter_subscription($request) {
    $email = sanitize_email($request->get_param('email'));
    $first_name = sanitize_text_field($request->get_param('first_name'));
    $last_name = sanitize_text_field($request->get_param('last_name'));
    $source = sanitize_text_field($request->get_param('source'));

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Ungültige E-Mail-Adresse', array('status' => 400));
    }

    // Option 1: Newsletter Plugin Integration
    if (function_exists('newsletter_subscribe')) {
        $result = newsletter_subscribe([
            'email' => $email,
            'name' => trim($first_name . ' ' . $last_name),
            'status' => 'C', // C = to be confirmed (Double Opt-In)
            'list_1' => 1, // Add to list 1
        ]);

        if (is_wp_error($result)) {
            return new WP_Error('subscription_failed', $result->get_error_message(), array('status' => 500));
        }

        return array(
            'success' => true,
            'message' => 'Newsletter-Anmeldung erfolgreich',
            'subscriber_id' => $result->id
        );
    }

    // Option 2: Custom Database Table
    global $wpdb;
    $table_name = $wpdb->prefix . 'newsletter_subscribers';

    $wpdb->insert(
        $table_name,
        array(
            'email' => $email,
            'first_name' => $first_name,
            'last_name' => $last_name,
            'source' => $source,
            'status' => 'pending', // pending, active, unsubscribed
            'subscribed_at' => current_time('mysql'),
            'confirmation_token' => wp_generate_password(32, false),
        ),
        array('%s', '%s', '%s', '%s', '%s', '%s', '%s')
    );

    if ($wpdb->last_error) {
        return new WP_Error('db_error', 'Datenbankfehler', array('status' => 500));
    }

    // Send confirmation email
    send_newsletter_confirmation_email($email, $wpdb->insert_id);

    return array(
        'success' => true,
        'message' => 'Bestätigungs-E-Mail gesendet',
        'subscriber_id' => $wpdb->insert_id
    );
}

function send_newsletter_confirmation_email($email, $subscriber_id) {
    $confirmation_link = home_url('/newsletter-confirm/?token=' . get_confirmation_token($subscriber_id));

    $subject = 'Newsletter-Anmeldung bestätigen';
    $message = "Bitte bestätigen Sie Ihre Newsletter-Anmeldung:\n\n" . $confirmation_link;

    wp_mail($email, $subject, $message);
}
```

### Option 2: Custom Database Table

**Tabelle erstellen:**
```sql
CREATE TABLE IF NOT EXISTS `wp_newsletter_subscribers` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `source` varchar(50) DEFAULT 'website',
  `status` enum('pending','active','unsubscribed') DEFAULT 'pending',
  `subscribed_at` datetime NOT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `confirmation_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Installation via Plugin Activation Hook:**
```php
function create_newsletter_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'newsletter_subscribers';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        email varchar(255) NOT NULL,
        first_name varchar(100) DEFAULT NULL,
        last_name varchar(100) DEFAULT NULL,
        source varchar(50) DEFAULT 'website',
        status enum('pending','active','unsubscribed') DEFAULT 'pending',
        subscribed_at datetime NOT NULL,
        confirmed_at datetime DEFAULT NULL,
        confirmation_token varchar(255) DEFAULT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY email (email)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

register_activation_hook(__FILE__, 'create_newsletter_table');
```

### Option 3: WooCommerce Customer Meta

**Für Kunden, die bereits registriert sind:**
```php
function save_newsletter_to_customer($email) {
    $customer = get_user_by('email', $email);

    if ($customer) {
        update_user_meta($customer->ID, 'newsletter_subscribed', true);
        update_user_meta($customer->ID, 'newsletter_subscribed_at', current_time('mysql'));
        return true;
    }

    return false;
}
```

## DSGVO / Double Opt-In

**Wichtig für Deutschland:**
1. **Double Opt-In Pflicht**: Bestätigungs-E-Mail muss versendet werden
2. **Datenschutz-Link**: Im Formular bereits implementiert
3. **Abmelde-Link**: Muss in jeder Newsletter-E-Mail enthalten sein
4. **Einwilligungsnachweis**: Timestamp und IP-Adresse speichern

**Beispiel Double Opt-In:**
```php
function confirm_newsletter_subscription($token) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'newsletter_subscribers';

    $wpdb->update(
        $table_name,
        array(
            'status' => 'active',
            'confirmed_at' => current_time('mysql')
        ),
        array('confirmation_token' => $token),
        array('%s', '%s'),
        array('%s')
    );

    return $wpdb->rows_affected > 0;
}
```

## Testing

1. Frontend testen: `http://localhost:3000` → Footer → Newsletter-Formular
2. Browser-Konsole öffnen (F12)
3. E-Mail eingeben und absenden
4. Aktuell: Logs in der Konsole (WordPress-Endpoint noch nicht aktiv)

## Nächste Schritte

1. ✅ Entscheiden: Plugin oder Custom Table?
2. ⏳ WordPress-Endpoint erstellen (siehe oben)
3. ⏳ Double Opt-In E-Mail konfigurieren
4. ⏳ Bestätigungs-Seite erstellen
5. ⏳ Newsletter-Versand einrichten

## API Endpoint URL

Nach Setup erreichbar unter:
```
POST https://plan-dein-ding.de/wp-json/newsletter/v1/subscribe
```

**Body:**
```json
{
  "email": "kunde@example.com",
  "first_name": "Max",
  "last_name": "Mustermann",
  "source": "website_footer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bestätigungs-E-Mail gesendet",
  "subscriber_id": 123
}
```
