
<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Styles für die Shortcodes laden
function jaeger_enqueue_shortcodes_styles() {
    wp_enqueue_style('jaeger-shortcodes-styles', plugins_url('css/shortcodes-cards.css', __FILE__));
}
add_action('wp_enqueue_scripts', 'jaeger_enqueue_shortcodes_styles');

// Shortcode für den ursprünglichen Preis (Einzelpreis)
function jaeger_einzelpreis_shortcode($atts) {
    global $product;
    
    // Produkt abrufen, wenn nicht vorhanden
    if (!$product) {
        $product_id = get_the_ID();
        if (!$product_id) return '';
        $product = wc_get_product($product_id);
        if (!$product) return '';
    }
    
    $einzelpreis = get_post_meta($product->get_id(), '_setangebot_einzelpreis', true);
    
    // Einheit holen (m² oder lfm)
    $einheit_short = get_post_meta($product->get_id(), '_einheit_short', true);
    if (empty($einheit_short)) $einheit_short = 'm²';
    
    $atts = shortcode_atts([
        'prefix' => 'statt ',
        'suffix' => '',
        'format' => 'true',
    ], $atts);
    
    if (!empty($einzelpreis)) {
        if ($atts['format'] === 'true') {
            $preis_anzeige = number_format((float)$einzelpreis, 2, ',', '.');
        } else {
            $preis_anzeige = $einzelpreis;
        }
        
        return '<div class="jaeger-einzelpreis">' . esc_html($atts['prefix']) . 
               $preis_anzeige . ' €/' . $einheit_short . esc_html($atts['suffix']) . '</div>';
    }
    
    return '';
}
add_shortcode('einzelpreis', 'jaeger_einzelpreis_shortcode');

// Shortcode für den rabattierten Gesamtpreis
function jaeger_gesamtpreis_shortcode($atts) {
    global $product;
    
    // Produkt abrufen, wenn nicht vorhanden
    if (!$product) {
        $product_id = get_the_ID();
        if (!$product_id) return '';
        $product = wc_get_product($product_id);
        if (!$product) return '';
    }
    
    $gesamtpreis = get_post_meta($product->get_id(), '_setangebot_gesamtpreis', true);
    
    // Einheit holen (m² oder lfm)
    $einheit_short = get_post_meta($product->get_id(), '_einheit_short', true);
    if (empty($einheit_short)) $einheit_short = 'm²';
    
    $atts = shortcode_atts([
        'prefix' => '',
        'suffix' => '',
        'format' => 'true',
        'size' => 'normal',  // normal, large, small
    ], $atts);
    
    $size_class = 'size-' . $atts['size'];
    
    if (!empty($gesamtpreis)) {
        if ($atts['format'] === 'true') {
            $preis_anzeige = number_format((float)$gesamtpreis, 2, ',', '.');
        } else {
            $preis_anzeige = $gesamtpreis;
        }
        
        return '<div class="jaeger-gesamtpreis ' . esc_attr($size_class) . '">' . esc_html($atts['prefix']) . 
               $preis_anzeige . ' €/' . $einheit_short . esc_html($atts['suffix']) . '</div>';
    }
    
    return '';
}
add_shortcode('gesamtpreis', 'jaeger_gesamtpreis_shortcode');

// Shortcode für die Ersparnis in Euro
function jaeger_ersparnis_euro_shortcode($atts) {
    global $product;
    
    // Produkt abrufen, wenn nicht vorhanden
    if (!$product) {
        $product_id = get_the_ID();
        if (!$product_id) return '';
        $product = wc_get_product($product_id);
        if (!$product) return '';
    }
    
    $ersparnis_euro = get_post_meta($product->get_id(), '_setangebot_ersparnis_euro', true);
    
    $atts = shortcode_atts([
        'prefix' => 'Sie sparen ',
        'suffix' => '',
        'format' => 'true',
    ], $atts);
    
    if (!empty($ersparnis_euro)) {
        if ($atts['format'] === 'true') {
            $preis_anzeige = number_format((float)$ersparnis_euro, 2, ',', '.');
        } else {
            $preis_anzeige = $ersparnis_euro;
        }
        
        return '<div class="jaeger-ersparnis-euro">' . esc_html($atts['prefix']) . 
               $preis_anzeige . ' €' . esc_html($atts['suffix']) . '</div>';
    }
    
    return '';
}
add_shortcode('ersparnis_euro', 'jaeger_ersparnis_euro_shortcode');

