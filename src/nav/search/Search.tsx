import APIS, { AutoComplete, WordResult } from "~/api";
import AutoSuggestion from "_components/widgets/AutoSuggestion";
import SearchBar from "_components/widgets/SearchBar";
import { useTypedSelector } from "@/src/store/selector";
import React, { createRef, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import SearchResultCard from "_components/SearchResultCard";
import { SearchRouteProps } from "./SearchRoutes";
import axios from "axios";

// Use axios.all on all selected APIs

export default function Search({ navigation }: SearchRouteProps<"Search">) {
    const theme = useTypedSelector(state => state.theme);
    // Make result card list work right
    const { width } = Dimensions.get('window');

    const [word, setWord] = useState("");
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [results, setResults] = useState<Array<WordResult>>([]);

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
                        setWord(text);
                        setSearched(false);
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
        setResults([]);
        setSearched(true);
        setLoading(true);
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
        setResults(() => newResults);
        setLoading(() => false);
    }

    async function autoCompleteSuggestions() {
        if (word.length > 1) {
            let old = word.length;
            let suggests = await AutoComplete(word);
            // If these suggestions are still current
            if (old == word.length) {
                setSuggestions(() => suggests);
            }
        }
    }

    // Autocomplete hook
    useEffect(() => {
        autoCompleteSuggestions();
        return () => { };
    }, [word]);


    function renderSearching() {
        if (word.length == 0) {
            return (
                <Text style={{ fontSize: 20, color: theme.primary.text }}>Search for a word to see results</Text>
            );
        } else {
            return (
                <View style={styles.autoSuggestions}>
                    {word.length > 1 && suggestions.map((word: string, index) => (
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
        if (loading) {
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
                    data={results}
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
            {searched ? renderResults() : renderSearching()}
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
