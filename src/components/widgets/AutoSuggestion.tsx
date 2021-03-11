import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function AutoSuggestion({ text, handlePress }: { text: string; handlePress: (word: string) => void; }) {
    return (
        <TouchableOpacity onPress={() => { handlePress(text); console.log(text); }} style={styles.container}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    text: {
        fontSize: 20,
        color: "#f00"
    }
});
