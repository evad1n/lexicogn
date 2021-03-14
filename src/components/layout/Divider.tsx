import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Divider({ vertical = false, color = "black" }: { vertical?: boolean, color?: string; }) {
    return (
        <View style={[vertical ? styles.vertical : styles.horizontal, { borderColor: color }]}>
        </View>
    );
}

const styles = StyleSheet.create({
    vertical: {
        borderRightWidth: StyleSheet.hairlineWidth
    },
    horizontal: {
        borderBottomWidth: StyleSheet.hairlineWidth
    },
});
