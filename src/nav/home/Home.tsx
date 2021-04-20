import SearchBar from '@/src/components/widgets/SearchBar';
import { useTypedSelector } from '_store/hooks';
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteNavProps } from '../DrawerRoutes';
import { HomeRouteProps } from './HomeRoutes';
import Flashcard from '@/src/components/Flashcard';
import { getData } from '@/src/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


// No words card
const noWord: WordDefinition = {
    word: "A random word!",
    definition: "At least it would be if you had any saved words..."
};

// Show random word every time app reloads
let shownWord: WordDefinition;

async function getShownWord() {
    shownWord = await getData("@homeWord");
    await AsyncStorage.removeItem("@homeWord");
}

getShownWord();


export default function Home({ navigation }: RouteNavProps<'Home'> & HomeRouteProps<'home'>) {
    const theme = useTypedSelector(state => state.theme);

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: theme.primary.text }]}>LEXICOGN</Text>
            </View>
            <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Search')}>
                <SearchBar
                    style={styles.searchBar}
                    editable={false}
                    placeholder="Look up a word"
                />
            </TouchableOpacity>
            <View style={styles.cardContainer}>
                <Flashcard word={shownWord || noWord} />
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    titleContainer: {
        justifyContent: "center",
        marginTop: "20%",
        marginBottom: "10%"
    },
    title: {
        fontSize: 50,
        fontWeight: "bold"
    },
    searchBar: {
        width: '80%',
        paddingVertical: 10
    },
    cardContainer: {
        marginTop: "10%",
        width: "100%",
        padding: 30,
    }
});