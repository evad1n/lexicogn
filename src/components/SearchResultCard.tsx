import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTypedDispatch, useTypedSelector } from '_store/hooks';
import APIS, { APIType } from '~/api';
import { insertWord } from '_db/db';
import { textStyles } from '../styles/text';

export default function SearchResultCard({ item: result }: { item: WordResult; }) {
    const theme = useTypedSelector(state => state.theme);
    const { width } = Dimensions.get('window');
    const dispatch = useTypedDispatch();
    const navigation = useNavigation();

    const API: APIType = APIS[result.api];

    const saveWord = async () => {
        try {
            let id = await insertWord(result);
            let word = { ...result, id };
            console.log("insert", word);
            dispatch({
                type: "ADD_WORD",
                item: word
            });
            navigation.navigate('Detail', { word: word });
        } catch (error) {
            console.error(error);
        }
    };

    const notFound = () => {
        return (
            <React.Fragment>
                <View>
                    <Text style={[styles.word, { color: theme.primary.text }]}>{result.word}</Text>
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
                    <Text style={[styles.word, { color: theme.primary.text }]}>{result.word}</Text>
                    <Text style={[styles.definition, { color: theme.primary.text }]}>{result.definition}</Text>
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
                    <Text style={[textStyles.api, { color: theme.primary.text }]}>{API.name.replace(/-/g, ' ')}</Text>
                </View>
                {result.definition != null ? found() : notFound()}
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
