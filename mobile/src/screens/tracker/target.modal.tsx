import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import {
  Layout,
  Text,
  List,
  ListItem,
  Button,
  Icon,
  Modal,
  Card,
} from "@ui-kitten/components";

const style = StyleSheet.create({
  cardContainer: {
    width: 220,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardHeaderText: {
    alignSelf: "flex-start",
    margin: 10,
  },
  cardClose: {
    width: 20,
    height: 20,
  },
  icon: {
    width: 32,
    height: 32,
    margin: 2,
  },
  list: {
    height: Dimensions.get("window").height * 0.3,
  },
});

const targetMenuIcon = () => (
  <Icon style={style.icon} name="radio-button-off" />
);

const Item = React.memo(({ item, zoomToCoords }) => {
  return (
    <ListItem
      title={item.name}
      onPress={zoomToCoords}
      accessoryLeft={targetMenuIcon}
    />
  );
});

export default React.memo(
  ({ setIsTargetModalVisible, isTargetModalVisible, targets, map }) => {
    const closeModal = React.useCallback(() => {
      setIsTargetModalVisible(false);
    }, []);

    // TODO: fix dependency
    const zoomToCoords = React.useCallback((coords) => {
      if (coords != null && map != null)
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
      closeModal();
    }, []);

    // TODO:  fix callback , use other state if possible
    const renderItem = React.useCallback(({ item }) => {
      return <Item item={item} zoomToCoords={() => zoomToCoords(item)} />;
    }, []);

    return (
      <Modal visible={isTargetModalVisible}>
        <Card
          header={() => (
            <View style={style.cardContainer}>
              <Layout level="1" style={style.cardHeaderText}>
                <Text>Tracked Coordinates</Text>
              </Layout>
              <Layout level="2">
                <Button
                  onPress={closeModal}
                  appearance="ghost"
                  accessoryLeft={() => (
                    <Icon style={style.cardClose} name="close" />
                  )}
                />
              </Layout>
            </View>
          )}
        >
          <List
            style={style.list}
            data={targets}
            renderItem={(data) => renderItem(data)}
          />
        </Card>
      </Modal>
    );
  }
);
