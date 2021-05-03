import ConfirmModal from '@/src/components/widgets/ConfirmModal';
import SearchBar from '@/src/components/widgets/SearchBar';
import Spinner from '@/src/components/widgets/Spinner';
import buttonStyles from '@/src/styles/button';
import textStyles from '@/src/styles/text';
import { useFocusEffect } from '@react-navigation/core';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { BackHandler, Dimensions, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { deleteWord as deleteWordDB, getWord, updateDefinition as updateDefinitionDB } from '_db/db';
import { useCurrentTheme } from '_hooks/theme_provider';
import APIS from '~/api';
import { CollectionRouteProps } from './CollectionRoutes';


export default function Detail({ route, navigation }: CollectionRouteProps<'Detail'>) {
    const theme = useCurrentTheme();

    const { id, search } = route.params;

    const [deleteModal, setDeleteModal] = useState(false);

    const [word, setWord] = useState<WordDocument>(undefined!);
    const [definition, setDefinition] = useState<string>(undefined!);
    const [editing, setEditing] = useState(false);

    // Word data
    useFocusEffect(
        useCallback(
            () => {
                async function loadWord() {
                    try {
                        let word = await getWord(id);
                        setDefinition(word.definition);
                        setWord(word);
                    } catch (error) {
                        throw Error(error);
                    }
                }
                loadWord();
            },
            [],
        )
    );

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
                    style={{ backgroundColor: theme.palette.secondary }}
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
                    setDefinition(word.definition);
                    return true;
                } else {
                    return false;
                }
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
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
            setWord(word => ({ ...word, definition, api: newAPI }));
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
                    style={[buttonStyles.container, { backgroundColor: theme.palette.primary }]}
                    onPress={startEditing}
                >
                    <Text style={[buttonStyles.text, { color: theme.palette.primaryText }]}>Edit</Text>
                </TouchableOpacity>
            );
        }
    }

    const { width } = Dimensions.get("window");
    const editingTextBackgroundColor = { backgroundColor: editing ? theme.palette.primary : theme.palette.secondary };
    const editingTextColor = {
        color: editing ? theme.palette.primaryText : theme.palette.secondaryText,
        marginLeft: editing ? 0 : -10
    };

    const renderRatio = useCallback(
        () => {
            const total = word.correct + word.incorrect;
            const percent = 100 * (word.correct / total);
            return (
                <Text style={[styles.ratio, { color: theme.palette.secondaryText }]}>
                    {word.correct}/{total}
                    {"\n"}
                    {total > 0 ? `${percent.toFixed(0)}%` : "0%"}
                </Text>
            );
        },
        [word],
    );

    // Definition or image
    function renderDefinition() {
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
                            placeholderTextColor={theme.palette.primaryText}
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
                            source={{ uri: word.definition !== "" ? word.definition : "__" }}
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

    function renderContent() {
        if (!word) {
            return (
                <Spinner />
            );
        } else {
            return (
                <ScrollView contentContainerStyle={styles.container}>
                    <ConfirmModal
                        visible={deleteModal}
                        message={`Are you sure you want to delete ${word.word}?`}
                        handleCancel={() => setDeleteModal(false)}
                        handleConfirm={deleteWord}
                    />
                    <View style={styles.content}>
                        {renderRatio()}
                        <Text style={[styles.word, { color: theme.palette.secondaryText }]}>{word.word}</Text>
                        <Text style={[textStyles.api, { color: theme.palette.secondaryText }]}>{APIS[word.api].name.replace(/-/g, ' ')}</Text>
                        {renderDefinition()}
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
            );
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {renderContent()}
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
        textAlign: "right",
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