// Shortcode für die Ersparnis in Prozent
function jaeger_ersparnis_prozent_shortcode($atts) {
    global $product;
    
    // Produkt abrufen, wenn nicht vorhanden
    if (!$product) {
        $product_id = get_the_ID();
        if (!$product_id) return '';
        $product = wc_get_product($product_id);
        if (!$product) return '';
    }
    
    $ersparnis_prozent = get_post_meta($product->get_id(), '_setangebot_ersparnis_prozent', true);
    
    $atts = shortcode_atts([
        'prefix' => '-',
        'suffix' => '%',
        'style' => 'text',  // badge, text
        'round' => 'true',
    ], $atts);
    
    if (!empty($ersparnis_prozent)) {
        // Auf ganze Zahlen runden, wenn gewünscht
        if ($atts['round'] === 'true') {
            $prozent = round((float)$ersparnis_prozent);
        } else {
            $prozent = (float)$ersparnis_prozent;
        }
        
        if ($atts['style'] === 'badge') {
            return '<div class="jaeger-ersparnis-prozent-badge">' . 
                   esc_html($atts['prefix']) . $prozent . esc_html($atts['suffix']) . '</div>';
        } else {
            return '<div class="jaeger-ersparnis-prozent-text">' . 
                   esc_html($atts['prefix']) . $prozent . esc_html($atts['suffix']) . '</div>';
        }
    }
    
    return '';
}
add_shortcode('ersparnis_prozent', 'jaeger_ersparnis_prozent_shortcode');

// Shortcode für Set-Angebot komplette Box
function jaeger_setangebot_display_shortcode($atts) {
    global $product;
    
    // Produkt abrufen, wenn nicht vorhanden
    if (!$product) {
        $product_id = get_the_ID();
        if (!$product_id) return '';
        $product = wc_get_product($product_id);
        if (!$product) return '';
    }
    
    $atts = shortcode_atts([
        'title' => 'Set-Angebot',
        'text' => 'Inkl. Sockelleiste und Dämmung',
        'show_stattpreis' => 'true',
        'show_ersparnis' => 'false',
        'preisgroesse' => 'large',
    ], $atts);
    
    $output = '<div class="jaeger-setangebot-display">';
    
    // Titel
    $output .= '<div class="jaeger-setangebot-display-titel">' . esc_html($atts['title']) . '</div>';
    
    // Text
    $output .= '<div class="jaeger-setangebot-display-text">' . esc_html($atts['text']) . '</div>';
    
    // Preise
    $output .= '<div class="jaeger-setangebot-display-preise">';
    
    if ($atts['show_stattpreis'] === 'true') {
        $output .= do_shortcode('[einzelpreis]');
    }
    
    $output .= do_shortcode('[gesamtpreis size="' . esc_attr($atts['preisgroesse']) . '"]');
    
    if ($atts['show_ersparnis'] === 'true') {
        $output .= do_shortcode('[ersparnis_euro]');
    }
    
    $output .= '</div>'; // Ende preise
    $output .= '</div>'; // Ende setangebot-display
    
    return $output;
}
add_shortcode('setangebot_display', 'jaeger_setangebot_display_shortcode');

// Shortcode für Produktkarte mit allen Werten
function jaeger_card_shortcode($atts) {
    global $product;
    
    // Produkt abrufen, wenn nicht vorhanden
    if (!$product) {
        $product_id = get_the_ID();
        if (!$product_id) return '';
        $product = wc_get_product($product_id);
        if (!$product) return '';
    }
    
    // Prüfen, ob Rabatt berechnet wurde
    $ersparnis_prozent = get_post_meta($product->get_id(), '_setangebot_ersparnis_prozent', true);
    
    $atts = shortcode_atts([
        'show_image' => 'true',
        'show_title' => 'true',
        'show_rabatt' => 'true',
        'image_size' => 'woocommerce_thumbnail',
        'title' => 'Set-Angebot',
        'text' => 'Inkl. Sockelleiste und Dämmung',
    ], $atts);
    
    $output = '<div class="jaeger-produktcard">';
    
    // Bild und Badge
    if ($atts['show_image'] === 'true') {
        $image = wp_get_attachment_image_src(get_post_thumbnail_id($product->get_id()), $atts['image_size']);
        if ($image) {
            $output .= '<div class="jaeger-produktcard-bild">';
            $output .= '<img src="' . esc_url($image[0]) . '" alt="' . esc_attr($product->get_name()) . '">';
            
            // Rabatt Badge hinzufügen, wenn vorhanden
            if ($atts['show_rabatt'] === 'true' && !empty($ersparnis_prozent)) {
                $output .= do_shortcode('[ersparnis_prozent style="badge"]');
            }
            
            $output .= '</div>'; // Ende bild
        }
    }
    
    // Titel
    if ($atts['show_title'] === 'true') {
        $output .= '<h3 class="jaeger-produktcard-titel">' . esc_html($product->get_name()) . '</h3>';
    }
    
    // Set-Angebot Info
    $output .= '<div class="jaeger-produktcard-info">';
    $output .= '<div class="jaeger-produktcard-titel">' . esc_html($atts['title']) . '</div>';
    $output .= '<div class="jaeger-produktcard-text">' . esc_html($atts['text']) . '</div>';
    $output .= '</div>';
    
    // Preise
    $output .= '<div class="jaeger-produktcard-preise">';
    $output .= do_shortcode('[einzelpreis]');
    $output .= do_shortcode('[gesamtpreis size="large"]');
    $output .= '</div>';
    
    $output .= '</div>'; // Ende produktcard
    
    return $output;
}
add_shortcode('produktcard', 'jaeger_card_shortcode');