/*****************************************************************************************************************
 *  website.js 
 *  https://fiessling.ch/iot1/06_sensor2website/website.js
 *  Daten als JSON-String vom Server holen (unload.php), sobald website.js dieses Script per HTTP aufruft (fetch())
******************************************************************************************************************/


async function fetchData() {
    try {
        // const response = await fetch('https://localhost/06_sensor2website/unload.php');
        // const response = await fetch('https://650665-4.web.fhgr.education/06_sensor2website/unload.php');
        const response = await fetch('https://iot-test.dynamicvisualscollective.ch/unload.php');
        const data = await response.json();   // wenn's nicht klappt, zeig den ganzen Text erst mit .text() an
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function main() {
    let data = await fetchData();
    console.log("Original data:", data);

    let zeit = data.data.zeit;
    let light = data.data.light;

    // Step 1: Group data by day and 15-minute intervals, initializing an object with days as keys and 96-interval arrays as values
    const dayData = {};

    zeit.forEach((timestamp, index) => {
        const dateObj = new Date(timestamp);
        const day = dateObj.toISOString().split("T")[0];  // YYYY-MM-DD format for each day
        const intervalOfDay = Math.floor((dateObj.getHours() * 60 + dateObj.getMinutes()) / 15);

        // Initialize the day entry if it doesn't exist with 96 intervals, all set to null
        if (!dayData[day]) {
            dayData[day] = Array(96).fill(null);
        }

        // Set the light status for the specific 15-minute interval if data is available
        dayData[day][intervalOfDay] = light[index];
    });

    // Log the structured dayData for troubleshooting
    console.log("Structured dayData:", dayData);

    // Step 2: Prepare the datasets for Chart.js with floating bars
    const days = Object.keys(dayData);
    const intervals = Array.from({ length: 96 }, (_, i) => i);  // Array of 15-minute intervals for the y-axis

    const datasets = intervals.map((interval) => ({
        label: `Interval ${interval}`,  // Label for each 15-minute interval
        data: days.map((day) => ({
            x: day,  // Use the day as x-axis label
            y: dayData[day][interval] === 1 ? [interval, interval + 1] : null // Bar from interval to interval+1 if light is on
        })).filter(data => data.y !== null),  // Exclude intervals where light is off or no data
        backgroundColor: 'rgba(255, 159, 64, 0.8)', // Color of bars
        borderWidth: 1
    }));

    // Log datasets to verify correct structure for Chart.js
    console.log("Datasets for Chart.js:", datasets);

    // Step 3: Configure and render the chart
    const config = {
        type: 'bar',
        data: {
            labels: days,  // Each day is a label on the x-axis
            datasets: datasets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false  // Hide the legend
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            // Access the raw y value directly from context.raw to avoid parsing issues
                            const interval = context.raw.y ? context.raw.y[0] : null;
                
                            if (interval !== null) {
                                const hours = Math.floor(interval / 4);
                                const minutes = (interval % 4) * 15;
                                const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
                
                                return `Time: ${formattedTime} - Light: On`;
                            } else {
                                return 'No data available';
                            }
                        }
                    }
                }
                
            },
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Days'
                    }
                },
                y: {
                    type: 'linear',
                    min: 0,
                    max: 96,  // Show 96 intervals (24 hours in 15-minute intervals) on the y-axis
                    title: {
                        display: true,
                        text: 'Hours'
                    },
                    ticks: {
                        stepSize: 4,  // Optional: Display intervals in increments (4 intervals = 1 hour)
                        callback: (value) => {
                            const hours = Math.floor(value / 4);
                            const minutes = (value % 4) * 15;
                            return `${hours}:${minutes.toString().padStart(2, '0')}`;
                        }
                    }
                }
            }
        }
    };
    

    // Render the chart
    const ctx = document.querySelector('#myChart').getContext('2d');
    new Chart(ctx, config);
}

main();


