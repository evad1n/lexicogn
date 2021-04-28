import Flashcard from '@/src/components/Flashcard';
import { decreaseFrequency, increaseFrequency } from '@/src/db/db';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useCurrentTheme, useTypedDispatch, useWords } from '_store/hooks';
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
    const words = useWords();
    const theme = useCurrentTheme();
    const dispatch = useTypedDispatch();
    const { width, height } = useWindowDimensions();

    const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);
    const [change, setChange] = useState(false);
    const [weightSum, setWeightSum] = useState(0);

    // TODO: DIE
    // useEffect(() => {
    //     console.log("nav changed");
    // }, [navigation]);

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
        // Find sum of weights
        let total_weights = 0;
        for (const word of words) {
            total_weights += getWordWeight(word);
        }
        setWeightSum(total_weights);
    }, [word]);

    function getWordWeight(word: WordDocument): number {
        let total = word.correct + word.incorrect;
        if (total === 0) {
            return 1;
        } else {
            let weight = word.correct / (total);
            return 1 - weight;
        }
    }

    function randomWord() {
        let sum = weightSum;
        let randWord: WordDocument;
        let r = Math.floor(Math.random() * sum);
        for (let i = 0; i < words.length; i++) {
            if (r <= 0) {
                randWord = words[i];
                break;
            }
            r -= getWordWeight(words[i]);
        }

        setChange(change => !change);
        setWord(words[r]);
    }

    function swipeUp() {
        decreaseFrequency(word.id);
        dispatch({
            type: 'UPDATE_WORD',
            word: { ...word, correct: word.correct + 1 }
        });
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
        dispatch({
            type: 'UPDATE_WORD',
            word: { ...word, incorrect: word.incorrect + 1 }
        });
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
            Animated.event(
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
            if (swipeThreshold(-gestureState.dy, -gestureState.vy)) {
                // UP
                swipeUp();
            } else if (swipeThreshold(gestureState.dy, gestureState.vy)) {
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

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[styles.cardWrapper, borderStyle, pan.getTranslateTransform()]}
                >
                    <Flashcard
                        word={word || NO_WORDS}
                        change={change}
                    />
                </Animated.View>
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
