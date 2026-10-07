const API_URL = "https://3i1coc4qp5.execute-api.us-east-1.amazonaws.com/prod/queue";
const WEATHER_API_KEY = "bfb5bca30beb40eca8b7a66514d1f595";

async function getQueue() {
    let canteen = document.getElementById("canteen").value;

    try {
        let response = await fetch(API_URL + "?canteenId=" + canteen);
        let data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to get queue data");
        }

        let queue = Number(data.people);
        let waiting = Number(data.waitingTime);
        let crowd = data.crowdLevel;

        let prediction;

if (queue <= 10) {
    prediction = "LOW";
}
else if (queue <= 25) {
    prediction = "MEDIUM";
}
else if (queue <= 50) {
    prediction = "HIGH";
}
else {
    prediction = "VERY HIGH";
}

let hour = new Date().getHours();

if ((hour >= 12 && hour < 14) || (hour >= 19 && hour < 21)) {
    if (prediction === "LOW") {
        prediction = "MEDIUM";
    }
    else if (prediction === "MEDIUM") {
        prediction = "HIGH";
    }
    else if (prediction === "HIGH") {
        prediction = "VERY HIGH";
    }
}

        document.getElementById("queue").innerHTML = queue;
        document.getElementById("waiting").innerHTML = waiting;
        document.getElementById("crowd").innerHTML = crowd;
        document.getElementById("prediction").innerHTML = prediction;

    } catch (error) {
        console.error("Queue error:", error);
    }
}

async function getWeather() {
    try {
        let response = await fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=Chennai&appid=" +
            WEATHER_API_KEY +
            "&units=metric"
        );

        let data = await response.json();

        console.log("Weather API response:", data);

        if (!response.ok) {
            throw new Error(data.message || "Weather API error");
        }

        document.getElementById("weather").innerHTML =
            data.weather[0].main;

        document.getElementById("temperature").innerHTML =
            data.main.temp + "°C";

    } catch (error) {
        console.error("Weather error:", error);

        document.getElementById("weather").innerHTML =
            "Weather unavailable";

        document.getElementById("temperature").innerHTML =
            "--";
    }
}
async function updateQueue() {
    let canteen = document.getElementById("staffCanteen").value;
    let people = document.getElementById("people").value;
    let counters = document.getElementById("counters").value;

    if (people === "" || counters === "") {
        document.getElementById("staffMessage").innerHTML =
            "Please enter all values.";
        return;
    }

    if (people < 0 || counters <= 0) {
        document.getElementById("staffMessage").innerHTML =
            "Invalid values.";
        return;
    }

    try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                canteenId: canteen,
                people: Number(people),
                counters: Number(counters)
            })
        });

        let data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to update queue");
        }

        document.getElementById("staffMessage").innerHTML =
            "Queue updated successfully.";

    } catch (error) {
        document.getElementById("staffMessage").innerHTML =
            "Failed to update queue.";

        console.error("Update error:", error);
    }
}

getWeather();
getQueue();

setInterval(getQueue, 5000);
setInterval(getWeather, 600000);