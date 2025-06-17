async function fetchUsageData() {
    try {
        const response = await fetch('https://iot-test.dynamicvisualscollective.ch/unload.php');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

function calculateMetrics(dailyLightTime) {
    const dates = Object.keys(dailyLightTime).sort();
    const today = new Date().toISOString().split('T')[0];
    
    console.log('Raw daily light time data:', dailyLightTime);
    console.log('Sample calculation for first date:', {
        date: dates[0],
        rawValue: dailyLightTime[dates[0]],
        inHours: dailyLightTime[dates[0]] / 60
    });
    
    // Calculate 24h total (today's usage)
    const last24h = dailyLightTime[today] || 0;
    
    // Calculate 7d total
    const last7d = dates.reduce((sum, date) => sum + dailyLightTime[date], 0);
    
    // Calculate daily average
    const dailyAverage = last7d / dates.length;
    
    console.log('Intermediate calculations:', {
        last24hMinutes: last24h,
        last7dMinutes: last7d,
        dailyAverageMinutes: dailyAverage,
        last24hHours: last24h / 60,
        last7dHours: last7d / 60,
        dailyAverageHours: dailyAverage / 60
    });
    
    // Convert minutes to hours and round to 2 decimal places
    return {
        last24h: (last24h / 3600).toFixed(2), // Convert minutes to hours
        last7d: (last7d / 3600).toFixed(2),   // Convert minutes to hours
        dailyAverage: (dailyAverage / 3600).toFixed(2) // Convert minutes to hours
    };
}

function updateMetricsDisplay(metrics) {
    const metricsContainer = document.getElementById('usageMetrics');
    metricsContainer.innerHTML = `
        <div class="metric">
            <h3>24h Total</h3>
            <p>${metrics.last24h} hours</p>
        </div>
        <div class="metric">
            <h3>7d Total</h3>
            <p>${metrics.last7d} hours</p>
        </div>
        <div class="metric">
            <h3>Daily Average</h3>
            <p>${metrics.dailyAverage} hours</p>
        </div>
    `;
}

async function createUsageChart() {
    const data = await fetchUsageData();
    console.log("Raw API response:", data);

    // Get the daily light time data
    const dailyLightTime = data.data.dailyLightTime;
    
    // Calculate and display metrics
    const metrics = calculateMetrics(dailyLightTime);
    console.log('Final metrics:', metrics);
    updateMetricsDisplay(metrics);
    
    // Sort dates and prepare data for the chart
    const dates = Object.keys(dailyLightTime).sort();
    // Convert minutes to hours for the chart using the same conversion factor
    const lightTimeHours = dates.map(date => (dailyLightTime[date] / 3600).toFixed(2));
    
    console.log('Chart data:', {
        dates: dates,
        lightTimeHours: lightTimeHours
    });

    // Create the chart
    const ctx = document.querySelector('#usageChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Light On Time (hours)',
                data: lightTimeHours,
                borderColor: '#FF5D48',
                backgroundColor: 'rgba(255, 93, 72, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Daily Light Usage'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Hours: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Hours'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}

// Initialize the chart when the page loads
document.addEventListener('DOMContentLoaded', createUsageChart); 

console.log("usage.js loaded");