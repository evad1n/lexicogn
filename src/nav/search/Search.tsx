import APIS, { AutoComplete, WordResult } from "~/api";
import AutoSuggestion from "_components/widgets/AutoSuggestion";
import SearchBar from "_components/widgets/SearchBar";
import { useTypedSelector } from "@/src/store/selector";
import React, { createRef, useEffect, useState, useReducer } from "react";
import { ActionSheetIOS, ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import SearchResultCard from "_components/SearchResultCard";
import { SearchRouteProps } from "./SearchRoutes";
import axios from "axios";

type State = {
    word: string,
    searched: boolean,
    loading: boolean,
    results: WordResult[],
    suggestions: string[];

};

type Action =
    | { type: "setWord", word: string; }
    | { type: "setSearched", searched: boolean; }
    | { type: "setLoading", loading: boolean; }
    | { type: "updateResults", results: WordResult[]; }
    | { type: "updateSuggestions", prevWordLength: number, suggestions: string[]; };

const initialState: State = {
    word: "",
    searched: false,
    loading: false,
    results: [],
    suggestions: []
};

// function reducer(state: State, action: Action) {
//     switch (action.type) {
//         case "setWord":
//             return { ...state, word: action.word };
//         case "setWord":
//             return { ...state, word: action.word };
//         case "setWord":
//             return { ...state, word: action.word };
//         case "setWord":
//             return { ...state, word: action.word };
//         case "setWord":
//             return { ...state, word: action.word };

//         default:
//             break;
//     }
//     console.log(state.length, action.prevLength);
//     if (state.length == 0 || state.length == action.prevLength) {
//         return action.suggestions;
//     } else {
//         return state;
//     }
// }


export default function Search({ navigation }: SearchRouteProps<"Search">) {
    const theme = useTypedSelector(state => state.theme);
    // Make result card list work right
    const { width } = Dimensions.get('window');

    // Refactor state to one object and use reducer
    // const [state, setState] = useReducer(reducer, initialState);
    const [state, setState] = useState<State>(initialState);


    // const [word, setWord] = useState("");
    // const [searched, setSearched] = useState(false);
    // const [loading, setLoading] = useState(false);
    // const [results, setResults] = useState<Array<WordResult>>([]);

    // const [suggestions, setSuggestions] = useState([]);
    // const [suggestions, setSuggestions] = useReducer(suggestionsReducer, []);

    // Focus search bar on load
    let searchBar: any = createRef();
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            searchBar.current?.focusSearchBar();
        });

        return unsubscribe;
    }, [navigation]);

    // Header search bar
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <SearchBar
                    ref={searchBar}
                    autoFocus={true}
                    placeholder="Look up a word"
                    change={(text: string) => {
                        setState((state) => ({ ...state, word: text, searched: false }));
                    }}
                    search={(text: string) => searchWord(text)}
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
        for (const api of APIS) {
            requests.push(api.get(word));
        }
        // Make all requests in one
        let responses = await axios.all(requests);
        // Parse responses
        for (let i = 0; i < APIS.length; i++) {
            newResults.push({
                Word: word,
                API: APIS[i],
                Definition: APIS[i].parseResponse(responses[i]),
            });
        }
        setState((state) => ({ ...state, results: newResults, loading: false }));
    }

    async function autoCompleteSuggestions(word: string) {
        if (word.length > 1) {
            let suggests = await AutoComplete(word);
            // If these suggestions are still current
            setState((state) => {
                console.log(state.word.length, word.length);
                if (state.word.length == word.length) {
                    return { ...state, suggestions: suggests };
                } else {
                    return state;
                }
            });

            // console.log(old, word.length);
            // if (old == word.length) {
            //     setSuggestions(() => suggests);
            // }
        }
    }

    // Autocomplete hook
    useEffect(() => {
        autoCompleteSuggestions(state.word);
        return () => { };
    }, [state.word]);


    function renderSearching() {
        if (state.word.length == 0) {
            return (
                <Text style={{ fontSize: 20, color: theme.primary.text }}>Search for a word to see results</Text>
            );
        } else {
            return (
                <View style={styles.autoSuggestions}>
                    {state.word.length > 1 && state.suggestions.map((word: string, index) => (
                        <AutoSuggestion
                            key={index}
                            text={word}
                            handlePress={async (text: string) => await searchWord(text)}
                        />
                    ))}
                </View>
            );
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
                    keyExtractor={(item: WordResult) => item.API.name}
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
