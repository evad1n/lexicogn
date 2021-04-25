import SearchBar from '@/src/components/widgets/SearchBar';
import useDebounce from '@/src/hooks/debounce';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ListItemButton from "_components/widgets/ListItemButton";
import { useCurrentTheme, useWords } from '_store/hooks';
import { CollectionRouteProps } from './CollectionRoutes';

export default function Collection({ navigation }: CollectionRouteProps<'Collection'>) {
    const theme = useCurrentTheme();
    const words = useWords();

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 200);

    const [results, setResults] = useState<WordDocument[]>([]);

    // Header search bar
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <SearchBar
                    placeholder="Search the collection..."
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
        });
    }, [navigation, theme]);

    // Autocomplete hook
    useEffect(() => {
        searchCollection(debouncedSearch);
    }, [debouncedSearch]);

    function searchCollection(text: string) {
        let hits = [];
        for (const word of words) {
            // Matches starting substring
            if (word.word.substr(0, text.length).toUpperCase() === text.toUpperCase()) {
                hits.push(word);
            }
        }
        setResults(hits);
    }

    function renderEmptyText() {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[{ color: theme.primary.text }, styles.emptyText]}>No saved words</Text>
            </View>
        );
    }

    function renderNoMatches() {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[{ color: theme.primary.text }, styles.emptyText]}>No matches for '{search}'</Text>
            </View>
        );
    }

    return (
        <FlatList
            contentContainerStyle={{ flexGrow: 1, paddingTop: 5 }}
            data={search.length === 0 ? words : results}
            renderItem={({ item }) => <ListItemButton
                text={item.word}
                handlePress={() => navigation.navigate('Detail', { word: item })}
            />}
            keyExtractor={(item, index) => `${index}`}
            ListEmptyComponent={search.length !== 0 && words.length !== 0 ? renderNoMatches : renderEmptyText}
        />
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        marginTop: "-20%",
    },
    emptyText: {
        fontSize: 30,
        textAlign: "center"
    }
});
