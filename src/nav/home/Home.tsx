import Flashcard from '@/src/components/Flashcard';
import SearchBar from '@/src/components/widgets/SearchBar';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCurrentTheme, useHomeWord } from '_store/hooks';
import { RouteNavProps } from '../DrawerRoutes';
import { HomeRouteProps } from './HomeRoutes';

// No words card
const NO_WORDS: Partial<WordDocument> = {
    word: "A random word!",
    definition: "At least it would be if you had any saved words...",
};

export default function Home({ navigation }: RouteNavProps<'Home'> & HomeRouteProps<'home'>) {
    const theme = useCurrentTheme();
    const homeWord = useHomeWord();

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: theme.primary.lightText }]}>LEXICOGN</Text>
            </View>
            <SearchBar
                style={[styles.searchBar, { backgroundColor: theme.primary.dark }]}
                textColor={theme.primary.darkText}
                editable={false}
                placeholder="Look up a word..."
                blockEvent={() => {
                    navigation.navigate('Search');
                }}
            />
            <View style={styles.cardContainer}>
                <Flashcard word={homeWord || NO_WORDS} change={false} />
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
        width: '85%',
        paddingVertical: 10,
    },
    cardContainer: {
        marginTop: "10%",
        width: "100%",
        padding: 30,
    }
});