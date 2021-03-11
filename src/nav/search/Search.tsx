import AutoSuggestion from '@/src/components/widgets/AutoSuggestion';
import SearchBar from '@/src/components/widgets/SearchBar';
import React, { createRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import SearchResultCard, { WordResult } from '_components/SearchResultCard';
import APIS from '../../axios';
import { SearchRouteProps } from './SearchRoutes';


// Use axios.all on all selected APIs


export default function Search({ navigation }: SearchRouteProps<"Search">) {
    const [word, setWord] = useState("");
    const [searched, setSearched] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [results, setResults] = useState<Array<WordResult>>([]);

    let searchBar: any = createRef();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
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
        // Clear old results
        setResults([]);
        setSearched(true);
        let response = await APIS.merriamWebster.get(word);
        // Set results to generic form for each API
        // Check if found
        if (response.data.length == 0 || typeof response.data[0] == "string") {
            console.log(results, word)
            return;
        }
        setResults([...results, {
            Word: word,
            API: APIS.merriamWebster,
            Definition: response.data[0].shortdef[0]
        }]);
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
                        <AutoSuggestion key={index} text={result.word} handlePress={searchWord}/>
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
        <ScrollView contentContainerStyle={styles.container}
        keyboardShouldPersistTaps={'handled'}>
            {renderResults()}
        </ScrollView >
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