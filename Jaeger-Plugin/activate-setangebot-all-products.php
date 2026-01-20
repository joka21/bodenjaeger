<?php
/**
 * Einmaliges Script: Aktiviert Set-Angebot für ALLE Produkte
 *
 * VERWENDUNG:
 * 1. Diese Datei in WordPress Root-Verzeichnis hochladen
 * 2. Im Browser aufrufen: https://deine-domain.de/activate-setangebot-all-products.php
 * 3. Nach Ausführung wieder löschen!
 */

// WordPress laden
require_once('wp-load.php');

// Sicherheitscheck: Nur für Admins
if (!current_user_can('manage_options')) {
    die('⛔ Keine Berechtigung!');
}

// Alle WooCommerce Produkte holen
$args = array(
    'post_type' => 'product',
    'posts_per_page' => -1, // Alle Produkte
    'post_status' => 'any',
    'fields' => 'ids'
);

$product_ids = get_posts($args);

echo '<h1>Set-Angebot für alle Produkte aktivieren</h1>';
echo '<p>Gefundene Produkte: <strong>' . count($product_ids) . '</strong></p>';
echo '<hr>';

$updated = 0;
$already_active = 0;
$errors = 0;

foreach ($product_ids as $product_id) {
    $product = wc_get_product($product_id);

    if (!$product) {
        echo "❌ Produkt ID $product_id nicht gefunden<br>";
        $errors++;
        continue;
    }

    $current_value = get_post_meta($product_id, '_show_setangebot', true);

    if ($current_value === 'yes') {
        echo "✓ <span style='color: green;'>Produkt #{$product_id}: \"{$product->get_name()}\" - bereits aktiv</span><br>";
        $already_active++;
    } else {
        update_post_meta($product_id, '_show_setangebot', 'yes');
        echo "✅ <strong style='color: blue;'>Produkt #{$product_id}: \"{$product->get_name()}\" - Set-Angebot AKTIVIERT</strong><br>";
        $updated++;
    }
}

echo '<hr>';
echo '<h2>Zusammenfassung:</h2>';
echo '<ul>';
echo '<li><strong>Gesamt:</strong> ' . count($product_ids) . ' Produkte</li>';
echo '<li><strong style="color: blue;">Neu aktiviert:</strong> ' . $updated . ' Produkte</li>';
echo '<li><strong style="color: green;">Bereits aktiv:</strong> ' . $already_active . ' Produkte</li>';
echo '<li><strong style="color: red;">Fehler:</strong> ' . $errors . ' Produkte</li>';
echo '</ul>';

echo '<hr>';
echo '<p style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107;">';
echo '⚠️ <strong>WICHTIG:</strong> Jetzt musst du noch die <strong>Preisberechnungen</strong> für alle Produkte durchführen!<br>';
echo 'Verwende dazu das Script: <code>calculate-all-setangebot-prices.php</code>';
echo '</p>';

echo '<p style="background: #f8d7da; padding: 15px; border-left: 4px solid #dc3545;">';
echo '🔴 <strong>Sicherheit:</strong> Bitte diese Datei jetzt löschen!';
echo '</p>';
