import React from "react";
import { Alert, Clipboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider, TopNavigation } from "@ui-kitten/components";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BottomNavigation,
  BottomNavigationTab,
  Modal,
  Card,
  Button,
  Text,
} from "@ui-kitten/components";
import { Icon, TopNavigationAction } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import TargetScreen from "./target";
import MapScreen from "./map";
import { ThemeContext } from "../../context/ThemeContextProvider";
import * as Location from "expo-location";
import { LOCATION_TASK_NAME, initBackgroundLocationTaskAync } from "./register";
import * as TaskManager from "expo-task-manager";
import { useSelector, useDispatch } from "react-redux";
import { authSelector } from "../../store/auth/auth.reducer";
import { logoutRequestAction } from "./store/requests";
import { stopUpdateTrackerCoords, stopFetchTargetUpdates } from "./store/saga";

const { Navigator, Screen } = createBottomTabNavigator();

const MapIcon = (props: any) => <Icon {...props} name="globe" />;

const PeopleIcon = (props: any) => <Icon {...props} name="person" />;

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab icon={MapIcon} title="Map" />
    <BottomNavigationTab icon={PeopleIcon} title="Targets" />
  </BottomNavigation>
);

const ThemeIcon = (props) => {
  const { theme } = React.useContext(ThemeContext);
  return <Icon {...props} name={theme === eva.dark ? "moon" : "sun"} />;
};

const LogoutIcon = (props) => {
  const { theme } = React.useContext(ThemeContext);
  return <Icon {...props} name="log-out" />;
};

const LogoutModal = ({ isModalVisible, toggleModal }) => {
  const dispatch = useDispatch();

  const selfDestruct = React.useCallback(async () => {
    /** Request to delete user's data in the server */
    dispatch(logoutRequestAction());
    /** Stop fetching for targets */
    dispatch(stopFetchTargetUpdates());
    /** Stop tracker coord updates */
    dispatch(stopUpdateTrackerCoords());
    /** Stop background location updates */
    if (await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME))
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    toggleModal();
  }, []);
  return (
    <Modal
      visible={isModalVisible}
      backdropStyle={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onBackdropPress={toggleModal}
    >
      <Card>
        <Text category="s2" style={{ margin: 20 }}>
          Logout and Delete your data on server?
        </Text>
        <Button appearance="outline" status="danger" onPress={selfDestruct}>
          YES
        </Button>
      </Card>
    </Modal>
  );
};

export const renderRightActions = () => {
  const { setTheme } = React.useContext(ThemeContext);
  const toggleOffOn = React.useCallback(() => {
    setTheme();
  }, [setTheme]);
  return (
    <>
      <TopNavigationAction icon={ThemeIcon} onPress={toggleOffOn} />
    </>
  );
};

export const renderLeftActions = () => {
  const [isModalVisible, setModalVisible] = React.useState(false);
  const toggleModal = React.useCallback(() => {
    setModalVisible((isVisible) => !isVisible);
  }, [setModalVisible]);
  return (
    <>
      <TopNavigationAction icon={LogoutIcon} onPress={toggleModal} />
      <LogoutModal isModalVisible={isModalVisible} toggleModal={toggleModal} />
    </>
  );
};

export default () => {
  const { id } = useSelector(authSelector);
  const copyToClipboard = React.useCallback(async () => {
    await Clipboard.setString(id);
    Alert.alert(
      "",
      "Copied to clipboard",
      [{ text: "OK", onPress: () => {} }],
      {
        cancelable: false,
      }
    );
  }, [id]);

  /** Start background location task updates */
  React.useEffect(() => {
    async () => {
      await initBackgroundLocationTaskAync();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="Entangle"
        subtitle={() => (
          <Text appearance="hint" category="c2" onPress={copyToClipboard}>
            {"ID: " + id}
          </Text>
        )}
        alignment="center"
        accessoryRight={renderRightActions}
        accessoryLeft={renderLeftActions}
      />
      <Divider />
      <Navigator tabBar={(props) => <BottomTabBar {...props} />}>
        <Screen name="Users" component={MapScreen} />
        <Screen name="Targets" component={TargetScreen} />
      </Navigator>
    </SafeAreaView>
  );
};
