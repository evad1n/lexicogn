import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Keyboard, StyleSheet, TouchableOpacity } from 'react-native';


export default function DrawerButton({ navigation }: any) {
    return (
        <TouchableOpacity onPress={() => { navigation.openDrawer(); Keyboard.dismiss(); }}>
            <Ionicons name="menu" size={36} style={styles.button} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        marginLeft: 10,
    },
});
