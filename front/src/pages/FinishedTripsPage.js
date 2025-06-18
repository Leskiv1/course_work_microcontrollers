import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import {getFinishedTripsDetailsById, getFinishedTrips} from "../api/api";
import DropDownMap from "../components/DropDownMap";
import TripRouteMap from "../components/TripMap";
import Statistic from "../components/Statistic";

export default function FinishedTripsPage() {
    const [trips, setTrips] = useState([]);
    const [chosenTripId, setChosenTripId] = useState(null);
    const [tripsDetails, setTripsDetails] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getFinishedTrips();
            setTrips(data);
        };
        fetchData().then();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const data = await getFinishedTripsDetailsById(chosenTripId);
            setTripsDetails(data);
        };
        fetchData().then();
    }, [chosenTripId])

    return (
        <View style={styles.container}>
            <DropDownMap
                title="Select trip"
                trips={trips}
                setSelectedId={(id) => setChosenTripId(id)}
            />
            <Statistic
                tripId={chosenTripId}
                user={trips.map((trip) => {
                    if (trip.id === chosenTripId) {
                        return trip.user_id;
                    }
                })}
            />
            <TripRouteMap
                tripData={tripsDetails}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
