<?php
/********************************************************
 * load.php
 
 * Daten als JSON-String vom MC empfangen und Daten in die Datenbank einfügen
 ************************************************************************/ 

require_once("server_config.php");

echo "This script receives HTTP POST messages and pushes their content into the database.";

###################################### connect to db

try{
    $pdo = new PDO($dsn, $db_user, $db_pass, $options); 
    echo "</br> DB Verbindung ist erfolgreich";
}
catch(PDOException $e){
    error_log("DB Error: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
}


###################################### Empfangen der JSON-Daten

$inputJSON = file_get_contents('php://input'); // JSON-Daten aus dem Body der Anfrage
$input = json_decode($inputJSON, true); // Dekodieren der JSON-Daten in ein Array


###################################### Prüfen, ob die JSON-Daten erfolgreich dekodiert wurden

if (json_last_error() === JSON_ERROR_NONE && !empty($input)) {
    $wert = $input["wert"];  // Wert value
    $light = $input["light"];  // Light value

    // Insert multiple values into the database
    $sql = "INSERT INTO sensordata (wert, light) VALUES (?, ?)";
    $stmt = $pdo->prepare($sql);
    
    // Execute statement with both values
    $stmt->execute([$wert, $light]);

    echo "</br> Data inserted successfully";
} else {
    echo json_encode(["status" => "error", "message" => "Invalid JSON data"]);
}
?>
