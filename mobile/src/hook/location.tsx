import React, { useState, useEffect, useCallback } from "react";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { updateCoordsReducerAction } from "../screens/tracker/store/reducer";
import { useDispatch } from "react-redux";
import { logInterceptedForDev } from "../utils/data.util";
import { store } from "../index";

const TIME_INTERVAL = 5000; // Receive location updates every 5 seconds
const DISTANCE_INTERVAL = 0; // Receive update with distance 0 meters
const LOCATION_TASK_NAME = "BACKGROUN_LOCATION_TASK";

export default () => {
  const [allowed, setAllowed] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  useEffect(() => {
    (async () => {
      var subs: any;
      try {
        let enabled = await Location.hasServicesEnabledAsync();
        if (enabled) {
          setLocationEnabled(true);
          let { status } = await Location.requestPermissionsAsync();
          if (status !== "granted") {
            setAllowed(false);
          } else {
            setAllowed(true);
            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
              accuracy: 6,
              timeInterval: TIME_INTERVAL,
              distanceInterval: DISTANCE_INTERVAL,
              pausesUpdatesAutomatically: true,
              foregroundService: {
                notificationTitle: "Entangle",
                notificationBody: "Entangle tracker location",
              },
            });
          }
        } else {
          const msg = "Location is not enabled";
          logInterceptedForDev({ msg });
          setLocationEnabled(false);
        }
      } catch (error) {
        logInterceptedForDev({ error });
        setAllowed(false);
      } finally {
        return () => subs.remove();
      }
    })();
  }, [locationEnabled, setLocationEnabled, allowed, setAllowed]);
  return { allowed, locationEnabled };
};

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    logInterceptedForDev({ error });
    return;
  }
  if (data) {
    const { locations } = data;
    if (locations != null && locations.length > 0)
      store.dispatch(updateCoordsReducerAction({ location: locations[0] }));
  }
});
