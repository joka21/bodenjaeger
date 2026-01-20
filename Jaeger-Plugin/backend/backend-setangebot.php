<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// JavaScript für Preisberechnung im Admin-Bereich laden
function jaeger_add_setangebot_scripts() {
    // Nur auf Produktbearbeitungsseiten laden
    $screen = get_current_screen();
    if (!$screen || $screen->base !== 'post' || $screen->post_type !== 'product') {
        return;
    }
    
    wp_enqueue_script(
        'setangebot-calculations', 
        plugins_url('js/setangebot-calculations.js', __FILE__), 
        ['jquery'], 
        '1.0.0', 
        true
    );
    
    // Übergebe Produktdaten an JavaScript
    $product_id = get_the_ID();
    $product = wc_get_product($product_id);
    
    if ($product) {
        // Standard-Zusatzprodukte IDs
        $daemmung_id = get_post_meta($product_id, '_standard_addition_daemmung', true);
        $sockelleisten_id = get_post_meta($product_id, '_standard_addition_sockelleisten', true);
        
        // UVP und Sale Preise ermitteln
        $show_uvp = get_post_meta($product_id, '_show_uvp', true);
        $uvp_price = get_post_meta($product_id, '_uvp', true);
        $regular_price = $product->get_regular_price();
        $sale_price = $product->get_sale_price();
        
        // Preisdaten für Hauptprodukt und Zusatzprodukte
        $data = array(
            'product_id' => $product_id,
            'product_price' => $product->get_price(),
            'regular_price' => $regular_price,
            'sale_price' => $sale_price,
            'show_uvp' => $show_uvp === 'yes',
            'uvp_price' => $uvp_price ? floatval($uvp_price) : 0,
            'daemmung_id' => $daemmung_id,
            'sockelleisten_id' => $sockelleisten_id,
            'daemmung_price' => 0,
            'sockelleisten_price' => 0,
            'nonce' => wp_create_nonce('setangebot_price_calculation')
        );
        
        // Preise der Zusatzprodukte ermitteln
        if (!empty($daemmung_id)) {
            $daemmung = wc_get_product($daemmung_id);
            if ($daemmung) {
                $data['daemmung_price'] = $daemmung->get_price();
                $data['daemmung_name'] = $daemmung->get_name();
            }
        }
        
        if (!empty($sockelleisten_id)) {
            $sockelleisten = wc_get_product($sockelleisten_id);
            if ($sockelleisten) {
                $data['sockelleisten_price'] = $sockelleisten->get_price();
                $data['sockelleisten_name'] = $sockelleisten->get_name();
            }
        }
        
        // Stelle sicher, dass die Preise als floats gespeichert werden
        $data['daemmung_price'] = !empty($data['daemmung_price']) ? floatval($data['daemmung_price']) : 0;
        $data['sockelleisten_price'] = !empty($data['sockelleisten_price']) ? floatval($data['sockelleisten_price']) : 0;
        
        // JavaScript-Variable mit Daten erstellen
        wp_localize_script('setangebot-calculations', 'setangebotData', $data);
    }
}
add_action('admin_enqueue_scripts', 'jaeger_add_setangebot_scripts');

// Füge den neuen Tab "Setangebot" hinzu - nur im Admin-Bereich
function jaeger_add_setangebot_product_data_tab($tabs) {
    // Nur in der Admin-Oberfläche ausführen
    if (!is_admin()) {
        return $tabs;
    }
    
    $tabs['setangebot'] = array(
        'label'    => __('Setangebot', 'woocommerce'),
        'target'   => 'setangebot_product_data',
        'class'    => array(),
        'priority' => 26,
    );
    return $tabs;
}
add_filter('woocommerce_product_data_tabs', 'jaeger_add_setangebot_product_data_tab');

