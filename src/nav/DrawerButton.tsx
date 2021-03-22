import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Keyboard, StyleSheet, TouchableOpacity } from 'react-native';
import { useTypedSelector } from '../store/selector';


export default function DrawerButton({ navigation }: any) {
    const theme = useTypedSelector(state => state.theme);

    // FIX: nAVIGATION SUCKS
    useEffect(() => {
        return () => {
            // console.log("AFTER: ", navigation);
        };
    }, []);

    return (
        <TouchableOpacity onPress={() => {
            navigation.openDrawer();
            Keyboard.dismiss();
        }}>
            <Ionicons name="menu" size={36} style={styles.button} color={theme.primary.text} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        marginLeft: 10,
    },
});
