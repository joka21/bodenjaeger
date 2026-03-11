<?php
/**
 * Jaeger Plugin Backend Functions
 *
 * @package JaegerPlugin
 * @since 1.0.0
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Enqueue admin styles for product edit pages
 *
 * @since 1.0.0
 * @return void
 */
function jaeger_enqueue_admin_styles() {
    // Only load on product edit pages
    $screen = get_current_screen();
    if ( ! $screen || 'post' !== $screen->base || 'product' !== $screen->post_type ) {
        return;
    }
    
    wp_enqueue_style(
        'jaeger-admin-styles',
        plugin_dir_url( __FILE__ ) . 'css/admin-style.css',
        array(),
        JAEGER_PLUGIN_VERSION
    );
}
add_action( 'admin_enqueue_scripts', 'jaeger_enqueue_admin_styles' );

/**
 * Enqueue admin scripts for product edit pages
 *
 * @since 1.0.0
 * @return void
 */
function jaeger_add_admin_scripts() {
    // Only load on product edit pages
    $screen = get_current_screen();
    if ( ! $screen || 'post' !== $screen->base || 'product' !== $screen->post_type ) {
        return;
    }
    
    wp_enqueue_script(
        'jaeger-calculations-js',
        plugin_dir_url( __FILE__ ) . 'js/calculations.js',
        array( 'jquery' ),
        JAEGER_PLUGIN_VERSION,
        true
    );
    
    wp_enqueue_script(
        'jaeger-plugin-js',
        plugin_dir_url( __FILE__ ) . 'js/jaeger-plugin.js',
        array( 'jquery' ),
        JAEGER_PLUGIN_VERSION,
        true
    );
}
add_action( 'admin_enqueue_scripts', 'jaeger_add_admin_scripts' );

/**
 * Add custom product data tab to WooCommerce product admin
 *
 * @since 1.0.0
 * @param array $tabs Existing product data tabs
 * @return array Modified tabs array
 */
function jaeger_add_product_data_tab( $tabs ) {
    if ( ! is_admin() ) {
        return $tabs;
    }
    
    $tabs['zusatzprodukte'] = array(
        'label'    => __( 'Zusatzprodukte', 'jaeger-plugin' ),
        'target'   => 'zusatzprodukte_product_data',
        'class'    => array(),
        'priority' => 21,
    );
    
    return $tabs;
}
add_filter( 'woocommerce_product_data_tabs', 'jaeger_add_product_data_tab' );

/**
 * Add custom product data panels to WooCommerce product admin
 *
 * @since 1.0.0
 * @return void
 */
function jaeger_add_product_data_panels() {
    // Only run in admin on product edit pages
    $screen = get_current_screen();
    if ( ! is_admin() || ! $screen || 'post' !== $screen->base || 'product' !== $screen->post_type ) {
        return;
    }
    
    echo '<div id="zusatzprodukte_product_data" class="panel woocommerce_options_panel">';
    jaeger_add_custom_fields_to_products();
    echo '</div>';
}
add_action('woocommerce_product_data_panels', 'jaeger_add_product_data_panels');

/**
 * Get products as options array with optimized caching
 *
 * @since 1.0.0
 * @param array $categories Product categories to query
 * @return array Array of product options for select fields
 */
