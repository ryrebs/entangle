import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout, Button } from "@ui-kitten/components";
import { AuthContext } from "../../context/AuthContextProvider";
import { Divider, TopNavigation, Spinner } from "@ui-kitten/components";
import { renderRightActions } from "./main";
import { requestRegisterAction } from "./store/requests";
import { useSelector, useDispatch } from "react-redux";
import { registrationSelector } from "./store/reducer";
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
  const { loading, error, token, id } = useSelector(registrationSelector);
  const dispatch = useDispatch();

  const onRegisterLogin = React.useCallback(async () => {
    let enabled = await Location.hasServicesEnabledAsync();
    if (enabled && (await getPermissionForLocationAync())) {
      // Start background location task updates
      await initBackgroundLocationTaskAync();

      // Immediately get the current position
      // don't wait for the background location task to start
      let location: any = await Location.getCurrentPositionAsync({});
      if (location !== null) {
        const { coords } = location;
        const token = tokenCreate(coords.latitude, coords.longitude);
        if (token !== null) dispatch(requestRegisterAction(token));
        // TODO: Replace with modal
        else console.log("Please Try Again!");
      }
    } else {
      // TODO: Replace with modal
      console.log("Location needs to be turned on and permission enabled.");
    }
  }, [dispatch, tokenCreate, requestRegisterAction]);

  // TODO: remove, Simulate registration for dev
  const regDummy = async () => {
    await getPermissionForLocationAync();
    let location: any = await Location.getCurrentPositionAsync({});
    store.dispatch(updateCoordsReducerAction({ location }));
    authDispatchLogin({
      isAuthenticated: true,
      fetching: false,
      token: "asdasd",
      id: "123123",
      error: null,
    });
  };

  // Api registration effect
  React.useEffect(() => {
    if (!error && !loading && token !== null && id !== null) {
      authDispatchLogin({
        isAuthenticated: true,
        fetching: false,
        token,
        id,
        error: null,
      });
    }
  }, [error, loading, token, id]);

  // TODO: Add loading effect
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
        {/* {loading ? (
          <Spinner status="info" />
        ) : ( */}
            <Button
              size="small"
              status="basic"
              appearance="outline"
              onPress={onRegisterLogin}
            >
              Create Tracker ID
            </Button>
          {/* )} */}
        <Divider />
        {/* TODO: Show error, dispatch error on saga, reset register state */}
      </Layout>
    </SafeAreaView>
  );
};

// Ask permission for using location
export const getPermissionForLocationAync = async () => {
  let { granted } = await Location.requestPermissionsAsync();
  if (granted) {
    return true;
  }
  return false;
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
    // TODO: remove 
    console.log(locations);
    if (locations !== null && locations.length > 0)
      store.dispatch(updateCoordsReducerAction({ location: locations[0] }));
  }
});
