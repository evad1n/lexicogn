import Flashcard from '@/src/components/Flashcard';
import SearchBar from '@/src/components/widgets/SearchBar';
import { getAllWords } from '@/src/db/db';
import { getWordWeight } from '@/src/weighting';
import { useFocusEffect } from '@react-navigation/core';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCurrentTheme } from '_hooks/theme_provider';
import { RouteNavProps } from '../DrawerRoutes';
import { HomeRouteProps } from './HomeRoutes';

// No words card
const NO_WORDS: Partial<WordDocument> = {
    word: "Welcome to Lexicogn!",
    definition: "Start searching to start learning!",
};

export default function Home({ navigation }: RouteNavProps<'Home'> & HomeRouteProps<'home'>) {
    const theme = useCurrentTheme();

    const [homeWord, setHomeWord] = useState<WordDefinition | null>(null);
    const [loaded, setLoaded] = useState(false);

    // Get home word with same weighting algorithm
    useFocusEffect(
        useCallback(
            () => {
                async function getHomeWord() {
                    try {
                        let words = await getAllWords();
                        if (words.length === 0) {
                            setHomeWord(null);
                            setLoaded(true);
                            return;
                        }
                        // Find sum of weights
                        let total_weights = 0;
                        for (const word of words) {
                            total_weights += getWordWeight(word);
                        }
                        // Now find a weighted random
                        let r = Math.floor(Math.random() * total_weights);
                        let i;
                        for (i = 0; i < words.length; i++) {
                            r -= getWordWeight(words[i]);
                            if (r <= 0) {
                                break;
                            }
                        }
                        let randWord: WordDocument = words[i];

                        setHomeWord(randWord);
                        setLoaded(true);
                    } catch (error) {
                        throw Error(error);
                    }
                }
                if (!homeWord)
                    getHomeWord();
            },
            [homeWord],
        )
    );

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: theme.palette.secondaryText }]}>LEXICOGN</Text>
            </View>
            <SearchBar
                style={[styles.searchBar, { backgroundColor: theme.palette.primary }]}
                textColor={theme.palette.primaryText}
                editable={false}
                placeholder="Look up a word..."
                blockEvent={() => {
                    navigation.navigate('Search');
                }}
            />
            {loaded && <View style={styles.cardContainer}>
                <Flashcard word={homeWord || NO_WORDS} />
            </View>}
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