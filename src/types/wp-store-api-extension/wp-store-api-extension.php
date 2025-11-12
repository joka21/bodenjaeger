<?php
/*
Plugin Name: WooCommerce Store API Extension for Jaeger
Plugin URI: https://example.com
Description: Extends the WooCommerce Store API to include custom fields from the Jaeger plugin in the product JSON response.
Version: 1.0.2
Author: Claude Code
Author URI: https://example.com
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 5.0
Tested up to: 6.4
Requires PHP: 7.4
WC requires at least: 7.0
WC tested up to: 9.0
Text Domain: jaeger-store-api-extension
Domain Path: /languages
Network: false
*/

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class to handle WooCommerce Store API extensions for Jaeger custom fields
 */
class Jaeger_Store_API_Extension {

    /**
     * List of custom fields to include in the API response
     */
    private $jaeger_custom_fields = [
        // Basis-Produktinformationen
        '_uvp',
        '_show_uvp',
        '_uvp_paketpreis',
        '_paketpreis',
        '_paketpreis_s',
        '_paketinhalt',
        '_einheit',
        '_einheit_short',
        '_verpackungsart',
        '_verpackungsart_short',
        '_verschnitt',
        '_artikelbeschreibung',
        '_text_produktuebersicht',
        '_show_text_produktuebersicht',
        '_lieferzeit',
        '_show_lieferzeit',
        // Set-Angebot Felder
        '_setangebot_titel',
        '_show_setangebot',
        '_setangebot_rabatt',
        '_setangebot_text_color',
        '_setangebot_text_size',
        '_setangebot_button_style',
        // Standard-Zusatzprodukte
        '_standard_addition_daemmung',
        '_standard_addition_sockelleisten',
        // Optionale Zusatzprodukte
        '_option_products_daemmung',
        '_option_products_sockelleisten',
        // Zubehör-Kategorien (7 zusätzliche Meta-Keys)
        '_option_products_werkzeug',
        '_option_products_kleber',
        '_option_products_montagekleber-silikon',
        '_option_products_zubehoer-fuer-sockelleisten',
        '_option_products_untergrundvorbereitung',
        '_option_products_schienen-profile',
        '_option_products_reinigung-pflege',
        // Aktions-System
        '_aktion',
        '_show_aktion',
        '_aktion_text_color',
        '_aktion_text_size',
        '_aktion_button_style',
        // Angebotspreis-Hinweis
        '_angebotspreis_hinweis',
        '_show_angebotspreis_hinweis',
        '_angebotspreis_text_color',
        '_angebotspreis_text_size',
        '_angebotspreis_button_style'
    ];

    /**
     * Initialize the extension
     */
    public function __construct() {
        add_action('init', [$this, 'init']);

        // Declare WooCommerce feature compatibility
        add_action('before_woocommerce_init', [$this, 'declare_woocommerce_compatibility']);
    }

    /**
     * Declare compatibility with WooCommerce features
     */
    public function declare_woocommerce_compatibility() {
        if (class_exists('\Automattic\WooCommerce\Utilities\FeaturesUtil')) {
            \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
            \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('cart_checkout_blocks', __FILE__, true);
        }
    }

    /**
     * Initialize hooks after WordPress is loaded
     */
    public function init() {
        // Check if WooCommerce is active
        if (!class_exists('WooCommerce')) {
            add_action('admin_notices', [$this, 'woocommerce_missing_notice']);
            return;
        }

        // Hook into REST API response - covers both Store API and REST API
        add_filter('rest_request_after_callbacks', [$this, 'modify_store_api_response'], 10, 3);

        // Also hook into the regular REST API for compatibility (/wc/v3/ endpoints)
        add_filter('woocommerce_rest_prepare_product_object', [$this, 'add_jaeger_meta_to_rest_api'], 10, 3);

        // Add debug logging
        add_action('init', [$this, 'debug_plugin_loaded']);
    }

