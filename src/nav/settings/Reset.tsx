import CustomAlert from '@/src/components/widgets/CustomAlert';
import { wipeDB } from '@/src/db/db';
import { useCurrentTheme } from '@/src/hooks/theme_provider';
import buttonStyles from '@/src/styles/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RESET_WARNING = "A reset will perform the following actions:";

const RESET_ACTIONS = `
- Clear local storage (saved themes)
- Wipe the database
- Reload the app`;

const WIPE_WARNING = "Wiping the database will only remove all saved words from your collection";


export default function Reset() {
    const theme = useCurrentTheme();

    const [modal, setModal] = useState({
        open: false,
        message: ""
    });

    // Wipe db
    async function wipe() {
        try {
            await wipeDB();

            setModal({
                open: true,
                message: "Database has been wiped"
            });
        } catch (error) {
            setModal({
                open: true,
                message: error.toString()
            });
        }
    }

    async function reset() {
        try {
            await AsyncStorage.clear();
            await wipeDB();
            Updates.reloadAsync();
        } catch (error) {
            setModal({
                open: true,
                message: error.toString()
            });
        }
    }

    const textColor = { color: theme.primary.lightText };

    return (
        <View style={styles.container}>
            <Text style={[styles.text, styles.warning, textColor]}>{RESET_WARNING}</Text>
            <Text style={[styles.text, textColor]}>{RESET_ACTIONS}</Text>
            <Text style={[styles.text, styles.warning, textColor]}>{WIPE_WARNING}</Text>
            <Text style={[styles.text, { marginTop: 20 }, textColor]}>These actions are <Text style={styles.danger}>irreversible</Text></Text>
            <Text style={[styles.text, styles.warning, textColor]}>Proceed with caution</Text>
            <View style={{ flex: 1 }}></View>
            <TouchableOpacity
                style={[buttonStyles.container, styles.button]}
                onPress={wipe}
            >
                <Text style={[buttonStyles.text, { color: "black" }]}>Wipe Data</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[buttonStyles.container, styles.button]}
                onPress={reset}
            >
                <Text style={[buttonStyles.text, { color: "black" }]}>Reset</Text>
            </TouchableOpacity>
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
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    warning: {
        textAlign: "center",
        marginTop: 20,
        marginBottom: 10
    },
    danger: {
        color: "red",
    },
    button: {
        marginTop: 40,
        width: "80%",
        backgroundColor: "#fa5a5a",
    }
});
