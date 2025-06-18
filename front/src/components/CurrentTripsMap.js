import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker, Callout } from 'react-native-maps';

const CurrentRouteMap = ({ trips }) => {
    const [colorMode, setColorMode] = useState('speed');

    const getPolylineColor = (point) => {
        if (colorMode === 'speed') {
            return point.speed < 6 ? 'rgb(255,15,15)' : 'rgb(184,14,14)';
        } else {
            if (point.tilt_angle < -20) return 'rgb(0,211,0)';
            else if (point.tilt_angle > 20) return 'rgb(4,67,4)';
            else return 'rgb(0,138,0)';
        }
    };

    const initialRegion = trips?.[0]?.details?.[-1]
        ? {
            latitude: trips[0].details[-1].latitude,
            longitude: trips[0].details[-1].longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }
        : {
            latitude: 49.792,
            longitude: 24.054,
            latitudeDelta: 1,
            longitudeDelta: 1,
        };

    return (
        <View style={styles.map}>
            <MapView style={StyleSheet.absoluteFillObject} initialRegion={initialRegion}>
                {trips.map((trip) => {
                    const details = trip.details;

                    if (details.length < 2) return null;

                    // Render segments between each pair of points
                    const segments = details.map((point, i) => {
                        if (i === details.length - 1) return null;
                        return (
                            <Polyline
                                key={`trip-${trip.id}-segment-${i}`}
                                coordinates={[
                                    { latitude: point.latitude, longitude: point.longitude },
                                    {
                                        latitude: details[i + 1].latitude,
                                        longitude: details[i + 1].longitude,
                                    },
                                ]}
                                strokeColor={getPolylineColor(point)}
                                strokeWidth={4}
                            />
                        );
                    });

                    const last = details[details.length - 1];

                    return (
                        <React.Fragment key={trip.id}>
                            {segments}
                            <Marker
                                key={`marker-${trip.id}`}
                                coordinate={{
                                    latitude: last.latitude,
                                    longitude: last.longitude,
                                }}
                            >
                                <View style={styles.userLabel}>
                                    <Text style={styles.userLabelText}>{trip.user_id}</Text>
                                </View>
                            </Marker>
                        </React.Fragment>
                    );
                })}
            </MapView>

            <View style={styles.selectorWrapper}>
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
            </View>
        </View>
    );
};

export default CurrentRouteMap;

const styles = StyleSheet.create({
    map: {
        height: '60%',
    },
    selectorWrapper: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectorButton: {
        marginHorizontal: 5,
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
    userLabel: {
        backgroundColor: 'white',
        padding: 4,
        borderRadius: 4,
        borderColor: '#007BFF',
        borderWidth: 1,
        elevation: 4,
        zIndex: 10,
        alignItems: 'center',
    },

    userLabelText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#007BFF',
        textAlign: 'center',
    },

    calloutText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#007BFF',
    },

});
