import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Layout, Text, Button, Icon, Modal, Card } from "@ui-kitten/components";

const style = StyleSheet.create({
  cardContainer: {
    width: 220,
  },
  cardHeaderText: {
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
    const closeModal = React.useCallback(() => {
      setIsVisible(false);
    }, [setIsVisible]);

    return (
      <Modal visible={isVisible} onBackdropPress={closeModal}>
        <Card
          style={{ width: 220 }}
          header={() => (
            <View style={style.cardContainer}>
              <Layout level="1" style={style.cardHeaderText}>
                <Text style={{ fontSize: 14, alignSelf: "center" }}>
                  {headerText}
                </Text>
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
