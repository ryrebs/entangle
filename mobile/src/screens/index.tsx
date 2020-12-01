import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import MainScreen from "./tracker/main";
import RegisterScreen from "./tracker/register";
import { ThemeContext } from "../context/ThemeContextProvider";
import { useSelector } from "react-redux";
import { authSelector } from "../store/auth/auth.reducer";
import { setBearerToken } from "../service/api";

const Stack = createStackNavigator();

function App() {
  const { authenticated, token } = useSelector(authSelector);
  const { theme } = React.useContext(ThemeContext);

  React.useEffect(() => {
    setBearerToken(token);
  }, [token]);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={theme}>
        <NavigationContainer>
          <Stack.Navigator headerMode="none">
            {authenticated ? (
              <Stack.Screen name="MainScreen" component={MainScreen} />
            ) : (
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}

export { ThemeContext };
export default App;
