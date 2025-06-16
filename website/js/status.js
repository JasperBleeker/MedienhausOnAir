// Function to fetch the latest light value and update the "ON AIR" sign
console.log("helloworld")
async function updateOnAirSign() {
    try {
        // Fetch data from the PHP endpoint
        const response = await fetch('https://iot-test.dynamicvisualscollective.ch/status_load.php');
        const data = await response.json();

        // Access the latest light value
        const lightValue = data.data.light;
        const lastTimestamp = new Date(data.data.zeit);
        const currentTime = new Date();

        // Get the ON AIR sign element
        const onAirSign = document.getElementById('status');
        const sensorConnection = document.getElementById('sensorConnection');

        // Update the sign color based on the light value
        if (lightValue === 1) {
            onAirSign.style.color = 'red'; // Turn ON AIR sign red
            onAirSign.innerHTML = "ON AIR"; // Update the text to "ON AIR
            console.log("ON AIR!"); // Log the status for debugging
        } else {
            onAirSign.style.color = 'black'; // Default or "off" state
            onAirSign.innerHTML = "OFF AIR"; // Update the text to "OFF AIR"
            console.log("OFF AIR!"); // Log the status for
        }

        // Update the sensor connection status based on the last timestamp
        const timeDiff = (currentTime - lastTimestamp) / 1000 / 60; // Calculate the time difference in minutes
        if (timeDiff < 5) {
            sensorConnection.innerHTML = "Sensor connected"; // Update the text to "Sensor connected"
            sensorConnection.style.color = 'green'; // Turn the text color green

        } else {
            sensorConnection.innerHTML = "Sensor disconnected"; // Update the text to "Sensor disconnected"
            sensorConnection.style.color = 'red'; // Turn the text color red
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById('sensorConnection').textContent = "Error fetching data"; // Update the sensor connection status in case of an error
    }
}

// Call the function periodically to update the status
updateOnAirSign(); // Initial call
setInterval(updateOnAirSign, 60000); // Update every Minute
