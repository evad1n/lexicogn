import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Study() {
    return (
        <SafeAreaView style={styles.shit}>
            <Text>TOP TEXT</Text>
            <Text>BOTTOM TEXT</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    shit: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#cfc",
    }
});
