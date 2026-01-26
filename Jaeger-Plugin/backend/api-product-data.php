<?php
/**
 * Jaeger Plugin - Product Data REST API
 *
 * Stellt ALLE 30+ Custom Fields für Next.js Headless Frontend bereit
 *
 * @package JaegerPlugin
 * @since 1.1.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * REST API für vollständige Produktdaten
 */
class Jaeger_Product_Data_API {

    const NAMESPACE = 'jaeger/v1';

    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    /**
     * REST API Routes registrieren
     */
    public function register_routes() {

        // Einzelprodukt mit ALLEN Custom Fields
        register_rest_route(self::NAMESPACE, '/products/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_product_with_custom_fields'),
            'permission_callback' => '__return_true',
            'args' => array(
                'id' => array(
                    'validate_callback' => function($param) {
                        return is_numeric($param);
                    }
                ),
                'fields' => array(
                    'required' => false,
                    'type' => 'string',
                    'default' => 'full',
                    'enum' => array('critical', 'minimal', 'full'),
                    'description' => 'Filtert Response-Felder: critical (Produktkarten), minimal (Modals), full (alle Felder)'
                )
            )
        ));

        // Mehrere Produkte auf einmal (z.B. für Kategorie-Seiten)
        register_rest_route(self::NAMESPACE, '/products', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_products_list'),
            'permission_callback' => '__return_true',
            'args' => array(
                'category' => array(
                    'required' => false,
                    'type' => 'string'
                ),
                'per_page' => array(
                    'required' => false,
                    'type' => 'integer',
                    'default' => 20
                ),
                'page' => array(
                    'required' => false,
                    'type' => 'integer',
                    'default' => 1
                ),
                'include' => array(
                    'required' => false,
                    'type' => 'string',
                    'description' => 'Kommagetrennte Produkt-IDs (z.B. 1234,1235,1236)'
                ),
                'fields' => array(
                    'required' => false,
                    'type' => 'string',
                    'default' => 'full',
                    'enum' => array('critical', 'minimal', 'full'),
                    'description' => 'Filtert Response-Felder: critical (Produktkarten), minimal (Modals), full (alle Felder)'
                ),
                'orderby' => array(
                    'required' => false,
                    'type' => 'string',
                    'default' => 'date',
                    'enum' => array('date', 'title', 'price', 'popularity'),
                    'description' => 'Sortierfeld'
                ),
                'order' => array(
                    'required' => false,
                    'type' => 'string',
                    'default' => 'desc',
                    'enum' => array('asc', 'desc'),
                    'description' => 'Sortierrichtung'
                ),
                'search' => array(
                    'required' => false,
                    'type' => 'string',
                    'description' => 'Suchbegriff für Produktname, SKU, Beschreibung'
                )
            )
        ));

        // Produktkategorien mit Produktanzahl
        register_rest_route(self::NAMESPACE, '/categories', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_categories'),
            'permission_callback' => '__return_true'
        ));
    }

    /**
     * Einzelprodukt mit allen Custom Fields
     */
    public function get_product_with_custom_fields($request) {
        try {
            $product_id = intval($request['id']);
            $fields_mode = $request->get_param('fields') ?: 'full';
            $product = wc_get_product($product_id);

            if (!$product) {
                return new WP_Error('product_not_found', 'Produkt nicht gefunden', array('status' => 404));
            }

            // Standard WooCommerce Daten
            $data = array(
                'id' => $product->get_id(),
                'name' => $product->get_name(),
                'slug' => $product->get_slug(),
                'permalink' => get_permalink($product_id),
                'type' => $product->get_type(),
                'status' => $product->get_status(),
                'featured' => $product->is_featured(),
                'catalog_visibility' => $product->get_catalog_visibility(),
                'description' => $product->get_description(),
                'short_description' => $product->get_short_description(),
                'sku' => $product->get_sku(),
                'date_created' => $product->get_date_created() ? $product->get_date_created()->date('c') : null,
                'date_modified' => $product->get_date_modified() ? $product->get_date_modified()->date('c') : null,

                // Purchase & Tax
                'purchase_note' => $product->get_purchase_note(),
                'tax_status' => $product->get_tax_status(),
                'tax_class' => $product->get_tax_class(),

                // Reviews & Ratings
                'reviews_allowed' => $product->get_reviews_allowed(),
                'average_rating' => $product->get_average_rating(),
                'rating_count' => $product->get_rating_count(),
                'review_count' => $product->get_review_count(),

                // Product Type Flags
                'virtual' => $product->is_virtual(),
                'downloadable' => $product->is_downloadable(),
                'sold_individually' => $product->get_sold_individually(),

                // External Product Data (nur für External Products)
                'external_url' => $product->is_type('external') ? $product->get_product_url() : null,
                'button_text' => $product->is_type('external') ? $product->get_button_text() : null,

                // Downloads (falls downloadable)
                'downloads' => $product->get_downloads(),
                'download_limit' => $product->get_download_limit(),
                'download_expiry' => $product->get_download_expiry(),

                // Ordering & Hierarchy
                'menu_order' => $product->get_menu_order(),
                'parent_id' => $product->get_parent_id(),

                // Grouped Products (falls type = 'grouped')
                'grouped_products' => $product->get_children(),

                // Low Stock
                'low_stock_amount' => $product->get_low_stock_amount(),

                // Meta Data (alle custom fields)
                'meta_data' => $product->get_meta_data(),
            );

            // Bilder
            $data['images'] = $this->get_product_images($product);

            // Kategorien
            $data['categories'] = $this->get_product_categories($product);

            // Tags
            $data['tags'] = $this->get_product_tags($product);

            // Preise
            $data['prices'] = array(
                'price' => $product->get_price(),
                'regular_price' => $product->get_regular_price(),
                'sale_price' => $product->get_sale_price(),
                'on_sale' => $product->is_on_sale(),
                'date_on_sale_from' => $product->get_date_on_sale_from() ? $product->get_date_on_sale_from()->date('c') : null,
                'date_on_sale_to' => $product->get_date_on_sale_to() ? $product->get_date_on_sale_to()->date('c') : null,
                'price_html' => $product->get_price_html()
            );

            // Lagerbestand
            $data['stock'] = array(
                'stock_status' => $product->get_stock_status(),
                'stock_quantity' => $product->get_stock_quantity(),
                'manage_stock' => $product->get_manage_stock(),
                'backorders' => $product->get_backorders(),
                'backorders_allowed' => $product->backorders_allowed(),
                'backordered' => $product->is_on_backorder()
            );

            // Versand
            $data['shipping'] = array(
                'weight' => $product->get_weight(),
                'length' => $product->get_length(),
                'width' => $product->get_width(),
                'height' => $product->get_height(),
                'shipping_class' => $product->get_shipping_class(),
                'dimensions' => array(
                    'length' => $product->get_length(),
                    'width' => $product->get_width(),
                    'height' => $product->get_height(),
                    'unit' => get_option('woocommerce_dimension_unit')
                ),
                'weight_unit' => get_option('woocommerce_weight_unit')
            );

            // =====================================================
            // ALLE 40+ JAEGER FELDER AUF ROOT-LEVEL FÜR NEXT.JS
            // =====================================================

            // Paketinformationen (8 Felder)
            $data['paketpreis'] = floatval(get_post_meta($product_id, '_paketpreis', true)) ?: null;
            $data['paketpreis_s'] = floatval(get_post_meta($product_id, '_paketpreis_s', true)) ?: null;
            $data['paketinhalt'] = floatval(get_post_meta($product_id, '_paketinhalt', true)) ?: null;
            $data['einheit'] = get_post_meta($product_id, '_einheit', true) ?: null;
            $data['einheit_short'] = get_post_meta($product_id, '_einheit_short', true) ?: 'm²';
            $data['verpackungsart'] = get_post_meta($product_id, '_verpackungsart', true) ?: null;
            $data['verpackungsart_short'] = get_post_meta($product_id, '_verpackungsart_short', true) ?: null;
            $data['verschnitt'] = floatval(get_post_meta($product_id, '_verschnitt', true)) ?: 5;

            // UVP System (3 Felder)
            $data['show_uvp'] = get_post_meta($product_id, '_show_uvp', true) === 'yes';
            $data['uvp'] = floatval(get_post_meta($product_id, '_uvp', true)) ?: null;
            $data['uvp_paketpreis'] = floatval(get_post_meta($product_id, '_uvp_paketpreis', true)) ?: null;

            // Produktbeschreibung (3 Felder)
            $data['show_text_produktuebersicht'] = get_post_meta($product_id, '_show_text_produktuebersicht', true) === 'yes';
            $data['text_produktuebersicht'] = get_post_meta($product_id, '_text_produktuebersicht', true) ?: null;
            $data['artikelbeschreibung'] = get_post_meta($product_id, '_artikelbeschreibung', true) ?: null;

            // Set-Angebot Konfiguration (6 Felder)
            $data['show_setangebot'] = get_post_meta($product_id, '_show_setangebot', true) === 'yes';
            $data['setangebot_titel'] = get_post_meta($product_id, '_setangebot_titel', true) ?: 'Komplett-Set';
            $data['setangebot_text_color'] = get_post_meta($product_id, '_setangebot_text_color', true) ?: null;
            $data['setangebot_text_size'] = get_post_meta($product_id, '_setangebot_text_size', true) ?: null;
            $data['setangebot_button_style'] = get_post_meta($product_id, '_setangebot_button_style', true) ?: null;
            $data['setangebot_rabatt'] = floatval(get_post_meta($product_id, '_setangebot_rabatt', true)) ?: 0;

            // Set-Angebot Berechnete Werte (4 Felder)
            $data['setangebot_einzelpreis'] = floatval(get_post_meta($product_id, '_setangebot_einzelpreis', true)) ?: null;
            $data['setangebot_gesamtpreis'] = floatval(get_post_meta($product_id, '_setangebot_gesamtpreis', true)) ?: null;
            $data['setangebot_ersparnis_euro'] = floatval(get_post_meta($product_id, '_setangebot_ersparnis_euro', true)) ?: null;
            $data['setangebot_ersparnis_prozent'] = floatval(get_post_meta($product_id, '_setangebot_ersparnis_prozent', true)) ?: null;

            // Zusatzprodukte (4 Felder)
            $data['daemmung_id'] = intval(get_post_meta($product_id, '_standard_addition_daemmung', true)) ?: null;
            $data['sockelleisten_id'] = intval(get_post_meta($product_id, '_standard_addition_sockelleisten', true)) ?: null;

            $daemmung_options = get_post_meta($product_id, '_option_products_daemmung', true);
            $sockelleisten_options = get_post_meta($product_id, '_option_products_sockelleisten', true);

            $data['daemmung_option_ids'] = !empty($daemmung_options) ? array_map('intval', explode(',', $daemmung_options)) : [];
            $data['sockelleisten_option_ids'] = !empty($sockelleisten_options) ? array_map('intval', explode(',', $sockelleisten_options)) : [];

            // Aktionen & Badges (10 Felder)
            $data['show_aktion'] = get_post_meta($product_id, '_show_aktion', true) === 'yes';
            $data['aktion'] = get_post_meta($product_id, '_aktion', true) ?: null;
            $data['aktion_text_color'] = get_post_meta($product_id, '_aktion_text_color', true) ?: null;
            $data['aktion_text_size'] = get_post_meta($product_id, '_aktion_text_size', true) ?: null;
            $data['aktion_button_style'] = get_post_meta($product_id, '_aktion_button_style', true) ?: null;

            $data['show_angebotspreis_hinweis'] = get_post_meta($product_id, '_show_angebotspreis_hinweis', true) === 'yes';
            $data['angebotspreis_hinweis'] = get_post_meta($product_id, '_angebotspreis_hinweis', true) ?: null;
            $data['angebotspreis_text_color'] = get_post_meta($product_id, '_angebotspreis_text_color', true) ?: null;
            $data['angebotspreis_text_size'] = get_post_meta($product_id, '_angebotspreis_text_size', true) ?: null;
            $data['angebotspreis_button_style'] = get_post_meta($product_id, '_angebotspreis_button_style', true) ?: null;

            // Lieferzeit (2 Felder)
            $data['show_lieferzeit'] = get_post_meta($product_id, '_show_lieferzeit', true) === 'yes';
            $data['lieferzeit'] = get_post_meta($product_id, '_lieferzeit', true) ?: null;

            // Testing (1 Feld)
            $data['testdummy'] = get_post_meta($product_id, '_testdummy', true) ?: null;

            // ===== ZUBEHÖR-KATEGORIEN (7 Felder) - für Zubehör-Slider =====
            $data['option_products_untergrundvorbereitung'] = get_post_meta($product_id, '_option_products_untergrundvorbereitung', true) ?: null;
            $data['option_products_werkzeug'] = get_post_meta($product_id, '_option_products_werkzeug', true) ?: null;
            $data['option_products_kleber'] = get_post_meta($product_id, '_option_products_kleber', true) ?: null;
            $data['option_products_montagekleber_silikon'] = get_post_meta($product_id, '_option_products_montagekleber-silikon', true) ?: null;
            $data['option_products_zubehoer_fuer_sockelleisten'] = get_post_meta($product_id, '_option_products_zubehoer-fuer-sockelleisten', true) ?: null;
            $data['option_products_schienen_profile'] = get_post_meta($product_id, '_option_products_schienen-profile', true) ?: null;
            $data['option_products_reinigung_pflege'] = get_post_meta($product_id, '_option_products_reinigung-pflege', true) ?: null;

            // Related Products
            $data['related_products'] = $product->get_upsell_ids();
            $data['cross_sell_products'] = $product->get_cross_sell_ids();

            // Attributes (falls Variable Product)
            if ($product->is_type('variable')) {
                $data['attributes'] = $this->get_product_attributes($product);
                $data['variations'] = $product->get_available_variations();
            }

            // FIELD FILTERING: Felder filtern basierend auf fields Parameter
            // Für Einzelprodukt muss das data-Format erst in das Listen-Format konvertiert werden
            if ($fields_mode !== 'full') {
                $data = $this->convert_single_product_to_list_format($data);
                $data = $this->filter_product_fields($data, $fields_mode);
            }

            return rest_ensure_response($data);

        } catch (Exception $e) {
            Jaeger_Error_Handler::log_error(
                'API get_product_with_custom_fields error: ' . $e->getMessage(),
                Jaeger_Error_Handler::ERROR_LEVEL_ERROR,
                array('product_id' => $product_id)
            );

            return new WP_Error('api_error', 'Fehler beim Laden der Produktdaten', array('status' => 500));
        }
    }

    // ==========================================
    // HELPER METHODS - NUR FÜR ROOT-LEVEL FELDER
    // ==========================================

    /**
     * Parse kommagetrennte Produkt-IDs (safe Version mit vollem Meta-Key)
     */
    private function parse_option_products_safe($product_id, $meta_key) {
        $options_string = get_post_meta($product_id, $meta_key, true);
        if (empty($options_string)) {
            return array();
        }
        return array_map('intval', explode(',', $options_string));
    }


    /**
     * Produktliste (mit Pagination)
     */
    public function get_products_list($request) {
        try {
            $category = $request->get_param('category');
            $per_page = intval($request->get_param('per_page')) ?: 20;
            $page = intval($request->get_param('page')) ?: 1;
            $fields_mode = $request->get_param('fields') ?: 'full';
            $include_ids = $request->get_param('include');
            $orderby = $request->get_param('orderby') ?: 'date';
            $order = $request->get_param('order') ?: 'desc';
            $search = $request->get_param('search');

            // Include-Parameter: Spezifische Produkt-IDs laden
            if ($include_ids) {
                $product_ids = array_map('intval', explode(',', $include_ids));
                $args = array(
                    'post_type' => 'product',
                    'post__in' => $product_ids,
                    'posts_per_page' => -1,
                    'post_status' => 'publish',
                    'orderby' => 'post__in'
                );
            } else {
                // WP_Query orderby mapping
                $orderby_map = array(
                    'date' => 'date',
                    'title' => 'title',
                    'price' => 'meta_value_num',
                    'popularity' => 'meta_value_num'
                );

                $query_orderby = isset($orderby_map[$orderby]) ? $orderby_map[$orderby] : 'date';

                $args = array(
                    'post_type' => 'product',
                    'posts_per_page' => $per_page,
                    'paged' => $page,
                    'post_status' => 'publish',
                    'orderby' => $query_orderby,
                    'order' => strtoupper($order)
                );

                // Meta key für price/popularity Sortierung
                if ($orderby === 'price') {
                    $args['meta_key'] = '_price';
                } elseif ($orderby === 'popularity') {
                    $args['meta_key'] = 'total_sales';
                }

                // Kategorie-Filter
                if ($category) {
                    $args['tax_query'] = array(
                        array(
                            'taxonomy' => 'product_cat',
                            'field' => 'slug',
                            'terms' => $category
                        )
                    );
                }

                // Suche
                if ($search) {
                    $args['s'] = sanitize_text_field($search);
                }
            }

            $query = new WP_Query($args);

            $products = array();
            if ($query->have_posts()) {
                while ($query->have_posts()) {
                    $query->the_post();
                    $product_id = get_the_ID();

                    // Vollständige Produktdaten für Listen (erweitert für Frontend)
                    $product = wc_get_product($product_id);
                    if ($product) {
                        $product_data = array(
                            // ===== BASISFELDER =====
                            'id' => $product_id,
                            'name' => $product->get_name(),
                            'slug' => $product->get_slug(),
                            'permalink' => get_permalink($product_id),
                            'type' => $product->get_type(),
                            'sku' => $product->get_sku(),
                            'featured' => $product->is_featured(),
                            'virtual' => $product->is_virtual(),
                            'downloadable' => $product->is_downloadable(),
                            'short_description' => $product->get_short_description(),

                            // ===== PREISE =====
                            'price' => floatval($product->get_price()),
                            'regular_price' => floatval($product->get_regular_price()),
                            'sale_price' => $product->get_sale_price() ? floatval($product->get_sale_price()) : null,
                            'on_sale' => $product->is_on_sale(),
                            'discount_percent' => $this->calculate_discount_percent($product),

                            // ===== BILDER (Array statt single image) =====
                            'images' => $this->get_product_images_minimal($product),

                            // ===== KATEGORIEN =====
                            'categories' => $this->get_product_categories($product),

                            // ===== LAGERBESTAND =====
                            'stock_status' => $product->get_stock_status(),
                            'stock_quantity' => $product->get_stock_quantity(),

                            // ===== BEWERTUNGEN =====
                            'average_rating' => $product->get_average_rating(),
                            'rating_count' => $product->get_rating_count(),

                            // ===== JAEGER CUSTOM FIELDS (ALLE AUF ROOT-LEVEL) =====

                            // Paketinformationen
                            'paketpreis' => floatval(get_post_meta($product_id, '_paketpreis', true)) ?: null,
                            'paketpreis_s' => floatval(get_post_meta($product_id, '_paketpreis_s', true)) ?: null,
                            'paketinhalt' => floatval(get_post_meta($product_id, '_paketinhalt', true)) ?: null,
                            'einheit' => get_post_meta($product_id, '_einheit', true) ?: null,
                            'einheit_short' => get_post_meta($product_id, '_einheit_short', true) ?: 'm²',
                            'verpackungsart' => get_post_meta($product_id, '_verpackungsart', true) ?: null,
                            'verpackungsart_short' => get_post_meta($product_id, '_verpackungsart_short', true) ?: null,
                            'verschnitt' => floatval(get_post_meta($product_id, '_verschnitt', true)) ?: 5,

                            // UVP System
                            'show_uvp' => get_post_meta($product_id, '_show_uvp', true) === 'yes',
                            'uvp' => floatval(get_post_meta($product_id, '_uvp', true)) ?: null,
                            'uvp_paketpreis' => floatval(get_post_meta($product_id, '_uvp_paketpreis', true)) ?: null,

                            // Produktbeschreibung
                            'show_text_produktuebersicht' => get_post_meta($product_id, '_show_text_produktuebersicht', true) === 'yes',
                            'text_produktuebersicht' => get_post_meta($product_id, '_text_produktuebersicht', true) ?: null,
                            'artikelbeschreibung' => get_post_meta($product_id, '_artikelbeschreibung', true) ?: null,

                            // Set-Angebot
                            'show_setangebot' => get_post_meta($product_id, '_show_setangebot', true) === 'yes',

                            // Aktionen & Badges
                            'show_aktion' => get_post_meta($product_id, '_show_aktion', true) === 'yes',
                            'aktion' => get_post_meta($product_id, '_aktion', true) ?: null,
                            'aktion_text_color' => get_post_meta($product_id, '_aktion_text_color', true) ?: null,
                            'aktion_text_size' => get_post_meta($product_id, '_aktion_text_size', true) ?: null,
                            'aktion_button_style' => get_post_meta($product_id, '_aktion_button_style', true) ?: null,

                            'show_angebotspreis_hinweis' => get_post_meta($product_id, '_show_angebotspreis_hinweis', true) === 'yes',
                            'angebotspreis_hinweis' => get_post_meta($product_id, '_angebotspreis_hinweis', true) ?: null,
                            'angebotspreis_text_color' => get_post_meta($product_id, '_angebotspreis_text_color', true) ?: null,
                            'angebotspreis_text_size' => get_post_meta($product_id, '_angebotspreis_text_size', true) ?: null,
                            'angebotspreis_button_style' => get_post_meta($product_id, '_angebotspreis_button_style', true) ?: null,

                            // Lieferzeit
                            'show_lieferzeit' => get_post_meta($product_id, '_show_lieferzeit', true) === 'yes',
                            'lieferzeit' => get_post_meta($product_id, '_lieferzeit', true) ?: null,

                            // Testing
                            'testdummy' => get_post_meta($product_id, '_testdummy', true) ?: null,

                            // Zubehör-Kategorien (für Zubehör-Slider)
                            'option_products_untergrundvorbereitung' => get_post_meta($product_id, '_option_products_untergrundvorbereitung', true) ?: null,
                            'option_products_werkzeug' => get_post_meta($product_id, '_option_products_werkzeug', true) ?: null,
                            'option_products_kleber' => get_post_meta($product_id, '_option_products_kleber', true) ?: null,
                            'option_products_montagekleber_silikon' => get_post_meta($product_id, '_option_products_montagekleber-silikon', true) ?: null,
                            'option_products_zubehoer_fuer_sockelleisten' => get_post_meta($product_id, '_option_products_zubehoer-fuer-sockelleisten', true) ?: null,
                            'option_products_schienen_profile' => get_post_meta($product_id, '_option_products_schienen-profile', true) ?: null,
                            'option_products_reinigung_pflege' => get_post_meta($product_id, '_option_products_reinigung-pflege', true) ?: null,

                            // ===== SETANGEBOT KONFIGURATION (6 FELDER) =====
                            'setangebot_titel' => get_post_meta($product_id, '_show_setangebot', true) === 'yes'
                                ? (get_post_meta($product_id, '_setangebot_titel', true) ?: 'Komplett-Set')
                                : null,
                            'setangebot_rabatt' => get_post_meta($product_id, '_show_setangebot', true) === 'yes'
                                ? floatval(get_post_meta($product_id, '_setangebot_rabatt', true))
                                : null,
                            'setangebot_text_color' => get_post_meta($product_id, '_show_setangebot', true) === 'yes'
                                ? get_post_meta($product_id, '_setangebot_text_color', true)
                                : null,
                            'setangebot_text_size' => get_post_meta($product_id, '_show_setangebot', true) === 'yes'
                                ? get_post_meta($product_id, '_setangebot_text_size', true)
                                : null,
                            'setangebot_button_style' => get_post_meta($product_id, '_show_setangebot', true) === 'yes'
                                ? get_post_meta($product_id, '_setangebot_button_style', true)
                                : null,

                            // ===== SETANGEBOT PREISE (4 FELDER) =====
                            'setangebot_einzelpreis' => get_post_meta($product_id, '_show_setangebot', true) === 'yes'
                                ? floatval(get_post_meta($product_id, '_setangebot_einzelpreis', true))
                                : null,
                            'setangebot_gesamtpreis' => get_post_meta($product_id, '_show_setangebot', true) === 'yes'
                                ? floatval(get_post_meta($product_id, '_setangebot_gesamtpreis', true))
                                : null,
                            'setangebot_ersparnis_euro' => get_post_meta($product_id, '_show_setangebot', true) === 'yes'
                                ? floatval(get_post_meta($product_id, '_setangebot_ersparnis_euro', true))
                                : null,
                            'setangebot_ersparnis_prozent' => get_post_meta($product_id, '_show_setangebot', true) === 'yes'
                                ? floatval(get_post_meta($product_id, '_setangebot_ersparnis_prozent', true))
                                : null,

                            // ===== ZUSATZPRODUKT-IDs (4 FELDER) =====
                            'daemmung_id' => get_post_meta($product_id, '_show_setangebot', true) === 'yes'
                                ? (intval(get_post_meta($product_id, '_standard_addition_daemmung', true)) ?: null)
                                : null,
                            'sockelleisten_id' => get_post_meta($product_id, '_show_setangebot', true) === 'yes'
                                ? (intval(get_post_meta($product_id, '_standard_addition_sockelleisten', true)) ?: null)
                                : null,
                            'daemmung_option_ids' => get_post_meta($product_id, '_show_setangebot', true) === 'yes'
                                ? $this->parse_option_products_safe($product_id, '_option_products_daemmung')
                                : [],
                            'sockelleisten_option_ids' => get_post_meta($product_id, '_show_setangebot', true) === 'yes'
                                ? $this->parse_option_products_safe($product_id, '_option_products_sockelleisten')
                                : [],
                        );

                        // FIELD FILTERING: Felder filtern basierend auf fields Parameter
                        $products[] = $this->filter_product_fields($product_data, $fields_mode);
                    }
                }
                wp_reset_postdata();
            }

            $response = array(
                'products' => $products,
                'pagination' => array(
                    'total' => $query->found_posts,
                    'total_pages' => $query->max_num_pages,
                    'current_page' => $page,
                    'per_page' => $per_page
                )
            );

            return rest_ensure_response($response);

        } catch (Exception $e) {
            Jaeger_Error_Handler::log_error(
                'API get_products_list error: ' . $e->getMessage(),
                Jaeger_Error_Handler::ERROR_LEVEL_ERROR
            );

            return new WP_Error('api_error', 'Fehler beim Laden der Produktliste', array('status' => 500));
        }
    }

    /**
     * Kategorien mit Produktanzahl
     */
    public function get_categories($request) {
        $terms = get_terms(array(
            'taxonomy' => 'product_cat',
            'hide_empty' => true,
            'orderby' => 'name',
            'order' => 'ASC'
        ));

        $categories = array();
        foreach ($terms as $term) {
            $thumbnail_id = get_term_meta($term->term_id, 'thumbnail_id', true);

            $categories[] = array(
                'id' => $term->term_id,
                'name' => $term->name,
                'slug' => $term->slug,
                'count' => $term->count,
                'description' => $term->description,
                'parent' => $term->parent,
                'image' => $thumbnail_id ? wp_get_attachment_url($thumbnail_id) : null
            );
        }

        return rest_ensure_response($categories);
    }

    // ==========================================
    // HELPER METHODS
    // ==========================================

    private function get_product_images($product) {
        $images = array();

        // Hauptbild
        $image_id = $product->get_image_id();
        if ($image_id) {
            $images[] = $this->get_image_data($image_id, true);
        }

        // Galerie
        $gallery_ids = $product->get_gallery_image_ids();
        foreach ($gallery_ids as $image_id) {
            $images[] = $this->get_image_data($image_id, false);
        }

        return $images;
    }

    /**
     * Erweiterte Bild-Informationen mit allen Größen
     */
    private function get_image_data($image_id, $is_featured = false) {
        $image_meta = wp_get_attachment_metadata($image_id);
        $image_post = get_post($image_id);
        $file_path = get_attached_file($image_id);

        return array(
            'id' => $image_id,
            'date_created' => $image_post ? $image_post->post_date : null,
            'date_modified' => $image_post ? $image_post->post_modified : null,
            'src' => wp_get_attachment_url($image_id),
            'name' => get_the_title($image_id),
            'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
            'position' => $is_featured ? 0 : null,

            // ALLE WORDPRESS BILD-GRÖSSEN
            'sizes' => array(
                'thumbnail' => wp_get_attachment_image_url($image_id, 'thumbnail'),
                'medium' => wp_get_attachment_image_url($image_id, 'medium'),
                'medium_large' => wp_get_attachment_image_url($image_id, 'medium_large'),
                'large' => wp_get_attachment_image_url($image_id, 'large'),
                'full' => wp_get_attachment_url($image_id),

                // WOOCOMMERCE BILD-GRÖSSEN
                'woocommerce_thumbnail' => wp_get_attachment_image_url($image_id, 'woocommerce_thumbnail'),
                'woocommerce_single' => wp_get_attachment_image_url($image_id, 'woocommerce_single'),
                'woocommerce_gallery_thumbnail' => wp_get_attachment_image_url($image_id, 'woocommerce_gallery_thumbnail'),
            ),

            // BILD-DIMENSIONEN
            'dimensions' => array(
                'width' => isset($image_meta['width']) ? $image_meta['width'] : null,
                'height' => isset($image_meta['height']) ? $image_meta['height'] : null,
            ),

            // DATEI-INFORMATIONEN
            'mime_type' => get_post_mime_type($image_id),
            'file_size' => $file_path && file_exists($file_path) ? filesize($file_path) : null,
        );
    }

    /**
     * Vereinfachte Bild-Informationen für Produktliste
     * Weniger Felder als get_image_data() für bessere Performance
     */
    private function get_product_images_minimal($product) {
        $images = array();

        // Hauptbild + Galerie
        $image_ids = array_filter(array_merge(
            [$product->get_image_id()],
            $product->get_gallery_image_ids()
        ));

        foreach ($image_ids as $image_id) {
            $images[] = array(
                'id' => $image_id,
                'src' => wp_get_attachment_url($image_id),
                'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
                'name' => get_the_title($image_id),
                'sizes' => array(
                    'thumbnail' => wp_get_attachment_image_url($image_id, 'thumbnail'),
                    'medium' => wp_get_attachment_image_url($image_id, 'medium'),
                    'large' => wp_get_attachment_image_url($image_id, 'large'),
                    'full' => wp_get_attachment_url($image_id),
                    'woocommerce_thumbnail' => wp_get_attachment_image_url($image_id, 'woocommerce_thumbnail'),
                    'woocommerce_single' => wp_get_attachment_image_url($image_id, 'woocommerce_single'),
                )
            );
        }

        return $images;
    }

    /**
     * Berechnet Sale-Rabatt in Prozent
     */
    private function calculate_discount_percent($product) {
        if (!$product->is_on_sale()) {
            return 0;
        }

        $regular = floatval($product->get_regular_price());
        $sale = floatval($product->get_sale_price());

        if ($regular > 0 && $sale < $regular) {
            return round((($regular - $sale) / $regular) * 100);
        }

        return 0;
    }

    private function get_product_categories($product) {
        $category_ids = $product->get_category_ids();
        $categories = array();

        foreach ($category_ids as $cat_id) {
            $category = get_term($cat_id, 'product_cat');
            if ($category) {
                $categories[] = array(
                    'id' => $category->term_id,
                    'name' => $category->name,
                    'slug' => $category->slug
                );
            }
        }

        return $categories;
    }

    private function get_product_tags($product) {
        $tag_ids = $product->get_tag_ids();
        $tags = array();

        foreach ($tag_ids as $tag_id) {
            $tag = get_term($tag_id, 'product_tag');
            if ($tag) {
                $tags[] = array(
                    'id' => $tag->term_id,
                    'name' => $tag->name,
                    'slug' => $tag->slug
                );
            }
        }

        return $tags;
    }

    private function get_product_attributes($product) {
        $attributes = array();
        foreach ($product->get_attributes() as $attribute) {
            $attributes[] = array(
                'id' => $attribute->get_id(),
                'name' => $attribute->get_name(),
                'options' => $attribute->get_options(),
                'visible' => $attribute->get_visible(),
                'variation' => $attribute->get_variation()
            );
        }
        return $attributes;
    }

    // ==========================================
    // FIELD FILTERING FOR PERFORMANCE
    // ==========================================

    /**
     * Konvertiert Einzelprodukt-Format in Listen-Format
     * Notwendig damit filter_product_fields() funktioniert
     * Jetzt nutzt Root-Level Felder direkt!
     */
    private function convert_single_product_to_list_format($data) {
        return array(
            'id' => $data['id'],
            'name' => $data['name'],
            'slug' => $data['slug'],
            'price' => $data['prices']['price'] ?? 0,
            'regular_price' => $data['prices']['regular_price'] ?? 0,
            'sale_price' => $data['prices']['sale_price'] ?? null,
            'on_sale' => $data['prices']['on_sale'] ?? false,
            'discount_percent' => $this->calculate_discount_percent(wc_get_product($data['id'])),
            'images' => $data['images'] ?? [],
            'categories' => $data['categories'] ?? [],
            'stock_status' => $data['stock']['stock_status'] ?? 'outofstock',

            // Root-Level Felder direkt verwenden (bereits vorhanden!)
            'show_setangebot' => $data['show_setangebot'] ?? false,
            'setangebot_ersparnis_prozent' => $data['setangebot_ersparnis_prozent'] ?? null,
            'setangebot_einzelpreis' => $data['setangebot_einzelpreis'] ?? null,
            'setangebot_gesamtpreis' => $data['setangebot_gesamtpreis'] ?? null,
            'einheit_short' => $data['einheit_short'] ?? 'm²',
            'paketinhalt' => $data['paketinhalt'] ?? 0,
            'uvp' => $data['uvp'] ?? null,
            'show_uvp' => $data['show_uvp'] ?? false,
            'verpackungsart_short' => $data['verpackungsart_short'] ?? 'Pak.',
            'show_aktion' => $data['show_aktion'] ?? false,
            'aktion' => $data['aktion'] ?? null,
            'show_angebotspreis_hinweis' => $data['show_angebotspreis_hinweis'] ?? false,
            'angebotspreis_hinweis' => $data['angebotspreis_hinweis'] ?? null,
        );
    }

    /**
     * Filtert Produktdaten basierend auf fields Parameter
     *
     * @param array $product Vollständiges Produkt-Array
     * @param string $fields_mode 'critical', 'minimal', oder 'full'
     * @return array Gefiltertes Produkt-Array
     */
    private function filter_product_fields($product, $fields_mode) {
        switch ($fields_mode) {
            case 'critical':
                return $this->filter_critical_fields($product);
            case 'minimal':
                return $this->filter_minimal_fields($product);
            case 'full':
            default:
                return $product; // Keine Änderung
        }
    }

    /**
     * CRITICAL FIELDS - Nur für Produktkarten (Startseite, Kategorien)
     * ~23 Felder statt 40+ = 70% kleinere Payload
     */
    private function filter_critical_fields($product) {
        // Erstes Bild extrahieren
        $thumbnail = isset($product['images'][0]) ? $product['images'][0] : null;

        return array(
            'id' => $product['id'],
            'name' => $product['name'],
            'slug' => $product['slug'],

            // Bild (nur Thumbnail)
            'thumbnail' => $thumbnail ? $thumbnail['src'] : null,
            'thumbnail_alt' => $thumbnail ? $thumbnail['alt'] : $product['name'],
            'thumbnail_sizes' => $thumbnail ? $thumbnail['sizes'] : null,

            // Preise
            'price' => $product['price'] ?? 0,
            'regular_price' => $product['regular_price'] ?? 0,
            'sale_price' => $product['sale_price'] ?? null,
            'on_sale' => $product['on_sale'] ?? false,
            'discount_percent' => $product['discount_percent'] ?? 0,

            // UVP (Root-Level)
            'uvp' => $product['uvp'] ?? null,
            'show_uvp' => $product['show_uvp'] ?? false,

            // Einheit (Root-Level)
            'einheit_short' => $product['einheit_short'] ?? 'm²',

            // Set-Angebot (Root-Level)
            'show_setangebot' => $product['show_setangebot'] ?? false,
            'setangebot_ersparnis_prozent' => $product['setangebot_ersparnis_prozent'] ?? null,
            'setangebot_einzelpreis' => $product['setangebot_einzelpreis'] ?? null,
            'setangebot_gesamtpreis' => $product['setangebot_gesamtpreis'] ?? null,

            // Lagerbestand
            'is_in_stock' => $product['stock_status'] === 'instock',
            'stock_status' => $product['stock_status'] ?? 'outofstock',

            // Badges (Root-Level)
            'show_aktion' => $product['show_aktion'] ?? false,
            'aktion' => $product['aktion'] ?? null,
            'show_angebotspreis_hinweis' => $product['show_angebotspreis_hinweis'] ?? false,
            'angebotspreis_hinweis' => $product['angebotspreis_hinweis'] ?? null,

            // Optional: Kategorien für Filtering
            'categories' => $product['categories'] ?? [],
        );
    }

    /**
     * MINIMAL FIELDS - Nur für Modals (Dämmung/Sockelleisten-Auswahl)
     * ~9 Felder = 90% kleinere Payload
     */
    private function filter_minimal_fields($product) {
        // Erstes Bild extrahieren
        $image = isset($product['images'][0]) ? $product['images'][0] : null;

        return array(
            'id' => $product['id'],
            'name' => $product['name'],
            'price' => $product['price'] ?? 0,
            'image' => $image ? $image['src'] : null,
            'image_alt' => $image ? $image['alt'] : $product['name'],
            // Root-Level Felder
            'einheit_short' => $product['einheit_short'] ?? 'm²',
            'paketinhalt' => $product['paketinhalt'] ?? 0,
            'verpackungsart_short' => $product['verpackungsart_short'] ?? 'Pak.',
            'is_in_stock' => $product['stock_status'] === 'instock',
        );
    }
}

// Initialize Product Data API
new Jaeger_Product_Data_API();
