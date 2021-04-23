import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { insertWord } from '_db/db';
import { useCurrentTheme, useTypedDispatch } from '_store/hooks';
import APIS, { APIType } from '~/api';
import buttonStyles from '../styles/button';
import textStyles from '../styles/text';

export default function SearchResultCard({ item: result }: { item: WordResult; }) {
    const theme = useCurrentTheme();
    const { width } = Dimensions.get('window');
    const dispatch = useTypedDispatch();
    const navigation = useNavigation();

    const API: APIType = APIS[result.api];

    const saveWord = async () => {
        try {
            let id = await insertWord(result);
            let word = { ...result, id };
            dispatch({
                type: "ADD_WORD",
                item: word
            });
            navigation.navigate('Collection', { screen: "Detail", params: { word: word } });
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
                <TouchableOpacity
                    style={[buttonStyles.container, { backgroundColor: theme.primary.dark }]}
                    onPress={() => saveWord()}
                >
                    <Text style={[buttonStyles.text, { color: theme.primary.text }]}>Save Word</Text>
                </TouchableOpacity>
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
        paddingBottom: 10,
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
    notFoundContainer: {
        flex: 1,
        justifyContent: "center",
    },
    notFound: {
        fontSize: 30,
        textAlign: "center"
    }
});
