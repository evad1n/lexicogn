import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTypedSelector } from '_store/hooks';



export default function Import() {
    const currentTheme = useTypedSelector(state => state.theme);

    return (
        <View>
            <Text>Import Data!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});
