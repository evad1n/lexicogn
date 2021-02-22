import SearchBar from '@/src/components/widgets/SearchBar';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import DrawerButton from '../DrawerButton';
import { RouteNavProps } from '../DrawerRoutes';
import Search from './Search';
import { SearchRoute } from './SearchRoutes';


const Stack = createStackNavigator<SearchRoute>();

export default function HomeStack({ navigation }: RouteNavProps<"Search">) {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerLeft: () => (<DrawerButton navigation={navigation} />),
            }}
        >
            <Stack.Screen name="Home" component={Search} />
        </Stack.Navigator >
    );
}