import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function AutoSuggestion({ text, handlePress }: { text: string; handlePress: (word: string) => void; }) {
    return (
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={() => { handlePress(text); console.log(text); }} activeOpacity={0.8} style={[styles.container, styles.shadow]}>
                <Text style={styles.text}>{text}</Text>
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
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 6,
    },
    text: {
        fontSize: 20,
        textAlign: "left"
    }
});
