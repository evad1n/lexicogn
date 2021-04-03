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
            initialRouteName="Study"
            screenOptions={{
                headerLeft: () => (<DrawerButton navigation={navigation} />),
            }}

        >
            <Stack.Screen name="Study" component={Study} />
        </Stack.Navigator>
    );
}