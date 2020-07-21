import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Layout, Button } from "@ui-kitten/components";
import { AuthContext } from "../../context/AuthContextProvider";
import { Divider, TopNavigation } from "@ui-kitten/components";
import { renderRightActions } from "./main";
import { requestServiceAction } from "./store/requests";
import { useSelector, useDispatch } from "react-redux";
import { registrationSelector } from "./store/reducer";

export default () => {
  const { authDispatchLogin } = React.useContext(AuthContext);
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector(registrationSelector);
  const onRegisterLogin = React.useCallback(async () => {
    dispatch(requestServiceAction());
  }, [requestServiceAction]);

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
        <Button status="basic" appearance="outline" onPress={onRegisterLogin}>
          Create Tracker ID
        </Button>
      </Layout>
    </SafeAreaView>
  );
};
