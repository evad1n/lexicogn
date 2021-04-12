import React, { useLayoutEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { CollectionRouteProps } from './CollectionRoutes';
import APIS, { APIType } from '~/api';
import { deleteWord } from '_db/db';
import { useTypedDispatch, useTypedSelector } from '@/src/store/hooks';
import { textStyles } from '@/src/styles/text';
import { TextInput } from 'react-native-gesture-handler';


export default function Detail({ route, navigation }: CollectionRouteProps<'Detail'>) {
    const theme = useTypedSelector(state => state.theme);
    const dispatch = useTypedDispatch();

    const { word } = route.params;
    const API = APIS[word.api];

    const removeWord = async () => {
        try {
            await deleteWord(word.id);
            dispatch({
                type: 'DELETE_WORD',
                id: word.id
            });
            navigation.navigate('Collection');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.word}>{word.word}</Text>
                <Text style={[textStyles.api, { color: theme.primary.text }]}>{API.name.replace(/-/g, ' ')}</Text>
                <Text style={styles.definition}>{word.definition}</Text>
                <TextInput />
            </View>
            <View style={styles.actions}>
                <Button title="Edit" onPress={() => console.log("edit!")} />
                <Button title="Delete" color="red" onPress={removeWord} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    content: {

    },
    word: {
        fontSize: 30,
        textAlign: "center",
        backgroundColor: "red"
    },
    definition: {

    },
    actions: {

    }
});
