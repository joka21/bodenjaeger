<?php
/**
 * KORRIGIERTE Warenkorb Integration für Jaeger Set-Angebote
 * Datei: backend/warenkorb-integration.php
 */

if (!defined('ABSPATH')) {
    exit;
}

class Jaeger_Warenkorb_Integration {
    
    private $bundle_cache = array();
    
    public function __construct() {
        // AJAX Handler
        add_action('wp_ajax_jaeger_add_set_to_cart', array($this, 'add_set_to_cart'));
        add_action('wp_ajax_nopriv_jaeger_add_set_to_cart', array($this, 'add_set_to_cart'));
        
        // Zusätzliche Hooks für Bundle-Verwaltung
        add_filter('woocommerce_cart_item_remove_link', array($this, 'maybe_disable_remove_link'), 10, 2);
        add_filter('woocommerce_cart_item_quantity', array($this, 'maybe_disable_quantity_input'), 10, 3);
        
        // Cart Item Hooks
        add_filter('woocommerce_add_cart_item_data', array($this, 'add_cart_item_data'), 10, 3);
        add_filter('woocommerce_get_cart_item_from_session', array($this, 'get_cart_item_from_session'), 10, 3);
        
        // Preisberechnung
        add_action('woocommerce_before_calculate_totals', array($this, 'before_calculate_totals'), 99, 1);
        
        // Cart Display Hooks
        add_filter('woocommerce_cart_item_name', array($this, 'cart_item_name'), 10, 3);
        add_filter('woocommerce_cart_item_quantity', array($this, 'cart_item_quantity'), 10, 3);
        
        // Bundle-Management
        add_action('woocommerce_cart_item_removed', array($this, 'handle_bundle_removal'), 10, 2);
        add_action('woocommerce_after_cart_item_quantity_update', array($this, 'sync_bundle_quantities'), 10, 4);
        
        // CheckoutWC spezifische Hooks
        if (function_exists('cfw_get_checkout_url')) {
            add_filter('cfw_cart_item_data', array($this, 'checkout_wc_item_data'), 10, 2);
        }
        
        // Order Creation
        add_action('woocommerce_checkout_create_order_line_item', array($this, 'checkout_create_order_line_item'), 10, 4);
        
        // JavaScript
        add_action('wp_footer', array($this, 'add_optimized_cart_javascript'));
    }
    
