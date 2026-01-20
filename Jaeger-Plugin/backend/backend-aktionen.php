<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Definiere die verfügbaren Styling-Optionen - nur einmal definieren und cachen
function jaeger_get_style_options() {
    static $options = null;
    
    if ($options === null) {
        $options = array(
            'text_colors' => array(
                ''                   => 'Standard',
                'aktion-text-red'   => 'Rot',
                'aktion-text-blue'  => 'Blau',
                'aktion-text-green' => 'Grün',
                'aktion-text-yellow'=> 'Gelb',
                'aktion-text-white' => 'Weiß',
                'aktion-text-black' => 'Schwarz'
            ),
            'text_sizes' => array(
                ''                   => 'Standard',
                'aktion-text-sm'    => 'Klein',
                'aktion-text-base'  => 'Normal',
                'aktion-text-lg'    => 'Groß',
                'aktion-text-xl'    => 'Sehr Groß',
                'aktion-text-2xl'   => 'Extra Groß'
            ),
            'button_styles' => array(
                ''                   => 'Standard',
                'aktion-bg-red'     => 'Rot',
                'aktion-bg-blue'    => 'Blau',
                'aktion-bg-green'   => 'Grün',
                'aktion-bg-yellow'  => 'Gelb',
                'aktion-bg-gray'    => 'Grau'
            )
        );
    }
    
    return $options;
}

// Füge den neuen Tab hinzu - nur im Admin-Bereich
function jaeger_add_actions_product_data_tab($tabs) {
    // Nur in der Admin-Oberfläche ausführen
    if (!is_admin()) {
        return $tabs;
    }
    
    $tabs['aktionen'] = array(
        'label'    => __('Aktionen', 'woocommerce'),
        'target'   => 'aktionen_product_data',
        'class'    => array(),
        'priority' => 25,
    );
    return $tabs;
}
add_filter('woocommerce_product_data_tabs', 'jaeger_add_actions_product_data_tab');

// Füge den Inhalt für den neuen Tab hinzu - nur im Admin-Bereich
function jaeger_add_actions_product_data_panels() {
    // Nur in der Admin-Oberfläche und auf Produktbearbeitungsseiten ausführen
    if (!is_admin() || get_current_screen()->base !== 'post') {
        return;
    }
    
    global $post;
    
    // Nur für Produkte
    if (get_post_type($post->ID) !== 'product') {
        return;
    }
    
    $style_options = jaeger_get_style_options();
    
    echo '<div id="aktionen_product_data" class="panel woocommerce_options_panel">';
    
    // Aktion 1 Bereich
    echo '<div class="options_group"><h4 style="margin-left: 12px;">Aktion 1</h4>';
    
    woocommerce_wp_checkbox(
        array(
            'id'          => '_show_aktion',
            'label'       => __('Aktion anzeigen', 'woocommerce'),
            'desc_tip'    => false,
        )
    );

    woocommerce_wp_text_input(
        array(
            'id'          => '_aktion',
            'label'       => __('Aktion', 'woocommerce'),
            'placeholder' => 'Restposten',
            'desc_tip'    => 'true',
            'description' => __('Aktionstext für das Produkt', 'woocommerce'),
            'value'       => get_post_meta($post->ID, '_aktion', true) ?: 'Restposten'
        )
    );

    // Styling Optionen für Aktion 1
    woocommerce_wp_select(
        array(
            'id'      => '_aktion_text_color',
            'label'   => __('Textfarbe', 'woocommerce'),
            'options' => $style_options['text_colors'],
            'value'   => get_post_meta($post->ID, '_aktion_text_color', true)
        )
    );

    woocommerce_wp_select(
        array(
            'id'      => '_aktion_text_size',
            'label'   => __('Textgröße', 'woocommerce'),
            'options' => $style_options['text_sizes'],
            'value'   => get_post_meta($post->ID, '_aktion_text_size', true)
        )
    );

    woocommerce_wp_select(
        array(
            'id'      => '_aktion_button_style',
            'label'   => __('Button Stil', 'woocommerce'),
            'options' => $style_options['button_styles'],
            'value'   => get_post_meta($post->ID, '_aktion_button_style', true)
        )
    );

    echo '</div>';
    
    // Angebotspreis Hinweis Bereich
    echo '<div class="options_group"><h4 style="margin-left: 12px;">Angebotspreis Hinweis</h4>';

    woocommerce_wp_checkbox(
        array(
            'id'          => '_show_angebotspreis_hinweis',
            'label'       => __('Angebotspreis Hinweis anzeigen', 'woocommerce'),
            'desc_tip'    => false,
        )
    );

    woocommerce_wp_text_input(
        array(
            'id'          => '_angebotspreis_hinweis',
            'label'       => __('Angebotspreis Hinweis', 'woocommerce'),
            'placeholder' => 'Black Sale',
            'desc_tip'    => true,
            'description' => __('Dieser Text wird als H2 im Frontend angezeigt.', 'woocommerce'),
            'value'       => get_post_meta($post->ID, '_angebotspreis_hinweis', true) ?: 'Black Sale'
        )
    );

    // Styling Optionen für Angebotspreis
    woocommerce_wp_select(
        array(
            'id'      => '_angebotspreis_text_color',
            'label'   => __('Textfarbe', 'woocommerce'),
            'options' => $style_options['text_colors'],
            'value'   => get_post_meta($post->ID, '_angebotspreis_text_color', true)
        )
    );

    woocommerce_wp_select(
        array(
            'id'      => '_angebotspreis_text_size',
            'label'   => __('Textgröße', 'woocommerce'),
            'options' => $style_options['text_sizes'],
            'value'   => get_post_meta($post->ID, '_angebotspreis_text_size', true)
        )
    );

    woocommerce_wp_select(
        array(
            'id'      => '_angebotspreis_button_style',
            'label'   => __('Button Stil', 'woocommerce'),
            'options' => $style_options['button_styles'],
            'value'   => get_post_meta($post->ID, '_angebotspreis_button_style', true)
        )
    );
    
    echo '</div></div>';
}
add_action('woocommerce_product_data_panels', 'jaeger_add_actions_product_data_panels');

