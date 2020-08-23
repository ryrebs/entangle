import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Main from "./screens";
import setupStore from "./store/index";
import setUpApi from "./service/api";
import "./utils/i18n";
import { AuthContextProvider } from "./context/AuthContextProvider";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ThemeProvider from "./context/ThemeContextProvider";

const { store, persistor } = setupStore();
enableScreens();
setUpApi();

const App = () => (
  <ThemeProvider>
    <Provider store={store}>
      <AuthContextProvider>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <Main />
          </SafeAreaProvider>
        </PersistGate>
      </AuthContextProvider>
    </Provider>
  </ThemeProvider>
);

export { store };
export default App;
