import Flashcard from '@/src/components/Flashcard';
import React, { useRef, useState } from 'react';
import { Animated, Button, PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useCurrentTheme, useWords } from '_store/hooks';
import { StudyRouteProps } from './StudyRoutes';

const NO_WORDS: WordDefinition = {
    word: "You've got nothing to study!",
    definition: "Did you expect something witty here?"
};

// Differentiatae between tap/swipe
const SWIPE_THRESHOLD = 200;
// Time for new card animation
const NEW_CARD_DURATION = 200;

export default function Study({ navigation }: StudyRouteProps<'Study'>) {
    const words = useWords();
    const theme = useCurrentTheme();
    const { width, height } = useWindowDimensions();

    const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);

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

    function randomWord() {
        let r = Math.floor(Math.random() * words.length);

        setWord(words[r]);
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
            if (gestureState.moveY < height * 0.2) {
                // UP
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
            } else if (gestureState.moveY > height * 0.9) {
                // DOWN
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
                            }, // Back to zero
                        )
                    ]
                ).start(newCard);
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
            -1,
            0,
            1,
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
