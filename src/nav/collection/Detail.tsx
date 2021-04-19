import ConfirmModal from '@/src/components/widgets/ConfirmModal';
import { useTypedDispatch, useTypedSelector } from '@/src/store/hooks';
import { textStyles } from '@/src/styles/text';
import React, { useState } from 'react';
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

    const [deleteModal, setDeleteModal] = useState(false);

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
            <ConfirmModal
                visible={deleteModal}
                message={`Are you sure you want to delete ${word.word}?`}
                handleCancel={() => setDeleteModal(false)}
                handleConfirm={removeWord}
            />
            <View style={styles.content}>
                <Text style={[styles.word, { color: theme.primary.text }]}>{word.word}</Text>
                {/* TODO: If edited display (edited); not for custom */}
                <Text style={[textStyles.api, { color: theme.primary.text }]}>{API.name.replace(/-/g, ' ')}</Text>
                <Text style={[styles.definition, { color: theme.primary.text }]}>{word.definition}</Text>
                <TextInput />
            </View>
            <View style={styles.actions}>
                {/* TODO: editing */}
                <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary.default }]} onPress={() => console.log("edit!")} >
                    <Text style={[styles.buttonText, { color: theme.primary.text }]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: "#fa5a5a" }]} onPress={() => setDeleteModal(true)} >
                    <Text style={[styles.buttonText, { color: "black" }]}>Delete</Text>
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
        fontWeight: "bold"
    },
    definition: {
        fontSize: 20,
        marginTop: 20,
    },
    actions: {
        marginBottom: 5
    },
    button: {
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        elevation: 3,
        borderRadius: 3
    },
    buttonText: {
        textTransform: "uppercase",
        fontSize: 20,
        fontWeight: "bold",
        letterSpacing: 0.5
    }
});
