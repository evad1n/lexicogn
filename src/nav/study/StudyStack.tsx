import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DrawerButton from '../DrawerButton';
import { RouteNavProps } from '../DrawerRoutes';
import Study from './Study';
import { StudyRoute } from './StudyRoutes';

const Stack = createStackNavigator<StudyRoute>();

export default function HomeStack({ navigation }: RouteNavProps<"Study">) {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerLeft: () => (<DrawerButton navigation={navigation} />),
                headerTitle: ""
            }}

        >
            <Stack.Screen name="Home" component={Study} />
        </Stack.Navigator>
    );
}