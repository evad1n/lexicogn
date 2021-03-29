import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DrawerButton from '../DrawerButton';
import { RouteNavProps } from '../DrawerRoutes';
import { SettingsRoute } from './SettingsRoutes';
import Settings from './Settings';
import ThemePicker from './ThemePicker';


const Stack = createStackNavigator<SettingsRoute>();

export default function HomeStack({ navigation }: RouteNavProps<"settings">) {
    return (
        <Stack.Navigator
            initialRouteName="settings"
            screenOptions={{
                headerLeft: () => (<DrawerButton navigation={navigation} />),
            }}
        >
            <Stack.Screen name="settings" component={Settings} />
            <Stack.Screen name="theme" component={ThemePicker} />
        </Stack.Navigator >
    );
}