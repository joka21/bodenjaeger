<?php
/**
 * Plugin Name: Jaeger Plugin
 * Plugin URI: https://example.com
 * Description: Verwaltung von Produkt-Paketen für E-Commerce auf WordPress mit WooCommerce Integration.
 * Version: 1.0.1
 * Author: Jo Kalenberg
 * Author URI: https://example.com
 * License: Private
 * Text Domain: jaeger-plugin
 * Domain Path: /languages
 * Requires at least: 5.0
 * Tested up to: 6.4
 * Requires PHP: 7.4
 * WC requires at least: 5.0
 * WC tested up to: 8.0
 * Woo: 8.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('JAEGER_PLUGIN_VERSION', '1.0.1');
define('JAEGER_PLUGIN_FILE', __FILE__);
define('JAEGER_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('JAEGER_PLUGIN_URL', plugin_dir_url(__FILE__));
define('JAEGER_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Main Jaeger Plugin Class
 */
class Jaeger_Plugin {
    
    /**
     * Plugin instance
     */
    private static $instance = null;
    
    /**
     * Get plugin instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        add_action('plugins_loaded', array($this, 'init'));
        register_activation_hook(JAEGER_PLUGIN_FILE, array($this, 'activate'));
        register_deactivation_hook(JAEGER_PLUGIN_FILE, array($this, 'deactivate'));
    }
    
    /**
     * Initialize plugin
     */
    public function init() {
        // Initialize autoloader
        $this->init_autoloader();
        
        // Initialize error handler
        $this->init_error_handler();
        
        // Check if WooCommerce is active
        if (!$this->is_woocommerce_active()) {
            add_action('admin_notices', array($this, 'woocommerce_missing_notice'));
            return;
        }
        
        // Load text domain for translations
        load_plugin_textdomain('jaeger-plugin', false, dirname(JAEGER_PLUGIN_BASENAME) . '/languages');
        
        // Declare HPOS compatibility
        $this->declare_hpos_compatibility();
        
        // Initialize components
        $this->load_dependencies();
        $this->init_hooks();
    }
    
    /**
     * Initialize autoloader
     */
    private function init_autoloader() {
        $autoloader_file = JAEGER_PLUGIN_PATH . 'includes/class-autoloader.php';
        if (file_exists($autoloader_file)) {
            require_once $autoloader_file;
            Jaeger_Plugin_Autoloader::init();
        }
    }
    
    /**
     * Initialize error handler
     */
    private function init_error_handler() {
        $error_handler_file = JAEGER_PLUGIN_PATH . 'includes/class-error-handler.php';
        if (file_exists($error_handler_file)) {
            require_once $error_handler_file;
            Jaeger_Error_Handler::init();
        }
    }
    
    /**
     * Check if WooCommerce is active
     */
    private function is_woocommerce_active() {
        return class_exists('WooCommerce');
    }
    
    /**
     * Show admin notice if WooCommerce is not active
     */
    public function woocommerce_missing_notice() {
        echo '<div class="notice notice-error"><p>';
        echo sprintf(
            /* translators: %s: Plugin name */
            __('%s requires WooCommerce to be installed and active.', 'jaeger-plugin'),
            '<strong>Jaeger Plugin</strong>'
        );
        echo '</p></div>';
    }
    
    /**
     * Load plugin dependencies
     */
    private function load_dependencies() {
        // Core components first
        $core_files = array(
            'includes/class-price-calculator.php',  // Zentrale Preisberechnungsklasse
        );
        
        foreach ($core_files as $file) {
            $file_path = JAEGER_PLUGIN_PATH . $file;
            if (file_exists($file_path)) {
                require_once $file_path;
            }
        }
        
        // Backend components only (Frontend-related files removed)
        $backend_files = array(
            'backend/backend-functions.php',
            'backend/backend-zusatzfelder.php',
            'backend/backend-setangebot.php',
            'backend/api-endpoints.php',           // REST API: Set-Angebot Berechnungen
            'backend/api-product-data.php',        // REST API: Produktdaten + Custom Fields
            'backend/backend-aktionen.php',
            // ACF Migration wird nur geladen wenn ACF verfügbar ist
            // 'backend/acf-migration.php',
            // 'backend/shortcodes-cards.php', // Frontend-only - deaktiviert
            'backend/warenkorb-integration.php',
            'backend/checkout-wc-compatibility.php'
        );

        // ACF Migration nur laden wenn ACF Plugin aktiv ist
        if (function_exists('get_field')) {
            $backend_files[] = 'backend/acf-migration.php';
        }

        // Use only backend files
        $all_files = $backend_files;
        
        // Load files with error handling
        foreach ($all_files as $file) {
            $filepath = JAEGER_PLUGIN_PATH . $file;
            error_log('Jaeger Plugin: Loading file - ' . $filepath);
            if (file_exists($filepath)) {
                require_once $filepath;
                error_log('Jaeger Plugin: Successfully loaded - ' . $file);
            } else {
                error_log('Jaeger Plugin: File not found - ' . $filepath);
                add_action('admin_notices', function() use ($file) {
                    echo '<div class="notice notice-warning"><p>';
                    echo sprintf(__('Jaeger Plugin: Missing file %s', 'jaeger-plugin'), $file);
                    echo '</p></div>';
                });
            }
        }
    }
    
    /**
     * Initialize hooks
     */
    private function init_hooks() {
        // Initialize backend only
        if (is_admin()) {
            add_action('init', array($this, 'init_backend'));
        }
    }

    /**
     * Initialize backend components
     */
    public function init_backend() {
        // Backend components are loaded via require_once and auto-initialize
    }
    
    /**
     * Plugin activation hook
     */
    public function activate() {
        // Check WordPress version
        if (version_compare(get_bloginfo('version'), '5.0', '<')) {
            wp_die(__('Jaeger Plugin requires WordPress 5.0 or higher.', 'jaeger-plugin'));
        }
        
        // Check PHP version
        if (version_compare(PHP_VERSION, '7.4', '<')) {
            wp_die(__('Jaeger Plugin requires PHP 7.4 or higher.', 'jaeger-plugin'));
        }
        
        // Check if WooCommerce is active
        if (!$this->is_woocommerce_active()) {
            wp_die(__('Jaeger Plugin requires WooCommerce to be installed and active.', 'jaeger-plugin'));
        }
        
        // Set activation flag
        update_option('jaeger_plugin_activated', true);
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    /**
     * Plugin deactivation hook
     */
    public function deactivate() {
        // Clean up on deactivation
        delete_option('jaeger_plugin_activated');
        
        // Clear any cached data
        wp_cache_flush();
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    /**
     * Get plugin version
     */
    public static function get_version() {
        return JAEGER_PLUGIN_VERSION;
    }
    
    /**
     * Get plugin path
     */
    public static function get_path() {
        return JAEGER_PLUGIN_PATH;
    }
    
    /**
     * Get plugin URL
     */
    public static function get_url() {
        return JAEGER_PLUGIN_URL;
    }
    
    /**
     * Declare HPOS compatibility
     */
    private function declare_hpos_compatibility() {
        add_action('before_woocommerce_init', function() {
            if (class_exists('\Automattic\WooCommerce\Utilities\FeaturesUtil')) {
                \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', JAEGER_PLUGIN_FILE, true);
            }
        });
    }
}

// Initialize the plugin
Jaeger_Plugin::get_instance();