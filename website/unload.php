<?php
header('Content-Type: application/json');
require_once("server_config.php");

try {
    $zeit = [];
    $wert = [];
    $light = []; // Define the $light array

    $pdo = new PDO($dsn, $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // SQL query to get data from the last 7 days
    $sql = "SELECT * FROM sensordata WHERE zeit >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $wert[] = $row['wert'];
        $zeit[] = $row['zeit'];
        $light[] = $row['light']; // Assume 'light' is already boolean in the database
    }

    // Prepare data for JSON response
    $data = [
        'zeit' => array_values($zeit),
        'light' => $light // Directly use the values from the database
    ];

    $json = json_encode(['data' => $data], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    echo $json;

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
