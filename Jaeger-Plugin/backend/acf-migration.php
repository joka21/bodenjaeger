<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

function jaeger_migrate_to_acf() {
    // Alle Produkte abrufen
    $products = wc_get_products(array(
        'limit' => -1,
        'status' => 'publish',
    ));

    foreach ($products as $product) {
        $product_id = $product->get_id();
        
        // Felder-Mapping - Plugin-Feld zu ACF-Feld
        $fields = array(
            '_show_aktion',
            '_aktion',
            '_aktion_text_color',
            '_aktion_text_size',
            '_aktion_button_style',
            '_show_uvp',
            '_uvp',
            '_paketpreis',
            '_paketinhalt',
            '_einheit_short',
            '_verpackungsart',
            '_verpackungsart_short',
            '_show_text_produktuebersicht',
            '_text_produktuebersicht',
            '_show_setangebot',
            '_setangebot_titel',
            '_setangebot_text_color',
            '_setangebot_text_size',
            '_setangebot_button_style',
            '_setangebot_gesamtpreis',
            '_setangebot_einzelpreis',
            '_setangebot_ersparnis_euro',
            '_setangebot_ersparnis_prozent',
            '_show_lieferzeit',
            '_lieferzeit'
        );
        
        // Daten von Plugin-Feldern zu ACF-Feldern kopieren
        foreach ($fields as $field) {
            $value = get_post_meta($product_id, $field, true);
            if (!empty($value)) {
                update_field($field, $value, $product_id);
            }
        }
    }
}

// Funktion manuell aufrufen oder über einen Admin-Menüpunkt
function jaeger_add_migration_button() {
    add_submenu_page(
        'woocommerce',
        'Daten zu ACF migrieren',
        'Zu ACF migrieren',
        'manage_options',
        'jaeger-migrate-to-acf',
        'jaeger_migration_page'
    );
}
add_action('admin_menu', 'jaeger_add_migration_button');

// Migrations-Seite
function jaeger_migration_page() {
    if (isset($_POST['jaeger_migrate'])) {
        jaeger_migrate_to_acf();
        echo '<div class="notice notice-success"><p>Daten wurden erfolgreich zu ACF migriert!</p></div>';
    }
    ?>
    <div class="wrap">
        <h1>Daten zu ACF migrieren</h1>
        <p>Klicken Sie auf den Button, um Ihre Produktdaten vom Plugin zu ACF zu migrieren.</p>
        <form method="post">
            <button type="submit" name="jaeger_migrate" class="button button-primary">Jetzt migrieren</button>
        </form>
    </div>
    <?php
}

// Automatische Synchronisierung (optional)
function jaeger_sync_to_acf($post_id) {
    if (get_post_type($post_id) !== 'product') {
        return;
    }
    
    $fields = array(
        '_show_aktion',
        '_aktion',
        '_aktion_text_color',
        '_aktion_text_size',
        '_aktion_button_style',
        '_show_uvp',
        '_uvp',
        '_paketpreis',
        '_paketinhalt',
        '_einheit_short',
        '_verpackungsart',
        '_verpackungsart_short',
        '_show_text_produktuebersicht',
        '_text_produktuebersicht',
        '_show_setangebot',
        '_setangebot_titel',
        '_setangebot_text_color',
        '_setangebot_text_size',
        '_setangebot_button_style',
        '_setangebot_gesamtpreis',
        '_setangebot_einzelpreis',
        '_setangebot_ersparnis_euro',
        '_setangebot_ersparnis_prozent',
        '_show_lieferzeit',
        '_lieferzeit'
    );
    
    foreach ($fields as $field) {
        $value = get_post_meta($post_id, $field, true);
        update_field($field, $value, $post_id);
    }
}
add_action('woocommerce_process_product_meta', 'jaeger_sync_to_acf', 20);