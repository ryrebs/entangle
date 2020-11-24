import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout, Button } from "@ui-kitten/components";
import {
  Divider,
  TopNavigation,
  Spinner,
  Text,
  Input,
} from "@ui-kitten/components";
import { renderRightActions } from "./main";
import { requestRegisterAction } from "../../store/auth/auth.request";
import { useSelector, useDispatch, batch } from "react-redux";
import * as Location from "expo-location";
import tokenCreate from "../../utils/token.util";
import * as TaskManager from "expo-task-manager";
import { updateCoordsReducerAction } from "./store/reducer";
import { logInterceptedForDev } from "../../utils/data.util";
import { store } from "../../store";
import { useWindowDimensions } from "react-native";
import { authSelector } from "../../store/auth/auth.reducer";
import { updateTrackerCoordsAction } from "./store/saga";
import Constants from "expo-constants";

const TIME_INTERVAL =
  Constants.manifest.extra.EXPO_ENV === "dev" ? 5000 : 15000; // Receive location updates every 5 seconds
const DISTANCE_INTERVAL = Constants.manifest.extra.EXPO_ENV === "dev" ? 0 : 40; // Receive update with distance 30 meters
export const LOCATION_TASK_NAME = "ENTANGLED_BACKGROUND_LOCATION_TASK";

const isNameValid = (name: string) => {
  return /^[a-zA-Z]\w{4,15}$/.test(name);
};

const isLocationAndLocationPermissionEnabled = async () => {
  const a = await Location.hasServicesEnabledAsync();
  const b = await getPermissionForLocationAync();
  return a && b;
};

export default () => {
  const { loading, error, token, id, errorMsg } = useSelector(authSelector);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);
  const [localError, setLocalError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameErrorMsg] = useState("");
  const dispatch = useDispatch();

  const onRegisterLogin = React.useCallback(async () => {
    setLocalError("");
    setIsSpinnerVisible(true); /** Show the spinner immediately */
    if (isNameValid(name)) {
      let enabled = await isLocationAndLocationPermissionEnabled();
      if (enabled) {
        /** Immediately get the current position */
        let location: any = await Location.getCurrentPositionAsync({});
        if (location !== null) {
          const { coords } = location;
          const token = tokenCreate(coords.latitude, coords.longitude);
          if (token !== null) {
            dispatch(requestRegisterAction(token, name));
          } else setLocalError("Something went wrong!");
        }
      } else setLocalError("Turn on Location and enable Permission");
    } else {
      setNameErrorMsg("Invalid Name or Alias");
    }
    setIsSpinnerVisible(false);
  }, [dispatch, tokenCreate, requestRegisterAction, name]);

  const onChangeText = React.useCallback(
    (val: string) => {
      setName(val);
      setNameErrorMsg("");
    },
    [setName, setNameErrorMsg]
  );

  const inputWidth = useWindowDimensions().width * 0.8;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="Entangle"
        alignment="center"
        accessoryRight={renderRightActions}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 100,
        }}
      >
        <Input
          label="Name / Alias"
          style={{ width: inputWidth, marginBottom: 15 }}
          status="basic"
          placeholder="e.g. klue02 or klue_02"
          value={name}
          onChangeText={onChangeText}
        />
        {loading || isSpinnerVisible ? (
          <Spinner status="info" />
        ) : (
          <Button
            size="small"
            status="basic"
            appearance="outline"
            onPress={onRegisterLogin}
            style={{ width: inputWidth }}
          >
            Register
          </Button>
        )}
        {/* TODO: Create re-usable component */}
        {nameError != "" ? (
          <Text
            style={{ paddingTop: 40, textAlign: "center", fontSize: 12 }}
            status="danger"
          >
            {nameError}. Please try again.
          </Text>
        ) : null}
        {error ? (
          <Text
            style={{ paddingTop: 40, textAlign: "center", fontSize: 12 }}
            status="danger"
          >
            {errorMsg}. Please try again.
          </Text>
        ) : null}
        {localError !== "" ? (
          <Text
            style={{ paddingTop: 40, textAlign: "center", fontSize: 12 }}
            status="danger"
          >
            {localError}. Please try again.
          </Text>
        ) : null}
        <Divider />
      </Layout>
    </SafeAreaView>
  );
};

/** Ask permission for using location */
export const getPermissionForLocationAync = async () => {
  let { granted } = await Location.requestPermissionsAsync();
  if (granted) {
    return true;
  }
  return false;
};

/** Initialize background location update options */
export const initBackgroundLocationTaskAync = async () =>
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

/** Task for background location updates */
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    logInterceptedForDev({ error });
    return;
  }
  if (data) {
    const { locations }: any = data;
    if (locations !== null && locations.length > 0) {
      batch(() => {
        /** Update data on reducer */
        store.dispatch(
          updateCoordsReducerAction({ coords: locations[0].coords })
        );
        /** Update tracker's coord on db */
        store.dispatch(
          updateTrackerCoordsAction({ coords: locations[0].coords })
        );
        /** Where location = {
         *    coords: { ....
         *             "latitude": 10.2997459
         *             "longitude": 123.8935165,
         *             "speed": 0.0223002340644598, },
         *            timestamp: {...}
         * }
         */
      });
    }
  }
});
