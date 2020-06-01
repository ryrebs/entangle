import React from "react";
import { View, Text } from 'react-native'
import { Button, Divider, Layout, TopNavigation } from '@ui-kitten/components';

import { AuthContext } from "../../context/AuthContextProvider";

export default () => {
    const { authDispatchLogin } = React.useContext(AuthContext)
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Register Screen</Text>
            <Button onPress={() => {
                authDispatchLogin({ isAuthenticated: true, fetching: false, token: "test", id: "test", error: null })
            }}>Register</Button>
        </View>
    );
}
