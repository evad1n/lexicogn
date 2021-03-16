import APIS from "@/src/api";
import AutoSuggestion from "@/src/components/widgets/AutoSuggestion";
import SearchBar from "@/src/components/widgets/SearchBar";
import { useTypedSelector } from "@/src/store/selector";
import React, { createRef, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import SearchResultCard from "_components/SearchResultCard";

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
                    search={async (text: string) => await searchWord(text)}
                    style={{ backgroundColor: theme.primary.light }}
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
        let response = await APIS[1].http.get(word);
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
                API: APIS[1],
                Definition: response.data[0].shortdef[0],
            },
            {
                Word: word,
                API: APIS[2],
                Definition: response.data[0].shortdef[0],
            },
        ]);
        setLoading(() => false);
    }

    async function autoCompleteSuggestions(word: string) {
        if (word.length > 1) {
            let response = await APIS[0].http.get("", {
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


    function renderSearching() {
        if (word.length == 0) {
            return (
                <Text style={{ fontSize: 20, color: theme.primary.text }}>Search for a word to see results</Text>
            );
        } else {
            return (
                <View style={styles.autoSuggestions}>
                    {suggestions.map((word: string, index) => (
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
            )
        } else {
            if (results.length == 0) {
                return (
                    <Text>No results for '{word}'</Text>
                )
            } else {
                return (
                    <FlatList
                        style={{
                            width: width
                        }}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        data={results}
                        renderItem={({ item }) => <SearchResultCard item={item}/>}
                        keyExtractor={(item: WordResult) => item.API.name}
                    />
                )
            }
        }
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps={"handled"}
        >
            {searched ?  renderResults() : renderSearching()}
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
