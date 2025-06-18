import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

const TripRouteMap = ({ tripData }) => {
    const [colorMode, setColorMode] = useState('speed');

    const getPolylineColor = (point) => {
        if (colorMode === 'speed') {
            return point.speed < 6 ? 'rgb(255,15,15)' : 'rgb(184,14,14)';
        } else {
            if (point.tilt_angle < -20) {
                return 'rgb(0,211,0)';
            } else if(point.tilt_angle > 20) {
                return 'rgb(4,67,4)';
            } else {
                return 'rgb(0,138,0)';
            }
        }
    };

    const renderColoredLines = () => {
        const lines = [];

        for (let i = 0; i < tripData.length - 1; i++) {
            const start = tripData[i];
            const end = tripData[i + 1];

            lines.push(
                <Polyline
                    key={i}
                    coordinates={[
                        { latitude: start.latitude, longitude: start.longitude },
                        { latitude: end.latitude, longitude: end.longitude },
                    ]}
                    strokeColor={getPolylineColor(start)}
                    strokeWidth={5}
                />
            );
        }
        return lines;
    };

    const initialRegion = tripData.length > 2
        ? {
            latitude: tripData[0].latitude,
            longitude: tripData[0].longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }
        : {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 1,
            longitudeDelta: 1,
        };

    return (
        <View style={styles.map}>
            {(
                <MapView style={StyleSheet.absoluteFillObject} region={initialRegion}>
                    {tripData.length > 2 && renderColoredLines()}
                </MapView>

            )}

            <View style={styles.selectorWrapper}>
                {/*<Text style={styles.selectorLabel}>:</Text>*/}
                {/*<ScrollView horizontal showsHorizontalScrollIndicator={false}>*/}
                    <TouchableOpacity
                        onPress={() => setColorMode('speed')}
                        style={[styles.selectorButton, colorMode === 'speed' && styles.active]}
                    >
                        <Text style={styles.selectorText}>Speed</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setColorMode('angle')}
                        style={[styles.selectorButton, colorMode === 'angle' && styles.active]}
                    >
                        <Text style={styles.selectorText}>Angle</Text>
                    </TouchableOpacity>
                {/*</ScrollView>*/}
            </View>
        </View>
    );
};

export default TripRouteMap;

const styles = StyleSheet.create({
    map: {
        height: "60%",
    },
    selectorWrapper: {
        position: 'absolute',
        bottom: 5,
        left: '50%',
        transform: [
            { translateX: "-50%" },
        ],
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectorLabel: {
        marginRight: 10,
        fontWeight: 'bold',
    },
    selectorButton: {
        marginRight: 10,
        backgroundColor: '#ddd',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    selectorText: {
        fontSize: 14,
    },
    active: {
        backgroundColor: '#007BFF',
    },
});
