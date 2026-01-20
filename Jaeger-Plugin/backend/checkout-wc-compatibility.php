<?php
/**
 * CheckoutWC Kompatibilitätserweiterung für Jaeger Plugin
 * Datei: backend/checkout-wc-compatibility.php
 */

if (!defined('ABSPATH')) {
    exit;
}

class Jaeger_CheckoutWC_Compatibility {
    
    public function __construct() {
        // Nur laden wenn CheckoutWC aktiv ist
        if (!$this->is_checkout_wc_active()) {
            return;
        }
        
        // CheckoutWC spezifische Hooks
        add_action('cfw_before_checkout_form_render', array($this, 'before_checkout_render'));
        add_action('cfw_after_checkout_form_render', array($this, 'after_checkout_render'));
        
        // Bundle-spezifische CheckoutWC Anpassungen
        add_filter('cfw_cart_item_data', array($this, 'modify_cart_item_display'), 10, 2);
        add_filter('cfw_order_review_item_name', array($this, 'modify_order_review_item'), 10, 2);
        
        // Performance Optimierungen für CheckoutWC
        add_action('cfw_checkout_updated', array($this, 'optimize_after_update'));
        add_filter('cfw_enable_cart_editing', array($this, 'restrict_bundle_editing'), 10, 2);
        
        // JavaScript für CheckoutWC
        add_action('cfw_checkout_before_form', array($this, 'add_checkout_javascript'));
        
        // CSS für CheckoutWC
        add_action('cfw_checkout_before_form', array($this, 'add_checkout_styles'));
    }
    
    /**
     * Prüfen ob CheckoutWC aktiv ist
     */
    private function is_checkout_wc_active() {
        return function_exists('cfw_get_checkout_url') && class_exists('CheckoutWC\Main');
    }
    
    /**
     * Vor CheckoutWC Render
     */
    public function before_checkout_render() {
        // Bundle-Preise sicherstellen
        $this->ensure_bundle_prices();
        
        // Cache optimieren
        $this->optimize_cache();
    }
    
    /**
     * Nach CheckoutWC Render
     */
    public function after_checkout_render() {
        // Zusätzliche Bundle-Validierung
        $this->validate_bundles_in_cart();
    }
    
    /**
     * Bundle-Preise sicherstellen
     */
    private function ensure_bundle_prices() {
        if (!WC()->cart || WC()->cart->is_empty()) {
            return;
        }
        
        $needs_recalc = false;
        
        foreach (WC()->cart->get_cart() as $cart_item) {
            if (isset($cart_item['jaeger_set_bundle_id']) && 
                isset($cart_item['jaeger_set_price_per_unit'])) {
                
                $current_price = $cart_item['data']->get_price();
                $expected_price = $cart_item['jaeger_set_price_per_unit'];
                
                if (abs($current_price - $expected_price) > 0.01) {
                    $cart_item['data']->set_price($expected_price);
                    $needs_recalc = true;
                }
            }
        }
        
        if ($needs_recalc) {
            WC()->cart->calculate_totals();
        }
    }
    
    /**
     * Cache optimieren
     */
    private function optimize_cache() {
        // CheckoutWC Fragment Cache leeren
        if (function_exists('cfw_clear_cache')) {
            cfw_clear_cache();
        }
        
        // WooCommerce Session Cache optimieren
        if (WC()->session) {
            WC()->session->set('cart_totals_' . md5(json_encode(WC()->cart->get_cart())), null);
        }
    }
    
