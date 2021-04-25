import CustomResultCard from "@/src/components/CustomResultCard";
import useDebounce from "@/src/hooks/debounce";
import { useCurrentTheme } from "@/src/store/hooks";
import { useFocusEffect } from "@react-navigation/core";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
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

};

const initialState: State = {
    word: "",
    searched: false,
    loading: false,
    results: [],
    suggestions: []
};


export default function Search({ navigation }: SearchRouteProps<'Search'> & RouteNavProps<'Search'>) {
    const theme = useCurrentTheme();
    // Make result card list fit width
    const { width } = Dimensions.get('window');

    const [state, setState] = useState<State>(initialState);

    const [autocompleted, setAutocompleted] = useState(false);
    const debouncedSearch = useDebounce(state.word, 200);

    // Focus search bar on load
    const searchBar: any = useRef();

    useFocusEffect(
        React.useCallback(() => {
            // console.log("focus");
            setState(initialState);
            searchBar.current?.focusSearchBar();
        }, [])
    );

    function clearSearch() {
        setState({ ...state, word: "" });
    }

    function onChangeSearch(text: string) {
        setState(state => ({ ...state, word: text, searched: false }));
        setAutocompleted(false);
    }

    // Header search bar
    useLayoutEffect(() => {
        console.log("render");
        navigation.setOptions({
            headerTitle: () => (
                <SearchBar
                    value={state.word}
                    ref={searchBar}
                    autoFocus
                    placeholder="Look up a word..."
                    onChange={onChangeSearch}
                    onSubmit={searchWord}
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

    async function searchWord() {
        // Clear old results
        setState((state) => ({ ...state, results: [], searched: true, loading: true }));
        let newResults: WordResult[] = [];
        // Build requests
        let requests = [];
        for (let i = 1; i < APIS.length; i++) {
            requests.push(APIS[i].get(state.word));
        }
        // Make all requests in one
        const responses = await axios.all(requests);
        // Parse responses
        for (let i = 1; i < APIS.length; i++) {
            newResults.push({
                word: state.word,
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


    function renderSearching() {
        if (state.word.length == 0) {
            return (
                <Text style={{ marginBottom: "50%", fontSize: 20, color: theme.primary.text }}>Search for a word to see results</Text>
            );
        } else {
            if (autocompleted) {
                return (
                    <View style={styles.autoSuggestions}>
                        {state.suggestions.map((word: string, index) => (
                            <ListItemButton
                                key={index}
                                text={word}
                                handlePress={async (text: string) => await searchWord()}
                            />
                        ))}
                    </View>
                );
            } else
                return null;
        }
    }

    function renderResults() {
        if (state.loading) {
            return (
                <View>
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
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps={"handled"}
        >
            {state.searched ? renderResults() : renderSearching()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    autoSuggestions: {
        paddingTop: 5,
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
    },
});