    /**
     * KORRIGIERTER AJAX Handler für Set-Warenkorb
     */
    public function add_set_to_cart() {
        // KORRIGIERT: Verwende den gleichen Nonce wie das Frontend
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'jaeger_setangebot_nonce')) {
            error_log('Jaeger Plugin - Warenkorb: Nonce validation failed');
            wp_send_json_error(array('message' => 'Sicherheitsprüfung fehlgeschlagen'));
            return;
        }
        
        // WooCommerce initialisieren
        if (!did_action('woocommerce_init')) {
            wc_load_cart();
        }
        
        if (!WC()->session) {
            WC()->initialize_session();
        }
        
        if (!WC()->session->has_session()) {
            WC()->session->set_customer_session_cookie(true);
        }
        
        try {
            // KORRIGIERT: Verwende die gleichen Parameter-Namen wie das Frontend
            $main_product_id = isset($_POST['product_id']) ? absint($_POST['product_id']) : 0;
            $daemmung_id = isset($_POST['selected_daemmung']) ? absint($_POST['selected_daemmung']) : 0;
            $sockelleisten_id = isset($_POST['selected_sockelleisten']) ? absint($_POST['selected_sockelleisten']) : 0;
            $quadratmeter = isset($_POST['sqm']) ? floatval($_POST['sqm']) : 0;
            $pakete = isset($_POST['packages']) ? max(1, absint($_POST['packages'])) : 1;
            
            // ERWEITERTE Debug-Ausgabe für Sockelleisten-Problem
            error_log('=== WARENKORB DEBUG START ===');
            error_log('Frontend sendete: selected_sockelleisten = ' . ($_POST['selected_sockelleisten'] ?? 'NOT_SET'));
            error_log('Nach absint(): sockelleisten_id = ' . $sockelleisten_id);
            
            error_log('Jaeger Plugin - Warenkorb Handler - Empfangene Daten: ' . print_r([
                'product_id' => $main_product_id,
                'selected_daemmung' => $daemmung_id,
                'selected_sockelleisten' => $sockelleisten_id,
                'sqm' => $quadratmeter,
                'packages' => $pakete
            ], true));
            
            if ($main_product_id <= 0 || $pakete <= 0) {
                error_log('Jaeger Plugin - Warenkorb: Ungültige Parameter - Product ID: ' . $main_product_id . ', Packages: ' . $pakete);
                throw new Exception('Ungültige Eingabedaten: Hauptprodukt und Pakete sind erforderlich');
            }
            
            // Produkte validieren
            $main_product = wc_get_product($main_product_id);
            if (!$main_product || $main_product->get_status() !== 'publish') {
                throw new Exception('Hauptprodukt nicht verfügbar');
            }
            
            // KORRIGIERT: Standard-Produkte laden falls keine explizit ausgewählt
            if ($daemmung_id <= 0) {
                $daemmung_id = get_post_meta($main_product_id, '_standard_addition_daemmung', true);
                error_log('Jaeger Plugin - Using standard daemmung: ' . $daemmung_id);
            }
            if ($sockelleisten_id <= 0) {
                $old_sockelleisten_id = $sockelleisten_id;
                $sockelleisten_id = get_post_meta($main_product_id, '_standard_addition_sockelleisten', true);
                error_log('Jaeger Plugin - PROBLEM: Frontend sendete sockelleisten_id=' . $old_sockelleisten_id . ', verwende Standard: ' . $sockelleisten_id);
                error_log('Jaeger Plugin - URSACHE: Frontend sendet möglicherweise falsche/leere Sockelleisten-ID!');
            } else {
                error_log('Jaeger Plugin - Frontend sendete korrekte sockelleisten_id: ' . $sockelleisten_id);
            }
            
            $daemmung = null;
            $sockelleisten = null;
            
            if ($daemmung_id > 0) {
                $daemmung = wc_get_product($daemmung_id);
                if (!$daemmung || $daemmung->get_status() !== 'publish') {
                    error_log('Jaeger Plugin - Daemmung not available: ' . $daemmung_id);
                    // Nicht als Fehler behandeln, Set kann auch ohne Dämmung funktionieren
                    $daemmung = null;
                    $daemmung_id = 0;
                }
            }
            
            if ($sockelleisten_id > 0) {
                $sockelleisten = wc_get_product($sockelleisten_id);
                if (!$sockelleisten || $sockelleisten->get_status() !== 'publish') {
                    error_log('Jaeger Plugin - Sockelleisten not available: ' . $sockelleisten_id);
                    // Nicht als Fehler behandeln, Set kann auch ohne Sockelleisten funktionieren
                    $sockelleisten = null;
                    $sockelleisten_id = 0;
                }
            }
            
            // KORRIGIERTE Preisberechnung
            $paketinhalt = floatval(get_post_meta($main_product_id, '_paketinhalt', true) ?: 1);
            $zusatz_rabatt = floatval(get_post_meta($main_product_id, '_setangebot_rabatt', true) ?: 0);
            $rabatt_faktor = $zusatz_rabatt > 0 ? (1 - ($zusatz_rabatt / 100)) : 1;
            
            // ERWEITERT: Standard-Preise auch mit Paketpreis-Logik laden
            $standard_daemmung_price = 0;
            $standard_sockelleisten_price = 0;
            
            $standard_daemmung_id = get_post_meta($main_product_id, '_standard_addition_daemmung', true);
            $standard_sockelleisten_id = get_post_meta($main_product_id, '_standard_addition_sockelleisten', true);
            
            // Standard-Dämmung mit Paketpreis-Logik
            if ($standard_daemmung_id) {
                $standard_daemmung = wc_get_product($standard_daemmung_id);
                if ($standard_daemmung) {
                    $std_daemmung_paketpreis = get_post_meta($standard_daemmung_id, '_paketpreis', true);
                    $std_daemmung_paketpreis_s = get_post_meta($standard_daemmung_id, '_paketpreis_s', true);
                    
                    if (!empty($std_daemmung_paketpreis_s)) {
                        $standard_daemmung_price = floatval($std_daemmung_paketpreis_s);
                    } elseif (!empty($std_daemmung_paketpreis)) {
                        $standard_daemmung_price = floatval($std_daemmung_paketpreis);
                    } else {
                        $standard_daemmung_price = floatval($standard_daemmung->get_price());
                    }
                    error_log("Standard-Dämmung Preis: {$standard_daemmung_price}");
                }
            }
            
            // Standard-Sockelleiste mit Paketpreis-Logik
            if ($standard_sockelleisten_id) {
                $standard_sockelleisten = wc_get_product($standard_sockelleisten_id);
                if ($standard_sockelleisten) {
                    $std_sockel_paketpreis = get_post_meta($standard_sockelleisten_id, '_paketpreis', true);
                    $std_sockel_paketpreis_s = get_post_meta($standard_sockelleisten_id, '_paketpreis_s', true);
                    
                    if (!empty($std_sockel_paketpreis_s)) {
                        $standard_sockelleisten_price = floatval($std_sockel_paketpreis_s);
                    } elseif (!empty($std_sockel_paketpreis)) {
                        $standard_sockelleisten_price = floatval($std_sockel_paketpreis);
                    } else {
                        $standard_sockelleisten_price = floatval($standard_sockelleisten->get_price());
                    }
                    error_log("Standard-Sockelleiste Preis: {$standard_sockelleisten_price}");
                }
            }
            
            // ERWEITERT: ALLE Produkte verwenden Paketpreise wenn verfügbar
            
            // Hauptprodukt Paketpreise
            $paketpreis = get_post_meta($main_product_id, '_paketpreis', true) ?: $main_product->get_price();
            $paketpreis_s = get_post_meta($main_product_id, '_paketpreis_s', true);
            $main_price = !empty($paketpreis_s) ? floatval($paketpreis_s) : floatval($paketpreis);
            
            // Dämmung Paketpreise (NEU)
            $daemmung_price = 0;
            if ($daemmung) {
                $daemmung_paketpreis = get_post_meta($daemmung_id, '_paketpreis', true);
                $daemmung_paketpreis_s = get_post_meta($daemmung_id, '_paketpreis_s', true);
                
                if (!empty($daemmung_paketpreis_s)) {
                    $daemmung_price = floatval($daemmung_paketpreis_s);
                    error_log("Dämmung verwendet Paketpreis_s: {$daemmung_price}");
                } elseif (!empty($daemmung_paketpreis)) {
                    $daemmung_price = floatval($daemmung_paketpreis);
                    error_log("Dämmung verwendet Paketpreis: {$daemmung_price}");
                } else {
                    $daemmung_price = floatval($daemmung->get_price());
                    error_log("Dämmung verwendet Standard-Preis: {$daemmung_price}");
                }
            }
            
            // Sockelleiste Paketpreise (NEU)
            $sockelleisten_price = 0;
            if ($sockelleisten) {
                $sockelleisten_paketpreis = get_post_meta($sockelleisten_id, '_paketpreis', true);
                $sockelleisten_paketpreis_s = get_post_meta($sockelleisten_id, '_paketpreis_s', true);
                
                if (!empty($sockelleisten_paketpreis_s)) {
                    $sockelleisten_price = floatval($sockelleisten_paketpreis_s);
                    error_log("Sockelleiste verwendet Paketpreis_s: {$sockelleisten_price}");
                } elseif (!empty($sockelleisten_paketpreis)) {
                    $sockelleisten_price = floatval($sockelleisten_paketpreis);
                    error_log("Sockelleiste verwendet Paketpreis: {$sockelleisten_price}");
                } else {
                    $sockelleisten_price = floatval($sockelleisten->get_price());
                    error_log("Sockelleiste verwendet Standard-Preis: {$sockelleisten_price}");
                }
            }
            
            // Differenzen berechnen (nur wenn Standard-Produkt konfiguriert ist)
            $daemmung_differenz = 0;
            $sockelleisten_differenz = 0;
            
            if ($standard_daemmung_id && $daemmung) {
                // Standard-Produkt vorhanden: Nur Differenz berechnen
                $daemmung_differenz = max(0, $daemmung_price - $standard_daemmung_price);
            }
            
            if ($standard_sockelleisten_id && $sockelleisten) {
                // Standard-Produkt vorhanden: Nur Differenz berechnen
                $sockelleisten_differenz = max(0, $sockelleisten_price - $standard_sockelleisten_price);
                error_log('=== SOCKELLEISTEN DIFFERENZ-BERECHNUNG ===');
                error_log('Standard-Sockelleisten ID: ' . $standard_sockelleisten_id);
                error_log('Gewählte Sockelleisten ID: ' . $sockelleisten_id);
                error_log('Standard-Preis: ' . $standard_sockelleisten_price);
                error_log('Gewählter Preis: ' . $sockelleisten_price);
                error_log('Berechnete Differenz: ' . $sockelleisten_differenz);
                error_log('Ist Standard-Produkt?: ' . ($sockelleisten_id == $standard_sockelleisten_id ? 'JA' : 'NEIN'));
            } else {
                error_log('=== SOCKELLEISTEN DIFFERENZ-BERECHNUNG ÜBERSPRUNGEN ===');
                error_log('Standard-ID vorhanden: ' . ($standard_sockelleisten_id ? 'JA (' . $standard_sockelleisten_id . ')' : 'NEIN'));
                error_log('Sockelleisten-Objekt vorhanden: ' . ($sockelleisten ? 'JA' : 'NEIN'));
            }
            
            // Set-Preise berechnen
            $main_set_price = $main_price * $rabatt_faktor;
            $daemmung_set_price = $daemmung_differenz * $rabatt_faktor;
            $sockelleisten_set_price = $sockelleisten_differenz * $rabatt_faktor;
            
            // Bundle ID generieren - EINDEUTIG für jedes Set-Angebot
            $bundle_id = 'jaeger_set_' . $main_product_id . '_' . time() . '_' . wp_rand(1000, 9999);
            
            // Prüfe bestehende Sets im Warenkorb
            $existing_bundles = array();
            foreach (WC()->cart->get_cart() as $existing_key => $existing_item) {
                if (isset($existing_item['jaeger_set_bundle_id'])) {
                    $existing_bundles[] = $existing_item['jaeger_set_bundle_id'];
                }
            }
            $unique_bundles = array_unique($existing_bundles);
            
            error_log('Jaeger Plugin - Creating new bundle: ' . $bundle_id . ' (Existing bundles: ' . count($unique_bundles) . ')');
            
            $added_items = 0;
            $cart_keys = array();
            
            // 1. HAUPTPRODUKT hinzufügen (EDITIERBAR - Master-Produkt)
            $main_cart_data = array(
                'jaeger_set_bundle_id' => $bundle_id,
                'jaeger_set_type' => 'main',
                'jaeger_set_role' => 'master', // Dieses Produkt kontrolliert die Mengen
                'jaeger_set_editable' => true, // Kunde kann Menge ändern
                'jaeger_set_quadratmeter' => $quadratmeter,
                'jaeger_set_pakete' => $pakete,
                'jaeger_set_price_per_unit' => $main_set_price,
                'jaeger_set_original_price' => $main_price,
                'jaeger_set_discount_percent' => $zusatz_rabatt,
                'jaeger_set_paketinhalt' => $paketinhalt,
                'jaeger_set_standard_daemmung_price' => $standard_daemmung_price,
                'jaeger_set_standard_sockelleisten_price' => $standard_sockelleisten_price,
                'jaeger_set_display_name' => $main_product->get_name() . ' (Set-Angebot - Hauptprodukt)'
            );
            
            $main_key = WC()->cart->add_to_cart($main_product_id, $pakete, 0, array(), $main_cart_data);
            if ($main_key) {
                $added_items++;
                $cart_keys['main'] = $main_key;
                
                error_log("Hauptprodukt hinzugefügt: ID={$main_product_id}, Menge={$pakete}, Preis={$main_set_price}");
            }
            
            // 2. DÄMMUNG hinzufügen - KORRIGIERTE Mengenberechnung
            if ($daemmung) {
                // Dämmung-Mengenberechnung basierend auf Paketinhalt
                $daemmung_paketinhalt = floatval(get_post_meta($daemmung_id, '_paketinhalt', true) ?: 1); // m² pro Dämmungspaket
                $daemmung_qm_bedarf = $quadratmeter * (1 + $verschnitt / 100); // Bodenbedarf + Verschnitt
                $daemmung_pakete_needed = ceil($daemmung_qm_bedarf / $daemmung_paketinhalt);
                
                error_log('Jaeger Plugin - Dämmung Mengenberechnung: ' . print_r([
                    'quadratmeter' => $quadratmeter,
                    'verschnitt' => $verschnitt . '%',
                    'daemmung_qm_bedarf' => $daemmung_qm_bedarf,
                    'daemmung_paketinhalt' => $daemmung_paketinhalt . ' m²/Paket',
                    'daemmung_pakete_needed' => $daemmung_pakete_needed
                ], true));
                
                $daemmung_cart_data = array(
                    'jaeger_set_bundle_id' => $bundle_id,
                    'jaeger_set_type' => 'daemmung',
                    'jaeger_set_role' => 'slave', // Folgt dem Master-Produkt
                    'jaeger_set_editable' => false, // Kunde kann Menge NICHT ändern
                    'jaeger_set_quadratmeter' => $quadratmeter,
                    'jaeger_set_pakete' => $pakete, // Boden-Pakete für Referenz
                    'jaeger_set_daemmung_pakete' => $daemmung_pakete_needed, // Tatsächliche Dämmung-Pakete
                    'jaeger_set_price_per_unit' => $daemmung_set_price,
                    'jaeger_set_original_price' => $daemmung_price,
                    'jaeger_set_discount_percent' => $zusatz_rabatt,
                    'jaeger_set_differenz' => $daemmung_differenz,
                    'jaeger_set_standard_price' => $standard_daemmung_price,
                    'jaeger_set_paketinhalt' => $daemmung_paketinhalt,
                    'jaeger_set_is_free' => ($daemmung_differenz <= 0),
                    'jaeger_set_display_name' => $daemmung->get_name() . ' (Set-Angebot - Dämmung)'
                );
                
                // KORRIGIERTE Menge: Dämmungspakete basierend auf Bedarf
                $daemmung_key = WC()->cart->add_to_cart($daemmung_id, $daemmung_pakete_needed, 0, array(), $daemmung_cart_data);
                if ($daemmung_key) {
                    $added_items++;
                    $cart_keys['daemmung'] = $daemmung_key;
                    
                    error_log("Dämmung hinzugefügt: ID={$daemmung_id}, Menge={$daemmung_pakete_needed} Pakete, Differenz={$daemmung_differenz}, Set-Preis={$daemmung_set_price}");
                }
            }
            
            // 3. SOCKELLEISTE hinzufügen - KORRIGIERTE Mengenberechnung
            if ($sockelleisten) {
                // ERWEITERTE Sockelleisten-Mengenberechnung mit korrekter Paketinhalt-Logik
                $sockelleisten_lfm = $quadratmeter > 0 ? (4 * sqrt($quadratmeter)) : 0; // Umfangsformel
                $sockelleisten_lfm_mit_verschnitt = $sockelleisten_lfm * (1 + $verschnitt / 100);
                
                // Sockelleisten Paketinhalt (lfm pro Paket)
                $sockelleisten_paketinhalt = floatval(get_post_meta($sockelleisten_id, '_paketinhalt', true) ?: 2.4); // lfm pro Sockelleisten-Paket
                $sockelleisten_pakete_needed = ceil($sockelleisten_lfm_mit_verschnitt / $sockelleisten_paketinhalt);
                
                error_log('Jaeger Plugin - Sockelleisten Mengenberechnung: ' . print_r([
                    'quadratmeter' => $quadratmeter,
                    'umfang_lfm' => $sockelleisten_lfm,
                    'verschnitt' => $verschnitt . '%',
                    'lfm_mit_verschnitt' => $sockelleisten_lfm_mit_verschnitt,
                    'sockel_paketinhalt' => $sockelleisten_paketinhalt . ' lfm/Paket',
                    'sockel_pakete_needed' => $sockelleisten_pakete_needed
                ], true));
                
                $sockelleisten_cart_data = array(
                    'jaeger_set_bundle_id' => $bundle_id,
                    'jaeger_set_type' => 'sockelleisten',
                    'jaeger_set_role' => 'slave', // Folgt dem Master-Produkt
                    'jaeger_set_editable' => false, // Kunde kann Menge NICHT ändern
                    'jaeger_set_quadratmeter' => $quadratmeter,
                    'jaeger_set_pakete' => $pakete, // Boden-Pakete für Referenz
                    'jaeger_set_sockel_pakete' => $sockelleisten_pakete_needed, // Tatsächliche Sockelleisten-Pakete
                    'jaeger_set_price_per_unit' => $sockelleisten_set_price,
                    'jaeger_set_original_price' => $sockelleisten_price,
                    'jaeger_set_discount_percent' => $zusatz_rabatt,
                    'jaeger_set_differenz' => $sockelleisten_differenz,
                    'jaeger_set_standard_price' => $standard_sockelleisten_price,
                    'jaeger_set_laufmeter' => $sockelleisten_lfm,
                    'jaeger_set_laufmeter_mit_verschnitt' => $sockelleisten_lfm_mit_verschnitt,
                    'jaeger_set_paketinhalt_sockel' => $sockelleisten_paketinhalt,
                    'jaeger_set_verschnitt' => $verschnitt,
                    'jaeger_set_is_free' => ($sockelleisten_differenz <= 0),
                    'jaeger_set_display_name' => $sockelleisten->get_name() . ' (Set-Angebot - Sockelleiste)'
                );
                
                // KORRIGIERTE Menge: Sockelleistenpakete basierend auf Laufmeter-Bedarf
                $sockelleisten_key = WC()->cart->add_to_cart($sockelleisten_id, $sockelleisten_pakete_needed, 0, array(), $sockelleisten_cart_data);
                if ($sockelleisten_key) {
                    $added_items++;
                    $cart_keys['sockelleisten'] = $sockelleisten_key;
                    
                    error_log("Sockelleiste hinzugefügt: ID={$sockelleisten_id}, Menge={$sockelleisten_pakete_needed} Pakete, Differenz={$sockelleisten_differenz}, Set-Preis={$sockelleisten_set_price}");
                }
            }
            
            if ($added_items === 0) {
                throw new Exception('Keine Produkte konnten hinzugefügt werden');
            }
            
            // Cart neu berechnen
            WC()->cart->calculate_totals();
            
            // Session speichern
            if (WC()->session) {
                WC()->session->save_data();
            }
            
            // DETAILLIERTE Erfolgsantwort
            $response_data = array(
                'message' => 'Set erfolgreich hinzugefügt',
                'cart_count' => WC()->cart->get_cart_contents_count(),
                'cart_total' => WC()->cart->get_cart_total(),
                'redirect_url' => wc_get_checkout_url(),
                'bundle_id' => $bundle_id,
                'added_items' => $added_items,
                'cart_keys' => $cart_keys,
                'debug' => array(
                    'main_price' => $main_set_price,
                    'daemmung_differenz' => $daemmung_differenz,
                    'sockelleisten_differenz' => $sockelleisten_differenz,
                    'rabatt_faktor' => $rabatt_faktor
                )
            );
            
            error_log("Set erfolgreich hinzugefügt: " . json_encode($response_data['debug']));
            
            wp_send_json_success($response_data);
            
        } catch (Exception $e) {
            error_log('Jaeger Cart Error: ' . $e->getMessage());
            wp_send_json_error($e->getMessage());
        }
    }
    
    /**
     * ENTFERNT - Mehrere Set-Angebote sind jetzt erlaubt!
     * Bestehende Bundles werden NICHT mehr automatisch entfernt.
     */
    
    /**
     * Cart Item aus Session laden - ERWEITERT um neue Mengen-Felder
     */
    public function get_cart_item_from_session($cart_item, $values, $key) {
        if (isset($values['jaeger_set_bundle_id'])) {
            $bundle_keys = array(
                'jaeger_set_bundle_id', 'jaeger_set_type', 'jaeger_set_role', 'jaeger_set_editable',
                'jaeger_set_quadratmeter', 'jaeger_set_pakete', 'jaeger_set_price_per_unit', 'jaeger_set_original_price',
                'jaeger_set_discount_percent', 'jaeger_set_laufmeter', 'jaeger_set_differenz',
                'jaeger_set_standard_price', 'jaeger_set_paketinhalt', 
                
                // NEUE Mengen-Felder
                'jaeger_set_daemmung_pakete', 'jaeger_set_sockel_pakete',
                'jaeger_set_laufmeter_mit_verschnitt', 'jaeger_set_paketinhalt_sockel', 'jaeger_set_verschnitt',
                
                // Bestehende Felder
                'jaeger_set_standard_daemmung_price', 'jaeger_set_standard_sockelleisten_price',
                'jaeger_set_is_free', 'jaeger_set_display_name'
            );
            
            foreach ($bundle_keys as $bundle_key) {
                if (isset($values[$bundle_key])) {
                    $cart_item[$bundle_key] = $values[$bundle_key];
                }
            }
        }
        return $cart_item;
    }
    
    /**
     * KORRIGIERTE Preise vor Berechnung anpassen
     */
    public function before_calculate_totals($cart) {
        if (is_admin() && !defined('DOING_AJAX')) {
            return;
        }
        
        foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
            if (isset($cart_item['jaeger_set_bundle_id']) && 
                isset($cart_item['jaeger_set_price_per_unit']) &&
                isset($cart_item['data']) && 
                is_object($cart_item['data']) &&
                method_exists($cart_item['data'], 'set_price')) {
                
                $set_price = floatval($cart_item['jaeger_set_price_per_unit']);
                $cart_item['data']->set_price($set_price);
                
                // Debug-Logging
                $type = isset($cart_item['jaeger_set_type']) ? $cart_item['jaeger_set_type'] : 'unknown';
                error_log("Preis gesetzt für {$type}: {$set_price}");
            }
        }
    }
    
    /**
     * ERWEITERTE Cart Item Name Anzeige - Mit detaillierten Mengen-Informationen
     */
    public function cart_item_name($name, $cart_item, $cart_item_key) {
        if (isset($cart_item['jaeger_set_bundle_id'])) {
            $type_labels = array(
                'main' => '🏠 Boden',
                'daemmung' => '🧊 Dämmung (Aufpreis)',
                'sockelleisten' => '📏 Sockelleiste (Aufpreis)'
            );
            
            $type = isset($cart_item['jaeger_set_type']) ? $cart_item['jaeger_set_type'] : '';
            $type_label = isset($type_labels[$type]) ? $type_labels[$type] : '🏠 ' . ucfirst($type);
            $quadratmeter = isset($cart_item['jaeger_set_quadratmeter']) ? $cart_item['jaeger_set_quadratmeter'] : 0;
            $discount = isset($cart_item['jaeger_set_discount_percent']) ? $cart_item['jaeger_set_discount_percent'] : 0;
            
            $name = $type_label . ' • ' . esc_html($name);
            
            $name .= '<br><small class="jaeger-set-info">';
            $name .= 'Set-Angebot - ' . esc_html(number_format($quadratmeter, 2, ',', '.')) . ' m²';
            
            // KORRIGIERT: Verwende echte Warenkorb-Mengen statt gespeicherte Werte
            if ($type === 'main') {
                $echte_pakete = $cart_item['quantity']; // Echte Warenkorb-Menge
                $paketinhalt = isset($cart_item['jaeger_set_paketinhalt']) ? $cart_item['jaeger_set_paketinhalt'] : 0;
                if ($echte_pakete > 0 && $paketinhalt > 0) {
                    $name .= ' (' . $echte_pakete . ' Pakete à ' . esc_html(number_format($paketinhalt, 2, ',', '.')) . ' m²)';
                }
            } elseif ($type === 'daemmung') {
                $echte_daemmung_pakete = $cart_item['quantity']; // Echte Warenkorb-Menge
                $daemmung_paketinhalt = isset($cart_item['jaeger_set_paketinhalt']) ? $cart_item['jaeger_set_paketinhalt'] : 0;
                if ($daemmung_paketinhalt > 0) {
                    $name .= ' (' . $echte_daemmung_pakete . ' Pakete à ' . esc_html(number_format($daemmung_paketinhalt, 2, ',', '.')) . ' m²)';
                }
            } elseif ($type === 'sockelleisten') {
                $echte_sockel_pakete = $cart_item['quantity']; // Echte Warenkorb-Menge
                $sockel_paketinhalt = isset($cart_item['jaeger_set_paketinhalt_sockel']) ? $cart_item['jaeger_set_paketinhalt_sockel'] : 0;
                
                // Laufmeter NEU berechnen basierend auf aktuellen Quadratmetern
                if ($quadratmeter > 0) {
                    $aktueller_umfang = 4 * sqrt($quadratmeter);
                    $verschnitt = isset($cart_item['jaeger_set_verschnitt']) ? floatval($cart_item['jaeger_set_verschnitt']) : 5;
                    $laufmeter_mit_verschnitt = $aktueller_umfang * (1 + $verschnitt / 100);
                    
                    $name .= ' (' . esc_html(number_format($laufmeter_mit_verschnitt, 1, ',', '.')) . ' lfm, ' . $echte_sockel_pakete . ' Pakete à ' . esc_html(number_format($sockel_paketinhalt, 1, ',', '.')) . ' lfm)';
                } else {
                    // Fallback wenn keine Quadratmeter verfügbar
                    if ($sockel_paketinhalt > 0) {
                        $name .= ' (' . $echte_sockel_pakete . ' Pakete à ' . esc_html(number_format($sockel_paketinhalt, 1, ',', '.')) . ' lfm)';
                    }
                }
            }
            
            // Preis-Info anzeigen
            if (isset($cart_item['jaeger_set_differenz']) && $cart_item['jaeger_set_differenz'] > 0) {
                $differenz = floatval($cart_item['jaeger_set_differenz']);
                $standard_price = isset($cart_item['jaeger_set_standard_price']) ? floatval($cart_item['jaeger_set_standard_price']) : 0;
                $name .= ' <span class="price-info">(' . number_format($standard_price, 2, ',', '.') . ' € + ' . number_format($differenz, 2, ',', '.') . ' € Aufpreis)</span>';
            } elseif ($type !== 'main') {
                $name .= ' <span class="free-item">(kostenlos im Set)</span>';
            }
            
            if ($discount > 0) {
                $name .= ' <span class="discount">-' . round($discount) . '%</span>';
            }
            
            $name .= '</small>';
        }
        
        return $name;
    }
    
    /**
     * Cart Item Quantity - Bundle-Items schützen
     */
    public function cart_item_quantity($quantity_html, $cart_item_key, $cart_item) {
        if (isset($cart_item['jaeger_set_bundle_id'])) {
            // Nur Hauptprodukt editierbar
            if (isset($cart_item['jaeger_set_type']) && $cart_item['jaeger_set_type'] === 'main') {
                return $quantity_html;
            } else {
                // Bundle-Items sind nicht editierbar
                $quantity = isset($cart_item['quantity']) ? $cart_item['quantity'] : 1;
                return '<span class="quantity bundle-quantity" title="Menge wird automatisch mit dem Hauptprodukt synchronisiert">' . $quantity . '</span>';
            }
        }
        
        return $quantity_html;
    }
    
    /**
     * KORRIGIERTE Bundle-Entfernung
     */
    public function handle_bundle_removal($cart_item_key, $cart) {
        if (!$cart || !isset($cart->removed_cart_contents[$cart_item_key])) {
            return;
        }
        
        $removed_item = $cart->removed_cart_contents[$cart_item_key];
        
        if ($removed_item && isset($removed_item['jaeger_set_bundle_id'])) {
            $bundle_id = $removed_item['jaeger_set_bundle_id'];
            
            error_log("Bundle-Item entfernt: Bundle-ID {$bundle_id}");
            
            // Alle anderen Bundle-Items entfernen
            $removed_count = 0;
            foreach ($cart->get_cart() as $key => $item) {
                if (isset($item['jaeger_set_bundle_id']) && 
                    $item['jaeger_set_bundle_id'] === $bundle_id && 
                    $key !== $cart_item_key) {
                    $cart->remove_cart_item($key);
                    $removed_count++;
                }
            }
            
            if ($removed_count > 0) {
                error_log("Weitere Bundle-Items entfernt: {$removed_count}");
                wc_add_notice('Komplettes Set-Angebot wurde entfernt.', 'notice');
            }
        }
    }
    
    /**
     * KORRIGIERTE Bundle-Mengen synchronisieren - Mit Paketinhalt-basierten Berechnungen
     */
    public function sync_bundle_quantities($cart_item_key, $quantity, $old_quantity, $cart) {
        if (!$cart || !isset($cart->cart_contents[$cart_item_key])) {
            return;
        }
        
        $cart_item = $cart->cart_contents[$cart_item_key];
        
        if ($cart_item && 
            isset($cart_item['jaeger_set_bundle_id']) && 
            isset($cart_item['jaeger_set_type']) && 
            $cart_item['jaeger_set_type'] === 'main') {
            
            $bundle_id = $cart_item['jaeger_set_bundle_id'];
            $paketinhalt = isset($cart_item['jaeger_set_paketinhalt']) ? floatval($cart_item['jaeger_set_paketinhalt']) : 1;
            $verschnitt = isset($cart_item['jaeger_set_verschnitt']) ? floatval($cart_item['jaeger_set_verschnitt']) : 5;
            
            // Neue Quadratmeter basierend auf geänderte Paketanzahl
            $neue_qm = $quantity * $paketinhalt; // Neue Quadratmeter
            
            error_log("Hauptprodukt-Menge geändert: {$old_quantity} -> {$quantity} Pakete, Neue QM: {$neue_qm}");
            
            foreach ($cart->cart_contents as $key => $item) {
                if ($key !== $cart_item_key && 
                    isset($item['jaeger_set_bundle_id']) && 
                    $item['jaeger_set_bundle_id'] === $bundle_id) {
                    
                    $item_type = isset($item['jaeger_set_type']) ? $item['jaeger_set_type'] : '';
                    
                    if ($item_type === 'daemmung') {
                        // KORRIGIERTE Dämmung: Berechnung basierend auf Paketinhalt
                        $daemmung_paketinhalt = isset($item['jaeger_set_paketinhalt']) ? floatval($item['jaeger_set_paketinhalt']) : 1;
                        $daemmung_qm_bedarf = $neue_qm * (1 + $verschnitt / 100); // QM-Bedarf + Verschnitt
                        $new_daemmung_quantity = ceil($daemmung_qm_bedarf / $daemmung_paketinhalt);
                        
                        $cart->set_quantity($key, $new_daemmung_quantity, false);
                        
                        error_log('Jaeger Plugin - Dämmung Sync: ' . print_r([
                            'neue_qm' => $neue_qm,
                            'verschnitt' => $verschnitt . '%',
                            'daemmung_qm_bedarf' => $daemmung_qm_bedarf,
                            'daemmung_paketinhalt' => $daemmung_paketinhalt,
                            'new_quantity' => $new_daemmung_quantity
                        ], true));
                        
                    } elseif ($item_type === 'sockelleisten') {
                        // KORRIGIERTE Sockelleiste: Berechnung basierend auf Umfang und Paketinhalt
                        $sockelleisten_lfm = 4 * sqrt($neue_qm); // Umfangsformel
                        $sockelleisten_lfm_mit_verschnitt = $sockelleisten_lfm * (1 + $verschnitt / 100);
                        $sockelleisten_paketinhalt = isset($item['jaeger_set_paketinhalt_sockel']) ? floatval($item['jaeger_set_paketinhalt_sockel']) : 2.4;
                        $new_sockel_quantity = ceil($sockelleisten_lfm_mit_verschnitt / $sockelleisten_paketinhalt);
                        
                        $cart->set_quantity($key, $new_sockel_quantity, false);
                        
                        error_log('Jaeger Plugin - Sockelleisten Sync: ' . print_r([
                            'neue_qm' => $neue_qm,
                            'umfang_lfm' => $sockelleisten_lfm,
                            'verschnitt' => $verschnitt . '%',
                            'lfm_mit_verschnitt' => $sockelleisten_lfm_mit_verschnitt,
                            'sockel_paketinhalt' => $sockelleisten_paketinhalt,
                            'new_quantity' => $new_sockel_quantity
                        ], true));
                    }
                    
                    // Quadratmeter in den Bundle-Items aktualisieren
                    $cart->cart_contents[$key]['jaeger_set_quadratmeter'] = $neue_qm;
                }
            }
            
            // Quadratmeter auch im Hauptprodukt aktualisieren
            $cart->cart_contents[$cart_item_key]['jaeger_set_quadratmeter'] = $neue_qm;
        }
    }
    
    /**
     * CheckoutWC Item Data
     */
    public function checkout_wc_item_data($item_data, $cart_item) {
        if (!isset($cart_item['jaeger_set_bundle_id'])) {
            return $item_data;
        }
        
        $type_labels = array(
            'main' => 'Boden',
            'daemmung' => 'Dämmung',
            'sockelleisten' => 'Sockelleiste'
        );
        
        $type = isset($cart_item['jaeger_set_type']) ? $cart_item['jaeger_set_type'] : '';
        $type_label = isset($type_labels[$type]) ? $type_labels[$type] : $type;
        
        $item_data[] = array(
            'name' => 'Set-Typ',
            'value' => $type_label
        );
        
        if (isset($cart_item['jaeger_set_quadratmeter'])) {
            $item_data[] = array(
                'name' => 'Quadratmeter',
                'value' => $cart_item['jaeger_set_quadratmeter'] . ' m²'
            );
        }
        
        if (isset($cart_item['jaeger_set_differenz']) && $cart_item['jaeger_set_differenz'] > 0) {
            $item_data[] = array(
                'name' => 'Aufpreis',
                'value' => '+' . number_format($cart_item['jaeger_set_differenz'], 2, ',', '.') . ' €'
            );
        } elseif ($type !== 'main') {
            $item_data[] = array(
                'name' => 'Im Set',
                'value' => 'Kostenlos'
            );
        }
        
        if (isset($cart_item['jaeger_set_discount_percent']) && $cart_item['jaeger_set_discount_percent'] > 0) {
            $item_data[] = array(
                'name' => 'Set-Rabatt',
                'value' => '-' . round($cart_item['jaeger_set_discount_percent']) . '%'
            );
        }
        
        return $item_data;
    }
    
    /**
     * Bundle-Produkte: Entfernen-Link deaktivieren für Slave-Produkte
     */
    public function maybe_disable_remove_link($link, $cart_item_key) {
        $cart_item = WC()->cart->get_cart()[$cart_item_key] ?? null;
        
        if ($cart_item && 
            isset($cart_item['jaeger_set_bundle_id']) && 
            isset($cart_item['jaeger_set_editable']) && 
            $cart_item['jaeger_set_editable'] === false) {
            
            // Slave-Produkt: Entfernen-Link deaktivieren
            return '<span style="color: #999; font-style: italic;" title="Dieses Produkt ist Teil eines Set-Angebots und kann nicht einzeln entfernt werden.">Set-Produkt</span>';
        }
        
        return $link;
    }
    
    /**
     * Bundle-Produkte: Menge-Input deaktivieren für Slave-Produkte
     */
    public function maybe_disable_quantity_input($product_quantity, $cart_item_key, $cart_item) {
        if (isset($cart_item['jaeger_set_bundle_id']) && 
            isset($cart_item['jaeger_set_editable']) && 
            $cart_item['jaeger_set_editable'] === false) {
            
            // Slave-Produkt: Nur Anzeige der Menge, kein Input
            return '<span style="color: #666; font-weight: bold;" title="Die Menge wird automatisch anhand des Hauptprodukts berechnet.">' . $cart_item['quantity'] . '</span>';
        }
        
        return $product_quantity;
    }
    
    /**
     * Order Line Item - Erweiterte Meta-Daten
     */
    public function checkout_create_order_line_item($item, $cart_item_key, $values, $order) {
        if (isset($values['jaeger_set_bundle_id'])) {
            $meta_fields = array(
                'jaeger_set_bundle_id' => '_jaeger_set_bundle_id',
                'jaeger_set_type' => '_jaeger_set_type',
                'jaeger_set_quadratmeter' => '_jaeger_set_quadratmeter',
                'jaeger_set_pakete' => '_jaeger_set_pakete',
                'jaeger_set_original_price' => '_jaeger_set_original_price',
                'jaeger_set_discount_percent' => '_jaeger_set_discount_percent',
                'jaeger_set_laufmeter' => '_jaeger_set_laufmeter',
                'jaeger_set_differenz' => '_jaeger_set_differenz',
                'jaeger_set_standard_price' => '_jaeger_set_standard_price'
            );
            
            foreach ($meta_fields as $value_key => $meta_key) {
                if (isset($values[$value_key])) {
                    $item->add_meta_data($meta_key, $values[$value_key]);
                }
            }
        }
    }
    
    /**
     * OPTIMIERTES JavaScript - mit korrekten Daten
     */
    public function add_optimized_cart_javascript() {
        if (!is_product()) return;
        
        ?>
        <style>
        .jaeger-set-info { 
            color: #666; 
            font-size: 0.9em; 
        }
        .jaeger-set-info .discount { 
            color: #e53e3e; 
            font-weight: bold; 
        }
        .jaeger-set-info .price-info {
            color: #888;
            font-size: 0.85em;
        }
        .jaeger-set-info .free-item {
            color: #28a745;
            font-weight: bold;
        }
        .bundle-quantity {
            background: #f8f9fa;
            padding: 4px 8px;
            border-radius: 4px;
            color: #666;
            font-size: 0.9em;
        }
        .jaeger-loading { 
            display: inline-block; 
            width: 16px; 
            height: 16px; 
            border: 2px solid #fff; 
            border-top: 2px solid transparent; 
            border-radius: 50%; 
            animation: jaeger-spin 1s linear infinite; 
        }
        @keyframes jaeger-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .jaeger-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
        }
        .jaeger-toast.show { opacity: 1; transform: translateX(0); }
        .jaeger-toast.success { background: #28a745; }
        .jaeger-toast.error { background: #dc3545; }
        </style>
        
        <script>
        (function($) {
            'use strict';
            
            let isProcessing = false;
            
            $(document).ready(function() {
                // KORRIGIERTER Warenkorb Button Handler
                $(document).on('click', '.jaeger-konfigurator-interactive button:contains("🛒")', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Doppelklick verhindern
                    if (isProcessing) {
                        showToast('Vorgang läuft bereits...', 'error');
                        return false;
                    }
                    
                    const $button = $(this);
                    const originalText = $button.html();
                    
                    // ERWEITERTE Validierung
                    const quadratmeter = parseFloat($('#quadratmeter').val()) || 0;
                    const pakete = parseInt($('#pakete').val()) || 1;
                    
                    if (quadratmeter <= 0) {
                        showToast('Bitte geben Sie die Quadratmeter ein', 'error');
                        return false;
                    }
                    
                    if (pakete <= 0) {
                        showToast('Bitte geben Sie die Anzahl Pakete ein', 'error');
                        return false;
                    }
                    
                    // Sicherstellen dass Konfigurator-Daten vorhanden sind
                    if (!window.JaegerKonfigurator || !window.JaegerKonfigurator.currentProducts) {
                        showToast('Konfigurator nicht initialisiert - bitte Seite neu laden', 'error');
                        return false;
                    }
                    
                    const konfigData = window.JaegerKonfigurator;
                    
                    if (!konfigData.currentProducts.main) {
                        showToast('Hauptprodukt nicht gefunden', 'error');
                        return false;
                    }
                    
                    isProcessing = true;
                    
                    // Button-Status
                    $button.prop('disabled', true)
                           .html('<span class="jaeger-loading"></span> Wird hinzugefügt...');
                    
                    // KORRIGIERTE AJAX-Daten
                    const ajaxData = {
                        action: 'jaeger_add_set_to_cart',
                        nonce: konfigData.nonce,
                        main_product_id: konfigData.currentProducts.main,
                        daemmung_id: konfigData.currentProducts.daemmung || 0,
                        sockelleisten_id: konfigData.currentProducts.sockelleisten || 0,
                        quadratmeter: quadratmeter,
                        pakete: pakete
                    };
                    
                    console.log('Sende Daten zum Warenkorb:', ajaxData);
                    
                    // AJAX Request
                    $.ajax({
                        url: konfigData.ajax_url,
                        type: 'POST',
                        data: ajaxData,
                        timeout: 60000, // 60 Sekunden
                        dataType: 'json'
                    })
                    .done(function(response) {
                        console.log('Warenkorb-Antwort:', response);
                        
                        if (response && response.success) {
                            $button.html('✓ Hinzugefügt!').css('background', '#28a745');
                            
                            // Cart-Counter aktualisieren
                            const cartCount = response.data.cart_count || 0;
                            $('.cart-count, .cart-contents-count, .count').text(cartCount);
                            
                            // WooCommerce Fragments aktualisieren
                            $(document.body).trigger('wc_fragment_refresh');
                            
                            showToast('Set erfolgreich hinzugefügt! (' + response.data.added_items + ' Produkte)', 'success');
                            
                            // Zur Kasse anbieten
                            setTimeout(function() {
                                if (confirm('Möchten Sie zur Kasse gehen?')) {
                                    window.location.href = response.data.redirect_url || '/checkout/';
                                }
                            }, 1500);
                        } else {
                            $button.html('❌ Fehler').css('background', '#dc3545');
                            const errorMsg = response.data || 'Unbekannter Fehler beim Hinzufügen';
                            showToast(errorMsg, 'error');
                            console.error('Warenkorb-Fehler:', errorMsg);
                        }
                    })
                    .fail(function(xhr, status, error) {
                        console.error('AJAX-Fehler:', {xhr, status, error});
                        
                        $button.html('❌ Fehler').css('background', '#dc3545');
                        
                        let errorMsg = 'Verbindungsfehler';
                        if (status === 'timeout') {
                            errorMsg = 'Zeitüberschreitung - bitte erneut versuchen';
                        } else if (xhr.responseJSON && xhr.responseJSON.data) {
                            errorMsg = xhr.responseJSON.data;
                        }
                        
                        showToast(errorMsg, 'error');
                    })
                    .always(function() {
                        isProcessing = false;
                        
                        // Button nach 3 Sekunden zurücksetzen
                        setTimeout(function() {
                            $button.prop('disabled', false)
                                   .html(originalText)
                                   .css('background', '');
                        }, 3000);
                    });
                });
                
                // ERWEITERTE Toast-Funktion
                function showToast(message, type) {
                    $('.jaeger-toast').remove();
                    
                    const $toast = $('<div class="jaeger-toast ' + type + '">' + message + '</div>');
                    $('body').append($toast);
                    
                    setTimeout(function() {
                        $toast.addClass('show');
                    }, 10);
                    
                    setTimeout(function() {
                        $toast.removeClass('show');
                        setTimeout(function() {
                            $toast.remove();
                        }, 300);
                    }, type === 'error' ? 5000 : 3000);
                }
            });
            
        })(jQuery);
        </script>
        <?php
    }
    
    /**
     * Cart Item Daten hinzufügen (Fallback)
     */
    public function add_cart_item_data($cart_item_data, $product_id, $variation_id) {
        // Wird bereits in add_to_cart direkt gemacht
        return $cart_item_data;
    }
}

// Instanziierung
new Jaeger_Warenkorb_Integration();