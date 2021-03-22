import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import APIS, { APIType } from '../api';
import { addWord } from '../store/actions/wordsActions';
import { useTypedSelector } from '../store/selector';

export default function SearchResultCard({ item: result }: { item: WordResult; }) {
    const theme = useTypedSelector(state => state.theme);
    const { width } = Dimensions.get('window');
    const dispatch = useDispatch();

    const API: APIType = APIS[result.API];

    const saveWord = () => {
        dispatch(addWord(result));
    };

    const notFound = () => {
        return (
            <React.Fragment>
                <View>
                    <Text style={[styles.word, { color: theme.primary.text }]}>{result.Word}</Text>
                </View>
                <View style={styles.notFoundContainer}>
                    <Text style={[styles.notFound, { color: theme.primary.text }]}>No results found</Text>
                </View>
            </React.Fragment>

        );
    };

    const found = () => {
        return (
            <React.Fragment>
                <View style={styles.content}>
                    <Text style={[styles.word, { color: theme.primary.text }]}>{result.Word}</Text>
                    <Text style={[styles.definition, { color: theme.primary.text }]}>{result.Definition}</Text>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary.light }]}
                        onPress={() => saveWord()}
                    >
                        <Text style={[styles.buttonText, { color: theme.primary.text }]}>Save Word</Text>
                    </TouchableOpacity>
                </View>
            </React.Fragment>
        );
    };

    return (
        <View style={{ width: width }}>
            <View style={[styles.container, { backgroundColor: theme.primary.default }]}>
                <View style={styles.header}>
                    <Text style={{ fontFamily: "monospace", color: theme.primary.text, textTransform: "capitalize", fontSize: 14 }}>{API.name.replace(/-/g, ' ')}</Text>
                </View>
                {result.Definition != null ? found() : notFound()}
            </View>
        </View >
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
    },
    word: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 10,
    },
    definition: {
        fontSize: 20,
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
    notFoundContainer: {
        flex: 1,
        justifyContent: "center",
    },
    notFound: {
        fontSize: 30,
        textAlign: "center"
    }
});
