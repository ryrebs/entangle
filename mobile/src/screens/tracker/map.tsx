import React from "react";
import { View } from "react-native";
import { Button, Icon, Text } from "@ui-kitten/components";
import { Layout } from "@ui-kitten/components";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import * as eva from "@eva-design/eva";

import {
  targetsCoordsSelector,
  trackerCoordsSelector,
} from "../tracker/store/reducer";
import TargetModal from "./target.modal";
import useLocation from "../../hook/location";
import UtilModal from "../../utils/modal.util";
import { styles, mapStyle } from "./style";
import { ThemeContext } from "../../context/ThemeContextProvider";

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
const useZoomInToCoords = (map, coords, selfLocationOn, locationEnabled) => {
  React.useEffect(() => {
    if (coords != null && selfLocationOn && locationEnabled)
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
  }, [selfLocationOn]);
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
  const { locationEnabled, allowed } = useLocation();

  // Effects
  useZoomInToCoords(mapRef, coords, selfLocationOn, locationEnabled);

  // Callbacks
  const onLocationIconPress = React.useCallback(
    (e) => {
      const shouldModalVisible = !locationEnabled || !allowed;
      if (shouldModalVisible) {
        setPermissionModal(true);
      } else setSelfLocation(!selfLocationOn);
    },
    [
      setSelfLocation,
      selfLocationOn,
      setPermissionModal,
      locationEnabled,
      allowed,
    ]
  );
  const locationIconComp = React.useCallback(() => {
    const isColorActive = selfLocationOn && locationEnabled && allowed;
    return locationIcon(isColorActive);
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

  const mapStyles = theme === eva.dark ? mapStyle : [];
  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
          headerText="Permission Error"
          setIsVisible={setPermissionModal}
        >
          <Text style={{ marginBottom: 5 }}>Enable location.</Text>
          <Text>Allow location permission.</Text>
        </UtilModal>
      </View>
      <MapView ref={mapRef} style={styles.mapStyle} customMapStyle={mapStyles}>
        {selfLocationOn && coords != null ? (
          <Marker coordinate={coords} />
        ) : null}
        {targetCoords.map((l: any, i: number) => (
          <Marker key={i} coordinate={l} title={l.name} />
        ))}
      </MapView>
    </Layout>
  );
};
