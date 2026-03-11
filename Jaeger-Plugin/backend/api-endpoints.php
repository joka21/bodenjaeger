<?php
/**
 * Jaeger Plugin REST API Endpoints
 *
 * Set-Angebot Berechnungslogik - Migriert vom Next.js Frontend
 *
 * @package JaegerPlugin
 * @since 1.1.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * REST API Endpoints für Set-Angebot Berechnungen
 */
class Jaeger_API_Endpoints {

    /**
     * API Namespace
     */
    const NAMESPACE = 'jaeger/v1';

    /**
     * Constructor
     */
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    /**
     * Register REST API Routes
     */
    public function register_routes() {

        // Endpunkt 1: Mengenberechnung
        register_rest_route(self::NAMESPACE, '/calculate-quantities', array(
            'methods' => 'POST',
            'callback' => array($this, 'calculate_quantities'),
            'permission_callback' => '__return_true',
            'args' => array(
                'wantedM2' => array(
                    'required' => true,
                    'type' => 'number',
                    'validate_callback' => function($param) {
                        return is_numeric($param) && $param > 0;
                    }
                ),
                'floorProductId' => array(
                    'required' => true,
                    'type' => 'integer',
                    'validate_callback' => function($param) {
                        return is_numeric($param) && $param > 0;
                    }
                ),
                'insulationProductId' => array(
                    'required' => false,
                    'type' => 'integer'
                ),
                'baseboardProductId' => array(
                    'required' => false,
                    'type' => 'integer'
                )
            )
        ));

        // Endpunkt 2: Preisberechnung
        register_rest_route(self::NAMESPACE, '/calculate-prices', array(
            'methods' => 'POST',
            'callback' => array($this, 'calculate_prices'),
            'permission_callback' => '__return_true',
            'args' => array(
                'wantedM2' => array(
                    'required' => true,
                    'type' => 'number'
                ),
                'floorProductId' => array(
                    'required' => true,
                    'type' => 'integer'
                ),
                'insulationProductId' => array(
                    'required' => false,
                    'type' => 'integer'
                ),
                'baseboardProductId' => array(
                    'required' => false,
                    'type' => 'integer'
                )
            )
        ));

        // Endpunkt 3: Kombinierte Berechnung (Mengen + Preise)
        register_rest_route(self::NAMESPACE, '/calculate-set', array(
            'methods' => 'POST',
            'callback' => array($this, 'calculate_set_bundle'),
            'permission_callback' => '__return_true',
            'args' => array(
                'wantedM2' => array(
                    'required' => true,
                    'type' => 'number'
                ),
                'floorProductId' => array(
                    'required' => true,
                    'type' => 'integer'
                ),
                'insulationProductId' => array(
                    'required' => false,
                    'type' => 'integer'
                ),
                'baseboardProductId' => array(
                    'required' => false,
                    'type' => 'integer'
                )
            )
        ));

        // Endpunkt 4: Warenkorb-Vorbereitung
        register_rest_route(self::NAMESPACE, '/prepare-cart', array(
            'methods' => 'POST',
            'callback' => array($this, 'prepare_cart_items'),
            'permission_callback' => '__return_true',
            'args' => array(
                'wantedM2' => array(
                    'required' => true,
                    'type' => 'number'
                ),
                'floorProductId' => array(
                    'required' => true,
                    'type' => 'integer'
                ),
                'insulationProductId' => array(
                    'required' => false,
                    'type' => 'integer'
                ),
                'baseboardProductId' => array(
                    'required' => false,
                    'type' => 'integer'
                )
            )
        ));
    }

