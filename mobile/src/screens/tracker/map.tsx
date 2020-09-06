import React from "react";
import { View } from "react-native";
import { Button, Icon, Text } from "@ui-kitten/components";
import { Layout } from "@ui-kitten/components";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import * as eva from "@eva-design/eva";
import * as Location from "expo-location";
import { getPermissionForLocationAync } from "./register";
import {
  targetsCoordsSelector,
  trackerCoordsSelector,
} from "../tracker/store/reducer";
import TargetModal from "./target.modal";
import UtilModal from "../../utils/modal.util";
import { styles, mapStyle } from "./style";
import { ThemeContext } from "../../context/ThemeContextProvider";
import { authSelector } from "../../store/auth/auth.reducer";
import { startUpdates } from "./store/saga";

const locationIcon = (selfLocationOn: Boolean) => {
  const isLocationIconACtiveColor = selfLocationOn ? "#22C10F" : "#F5F5F5";
  const locationOffStroke = selfLocationOn ? "#2993E6" : "#A3B1BB";
  return (
    <Icon
      fill={isLocationIconACtiveColor}
      stroke={locationOffStroke}
      style={styles.icon}
      name="radio-button-on"
    />
  );
};

const targetIcon = (targetsDetected: Boolean) => {
  const targetsActiveColor = targetsDetected ? "#07EE15" : "#F5F5F5";
  const locationOffStroke = targetsDetected ? "#9F5B4C" : "#A3B1BB";
  return (
    <Icon
      fill={targetsActiveColor}
      stroke={locationOffStroke}
      style={styles.icon}
      name="people-outline"
    />
  );
};

// Effect: Zoom into a provided coords for self location
const useZoomInToCoords = (map: any, coords: any, selfLocationOn: boolean) => {
  React.useEffect(() => {
    (async () => {
      if (
        coords != null &&
        selfLocationOn &&
        (await Location.hasServicesEnabledAsync())
      )
        map.current.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      else
        map.current.animateToRegion({
          latitude: 40,
          longitude: 40,
          latitudeDelta: 50,
          longitudeDelta: 90,
        });
    })();
  }, [selfLocationOn, map, coords]);
};

// TODO:  Effect for fetching coords transfer on saga
const useFetchTargetCoords = () => {};

const isLocationEnabled = async () => {
  return (
    (await Location.hasServicesEnabledAsync()) &&
    (await getPermissionForLocationAync())
  );
};

export default () => {
  // Hooks
  const mapRef = React.useRef();
  const { theme } = React.useContext(ThemeContext);
  const coords = useSelector(trackerCoordsSelector);
  const targetCoords = useSelector(targetsCoordsSelector);
  const [selfLocationOn, setSelfLocation] = React.useState(false);
  const [isTargetModalVisible, setIsTargetModalVisible] = React.useState(false);
  const [permissionModal, setPermissionModal] = React.useState(false);
  const [mapReady, setMapReady] = React.useState(false);
  const { name } = useSelector(authSelector);
  const dispatch = useDispatch();

  // Effects
  useZoomInToCoords(mapRef, coords, selfLocationOn);
  React.useEffect(() => {
    dispatch(startUpdates());
  }, []);

  // Callbacks
  const onLocationIconPress = React.useCallback(async () => {
    const isLocEnabled = await isLocationEnabled();
    if (!isLocEnabled) {
      setPermissionModal(true);
    } else setSelfLocation(!selfLocationOn);
  }, [setSelfLocation, selfLocationOn, setPermissionModal]);

  const locationIconComp = React.useCallback(() => {
    return locationIcon(selfLocationOn);
  }, [selfLocationOn]);

  const targetIconComp = React.useCallback(() => {
    return targetIcon(targetCoords.length > 0);
  }, [targetCoords, targetIcon]);

  const onToggleMenuPress = React.useCallback(() => {
    setIsTargetModalVisible(true);
  }, [setIsTargetModalVisible]);

  const targetCoordsHandler = React.useCallback(() => {
    setIsTargetModalVisible(false);
  }, [setIsTargetModalVisible]);

  const onLayout = React.useCallback(() => {
    setMapReady(true);
  }, [setMapReady]);

  const mapStyles = theme === eva.dark ? mapStyle : [];

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.locationBtnWrapper}>
        <Button
          appearance="ghost"
          onPress={onLocationIconPress}
          accessoryLeft={locationIconComp}
        />
      </View>
      <View style={styles.targetMenuWrapper}>
        <Button
          appearance="ghost"
          onPress={onToggleMenuPress}
          accessoryLeft={targetIconComp}
        />
        <TargetModal
          map={mapRef}
          targets={targetCoords}
          setIsTargetModalVisible={setIsTargetModalVisible}
          isTargetModalVisible={isTargetModalVisible}
          targetCoordsHandler={targetCoordsHandler}
        />
        <UtilModal
          isVisible={permissionModal}
          headerText="Error: Do the following steps:"
          setIsVisible={setPermissionModal}
        >
          <Text style={{ marginBottom: 5, fontSize: 13 }}>
            1. Turn on Location.
          </Text>
          <Text style={{ fontSize: 13 }}>2. Allow location permission.</Text>
        </UtilModal>
      </View>

      <MapView
        onLayout={onLayout}
        ref={mapRef}
        style={styles.mapStyle}
        customMapStyle={mapStyles}
      >
        {selfLocationOn ? (
          <Marker coordinate={coords} title={"(You)" + name} />
        ) : null}
        {mapReady
          ? targetCoords.map((l: any, i: number) => (
              <Marker key={i} coordinate={l} title={l.name} />
            ))
          : null}
      </MapView>
    </Layout>
  );
};
