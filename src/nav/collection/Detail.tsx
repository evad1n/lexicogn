import ConfirmModal from '@/src/components/widgets/ConfirmModal';
import { useTypedDispatch, useTypedSelector } from '@/src/store/hooks';
import { textStyles } from '@/src/styles/text';
import { useFocusEffect } from '@react-navigation/core';
import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { deleteWord as deleteWordDB, updateWord as updateWordDB } from '_db/db';
import APIS from '~/api';
import { CollectionRouteProps } from './CollectionRoutes';


export default function Detail({ route, navigation }: CollectionRouteProps<'Detail'>) {
    const theme = useTypedSelector(state => state.theme);
    const dispatch = useTypedDispatch();

    const { word } = route.params;
    const API = APIS[word.api];

    const [deleteModal, setDeleteModal] = useState(false);

    const [definition, setDefinition] = useState(word.definition);
    const [editing, setEditing] = useState(false);

    // Override back button
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (editing) {
                    setEditing(false);
                    return true;
                } else {
                    return false;
                }
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [editing])
    );

    const deleteWord = async () => {
        try {
            await deleteWordDB(word.id);
            dispatch({
                type: 'DELETE_WORD',
                id: word.id
            });
            navigation.navigate('Collection');
        } catch (error) {
            console.error(error);
        }
    };

    const updateWord = async () => {
        console.log("update");
        try {
            await updateWordDB(definition, word.id);
            dispatch({
                type: 'UPDATE_WORD',
                item: { ...word, definition, api: 0 }
            });
            setEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    function renderEditButton() {
        if (editing) {
            return (
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#0bb03c" }]}
                    onPress={updateWord}
                >
                    <Text style={[styles.buttonText, { color: "black" }]}>Save</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary.default }]}
                    onPress={() => setEditing(true)}
                >
                    <Text style={[styles.buttonText, { color: theme.primary.text }]}>Edit</Text>
                </TouchableOpacity>
            );
        }
    }

    const textBackgroundColor = editing ? { backgroundColor: theme.primary.default } : null;

    return (
        <View style={styles.container}>
            <ConfirmModal
                visible={deleteModal}
                message={`Are you sure you want to delete ${word.word}?`}
                handleCancel={() => setDeleteModal(false)}
                handleConfirm={deleteWord}
            />
            <View style={styles.content}>
                <Text style={[styles.word, { color: theme.primary.text }]}>{word.word}</Text>
                <Text style={[textStyles.api, { color: theme.primary.text }]}>{API.name.replace(/-/g, ' ')}</Text>
                <KeyboardAvoidingView style={[textBackgroundColor, styles.definitionInput]}>
                    <TextInput
                        style={[styles.definition, { color: theme.primary.text, marginLeft: editing ? 0 : -10 }]}
                        multiline
                        onChangeText={(text) => setDefinition(text)}
                        value={definition}
                        editable={editing}
                    />
                </KeyboardAvoidingView>
            </View>
            <View style={styles.actions}>
                {renderEditButton()}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#fa5a5a" }]}
                    onPress={() => setDeleteModal(true)}
                >
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
        display: "flex",
    },
    word: {
        fontSize: 36,
        fontWeight: "bold"
    },
    definitionInput: {
        flexGrow: 1,
        marginTop: 10,
        marginBottom: 20,
    },
    definition: {
        fontSize: 20,
        padding: 10,
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
