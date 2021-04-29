import CustomAlert from '@/src/components/widgets/CustomAlert';
import { insertWord } from '@/src/db/db';
import buttonStyles from '@/src/styles/button';
import layoutStyles from '@/src/styles/layout';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Bar as ProgressBar } from 'react-native-progress';
import { useCurrentTheme } from '_hooks/theme_provider';
import { SettingsRouteProps } from './SettingsRoutes';

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

export default function Import({ navigation }: SettingsRouteProps<'Import'>) {
    const theme = useCurrentTheme();

    const { width } = Dimensions.get("window");

    const [modal, setModal] = useState({
        open: false,
        message: ""
    });

    const [error, setError] = useState("Any errors will appear here");
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        async function F() {
            setLoading(true);
            setTotal(3000);

            for (let i = 0; i < 3000; i++) {
                await new Promise(r => setTimeout(r, 5));
                setProgress(progress => progress + 1);
            }
            // const interval = setInterval(() => {
            //     setProgress(progress => ({
            //         ...progress,
            //         current: progress.current + 1
            //     }));
            // }, 5);
            // return () => {
            //     clearInterval(interval);
            // };
        }
        F();
    }, [navigation]);

    async function uploadFile() {
        try {
            // Restrict file type to JSON, and get cached URI
            const result: any = await DocumentPicker.getDocumentAsync({ type: "application/json" });
            if (result.type == 'cancel')
                return;
            const data = await FileSystem.readAsStringAsync(result.uri);
            setLoading(true);
            const words = JSON.parse(data);
            setTotal(words.length);

            for (let i = 0; i < words.length; i++) {
                // Process each word
                await saveWord(words[i]);
                setProgress(progress + 1);
            }
            setLoading(false);

            // Show success message!
            setModal({
                open: true,
                message: "Imported successfully"
            });
        } catch (error) {
            setModal({
                open: true,
                message: error.toString()
            });
            setError(error.toString());
        }
    }

    async function saveWord(word: WordDefinition) {
        try {
            await insertWord({ ...word, api: 0 });
        } catch (error) {
            // Bubble error up
            throw Error(error);
        }
    };

    function renderContent() {
        if (loading) {
            return (
                <View style={layoutStyles.center}>
                    <Text style={styles.progress}>{progress} / {total}</Text>
                    <Text style={styles.progress}>{progress / total}</Text>
                    <ProgressBar
                        progress={progress / total}
                        color={theme.primary.dark}
                        unfilledColor={theme.primary.light}
                        borderColor={theme.primary.dark}
                        borderWidth={2}
                        width={width * 0.8}
                        height={16}
                        borderRadius={200}
                    />
                </View>
            );
        } else {
            return (
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.directionsContainer}>
                        <Text style={[styles.heading, { color: theme.primary.lightText }]}>
                            Upload a JSON file to insert into the database
                    </Text>
                        <Text style={[styles.directions, { color: theme.primary.lightText }]}>
                            Content should be of the following format
                    </Text>
                        <Text style={[styles.code, { backgroundColor: theme.primary.dark, color: theme.primary.darkText }]}>{EXAMPLE_TYPE}</Text>
                        <Text style={{ fontWeight: "bold", textAlign: "center", color: theme.primary.lightText }}>Example input file:</Text>
                        <Text style={[styles.code, { backgroundColor: theme.primary.dark, color: theme.primary.darkText }]}>{EXAMPLE_JSON}</Text>
                    </View>
                    <TouchableOpacity style={[buttonStyles.container, styles.button, { backgroundColor: theme.primary.dark }]} onPress={uploadFile}>
                        <Text style={[buttonStyles.text, styles.buttonText, { color: theme.primary.darkText }]}>Upload</Text>
                    </TouchableOpacity>
                    <Text style={[styles.errors, { color: theme.primary.lightText }]}>{error}</Text>
                </ScrollView>
            );
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {renderContent()}
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
    },
    progress: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10
    }
});
