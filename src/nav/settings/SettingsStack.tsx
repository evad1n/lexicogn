import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DrawerButton from '../DrawerButton';
import { RouteNavProps } from '../DrawerRoutes';
import { SettingsRoute } from './SettingsRoutes';
import Settings from './Settings';
import ThemePicker from './ThemePicker';
import Import from './Import';
import Export from './Export';


const Stack = createStackNavigator<SettingsRoute>();

export default function HomeStack({ navigation }: RouteNavProps<"Settings">) {
    return (
        <Stack.Navigator
            initialRouteName="Settings"
            screenOptions={{
                headerLeft: () => (<DrawerButton navigation={navigation} />),
            }}
        >
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Theme" component={ThemePicker} />
            <Stack.Screen name="Import" component={Import} />
            <Stack.Screen name="Export" component={Export} />
        </Stack.Navigator >
    );
}