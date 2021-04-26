import CustomResultCard from "@/src/components/CustomResultCard";
import useDebounce from "@/src/hooks/debounce";
import { useSearchInput } from "@/src/hooks/search_input";
import { useCurrentTheme } from "@/src/store/hooks";
import { useFocusEffect } from "@react-navigation/core";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Keyboard, StyleSheet, Text, View } from "react-native";
import SearchResultCard from "_components/SearchResultCard";
import ListItemButton from "_components/widgets/ListItemButton";
import SearchBar from "_components/widgets/SearchBar";
import APIS, { AutoComplete } from "~/api";
import { RouteNavProps } from "../DrawerRoutes";
import { SearchRouteProps } from "./SearchRoutes";

type State = {
    word: string,
    searched: boolean,
    loading: boolean,
    results: WordResult[],
    suggestions: string[];
    keyboardOpen: boolean;
};

const initialState: State = {
    word: "",
    searched: false,
    loading: false,
    results: [],
    suggestions: [],
    keyboardOpen: false
};


export default function Search({ navigation }: SearchRouteProps<'Search'> & RouteNavProps<'Search'>) {
    const theme = useCurrentTheme();
    // Make result card list fit width
    const { width } = Dimensions.get('window');

    const { focus } = useSearchInput();

    const [state, setState] = useState<State>(initialState);

    const [autocompleted, setAutocompleted] = useState(false);
    const debouncedSearch = useDebounce(state.word, 200);

    // Focus search bar on load
    useFocusEffect(
        React.useCallback(() => {
            focus();
        }, [focus])
    );

    function openKeyboard() {
        setState(state => ({ ...state, keyboardOpen: true }));
    }
    function closeKeyboard() {
        setState(state => ({ ...state, keyboardOpen: false }));
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

    function onChangeSearch(text: string) {
        setState(state => ({ ...state, word: text, searched: false }));
        setAutocompleted(false);
    }

    function clearSearch() {
        setState({ ...state, word: "", searched: false, loading: false });
    }

    // Header search bar
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <SearchBar
                    value={state.word}
                    placeholder="Look up a word..."
                    onChange={onChangeSearch}
                    onSubmit={() => searchWord(state.word)}
                    onClear={clearSearch}
                    style={{ backgroundColor: theme.primary.light }}
                />
            ),
            headerTitleContainerStyle: {
                left: 60,
            },
        });

        // On leave
        const unsubscribe = navigation.addListener('blur', () => {
            setState(initialState);
        });

        return () => {
            unsubscribe();
        };
    }, [navigation, theme, state.word]);


    // Autocomplete hook
    useEffect(() => {
        autoCompleteSuggestions(debouncedSearch);
    }, [debouncedSearch]);

    async function searchWord(text: string) {
        // Clear old results
        setState((state) => ({ ...state, word: text, results: [], searched: true, loading: true }));
        let newResults: WordResult[] = [];
        // Build requests
        let requests = [];
        for (let i = 1; i < APIS.length; i++) {
            requests.push(APIS[i].get(text));
        }
        // Make all requests in one
        const responses = await axios.all(requests);
        // Parse responses
        for (let i = 1; i < APIS.length; i++) {
            newResults.push({
                word: text,
                api: i,
                definition: APIS[i].parseResponse(responses[i - 1]),
            });
        }
        setState((state) => ({ ...state, results: newResults, loading: false }));
    }

    async function autoCompleteSuggestions(text: string) {
        if (text.length > 1) {
            let suggests = await AutoComplete(text);
            // If these suggestions are still current
            if (text === debouncedSearch) {
                setState((state) => {
                    return { ...state, suggestions: suggests };
                });
                setAutocompleted(true);
            }
        }
    }

    function renderNoCompletions() {
        return (
            <View
                style={[styles.emptyContainer, state.keyboardOpen ? styles.keyboardView : null]}
            >
                <Text style={[styles.emptyText, { color: theme.primary.text }]}>No suggestions for '{state.word}'</Text>
            </View>
        );
    }

    function renderSearching() {
        if (state.word.length == 0) {
            return (
                <View
                    style={[styles.emptyContainer, state.keyboardOpen ? styles.keyboardView : null]}
                >
                    <Text style={[styles.emptyText, { color: theme.primary.text }]}>Search for a word to see results</Text>
                </View>
            );
        } else {
            if (autocompleted) {
                return (
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.autoSuggestions}
                        data={state.suggestions}
                        renderItem={({ item }) => <ListItemButton
                            text={item}
                            handlePress={(text: string) => {
                                Keyboard.dismiss();
                                searchWord(text);
                            }}
                        />}
                        keyExtractor={(item, index) => `${index}`}
                        ListEmptyComponent={renderNoCompletions}
                    />
                );
            } else
                return null;
        }
    }

    function renderResults() {
        if (state.loading) {
            return (
                <View
                    style={[styles.emptyContainer, state.keyboardOpen ? styles.keyboardView : null]}
                >
                    <ActivityIndicator size={"large"} color={theme.primary.text} />
                </View>
            );
        } else {
            return (
                <FlatList
                    style={{
                        width: width
                    }}
                    alwaysBounceHorizontal
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    data={state.results}
                    renderItem={({ item }) => <SearchResultCard item={item} />}
                    keyExtractor={(item, index) => `${index}-api-${item.api}`}
                    ListFooterComponent={<CustomResultCard word={state.word} />}
                />
            );
        }
    }

    return (
        <React.Fragment>
            { state.searched ? renderResults() : renderSearching()}
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        fontSize: 24,
    },
    autoSuggestions: {
        padding: 5,
        flexGrow: 1,
    },
    keyboardView: {
        marginBottom: "50%"
    },
});
