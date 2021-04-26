import SearchBar from '@/src/components/widgets/SearchBar';
import useDebounce from '@/src/hooks/debounce';
import { useSearchInput } from '@/src/hooks/search_input';
import { useFocusEffect } from '@react-navigation/core';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, View } from 'react-native';
import ListItemButton from "_components/widgets/ListItemButton";
import { useCurrentTheme, useWords } from '_store/hooks';
import { CollectionRouteProps } from './CollectionRoutes';

export default function Collection({ route, navigation }: CollectionRouteProps<'Collection'>) {
    const theme = useCurrentTheme();
    const words = useWords();
    const { focus } = useSearchInput();

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 200);

    const [results, setResults] = useState<WordDocument[]>([]);

    // Focus search bar if requested
    const autoFocus = route.params ? route.params.focus : false;

    // FIX: inputRef isn't set yet so....
    useFocusEffect(
        React.useCallback(() => {
            console.log("focus attempt:", autoFocus);
            if (autoFocus) {
                focus();
            }
        }, [autoFocus, focus])
    );

    function onChangeSearch(text: string) {
        setSearch(text);
    }

    function clearSearch() {
        setSearch("");
    }

    // Header search bar
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <SearchBar
                    value={search}
                    placeholder="Search the collection..."
                    onChange={onChangeSearch}
                    onSubmit={() => searchCollection(search)}
                    onClear={clearSearch}
                    style={{ backgroundColor: theme.primary.light }}
                />
            ),
            headerTitleContainerStyle: {
                left: 60,
            },
        });

        // On leave
        // FIX: set it back or smth
        const unsubscribe = navigation.addListener('blur', () => {
            setSearch("");
        });

        return () => {
            unsubscribe();
        };
    }, [navigation, theme, search]);

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
                    navigation.navigate('Detail', {
                        word: item,
                        search
                    });
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
