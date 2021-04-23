import Flashcard from '@/src/components/Flashcard';
import SearchBar from '@/src/components/widgets/SearchBar';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCurrentTheme, useHomeWord } from '_store/hooks';
import { RouteNavProps } from '../DrawerRoutes';
import { HomeRouteProps } from './HomeRoutes';

// No words card
const noWord: WordDefinition = {
    word: "A random word!",
    definition: "At least it would be if you had any saved words..."
};

export default function Home({ navigation }: RouteNavProps<'Home'> & HomeRouteProps<'home'>) {
    const theme = useCurrentTheme();
    const homeWord = useHomeWord();

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: theme.primary.text }]}>LEXICOGN</Text>
            </View>
            <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Search')}>
                <SearchBar
                    style={styles.searchBar}
                    editable={false}
                    placeholder="Look up a word..."
                />
            </TouchableOpacity>
            <View style={styles.cardContainer}>
                <Flashcard word={homeWord || noWord} />
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