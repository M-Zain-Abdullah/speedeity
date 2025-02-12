const ESP32_IP = "http://192.168.0.100"; // Replace with your ESP32's actual IP

// Function to fetch speed data from ESP32
async function fetchSpeedData() {
    try {
        let response = await fetch(`${ESP32_IP}/speed`, { method: "GET" });

        if (!response.ok) {
            throw new Error("ESP32 Not Responding");
        }

        let data = await response.json();
        
        // Update speed and status display
        document.getElementById("speedDisplay").innerText = `Speed: ${data.speed} km/h`;
        document.getElementById("status").innerText = "Connected to ESP32";
        document.getElementById("status").style.color = "green";

        // Check for overspeeding
        const speedLimit = 60; // Adjust as needed
        if (data.speed > speedLimit) {
            document.getElementById("overspeedAlert").innerText = "⚠️ Overspeeding!";
            document.getElementById("overspeedAlert").style.color = "red";
        } else {
            document.getElementById("overspeedAlert").innerText = "";
        }

        // Store data for export
        logSpeedData(data.speed);
    } catch (error) {
        console.error("Error fetching speed data:", error);
        document.getElementById("status").innerText = "ESP32 Not Connected!";
        document.getElementById("status").style.color = "red";
    }
}

// Function to log speed data for export
let speedLogs = [];
function logSpeedData(speed) {
    let timestamp = new Date().toLocaleString();
    speedLogs.push({ time: timestamp, speed: speed });
}

// Function to export speed data as CSV
function exportCSV() {
    if (speedLogs.length === 0) {
        alert("No data to export!");
        return;
    }

    let csvContent = "Time,Speed (km/h)\n";
    speedLogs.forEach(row => {
        csvContent += `${row.time},${row.speed}\n`;
    });

    let blob = new Blob([csvContent], { type: "text/csv" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "speed_logs.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Fetch speed data every 2 seconds
setInterval(fetchSpeedData, 2000);

// Attach export function to button
document.getElementById("exportBtn").addEventListener("click", exportCSV);
