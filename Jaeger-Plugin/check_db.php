<?php
// Database credentials
$db_name = 'dbs13171146';
$db_user = 'dbs13171146';
$db_password = 'Jaeger1965!';
$db_host = 'db5016626513.hosting-data.io';

// Connect
$conn = new mysqli($db_host, $db_user, $db_password, $db_name);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

// Check product meta for ID 10485
$product_id = 10485;
$query = "SELECT meta_key, meta_value FROM wp_postmeta
          WHERE post_id = $product_id
          AND meta_key IN ('_setangebot_einzelpreis', '_setangebot_gesamtpreis', '_setangebot_ersparnis_euro', '_setangebot_ersparnis_prozent')
          ORDER BY meta_key";

$result = $conn->query($query);

echo "Setangebot Meta-Felder für Produkt ID $product_id:\n";
echo str_repeat('=', 60) . "\n";

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        printf("%-35s: %s\n", $row['meta_key'], $row['meta_value']);
    }
} else {
    echo "Keine Setangebot-Felder gefunden!\n";
}

$conn->close();
