/******************************************************************************************
 * mc.ino
 * Install library "Arduino_JSON" by Arduino
 * Sensordaten sammeln und per HTTP POST Request an Server schicken (-> load.php).
 * load.php schreibt die Werte dann in die Datenbank
 * Beachte: Passe den Pfad zur load.php in const char* serverURL auf deinen eigenen an.
 ******************************************************************************************/



#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h> // by Arduino
#include <WebServer.h>  // WebServer to listen for HTTP requests
#include <LiquidCrystal.h> // Display to show ip for config

unsigned long lastTime = 0;
unsigned long timerDelay = 60000; // default to 60s interval

const char* ssid     = "Igloo";
const char* pass     = "1glooVision";

const char* serverURL = "https://iot-test.dynamicvisualscollective.ch/load.php"; 

// variables for Lightsensor
const int sensorPin = 0;
int wert = 1000;
int lightThreshold = 0; // Threshold for calibration
int buffer = 100; // buffer value to avoid fluctuations

// variables for display
const int rs = 2,
          en = 3,
          d4 = 6,
          d5 = 7,
          d6 = 8,
          d7 = 9;

LiquidCrystal lcd(rs, en, d4, d5, d6, d7);


// HTTP Server for calibration command
WebServer server(80);

void setup() {
  Serial.begin(115200);

  //lcd setup:
  lcd.begin(16, 2);
  lcd.setCursor(0, 0);
  lcd.print("Connecting...");

  // Sensor setup:
  pinMode(sensorPin, INPUT);  // initialize the lightsensor pin as an input:

  // Verbindung mit Wi-Fi herstellen

  WiFi.begin(ssid, pass);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // Once connected, print connection details
  String ipAddress = WiFi.localIP().toString();
  Serial.printf("\nWiFi connected: SSID: %s, IP Address: %s\n", ssid, ipAddress.c_str());

  // Display IP address on LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("IP Address:");
  lcd.setCursor(0, 1);
  lcd.print(ipAddress); // Shows IP address on the second line

  // Define server routes
  server.on("/", HTTP_GET, handleRoot);
  server.on("/calibrate", HTTP_GET, handleCalibration); //Route for setting change value of Sensor
  server.on("/setInterval", HTTP_GET, handleSetInterval); //Route for setting Interval
  server.begin();
  Serial.print("HTTP server started. Access the configuration page at http://" + ipAddress);
}

void loop() {

  server.handleClient(); // Listen for incomming HTTP requests
  
 // Sensor read and send data every `timerDelay` milliseconds
  if ((millis() - lastTime) > timerDelay) {   
    lastTime = millis();

    wert = analogRead(sensorPin);
    Serial.println(wert);

    // Compare with threshold
    if (wert <= (lightThreshold + buffer)) {
      Serial.println("Light = true (bright)");
    } else {
      Serial.println("Light = false (dark)");
    }

    
    // JSON zusammenbauen

    JSONVar dataObject;
    dataObject["wert"] = wert;
    dataObject["light"] = wert <= (lightThreshold + buffer) ? true : false; // send light status
    String jsonString = JSON.stringify(dataObject);
    
  
    //JSON string per HTTP POST request an den Server schicken (server2db.php)

    if (WiFi.status() == WL_CONNECTED) {   // Überprüfen, ob Wi-Fi verbunden ist
      // HTTP Verbindung starten und POST-Anfrage senden
      HTTPClient http;
      http.begin(serverURL);
      http.addHeader("Content-Type", "application/json");
      int httpResponseCode = http.POST(jsonString);

      // Prüfen der Antwort
      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.printf("HTTP Response code: %d\n", httpResponseCode);
        Serial.println("Response: " + response);
      } else {
        Serial.printf("Error on sending POST: %d\n", httpResponseCode);
      }

      http.end();
    } else {
      Serial.println("WiFi Disconnected");
    }
  }
}

// Serve the HTML page for configuration
void handleRoot() {
  String htmlPage = "<html>"
    "<head>"
        "<title>Arduino Configuration</title>"
        "<style>"
            "body { font-family: Arial, sans-serif; background-color: #f4f4f9; color: #333; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }"
            "h2 { color: #333; }"
            "div { width: 70vw; max-width: 400px; text-align: center; padding: 20px; background: #fff; box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1); border-radius: 8px; }"
            "@media screen and (max-width: 1000px) { div { max-width: none; } }"
            "button { margin-top: 10px; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; border: none; border-radius: 5px; cursor: pointer; }"
            "button:hover { background-color: #0056b3; }"
            "input { margin-top: 10px; padding: 8px; width: 80%; max-width: 300px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 5px; }"
        "</style>"
    "</head>"
    "<body>"
        "<div>"
            "<h2>Sensor Calibration</h2>"
            "<button onclick=\"fetch('/calibrate').then(response => response.text()).then(data => alert(data)).catch(err => alert('Calibration Failed'))\">Calibrate Light Sensor</button>"
            "<h2>Set Sensor Interval (ms)</h2>"
            "<input type='number' id='interval' placeholder='Enter interval in ms'>"
            "<button onclick=\"setInterval()\">Set Interval</button>"
        "</div>"
        "<script>"
            "function setInterval() {"
            "  const interval = document.getElementById('interval').value;"
            "  fetch('/setInterval?value=' + interval)"
            "    .then(response => response.text())"
            "    .then(data => alert(data))"
            "    .catch(err => alert('Failed to set interval'));"
            "}"
        "</script>"
    "</body>"
"</html>";

  server.send(200, "text/html", htmlPage);
}


// Handle the calibration command
void handleCalibration() {
  lightThreshold = analogRead(sensorPin); // Set threshold to current light value
  Serial.printf("Calibration complete. New threshold: %d\n", lightThreshold);
  
  // Add CORS headers to allow requests from any origin
  server.sendHeader("Access-Control-Allow-Origin", "*");  // Allow all origins
  server.sendHeader("Access-Control-Allow-Methods", "GET"); // Allow GET requests
  
  // Send the response
  server.send(200, "text/plain", "Calibration successful. Threshold set to " + String(lightThreshold));
}

// Handle the interval setting
void handleSetInterval() {
  if (server.hasArg("value")) {
    timerDelay = server.arg("value").toInt();
    Serial.printf("Interval set to: %d ms\n", timerDelay);
    server.send(200, "text/plain", "Interval set to " + String(timerDelay) +" ms");
  } else {
    server.send(400, "text/plain", "Invalid interval value");
  }
}


