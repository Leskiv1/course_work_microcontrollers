import DetailService from "./src/services/detail.service.js";
import TripService from "./src/services/trip.service.js";

const id = 'test'

const startTrip = async () => {
    const response = await fetch(`https://pjuwztvjs5.execute-api.eu-north-1.amazonaws.com/default/api/trip/start/${id}`, {
        method: "POST",
    });
    return response.json();
}

const addDetail = async (data) => {
    const response = await fetch("https://pjuwztvjs5.execute-api.eu-north-1.amazonaws.com/default/api/detail/" + id, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    });
    console.log(response);
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function callFunctionWithDelay() {
    const details = (await DetailService.getTripDetailsById(19)).map((data) => {
        return {
            location: {
                latitude: data.latitude,
                longitude: data.longitude,
            },
            speed: {
                kmph: data.speed,
            },
            tilt_angle: data.tilt_angle,
            battery_percent: data.battery_percent,
        }
    });
    console.log(details);
    for (let i = 0; i < details.length; i++) {
        await addDetail(details[i]);
        await delay(5000);
    }
}

const stopTrip = async () => {
    const response = await fetch("https://pjuwztvjs5.execute-api.eu-north-1.amazonaws.com/default/api/trip/stop/" + id, {
        method: "PUT",
    })
    return response.json();
}

// startTrip().then(result => console.log(result));
// callFunctionWithDelay().then();
stopTrip().then(stopTrip => console.log(stopTrip));

// TripService.getCurrentTrips().then(dat => {console.log(JSON.stringify(dat, null, 2))})
