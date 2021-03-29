import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DrawerButton from '../DrawerButton';
import { RouteNavProps } from '../DrawerRoutes';
import Study from './Study';
import { StudyRoute } from './StudyRoutes';

const Stack = createStackNavigator<StudyRoute>();

export default function HomeStack({ navigation }: RouteNavProps<"study">) {
    return (
        <Stack.Navigator
            initialRouteName="study"
            screenOptions={{
                headerLeft: () => (<DrawerButton navigation={navigation} />),
                headerTitle: ""
            }}

        >
            <Stack.Screen name="study" component={Study} />
        </Stack.Navigator>
    );
}