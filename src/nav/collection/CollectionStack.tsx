// import SharedSearchBar from '@/src/components/widgets/SharedSearchBar';
import { ProvideSearchInput } from '_hooks/search_input';
import { useCurrentTheme } from '@/src/store/hooks';
import { useNavigation } from '@react-navigation/core';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React from 'react';
import DrawerButton from '_nav/DrawerButton';
import { RouteNavProps } from '../DrawerRoutes';
import Collection from './Collection';
import { CollectionRoute } from './CollectionRoutes';
import Detail from './Detail';

const Stack = createStackNavigator<CollectionRoute>();

export default function CollectionStack({ navigation }: RouteNavProps<"Collection">) {
    return (
        <ProvideSearchInput>
            <Stack.Navigator
                initialRouteName="Collection"
                headerMode="float"
                keyboardHandlingEnabled={false}
                screenOptions={{
                    headerLeft: () => (<DrawerButton navigation={navigation} />),
                    ...TransitionPresets.SlideFromRightIOS,
                    headerStyleInterpolator: () => ({}),
                }}
            >
                <Stack.Screen name="Collection" component={Collection} />
                <Stack.Screen name="Detail" component={Detail} />
            </Stack.Navigator>
        </ProvideSearchInput >
    );
}