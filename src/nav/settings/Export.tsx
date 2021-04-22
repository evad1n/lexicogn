import buttonStyles from '@/src/styles/button';
import Slider from '@brlja/react-native-slider';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useCurrentTheme, useWords } from '_store/hooks';

// Create file name w/ date
const tempFileName = `lexicogn_export_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;

export default function Export() {
    const theme = useCurrentTheme();
    const words = useWords();

    const [error, setError] = useState("");
    const [x, setX] = useState(0);

    async function downloadData() {
        try {
            // TODO: abandon if 0 words

            // First write data as JSON to local file
            const rawWords = words.map(word => {
                return { word: word.word, definition: word.definition };
            });

            const fileURI = FileSystem.documentDirectory + tempFileName;
            await FileSystem.writeAsStringAsync(fileURI, JSON.stringify(rawWords));

            const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY_WRITE_ONLY);
            if (status === "granted") {
                const asset = await MediaLibrary.createAssetAsync(fileURI);
                await MediaLibrary.createAlbumAsync("Download", asset, false);
            }
            alert("Success!");
        } catch (error) {
            setError(error.toString());
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <Text>Export the current saved words as a JSON file.</Text>
                <Text>{x}</Text>
            </View>
            <Slider
                style={{ width: "90%" }}
                value={x}
                onValueChange={val => setX(val)}
            />
            <TouchableOpacity
                style={[buttonStyles.container, styles.button, { backgroundColor: theme.primary.default }]}
                onPress={downloadData}
            >
                <Text style={[buttonStyles.text, styles.buttonText, { color: theme.primary.text }]}>Download</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 30 }}>{error}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {

    },
    buttonText: {

    },
});
