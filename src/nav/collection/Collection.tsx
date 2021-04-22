import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ListItemButton from "_components/widgets/ListItemButton";
import { useCurrentTheme, useWords } from '_store/hooks';
import { CollectionRouteProps } from './CollectionRoutes';

export default function Collection({ navigation }: CollectionRouteProps<'Collection'>) {
    const theme = useCurrentTheme();
    const words = useWords();

    // TODO: actual searching lmao
    const [search, setSearch] = useState("");

    function searchCollection(text: string) {
        console.log(text);
    }

    function renderEmptyText() {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[{ color: theme.primary.text }, styles.emptyText]}>No saved words</Text>
            </View>
        );
    }

    return (
        <FlatList
            contentContainerStyle={{ flexGrow: 1, paddingTop: 5 }}
            data={words}
            renderItem={({ item }) => <ListItemButton
                text={item.word}
                handlePress={() => navigation.navigate('Detail', { word: item })}
            />}
            keyExtractor={(item, index) => `${index}`}
            ListEmptyComponent={renderEmptyText}
        />
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        marginTop: "-20%"
    },
    emptyText: {
        fontSize: 30
    }
});
