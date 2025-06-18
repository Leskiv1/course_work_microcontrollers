import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Button } from 'react-native';
import {getCurrentTrips, getFinishedTrips} from "../api/api";
import DropDownMap from "../components/DropDownMap";
import CurrentRouteMap from "../components/CurrentTripsMap";

export default function CurrentTripPage() {
    const [trips, setTrips] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const qwe = JSON.parse(await getCurrentTrips());
            setTrips(qwe);
        };

        fetchData().then();

        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, []);

    let selectedTripData;

    trips?.forEach((trip) => {
        if (selectedId === trip.id) {
            selectedTripData = trip.details;
        }
    })

    const userId = trips?.map(trip => {
        if (trip.id === selectedId) {
            return trip?.user_id;
        }
    });
    return (
        <View style={styles.container}>
            <DropDownMap
                trips={trips}
                title="Select user"
                setSelectedId={(id) => setSelectedId(id)}
            />

            <View style={styles.info}>
                <Text style={styles.userText}>User: {userId}</Text>
                <Text style={styles.infoText}>Speed: {selectedTripData?.[selectedTripData.length - 1]?.speed
                } km/hr</Text>
                <Text style={styles.infoText}>Angle: {selectedTripData?.[selectedTripData.length - 1]?.tilt_angle}</Text>
            </View>

            <CurrentRouteMap
                trips={trips}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    infoText: {
        fontSize: 16,
        marginBottom: 16,
    },
    userText: {
        fontSize: 16,
        marginBottom: 16,
        fontWeight: 'bold',
    },
    info: {
        marginTop: 40,
        marginHorizontal: 20,
    }
});
