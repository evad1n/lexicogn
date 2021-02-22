import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AutoSuggestion({ text }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    text: {
        fontSize: 20,
        color: "#00c"
    }
});
