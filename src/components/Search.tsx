import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

import APIS from '../axios';

// Use axios.all on all selected APIs

export default function Search() {
    const [searchText, setSearchText] = useState("");
    const [results, setResults] = useState("Search to see the result!");

    async function searchWord(word: string) {
        let response = await APIS.merriamWebster.get(word);
        setResults(JSON.stringify(response.data));
    }

    useEffect(() => {
        searchWord(searchText);
        console.log("test");
        return () => {
        };
    }, [searchText]);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Look up a word"
                onChangeText={text => setSearchText(text)}
                onSubmitEditing={() => searchWord(searchText)}
            />
            <Text
                numberOfLines={4}
            >{results}</Text>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
    },
});