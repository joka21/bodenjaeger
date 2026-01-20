<?php
/**
 * Zentrale Preisberechnung für Jaeger Plugin
 * Alle Preisberechnungen laufen über diese Klasse
 */

if (!defined('ABSPATH')) {
    exit;
}

class Jaeger_Price_Calculator {
    
    /**
     * UVP oder regulären Preis für ein Produkt holen
     * 
     * @param int $product_id Produkt-ID
     * @param WC_Product $product Optional: WooCommerce Produkt-Objekt
     * @param string $type 'per_unit' (pro m²/lfm) oder 'per_package' (pro Paket)
     * @return float Preis
     */
    public static function get_display_price($product_id, $product = null, $type = 'per_unit') {
        if (!$product) {
            $product = wc_get_product($product_id);
            if (!$product) {
                return 0;
            }
        }
        
        $show_uvp = get_post_meta($product_id, '_show_uvp', true);
        $uvp_enabled = ($show_uvp === 'yes');
        
        if ($uvp_enabled) {
            if ($type === 'per_package') {
                // UVP pro Paket bevorzugen
                $uvp_paketpreis = get_post_meta($product_id, '_uvp_paketpreis', true);
                if (!empty($uvp_paketpreis) && floatval($uvp_paketpreis) > 0) {
                    return floatval($uvp_paketpreis);
                }
            }
            
            // UVP pro Einheit
            $uvp_price = get_post_meta($product_id, '_uvp', true);
            if (!empty($uvp_price) && floatval($uvp_price) > 0) {
                return floatval($uvp_price);
            }
        }
        
        // Fallback: Regulärer WooCommerce-Preis
        return floatval($product->get_regular_price() ?: $product->get_price());
    }
    
    /**
     * Verkaufspreis für ein Produkt holen (Sale oder Regular)
     * 
     * @param int $product_id Produkt-ID
     * @param WC_Product $product Optional: WooCommerce Produkt-Objekt
     * @param string $type 'per_unit' oder 'per_package'
     * @return float Preis
     */
    public static function get_sale_price($product_id, $product = null, $type = 'per_unit') {
        if (!$product) {
            $product = wc_get_product($product_id);
            if (!$product) {
                return 0;
            }
        }
        
        if ($type === 'per_package') {
            // Sonderpreis pro Paket bevorzugen
            $paketpreis_s = get_post_meta($product_id, '_paketpreis_s', true);
            if (!empty($paketpreis_s) && floatval($paketpreis_s) > 0) {
                return floatval($paketpreis_s);
            }
            
            // Normal-Preis pro Paket
            $paketpreis = get_post_meta($product_id, '_paketpreis', true);
            if (!empty($paketpreis) && floatval($paketpreis) > 0) {
                return floatval($paketpreis);
            }
        }
        
        // Sale-Preis bevorzugen
        $sale_price = $product->get_sale_price();
        if (!empty($sale_price)) {
            return floatval($sale_price);
        }
        
        // Fallback: Regulärer Preis
        return floatval($product->get_price());
    }
    
    /**
     * Aufpreis für Nicht-Standard-Produkt berechnen
     * 
     * @param int $main_product_id Hauptprodukt-ID
     * @param int $selected_product_id Gewähltes Produkt-ID
     * @param string $category 'daemmung' oder 'sockelleisten'
     * @return float Aufpreis
     */
    public static function calculate_surcharge($main_product_id, $selected_product_id, $category) {
        // Standard-Produkt-ID holen
        $normalized_category = ($category === 'sockelleiste') ? 'sockelleisten' : $category;
        $standard_id = get_post_meta($main_product_id, '_standard_addition_' . $normalized_category, true);
        
        // Wenn gleiches Produkt wie Standard = kein Aufpreis
        if ($selected_product_id == $standard_id) {
            return 0;
        }
        
        $selected_product = wc_get_product($selected_product_id);
        $standard_product = wc_get_product($standard_id);
        
        if (!$selected_product || !$standard_product) {
            return 0;
        }
        
        $selected_price = floatval($selected_product->get_price());
        $standard_price = floatval($standard_product->get_price());
        
        // Nur positive Aufpreise zurückgeben
        return max(0, $selected_price - $standard_price);
    }
    
