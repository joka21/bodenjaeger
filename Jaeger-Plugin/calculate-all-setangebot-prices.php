<?php
/**
 * Einmaliges Script: Berechnet Set-Angebot Preise für ALLE Produkte
 *
 * VERWENDUNG:
 * 1. Diese Datei in WordPress Root-Verzeichnis hochladen
 * 2. Im Browser aufrufen: https://deine-domain.de/calculate-all-setangebot-prices.php
 * 3. Nach Ausführung wieder löschen!
 *
 * WICHTIG: Dieses Script kann mehrere Minuten laufen!
 */

// Timeout erhöhen (bis zu 5 Minuten)
set_time_limit(300);

// WordPress laden
require_once('wp-load.php');

// Sicherheitscheck: Nur für Admins
if (!current_user_can('manage_options')) {
    die('⛔ Keine Berechtigung!');
}

echo '<h1>Set-Angebot Preise für alle Produkte berechnen</h1>';
echo '<p><em>Dieses Script kann einige Minuten dauern...</em></p>';
echo '<hr>';

// Alle Produkte mit aktiviertem Set-Angebot
$args = array(
    'post_type' => 'product',
    'posts_per_page' => -1,
    'post_status' => 'any',
    'fields' => 'ids',
    'meta_query' => array(
        array(
            'key' => '_show_setangebot',
            'value' => 'yes'
        )
    )
);

$product_ids = get_posts($args);

echo '<p>Produkte mit Set-Angebot: <strong>' . count($product_ids) . '</strong></p>';
echo '<hr>';

$calculated = 0;
$skipped = 0;
$errors = 0;

foreach ($product_ids as $product_id) {
    $product = wc_get_product($product_id);

    if (!$product) {
        echo "❌ Produkt ID $product_id nicht gefunden<br>";
        $errors++;
        continue;
    }

    echo "<strong>Produkt #{$product_id}: \"{$product->get_name()}\"</strong><br>";

    // Zusatzprodukte-IDs laden
    $daemmung_id = get_post_meta($product_id, '_standard_addition_daemmung', true);
    $sockelleisten_id = get_post_meta($product_id, '_standard_addition_sockelleisten', true);

    // Preise der Zusatzprodukte
    $daemmung_price = 0;
    $sockelleisten_price = 0;

    if ($daemmung_id) {
        $daemmung = wc_get_product($daemmung_id);
        if ($daemmung) {
            $daemmung_price = floatval($daemmung->get_price());
            echo "  └─ Dämmung ID: $daemmung_id (€ " . number_format($daemmung_price, 2, ',', '.') . ")<br>";
        }
    }

    if ($sockelleisten_id) {
        $sockelleisten = wc_get_product($sockelleisten_id);
        if ($sockelleisten) {
            $sockelleisten_price = floatval($sockelleisten->get_price());
            echo "  └─ Sockelleiste ID: $sockelleisten_id (€ " . number_format($sockelleisten_price, 2, ',', '.') . ")<br>";
        }
    }

    // UVP und Preise des Hauptprodukts
    $show_uvp = get_post_meta($product_id, '_show_uvp', true) === 'yes';
    $uvp_price = floatval(get_post_meta($product_id, '_uvp', true));
    $regular_price = floatval($product->get_regular_price());
    $sale_price = floatval($product->get_sale_price());
    $rabatt = floatval(get_post_meta($product_id, '_setangebot_rabatt', true));

    // Höchsten Preis ermitteln
    $highest_price = $regular_price;
    if ($show_uvp && $uvp_price > 0) {
        $highest_price = $uvp_price;
    }

    // Niedrigsten Preis ermitteln
    $lowest_price = $regular_price;
    if ($sale_price > 0) {
        $lowest_price = $sale_price;
    }

    // Berechnung
    $einzelpreis = $highest_price + $daemmung_price + $sockelleisten_price;
    $gesamtpreis = $lowest_price;

    // Rabatt anwenden
    if ($rabatt > 0) {
        $gesamtpreis = $gesamtpreis * (1 - ($rabatt / 100));
    }

    $ersparnis_euro = $einzelpreis - $gesamtpreis;
    $ersparnis_prozent = ($einzelpreis > 0) ? ($ersparnis_euro / $einzelpreis * 100) : 0;

    // In Datenbank speichern
    update_post_meta($product_id, '_setangebot_einzelpreis', $einzelpreis);
    update_post_meta($product_id, '_setangebot_gesamtpreis', $gesamtpreis);
    update_post_meta($product_id, '_setangebot_ersparnis_euro', $ersparnis_euro);
    update_post_meta($product_id, '_setangebot_ersparnis_prozent', $ersparnis_prozent);

    echo "  ✅ <span style='color: green;'>Berechnet:</span><br>";
    echo "     • Einzelpreis: € " . number_format($einzelpreis, 2, ',', '.') . "<br>";
    echo "     • Set-Preis: € " . number_format($gesamtpreis, 2, ',', '.') . "<br>";
    echo "     • Ersparnis: € " . number_format($ersparnis_euro, 2, ',', '.') . " (" . number_format($ersparnis_prozent, 2, ',', '.') . "%)<br>";
    echo "<br>";

    $calculated++;

    // Alle 10 Produkte einen kurzen Flush für Browser-Output
    if ($calculated % 10 == 0) {
        flush();
        ob_flush();
    }
}

echo '<hr>';
echo '<h2>Zusammenfassung:</h2>';
echo '<ul>';
echo '<li><strong style="color: green;">Erfolgreich berechnet:</strong> ' . $calculated . ' Produkte</li>';
echo '<li><strong style="color: orange;">Übersprungen:</strong> ' . $skipped . ' Produkte</li>';
echo '<li><strong style="color: red;">Fehler:</strong> ' . $errors . ' Produkte</li>';
echo '</ul>';

echo '<hr>';
echo '<p style="background: #d4edda; padding: 15px; border-left: 4px solid #28a745;">';
echo '✅ <strong>FERTIG!</strong> Alle Set-Angebot Preise wurden berechnet und in der Datenbank gespeichert.';
echo '</p>';

echo '<p style="background: #f8d7da; padding: 15px; border-left: 4px solid #dc3545;">';
echo '🔴 <strong>Sicherheit:</strong> Bitte diese Datei jetzt löschen!';
echo '</p>';
