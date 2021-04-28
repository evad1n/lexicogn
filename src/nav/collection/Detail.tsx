import ConfirmModal from '@/src/components/widgets/ConfirmModal';
import SearchBar from '@/src/components/widgets/SearchBar';
import wordsReducer from '@/src/store/reducers/wordsReducer';
import buttonStyles from '@/src/styles/button';
import textStyles from '@/src/styles/text';
import { useFocusEffect } from '@react-navigation/core';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { BackHandler, Dimensions, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { deleteWord as deleteWordDB, updateDefinition as updateDefinitionDB } from '_db/db';
import { useCurrentTheme, useTypedDispatch } from '_store/hooks';
import APIS from '~/api';
import { CollectionRouteProps } from './CollectionRoutes';


export default function Detail({ route, navigation }: CollectionRouteProps<'Detail'>) {
    const theme = useCurrentTheme();
    const dispatch = useTypedDispatch();

    const { word, search } = route.params;
    const API = APIS[word.api];

    const [deleteModal, setDeleteModal] = useState(false);

    const [definition, setDefinition] = useState(word.definition);
    const [editing, setEditing] = useState(false);

    // Header search bar
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <SearchBar
                    blockEvent={() => navigation.navigate('Collection', {
                        focus: true,
                        search: search ?? ""
                    })}
                    value={search ?? ""}
                    editable={false}
                    placeholder="Search the collection..."
                    style={{ backgroundColor: theme.primary.light }}
                />
            ),
            headerTitleContainerStyle: {
                left: 60,
            },
        });
    }, [navigation, theme]);

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

    function startEditing() {
        if (word.api === 1)
            setDefinition("");
        setEditing(true);
    }

    const deleteWord = async () => {
        try {
            setDeleteModal(false);
            await deleteWordDB(word.id);
            dispatch({
                type: 'DELETE_WORD',
                id: word.id
            });
            navigation.navigate('Collection');
        } catch (error) {
            throw Error(error);
        }
    };

    const updateWord = async () => {
        try {
            let newAPI = word.api;
            // Preserve images as images, otherwise change to custom
            if (word.api !== 1) {
                newAPI = 0;
            }
            await updateDefinitionDB(definition, newAPI, word.id);
            dispatch({
                type: 'UPDATE_WORD',
                word: { ...word, definition, api: newAPI }
            });
            // Update local word
            navigation.setParams({
                word: { ...word, definition, api: newAPI }
            });
            setEditing(false);
        } catch (error) {
            throw Error(error);
        }
    };

    function renderEditButton() {
        if (editing) {
            return (
                <TouchableOpacity
                    style={[buttonStyles.container, { backgroundColor: "#0bb03c" }]}
                    onPress={updateWord}
                >
                    <Text style={[buttonStyles.text, { color: "black" }]}>Save</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    style={[buttonStyles.container, { backgroundColor: theme.primary.dark }]}
                    onPress={startEditing}
                >
                    <Text style={[buttonStyles.text, { color: theme.primary.darkText }]}>Edit</Text>
                </TouchableOpacity>
            );
        }
    }

    const { width } = Dimensions.get("window");
    const editingTextBackgroundColor = { backgroundColor: editing ? theme.primary.dark : theme.primary.light };
    const editingTextColor = {
        color: editing ? theme.primary.darkText : theme.primary.lightText,
        marginLeft: editing ? 0 : -10
    };

    const renderRatio = useCallback(
        () => {
            const total = word.correct + word.incorrect;
            const percent = 100 * (word.correct / total);
            return (
                <Text style={[styles.ratio, { color: theme.primary.lightText }]}>
                    {word.correct}/{total}
                    {"\n"}
                    {total > 0 ? `${percent.toFixed(0)}%` : "0%"}
                </Text>
            );
        },
        [word],
    );

    // Definition or image
    function renderContent() {
        if (word.api === 1) {
            if (editing) {
                return (
                    <KeyboardAvoidingView
                        style={[editingTextBackgroundColor, styles.urlInput]}
                        behavior="height"
                    >
                        <TextInput
                            placeholder="Enter a new URL..."
                            value={definition}
                            onChangeText={(text) => setDefinition(text)}
                            style={[styles.definition, editingTextColor, definition.length === 0 ? textStyles.placeholder : null]}
                            placeholderTextColor={theme.primary.darkText}
                            editable={editing}
                        />
                    </KeyboardAvoidingView>
                );
            } else {
                return (
                    <View style={styles.imageContainer}>
                        <Image
                            resizeMode="contain"
                            style={{
                                width: 0.9 * width,
                                height: 0.9 * width
                            }}
                            source={{ uri: word.definition }}
                            // NOTE: this won't show up on android develpoment
                            // https://reactnative.dev/docs/image#defaultsource
                            defaultSource={require('_assets/no-image.png')}
                        />
                    </View>
                );
            }
        } else {
            return (
                <KeyboardAvoidingView
                    style={[editingTextBackgroundColor, styles.definitionInput]}
                    behavior="height"
                >
                    <TextInput
                        style={[styles.definition, editingTextColor]}
                        multiline
                        onChangeText={(text) => setDefinition(text)}
                        value={definition}
                        editable={editing}
                    />
                </KeyboardAvoidingView>
            );
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <ConfirmModal
                    visible={deleteModal}
                    message={`Are you sure you want to delete ${word.word}?`}
                    handleCancel={() => setDeleteModal(false)}
                    handleConfirm={deleteWord}
                />
                <View style={styles.content}>
                    {renderRatio()}
                    <Text style={[styles.word, { color: theme.primary.lightText }]}>{word.word}</Text>
                    <Text style={[textStyles.api, { color: theme.primary.lightText }]}>{API.name.replace(/-/g, ' ')}</Text>
                    {renderContent()}
                </View>
                <View style={styles.actions}>
                    {renderEditButton()}
                    <TouchableOpacity
                        style={[buttonStyles.container, { backgroundColor: "#fa5a5a" }]}
                        onPress={() => setDeleteModal(true)}
                    >
                        <Text style={[buttonStyles.text, { color: "black" }]}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    imageContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    word: {
        fontSize: 36,
        fontWeight: "bold"
    },
    ratio: {
        position: "absolute",
        top: 10,
        right: 0,
        textAlign: "center",
        fontSize: 20,
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
    urlInput: {
        marginTop: 10,
        marginBottom: 20,
    },
    actions: {
        marginBottom: 5
    },
});
