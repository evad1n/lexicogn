import { ProvideSearchInput } from '_hooks/search_input';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DrawerButton from '../DrawerButton';
import { RouteNavProps } from '../DrawerRoutes';
import Search from './Search';
import { SearchRoute } from './SearchRoutes';


const Stack = createStackNavigator<SearchRoute>();

export default function HomeStack({ navigation }: RouteNavProps<"Search">) {
    return (
        <ProvideSearchInput>
            <Stack.Navigator
                initialRouteName="Search"
                screenOptions={{
                    headerLeft: () => (<DrawerButton navigation={navigation} />),
                }}
            >
                <Stack.Screen name="Search" component={Search} />
            </Stack.Navigator>
        </ProvideSearchInput>
    );
}