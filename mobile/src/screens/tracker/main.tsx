

import React from "react";
import { Dimensions, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Divider, TopNavigation } from '@ui-kitten/components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Layout, Text } from '@ui-kitten/components';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import useLocation from "../../hook/location"
import { useSelector } from "react-redux";
import { trackerIDSelector } from '../tracker/store/reducer'

const { Navigator, Screen } = createBottomTabNavigator();

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

const MapScreen = ({ navigation }) => {
    useLocation()
    const navigateDetails = () => {
        navigation.navigate('RegisterScreen');
    };
    return (
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <MapView style={styles.mapStyle} >
                {/* <Marker
                    coordinate={coords}
                    title={"You're here"}
                    description={"Your location"}
                />  */}
            </MapView>
        </Layout>
    );
}

const TargetScreen = () => (
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
    const id = useSelector(trackerIDSelector)
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigation title='Target Tracking' subtitle={"ID: " + id} alignment='center' />
            <Divider />
            <Navigator tabBar={props => <BottomTabBar {...props} />}>
                <Screen name='Users' component={MapScreen} />
                <Screen name='Orders' component={TargetScreen} />
            </Navigator>
        </SafeAreaView>
    )
}
