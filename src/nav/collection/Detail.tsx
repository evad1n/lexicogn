import { useTypedDispatch, useTypedSelector } from '@/src/store/hooks';
import { textStyles } from '@/src/styles/text';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { deleteWord } from '_db/db';
import APIS from '~/api';
import { CollectionRouteProps } from './CollectionRoutes';


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
                <Text style={[styles.word, { color: theme.primary.text }]}>{word.word}</Text>
                <Text style={[textStyles.api, { color: theme.primary.text }]}>{API.name.replace(/-/g, ' ')}</Text>
                <Text style={[styles.definition, { color: theme.primary.text }]}>{word.definition}</Text>
                <TextInput />
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary.default }]} onPress={() => console.log("edit!")} >
                    <Text style={[styles.buttonText, { color: theme.primary.text }]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary.default }]} onPress={removeWord} >
                    <Text style={[styles.buttonText, { color: theme.primary.text }]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    content: {
        marginTop: 5,
        flexGrow: 1,
    },
    word: {
        fontSize: 36,
        // textAlign: "center",
        // marginTop
    },
    definition: {
        fontSize: 20,
        marginTop: 20
    },
    actions: {
        marginBottom: 5
    },
    button: {
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        elevation: 3,
    },
    buttonText: {
        textTransform: "uppercase",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 0.5
    }
});
