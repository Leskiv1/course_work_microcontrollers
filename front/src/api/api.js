const url = "https://pjuwztvjs5.execute-api.eu-north-1.amazonaws.com/default/api";

export const getFinishedTripsDetailsById = async (id) => {
    try {
        const response = await fetch(`${url}/detail/finished/${id}`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export const getFinishedTrips = async () => {
    try {
        const response = await fetch(`${url}/trip/finished`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export const getStatistic = async (id) => {
    try {
        const response = await fetch(`${url}/trip/statistic/${id}`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export const getCurrentTrips = async () => {
    try {
        const response = await fetch(`${url}/trip/current`, {
            method: "GET",
        });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}