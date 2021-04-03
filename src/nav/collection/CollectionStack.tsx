import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerButton from '_nav/DrawerButton';
import Collection from './Collection';
import { RouteNavProps } from '../DrawerRoutes';
import { CollectionRoute } from './CollectionRoutes';
import Detail from './Detail';

const Stack = createStackNavigator<CollectionRoute>();

export default function CollectionStack({ navigation }: RouteNavProps<"Collection">) {
    return (
        <Stack.Navigator
            initialRouteName="Collection"
            screenOptions={{
                headerLeft: () => (<DrawerButton navigation={navigation} />),
            }}

        >
            <Stack.Screen name="Collection" component={Collection} />
            <Stack.Screen name="Detail" component={Detail} />
        </Stack.Navigator>
    );
}