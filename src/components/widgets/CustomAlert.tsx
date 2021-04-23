import { useCurrentTheme } from '@/src/store/hooks';
import buttonStyles from '@/src/styles/button';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomAlertProps {
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
                <View style={[{ backgroundColor: theme.primary.light, shadowColor: theme.primary.text }, styles.modalView]}>
                    <View style={styles.prompt}>
                        <Text adjustsFontSizeToFit style={[{ color: theme.primary.text }, styles.text]}>{message}</Text>
                    </View>
                    <View style={styles.actions}>
                        <TouchableOpacity style={[buttonStyles.container, { backgroundColor: theme.primary.dark }]} onPress={handleClose} >
                            <Text style={[buttonStyles.text, { color: theme.primary.text }]}>OK</Text>
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
