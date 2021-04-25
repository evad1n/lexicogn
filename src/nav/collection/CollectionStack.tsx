import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DrawerButton from '_nav/DrawerButton';
import { RouteNavProps } from '../DrawerRoutes';
import Collection from './Collection';
import { CollectionRoute } from './CollectionRoutes';
import Detail from './Detail';

const Stack = createStackNavigator<CollectionRoute>();

export default function CollectionStack({ navigation }: RouteNavProps<"Collection">) {
    return (
        <Stack.Navigator
            initialRouteName="Collection"
            screenOptions={{
                headerLeft: () => (<DrawerButton navigation={navigation} />),
                animationEnabled: false,
            }}
        >
            <Stack.Screen name="Collection" component={Collection} />
            <Stack.Screen name="Detail" component={Detail} />
        </Stack.Navigator>
    );
}