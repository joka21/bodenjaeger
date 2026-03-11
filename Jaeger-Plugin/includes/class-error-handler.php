<?php
/**
 * Jaeger Plugin Error Handler
 *
 * @package JaegerPlugin
 * @since 1.0.1
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Unified Error Handler for Jaeger Plugin
 */
class Jaeger_Error_Handler {
    
    /**
     * Error levels
     */
    const ERROR_LEVEL_FATAL = 'fatal';
    const ERROR_LEVEL_ERROR = 'error';
    const ERROR_LEVEL_WARNING = 'warning';
    const ERROR_LEVEL_INFO = 'info';
    const ERROR_LEVEL_DEBUG = 'debug';
    
    /**
     * Initialize error handler
     */
    public static function init() {
        // Set custom error handler
        if (defined('WP_DEBUG') && WP_DEBUG) {
            set_error_handler(array(__CLASS__, 'handle_php_error'));
            set_exception_handler(array(__CLASS__, 'handle_exception'));
        }
    }
    
    /**
     * Handle PHP errors
     *
     * @param int $errno Error number
     * @param string $errstr Error message
     * @param string $errfile File where error occurred
     * @param int $errline Line where error occurred
     * @return bool
     */
    public static function handle_php_error($errno, $errstr, $errfile, $errline) {
        // Don't handle error if error reporting is turned off
        if (!(error_reporting() & $errno)) {
            return false;
        }
        
        $error_type = self::get_error_type($errno);
        $message = sprintf(
            'PHP %s: %s in %s on line %d',
            $error_type,
            $errstr,
            $errfile,
            $errline
        );
        
        self::log_error($message, self::ERROR_LEVEL_ERROR, array(
            'file' => $errfile,
            'line' => $errline,
            'type' => $error_type
        ));
        
        return true;
    }
    
    /**
     * Handle uncaught exceptions
     *
     * @param Throwable $exception The exception
     */
    public static function handle_exception($exception) {
        $message = sprintf(
            'Uncaught %s: %s in %s on line %d',
            get_class($exception),
            $exception->getMessage(),
            $exception->getFile(),
            $exception->getLine()
        );
        
        self::log_error($message, self::ERROR_LEVEL_FATAL, array(
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString()
        ));
        
        // Show user-friendly error message
        if (!wp_doing_ajax()) {
            wp_die(__('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.', 'jaeger-plugin'));
        } else {
            wp_send_json_error(__('Ein unerwarteter Fehler ist aufgetreten.', 'jaeger-plugin'));
        }
    }
    
    /**
     * Log error with context
     *
     * @param string $message Error message
     * @param string $level Error level
     * @param array $context Additional context information
     */
    public static function log_error($message, $level = self::ERROR_LEVEL_ERROR, $context = array()) {
        // Add plugin context
        $context['plugin'] = 'Jaeger Plugin';
        $context['version'] = JAEGER_PLUGIN_VERSION;
        $context['timestamp'] = current_time('mysql');
        
        // Format message with context
        $formatted_message = self::format_log_message($message, $level, $context);
        
        // Log to WordPress error log
        error_log($formatted_message);
        
        // Log to plugin-specific log file if debug is enabled
        if (defined('WP_DEBUG') && WP_DEBUG && defined('WP_DEBUG_LOG') && WP_DEBUG_LOG) {
            self::log_to_file($formatted_message);
        }
        
        // Store critical errors in database for admin review
        if (in_array($level, array(self::ERROR_LEVEL_FATAL, self::ERROR_LEVEL_ERROR))) {
            self::store_error_in_db($message, $level, $context);
        }
    }
    
    /**
     * Log AJAX errors with proper response
     *
     * @param string $message Error message
     * @param string $level Error level
     * @param array $context Additional context
     */
    public static function handle_ajax_error($message, $level = self::ERROR_LEVEL_ERROR, $context = array()) {
        self::log_error($message, $level, $context);
        
        // Send appropriate AJAX response
        if ($level === self::ERROR_LEVEL_FATAL) {
            wp_send_json_error(__('Ein schwerwiegender Fehler ist aufgetreten.', 'jaeger-plugin'));
        } else {
            wp_send_json_error($message);
        }
    }
    
    /**
     * Handle WooCommerce specific errors
     *
     * @param string $message Error message
     * @param array $context Additional context
     */
    public static function handle_woocommerce_error($message, $context = array()) {
        $context['component'] = 'WooCommerce Integration';
        self::log_error($message, self::ERROR_LEVEL_ERROR, $context);
        
        // Add WooCommerce notice if in frontend
        if (!is_admin() && function_exists('wc_add_notice')) {
            wc_add_notice($message, 'error');
        }
    }
    