function jaeger_get_products_as_options( $categories ) {
    if ( empty( $categories ) ) {
        return array( '' => __( 'Bitte wählen', 'jaeger-plugin' ) );
    }
    
    // Create cache key from categories
    $cache_key = 'jaeger_products_' . md5( implode( '_', $categories ) );
    
    // Try to get from transient cache first (more persistent than wp_cache)
    $options = get_transient( $cache_key );
    
    if ( false === $options ) {
        try {
            // Query products with limit and optimization
            $products = wc_get_products(
                array(
                    'status'     => 'publish',
                    'limit'      => 200, // Increased limit
                    'orderby'    => 'title',
                    'order'      => 'ASC',
                    'return'     => 'objects', // Return objects directly
                    'tax_query'  => array(
                        array(
                            'taxonomy' => 'product_cat',
                            'field'    => 'slug',
                            'terms'    => $categories,
                            'operator' => 'IN',
                        ),
                    ),
                    'meta_query' => array(
                        array(
                            'key'     => '_stock_status',
                            'value'   => 'instock',
                            'compare' => '=',
                        ),
                    ),
                )
            );

            $options = array( '' => __( 'Bitte wählen', 'jaeger-plugin' ) );
            
            foreach ( $products as $product ) {
                if ( $product && $product->is_purchasable() ) {
                    $options[ $product->get_id() ] = $product->get_name();
                }
            }
            
            // Cache results for 12 hours using transients (more persistent)
            set_transient( $cache_key, $options, 12 * HOUR_IN_SECONDS );
            
            // Also set in wp_cache for immediate requests
            wp_cache_set( $cache_key, $options, 'jaeger_plugin', 12 * HOUR_IN_SECONDS );
            
        } catch ( Exception $e ) {
            // Log error and return default options
            Jaeger_Error_Handler::log_error(
                'Error querying products: ' . $e->getMessage(),
                Jaeger_Error_Handler::ERROR_LEVEL_ERROR,
                array(
                    'categories' => $categories,
                    'function'   => __FUNCTION__,
                )
            );
            
            return array( '' => __( 'Fehler beim Laden der Produkte', 'jaeger-plugin' ) );
        }
    }
    
    return $options;
}

function render_multi_select($slug, $label) {
    global $post;
    
    if (!$post) return;
    
    $selected_values = explode(',', get_post_meta($post->ID, '_option_products_' . $slug, true));
    $selected_values = array_filter($selected_values); // Leere Einträge entfernen
    
    echo '<select id="_option_products_' . $slug . '" 
                 name="_option_products_' . $slug . '[]" 
                 multiple="multiple" 
                 class="wc-enhanced-select" 
                 data-placeholder="' . $label . ' auswählen">';
                 
    foreach(jaeger_get_products_as_options([$slug]) as $id => $name) {
        $selected = in_array($id, $selected_values) && $id !== '' ? ' selected="selected"' : '';
        if ($id !== '') { // Leeren Eintrag überspringen
            echo '<option value="' . esc_attr($id) . '"' . $selected . '>' . esc_html($name) . '</option>';
        }
    }
    echo '</select>';
}

