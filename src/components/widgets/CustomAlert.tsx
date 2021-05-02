import { useCurrentTheme } from '@/src/hooks/theme_provider';
import buttonStyles from '@/src/styles/button';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomAlertProps {
    /** Show/hide the modal */
    visible: boolean,
    message: string,
    handleClose: () => void,
}

export default function CustomAlert({ visible, message, handleClose }: CustomAlertProps) {
    const theme = useCurrentTheme();

    return (
        <Modal
            visible={visible}
            onRequestClose={handleClose}
            transparent
            animationType="fade"
        >
            <View style={styles.center}>
                <View style={[{ backgroundColor: theme.palette.secondary, shadowColor: theme.palette.secondaryText }, styles.modalView]}>
                    <View style={styles.prompt}>
                        <Text adjustsFontSizeToFit style={[{ color: theme.palette.secondaryText }, styles.text]}>{message}</Text>
                    </View>
                    <View style={styles.actions}>
                        <TouchableOpacity style={[buttonStyles.container, { backgroundColor: theme.palette.primary }]} onPress={handleClose} >
                            <Text style={[buttonStyles.text, { color: theme.palette.primaryText }]}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalView: {
        margin: 30,
        borderRadius: 3,
        padding: 20,
        display: "flex",
        alignItems: "center",
        flexShrink: 1,
    },
    prompt: {
        marginBottom: 20
    },
    text: {
        textAlign: "center",
        fontSize: 24,
        fontWeight: "700",
    },
    actions: {
        width: "100%",
        display: "flex",
    },
});