    /**
     * Set-Angebot Preise berechnen
     * 
     * @param int $main_product_id Hauptprodukt-ID
     * @param int $daemmung_id Dämmung-ID
     * @param int $sockelleisten_id Sockelleisten-ID
     * @param int $packages Anzahl Pakete
     * @param float $sqm Quadratmeter
     * @return array Berechnungsresultate
     */
    public static function calculate_set_prices($main_product_id, $daemmung_id = null, $sockelleisten_id = null, $packages = 1, $sqm = 0) {
        $main_product = wc_get_product($main_product_id);
        if (!$main_product) {
            return self::get_empty_calculation();
        }
        
        // Standard-IDs holen falls nicht übergeben
        if (!$daemmung_id) {
            $daemmung_id = get_post_meta($main_product_id, '_standard_addition_daemmung', true);
        }
        if (!$sockelleisten_id) {
            $sockelleisten_id = get_post_meta($main_product_id, '_standard_addition_sockelleisten', true);
        }
        
        // VERGLEICHSPREIS (UVP oder regulärer Preis)
        $main_comparison_price = self::get_display_price($main_product_id, $main_product);
        $daemmung_comparison_price = $daemmung_id ? self::get_display_price($daemmung_id) : 0;
        $sockelleisten_comparison_price = $sockelleisten_id ? self::get_display_price($sockelleisten_id) : 0;
        
        $comparison_total = $main_comparison_price + $daemmung_comparison_price + $sockelleisten_comparison_price;
        
        // SET-PREIS (Sale-Preis + Aufpreise)
        $main_set_price = self::get_sale_price($main_product_id, $main_product);
        $daemmung_surcharge = $daemmung_id ? self::calculate_surcharge($main_product_id, $daemmung_id, 'daemmung') : 0;
        $sockelleisten_surcharge = $sockelleisten_id ? self::calculate_surcharge($main_product_id, $sockelleisten_id, 'sockelleisten') : 0;
        
        $set_price_per_unit = $main_set_price + $daemmung_surcharge + $sockelleisten_surcharge;
        
        // Zusätzlicher Set-Rabatt
        $additional_discount = floatval(get_post_meta($main_product_id, '_setangebot_rabatt', true) ?: 0);
        if ($additional_discount > 0) {
            $set_price_per_unit *= (1 - $additional_discount / 100);
        }
        
        // GESAMT-PREISE für Paket-Anzahl
        $comparison_total_packages = $comparison_total * $packages;
        $set_total_packages = $set_price_per_unit * $packages;
        
        // ERSPARNIS
        $savings_euro = $comparison_total_packages - $set_total_packages;
        $savings_percent = $comparison_total_packages > 0 ? ($savings_euro / $comparison_total_packages) * 100 : 0;
        
        return array(
            'main_comparison_price' => $main_comparison_price,
            'daemmung_comparison_price' => $daemmung_comparison_price,
            'sockelleisten_comparison_price' => $sockelleisten_comparison_price,
            'comparison_total' => $comparison_total,
            'comparison_total_packages' => $comparison_total_packages,
            
            'main_set_price' => $main_set_price,
            'daemmung_surcharge' => $daemmung_surcharge,
            'sockelleisten_surcharge' => $sockelleisten_surcharge,
            'set_price_per_unit' => $set_price_per_unit,
            'set_total_packages' => $set_total_packages,
            
            'savings_euro' => $savings_euro,
            'savings_percent' => $savings_percent,
            'additional_discount' => $additional_discount,
            
            'packages' => $packages,
            'sqm' => $sqm,
            
            'formatted' => array(
                'comparison_total_packages' => wc_price($comparison_total_packages),
                'set_total_packages' => wc_price($set_total_packages),
                'savings_euro' => wc_price($savings_euro),
                'savings_percent' => round($savings_percent, 1) . '%'
            )
        );
    }
    
    /**
     * Leere Berechnung zurückgeben
     */
    private static function get_empty_calculation() {
        return array(
            'main_comparison_price' => 0,
            'daemmung_comparison_price' => 0,
            'sockelleisten_comparison_price' => 0,
            'comparison_total' => 0,
            'comparison_total_packages' => 0,
            'main_set_price' => 0,
            'daemmung_surcharge' => 0,
            'sockelleisten_surcharge' => 0,
            'set_price_per_unit' => 0,
            'set_total_packages' => 0,
            'savings_euro' => 0,
            'savings_percent' => 0,
            'additional_discount' => 0,
            'packages' => 0,
            'sqm' => 0,
            'formatted' => array(
                'comparison_total_packages' => wc_price(0),
                'set_total_packages' => wc_price(0),
                'savings_euro' => wc_price(0),
                'savings_percent' => '0%'
            )
        );
    }
}