// Füge den Inhalt für den neuen Tab hinzu - nur im Admin-Bereich
function jaeger_add_setangebot_product_data_panels() {
    // Nur in der Admin-Oberfläche und auf Produktbearbeitungsseiten ausführen
    if (!is_admin() || get_current_screen()->base !== 'post') {
        return;
    }
    
    global $post;
    
    // Nur für Produkte
    if (get_post_type($post->ID) !== 'product') {
        return;
    }
    
    // Hole die Styling-Optionen von der Aktionen-Komponente
    $style_options = function_exists('jaeger_get_style_options') ? jaeger_get_style_options() : array(
        'text_colors' => array('' => 'Standard'),
        'text_sizes' => array('' => 'Standard'),
        'button_styles' => array('' => 'Standard')
    );
    
    // Hole die vorhandenen Werte
    $show_setangebot = get_post_meta($post->ID, '_show_setangebot', true);
    // Wenn noch nie gesetzt: Standard auf 'yes'
    if ($show_setangebot === '') {
        $show_setangebot = 'yes';
    }
    $setangebot_rabatt = get_post_meta($post->ID, '_setangebot_rabatt', true) ?: 0;
    $gesamtpreis = get_post_meta($post->ID, '_setangebot_gesamtpreis', true) ?: 0;
    $einzelpreis = get_post_meta($post->ID, '_setangebot_einzelpreis', true) ?: 0;
    $ersparnis_euro = get_post_meta($post->ID, '_setangebot_ersparnis_euro', true) ?: 0;
    $ersparnis_prozent = get_post_meta($post->ID, '_setangebot_ersparnis_prozent', true) ?: 0;
    
    echo '<div id="setangebot_product_data" class="panel woocommerce_options_panel">';
    
    // Setangebot Einstellungen
    echo '<div class="options_group"><h4 style="margin-left: 12px;">Setangebot Einstellungen</h4>';
    
    woocommerce_wp_checkbox(
        array(
            'id'          => '_show_setangebot',
            'label'       => __('Setangebot anzeigen', 'woocommerce'),
            'desc_tip'    => false,
            'value'       => $show_setangebot,
        )
    );

    woocommerce_wp_text_input(
        array(
            'id'          => '_setangebot_titel',
            'label'       => __('Setangebot Titel', 'woocommerce'),
            'placeholder' => 'Komplett-Set',
            'desc_tip'    => 'true',
            'description' => __('Titel für das Setangebot', 'woocommerce'),
            'value'       => get_post_meta($post->ID, '_setangebot_titel', true) ?: 'Komplett-Set'
        )
    );
    
    // Styling Optionen für Setangebot
    woocommerce_wp_select(
        array(
            'id'      => '_setangebot_text_color',
            'label'   => __('Textfarbe', 'woocommerce'),
            'options' => $style_options['text_colors'],
            'value'   => get_post_meta($post->ID, '_setangebot_text_color', true)
        )
    );

    woocommerce_wp_select(
        array(
            'id'      => '_setangebot_text_size',
            'label'   => __('Textgröße', 'woocommerce'),
            'options' => $style_options['text_sizes'],
            'value'   => get_post_meta($post->ID, '_setangebot_text_size', true)
        )
    );

    woocommerce_wp_select(
        array(
            'id'      => '_setangebot_button_style',
            'label'   => __('Button Stil', 'woocommerce'),
            'options' => $style_options['button_styles'],
            'value'   => get_post_meta($post->ID, '_setangebot_button_style', true)
        )
    );
    
    echo '</div>';
    
    // Preisberechnung Sektion
    echo '<div class="options_group"><h4 style="margin-left: 12px;">Preisberechnung</h4>';
    
    echo '<div style="padding: 0 12px; margin-bottom: 15px;">';
    echo '<p class="description">Die Preisberechnung verwendet automatisch den höchstmöglichen Vergleichspreis:</p>';
    echo '<ol style="margin-left: 20px;">';
    echo '<li>Wenn UVP angezeigt wird, wird dieser als Basis für den Vergleich verwendet</li>';
    echo '<li>Andernfalls wird der reguläre Preis verwendet</li>';
    echo '<li>Für den Setpreis wird der Angebotspreis verwendet (wenn vorhanden)</li>';
    echo '</ol>';
    echo '</div>';
    
    // Manuelle Rabatteingabe
    woocommerce_wp_text_input(
        array(
            'id'          => '_setangebot_rabatt',
            'label'       => __('Zusätzlicher Rabatt in %', 'woocommerce'),
            'placeholder' => '0',
            'desc_tip'    => true,
            'description' => __('Optionaler zusätzlicher Rabatt in Prozent für das Setangebot (zusätzlich zum bereits vorhandenen Angebotspreis)', 'woocommerce'),
            'type'        => 'number',
            'custom_attributes' => array(
                'step' => '0.01',
                'min'  => '0',
                'max'  => '100'
            ),
            'value'       => $setangebot_rabatt
        )
    );
    
    // Automatisch berechnete Preise - nur zur Anzeige, nicht editierbar
    echo '<div style="padding: 0 12px;">';
    echo '<p><strong>Standard-Zusatzprodukte:</strong></p>';
    echo '<div id="setangebot_selected_products">';
    echo '<p>Die Preisberechnung wird geladen...</p>';
    echo '</div>';
    
    echo '<div class="setangebot-calculation">';
    echo '<table class="widefat" style="margin-top: 15px;">';
    echo '<thead><tr>';
    echo '<th>Beschreibung</th>';
    echo '<th style="text-align:right">Wert</th>';
    echo '</tr></thead>';
    echo '<tbody>';
    
    // Vergleichspreis (UVP oder Regulär) mit Zusatzprodukten
    echo '<tr style="background-color: #f9f9f9;">';
    echo '<td><strong>Vergleichspreis mit Zusatzprodukten</strong></td>';
    echo '<td style="text-align:right">€ <span id="setangebot_einzelpreis">' . number_format($einzelpreis, 2, ',', '.') . '</span>';
    echo '<input type="hidden" name="_setangebot_einzelpreis" id="_setangebot_einzelpreis" value="' . esc_attr($einzelpreis) . '">';
    echo '</td></tr>';
    
    // Gesamtpreis Set
    echo '<tr style="background-color: #f0f8ff;">';
    echo '<td><strong>Setpreis (inkl. Rabatt)</strong></td>';
    echo '<td style="text-align:right">€ <span id="setangebot_gesamtpreis">' . number_format($gesamtpreis, 2, ',', '.') . '</span>';
    echo '<input type="hidden" name="_setangebot_gesamtpreis" id="_setangebot_gesamtpreis" value="' . esc_attr($gesamtpreis) . '">';
    echo '</td></tr>';
    
    // Ersparnis Euro
    echo '<tr style="background-color: #f0fff0;">';
    echo '<td><strong>Ersparnis in Euro</strong></td>';
    echo '<td style="text-align:right; color: green;">€ <span id="setangebot_ersparnis_euro">' . number_format($ersparnis_euro, 2, ',', '.') . '</span>';
    echo '<input type="hidden" name="_setangebot_ersparnis_euro" id="_setangebot_ersparnis_euro" value="' . esc_attr($ersparnis_euro) . '">';
    echo '</td></tr>';
    
    // Ersparnis Prozent
    echo '<tr style="background-color: #f0fff0;">';
    echo '<td><strong>Ersparnis in Prozent</strong></td>';
    echo '<td style="text-align:right; color: green;"><span id="setangebot_ersparnis_prozent">' . number_format($ersparnis_prozent, 2, ',', '.') . '</span> %';
    echo '<input type="hidden" name="_setangebot_ersparnis_prozent" id="_setangebot_ersparnis_prozent" value="' . esc_attr($ersparnis_prozent) . '">';
    echo '</td></tr>';
    
    echo '</tbody></table>';
    echo '</div>'; // .setangebot-calculation
    
    echo '<p class="description" style="margin-top: 15px;">Die Preisberechnung basiert auf den ausgewählten Standard-Zusatzprodukten (Dämmung und Sockelleisten). Wenn Sie diese ändern, werden die Preise automatisch aktualisiert.</p>';
    
    // Zusätzliche Informationen über die ausgewählten Produkte und deren Preise
    // Lade die IDs für diese Funktion
    $daemmung_id = get_post_meta($post->ID, '_standard_addition_daemmung', true);
    $sockelleisten_id = get_post_meta($post->ID, '_standard_addition_sockelleisten', true);

    // Preise ermitteln
    $daemmung_price = 0;
    $sockelleisten_price = 0;

    if ($daemmung_id) {
        $daemmung_product = wc_get_product($daemmung_id);
        if ($daemmung_product) {
            $daemmung_price = $daemmung_product->get_price();
        }
    }

    if ($sockelleisten_id) {
        $sockelleisten_product = wc_get_product($sockelleisten_id);
        if ($sockelleisten_product) {
            $sockelleisten_price = $sockelleisten_product->get_price();
        }
    }

    echo '<div class="notice notice-info inline" style="margin-top: 10px;">';
    echo '<p><strong>Produktinformationen:</strong></p>';
    echo '<ul>';
    echo '<li>Dämmung: ' . ($daemmung_id ? 'ID #' . $daemmung_id . ' - Preis: € ' . number_format($daemmung_price, 2, ',', '.') : 'Keine ausgewählt') . '</li>';
    echo '<li>Sockelleisten: ' . ($sockelleisten_id ? 'ID #' . $sockelleisten_id . ' - Preis: € ' . number_format($sockelleisten_price, 2, ',', '.') : 'Keine ausgewählt') . '</li>';
    echo '</ul>';
    echo '</div>';
    
    echo '</div>'; // padding div
    echo '</div>'; // .options_group
    
    echo '</div>'; // #setangebot_product_data
}
add_action('woocommerce_product_data_panels', 'jaeger_add_setangebot_product_data_panels');

