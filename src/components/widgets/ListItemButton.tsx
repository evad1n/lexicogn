import { useCurrentTheme } from '_store/hooks';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AutoSuggestion({ text, handlePress }: { text: string; handlePress: any; }) {
    const theme = useCurrentTheme();

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={() => handlePress(text)} activeOpacity={0.8} style={[styles.container, { backgroundColor: theme.primary.dark }]}>
                <Text style={[styles.text, { color: theme.primary.text }]}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flexBasis: "100%",
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    container: {
        borderRadius: 1,
        backgroundColor: "white",
        paddingLeft: 20,
        paddingVertical: 5,
        elevation: 6
    },
    text: {
        fontSize: 20,
        textAlign: "left"
    }
});
