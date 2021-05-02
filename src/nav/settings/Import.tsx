import ConfirmModal from '@/src/components/widgets/ConfirmModal';
import CustomAlert from '@/src/components/widgets/CustomAlert';
import Spinner from '@/src/components/widgets/Spinner';
import buttonStyles from '@/src/styles/button';
import layoutStyles from '@/src/styles/layout';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

const LEAVE_WARNING = `Leaving now will cancel the import`;

interface LeaveModalState {
    open: boolean;
    confirm?: () => void;
}

export default function Import({ navigation }: SettingsRouteProps<'Import'>) {
    const theme = useCurrentTheme();

    const { width } = Dimensions.get("window");

    const [alertModal, setAlertModal] = useState({
        open: false,
        message: ""
    });

    const [leaveModal, setLeaveModal] = useState<LeaveModalState>({
        open: false
    });

    const [loading, setLoading] = useState(false);

    async function uploadFile() {
        try {
            // Restrict file type to JSON, and get cached URI
            const result: any = await DocumentPicker.getDocumentAsync({ type: "application/json" });
            if (result.type == 'cancel')
                return;

            await importFile(result.uri);

            setLoading(false);
            setLeaveModal({ open: false });

            // Show success message!
            setAlertModal({
                open: true,
                message: "Imported successfully"
            });
        } catch (error) {
            setAlertModal({
                open: true,
                message: error.toString()
            });
        }
    };

    async function importFile(fileURI: any): Promise<void> {
        // Get file data
        const data = await FileSystem.readAsStringAsync(fileURI);
        setLoading(true);
        const words: WordDefinition[] = JSON.parse(data);

        // Open db
        const db = SQLite.openDatabase("lexicogn.db");

        // Start transaction
        return new Promise<void>((resolve, reject) => {
            db.transaction(tx => {
                // Process each word
                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    tx.executeSql('INSERT INTO words (word, definition, api) values (?, ?, 0)',
                        [word.word, word.definition],
                    );
                }
            }, (error) => {
                reject(error);
            }, () => {
                resolve();
            });
        });
    }

    // Prevent unmount while importing
    useEffect(
        () =>
            navigation.addListener('beforeRemove', (e) => {
                if (!loading) {
                    // Not currently importing so continue
                    return;
                }
                // Prevent default behavior of leaving the screen
                e.preventDefault();
                // Display warning
                setLeaveModal({ open: true, confirm: () => navigation.dispatch(e.data.action) });
            }),
        [navigation, loading]
    );


    const cardStyle = useMemo(() => ({
        backgroundColor: theme.palette.primary,
        color: theme.palette.primaryText
    }), [theme]);


    function renderContent() {
        if (loading) {
            return (
                <Spinner />
            );
        } else {
            return (
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.directionsContainer}>
                        <Text style={[styles.heading, { color: theme.palette.secondaryText }]}>
                            Upload a JSON file to insert into the database
                    </Text>
                        <Text style={[styles.directions, { color: theme.palette.secondaryText }]}>
                            Content should be of the following format
                    </Text>
                        <Text style={[styles.code, cardStyle]}>{EXAMPLE_TYPE}</Text>
                        <Text style={{ fontWeight: "bold", textAlign: "center", color: theme.palette.secondaryText }}>Example input file:</Text>
                        <Text style={[styles.code, cardStyle]}>{EXAMPLE_JSON}</Text>
                    </View>
                    <TouchableOpacity style={[buttonStyles.container, styles.button, { backgroundColor: theme.palette.primary }]} onPress={uploadFile}>
                        <Text style={[buttonStyles.text, styles.buttonText, { color: theme.palette.primaryText }]}>Upload</Text>
                    </TouchableOpacity>
                </ScrollView>
            );
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {renderContent()}
            <CustomAlert
                visible={alertModal.open}
                message={alertModal.message}
                handleClose={() => setAlertModal({ ...alertModal, open: false })}
            />
            <ConfirmModal
                visible={leaveModal.open}
                message={LEAVE_WARNING}
                handleCancel={() => setLeaveModal({ open: false })}
                handleConfirm={leaveModal.confirm!}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: "space-evenly",
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
        paddingHorizontal: 30,
        marginBottom: 20
    },
    buttonText: {

    },
    code: {
        fontFamily: "monospace",
        paddingHorizontal: 10,
        marginVertical: 10
    },
    progress: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10
    }
});
