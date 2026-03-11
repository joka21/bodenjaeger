<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}
require_once plugin_dir_path(__FILE__) . 'backend-aktionen.php';

/**
 * Hauptfunktion für die Installation und Konfiguration der benutzerdefinierten Felder
 */
function jaeger_add_custom_product_fields() {
    // Prüfe, ob die Installation bereits durchgeführt wurde
    $installed = get_option('jaeger_custom_fields_installed', false);
    
    if (!$installed) {
        // Wenn noch nicht installiert, führe die Installation durch
        jaeger_install_custom_fields();
    } else {
        // Normale Hooks für bestehende Felder
        add_action('woocommerce_product_options_general_product_data', 'jaeger_display_custom_fields');
        add_action('woocommerce_process_product_meta', 'jaeger_save_custom_fields');
    }
    
    // Diese Funktionen laufen immer, unabhängig vom Installationsstatus
    jaeger_set_default_verschnitt();

    // Hooks für die Angebotspreis-Überprüfung (nur Admin)
    add_action('init', 'jaeger_check_sale_dates');
    add_action('woocommerce_scheduled_sales', 'jaeger_check_sale_dates');

    // Shortcodes deaktiviert - nur Backend
    // add_shortcode('artikelbeschreibung', 'jaeger_artikelbeschreibung_shortcode');
    // add_shortcode('lieferzeit', 'jaeger_lieferzeit_shortcode');

    // Admin Skripte laden
    add_action('admin_enqueue_scripts', 'jaeger_enqueue_admin_scripts');
}

/**
 * Installiert die benutzerdefinierten Felder und speichert ihre Konfiguration in der Datenbank
 */
