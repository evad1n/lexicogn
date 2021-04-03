import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CollectionRouteProps } from './CollectionRoutes';
import APIS, { APIType } from '~/api';
import { deleteWord } from '_db/db';
import { useTypedSelector } from '@/src/store/hooks';
import { textStyles } from '@/src/styles/text';


export default function Detail({ route, navigation }: CollectionRouteProps<'Detail'>) {
    const theme = useTypedSelector(state => state.theme);

    const { word } = route.params;
    const API = APIS[word.api];

    // Header title
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: word.word,
            headerTitleContainerStyle: {
                left: 0
            },
            headerTitleStyle: {
                textAlign: "center"
            },
        });
    }, [navigation, word]);

    return (
        <View style={styles.container}>
            <Text style={[textStyles.api, { color: theme.primary.text }]}>{API.name.replace(/-/g, ' ')}</Text>
            <Text>{word.definition}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});
