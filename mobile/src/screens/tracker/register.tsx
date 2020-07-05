import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout, Button } from "@ui-kitten/components";
import { AuthContext } from "../../context/AuthContextProvider";
import { Divider, TopNavigation } from "@ui-kitten/components";
import { renderRightActions } from "./main";
export default () => {
  const { authDispatchLogin } = React.useContext(AuthContext);
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
          status="basic"
          appearance="outline"
          onPress={() => {
            authDispatchLogin({
              isAuthenticated: true,
              fetching: false,
              token: "test",
              id: "test",
              error: null,
            });
          }}
        >
          Create Tracker ID
        </Button>
      </Layout>
    </SafeAreaView>
  );
};