    /**
     * Endpunkt 1: Mengenberechnung
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response|WP_Error
     */
    public function calculate_quantities($request) {
        try {
            $wanted_m2 = floatval($request->get_param('wantedM2'));
            $floor_id = intval($request->get_param('floorProductId'));
            $insulation_id = $request->get_param('insulationProductId') ? intval($request->get_param('insulationProductId')) : null;
            $baseboard_id = $request->get_param('baseboardProductId') ? intval($request->get_param('baseboardProductId')) : null;

            // Floor Product validieren
            $floor_product = wc_get_product($floor_id);
            if (!$floor_product) {
                return new WP_Error('product_not_found', 'Floor product not found', array('status' => 404));
            }

            // Floor Mengen berechnen
            $paketinhalt = floatval(get_post_meta($floor_id, '_paketinhalt', true));
            if ($paketinhalt <= 0) {
                return new WP_Error('invalid_data', 'Paketinhalt not defined for floor product', array('status' => 400));
            }

            $floor_packages = $this->calculate_packages($wanted_m2, $paketinhalt);
            $actual_m2 = $floor_packages * $paketinhalt;

            $floor_data = array(
                'packages' => $floor_packages,
                'actualM2' => round($actual_m2, 2),
                'wantedM2' => round($wanted_m2, 2),
                'paketinhalt' => round($paketinhalt, 3),
                'wasteM2' => round($actual_m2 - $wanted_m2, 2)
            );

            // Insulation Mengen berechnen
            $insulation_data = null;
            if ($insulation_id) {
                $insulation_product = wc_get_product($insulation_id);
                if ($insulation_product) {
                    $insulation_paketinhalt = floatval(get_post_meta($insulation_id, '_paketinhalt', true));
                    if ($insulation_paketinhalt > 0) {
                        $insulation_packages = $this->calculate_packages($actual_m2, $insulation_paketinhalt);
                        $insulation_actual_m2 = $insulation_packages * $insulation_paketinhalt;

                        $insulation_data = array(
                            'packages' => $insulation_packages,
                            'actualM2' => round($insulation_actual_m2, 2),
                            'neededM2' => round($actual_m2, 2),
                            'paketinhalt' => round($insulation_paketinhalt, 3)
                        );
                    }
                }
            }

            // Baseboard Mengen berechnen
            $baseboard_data = null;
            if ($baseboard_id) {
                $baseboard_product = wc_get_product($baseboard_id);
                if ($baseboard_product) {
                    // Sockelleisten: 1 m² = 1 lfm (Business Rule)
                    $needed_lfm = $actual_m2 * 1.0;
                    $baseboard_paketinhalt = floatval(get_post_meta($baseboard_id, '_paketinhalt', true));

                    if ($baseboard_paketinhalt > 0) {
                        $baseboard_packages = $this->calculate_packages($needed_lfm, $baseboard_paketinhalt);
                        $baseboard_actual_lfm = $baseboard_packages * $baseboard_paketinhalt;

                        $baseboard_data = array(
                            'packages' => $baseboard_packages,
                            'actualLfm' => round($baseboard_actual_lfm, 2),
                            'neededLfm' => round($needed_lfm, 2),
                            'paketinhalt' => round($baseboard_paketinhalt, 3)
                        );
                    }
                }
            }

            $response = array(
                'floor' => $floor_data,
                'insulation' => $insulation_data,
                'baseboard' => $baseboard_data
            );

            return rest_ensure_response($response);

        } catch (Exception $e) {
            Jaeger_Error_Handler::log_error(
                'API calculate_quantities error: ' . $e->getMessage(),
                Jaeger_Error_Handler::ERROR_LEVEL_ERROR,
                array('request' => $request->get_params())
            );

            return new WP_Error('calculation_error', 'Calculation failed', array('status' => 500));
        }
    }

