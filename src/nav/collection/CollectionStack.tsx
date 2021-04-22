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
    const theme = useCurrentTheme();
    const words = useWords();

    const [search, setSearch] = useState("");

    function searchCollection(text: string) {
        console.log(text);
    }

    return (
        <Stack.Navigator
            initialRouteName="Collection"
            screenOptions={{
                headerLeft: () => (<DrawerButton navigation={navigation} />),
                animationEnabled: false,
                headerTitle: () => (
                    <SearchBar
                        placeholder="Search the collection"
                        onChange={(text: string) => {
                            setSearch(text);
                        }}
                        onSubmit={(text: string) => searchCollection(text)}
                        style={{ backgroundColor: theme.primary.light }}
                    />
                ),
                headerTitleContainerStyle: {
                    left: 60,
                },
            }}

        >
            <Stack.Screen name="Collection" component={Collection} />
            <Stack.Screen name="Detail" component={Detail} />
        </Stack.Navigator>
    );
}