    /**
     * Format log message
     *
     * @param string $message The message
     * @param string $level Error level
     * @param array $context Context data
     * @return string Formatted message
     */
    private static function format_log_message($message, $level, $context) {
        $formatted = sprintf(
            '[%s] [%s] %s',
            strtoupper($level),
            $context['plugin'] ?? 'Jaeger Plugin',
            $message
        );
        
        if (!empty($context['file']) && !empty($context['line'])) {
            $formatted .= sprintf(' (File: %s, Line: %d)', $context['file'], $context['line']);
        }
        
        return $formatted;
    }
    
    /**
     * Log to plugin-specific file
     *
     * @param string $message The message to log
     */
    private static function log_to_file($message) {
        $log_file = WP_CONTENT_DIR . '/debug-jaeger-plugin.log';
        $timestamp = current_time('Y-m-d H:i:s');
        $log_entry = sprintf("[%s] %s\n", $timestamp, $message);
        
        // Append to log file
        file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
        
        // Rotate log file if it gets too large (> 5MB)
        if (file_exists($log_file) && filesize($log_file) > 5 * 1024 * 1024) {
            self::rotate_log_file($log_file);
        }
    }
    
    /**
     * Store error in database for admin review
     *
     * @param string $message Error message
     * @param string $level Error level
     * @param array $context Context data
     */
    private static function store_error_in_db($message, $level, $context) {
        $error_data = array(
            'message' => $message,
            'level' => $level,
            'context' => wp_json_encode($context),
            'timestamp' => current_time('mysql'),
            'resolved' => 0
        );
        
        // Store in wp_options as transient (expires in 7 days)
        $errors = get_transient('jaeger_plugin_errors') ?: array();
        $errors[] = $error_data;
        
        // Keep only last 100 errors
        $errors = array_slice($errors, -100);
        
        set_transient('jaeger_plugin_errors', $errors, 7 * DAY_IN_SECONDS);
    }
    
    /**
     * Get stored errors for admin review
     *
     * @return array Array of stored errors
     */
    public static function get_stored_errors() {
        return get_transient('jaeger_plugin_errors') ?: array();
    }
    
    /**
     * Clear stored errors
     */
    public static function clear_stored_errors() {
        delete_transient('jaeger_plugin_errors');
    }
    
    /**
     * Rotate log file
     *
     * @param string $log_file Path to log file
     */
    private static function rotate_log_file($log_file) {
        $backup_file = $log_file . '.bak';
        if (file_exists($backup_file)) {
            unlink($backup_file);
        }
        rename($log_file, $backup_file);
    }
    
    /**
     * Get error type from errno
     *
     * @param int $errno Error number
     * @return string Error type
     */
    private static function get_error_type($errno) {
        $error_types = array(
            E_ERROR => 'Fatal Error',
            E_WARNING => 'Warning',
            E_PARSE => 'Parse Error',
            E_NOTICE => 'Notice',
            E_CORE_ERROR => 'Core Error',
            E_CORE_WARNING => 'Core Warning',
            E_COMPILE_ERROR => 'Compile Error',
            E_COMPILE_WARNING => 'Compile Warning',
            E_USER_ERROR => 'User Error',
            E_USER_WARNING => 'User Warning',
            E_USER_NOTICE => 'User Notice',
            E_STRICT => 'Strict Standards',
            E_RECOVERABLE_ERROR => 'Recoverable Error',
            E_DEPRECATED => 'Deprecated',
            E_USER_DEPRECATED => 'User Deprecated'
        );
        
        return $error_types[$errno] ?? 'Unknown Error';
    }
    
    /**
     * Create safe error message for users
     *
     * @param string $technical_message Technical error message
     * @return string User-friendly message
     */
    public static function get_user_friendly_message($technical_message) {
        // Map technical errors to user-friendly messages
        $error_mappings = array(
            'WooCommerce' => __('Es gab ein Problem mit dem Shop-System. Bitte versuchen Sie es später erneut.', 'jaeger-plugin'),
            'database' => __('Es gab ein Problem mit der Datenbank. Bitte versuchen Sie es später erneut.', 'jaeger-plugin'),
            'permission' => __('Sie haben nicht die erforderlichen Berechtigungen für diese Aktion.', 'jaeger-plugin'),
            'ajax' => __('Die Anfrage konnte nicht verarbeitet werden. Bitte laden Sie die Seite neu und versuchen Sie es erneut.', 'jaeger-plugin'),
        );
        
        foreach ($error_mappings as $keyword => $message) {
            if (stripos($technical_message, $keyword) !== false) {
                return $message;
            }
        }
        
        return __('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.', 'jaeger-plugin');
    }
}