    /**
     * Register Store API extension when WooCommerce Blocks is loaded
     */
    public function register_store_api_extension() {
        if (function_exists('woocommerce_store_api_register_endpoint_data')) {
            woocommerce_store_api_register_endpoint_data([
                'endpoint'        => \Automattic\WooCommerce\StoreApi\Schemas\V1\ProductSchema::IDENTIFIER,
                'namespace'       => 'jaeger-meta',
                'data_callback'   => [$this, 'get_jaeger_meta_data'],
                'schema_callback' => [$this, 'get_jaeger_meta_schema'],
            ]);
        } else {
            // Fallback: Hook into Store API response filter
            add_filter('woocommerce_store_api_product_data', [$this, 'add_jaeger_meta_to_store_response'], 10, 3);
        }
    }

    /**
     * Get Jaeger meta data for Store API
     */
    public function get_jaeger_meta_data($product) {
        if (!$product instanceof \WC_Product) {
            return [];
        }

        $jaeger_meta = [];
        $product_id = $product->get_id();

        foreach ($this->jaeger_custom_fields as $field) {
            $value = get_post_meta($product_id, $field, true);
            $clean_field_name = ltrim($field, '_');
            $jaeger_meta[$clean_field_name] = $this->format_field_value($field, $value);
        }

        return $jaeger_meta;
    }

    /**
     * Get Jaeger meta schema for Store API
     */
    public function get_jaeger_meta_schema() {
        return [
            'description' => 'Jaeger custom fields',
            'type'        => 'object',
            'readonly'    => true,
            'properties'  => [
                'uvp' => [
                    'description' => 'UVP price',
                    'type'        => ['number', 'null'],
                    'readonly'    => true,
                ],
                'show_uvp' => [
                    'description' => 'Show UVP flag',
                    'type'        => 'boolean',
                    'readonly'    => true,
                ],
                // Add more schema definitions as needed
            ],
        ];
    }

    /**
     * Fallback: Add Jaeger meta to Store API response using filter
     */
    public function add_jaeger_meta_to_store_response($product_data, $product, $request) {
        $jaeger_meta = $this->get_jaeger_meta_data($product);
        $product_data['jaeger_meta'] = $jaeger_meta;
        return $product_data;
    }

    /**
     * Modify Store API response after callbacks
     */
    public function modify_store_api_response($response, $handler, $request) {
        // Only modify Store API product requests
        $route = $request->get_route();
        if (strpos($route, '/wc/store/v1/products') === false) {
            return $response;
        }

        if (!($response instanceof WP_REST_Response)) {
            return $response;
        }

        $data = $response->get_data();

        // Check if this is a single product or product list
        if (is_array($data)) {
            // Product list
            foreach ($data as &$product_data) {
                if (isset($product_data['id'])) {
                    $product_data = $this->add_jaeger_meta_to_product_data($product_data);
                }
            }
        } elseif (isset($data['id'])) {
            // Single product
            $data = $this->add_jaeger_meta_to_product_data($data);
        }

        $response->set_data($data);

        if (defined('WP_DEBUG') && WP_DEBUG === true) {
            error_log('[Jaeger Store API] Modified Store API response for route: ' . $route);
        }

        return $response;
    }

    /**
     * Add Jaeger meta to individual product data array
     */
    private function add_jaeger_meta_to_product_data($product_data) {
        if (!isset($product_data['id'])) {
            return $product_data;
        }

        $product_id = $product_data['id'];
        $jaeger_meta = [];

        foreach ($this->jaeger_custom_fields as $field) {
            $value = get_post_meta($product_id, $field, true);
            $clean_field_name = ltrim($field, '_');
            $jaeger_meta[$clean_field_name] = $this->format_field_value($field, $value);
        }

        $product_data['jaeger_meta'] = $jaeger_meta;

        if (defined('WP_DEBUG') && WP_DEBUG === true) {
            error_log('[Jaeger Store API] Added jaeger_meta to product ID: ' . $product_id);
        }

        return $product_data;
    }

