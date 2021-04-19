import { useTypedSelector } from '@/src/store/hooks';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ConfirmModalProps {
    visible: boolean,
    message: string,
    handleCancel: () => void,
    handleConfirm: () => void,
}

export default function ConfirmModal({ visible, message, handleCancel, handleConfirm }: ConfirmModalProps) {
    const theme = useTypedSelector(state => state.theme);

    return (
        <Modal
            visible={visible}
            onRequestClose={handleCancel}
            transparent
            animationType="fade"
        >
            <View style={styles.center}>
                <View style={[{ backgroundColor: theme.primary.light, shadowColor: theme.primary.text }, styles.modalView]}>
                    <View style={styles.prompt}>
                        <Text adjustsFontSizeToFit style={[{ color: theme.primary.text }, styles.text]}>{message}</Text>
                    </View>
                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary.default }]} onPress={handleCancel} >
                            <Text style={[styles.buttonText, { color: theme.primary.text }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: "#fa5a5a" }]} onPress={handleConfirm} >
                            <Text style={[styles.buttonText, { color: "black" }]}>Confirm</Text>
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
        // flexGrow: 1,
        // backgroundColor: "blue"
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
    button: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        elevation: 3,
        borderRadius: 3
    },
    buttonText: {
        textTransform: "uppercase",
        fontSize: 20,
        fontWeight: "bold",
        letterSpacing: 0.5
    }
});
