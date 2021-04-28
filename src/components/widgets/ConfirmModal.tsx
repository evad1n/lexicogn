import { useCurrentTheme } from '_hooks/theme_provider';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import buttonStyles from '@/src/styles/button';

interface ConfirmModalProps {
    visible: boolean,
    message: string,
    handleCancel: () => void,
    handleConfirm: () => void,
}

export default function ConfirmModal({ visible, message, handleCancel, handleConfirm }: ConfirmModalProps) {
    const theme = useCurrentTheme();

    return (
        <Modal
            visible={visible}
            onRequestClose={handleCancel}
            transparent
            animationType="fade"
        >
            <View style={styles.center}>
                <View style={[{ backgroundColor: theme.primary.light, shadowColor: theme.primary.lightText }, styles.modalView]}>
                    <View style={styles.prompt}>
                        <Text adjustsFontSizeToFit style={[{ color: theme.primary.lightText }, styles.text]}>{message}</Text>
                    </View>
                    <View style={styles.actions}>
                        <TouchableOpacity style={[buttonStyles.container, { backgroundColor: theme.primary.dark }]} onPress={handleCancel} >
                            <Text style={[buttonStyles.text, { color: theme.primary.darkText }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[buttonStyles.container, { backgroundColor: "#fa5a5a" }]} onPress={handleConfirm} >
                            <Text style={[buttonStyles.text, { color: "black" }]}>Confirm</Text>
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
        flexShrink: 1
    },
    prompt: {
        marginBottom: 20
    },
    text: {
        textAlign: "center",
        fontSize: 30,
        fontWeight: "700",
    },
    actions: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
    },
});
