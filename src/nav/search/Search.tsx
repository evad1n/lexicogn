import AutoSuggestion from '@/src/components/widgets/AutoSuggestion';
import SearchBar from '@/src/components/widgets/SearchBar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import APIS from '../../axios';
import { SearchRouteProps } from './SearchRoutes';
import SearchResultCard, { WordResult } from '_components/SearchResultCard';


// Use axios.all on all selected APIs



export default function Search({ navigation }: SearchRouteProps<"Search">) {
    const [word, setWord] = useState("");
    const [searched, setSearched] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [results, setResults] = useState<Array<WordResult>>([]);

    // Header search bar
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <SearchBar
                    autofocus
                    placeholder="Look up a word"
                    change={(text: string) => { setWord(text); setSearched(false); }}
                    search={(text: string) => searchWord(text)}
                />
            ),
            headerTitleContainerStyle: {
                left: 60
            },
        });
    }, [navigation]);

    async function searchWord(word: string) {
        let response = await APIS.merriamWebster.get(word);
        // Set results to generic form for each API
        // Check if found
        if (response.data.length == 0 || typeof response.data[0] == "string") {
            console.log("no")
            return;
        }
        setResults([...results, {
            Word: word,
            API: APIS.merriamWebster,
            Definition: response.data[0].shortdef[0]
        }]);
        setSearched(true);
        // console.log(response.data.meta.shortdef);
        // console.log(results);
    }

    async function autoCompleteSuggestions(word: string) {
        if (word.length > 1) {
            let response = await APIS.autocomplete.get('', { params: { search: word } });
            setSuggestions(response.data.docs);
        }
    }

    function renderResults() {
        if (!searched) {
            if (word.length == 0) {
                return (
                    <Text>Search for a word to see results!</Text>
                );
            } else {
                return (
                    suggestions.map((result: any, index) => (
                        <AutoSuggestion key={index} text={result.word} />
                    ))
                );
            }
        } else {
            if (results.length == 0) {
                return (
                    <Text>No results for '{word}'</Text>
                );
            } else {
                return (
                    results.map((r: WordResult, index) => (
                        <SearchResultCard key={index} result={r}/>
                    ))
                );
            }
        }
    }

    // Autocomplete hook
    useEffect(() => {
        autoCompleteSuggestions(word);
        return () => {
        };
    }, [word]);

    return (
        <View style={styles.container}>
            {renderResults()}
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor
    },
});