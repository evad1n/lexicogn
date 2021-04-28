import Flashcard from '@/src/components/Flashcard';
import { decreaseFrequency, getAllWords, increaseFrequency } from '@/src/db/db';
import { useCurrentTheme } from '@/src/hooks/theme_provider';
import { getWordWeight } from '@/src/weighting';
import { useFocusEffect } from '@react-navigation/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native';
import { StudyRouteProps } from './StudyRoutes';

const NO_WORDS: Partial<WordDocument> = {
    word: "You've got nothing to study!",
    definition: "Did you expect something witty here?",
};

// Differentiatae between tap/swipe
const SWIPE_THRESHOLD = 200;
// Time for new card animation
const NEW_CARD_DURATION = 200;

export default function Study({ navigation }: StudyRouteProps<'Study'>) {
    const { width, height } = useWindowDimensions();
    const theme = useCurrentTheme();

    const [words, setWords] = useState<WordDocument[]>(undefined!);

    const [word, setWord] = useState<WordDocument>(undefined!);
    const [weightSum, setWeightSum] = useState(0);


    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            // Move card off screen to the right
            pan.setValue({ x: width, y: 0 });
        });

        return unsubscribe;
    }, [navigation]);

    // Load words on focus
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
                loadWords();
            },
            [],
        )
    );

    function newCard() {
        // Move card off screen to the right
        pan.setValue({ x: width, y: 0 });
        // Get new word
        randomWord();
        Animated.spring(
            pan, // Auto-multiplexed
            {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false
            }, // Back to zero
        ).start();
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
        newCard();
    }, [words]);

    function randomWord() {
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

        setWord(randWord);
    }

    function swipeUp() {
        decreaseFrequency(word.id);
        Animated.parallel(
            [
                Animated.timing(
                    pan, // Auto-multiplexed
                    {
                        duration: NEW_CARD_DURATION,
                        toValue: { x: 0, y: -height },
                        useNativeDriver: false
                    }, // Back to zero
                ),
                Animated.timing(
                    border, // Auto-multiplexed
                    {
                        duration: NEW_CARD_DURATION,
                        toValue: 0,
                        useNativeDriver: false
                    }, // Back to zero
                )
            ]
        ).start(newCard);
    }

    function swipeDown() {
        increaseFrequency(word.id);
        Animated.parallel(
            [
                Animated.timing(
                    pan, // Auto-multiplexed
                    {
                        duration: NEW_CARD_DURATION,
                        toValue: { x: 0, y: height },
                        useNativeDriver: false
                    }, // Back to zero
                ),
                Animated.timing(
                    border, // Auto-multiplexed
                    {
                        duration: NEW_CARD_DURATION,
                        toValue: 0,
                        useNativeDriver: false
                    }, // Back to zeros
                )
            ]
        ).start(newCard);
    }

    function swipeThreshold(dy: number, vy: number): boolean {
        if ((dy + (200 * vy)) > height * 0.25) {
            return true;
        }
        return false;
    }


    // Animation
    const pan = useRef(new Animated.ValueXY()).current;
    // Borders
    const border = useRef(new Animated.Value(0)).current;

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (e, gestureState) => {
            return (Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2) >= SWIPE_THRESHOLD);
        },
        onPanResponderMove: (e, gestureState) => {
            // Border function
            word && Animated.event(
                [
                    null,
                    {
                        dy: border,
                    }
                ],
                {
                    useNativeDriver: false,
                },
            )(e, gestureState);
            Animated.event(
                [
                    null,
                    {
                        dx: pan.x,
                        dy: pan.y,
                    }
                ],
                {
                    useNativeDriver: false,
                },
            )(e, gestureState);
        },
        onPanResponderRelease: (e, gestureState) => {
            if (word && swipeThreshold(-gestureState.dy, -gestureState.vy)) {
                // UP
                swipeUp();
            } else if (word && swipeThreshold(gestureState.dy, gestureState.vy)) {
                // DOWN
                swipeDown();
            } else {
                Animated.parallel(
                    [
                        Animated.spring(
                            pan, // Auto-multiplexed
                            {
                                toValue: { x: 0, y: 0 },
                                useNativeDriver: false
                            }, // Back to zero
                        ),
                        Animated.timing(
                            border, // Auto-multiplexed
                            {
                                duration: 200,
                                toValue: 0,
                                useNativeDriver: false
                            }, // Back to zero
                        )
                    ]
                ).start();
            }
        },
    });

    const borderInterpolate = border.interpolate({
        inputRange: [
            -180,
            -30,
            0,
            30,
            180,
        ],
        outputRange: [
            "rgba(25,212,32,1)",
            "rgba(25,212,32,0)",
            "rgba(0,0,0,0)",
            "rgba(255,0,0,0)",
            "rgba(255,0,0,1)",
        ],
        extrapolate: "clamp"
    });

    const borderStyle = {
        backgroundColor: borderInterpolate
    };

    function renderContent() {
        if (!words) {
            return (
                <ActivityIndicator size={"large"} color={theme.primary.lightText} />
            );
        } else {
            return (
                <View style={styles.cardContainer}>
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[styles.cardWrapper, borderStyle, pan.getTranslateTransform()]}
                    >
                        <Flashcard
                            word={word || NO_WORDS}
                        />
                    </Animated.View>
                </View>
            );
        }
    }

    return (
        <View style={styles.container}>
            {renderContent()}
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
