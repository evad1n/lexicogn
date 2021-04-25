import CustomAlert from '@/src/components/widgets/CustomAlert';
import { insertWord } from '@/src/db/db';
import buttonStyles from '@/src/styles/button';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCurrentTheme, useTypedDispatch } from '_store/hooks';

const EXAMPLE_JSON = `
[
    {
        "word": "test",
        "definition": "test def"
    },
    {
        "word": "test2",
        "definition": "test def2"
    }
]
`;

const EXAMPLE_TYPE = `
type Data = Array<Item>

type Item = {
    word: string;
    definition: string
}
`;

export default function Import() {
    const theme = useCurrentTheme();
    const dispatch = useTypedDispatch();

    const [modal, setModal] = useState({
        open: false,
        message: ""
    });

    const [error, setError] = useState("Any errors will appear here");

    async function uploadFile() {
        try {
            // Restrict file type to JSON, and get cached URI
            const result: any = await DocumentPicker.getDocumentAsync({ type: "application/json" });
            if (result.type == 'cancel')
                return;
            const data = await FileSystem.readAsStringAsync(result.uri);
            const words = JSON.parse(data);
            for (const word of words) {
                // Process each word
                saveWord(word);
            }

            // Show success message!
            setModal({
                open: true,
                message: "Imported successfully"
            });
        } catch (error) {
            console.log(error);
            setError(error.toString());
        }
    }

    async function saveWord(word: WordDefinition) {
        try {
            let id = await insertWord({ ...word, api: 0 });
            let wordDoc = { ...word, api: 0, id };
            dispatch({
                type: "ADD_WORD",
                word: wordDoc
            });
        } catch (error) {
            // Bubble error up
            throw Error(error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.directionsContainer}>
                    <Text style={[styles.heading, { color: theme.primary.text }]}>
                        Upload a JSON file to insert into the database
                    </Text>
                    <Text style={[styles.directions, { color: theme.primary.text }]}>
                        Content should be of the following format
                    </Text>
                    <Text style={[styles.code, { backgroundColor: theme.primary.default, color: theme.primary.text }]}>{EXAMPLE_TYPE}</Text>
                    <Text style={{ fontWeight: "bold", textAlign: "center" }}>Example input file:</Text>
                    <Text style={[styles.code, { backgroundColor: theme.primary.default, color: theme.primary.text }]}>{EXAMPLE_JSON}</Text>
                </View>
                <TouchableOpacity style={[buttonStyles.container, styles.button, { backgroundColor: theme.primary.dark }]} onPress={uploadFile}>
                    <Text style={[buttonStyles.text, styles.buttonText, { color: theme.primary.text }]}>Upload</Text>
                </TouchableOpacity>
                <Text style={styles.errors}>{error}</Text>
            </ScrollView>
            <CustomAlert
                message={modal.message}
                visible={modal.open}
                handleClose={() => setModal({ ...modal, open: false })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 10,
    },
    directionsContainer: {
        flex: 1,
        alignContent: "center",
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10
    },
    directions: {
        fontSize: 16,
        textAlign: "center"
    },
    button: {
        paddingHorizontal: 30
    },
    buttonText: {

    },
    code: {
        fontFamily: "monospace",
        paddingHorizontal: 10,
        marginVertical: 10
    },
    errors: {
        marginTop: 10,
        fontSize: 16,
    }
});