function jaeger_install_custom_fields() {
    // Array mit allen Feldkonfigurationen
    $field_configs = array(
        '_testdummy' => array(
            'type' => 'text',
            'label' => 'Testdummy',
            'placeholder' => 'Testdummy',
            'desc_tip' => true,
            'description' => 'Beschreibung für Testdummy.'
        ),
        '_show_text_produktuebersicht' => array(
            'type' => 'checkbox',
            'label' => 'Text Produktübersicht anzeigen',
            'desc_tip' => false
        ),
        '_show_uvp' => array(
            'type' => 'checkbox',
            'label' => 'UVP anzeigen',
            'desc_tip' => false
        ),
        '_uvp' => array(
            'type' => 'number',
            'label' => 'UVP (€)',
            'placeholder' => 'Unverbindliche Preisempfehlung in Euro',
            'desc_tip' => true,
            'description' => 'Gib die unverbindliche Preisempfehlung ein. Du kannst bis zu 2 Dezimalstellen verwenden.',
            'custom_attributes' => array(
                'step' => '0.01',
                'min' => '0'
            )
        ),
        '_text_produktuebersicht' => array(
            'type' => 'text',
            'label' => 'Text Produktübersicht',
            'placeholder' => 'inkl. Standard & Daemmung',
            'desc_tip' => true,
            'description' => 'Text der in der Produktübersicht angezeigt wird.',
            'default' => 'inkl. Standard & Daemmung'
        ),
        '_artikelbeschreibung' => array(
            'type' => 'editor',
            'media_buttons' => true,
            'textarea_rows' => 10,
            'teeny' => true
        ),
        '_paketpreis' => array(
            'type' => 'number',
            'label' => 'Preis pro Paket (€)',
            'placeholder' => 'Preis pro Paket in Euro',
            'desc_tip' => true,
            'description' => 'Gib den Preis pro Paket ein. Du kannst bis zu 2 Dezimalstellen verwenden, z.B. 15.75',
            'custom_attributes' => array(
                'step' => '0.01',
                'min' => '0'
            )
        ),
        '_paketpreis_s' => array(
            'type' => 'number',
            'label' => 'Preis pro Paket Sonderangebot (€)',
            'placeholder' => 'Preis pro Paket im Sonderangebot in Euro',
            'desc_tip' => true,
            'description' => 'Gib den Preis pro Paket im Sonderangebot ein. Du kannst bis zu 2 Dezimalstellen verwenden, z.B. 12.50',
            'custom_attributes' => array(
                'step' => '0.01',
                'min' => '0'
            )
        ),
        '_uvp_paketpreis' => array(
            'type' => 'number',
            'label' => 'UVP pro Paket (€)',
            'placeholder' => 'UVP pro Paket in Euro',
            'desc_tip' => true,
            'description' => 'Gib den UVP pro Paket ein. Du kannst bis zu 2 Dezimalstellen verwenden, z.B. 18.99',
            'custom_attributes' => array(
                'step' => '0.01',
                'min' => '0'
            )
        ),
        '_paketinhalt' => array(
            'type' => 'number',
            'label' => 'Paketinhalt',
            'placeholder' => 'Größe des Pakets in m² oder lfm',
            'desc_tip' => true,
            'description' => 'Gib die Größe des Pakets ein. Du kannst bis zu 3 Dezimalstellen verwenden.',
            'custom_attributes' => array(
                'step' => '0.001',
                'min' => '0'
            )
        ),
        '_einheit' => array(
            'type' => 'text',
            'label' => 'Einheit',
            'placeholder' => 'z.B. Quadratmeter',
            'desc_tip' => true,
            'description' => 'Gib die Einheit ein.'
        ),
        '_einheit_short' => array(
            'type' => 'text',
            'label' => 'Einheit Abkürzung',
            'placeholder' => 'z.B. m²',
            'desc_tip' => true,
            'description' => 'Gib die Abkürzung für die Einheit ein.'
        ),
        '_verpackungsart' => array(
            'type' => 'text',
            'label' => 'Verpackungsart',
            'placeholder' => 'z.B. Paket',
            'desc_tip' => true,
            'description' => 'Gib die Verpackungsart ein.'
        ),
        '_verpackungsart_short' => array(
            'type' => 'text',
            'label' => 'Verpackungsart Abkürzung',
            'placeholder' => 'z.B. Pak',
            'desc_tip' => true,
            'description' => 'Gib die Abkürzung für die Verpackungsart ein.'
        ),
        '_verschnitt' => array(
            'type' => 'number',
            'label' => 'Verschnitt (%)',
            'placeholder' => 'Standard: 5%',
            'desc_tip' => true,
            'description' => 'Gib den Verschnitt in Prozent ein. Du kannst bis zu 3 Dezimalstellen verwenden.',
            'custom_attributes' => array(
                'step' => '0.001',
                'min' => '0'
            ),
            'default' => '5'
        ),
        '_show_lieferzeit' => array(
            'type' => 'checkbox',
            'label' => 'Lieferzeit anzeigen',
            'desc_tip' => false
        ),
        '_lieferzeit' => array(
            'type' => 'text',
            'label' => 'Lieferzeit',
            'placeholder' => '3-7 Arbeitstage oder im Markt abholen',
            'desc_tip' => true,
            'description' => 'Dieser Text wird als P-Tag im Frontend angezeigt.',
            'default' => '3-7 Arbeitstage oder im Markt abholen'
        )
    );
    
    // Speichere die Konfiguration in der Datenbank
    update_option('jaeger_custom_fields_config', $field_configs);
    
    // Setze den Marker, dass die Installation durchgeführt wurde
    update_option('jaeger_custom_fields_installed', true);
    
    // Erstelle die Admin-Benachrichtigung
    add_action('admin_notices', 'jaeger_installation_notice');
}

/**
 * Zeigt eine Benachrichtigung nach erfolgreicher Installation an
 */
