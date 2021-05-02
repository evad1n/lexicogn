import CustomAlert from '@/src/components/widgets/CustomAlert';
import { getAllWords } from '@/src/db/db';
import { useCurrentTheme } from '@/src/hooks/theme_provider';
import buttonStyles from '@/src/styles/button';
import textStyles from '@/src/styles/text';
import { useFocusEffect } from '@react-navigation/core';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import React, { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Create file name w/ date
const tempFileName = `lexicogn_export_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;

export default function Export() {
    const theme = useCurrentTheme();

    const lightText = { color: theme.palette.secondaryText };

    const [fileName, setFileName] = useState(tempFileName);
    const [words, setWords] = useState<WordDocument[]>(undefined!);

    const [modal, setModal] = useState({
        open: false,
        message: ""
    });

    // Load words
    useFocusEffect(
        useCallback(
            () => {
                async function loadWords() {
                    try {
                        let loadedWords = await getAllWords();
                        setWords(loadedWords);
                    } catch (error) {
                        throw Error(error);
                    }
                }
                loadWords();
            },
            [],
        )
    );

    async function downloadData() {
        try {
            // Abandon if 0 words
            if (words.length === 0) {
                setModal({
                    open: true,
                    message: "There's nothing to export!"
                });
                return;
            }

            // First write data as JSON to local file
            const rawWords = words.map(word => {
                return { word: word.word, definition: word.definition };
            });

            const fileURI = FileSystem.documentDirectory + fileName;
            await FileSystem.writeAsStringAsync(fileURI, JSON.stringify(rawWords));

            const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY_WRITE_ONLY);
            if (status === "granted") {
                const asset = await MediaLibrary.createAssetAsync(fileURI);
                await MediaLibrary.createAlbumAsync("Download", asset, false);

                // Show success message!
                setModal({
                    open: true,
                    message: "Exported successfully"
                });
            }
        } catch (error) {
            setModal({
                open: true,
                message: error.toString()
            });
        }
    }

    function handleChangeFileName(text: string) {
        setFileName(text);
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={[styles.title, lightText]}>Export the current saved words as JSON</Text>
                <Text style={[styles.title, lightText]}>Total count: {words?.length ?? "..."}</Text>
            </View>
            <View style={[styles.fileNameContainer, { backgroundColor: theme.palette.primary }]}>
                <View style={styles.labelContainer}>
                    <Text style={[styles.fileNameLabel, { color: theme.palette.primaryText }]}>File name: </Text>
                    <Text style={[styles.fileName, { color: theme.palette.primaryText }]}>{fileName}</Text>
                </View>
                <KeyboardAvoidingView
                    style={[styles.inputContainer, { backgroundColor: theme.palette.secondary }]}
                    behavior="height"
                >
                    <FileNameInput onSubmit={handleChangeFileName} />
                </KeyboardAvoidingView>
            </View>
            <Text style={[styles.location, lightText]}>File will be located in the Downloads folder</Text>
            <TouchableOpacity
                style={[buttonStyles.container, styles.button, { backgroundColor: theme.palette.primary }]}
                onPress={downloadData}
            >
                <Text style={[buttonStyles.text, { color: theme.palette.primaryText }]}>Download</Text>
            </TouchableOpacity>
            {/* Bottom padding */}
            <View style={{ flex: 1.4 }}></View>
            <CustomAlert
                message={modal.message}
                visible={modal.open}
                handleClose={() => setModal({ ...modal, open: false })}
            />
        </View>
    );
}

interface FileNameInputProps {
    onSubmit: (event: string) => void;
}

function FileNameInput({ onSubmit }: FileNameInputProps) {
    const theme = useCurrentTheme();

    const [text, setText] = useState("");

    const input: any = useRef();

    const submit = useCallback(
        () => {
            onSubmit(text);
            setText("");
        },
        [text],
    );

    return (
        <TextInput
            style={[
                styles.input,
                { color: theme.palette.secondaryText },
                text.length === 0 ? textStyles.placeholder : null,
            ]}
            value={text}
            onChangeText={text => setText(text)}
            onSubmitEditing={submit}
            ref={input}
            placeholder="Enter a different file name..."
            placeholderTextColor={theme.palette.secondaryText}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 20
    },
    fileNameContainer: {
        flex: 1,
        alignSelf: "stretch",
        margin: 10,
        padding: 20,
        elevation: 3
    },
    labelContainer: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
    },
    fileNameLabel: {
        fontSize: 20,
        fontWeight: "bold",
    },
    fileName: {
        fontSize: 20,
    },
    inputContainer: {
        padding: 10
    },
    input: {
        fontSize: 20
    },
    location: {
        fontSize: 16,
        marginVertical: 20
    },
    button: {
        marginTop: 20
    },
});