// AJAX Handler für die Preisberechnung
function jaeger_calculate_setangebot_prices() {
    check_ajax_referer('setangebot_price_calculation', 'nonce');
    
    $product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;
    $daemmung_id = isset($_POST['daemmung_id']) ? intval($_POST['daemmung_id']) : 0;
    $sockelleisten_id = isset($_POST['sockelleisten_id']) ? intval($_POST['sockelleisten_id']) : 0;
    $rabatt = isset($_POST['rabatt']) ? floatval($_POST['rabatt']) : 0;
    
    // Preise abrufen
    $product = wc_get_product($product_id);
    if (!$product) {
        wp_send_json_error(['message' => 'Produkt nicht gefunden']);
        return;
    }
    
    $product_price = $product->get_price();
    $daemmung_price = 0;
    $daemmung_name = '';
    $sockelleisten_price = 0;
    $sockelleisten_name = '';
    
    // Dämmung Preis
    if ($daemmung_id > 0) {
        $daemmung = wc_get_product($daemmung_id);
        if ($daemmung) {
            $daemmung_price = floatval($daemmung->get_price());
            $daemmung_name = $daemmung->get_name();
        }
    }
    
    // Sockelleisten Preis
    if ($sockelleisten_id > 0) {
        $sockelleisten = wc_get_product($sockelleisten_id);
        if ($sockelleisten) {
            $sockelleisten_price = floatval($sockelleisten->get_price());
            $sockelleisten_name = $sockelleisten->get_name();
        }
    }
    
    // Debug-Ausgabe im Backend für den Entwickler (kann später entfernt werden)
    error_log('Setangebot Preise: Daemmung=' . $daemmung_price . ', Sockelleisten=' . $sockelleisten_price);
    
    // UVP und Sale Preise ermitteln
    $show_uvp = get_post_meta($product_id, '_show_uvp', true) === 'yes';
    $uvp_price = get_post_meta($product_id, '_uvp', true);
    $regular_price = $product->get_regular_price();
    $sale_price = $product->get_sale_price();
    
    // DEBUG: Was bekommt das Backend?
    error_log("BACKEND DEBUG - Product ID: $product_id");
    error_log("show_uvp: " . ($show_uvp ? 'YES' : 'NO'));
    error_log("uvp_price: $uvp_price");
    error_log("regular_price: $regular_price");
    error_log("product_price: $product_price");
    
    // Höchsten Preis ermitteln für Ersparnis-Berechnung
    $highest_price = $product_price;
    if ($show_uvp && !empty($uvp_price)) {
        $highest_price = floatval($uvp_price);
        error_log("Using UVP as highest_price: $highest_price");
    } elseif (!empty($regular_price)) {
        $highest_price = floatval($regular_price);
        error_log("Using regular_price as highest_price: $highest_price");
    } else {
        error_log("Using product_price as highest_price: $highest_price");
    }
    
    // Niedrigsten Preis ermitteln (Sale Preis oder regulärer Preis)
    $lowest_price = $product_price;
    if (!empty($sale_price)) {
        $lowest_price = floatval($sale_price);
    }
    
    // Berechnungen für Set-Angebot
    // Einzelpreis: Höchster Preis + alle konfigurierten Standard-Zusatzprodukte (für Vergleich)
    $einzelpreis = $highest_price;
    if ($daemmung_id > 0 && $daemmung_price > 0) {
        $einzelpreis += $daemmung_price;
    }
    if ($sockelleisten_id > 0 && $sockelleisten_price > 0) {
        $einzelpreis += $sockelleisten_price;
    }
    
    // Set-Preis: Nur Bodenpreis (Standard-Zusatzprodukte sind kostenlos im Set enthalten!)
    $gesamtpreis = $lowest_price;
    
    // Rabatt anwenden, wenn vorhanden
    if ($rabatt > 0) {
        $gesamtpreis = $gesamtpreis * (1 - ($rabatt / 100));
    }
    
    $ersparnis_euro = $einzelpreis - $gesamtpreis;
    $ersparnis_prozent = ($einzelpreis > 0) ? ($ersparnis_euro / $einzelpreis * 100) : 0;
    
    $response = [
        'product_price' => $product_price,
        'highest_price' => $highest_price,
        'lowest_price' => $lowest_price,
        'show_uvp' => $show_uvp,
        'uvp_price' => $uvp_price ? floatval($uvp_price) : 0,
        'regular_price' => $regular_price ? floatval($regular_price) : 0,
        'sale_price' => $sale_price ? floatval($sale_price) : 0,
        'daemmung_price' => $daemmung_price,
        'daemmung_name' => $daemmung_name,
        'sockelleisten_price' => $sockelleisten_price,
        'sockelleisten_name' => $sockelleisten_name,
        'einzelpreis' => $einzelpreis,
        'gesamtpreis' => $gesamtpreis,
        'ersparnis_euro' => $ersparnis_euro,
        'ersparnis_prozent' => $ersparnis_prozent,
        'formatted' => [
            'product_price' => number_format($product_price, 2, ',', '.'),
            'highest_price' => number_format($highest_price, 2, ',', '.'),
            'lowest_price' => number_format($lowest_price, 2, ',', '.'),
            'uvp_price' => $uvp_price ? number_format(floatval($uvp_price), 2, ',', '.') : '0,00',
            'regular_price' => $regular_price ? number_format(floatval($regular_price), 2, ',', '.') : '0,00',
            'sale_price' => $sale_price ? number_format(floatval($sale_price), 2, ',', '.') : '0,00',
            'daemmung_price' => number_format($daemmung_price, 2, ',', '.'),
            'sockelleisten_price' => number_format($sockelleisten_price, 2, ',', '.'),
            'einzelpreis' => number_format($einzelpreis, 2, ',', '.'),
            'gesamtpreis' => number_format($gesamtpreis, 2, ',', '.'),
            'ersparnis_euro' => number_format($ersparnis_euro, 2, ',', '.'),
            'ersparnis_prozent' => number_format($ersparnis_prozent, 2, ',', '.')
        ]
    ];
    
    wp_send_json_success($response);
}
add_action('wp_ajax_jaeger_calculate_setangebot', 'jaeger_calculate_setangebot_prices');

