import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerButton from '_nav/DrawerButton';
import Home from './Home';
import { RouteNavProps } from '../DrawerRoutes';
import { HomeRoute } from './HomeRoutes';

const Stack = createStackNavigator<HomeRoute>();

export default function HomeStack({ navigation }: RouteNavProps<"Home">) {
    return (
        <Stack.Navigator
            initialRouteName="home"
            screenOptions={{
                headerLeft: () => (<DrawerButton navigation={navigation} />),
                headerTitle: "",
            }}
        >
            <Stack.Screen name="home" component={Home} />
        </Stack.Navigator>
    );
}