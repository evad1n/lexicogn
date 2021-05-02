import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { insertWord } from '_db/db';
import { useCurrentTheme } from '_hooks/theme_provider';
import buttonStyles from '../styles/button';
import textStyles from '../styles/text';

interface CustomResultCardProps {
    word: string;
}

export default function CustomResultCard({ word }: CustomResultCardProps) {
    const theme = useCurrentTheme();
    const { width } = Dimensions.get('window');
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
            navigation.navigate('Collection', { screen: "Detail", params: { id } });
        } catch (error) {
            throw Error(error);
        }
    };

    return (
        <View style={{ width, flex: 1 }}>
            <View style={[styles.container, { backgroundColor: theme.palette.primary }]}>
                <View style={styles.header}>
                    <Text style={[textStyles.api, { color: theme.palette.primaryText }]}>custom</Text>
                </View>
                <View style={styles.content}>
                    <Text style={[styles.word, { color: theme.palette.primaryText }]}>{word}</Text>
                </View>
                <View style={[{ backgroundColor: theme.palette.secondary }, styles.definitionInput]}>
                    <TextInput
                        style={[styles.definition,
                        { color: theme.palette.secondaryText },
                        definition.length === 0 ? textStyles.placeholder : null
                        ]}
                        multiline
                        placeholderTextColor={theme.palette.secondaryText}
                        placeholder="Enter a custom definition here..."
                        onChangeText={(text) => setDefinition(text)}
                        value={definition}
                    />
                </View>
                <TouchableOpacity
                    style={[buttonStyles.container, { backgroundColor: theme.palette.secondary }]}
                    onPress={() => saveWord()}
                >
                    <Text style={[buttonStyles.text, { color: theme.palette.secondaryText }]}>Save Word</Text>
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
    notFoundContainer: {
        flex: 1,
        justifyContent: "center",
    },
    notFound: {
        fontSize: 30,
        textAlign: "center"
    }
});
