import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Keyboard, StyleSheet, TouchableOpacity } from 'react-native';
import { useCurrentTheme } from '_store/hooks';


export default function DrawerButton({ navigation }: any) {
    const theme = useCurrentTheme();

    return (
        <TouchableOpacity style={styles.width} onPress={() => {
            Keyboard.dismiss();
            navigation.openDrawer();
        }}>
            <Ionicons name="menu" size={36} color={theme.primary.darkText} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    width: {
        width: 60,
        paddingHorizontal: 10,
        paddingVertical: 8,
    }
});
