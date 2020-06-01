

import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Divider, TopNavigation } from '@ui-kitten/components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Layout, Text } from '@ui-kitten/components';

const { Navigator, Screen } = createBottomTabNavigator();

const UsersScreen = ({ navigation }) => {
    const navigateDetails = () => {
        navigation.navigate('RegisterScreen');
    };
    return (

        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text category='h1'>USERS</Text>
            <Button onPress={navigateDetails}>Register</Button>
        </Layout>
    );
}

const OrdersScreen = () => (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text category='h1'>ORDERS</Text>
    </Layout>
);

const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title='Map' />
        <BottomNavigationTab title='Targets' />
    </BottomNavigation>
);


export default ({ navigation }) => {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigation title='Target Tracking' subtitle="Main" alignment='center' />
            <Divider />
            <Navigator tabBar={props => <BottomTabBar {...props} />}>
                <Screen name='Users' component={UsersScreen} />
                <Screen name='Orders' component={OrdersScreen} />
            </Navigator>
        </SafeAreaView>
    )
}
