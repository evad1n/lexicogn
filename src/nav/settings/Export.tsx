import buttonStyles from '@/src/styles/button';
import * as FileSystem from 'expo-file-system';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useCurrentTheme } from '_store/hooks';

const tempFileName = "words_export.json";

export default function Export() {
    const { theme, words } = useTypedSelector(state => state);

    const [error, setError] = useState("");

    async function downloadData() {
        try {
            // First write data as JSON to local file
            const rawWords = words.map(word => {
                return { word: word.word, definition: word.definition };
            });
            await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + tempFileName, JSON.stringify(rawWords));
            // FIX: Expo has no way to download???
            console.log(FileSystem.documentDirectory + tempFileName);

        } catch (error) {
            setError(error.toString());
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <Text>Export the current saved words as a JSON file.</Text>
            </View>
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