    /**
     * Endpunkt 2: Preisberechnung
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response|WP_Error
     */
    public function calculate_prices($request) {
        try {
            $wanted_m2 = floatval($request->get_param('wantedM2'));
            $floor_id = intval($request->get_param('floorProductId'));
            $insulation_id = $request->get_param('insulationProductId') ? intval($request->get_param('insulationProductId')) : null;
            $baseboard_id = $request->get_param('baseboardProductId') ? intval($request->get_param('baseboardProductId')) : null;

            // Erst Mengen berechnen
            $quantities_request = new WP_REST_Request('POST', '/jaeger/v1/calculate-quantities');
            $quantities_request->set_body_params($request->get_params());
            $quantities_response = $this->calculate_quantities($quantities_request);

            if (is_wp_error($quantities_response)) {
                return $quantities_response;
            }

            $quantities = $quantities_response->get_data();

            // Floor Product
            $floor_product = wc_get_product($floor_id);
            if (!$floor_product) {
                return new WP_Error('product_not_found', 'Floor product not found', array('status' => 404));
            }

            // Floor Preis berechnen
            $floor_price_per_package = $this->get_active_price_per_package($floor_id);
            $floor_packages = $quantities['floor']['packages'];
            $floor_total = round($floor_price_per_package * $floor_packages, 2);

            // Insulation Aufpreis berechnen
            $insulation_surcharge = 0;
            if ($insulation_id && $quantities['insulation']) {
                $insulation_surcharge = $this->calculate_insulation_surcharge(
                    $floor_id,
                    $insulation_id,
                    $quantities['insulation']['actualM2']
                );
            }

            // Baseboard Aufpreis berechnen
            $baseboard_surcharge = 0;
            if ($baseboard_id && $quantities['baseboard']) {
                $baseboard_surcharge = $this->calculate_baseboard_surcharge(
                    $floor_id,
                    $baseboard_id,
                    $quantities['baseboard']['actualLfm']
                );
            }

            // Gesamtpreis
            $total_display_price = round($floor_total + $insulation_surcharge + $baseboard_surcharge, 2);

            // Ersparnis berechnen (aus Backend-Feldern wenn vorhanden)
            $comparison_data = $this->calculate_savings(
                $floor_id,
                $total_display_price,
                $quantities['floor']['actualM2']
            );

            $response = array(
                'floorPrice' => $floor_total,
                'insulationSurcharge' => round($insulation_surcharge, 2),
                'baseboardSurcharge' => round($baseboard_surcharge, 2),
                'totalDisplayPrice' => $total_display_price,
                'comparisonPriceTotal' => $comparison_data['comparisonPriceTotal'],
                'savings' => $comparison_data['savings'],
                'savingsPercent' => $comparison_data['savingsPercent'],
                'pricePerM2' => $quantities['floor']['actualM2'] > 0
                    ? round($total_display_price / $quantities['floor']['actualM2'], 2)
                    : 0
            );

            return rest_ensure_response($response);

        } catch (Exception $e) {
            Jaeger_Error_Handler::log_error(
                'API calculate_prices error: ' . $e->getMessage(),
                Jaeger_Error_Handler::ERROR_LEVEL_ERROR,
                array('request' => $request->get_params())
            );

            return new WP_Error('calculation_error', 'Price calculation failed', array('status' => 500));
        }
    }

    /**
     * Endpunkt 3: Kombinierte Berechnung
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response|WP_Error
     */
    public function calculate_set_bundle($request) {
        try {
            // Mengen berechnen
            $quantities_request = new WP_REST_Request('POST', '/jaeger/v1/calculate-quantities');
            $quantities_request->set_body_params($request->get_params());
            $quantities_response = $this->calculate_quantities($quantities_request);

            if (is_wp_error($quantities_response)) {
                return $quantities_response;
            }

            // Preise berechnen
            $prices_request = new WP_REST_Request('POST', '/jaeger/v1/calculate-prices');
            $prices_request->set_body_params($request->get_params());
            $prices_response = $this->calculate_prices($prices_request);

            if (is_wp_error($prices_response)) {
                return $prices_response;
            }

            $response = array(
                'quantities' => $quantities_response->get_data(),
                'prices' => $prices_response->get_data()
            );

            return rest_ensure_response($response);

        } catch (Exception $e) {
            Jaeger_Error_Handler::log_error(
                'API calculate_set_bundle error: ' . $e->getMessage(),
                Jaeger_Error_Handler::ERROR_LEVEL_ERROR,
                array('request' => $request->get_params())
            );

            return new WP_Error('calculation_error', 'Set bundle calculation failed', array('status' => 500));
        }
    }

