import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerButton from '_nav/DrawerButton';
import Collection from './Collection';
import { RouteNavProps } from '../DrawerRoutes';
import { CollectionRoute } from './CollectionRoutes';
import Detail from './Detail';
import { useCurrentTheme, useWords } from '_store/hooks';
import SearchBar from '@/src/components/widgets/SearchBar';

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