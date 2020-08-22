import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout, Button } from "@ui-kitten/components";
import { AuthContext } from "../../context/AuthContextProvider";
import { Divider, TopNavigation } from "@ui-kitten/components";
import { renderRightActions } from "./main";
import { requestRegisterAction } from "./store/requests";
import { useSelector, useDispatch } from "react-redux";
import { registrationSelector } from "./store/reducer";
import { trackerCoordsSelector } from "../tracker/store/reducer";
import * as Location from "expo-location";
import tokenCreate from "../../utils/token.util";
import * as TaskManager from "expo-task-manager";
import { updateCoordsReducerAction } from "./store/reducer";
import { logInterceptedForDev } from "../../utils/data.util";
import { store } from "../../index";

const TIME_INTERVAL = 5000; // Receive location updates every 5 seconds
const DISTANCE_INTERVAL = 0; // Receive update with distance 0 meters
export const LOCATION_TASK_NAME = "ENTANGLED_BACKGROUND_LOCATION_TASK";

export default () => {
  const { authDispatchLogin } = React.useContext(AuthContext);
  const { loading, error, token } = useSelector(registrationSelector);
  const coords = useSelector(trackerCoordsSelector);
  const dispatch = useDispatch();

  const onRegisterLogin = React.useCallback(async () => {
    let enabled = await Location.hasServicesEnabledAsync();
    if (enabled && (await getPermissionForLocationAync())) {
      await initBackgroundLocationTaskAync();

      // Immediately get the current position
      // don't wait for the background location task to start
      let location: any = await Location.getCurrentPositionAsync({});

      if (location !== null) {
        const { latitude, longitude } = location;
        const token = tokenCreate(latitude, longitude);
        dispatch(requestRegisterAction(token));
      }
    } else {
      console.log("Location needs to be turned on and permission enabled.");
    }
  }, [dispatch, tokenCreate, requestRegisterAction]);

  // Api registration effect
  React.useEffect(() => {
    if (!error && !loading && token !== null)
      authDispatchLogin({
        isAuthenticated: true,
        fetching: false,
        token: token,
        id: "123456",
        error: null,
      });
  }, [loading, error, token]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="Entangle"
        alignment="center"
        accessoryRight={renderRightActions}
      />
      <Divider />
      <Layout
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Button
          size="small"
          status="basic"
          appearance="outline"
          onPress={onRegisterLogin}
        >
          Create Tracker ID
        </Button>
        <Divider />
      </Layout>
    </SafeAreaView>
  );
};

// Ask permission for using location
export const getPermissionForLocationAync = async () => {
  let { status } = await Location.requestPermissionsAsync();
  if (status !== "granted") {
    return false;
  }
  return true;
};

// Initialize background location update options
const initBackgroundLocationTaskAync = async () =>
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

// Task for background location updates
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    logInterceptedForDev({ error });
    return;
  }
  if (data) {
    const { locations }: any = data;
    if (locations != null && locations.length > 0)
      store.dispatch(updateCoordsReducerAction({ location: locations[0] }));
  }
});
