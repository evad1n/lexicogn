import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function DrawerButton({ navigation }: any) {
    return (
        <TouchableOpacity onPress={() => { navigation.openDrawer(); Keyboard.dismiss(); }}>
            <Ionicons name="md-menu" size={36} style={styles.button} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        marginLeft: 10,
    },
});
