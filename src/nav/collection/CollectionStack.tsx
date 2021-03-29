import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerButton from '_nav/DrawerButton';
import Collection from './Collection';
import { RouteNavProps } from '../DrawerRoutes';
import { CollectionRoute } from './CollectionRoutes';

const Stack = createStackNavigator<CollectionRoute>();

export default function CollectionStack({ navigation }: RouteNavProps<"collection">) {
    return (
        <Stack.Navigator
            initialRouteName="collection"
            screenOptions={{
                headerLeft: () => (<DrawerButton navigation={navigation} />),
                headerTitle: ""
            }}
        >
            <Stack.Screen name="collection" component={Collection} />
        </Stack.Navigator>
    );
}