// Save Funktionen für Setangebot
function jaeger_save_setangebot_fields($post_id) {
    // Keine Daten bei Autosave verarbeiten
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Nonce-Sicherheitsprüfung
    if (!isset($_POST['woocommerce_meta_nonce']) || !wp_verify_nonce($_POST['woocommerce_meta_nonce'], 'woocommerce_save_data')) {
        return;
    }

    // Berechtigung prüfen
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    // Überprüfen, ob es sich um ein Produkt handelt
    if (get_post_type($post_id) !== 'product') {
        return;
    }

    // Checkbox Werte
    $show_setangebot = isset($_POST['_show_setangebot']) ? 'yes' : 'no';
    update_post_meta($post_id, '_show_setangebot', $show_setangebot);

    // Text Eingaben
    if (isset($_POST['_setangebot_titel'])) {
        update_post_meta($post_id, '_setangebot_titel', sanitize_text_field($_POST['_setangebot_titel']));
    }

    // Styling
    if (isset($_POST['_setangebot_text_color'])) {
        update_post_meta($post_id, '_setangebot_text_color', sanitize_text_field($_POST['_setangebot_text_color']));
    }

    if (isset($_POST['_setangebot_text_size'])) {
        update_post_meta($post_id, '_setangebot_text_size', sanitize_text_field($_POST['_setangebot_text_size']));
    }

    if (isset($_POST['_setangebot_button_style'])) {
        update_post_meta($post_id, '_setangebot_button_style', sanitize_text_field($_POST['_setangebot_button_style']));
    }

    // Rabattwert
    $rabatt = 0;
    if (isset($_POST['_setangebot_rabatt'])) {
        $rabatt = floatval($_POST['_setangebot_rabatt']);
        update_post_meta($post_id, '_setangebot_rabatt', $rabatt);
    }

    // ============================================================
    // SERVERSIDE PREISBERECHNUNG BEIM SPEICHERN
    // ============================================================

    // Produkt laden
    $product = wc_get_product($post_id);
    if (!$product) {
        return;
    }

    // Zusatzprodukte-IDs aus dem aktuellen Save-Request holen
    $daemmung_id = isset($_POST['_standard_addition_daemmung']) ? intval($_POST['_standard_addition_daemmung']) : 0;
    $sockelleisten_id = isset($_POST['_standard_addition_sockelleisten']) ? intval($_POST['_standard_addition_sockelleisten']) : 0;

    // Preise der Zusatzprodukte ermitteln
    $daemmung_price = 0;
    $sockelleisten_price = 0;

    if ($daemmung_id > 0) {
        $daemmung = wc_get_product($daemmung_id);
        if ($daemmung) {
            $daemmung_price = floatval($daemmung->get_price());
        }
    }

    if ($sockelleisten_id > 0) {
        $sockelleisten = wc_get_product($sockelleisten_id);
        if ($sockelleisten) {
            $sockelleisten_price = floatval($sockelleisten->get_price());
        }
    }

    // UVP und Preise des Hauptprodukts
    $show_uvp = isset($_POST['_show_uvp']) ? ($_POST['_show_uvp'] === 'yes') : false;
    $uvp_price = isset($_POST['_uvp']) ? floatval($_POST['_uvp']) : 0;
    $regular_price = isset($_POST['_regular_price']) ? floatval($_POST['_regular_price']) : 0;
    $sale_price = isset($_POST['_sale_price']) ? floatval($_POST['_sale_price']) : 0;

    // Höchsten Preis ermitteln (für Vergleich)
    $highest_price = $regular_price;
    if ($show_uvp && $uvp_price > 0) {
        $highest_price = $uvp_price;
    }

    // Niedrigsten Preis ermitteln (für Set-Preis)
    $lowest_price = $regular_price;
    if ($sale_price > 0) {
        $lowest_price = $sale_price;
    }

    // BERECHNUNG
    // Einzelpreis = Höchster Preis + Dämmung + Sockelleiste
    $einzelpreis = $highest_price + $daemmung_price + $sockelleisten_price;

    // Set-Preis = Niedrigster Preis (Zusatzprodukte kostenlos im Set)
    $gesamtpreis = $lowest_price;

    // Rabatt anwenden
    if ($rabatt > 0) {
        $gesamtpreis = $gesamtpreis * (1 - ($rabatt / 100));
    }

    // Ersparnis berechnen
    $ersparnis_euro = $einzelpreis - $gesamtpreis;
    $ersparnis_prozent = ($einzelpreis > 0) ? ($ersparnis_euro / $einzelpreis * 100) : 0;

    // In Datenbank speichern
    update_post_meta($post_id, '_setangebot_einzelpreis', $einzelpreis);
    update_post_meta($post_id, '_setangebot_gesamtpreis', $gesamtpreis);
    update_post_meta($post_id, '_setangebot_ersparnis_euro', $ersparnis_euro);
    update_post_meta($post_id, '_setangebot_ersparnis_prozent', $ersparnis_prozent);

    // Debug-Log
    error_log("SAVE SETANGEBOT - Product $post_id: Einzelpreis=$einzelpreis, Gesamtpreis=$gesamtpreis, Ersparnis=$ersparnis_prozent%");
}
add_action('woocommerce_process_product_meta', 'jaeger_save_setangebot_fields');