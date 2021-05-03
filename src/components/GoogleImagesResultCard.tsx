import { useNavigation } from '@react-navigation/core';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { insertWord } from '_db/db';
import { useCurrentTheme } from '_hooks/theme_provider';
import buttonStyles from '../styles/button';
import textStyles from '../styles/text';

interface GoogleImagesResultCardProps {
    word: string;
}

export default function GoogleImagesResultCard({ word }: GoogleImagesResultCardProps) {
    const theme = useCurrentTheme();
    const { width } = useWindowDimensions();
    const navigation = useNavigation();

    const searchURL = `https://www.google.com/search?tbm=isch&q=${word}`;

    const [url, setUrl] = useState("");

    const saveURL = async () => {
        try {
            const imageWordResult = {
                api: 1,
                word,
                definition: url,
            };
            let id = await insertWord(imageWordResult);
            navigation.navigate('Collection', { screen: "Detail", params: { id } });
        } catch (error) {
            throw Error(error);
        }
    };

    function openInBrowser() {
        WebBrowser.openBrowserAsync(searchURL);
    }

    return (
        <View style={{ width, flex: 1 }}>
            <View style={[styles.container, { backgroundColor: theme.palette.primary }]}>
                <View style={styles.content}>
                    <Text style={[styles.word, { color: theme.palette.primaryText }]}>{word}</Text>
                </View>
                <View style={[{ backgroundColor: theme.palette.secondary }, styles.urlInput]}>
                    <TextInput
                        style={[styles.definition,
                        { color: theme.palette.secondaryText },
                        url.length === 0 ? textStyles.placeholder : null
                        ]}
                        placeholderTextColor={theme.palette.secondaryText}
                        placeholder="Enter an image URL here..."
                        onChangeText={(text) => setUrl(text)}
                        value={url}
                    />
                </View>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                    style={[buttonStyles.container, { backgroundColor: theme.palette.secondary }]}
                    onPress={saveURL}
                >
                    <Text style={[buttonStyles.text, { color: theme.palette.secondaryText }]}>Save URL</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[buttonStyles.container, { backgroundColor: theme.palette.secondary }]}
                    onPress={openInBrowser}
                >
                    <Text style={[buttonStyles.text, { color: theme.palette.secondaryText }]}>Search Google Images</Text>
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
    urlInput: {
        flexGrow: 0.,
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
