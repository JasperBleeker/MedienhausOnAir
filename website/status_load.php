<?php

require_once("server_config.php");

try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query to get the last recorded light value based on the 'zeit' column
    $sql = "SELECT zeit, light FROM sensordata ORDER BY zeit DESC LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Fetch the last row
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    // Prepare data for JSON output
    $data = [
        'zeit' => $row['zeit'],
        'light' => $row['light']
    ];

    // Encode the result as JSON
    header('Content-Type: application/json');
    echo json_encode(['data' => $data], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

?>
