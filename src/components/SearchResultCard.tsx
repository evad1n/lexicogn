import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { insertWord } from '_db/db';
import { useCurrentTheme } from '_hooks/theme_provider';
import APIS, { APIType } from '~/api';
import buttonStyles from '../styles/button';
import textStyles from '../styles/text';

export default function SearchResultCard({ item: result }: { item: WordResult; }) {
    const theme = useCurrentTheme();
    const { width } = Dimensions.get('window');
    const navigation = useNavigation();

    const API: APIType = APIS[result.api];

    const saveWord = async () => {
        try {
            let id = await insertWord(result);
            navigation.navigate('Collection', { screen: "Detail", params: { id } });
        } catch (error) {
            throw Error(error);
        }
    };

    const notFound = () => {
        return (
            <React.Fragment>
                <View>
                    <Text style={[styles.word, { color: theme.palette.primaryText }]}>{result.word}</Text>
                </View>
                <View style={styles.notFoundContainer}>
                    <Text style={[styles.notFound, { color: theme.palette.primaryText }]}>No results found</Text>
                </View>
            </React.Fragment>

        );
    };

    const found = () => {
        return (
            <React.Fragment>
                <View style={styles.content}>
                    <Text style={[styles.word, { color: theme.palette.primaryText }]}>{result.word}</Text>
                    <Text style={[styles.definition, { color: theme.palette.primaryText }]}>{result.definition}</Text>
                </View>
                <TouchableOpacity
                    style={[buttonStyles.container, { backgroundColor: theme.palette.secondary }]}
                    onPress={() => saveWord()}
                >
                    <Text style={[buttonStyles.text, { color: theme.palette.secondaryText }]}>Save Word</Text>
                </TouchableOpacity>
            </React.Fragment>
        );
    };

    return (
        <View style={{ width: width }}>
            <View style={[styles.container, { backgroundColor: theme.palette.primary }]}>
                <View style={styles.header}>
                    <Text style={[textStyles.api, { color: theme.palette.primaryText }]}>{API.name.replace(/-/g, ' ')}</Text>
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
