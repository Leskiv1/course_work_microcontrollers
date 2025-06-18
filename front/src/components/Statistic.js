import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {getStatistic} from "../api/api";
import {formatDate} from "../utils/utils";

const Statistic = ({tripId, user = ""}) => {
    const [statistic, setStatistic] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await getStatistic(tripId);
            setStatistic(data);
        }

        fetchData().then();
    }, [tripId]);

    return (
        <View style={styles.statistic}>
            <View style={styles.userInfo}>
                <Text style={styles.userText}>User: {user}</Text>
                <Text style={styles.userText}>Date: {formatDate(statistic?.start_date)}</Text>
            </View>
            <View style={styles.tripInfo}>
                <View style={styles.leftColumn}>
                    <Text style={styles.tripText}>Average speed: {statistic?.avg_speed?.toFixed(2)} km/hr</Text>
                    <Text style={styles.tripText}>Distance: {statistic?.distance_km?.toFixed(2)} km</Text>
                    <Text style={styles.tripText}>Duration: {(statistic?.duration_hr * 60)?.toFixed(2)} min</Text>
                </View>
                <View style={styles.rightColumn}>
                    <Text style={styles.tripText}>Going up to hill: {statistic?.percentage_up?.toFixed(2)}%</Text>
                    <Text style={styles.tripText}>Going down to hill: {statistic?.percentage_down?.toFixed(2)}%</Text>
                </View>
            </View>

        </View>
    )
}

export default Statistic;

const styles = StyleSheet.create({
    statistic: {
        flex: 1,
        marginTop: 100,
        marginHorizontal: 20,
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    userText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    tripInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftColumn: {},
    rightColumn: {},
    tripText: {
        marginBottom: 15,
    }
})