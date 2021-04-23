import CustomResultCard from "@/src/components/CustomResultCard";
import useDebounce from "@/src/hooks/debounce";
import { useCurrentTheme } from "@/src/store/hooks";
import axios from "axios";
import React, { createRef, useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
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
    let searchBar: any = createRef();
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            searchBar.current?.focusSearchBar();
        });

        return unsubscribe;
    }, [navigation]);

    // Header search bar
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <SearchBar
                    ref={searchBar}
                    autoFocus
                    placeholder="Look up a word..."
                    onChange={(text: string) => {
                        setState((state) => ({ ...state, word: text, searched: false }));
                        setAutocompleted(false);
                    }}
                    onSubmit={(text: string) => searchWord(text)}
                    style={{ backgroundColor: theme.primary.light }}
                />
            ),
            headerTitleContainerStyle: {
                left: 60,
            },
        });
    }, [navigation, theme]);

    async function searchWord(word: string) {
        // Clear old results
        setState((state) => ({ ...state, results: [], searched: true, loading: true }));
        let newResults: WordResult[] = [];
        // Build requests
        let requests = [];
        for (let i = 1; i < APIS.length; i++) {
            requests.push(APIS[i].get(word));
        }
        // Make all requests in one
        let responses = await axios.all(requests);
        // Parse responses
        for (let i = 1; i < APIS.length; i++) {
            newResults.push({
                word,
                api: i,
                definition: APIS[i].parseResponse(responses[i - 1]),
            });
        }
        setState((state) => ({ ...state, results: newResults, loading: false }));
    }

    async function autoCompleteSuggestions(word: string) {
        if (word.length > 1) {
            let suggests = await AutoComplete(word);
            // If these suggestions are still current
            if (word === debouncedSearch) {
                setState((state) => {
                    return { ...state, suggestions: suggests };
                });
                setAutocompleted(true);
            }
        }
    }

    // Autocomplete hook
    useEffect(() => {
        autoCompleteSuggestions(debouncedSearch);
    }, [debouncedSearch]);


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
                                handlePress={async (text: string) => await searchWord(text)}
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
                    <ActivityIndicator size={"large"} color="#000" />
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
