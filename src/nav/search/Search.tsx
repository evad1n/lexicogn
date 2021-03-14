import APIS from "@/src/api";
import AutoSuggestion from "@/src/components/widgets/AutoSuggestion";
import SearchBar from "@/src/components/widgets/SearchBar";
import React, { createRef, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SearchResultCard, { WordResult } from "_components/SearchResultCard";
import { SearchRouteProps } from "./SearchRoutes";

// Use axios.all on all selected APIs

export default function Search({ navigation }: SearchRouteProps<"Search">) {
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
                    search={async (text: string) => await searchWord(text)}
                />
            ),
            headerTitleContainerStyle: {
                left: 60,
            },
        });
    }, [navigation]);

    async function searchWord(word: string) {
        // Clear old results
        setResults(() => []);
        setSearched(true);
        setLoading(() => true);
        let response = await APIS.merriamWebster.get(word);
        // Set results to generic form for each API
        // Check if found
        if (response.data.length == 0 || typeof response.data[0] == "string") {
            console.log(results, word);
            return;
        }
        setResults([
            ...results,
            {
                Word: word,
                API: APIS.merriamWebster,
                Definition: response.data[0].shortdef[0],
            },
        ]);
        setLoading(() => false);
    }

    async function autoCompleteSuggestions(word: string) {
        if (word.length > 1) {
            let response = await APIS.autocomplete.get("", {
                params: { search: word },
            });
            setSuggestions(response.data.docs.map((doc: any) => doc.word));
        }
    }

    // Autocomplete hook
    useEffect(() => {
        autoCompleteSuggestions(word);
        return () => { };
    }, [word]);

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps={"handled"}
        >
            {!searched ? (
                (word.length == 0) ? (
                    <Text>Search for a word to see results!</Text>
                ) : (
                    <View style={styles.autoSuggestions}>
                        {suggestions.map((word: string, index) => (
                            <AutoSuggestion
                                key={index}
                                text={word}
                                handlePress={async (text: string) => await searchWord(text)}
                            />
                        ))}
                    </View>
                )
            ) : (
                loading ? (
                <View>
                    <ActivityIndicator size={"large"} color="#000" />
                </View>
                ) : (
                    (results.length == 0) ? (
                        <Text>No results for '{word}'</Text>
                    ) : (
                        results.map((result: WordResult, index) => (
                            <SearchResultCard key={index} result={result} />
                        ))
                    )
                )
            )}
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