    /**
     * Bundles im Warenkorb validieren
     */
    private function validate_bundles_in_cart() {
        if (!WC()->cart || WC()->cart->is_empty()) {
            return;
        }
        
        $bundles = array();
        $invalid_items = array();
        
        // Bundle-Struktur analysieren
        foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {
            if (isset($cart_item['jaeger_set_bundle_id'])) {
                $bundle_id = $cart_item['jaeger_set_bundle_id'];
                $type = $cart_item['jaeger_set_type'] ?? '';
                
                if (!isset($bundles[$bundle_id])) {
                    $bundles[$bundle_id] = array();
                }
                
                $bundles[$bundle_id][$type] = $cart_item_key;
                
                // Produktvalidierung
                if (!wc_get_product($cart_item['product_id'])) {
                    $invalid_items[] = $cart_item_key;
                }
            }
        }
        
        // Unvollständige oder fehlerhafte Bundles entfernen
        foreach ($bundles as $bundle_id => $bundle_items) {
            if (!isset($bundle_items['main'])) {
                // Bundle ohne Hauptprodukt ist ungültig
                foreach ($bundle_items as $item_key) {
                    $invalid_items[] = $item_key;
                }
            }
        }
        
        // Ungültige Items entfernen
        foreach (array_unique($invalid_items) as $item_key) {
            WC()->cart->remove_cart_item($item_key);
        }
        
        if (!empty($invalid_items)) {
            wc_add_notice('Einige Set-Angebote wurden entfernt, da sie nicht mehr verfügbar sind.', 'notice');
        }
    }
    
    /**
     * Cart Item Display modifizieren
     */
    public function modify_cart_item_display($item_data, $cart_item) {
        if (!isset($cart_item['jaeger_set_bundle_id'])) {
            return $item_data;
        }
        
        $type_labels = array(
            'main' => 'Bodenbelag',
            'daemmung' => 'Dämmung', 
            'sockelleisten' => 'Sockelleiste'
        );
        
        $type = $cart_item['jaeger_set_type'] ?? '';
        $type_label = $type_labels[$type] ?? $type;
        $quadratmeter = $cart_item['jaeger_set_quadratmeter'] ?? 0;
        $discount = $cart_item['jaeger_set_discount_percent'] ?? 0;
        
        // Set-Information hinzufügen
        $item_data[] = array(
            'key' => 'Set-Komponente',
            'value' => $type_label,
            'display' => $type_label
        );
        
        $item_data[] = array(
            'key' => 'Fläche',
            'value' => $quadratmeter . ' m²',
            'display' => $quadratmeter . ' m²'
        );
        
        if ($discount > 0) {
            $item_data[] = array(
                'key' => 'Set-Rabatt',
                'value' => '-' . round($discount) . '%',
                'display' => '<span style="color: #e53e3e; font-weight: bold;">-' . round($discount) . '%</span>'
            );
        }
        
        // Original-Preis anzeigen falls Rabatt vorhanden
        if (isset($cart_item['jaeger_set_original_price']) && $discount > 0) {
            $original_price = floatval($cart_item['jaeger_set_original_price']);
            $item_data[] = array(
                'key' => 'Einzelpreis',
                'value' => wc_price($original_price),
                'display' => '<span style="text-decoration: line-through; color: #999;">' . wc_price($original_price) . '</span>'
            );
        }
        
        return $item_data;
    }
    
    /**
     * Order Review Item Name modifizieren
     */
    public function modify_order_review_item($name, $cart_item) {
        if (isset($cart_item['jaeger_set_bundle_id'])) {
            $type_labels = array(
                'main' => '🏠 Bodenbelag',
                'daemmung' => '🧊 Dämmung',
                'sockelleisten' => '📏 Sockelleiste'
            );
            
            $type = $cart_item['jaeger_set_type'] ?? '';
            $icon_label = $type_labels[$type] ?? '🏠 ' . ucfirst($type);
            
            $name = $icon_label . ' • ' . $name;
            
            // Set-Badge hinzufügen
            $quadratmeter = $cart_item['jaeger_set_quadratmeter'] ?? 0;
            if ($quadratmeter > 0) {
                $name .= ' <small style="background: #e53e3e; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.7em;">Set ' . $quadratmeter . 'm²</small>';
            }
        }
        
        return $name;
    }
    
