import SearchBar from '@/src/components/widgets/SearchBar';
import useDebounce from '@/src/hooks/debounce';
import { useFocusEffect } from '@react-navigation/core';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, View } from 'react-native';
import ListItemButton from "_components/widgets/ListItemButton";
import { useCurrentTheme, useWords } from '_store/hooks';
import { CollectionRouteProps } from './CollectionRoutes';

export default function Collection({ route, navigation }: CollectionRouteProps<'Collection'>) {
    const theme = useCurrentTheme();
    const words = useWords();

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 200);

    const [results, setResults] = useState<WordDocument[]>([]);

    // Focus search bar if requested
    const { focus } = route.params ?? { focus: false };
    const searchBar: any = useRef();

    useFocusEffect(
        React.useCallback(() => {
            if (focus) {
                searchBar.current?.clear();
                searchBar.current?.focusSearchBar();
            }
        }, [focus])
    );

    // Header search bar
    useLayoutEffect(() => {
        console.log("nav change");
        navigation.setOptions({
            headerTitle: () => (
                <SearchBar
                    ref={searchBar}
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

        // On leave
        const unsubscribe = navigation.addListener('blur', () => {
            setSearch("");
        });

        return () => {
            unsubscribe();
        };
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
                <Text style={[styles.emptyText, { color: theme.primary.text }]}>No matches for '{search}'</Text>
            </View>
        );
    }

    return (
        <FlatList
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContainer}
            data={search.length === 0 ? words : results}
            renderItem={({ item }) => <ListItemButton
                text={item.word}
                handlePress={() => {
                    Keyboard.dismiss();
                    navigation.navigate('Detail', { word: item });
                }}
            />}
            keyExtractor={(item, index) => `${index}`}
            ListEmptyComponent={search.length !== 0 && words.length !== 0 ? renderNoMatches : renderEmptyText}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        flexGrow: 1,
        padding: 5
    },
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
