<?php
/**
 * Jaeger Plugin Autoloader
 *
 * @package JaegerPlugin
 * @since 1.0.1
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Jaeger Plugin Autoloader Class
 */
class Jaeger_Plugin_Autoloader {
    
    /**
     * Class map for direct loading
     */
    private static $class_map = array(
        'Jaeger_Warenkorb_Integration' => 'backend/class-jaeger-warenkorb-integration.php',
        'Jaeger_CheckoutWC_Compatibility' => 'backend/class-jaeger-checkout-wc-compatibility.php',
    );
    
    /**
     * Initialize autoloader
     */
    public static function init() {
        spl_autoload_register(array(__CLASS__, 'autoload'));
    }
    
    /**
     * Autoload classes
     *
     * @param string $class_name The class name to load
     */
    public static function autoload($class_name) {
        // Check if this is a Jaeger plugin class
        if (strpos($class_name, 'Jaeger_') !== 0 && !isset(self::$class_map[$class_name])) {
            return;
        }
        
        $file = self::get_class_file($class_name);
        
        if ($file && file_exists($file)) {
            require_once $file;
        }
    }
    
    /**
     * Get the file path for a class
     *
     * @param string $class_name The class name
     * @return string|false The file path or false if not found
     */
    private static function get_class_file($class_name) {
        // Check class map first
        if (isset(self::$class_map[$class_name])) {
            return JAEGER_PLUGIN_PATH . self::$class_map[$class_name];
        }
        
        // Convert class name to file name using WordPress conventions
        $file_name = self::class_name_to_file_name($class_name);
        
        // Try different locations
        $locations = array(
            'includes/',
            'backend/',
        );
        
        foreach ($locations as $location) {
            $file_path = JAEGER_PLUGIN_PATH . $location . $file_name;
            if (file_exists($file_path)) {
                return $file_path;
            }
        }
        
        return false;
    }
    
    /**
     * Convert class name to file name
     *
     * @param string $class_name The class name
     * @return string The file name
     */
    private static function class_name_to_file_name($class_name) {
        // Convert CamelCase to kebab-case with WordPress conventions
        $file_name = strtolower($class_name);
        $file_name = str_replace('_', '-', $file_name);
        
        // Add class- prefix if not present
        if (strpos($file_name, 'class-') !== 0) {
            $file_name = 'class-' . $file_name;
        }
        
        return $file_name . '.php';
    }
    
    /**
     * Register a class manually
     *
     * @param string $class_name The class name
     * @param string $file_path The file path relative to plugin root
     */
    public static function register_class($class_name, $file_path) {
        self::$class_map[$class_name] = $file_path;
    }
    
    /**
     * Load a specific class
     *
     * @param string $class_name The class name to load
     * @return bool True if loaded successfully, false otherwise
     */
    public static function load_class($class_name) {
        $file = self::get_class_file($class_name);
        
        if ($file && file_exists($file)) {
            require_once $file;
            return true;
        }
        
        return false;
    }
}