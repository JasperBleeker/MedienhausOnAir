<?php
header('Content-Type: application/json');
require_once("server_config.php");

try {
    $zeit = [];
    $wert = [];
    $light = []; // Define the $light array
    $dailyLightTime = []; // Array to store daily light-on time

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
        
        // Calculate daily light-on time
        $date = date('Y-m-d', strtotime($row['zeit']));
        if (!isset($dailyLightTime[$date])) {
            $dailyLightTime[$date] = 0;
        }
        if ($row['light'] == 1) {
            // Just count the intervals, no multiplication here
            $dailyLightTime[$date] += 1;
        }
    }

    // Convert intervals to minutes (each interval is 15 minutes)
    foreach ($dailyLightTime as $date => $intervals) {
        $dailyLightTime[$date] = $intervals * 15;
    }

    // Debug log to see the values at each step
    error_log("Daily intervals before conversion: " . json_encode($dailyLightTime));
    error_log("Daily minutes after conversion: " . json_encode($dailyLightTime));

    // Prepare data for JSON response
    $data = [
        'zeit' => array_values($zeit),
        'light' => $light,
        'dailyLightTime' => $dailyLightTime
    ];

    $json = json_encode(['data' => $data], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    echo $json;

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