    /**
     * Debug plugin loaded
     */
    public function debug_plugin_loaded() {
        if (defined('WP_DEBUG') && WP_DEBUG === true) {
            error_log('[Jaeger Store API] Plugin loaded - Store API hooks registered');
        }
    }

    /**
     * Add Jaeger custom fields to regular REST API response (for compatibility)
     *
     * @param WP_REST_Response $response The response object
     * @param WC_Product $product Product object
     * @param WP_REST_Request $request Request object
     * @return WP_REST_Response Modified response
     */
    public function add_jaeger_meta_to_rest_api($response, $product, $request) {
        // Only add to Store API endpoints, not admin API
        $route = $request->get_route();
        if (strpos($route, '/wc/store/') !== false || strpos($route, '/wc/v') !== false) {
            return $this->add_jaeger_meta_to_store_api($response, $product, $request);
        }

        return $response;
    }

    /**
     * Format field values based on field type
     *
     * @param string $field_name The field name
     * @param mixed $value The field value
     * @return mixed Formatted value
     */
    private function format_field_value($field_name, $value) {
        // Handle boolean-like fields (show/hide flags)
        if (strpos($field_name, '_show_') !== false) {
            return $value === 'yes' || $value === '1' || $value === true;
        }

        // Handle price fields
        if (in_array($field_name, ['_uvp', '_paketpreis', '_paketpreis_s'])) {
            return $value !== '' ? floatval($value) : null;
        }

        // Handle numeric fields
        if (in_array($field_name, ['_paketinhalt', '_verschnitt', '_standard_addition_daemmung', '_standard_addition_sockelleisten'])) {
            return $value !== '' ? floatval($value) : null;
        }

        // Handle text fields - return as string or null if empty
        return $value !== '' ? $value : null;
    }

    /**
     * Admin notice if WooCommerce is not active
     */
    public function woocommerce_missing_notice() {
        echo '<div class="notice notice-error"><p>';
        echo '<strong>Jaeger Store API Extension:</strong> WooCommerce muss installiert und aktiviert sein.';
        echo '</p></div>';
    }
}

/**
 * Initialize the extension
 */
function init_jaeger_store_api_extension() {
    new Jaeger_Store_API_Extension();
}

// Hook into plugins_loaded to ensure WooCommerce is available
add_action('plugins_loaded', 'init_jaeger_store_api_extension');

/**
 * Plugin activation hook
 */
register_activation_hook(__FILE__, function() {
    // Check if WooCommerce is active
    if (!class_exists('WooCommerce')) {
        deactivate_plugins(plugin_basename(__FILE__));
        wp_die(
            '<strong>Jaeger Store API Extension</strong> benötigt WooCommerce. Bitte installieren und aktivieren Sie WooCommerce zuerst.',
            'Plugin Activation Error',
            ['back_link' => true]
        );
    }
});

/**
 * Add plugin to WordPress admin plugins list with proper headers
 */
if (!function_exists('get_plugin_data') && is_admin()) {
    require_once(ABSPATH . 'wp-admin/includes/plugin.php');
}

// Add plugin action links
add_filter('plugin_action_links_' . plugin_basename(__FILE__), function($links) {
    $settings_link = '<a href="admin.php?page=wc-settings&tab=api">WooCommerce API Settings</a>';
    array_unshift($links, $settings_link);
    return $links;
});

/**
 * Log function for debugging (only in development)
 */
if (!function_exists('jaeger_log')) {
    function jaeger_log($message) {
        if (defined('WP_DEBUG') && WP_DEBUG === true) {
            error_log('[Jaeger Store API] ' . $message);
        }
    }
}

// Add debug logging when fields are accessed
add_action('init', function() {
    if (defined('WP_DEBUG') && WP_DEBUG === true) {
        jaeger_log('Jaeger Store API Extension loaded successfully');
    }
});