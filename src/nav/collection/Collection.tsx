import SearchBar from '@/src/components/widgets/SearchBar';
import Spinner from '@/src/components/widgets/Spinner';
import { getAllWordsOverview } from '@/src/db/db';
import { useFocusEffect } from '@react-navigation/core';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, Text, View } from 'react-native';
import ListItemButton from "_components/widgets/ListItemButton";
import useDebounce from '_hooks/debounce';
import { useSearchInput } from '_hooks/search_input';
import { useCurrentTheme } from '_hooks/theme_provider';
import { CollectionRouteProps } from './CollectionRoutes';

export default function Collection({ route, navigation }: CollectionRouteProps<'Collection'>) {
    const theme = useCurrentTheme();
    const { inputRef, focus } = useSearchInput();

    const [words, setWords] = useState<WordOverivew[]>(undefined!);

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const [results, setResults] = useState<WordOverivew[]>([]);


    // Load words
    useFocusEffect(
        useCallback(
            () => {
                async function loadWords() {
                    try {
                        let loadedWords = await getAllWordsOverview();
                        setWords(loadedWords);
                    } catch (error) {
                        throw Error(error);
                    }
                }
                setWords(undefined!);
                loadWords();
            },
            [],
        )
    );

    // Search bar focus
    useFocusEffect(
        useCallback(() => {
            // Focus search bar if requested
            if (route.params) {
                if (route.params.focus ?? false) {
                    focus();
                }
                setSearch(route.params.search ?? "");
            }
        }, [route.params, focus, inputRef])
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
                    style={{ backgroundColor: theme.palette.secondary }}
                />
            ),
            headerTitleContainerStyle: {
                left: 60,
            },
        });
    }, [navigation, theme, search]);

    // Autocomplete hook
    useEffect(() => {
        searchCollection(debouncedSearch);
    }, [debouncedSearch]);

    function searchCollection(text: string) {
        if (!words)
            return;

        let hits = [];
        for (const word of words) {
            // Matches if word contains search
            if (word.word.toUpperCase().includes(text.toUpperCase())) {
                hits.push(word);
            }
        }
        setResults(hits);
    }

    function renderEmptyText() {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[{ color: theme.palette.secondaryText }, styles.emptyText]}>No saved words</Text>
            </View>
        );
    }

    function renderNoMatches() {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.palette.secondaryText }]}>No matches for '{search}'</Text>
            </View>
        );
    }

    function renderContent() {
        if (!words) {
            return (
                <Spinner />
            );
        } else {
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
                                id: item.id,
                                search
                            });
                        }}
                    />}
                    keyExtractor={(item, index) => `${index}`}
                    ListEmptyComponent={search.length !== 0 && words.length !== 0 ? renderNoMatches : renderEmptyText}
                />
            );
        }
    }

    return (
        <React.Fragment>
            {renderContent()}
        </React.Fragment>
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
