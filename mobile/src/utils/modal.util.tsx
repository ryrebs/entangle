import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Layout, Text, Button, Icon, Modal, Card } from "@ui-kitten/components";

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
});

export default React.memo(
  ({ isVisible, setIsVisible, headerText, children }) => {
    return (
      <Modal visible={isVisible} onBackdropPress={setIsVisible}>
        <Card
          header={() => (
            <View style={style.cardContainer}>
              <Layout level="1" style={style.cardHeaderText}>
                <Text>{headerText}</Text>
              </Layout>
              <Layout level="2">
                <Button
                  onPress={() => setIsVisible(false)}
                  appearance="ghost"
                  accessoryLeft={() => (
                    <Icon style={style.cardClose} name="close" />
                  )}
                />
              </Layout>
            </View>
          )}
        >
          {children}
        </Card>
      </Modal>
    );
  }
);