    /**
     * Endpunkt 4: Warenkorb-Vorbereitung
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response|WP_Error
     */
    public function prepare_cart_items($request) {
        try {
            $floor_id = intval($request->get_param('floorProductId'));
            $insulation_id = $request->get_param('insulationProductId') ? intval($request->get_param('insulationProductId')) : null;
            $baseboard_id = $request->get_param('baseboardProductId') ? intval($request->get_param('baseboardProductId')) : null;

            // Mengen berechnen
            $quantities_request = new WP_REST_Request('POST', '/jaeger/v1/calculate-quantities');
            $quantities_request->set_body_params($request->get_params());
            $quantities_response = $this->calculate_quantities($quantities_request);

            if (is_wp_error($quantities_response)) {
                return $quantities_response;
            }

            $quantities = $quantities_response->get_data();

            $cart_items = array();

            // Floor Item
            $cart_items[] = array(
                'productId' => $floor_id,
                'quantity' => $quantities['floor']['packages'],
                'type' => 'floor',
                'actualM2' => $quantities['floor']['actualM2']
            );

            // Insulation Item
            if ($insulation_id && $quantities['insulation']) {
                $cart_items[] = array(
                    'productId' => $insulation_id,
                    'quantity' => $quantities['insulation']['packages'],
                    'type' => 'insulation',
                    'actualM2' => $quantities['insulation']['actualM2']
                );
            }

            // Baseboard Item
            if ($baseboard_id && $quantities['baseboard']) {
                $cart_items[] = array(
                    'productId' => $baseboard_id,
                    'quantity' => $quantities['baseboard']['packages'],
                    'type' => 'baseboard',
                    'actualLfm' => $quantities['baseboard']['actualLfm']
                );
            }

            $response = array(
                'items' => $cart_items,
                'bundleId' => 'jaeger_set_' . time() . '_' . $floor_id
            );

            return rest_ensure_response($response);

        } catch (Exception $e) {
            Jaeger_Error_Handler::log_error(
                'API prepare_cart_items error: ' . $e->getMessage(),
                Jaeger_Error_Handler::ERROR_LEVEL_ERROR,
                array('request' => $request->get_params())
            );

            return new WP_Error('preparation_error', 'Cart preparation failed', array('status' => 500));
        }
    }

    // ==========================================
    // HELPER METHODS - Berechnungslogik
    // ==========================================

    /**
     * Pakete berechnen (aufrunden)
     *
     * @param float $target_m2 Gewünschte Quadratmeter
     * @param float $paketinhalt Inhalt pro Paket
     * @return int Anzahl Pakete
     */
    private function calculate_packages($target_m2, $paketinhalt) {
        if ($paketinhalt <= 0) {
            return 0;
        }
        return (int) ceil($target_m2 / $paketinhalt);
    }

    /**
     * Aktiven Preis pro Paket holen (Sale oder Regular)
     *
     * @param int $product_id
     * @return float Preis
     */
    private function get_active_price_per_package($product_id) {
        $paketpreis_s = floatval(get_post_meta($product_id, '_paketpreis_s', true));
        $paketpreis = floatval(get_post_meta($product_id, '_paketpreis', true));

        // Sale-Preis bevorzugen wenn vorhanden
        if ($paketpreis_s > 0) {
            return $paketpreis_s;
        }

        return $paketpreis > 0 ? $paketpreis : 0;
    }

    /**
     * Insulation Aufpreis berechnen
     *
     * Business Rule: Standard-Produkt ist kostenlos, nur Differenz zu Premium wird berechnet
     *
     * @param int $floor_id Hauptprodukt-ID
     * @param int $insulation_id Gewählte Dämmung-ID
     * @param float $actual_m2 Tatsächliche m²
     * @return float Aufpreis in Euro
     */
    private function calculate_insulation_surcharge($floor_id, $insulation_id, $actual_m2) {
        // Standard-Dämmung ID vom Hauptprodukt
        $standard_insulation_id = intval(get_post_meta($floor_id, '_standard_addition_daemmung', true));

        // Wenn gewähltes Produkt = Standard → kostenlos
        if ($insulation_id == $standard_insulation_id) {
            return 0;
        }

        // Standard-Preis
        $standard_product = wc_get_product($standard_insulation_id);
        $standard_price = $standard_product ? floatval($standard_product->get_price()) : 0;

        // Gewähltes Produkt Preis
        $selected_product = wc_get_product($insulation_id);
        $selected_price = $selected_product ? floatval($selected_product->get_price()) : 0;

        // Nur Differenz berechnen
        $price_diff_per_m2 = $selected_price - $standard_price;

        // Nur positive Aufpreise zurückgeben
        if ($price_diff_per_m2 <= 0) {
            return 0;
        }

        return $price_diff_per_m2 * $actual_m2;
    }

