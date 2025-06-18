import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import FinishedTripsPage from './src/pages/FinishedTripsPage';
import CurrentTripPage from './src/pages/CurrentTripPage';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="Current"
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Finished') {
                            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
                        } else if (route.name === 'Current') {
                            iconName = focused ? 'bicycle' : 'bicycle-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />
                    },
                    tabBarActiveTintColor: '#2196f3',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                <Tab.Screen name="Current" component={CurrentTripPage} />
                <Tab.Screen name="Finished" component={FinishedTripsPage} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
