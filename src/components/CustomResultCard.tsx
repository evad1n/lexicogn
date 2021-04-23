import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { insertWord } from '_db/db';
import { useCurrentTheme, useTypedDispatch } from '_store/hooks';
import buttonStyles from '../styles/button';
import textStyles from '../styles/text';

interface CustomResultCardProps {
    word: string;
}

export default function CustomResultCard({ word }: CustomResultCardProps) {
    const theme = useCurrentTheme();
    const { width } = Dimensions.get('window');
    const dispatch = useTypedDispatch();
    const navigation = useNavigation();

    const [definition, setDefinition] = useState("");

    const saveWord = async () => {
        try {
            const customWordResult = {
                api: 0,
                word,
                definition
            };
            let id = await insertWord(customWordResult);
            let wordDoc = { ...customWordResult, id };
            dispatch({
                type: "ADD_WORD",
                item: wordDoc
            });
            navigation.navigate('Collection', { screen: "Detail", params: { word: wordDoc } });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={{ width, flex: 1 }}>
            <View style={[styles.container, { backgroundColor: theme.primary.default }]}>
                <View style={styles.header}>
                    <Text style={[textStyles.api, { color: theme.primary.text }]}>custom</Text>
                </View>
                <View style={styles.content}>
                    <Text style={[styles.word, { color: theme.primary.text }]}>{word}</Text>
                </View>
                <View style={[{ backgroundColor: theme.primary.light }, styles.definitionInput]}>
                    <TextInput
                        style={[styles.definition,
                        { color: theme.primary.text },
                        definition.length === 0 ? styles.placeholder : null
                        ]}
                        multiline
                        placeholderTextColor={theme.primary.text}
                        placeholder="Enter a custom definition here..."
                        onChangeText={(text) => setDefinition(text)}
                        value={definition}
                    />
                </View>
                <TouchableOpacity
                    style={[buttonStyles.container, { backgroundColor: theme.primary.light }]}
                    onPress={() => saveWord()}
                >
                    <Text style={[buttonStyles.text, { color: theme.primary.text }]}>Save Word</Text>
                </TouchableOpacity>
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
        marginBottom: 10,
        paddingLeft: 5
    },
    content: {
        paddingLeft: 5
    },
    word: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 10,
    },
    definitionInput: {
        flexGrow: 1,
        justifyContent: "flex-start",
        marginBottom: 20
    },
    definition: {
        fontSize: 20,
        padding: 10
    },
    placeholder: {
        opacity: 0.5
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