// Save Funktionen - Duplikat entfernt
function jaeger_save_actions_fields($post_id) {
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
    
    // Aktion 1 Felder
    $show_aktion = isset($_POST['_show_aktion']) ? 'yes' : 'no';
    update_post_meta($post_id, '_show_aktion', $show_aktion);

    if (isset($_POST['_aktion'])) {
        update_post_meta($post_id, '_aktion', sanitize_text_field($_POST['_aktion']));
    }

    // Aktion 1 Styling
    if (isset($_POST['_aktion_text_color'])) {
        update_post_meta($post_id, '_aktion_text_color', sanitize_text_field($_POST['_aktion_text_color']));
    }
    if (isset($_POST['_aktion_text_size'])) {
        update_post_meta($post_id, '_aktion_text_size', sanitize_text_field($_POST['_aktion_text_size']));
    }
    if (isset($_POST['_aktion_button_style'])) {
        update_post_meta($post_id, '_aktion_button_style', sanitize_text_field($_POST['_aktion_button_style']));
    }

    // Angebotspreis Felder
    $show_angebotspreis = isset($_POST['_show_angebotspreis_hinweis']) ? 'yes' : 'no';
    update_post_meta($post_id, '_show_angebotspreis_hinweis', $show_angebotspreis);

    if (isset($_POST['_angebotspreis_hinweis'])) {
        update_post_meta($post_id, '_angebotspreis_hinweis', sanitize_text_field($_POST['_angebotspreis_hinweis']));
    }

    // Angebotspreis Styling
    if (isset($_POST['_angebotspreis_text_color'])) {
        update_post_meta($post_id, '_angebotspreis_text_color', sanitize_text_field($_POST['_angebotspreis_text_color']));
    }
    if (isset($_POST['_angebotspreis_text_size'])) {
        update_post_meta($post_id, '_angebotspreis_text_size', sanitize_text_field($_POST['_angebotspreis_text_size']));
    }
    if (isset($_POST['_angebotspreis_button_style'])) {
        update_post_meta($post_id, '_angebotspreis_button_style', sanitize_text_field($_POST['_angebotspreis_button_style']));
    }
}
add_action('woocommerce_process_product_meta', 'jaeger_save_actions_fields');