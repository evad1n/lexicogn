import React from 'react';
import { StyleSheet, View } from 'react-native';

interface DividerProps {
    vertical?: boolean,
    color?: string;
}

export default function Divider({ vertical = false, color = "black" }: DividerProps) {
    return (
        <View style={[vertical ? styles.vertical : styles.horizontal, { borderColor: color }]}>
        </View>
    );
}

const styles = StyleSheet.create({
    vertical: {
        borderRightWidth: 1
    },
    horizontal: {
        borderBottomWidth: 1,
    },
});
