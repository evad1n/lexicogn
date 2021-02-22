import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface WordResult {
    Word: string;
    API: any;
    Definition: string;
};

export default function SearchResultCard({ result }: { result: WordResult; }) {
    return (
        <View style={styles.container}>
            <Text>{result.Word}</Text>
            <Text>{result.Definition}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
    }
});
