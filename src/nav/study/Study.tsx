import CurrentStudyCard from '@/src/components/CurrentStudyCard';
import Flashcard from '@/src/components/Flashcard';
import { getAllWords } from '@/src/db/db';
import layoutStyles from '@/src/styles/layout';
import { getWordWeight } from '@/src/weighting';
import { useFocusEffect } from '@react-navigation/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ListRenderItemInfo, StyleSheet, useWindowDimensions, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { StudyRouteProps } from './StudyRoutes';

const NO_WORDS: Partial<WordDocument> = {
    word: "You've got nothing to study!",
    definition: "Did you expect something witty here?",
};

// Max number of words in history, including current
const MAX_HISTORY = 10;

export default function Study({ navigation }: StudyRouteProps<'Study'>) {
    const { width, height } = useWindowDimensions();

    const [words, setWords] = useState<WordDocument[]>(undefined!);
    const [weightSum, setWeightSum] = useState(0);
    const [history, setHistory] = useState<WordDocument[]>([]);
    const [transitioning, setTransitioning] = useState(false);

    const listRef = useRef<FlatList<WordDocument>>(null);

    // Reload words on focus
    useFocusEffect(
        useCallback(
            () => {
                async function loadWords() {
                    try {
                        let loadedWords = await getAllWords();
                        setWords(loadedWords);
                    } catch (error) {
                        throw Error(error);
                    }
                }
                setWords(undefined!);
                loadWords();
            },
            [],
        )
    );

    // Adds to history in most recent unique order
    function addToHistory(word: WordDocument) {
        setHistory(history => {
            let newHistory = history;
            const dupIdx = history.findIndex(el => el.id === word.id);
            if (dupIdx !== -1) {
                // Remove old duplicate
                newHistory.splice(dupIdx, 1);
            }
            // Add new word
            newHistory = newHistory.concat(word);
            // Truncate if necessary
            if (newHistory.length > MAX_HISTORY) {
                newHistory = newHistory.slice(newHistory.length - MAX_HISTORY);
            }

            return newHistory;
        });
    }

    useEffect(() => {
        if (!words)
            return;
        // Find sum of weights
        let total_weights = 0;
        for (const word of words) {
            total_weights += getWordWeight(word);
        }
        setWeightSum(total_weights);
    }, [words]);

    useEffect(() => {
        if (words && weightSum !== 0)
            randomWord();
    }, [weightSum]);

    function randomWord() {
        // Hide old card to prevent async DOM flickering
        setTransitioning(true);

        let sum = weightSum;
        let r = Math.floor(Math.random() * sum);
        let i;
        for (i = 0; i < words.length; i++) {
            r -= getWordWeight(words[i]);
            if (r <= 0) {
                break;
            }
        }
        let randWord: WordDocument = words[i];

        // Add word to history
        addToHistory(randWord);
    }

    useEffect(() => {
        setTimeout(() => {
            listRef.current!.scrollToEnd({ animated: false });
            setTransitioning(false);
        }, 10);


    }, [history]);

    function renderCard({ index, item }: ListRenderItemInfo<WordDocument>) {
        // Display current card as rightmost
        if (index === history.length - 1) {
            return (
                <CurrentStudyCard
                    word={item}
                    onNewCard={randomWord}
                />
            );
        } else {
            if (index === history.length - 2 && transitioning) {
                return (
                    <View style={[layoutStyles.center, { width: width }]}>

                    </View>
                );
            } else {
                return (
                    <StudyCard word={item} />
                );
            }
        }
    }

    function renderCards() {
        return (
            <FlatList
                ref={listRef}
                style={{
                    width: width
                }}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews={true}
                alwaysBounceHorizontal
                horizontal
                data={history}
                renderItem={renderCard}
                keyExtractor={(item, index) => `${index}-api-${item.api}`}
                getItemLayout={(data, index) => (
                    { length: width, offset: width * index, index }
                )}
                ListEmptyComponent={<CurrentStudyCard
                    onNewCard={randomWord}
                />}
            />
        );
    }

    return (
        <React.Fragment>
            {renderCards()}
        </React.Fragment>
    );
}

interface StudyCardProps {
    word: WordDocument;
}

// Old read-only cards (can't swipe up/down )
function StudyCard({ word }: StudyCardProps) {
    const { width } = useWindowDimensions();

    return (
        <View style={[layoutStyles.center, { width: width }]}>
            <View style={styles.cardContainer}>
                <Flashcard
                    word={word || NO_WORDS}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        width: "100%",
    },
    cardContainer: {
        width: "100%",
        padding: 20,
    },
    cardWrapper: {
        // Extra touch area and border
        padding: 5,
    },
    noWords: {
        fontSize: 20
    }
});