function jaeger_installation_notice() {
    ?>
    <div class="notice notice-success is-dismissible">
        <p><strong>Erfolg!</strong> Die Jaeger Custom Fields wurden erfolgreich installiert und konfiguriert.</p>
        <p>Die Konfiguration wurde in der WordPress-Datenbank gespeichert. Sie können die Datei <code>backend-zusatzfelder.php</code> nun sicher entfernen und durch eine minimale Version ersetzen, die nur die notwendigen Funktionen enthält.</p>
        <p>Wir empfehlen, die folgende minimale Version zu verwenden:</p>
        <pre style="background: #f8f8f8; padding: 10px; overflow: auto;">
&lt;?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Lade die gespeicherten Feldkonfigurationen
function jaeger_load_custom_fields() {
    add_action('woocommerce_product_options_general_product_data', 'jaeger_display_custom_fields');
    add_action('woocommerce_process_product_meta', 'jaeger_save_custom_fields');
    add_action('init', 'jaeger_check_sale_dates');
    add_shortcode('artikelbeschreibung', 'jaeger_artikelbeschreibung_shortcode');
    add_shortcode('lieferzeit', 'jaeger_lieferzeit_shortcode');
    add_action('admin_enqueue_scripts', 'jaeger_enqueue_admin_scripts');
}

jaeger_load_custom_fields();
        </pre>
    </div>
    <?php
}

/**
 * Zeigt die benutzerdefinierten Felder basierend auf der gespeicherten Konfiguration an
 */
function jaeger_display_custom_fields() {
    global $woocommerce, $post;
    
    $field_configs = get_option('jaeger_custom_fields_config', array());
    
    if (empty($field_configs)) {
        return; // Keine Felder gefunden
    }
    
    echo '<div class="options_group">';
    
    foreach ($field_configs as $field_id => $config) {
        $value = get_post_meta($post->ID, $field_id, true);
        
        // Wenn der Wert leer ist und ein Standardwert existiert, verwende diesen
        if (empty($value) && isset($config['default'])) {
            $value = $config['default'];
        }
        
        // Spezielle Behandlung für Einheiten basierend auf Produktkategorie
        if ($field_id == '_einheit_short' || $field_id == '_einheit') {
            $selected_value = '';
            $categories = wp_get_post_terms($post->ID, 'product_cat', array("fields" => "slugs"));
            
            if (in_array('laminat', $categories) || in_array('daemmung', $categories) || 
                in_array('parkett', $categories) || in_array('vinylboden', $categories)) {
                if ($field_id == '_einheit') {
                    $selected_value = 'Quadratmeter';
                } else {
                    $selected_value = 'm²';
                }
            } elseif (in_array('teppichboden', $categories) || in_array('sockelleisten', $categories)) {
                if ($field_id == '_einheit') {
                    $selected_value = 'Laufmeter';
                } else {
                    $selected_value = 'lfm';
                }
            }
            
            if (!empty($selected_value) && empty($value)) {
                $value = $selected_value;
            }
        }
        
        switch ($config['type']) {
            case 'text':
                woocommerce_wp_text_input(array(
                    'id' => $field_id,
                    'label' => __($config['label'], 'woocommerce'),
                    'placeholder' => $config['placeholder'],
                    'desc_tip' => $config['desc_tip'],
                    'description' => __($config['description'], 'woocommerce'),
                    'value' => $value
                ));
                break;
                
            case 'checkbox':
                woocommerce_wp_checkbox(array(
                    'id' => $field_id,
                    'label' => __($config['label'], 'woocommerce'),
                    'desc_tip' => $config['desc_tip'],
                    'value' => get_post_meta($post->ID, $field_id, true)
                ));
                break;
                
            case 'number':
                woocommerce_wp_text_input(array(
                    'id' => $field_id,
                    'label' => __($config['label'], 'woocommerce'),
                    'placeholder' => $config['placeholder'],
                    'desc_tip' => $config['desc_tip'],
                    'description' => __($config['description'], 'woocommerce'),
                    'type' => 'number',
                    'custom_attributes' => $config['custom_attributes'],
                    'value' => $value
                ));
                break;
                
            case 'editor':
                $content = get_post_meta($post->ID, $field_id, true);
                wp_editor($content, $field_id, array(
                    'media_buttons' => $config['media_buttons'],
                    'textarea_name' => $field_id,
                    'textarea_rows' => $config['textarea_rows'],
                    'teeny' => $config['teeny'],
                ));
                break;
        }
    }
    
    echo '</div>';
    
    // Füge einen Hinweis hinzu, dass die Felder aus der Datenbank geladen wurden
    echo '<div class="notice notice-info inline"><p><small><em>Diese Felder wurden aus der gespeicherten Konfiguration geladen.</em></small></p></div>';
}