    /**
     * Nach CheckoutWC Update optimieren
     */
    public function optimize_after_update() {
        // Bundle-Integrität prüfen
        $this->validate_bundles_in_cart();
        
        // Performance: Unnötige Hooks temporär deaktivieren
        $this->temporarily_disable_heavy_hooks();
        
        // Cache nach Update leeren
        wp_cache_flush();
    }
    
    /**
     * Schwere Hooks temporär deaktivieren
     */
    private function temporarily_disable_heavy_hooks() {
        // Beispiel: Temporäres Deaktivieren von Plugin-Hooks die Performance beeinträchtigen
        remove_action('woocommerce_cart_updated', 'some_heavy_function');
        
        // Nach 5 Sekunden wieder aktivieren
        wp_schedule_single_event(time() + 5, 'jaeger_reactivate_hooks');
    }
    
    /**
     * Bundle-Bearbeitung einschränken
     */
    public function restrict_bundle_editing($allow_editing, $cart_item) {
        if (isset($cart_item['jaeger_set_bundle_id'])) {
            // Nur Hauptprodukt darf bearbeitet werden
            return ($cart_item['jaeger_set_type'] ?? '') === 'main';
        }
        
        return $allow_editing;
    }
    
    /**
     * JavaScript für CheckoutWC hinzufügen
     */
    public function add_checkout_javascript() {
        ?>
        <script>
        (function($) {
            'use strict';
            
            $(document).ready(function() {
                // CheckoutWC Bundle Management
                const JaegerCheckoutWC = {
                    
                    // Bundle-Items visuell gruppieren
                    groupBundleItems: function() {
                        const bundleGroups = {};
                        
                        $('.cfw-cart-item').each(function() {
                            const $item = $(this);
                            const bundleId = $item.find('[data-bundle-id]').data('bundle-id');
                            
                            if (bundleId) {
                                if (!bundleGroups[bundleId]) {
                                    bundleGroups[bundleId] = [];
                                }
                                bundleGroups[bundleId].push($item);
                            }
                        });
                        
                        // Bundle-Gruppierung anwenden
                        Object.keys(bundleGroups).forEach(bundleId => {
                            const items = bundleGroups[bundleId];
                            if (items.length > 1) {
                                this.styleBundleGroup(items);
                            }
                        });
                    },
                    
                    // Bundle-Gruppe stylen
                    styleBundleGroup: function(items) {
                        items.forEach((item, index) => {
                            item.addClass('jaeger-bundle-item');
                            
                            if (index === 0) {
                                item.addClass('bundle-first');
                            } else if (index === items.length - 1) {
                                item.addClass('bundle-last');
                            } else {
                                item.addClass('bundle-middle');
                            }
                        });
                    },
                    
                    // Bundle-Mengen synchronisieren
                    syncBundleQuantities: function() {
                        $(document).on('change', '.cfw-cart-item input[type="number"]', function() {
                            const $input = $(this);
                            const $item = $input.closest('.cfw-cart-item');
                            const bundleId = $item.find('[data-bundle-id]').data('bundle-id');
                            const itemType = $item.find('[data-item-type]').data('item-type');
                            
                            if (bundleId && itemType === 'main') {
                                const newQuantity = parseInt($input.val()) || 1;
                                
                                // Andere Bundle-Items aktualisieren
                                $('.cfw-cart-item').each(function() {
                                    const $otherItem = $(this);
                                    const otherBundleId = $otherItem.find('[data-bundle-id]').data('bundle-id');
                                    const otherType = $otherItem.find('[data-item-type]').data('item-type');
                                    
                                    if (otherBundleId === bundleId && otherType !== 'main' && otherType !== 'sockelleisten') {
                                        $otherItem.find('input[type="number"]').val(newQuantity).trigger('change');
                                    }
                                });
                            }
                        });
                    },
                    
                    // Bundle-Entfernung handhaben
                    handleBundleRemoval: function() {
                        $(document).on('click', '.cfw-remove-item', function() {
                            const $item = $(this).closest('.cfw-cart-item');
                            const bundleId = $item.find('[data-bundle-id]').data('bundle-id');
                            
                            if (bundleId) {
                                // Bestätigung für Bundle-Entfernung
                                if (!confirm('Möchten Sie das komplette Set-Angebot entfernen?')) {
                                    return false;
                                }
                                
                                // Alle Bundle-Items entfernen
                                $('.cfw-cart-item').each(function() {
                                    const $otherItem = $(this);
                                    const otherBundleId = $otherItem.find('[data-bundle-id]').data('bundle-id');
                                    
                                    if (otherBundleId === bundleId) {
                                        $otherItem.find('.cfw-remove-item').trigger('click');
                                    }
                                });
                            }
                        });
                    },
                    
                    // Initialisierung
                    init: function() {
                        this.groupBundleItems();
                        this.syncBundleQuantities();
                        this.handleBundleRemoval();
                        
                        // Bei CheckoutWC Updates erneut anwenden
                        $(document).on('cfw_updated_checkout', () => {
                            setTimeout(() => {
                                this.groupBundleItems();
                            }, 100);
                        });
                    }
                };
                
                // Bundle-Management initialisieren
                JaegerCheckoutWC.init();
            });
            
        })(jQuery);
        </script>
        <?php
    }
    
