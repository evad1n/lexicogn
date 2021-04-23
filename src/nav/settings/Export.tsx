import CustomAlert from '@/src/components/widgets/CustomAlert';
import buttonStyles from '@/src/styles/button';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import React, { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, NativeSyntheticEvent, StyleSheet, Text, TextInputSubmitEditingEventData, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useCurrentTheme, useWords } from '_store/hooks';

// Create file name w/ date
const tempFileName = `lexicogn_export_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;

export default function Export() {
    const theme = useCurrentTheme();
    const words = useWords();

    const [fileName, setFileName] = useState(tempFileName);

    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");

    async function downloadData() {
        try {
            // Abandon if 0 words
            if (words.length === 0) {
                setShowModal(true);
                setMessage("There's nothing to export!");
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
                setMessage("Exported successfully");
            }

            setShowModal(true);
        } catch (error) {
            setShowModal(true);
            setMessage(error.toString());
        }
    }

    function handleChangeFileName(text: string) {
        setFileName(text);
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Export the current saved words as JSON</Text>
            </View>
            <View style={[styles.fileNameContainer, { backgroundColor: theme.primary.default }]}>
                <View style={styles.labelContainer}>
                    <Text style={styles.fileNameLabel}>File name: </Text>
                    <Text style={styles.fileName}>{fileName}</Text>
                </View>
                <KeyboardAvoidingView
                    style={[styles.inputContainer, { backgroundColor: theme.primary.light }]}
                    behavior="height"
                >
                    <FileNameInput onSubmit={handleChangeFileName} />
                </KeyboardAvoidingView>
            </View>
            <Text style={styles.location}>File will be located in the Downloads folder</Text>
            <TouchableOpacity
                style={[buttonStyles.container, styles.button, { backgroundColor: theme.primary.dark }]}
                onPress={downloadData}
            >
                <Text style={[buttonStyles.text, { color: theme.primary.text }]}>Download</Text>
            </TouchableOpacity>
            {/* Bottom padding */}
            <View style={{ flex: 1.4 }}></View>
            <CustomAlert
                message={message}
                visible={showModal}
                handleClose={() => setShowModal(false)}
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
                { color: theme.primary.text },
                text.length === 0 ? styles.placeholder : null,
            ]}
            value={text}
            onChangeText={text => setText(text)}
            onSubmitEditing={submit}
            ref={input}
            placeholder="Enter a different file name..."
            placeholderTextColor={theme.primary.text}
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
    location: {
        fontSize: 16,
        marginVertical: 20
    },
    button: {
        marginTop: 20
    },
    placeholder: {
        opacity: 0.5
    }
});
