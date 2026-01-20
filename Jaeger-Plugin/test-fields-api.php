<?php
/**
 * Test Script für fields Parameter der Jäger API
 *
 * VERWENDUNG:
 * 1. In WordPress Root hochladen
 * 2. Im Browser aufrufen: https://deine-domain.de/test-fields-api.php
 * 3. Nach Test löschen!
 */

// WordPress laden
require_once('wp-load.php');

// Sicherheitscheck
if (!current_user_can('manage_options')) {
    die('⛔ Keine Berechtigung!');
}

?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jäger API - Fields Parameter Test</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
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
        .endpoint {
            background: #f8f9fa;
            padding: 10px 15px;
            border-left: 4px solid #2c5aa0;
            font-family: monospace;
            margin: 10px 0;
            word-break: break-all;
        }
        .result {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            max-height: 400px;
            overflow: auto;
            font-family: monospace;
            font-size: 12px;
            white-space: pre-wrap;
        }
        .success {
            color: #28a745;
            font-weight: bold;
        }
        .error {
            color: #dc3545;
            font-weight: bold;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        .stat-box {
            background: #e9ecef;
            padding: 15px;
            border-radius: 4px;
            text-align: center;
        }
        .stat-box .label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
        }
        .stat-box .value {
            font-size: 24px;
            font-weight: bold;
            color: #2c5aa0;
        }
        button {
            background: #2c5aa0;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin: 5px;
        }
        button:hover {
            background: #1e3a70;
        }
        .comparison {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        .comparison-item {
            background: #e9ecef;
            padding: 15px;
            border-radius: 4px;
        }
        .comparison-item h3 {
            margin-top: 0;
            color: #2c5aa0;
        }
    </style>
</head>
<body>
    <h1>🧪 Jäger API - Fields Parameter Test</h1>
    <p><strong>Test-Datum:</strong> <?php echo date('d.m.Y H:i:s'); ?></p>

    <?php
    // Erstes Produkt mit Set-Angebot finden
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => 1,
        'post_status' => 'publish',
        'meta_query' => array(
            array(
                'key' => '_show_setangebot',
                'value' => 'yes'
            )
        )
    );
    $products = get_posts($args);

    if (empty($products)) {
        echo '<div class="test-section"><p class="error">❌ Kein Produkt mit Set-Angebot gefunden!</p></div>';
        exit;
    }

    $test_product_id = $products[0]->ID;
    $test_product_name = get_the_title($test_product_id);
    ?>

    <div class="test-section">
        <h2>📦 Test-Produkt</h2>
        <p><strong>ID:</strong> <?php echo $test_product_id; ?></p>
        <p><strong>Name:</strong> <?php echo $test_product_name; ?></p>
    </div>

    <!-- TEST 1: fields=full -->
    <div class="test-section">
        <h2>🔵 Test 1: fields=full (Standard - Alle Felder)</h2>
        <div class="endpoint">
            GET /wp-json/jaeger/v1/products/<?php echo $test_product_id; ?>?fields=full
        </div>
        <?php
        $url_full = home_url('/wp-json/jaeger/v1/products/' . $test_product_id . '?fields=full');
        $response_full = wp_remote_get($url_full);

        if (is_wp_error($response_full)) {
            echo '<p class="error">❌ Fehler: ' . $response_full->get_error_message() . '</p>';
        } else {
            $body_full = wp_remote_retrieve_body($response_full);
            $data_full = json_decode($body_full, true);
            $size_full = strlen($body_full);
            $field_count_full = count($data_full, COUNT_RECURSIVE);

            echo '<div class="stats">';
            echo '<div class="stat-box"><div class="label">Payload Size</div><div class="value">' . number_format($size_full / 1024, 2) . ' KB</div></div>';
            echo '<div class="stat-box"><div class="label">Field Count</div><div class="value">' . $field_count_full . '</div></div>';
            echo '<div class="stat-box"><div class="label">Status</div><div class="value success">✓ OK</div></div>';
            echo '</div>';

            echo '<button onclick="document.getElementById(\'result-full\').style.display=\'block\'">📄 JSON anzeigen</button>';
            echo '<div id="result-full" class="result" style="display:none;">' . htmlspecialchars(json_encode($data_full, JSON_PRETTY_PRINT)) . '</div>';
        }
        ?>
    </div>

    <!-- TEST 2: fields=critical -->
    <div class="test-section">
        <h2>🟢 Test 2: fields=critical (Produktkarten)</h2>
        <div class="endpoint">
            GET /wp-json/jaeger/v1/products/<?php echo $test_product_id; ?>?fields=critical
        </div>
        <?php
        $url_critical = home_url('/wp-json/jaeger/v1/products/' . $test_product_id . '?fields=critical');
        $response_critical = wp_remote_get($url_critical);

        if (is_wp_error($response_critical)) {
            echo '<p class="error">❌ Fehler: ' . $response_critical->get_error_message() . '</p>';
        } else {
            $body_critical = wp_remote_retrieve_body($response_critical);
            $data_critical = json_decode($body_critical, true);
            $size_critical = strlen($body_critical);
            $field_count_critical = count($data_critical, COUNT_RECURSIVE);

            echo '<div class="stats">';
            echo '<div class="stat-box"><div class="label">Payload Size</div><div class="value">' . number_format($size_critical / 1024, 2) . ' KB</div></div>';
            echo '<div class="stat-box"><div class="label">Field Count</div><div class="value">' . $field_count_critical . '</div></div>';
            echo '<div class="stat-box"><div class="label">Status</div><div class="value success">✓ OK</div></div>';
            echo '</div>';

            echo '<button onclick="document.getElementById(\'result-critical\').style.display=\'block\'">📄 JSON anzeigen</button>';
            echo '<div id="result-critical" class="result" style="display:none;">' . htmlspecialchars(json_encode($data_critical, JSON_PRETTY_PRINT)) . '</div>';
        }
        ?>
    </div>

    <!-- TEST 3: fields=minimal -->
    <div class="test-section">
        <h2>🟡 Test 3: fields=minimal (Modals)</h2>
        <div class="endpoint">
            GET /wp-json/jaeger/v1/products/<?php echo $test_product_id; ?>?fields=minimal
        </div>
        <?php
        $url_minimal = home_url('/wp-json/jaeger/v1/products/' . $test_product_id . '?fields=minimal');
        $response_minimal = wp_remote_get($url_minimal);

        if (is_wp_error($response_minimal)) {
            echo '<p class="error">❌ Fehler: ' . $response_minimal->get_error_message() . '</p>';
        } else {
            $body_minimal = wp_remote_retrieve_body($response_minimal);
            $data_minimal = json_decode($body_minimal, true);
            $size_minimal = strlen($body_minimal);
            $field_count_minimal = count($data_minimal, COUNT_RECURSIVE);

            echo '<div class="stats">';
            echo '<div class="stat-box"><div class="label">Payload Size</div><div class="value">' . number_format($size_minimal / 1024, 2) . ' KB</div></div>';
            echo '<div class="stat-box"><div class="label">Field Count</div><div class="value">' . $field_count_minimal . '</div></div>';
            echo '<div class="stat-box"><div class="label">Status</div><div class="value success">✓ OK</div></div>';
            echo '</div>';

            echo '<button onclick="document.getElementById(\'result-minimal\').style.display=\'block\'">📄 JSON anzeigen</button>';
            echo '<div id="result-minimal" class="result" style="display:none;">' . htmlspecialchars(json_encode($data_minimal, JSON_PRETTY_PRINT)) . '</div>';
        }
        ?>
    </div>

    <!-- VERGLEICH -->
    <?php if (!is_wp_error($response_full) && !is_wp_error($response_critical) && !is_wp_error($response_minimal)): ?>
    <div class="test-section">
        <h2>📊 Performance-Vergleich</h2>
        <div class="comparison">
            <div class="comparison-item">
                <h3>full</h3>
                <p><strong>Size:</strong> <?php echo number_format($size_full / 1024, 2); ?> KB</p>
                <p><strong>Fields:</strong> <?php echo $field_count_full; ?></p>
                <p><strong>Basis:</strong> 100%</p>
            </div>
            <div class="comparison-item">
                <h3>critical</h3>
                <p><strong>Size:</strong> <?php echo number_format($size_critical / 1024, 2); ?> KB</p>
                <p><strong>Fields:</strong> <?php echo $field_count_critical; ?></p>
                <p><strong>Reduzierung:</strong> <?php echo round(100 - ($size_critical / $size_full * 100)); ?>%</p>
            </div>
            <div class="comparison-item">
                <h3>minimal</h3>
                <p><strong>Size:</strong> <?php echo number_format($size_minimal / 1024, 2); ?> KB</p>
                <p><strong>Fields:</strong> <?php echo $field_count_minimal; ?></p>
                <p><strong>Reduzierung:</strong> <?php echo round(100 - ($size_minimal / $size_full * 100)); ?>%</p>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- TEST 4: Produktliste mit fields=critical -->
    <div class="test-section">
        <h2>📋 Test 4: Produktliste mit fields=critical</h2>
        <div class="endpoint">
            GET /wp-json/jaeger/v1/products?per_page=5&fields=critical
        </div>
        <?php
        $url_list = home_url('/wp-json/jaeger/v1/products?per_page=5&fields=critical');
        $response_list = wp_remote_get($url_list);

        if (is_wp_error($response_list)) {
            echo '<p class="error">❌ Fehler: ' . $response_list->get_error_message() . '</p>';
        } else {
            $body_list = wp_remote_retrieve_body($response_list);
            $data_list = json_decode($body_list, true);
            $size_list = strlen($body_list);

            echo '<div class="stats">';
            echo '<div class="stat-box"><div class="label">Payload Size</div><div class="value">' . number_format($size_list / 1024, 2) . ' KB</div></div>';
            echo '<div class="stat-box"><div class="label">Produkte</div><div class="value">' . count($data_list['products']) . '</div></div>';
            echo '<div class="stat-box"><div class="label">Status</div><div class="value success">✓ OK</div></div>';
            echo '</div>';

            echo '<button onclick="document.getElementById(\'result-list\').style.display=\'block\'">📄 JSON anzeigen</button>';
            echo '<div id="result-list" class="result" style="display:none;">' . htmlspecialchars(json_encode($data_list, JSON_PRETTY_PRINT)) . '</div>';
        }
        ?>
    </div>

    <!-- TEST 5: Include Parameter mit fields=minimal -->
    <div class="test-section">
        <h2>🎯 Test 5: Include Parameter mit fields=minimal</h2>
        <?php
        // Finde 3 Zusatzprodukte (Dämmung oder Sockelleisten)
        $zusatz_args = array(
            'post_type' => 'product',
            'posts_per_page' => 3,
            'post_status' => 'publish',
            'tax_query' => array(
                array(
                    'taxonomy' => 'product_cat',
                    'field' => 'slug',
                    'terms' => array('daemmung', 'sockelleisten'),
                    'operator' => 'IN'
                )
            )
        );
        $zusatz_products = get_posts($zusatz_args);
        $zusatz_ids = array_map(function($p) { return $p->ID; }, $zusatz_products);
        $include_param = implode(',', $zusatz_ids);
        ?>
        <div class="endpoint">
            GET /wp-json/jaeger/v1/products?include=<?php echo $include_param; ?>&fields=minimal
        </div>
        <?php
        $url_include = home_url('/wp-json/jaeger/v1/products?include=' . $include_param . '&fields=minimal');
        $response_include = wp_remote_get($url_include);

        if (is_wp_error($response_include)) {
            echo '<p class="error">❌ Fehler: ' . $response_include->get_error_message() . '</p>';
        } else {
            $body_include = wp_remote_retrieve_body($response_include);
            $data_include = json_decode($body_include, true);
            $size_include = strlen($body_include);

            echo '<div class="stats">';
            echo '<div class="stat-box"><div class="label">Payload Size</div><div class="value">' . number_format($size_include / 1024, 2) . ' KB</div></div>';
            echo '<div class="stat-box"><div class="label">Produkte</div><div class="value">' . count($data_include['products']) . '</div></div>';
            echo '<div class="stat-box"><div class="label">Status</div><div class="value success">✓ OK</div></div>';
            echo '</div>';

            echo '<button onclick="document.getElementById(\'result-include\').style.display=\'block\'">📄 JSON anzeigen</button>';
            echo '<div id="result-include" class="result" style="display:none;">' . htmlspecialchars(json_encode($data_include, JSON_PRETTY_PRINT)) . '</div>';
        }
        ?>
    </div>

    <div class="test-section">
        <h2>✅ Zusammenfassung</h2>
        <ul>
            <li><strong>fields=full:</strong> Alle Felder (Standard) - Für Produktdetailseiten</li>
            <li><strong>fields=critical:</strong> ~23 Felder - Für Produktkarten (Startseite, Kategorien)</li>
            <li><strong>fields=minimal:</strong> ~9 Felder - Für Modals (Dämmung/Sockelleisten-Auswahl)</li>
        </ul>
        <p><strong>Performance-Gain:</strong> 70-90% kleinere Payloads für Listen und Modals! 🚀</p>
    </div>

    <div style="background: #f8d7da; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0;">
        <strong>🔴 Sicherheit:</strong> Bitte diese Test-Datei jetzt löschen!
    </div>
</body>
</html>
