import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider, TopNavigation } from "@ui-kitten/components";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";
import { Icon, TopNavigationAction } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { useSelector } from "react-redux";
import { trackerIDSelector } from "../tracker/store/reducer";
import TargetScreen from "./target";
import MapScreen from "./map";
import { ThemeContext } from "../../context/ThemeContextProvider";
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

const renderRightActions = () => {
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

export default () => {
  const id = useSelector(trackerIDSelector);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="Entangle"
        subtitle={"ID: " + id}
        alignment="center"
        accessoryRight={renderRightActions}
      />
      <Divider />
      <Navigator tabBar={(props) => <BottomTabBar {...props} />}>
        <Screen name="Users" component={MapScreen} />
        <Screen name="Targets" component={TargetScreen} />
      </Navigator>
    </SafeAreaView>
  );
};
