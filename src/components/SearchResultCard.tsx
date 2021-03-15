import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTypedSelector } from '../store/selector';

export default function SearchResultCard({ item: result }: { item: WordResult; }) {
    const theme = useTypedSelector(state => state.theme);

    return (
        <View style={[styles.container, { backgroundColor: theme.primary.default }]}>
            <View style={styles.header}>
                <Text>{result.API.name}</Text>
            </View>
            <View style={styles.content}>
                <Text style={[styles.word, { color: theme.primary.text }]}>{result.Word}</Text>
                <View style={styles.longText}>
                    <Text style={[styles.definition, { color: theme.primary.text }]}>{result.Definition}</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary.light }]}
                    onPress={() => { }}
                >
                    <Text style={[styles.buttonText, { color: theme.primary.text }]}>Save Word</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        padding: 20,
        flex: 1,
        borderRadius: 4,
        elevation: 5
    },
    header: {
        marginBottom: 10
    },
    content: {
        flex: 1,
        backgroundColor: "green"
    },
    word: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 10,
    },
    longText: {
        flexDirection: 'row'
    },
    definition: {
        fontSize: 20,
        backgroundColor: "red",
        flex: 1,
        flexWrap: "wrap"
    },
    footer: {

    },
    button: {
        alignItems: 'center',
        padding: 10,
        elevation: 3,
    },
    buttonText: {
        textTransform: "uppercase",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 0.5
    },
});
