import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import MainScreen from "./tracker/main"
import RegisterScreen from './tracker/register'
import { AuthContext } from "../context/AuthContextProvider";

const Stack = createStackNavigator();

function App() {
    const { isAuthenticated } = React.useContext(AuthContext)
    return <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.dark}>
            <NavigationContainer>
                <Stack.Navigator headerMode="none">
                    {isAuthenticated ?
                        (<Stack.Screen name="MainScreen" component={MainScreen} />) :
                        (<Stack.Screen name="RegisterScreen" component={RegisterScreen} />)
                    }
                </Stack.Navigator>
            </NavigationContainer>
        </ApplicationProvider>

    </>;
}

export default App;