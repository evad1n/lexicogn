import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import DrawerButton from '../DrawerButton';
import { RouteNavProps } from '../DrawerRoutes';
import CustomThemePicker from './CustomThemePicker';
import Export from './Export';
import Import from './Import';
import Reset from './Reset';
import Settings from './Settings';
import { SettingsRoute } from './SettingsRoutes';
import ThemePicker from './ThemePicker';


const Stack = createStackNavigator<SettingsRoute>();

export default function HomeStack({ navigation }: RouteNavProps<"Settings">) {
    return (
        <Stack.Navigator
            initialRouteName="Settings"
            headerMode="float"
            screenOptions={{
                headerLeft: () => (<DrawerButton navigation={navigation} />),
                ...TransitionPresets.SlideFromRightIOS,
                headerStyleInterpolator: () => ({}),
            }}
        >
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Theme" component={ThemePicker} />
            <Stack.Screen name="Custom Theme" component={CustomThemePicker} />
            <Stack.Screen name="Import" component={Import} />
            <Stack.Screen name="Export" component={Export} />
            <Stack.Screen name="Reset" component={Reset} />
        </Stack.Navigator >
    );
}