/**
 * Überprüft die Angebotsdaten und aktualisiert die Preise entsprechend
 */
function jaeger_check_sale_dates() {
    // Batch-Verarbeitung für bessere Performance
    $batch_size = 50;
    $paged = 1;
    
    do {
        $args = array(
            'post_type'      => 'product',
            'posts_per_page' => $batch_size,
            'paged'          => $paged,
            'fields'         => 'ids',
        );
        
        $product_ids = get_posts($args);
        
        if (empty($product_ids)) {
            break;
        }
        
        foreach ($product_ids as $product_id) {
            $product = wc_get_product($product_id);
            
            if (!$product) {
                continue;
            }
            
            // Hole die Datumsangaben für den Verkaufszeitraum
            $date_from = $product->get_date_on_sale_from();
            $date_to = $product->get_date_on_sale_to();
            $now = new DateTime();

            // Prüfe ob wir außerhalb des Verkaufszeitraums sind
            if ($date_from && $now < $date_from) {
                // Verkauf hat noch nicht begonnen
                $product->set_sale_price('');
                $product->save();
                continue;
            }

            if ($date_to && $now > $date_to) {
                // Verkauf ist bereits beendet
                $product->set_sale_price('');
                $product->save();
                continue;
            }

            // Innerhalb des Verkaufszeitraums - Angebotspreis ist bereits durch WooCommerce gesetzt
            // Keine weitere Aktion erforderlich
        }
        
        $paged++;
        
    } while (!empty($product_ids));
}

/**
 * Speichert die benutzerdefinierten Felder
 */
function jaeger_save_custom_fields($post_id) {
    // Sicherheitscheck
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    // Nonce-Check für mehr Sicherheit
    if (!isset($_POST['woocommerce_meta_nonce']) || !wp_verify_nonce($_POST['woocommerce_meta_nonce'], 'woocommerce_save_data')) {
        return;
    }
    
    $field_configs = get_option('jaeger_custom_fields_config', array());
    
    if (empty($field_configs)) {
        return; // Keine Felder gefunden
    }
    
    foreach ($field_configs as $field_id => $config) {
        switch ($config['type']) {
            case 'checkbox':
                $value = isset($_POST[$field_id]) ? 'yes' : 'no';
                update_post_meta($post_id, $field_id, $value);
                break;
                
            case 'text':
                if (isset($_POST[$field_id])) {
                    update_post_meta($post_id, $field_id, sanitize_text_field($_POST[$field_id]));
                }
                break;
                
            case 'number':
                if (isset($_POST[$field_id])) {
                    $value = sanitize_text_field($_POST[$field_id]);
                    
                    // Für Preisfelder auf 2 Dezimalstellen runden
                    if (in_array($field_id, array('_paketpreis', '_paketpreis_s', '_uvp', '_uvp_paketpreis'))) {
                        $value = number_format((float)$value, 2, '.', '');
                    }
                    
                    update_post_meta($post_id, $field_id, $value);
                }
                break;
                
            case 'editor':
                if (isset($_POST[$field_id])) {
                    update_post_meta($post_id, $field_id, wp_kses_post($_POST[$field_id]));
                }
                break;
        }
    }
}

/**
 * Setzt den Standard-Verschnitt auf 5%, falls nicht definiert
 */
function jaeger_set_default_verschnitt() {
    global $post;
    
    if (!$post) {
        return;
    }
    
    $post_id = $post->ID;
    $existing_verschnitt = get_post_meta($post_id, '_verschnitt', true);
    
    if (empty($existing_verschnitt)) {
        update_post_meta($post_id, '_verschnitt', '5');
    }
}

// Shortcodes für Frontend-Ausgabe
function jaeger_artikelbeschreibung_shortcode($atts) {
    global $post;
    
    if (!$post) {
        return '';
    }
    
    $beschreibung = get_post_meta($post->ID, '_artikelbeschreibung', true);
    
    if (empty($beschreibung)) {
        return '';
    }
    
    return '<div class="artikelbeschreibung">' . wpautop(do_shortcode($beschreibung)) . '</div>';
}

