import SearchBar from '@/src/components/widgets/SearchBar';
import Spinner from '@/src/components/widgets/Spinner';
import { getAllWordsOverview } from '@/src/db/db';
import layoutStyles from '@/src/styles/layout';
import { useFocusEffect } from '@react-navigation/core';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Keyboard, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';
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
    const [loading, setLoading] = useState(true);
    const [keyboardOpen, setKeyboardOpen] = useState(true);

    function openKeyboard() {
        setKeyboardOpen(true);
    }
    function closeKeyboard() {
        setKeyboardOpen(false);
    }

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", openKeyboard);
        Keyboard.addListener("keyboardDidHide", closeKeyboard);

        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", openKeyboard);
            Keyboard.removeListener("keyboardDidHide", closeKeyboard);
        };
    }, []);

    // Load words
    useFocusEffect(
        useCallback(
            () => {
                async function loadWords() {
                    try {
                        let loadedWords = await getAllWordsOverview();
                        setWords(loadedWords);
                        setLoading(false);
                    } catch (error) {
                        throw Error(error);
                    }
                }
                setWords(undefined!);
                setLoading(true);
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
            } else {
                setSearch("");
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

        // On leave
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
        if (!words || text === "")
            return;

        setLoading(true);

        let hits = [];
        for (const word of words) {
            // Matches if word contains search
            if (word.word.toUpperCase().includes(text.toUpperCase())) {
                hits.push(word);
            }
        }
        setResults(hits);
        setLoading(false);
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

    const renderItem = ({ item }: ListRenderItemInfo<WordOverivew>) => (
        <ListItemButton
            text={item.word}
            handlePress={() => {
                Keyboard.dismiss();
                navigation.navigate('Detail', {
                    id: item.id,
                    search: debouncedSearch
                });
            }}
        />
    );

    function renderContent() {
        if (loading || search !== debouncedSearch) {
            return (
                <View style={[layoutStyles.center, keyboardOpen ? styles.keyboardView : null]}>
                    <Spinner scale={2} />
                </View>
            );
        } else {
            return (
                <FlatList
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.listContainer}
                    data={search.length === 0 ? words : results}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${index}`}
                    ListEmptyComponent={search.length !== 0 && words.length !== 0 ? renderNoMatches : renderEmptyText}
                    initialNumToRender={30}
                    updateCellsBatchingPeriod={500}
                    maxToRenderPerBatch={20}
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
    },
    keyboardView: {
        marginBottom: "75%",
    },
});