function jaeger_add_custom_fields_to_products() {
    global $post;
    
    if (!$post) return;
    
    echo '<div class="options_group">';

    // HAUPTKATEGORIE: Dämmung
    echo '<div class="product-section">';
    echo '<h3 class="zusatzprodukte-heading">Dämmung</h3>';
    
    woocommerce_wp_select([
        'id' => '_standard_addition_daemmung',
        'label' => 'Standard Dämmung',
        'options' => jaeger_get_products_as_options(['daemmung']),
        'value' => get_post_meta($post->ID, '_standard_addition_daemmung', true)
    ]);
    
    echo '<div class="accessory-category">';
    echo '<p>Wählen Sie weitere Dämmprodukte aus:</p>';
    render_multi_select('daemmung', 'Dämmung');
    echo '</div>';
    
    echo '</div>'; // Ende Dämmung

    // HAUPTKATEGORIE: Sockelleisten
    echo '<div class="product-section">';
    echo '<h3 class="zusatzprodukte-heading">Sockelleisten</h3>';
    
    woocommerce_wp_select([
        'id' => '_standard_addition_sockelleisten',
        'label' => 'Standard Sockelleiste',
        'options' => jaeger_get_products_as_options(['sockelleisten']),
        'value' => get_post_meta($post->ID, '_standard_addition_sockelleisten', true)
    ]);
    
    echo '<div class="accessory-category">';
    echo '<p>Wählen Sie weitere Sockelleisten aus:</p>';
    render_multi_select('sockelleisten', 'Sockelleiste');
    echo '</div>';

   
    
    echo '</div>'; // Ende Sockelleisten

    // HAUPTKATEGORIE: Zubehör
echo '<div class="product-section">';
echo '<h3 class="zusatzprodukte-heading">Zubehör</h3>';

$zubehoer_categories = [
    'untergrundvorbereitung' => 'Untergrundvorbereitung',
    'werkzeug' => 'Werkzeug',
    'kleber' => 'Kleber',
    'montagekleber-silikon' => 'Montagekleber und Silikon',
    'zubehoer-fuer-sockelleisten' => 'Zubehör für Sockelleisten',
    'schienen-profile' => 'Schienen und Profile',
    'reinigung-pflege' => 'Reinigung und Pflege'
];

foreach($zubehoer_categories as $slug => $label) {
    echo '<div class="accessory-category">';
    echo '<h4 class="zusatzprodukte-subheading">' . esc_html($label) . '</h4>';
    render_multi_select($slug, $label);
    echo '</div>';
}

echo '</div>'; // Ende Zubehör

    echo '</div>'; // Ende options_group
}
// Save Handler - mit optimierter Verarbeitung
function jaeger_save_custom_fields_to_product($product) {
    // Keine Daten bei Autosave verarbeiten
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    // Nonce-Sicherheitsprüfung
    if (!isset($_POST['woocommerce_meta_nonce']) || !wp_verify_nonce($_POST['woocommerce_meta_nonce'], 'woocommerce_save_data')) {
        return;
    }
    
    // Berechtigung prüfen
    if (!current_user_can('edit_post', $product->get_id())) {
        return;
    }
    
    $fields = array_merge(
        ['daemmung', 'sockelleisten'],
        ['untergrundvorbereitung', 'werkzeug', 'kleber', 'montagekleber-silikon', 
         'zubehoer-fuer-sockelleisten', 'schienen-profile', 'reinigung-pflege'],
        ['klipse-zur-befestigung', 'montagekleber', 'werkzeug']
    );

    foreach($fields as $field) {
        // Standard-Addition-Felder
        if(in_array($field, ['daemmung', 'sockelleisten']) && isset($_POST["_standard_addition_$field"])) {
            $product->update_meta_data("_standard_addition_$field", 
                sanitize_text_field($_POST["_standard_addition_$field"]));
        }
        
        // Option-Products-Felder
        if(isset($_POST["_option_products_$field"])) {
            $value = is_array($_POST["_option_products_$field"]) ? 
                    implode(',', array_map('sanitize_text_field', $_POST["_option_products_$field"])) : 
                    sanitize_text_field($_POST["_option_products_$field"]);
            $product->update_meta_data("_option_products_$field", $value);
        }
    }
    
    // Invalidate product caches when product is updated
    jaeger_invalidate_product_caches();
    
    $product->save();
}

/**
 * Invalidate all product-related caches
 *
 * @since 1.0.1
 * @return void
 */
function jaeger_invalidate_product_caches() {
    $categories = array(
        'daemmung',
        'sockelleisten', 
        'untergrundvorbereitung',
        'werkzeug',
        'kleber',
        'montagekleber-silikon', 
        'zubehoer-fuer-sockelleisten',
        'schienen-profile',
        'reinigung-pflege',
        'klipse-zur-befestigung',
        'montagekleber',
    );
    
    // Clear both wp_cache and transients
    foreach ( $categories as $category ) {
        $cache_key = 'jaeger_products_' . md5( $category );
        
        // Clear wp_cache
        wp_cache_delete( $cache_key, 'jaeger_plugin' );
        
        // Clear transients
        delete_transient( $cache_key );
        
        // Clear combined category caches too
        foreach ( $categories as $second_category ) {
            if ( $category !== $second_category ) {
                $combined_key = 'jaeger_products_' . md5( $category . '_' . $second_category );
                wp_cache_delete( $combined_key, 'jaeger_plugin' );
                delete_transient( $combined_key );
            }
        }
    }
    
    // Log cache invalidation in debug mode
    if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
        Jaeger_Error_Handler::log_error(
            'Product caches invalidated',
            Jaeger_Error_Handler::ERROR_LEVEL_DEBUG,
            array( 'function' => __FUNCTION__ )
        );
    }
}

add_action('woocommerce_admin_process_product_object', 'jaeger_save_custom_fields_to_product', 10, 1);