// Shortcode für Lieferzeit
if (!function_exists('jaeger_lieferzeit_shortcode')) {
function jaeger_lieferzeit_shortcode() {
    global $post;
    
    if (!$post) {
        return '';
    }
    
    if (get_post_meta($post->ID, '_show_lieferzeit', true) !== 'yes') {
        return '';
    }
    
    $lieferzeit = get_post_meta($post->ID, '_lieferzeit', true);
    
    if (empty($lieferzeit)) {
        $lieferzeit = '3-7 Arbeitstage oder im Markt abholen';
    }
    
    return '<p class="jaeger-lieferzeit">' . esc_html($lieferzeit) . '</p>';
}
}

// Admin scripts für Produktberechnungen
if (!function_exists('jaeger_enqueue_admin_scripts')) {
function jaeger_enqueue_admin_scripts($hook) {
    // Only load on product edit pages
    if ('post.php' != $hook && 'post-new.php' != $hook) {
        return;
    }
    
    global $post;
    
    if (!$post || $post->post_type != 'product') {
        return;
    }
    
    // Enqueue the script
    wp_enqueue_script(
        'jaeger-product-calculations', 
        plugins_url('js/jaeger-product-calculations.js', __FILE__), 
        array('jquery'), 
        '1.5.0', // Version erhöht
        true
    );
}
}

// Uninstall-Funktion (optional)
if (!function_exists('jaeger_uninstall_custom_fields')) {
function jaeger_uninstall_custom_fields() {
    delete_option('jaeger_custom_fields_installed');
    delete_option('jaeger_custom_fields_config');
    
    // Benachrichtigung anzeigen
    add_action('admin_notices', function() {
        echo '<div class="notice notice-info is-dismissible"><p>Die Jaeger Custom Fields wurden deinstalliert. Die Feldwerte bleiben in den Produkten erhalten, aber die Konfiguration wurde entfernt.</p></div>';
    });
}
}

// Erstelle einen Adminmenüpunkt für die Deinstallation
if (!function_exists('jaeger_add_admin_menu')) {
function jaeger_add_admin_menu() {
    // Nur hinzufügen, wenn bereits installiert
    if (get_option('jaeger_custom_fields_installed', false)) {
        add_submenu_page(
            'woocommerce',
            'Jaeger Custom Fields',
            'Jaeger Fields',
            'manage_options',
            'jaeger-custom-fields',
            'jaeger_admin_page'
        );
    }
}
}
add_action('admin_menu', 'jaeger_add_admin_menu');

// Admin-Seite für die Deinstallation
if (!function_exists('jaeger_admin_page')) {
function jaeger_admin_page() {
    // Verarbeite Deinstallations-Request
    if (isset($_POST['jaeger_uninstall']) && isset($_POST['jaeger_uninstall_nonce']) && wp_verify_nonce($_POST['jaeger_uninstall_nonce'], 'jaeger_uninstall_action')) {
        jaeger_uninstall_custom_fields();
    }
    
    ?>
    <div class="wrap">
        <h1>Jaeger Custom Fields</h1>
        <div class="card">
            <h2>Installation Status</h2>
            <p><strong>Status:</strong> Installiert und aktiv</p>
            <p>Die Jaeger Custom Fields sind erfolgreich installiert und die Konfiguration ist in der Datenbank gespeichert.</p>
        </div>
        
        <div class="card" style="margin-top: 20px;">
            <h2>Deinstallation</h2>
            <p>Wenn Sie die Jaeger Custom Fields deinstallieren möchten, können Sie den folgenden Button verwenden. Die Feldwerte bleiben in den Produkten erhalten, aber die Konfiguration wird aus der Datenbank entfernt.</p>
            <form method="post">
                <?php wp_nonce_field('jaeger_uninstall_action', 'jaeger_uninstall_nonce'); ?>
                <input type="submit" name="jaeger_uninstall" class="button button-secondary" value="Jaeger Custom Fields deinstallieren" onclick="return confirm('Sind Sie sicher? Die Konfiguration wird aus der Datenbank entfernt.');">
            </form>
        </div>
    </div>
    <?php
}
}

// Initialisierung
jaeger_add_custom_product_fields();