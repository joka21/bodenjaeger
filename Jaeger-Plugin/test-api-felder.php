<?php
/**
 * Test-Script für die 6 fehlenden API-Felder
 *
 * VERWENDUNG:
 * 1. Hochladen in WordPress Root-Verzeichnis
 * 2. Im Browser aufrufen: https://deine-domain.de/test-api-felder.php
 * 3. Nach Test LÖSCHEN!
 */

// WordPress laden
require_once('wp-load.php');

// Sicherheitscheck
if (!current_user_can('manage_options')) {
    die('⛔ Keine Berechtigung! Nur Administratoren können dieses Script ausführen.');
}

?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔍 Test: 6 Fehlende API-Felder</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1400px;
            margin: 40px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #2c5aa0;
            padding-bottom: 10px;
        }
        .test-section {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .test-section h2 {
            color: #2c5aa0;
            margin-top: 0;
        }
        .success {
            color: #28a745;
            font-weight: bold;
        }
        .error {
            color: #dc3545;
            font-weight: bold;
        }
        .warning {
            color: #ffc107;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #2c5aa0;
            color: white;
            font-weight: bold;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .code {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            overflow-x: auto;
            white-space: pre-wrap;
        }
        .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .badge-success {
            background: #d4edda;
            color: #155724;
        }
        .badge-error {
            background: #f8d7da;
            color: #721c24;
        }
    </style>
</head>
<body>
    <h1>🔍 Test: 6 Fehlende API-Felder</h1>
    <p><strong>Datum:</strong> <?php echo date('d.m.Y H:i:s'); ?></p>

    <?php
    // Finde ein Produkt mit aktiviertem Set-Angebot
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => 1,
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => '_show_setangebot',
                'value' => 'yes',
                'compare' => '='
            )
        )
    );

    $query = new WP_Query($args);

    if (!$query->have_posts()) {
        echo '<div class="test-section">';
        echo '<h2 class="error">❌ Kein Produkt mit Set-Angebot gefunden!</h2>';
        echo '<p>Bitte aktiviere Set-Angebot für mindestens ein Produkt.</p>';
        echo '</div>';
        exit;
    }

    $query->the_post();
    $product_id = get_the_ID();
    $product_slug = get_post_field('post_name', $product_id);
    wp_reset_postdata();
    ?>

    <div class="test-section">
        <h2>📦 Test-Produkt</h2>
        <p><strong>ID:</strong> <?php echo $product_id; ?></p>
        <p><strong>Slug:</strong> <?php echo $product_slug; ?></p>
        <p><strong>Name:</strong> <?php echo get_the_title($product_id); ?></p>
    </div>

    <?php
    // Test 1: Direkter Datenbankcheck
    echo '<div class="test-section">';
    echo '<h2>1️⃣ Datenbank-Check</h2>';
    echo '<p>Prüfe ob die Felder in der Datenbank existieren:</p>';

    $db_fields = array(
        '_setangebot_titel' => 'Set-Angebot Titel',
        '_setangebot_rabatt' => 'Zusatz-Rabatt',
        '_standard_addition_daemmung' => 'Dämmung ID',
        '_standard_addition_sockelleisten' => 'Sockelleisten ID',
        '_option_products_daemmung' => 'Dämmung Optionen',
        '_option_products_sockelleisten' => 'Sockelleisten Optionen',
    );

    echo '<table>';
    echo '<tr><th>Feld</th><th>Beschreibung</th><th>Wert</th><th>Status</th></tr>';

    foreach ($db_fields as $key => $label) {
        $value = get_post_meta($product_id, $key, true);
        $has_value = !empty($value);
        $status_class = $has_value ? 'badge-success' : 'badge-error';
        $status_text = $has_value ? '✅ Vorhanden' : '❌ Leer';

        echo '<tr>';
        echo '<td><code>' . $key . '</code></td>';
        echo '<td>' . $label . '</td>';
        echo '<td>' . ($has_value ? esc_html($value) : '<em>leer</em>') . '</td>';
        echo '<td><span class="badge ' . $status_class . '">' . $status_text . '</span></td>';
        echo '</tr>';
    }

    echo '</table>';
    echo '</div>';

    // Test 2: API-Endpoint Test
    echo '<div class="test-section">';
    echo '<h2>2️⃣ API-Endpoint Test</h2>';

    // Simuliere API-Request
    $api = new Jaeger_Product_Data_API();
    $request = new WP_REST_Request('GET', '/jaeger/v1/products');
    $request->set_param('include', $product_id);
    $request->set_param('fields', 'full');

    $response = $api->get_products_list($request);
    $data = $response->get_data();

    if (empty($data['products'])) {
        echo '<p class="error">❌ API liefert keine Produkte zurück!</p>';
    } else {
        $product_data = $data['products'][0];

        echo '<h3>✅ API Response erfolgreich</h3>';

        // Prüfe die 6 Felder
        $api_fields = array(
            'setangebot_titel' => 'Set-Angebot Titel',
            'setangebot_rabatt' => 'Zusatz-Rabatt',
            'daemmung_id' => 'Dämmung ID',
            'sockelleisten_id' => 'Sockelleisten ID',
            'daemmung_option_ids' => 'Dämmung Optionen (Array)',
            'sockelleisten_option_ids' => 'Sockelleisten Optionen (Array)',
        );

        echo '<table>';
        echo '<tr><th>Feld</th><th>Beschreibung</th><th>Wert in API</th><th>Status</th></tr>';

        $all_present = true;
        foreach ($api_fields as $key => $label) {
            $exists = array_key_exists($key, $product_data);
            $value = $exists ? $product_data[$key] : null;

            if (!$exists) {
                $all_present = false;
            }

            $status_class = $exists ? 'badge-success' : 'badge-error';
            $status_text = $exists ? '✅ Vorhanden' : '❌ FEHLT';

            // Formatiere Wert
            if (is_array($value)) {
                $display_value = 'Array [' . implode(', ', $value) . ']';
            } elseif (is_null($value)) {
                $display_value = '<em>null</em>';
            } else {
                $display_value = esc_html($value);
            }

            echo '<tr>';
            echo '<td><code>' . $key . '</code></td>';
            echo '<td>' . $label . '</td>';
            echo '<td>' . $display_value . '</td>';
            echo '<td><span class="badge ' . $status_class . '">' . $status_text . '</span></td>';
            echo '</tr>';
        }

        echo '</table>';

        if ($all_present) {
            echo '<div style="background: #d4edda; padding: 15px; border-radius: 4px; margin-top: 20px;">';
            echo '<h3 class="success">🎉 ERFOLG! Alle 6 Felder sind in der API vorhanden!</h3>';
            echo '<p>Der Fix ist erfolgreich. Das Frontend kann jetzt alle benötigten Daten abrufen.</p>';
            echo '</div>';
        } else {
            echo '<div style="background: #f8d7da; padding: 15px; border-radius: 4px; margin-top: 20px;">';
            echo '<h3 class="error">❌ FEHLER! Einige Felder fehlen noch!</h3>';
            echo '<p>Bitte prüfe die api-product-data.php Datei.</p>';
            echo '</div>';
        }
    }
    echo '</div>';

    // Test 3: Komplette API-Response
    echo '<div class="test-section">';
    echo '<h2>3️⃣ Komplette API-Response (JSON)</h2>';
    echo '<p>Vollständige Response für das Frontend:</p>';
    echo '<div class="code">';
    echo json_encode($product_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    echo '</div>';
    echo '</div>';

    // Test 4: Testaufrufe
    echo '<div class="test-section">';
    echo '<h2>4️⃣ Frontend Test-URLs</h2>';
    echo '<p>Das Frontend kann jetzt diese URLs verwenden:</p>';
    $base_url = get_rest_url(null, 'jaeger/v1');
    echo '<ul>';
    echo '<li><strong>Einzelprodukt:</strong> <code>' . $base_url . '/products/' . $product_id . '</code></li>';
    echo '<li><strong>Liste mit diesem Produkt:</strong> <code>' . $base_url . '/products?include=' . $product_id . '</code></li>';
    echo '<li><strong>Suche nach Slug:</strong> <code>' . $base_url . '/products?search=' . $product_slug . '</code></li>';
    echo '</ul>';
    echo '</div>';
    ?>

    <div class="test-section" style="background: #fff3cd; border: 2px solid #ffc107;">
        <h2>⚠️ WICHTIG: Script nach Test löschen!</h2>
        <p>Dieses Script enthält sensible Informationen und sollte nach dem Test gelöscht werden:</p>
        <p><code>rm test-api-felder.php</code></p>
    </div>

</body>
</html>
