import SearchBar from '@/src/components/widgets/SearchBar';
import { useTypedSelector } from '_store/hooks';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { RouteNavProps } from '../DrawerRoutes';
import { CollectionRouteProps } from './CollectionRoutes';
import ListItemButton from "_components/widgets/ListItemButton";

export default function Collection({ navigation }: CollectionRouteProps<'collection'>) {
    const theme = useTypedSelector(state => state.theme);
    const words = useTypedSelector(state => state.words);

    const { width } = Dimensions.get('window');

    // console.log(words);


    const [search, setSearch] = useState("");

    function searchCollection(text: string) {
        console.log(text);
    }

    // Header search bar
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <SearchBar
                    autoFocus={true}
                    placeholder="Search the collection"
                    change={(text: string) => {
                        setSearch(text);
                    }}
                    search={(text: string) => searchCollection(text)}
                    style={{ backgroundColor: theme.primary.light }}
                />
            ),
            headerTitleContainerStyle: {
                left: 60,
            },
        });
    }, [navigation, theme]);

    function renderCollectionList() {
        return (
            <FlatList
                contentContainerStyle={{ width: width }}
                data={words}
                renderItem={({ item }) => <ListItemButton
                    text={item.word}
                    handlePress={() => navigation.navigate('detail', { id: item.id })}
                />}
                keyExtractor={(item, index) => `${index}`}
            />
        );
    }

    return (
        <View style={styles.container}>
            {words.length > 0 ?
                // words.map((word, index) => (
                //     <ListItemButton
                //         key={index}
                //         text={word.word}
                //         handlePress={() => navigation.navigate('detail', { id: word.id })}
                //     />
                // ))
                renderCollectionList()
                :
                <Text>No saved words</Text>
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
});
