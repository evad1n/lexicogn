import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface DividerProps {
    style?: StyleProp<ViewStyle>;
    vertical?: boolean,
    color?: string;
}

export default function Divider({ style, vertical = false, color = "black" }: DividerProps) {
    return (
        <View style={[style, vertical ? styles.vertical : styles.horizontal, { borderColor: color }]}>
        </View>
    );
}

const styles = StyleSheet.create({
    vertical: {
        height: "100%",
        borderRightWidth: 1,
    },
    horizontal: {
        width: "100%",
        borderBottomWidth: 1,
    },
});
