import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { updateCoordsReducerAction } from "../screens/tracker/store/reducer"
import { useDispatch } from 'react-redux';
const TIME_INTERVAL = 5000 // Receive location updates every 5 seconds
const DISTANCE_INTERVAL = 0 // Receive update with distance 0 meters

export default () => {
    const [errorMsg, setErrorMsg] = useState("");
    const dispatch = useDispatch()
    const updateCoords = useCallback(location => {
        dispatch(updateCoordsReducerAction({ location }))
    }, [location])
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
            }
            const subs = await Location.watchPositionAsync({ accuracy: 6, timeInterval: TIME_INTERVAL, distanceInterval: DISTANCE_INTERVAL }, location => {
                updateCoords(location)
            })
            return () => subs.remove()
        })();
    }, []);
    return { errorMsg, location }
}