    /**
     * Baseboard Aufpreis berechnen
     *
     * Business Rule: Standard-Produkt ist kostenlos, nur Differenz zu Premium wird berechnet
     *
     * @param int $floor_id Hauptprodukt-ID
     * @param int $baseboard_id Gewählte Sockelleiste-ID
     * @param float $actual_lfm Tatsächliche Laufmeter
     * @return float Aufpreis in Euro
     */
    private function calculate_baseboard_surcharge($floor_id, $baseboard_id, $actual_lfm) {
        // Standard-Sockelleiste ID vom Hauptprodukt
        $standard_baseboard_id = intval(get_post_meta($floor_id, '_standard_addition_sockelleisten', true));

        // Wenn gewähltes Produkt = Standard → kostenlos
        if ($baseboard_id == $standard_baseboard_id) {
            return 0;
        }

        // Standard-Preis
        $standard_product = wc_get_product($standard_baseboard_id);
        $standard_price = $standard_product ? floatval($standard_product->get_price()) : 0;

        // Gewähltes Produkt Preis
        $selected_product = wc_get_product($baseboard_id);
        $selected_price = $selected_product ? floatval($selected_product->get_price()) : 0;

        // Nur Differenz berechnen
        $price_diff_per_lfm = $selected_price - $standard_price;

        // Nur positive Aufpreise zurückgeben
        if ($price_diff_per_lfm <= 0) {
            return 0;
        }

        return $price_diff_per_lfm * $actual_lfm;
    }

    /**
     * Ersparnis berechnen
     *
     * Priorität 1: Backend-berechnete Werte aus jaeger_meta
     * Priorität 2: Selbst berechnen (Fallback)
     *
     * @param int $floor_id Hauptprodukt-ID
     * @param float $total_display_price Berechneter Set-Preis
     * @param float $actual_m2 Tatsächliche m²
     * @return array Ersparnis-Daten
     */
    private function calculate_savings($floor_id, $total_display_price, $actual_m2) {
        // Priorität 1: Backend-Werte verwenden
        $einzelpreis_per_m2 = floatval(get_post_meta($floor_id, '_setangebot_einzelpreis', true));
        $gesamtpreis_per_m2 = floatval(get_post_meta($floor_id, '_setangebot_gesamtpreis', true));

        if ($einzelpreis_per_m2 > 0 && $gesamtpreis_per_m2 > 0) {
            $comparison_total = $einzelpreis_per_m2 * $actual_m2;
            $savings = $comparison_total - $total_display_price;
            $savings_percent = $comparison_total > 0 ? ($savings / $comparison_total) * 100 : 0;

            return array(
                'comparisonPriceTotal' => round($comparison_total, 2),
                'savings' => round($savings, 2),
                'savingsPercent' => round($savings_percent, 1)
            );
        }

        // Priorität 2: Fallback - Selbst berechnen
        // Vergleichspreis = Regulärer Preis Floor + Standard-Dämmung + Standard-Sockelleiste
        $floor_product = wc_get_product($floor_id);
        $regular_price_per_m2 = $floor_product ? floatval($floor_product->get_regular_price()) : 0;

        // UVP bevorzugen wenn gesetzt
        $uvp_per_m2 = floatval(get_post_meta($floor_id, '_uvp', true));
        if ($uvp_per_m2 > 0) {
            $regular_price_per_m2 = $uvp_per_m2;
        }

        // Standard-Dämmung Preis
        $standard_insulation_id = intval(get_post_meta($floor_id, '_standard_addition_daemmung', true));
        $standard_insulation_price = 0;
        if ($standard_insulation_id) {
            $insulation_product = wc_get_product($standard_insulation_id);
            $standard_insulation_price = $insulation_product ? floatval($insulation_product->get_price()) : 0;
        }

        // Standard-Sockelleiste Preis
        $standard_baseboard_id = intval(get_post_meta($floor_id, '_standard_addition_sockelleisten', true));
        $standard_baseboard_price = 0;
        if ($standard_baseboard_id) {
            $baseboard_product = wc_get_product($standard_baseboard_id);
            $standard_baseboard_price = $baseboard_product ? floatval($baseboard_product->get_price()) : 0;
        }

        // Vergleichspreis pro m² (Einzelkauf)
        $comparison_price_per_m2 = $regular_price_per_m2 + $standard_insulation_price + $standard_baseboard_price;
        $comparison_total = $comparison_price_per_m2 * $actual_m2;

        $savings = $comparison_total - $total_display_price;
        $savings_percent = $comparison_total > 0 ? ($savings / $comparison_total) * 100 : 0;

        // Nur positive Ersparnisse zurückgeben
        if ($savings <= 0) {
            return array(
                'comparisonPriceTotal' => null,
                'savings' => null,
                'savingsPercent' => null
            );
        }

        return array(
            'comparisonPriceTotal' => round($comparison_total, 2),
            'savings' => round($savings, 2),
            'savingsPercent' => round($savings_percent, 1)
        );
    }
}

// Initialize API Endpoints
new Jaeger_API_Endpoints();