    /**
     * CSS für CheckoutWC hinzufügen
     */
    public function add_checkout_styles() {
        ?>
        <style>
        /* Bundle-Gruppierung Styles */
        .jaeger-bundle-item {
            position: relative;
            border-left: 4px solid #e53e3e !important;
            margin-left: 4px;
        }
        
        .jaeger-bundle-item.bundle-first {
            border-top-left-radius: 8px;
            margin-top: 8px;
        }
        
        .jaeger-bundle-item.bundle-last {
            border-bottom-left-radius: 8px;
            margin-bottom: 8px;
        }
        
        .jaeger-bundle-item.bundle-middle {
            border-radius: 0;
        }
        
        /* Bundle-Item Kennzeichnung */
        .jaeger-bundle-item::before {
            content: '🏠';
            position: absolute;
            left: -12px;
            top: 50%;
            transform: translateY(-50%);
            background: #e53e3e;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            z-index: 10;
        }
        
        /* Set-Information hervorheben */
        .cfw-cart-item-meta .jaeger-set-info {
            background: #f8f9fa;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.85em;
            color: #666;
            margin: 2px 0;
        }
        
        .cfw-cart-item-meta .discount {
            color: #e53e3e !important;
            font-weight: bold;
        }
        
        /* Bundle-Preis Highlights */
        .jaeger-bundle-item .cfw-cart-item-price {
            position: relative;
        }
        
        .jaeger-bundle-item .cfw-cart-item-price::after {
            content: 'Set-Preis';
            position: absolute;
            top: -18px;
            right: 0;
            font-size: 10px;
            color: #e53e3e;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        /* Mobile Optimierungen */
        @media (max-width: 768px) {
            .jaeger-bundle-item {
                margin-left: 2px;
                border-left-width: 3px;
            }
            
            .jaeger-bundle-item::before {
                left: -10px;
                width: 16px;
                height: 16px;
                font-size: 8px;
            }
        }
        
        /* CheckoutWC Theme Kompatibilität */
        .cfw-modern .jaeger-bundle-item,
        .cfw-classic .jaeger-bundle-item {
            box-shadow: 0 2px 4px rgba(229, 62, 62, 0.1);
        }
        
        /* Animation für Bundle-Hinzufügung */
        .jaeger-bundle-item.newly-added {
            animation: bundleSlideIn 0.5s ease-out;
        }
        
        @keyframes bundleSlideIn {
            from {
                transform: translateX(-100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        </style>
        <?php
    }
}

// Nur initialisieren wenn CheckoutWC aktiv ist
if (function_exists('cfw_get_checkout_url')) {
    new Jaeger_CheckoutWC_Compatibility();
}