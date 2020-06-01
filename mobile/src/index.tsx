import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import Main from './screens';
import setupStore from './store/index';
import setUpApi from './service/api';
import './utils/i18n';
import { AuthContextProvider } from './context/AuthContextProvider';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { store, persistor } = setupStore();
enableScreens();
setUpApi();

const App = () => (
    <AuthContextProvider>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SafeAreaProvider>
                    <Main />
                </SafeAreaProvider>
            </PersistGate>
        </Provider>
    </AuthContextProvider>
);

export default App;