import Flashcard from '@/src/components/Flashcard';
import { decreaseFrequency, increaseFrequency } from '@/src/db/db';
import React, { useEffect, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native';
import layoutStyles from '../styles/layout';

const NO_WORDS: Partial<WordDocument> = {
    word: "You've got nothing to study!",
    definition: "Nope, still nothing here",
};

// Differentiatae between tap/swipe
const SWIPE_THRESHOLD = 200;
// Time for new card animation
const NEW_CARD_DURATION = 200;


interface CurrentCardProps {
    word?: WordDocument;
    onNewCard: () => void;
}

export default function CurrentStudyCard({ word, onNewCard }: CurrentCardProps) {
    const { width, height } = useWindowDimensions();

    // Slide in from right
    useEffect(() => {
        animateCard();
    }, [word]);

    function animateCard() {
        // Move card off screen to the right
        pan.setValue({ x: width, y: 0 });
        Animated.spring(
            pan, // Auto-multiplexed
            {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false
            }, // Back to zero
        ).start();
    }

    function newCard() {
        onNewCard();
    }

    function swipeUp() {
        decreaseFrequency(word!.id);
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
        increaseFrequency(word!.id);
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
            return true;
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


    return (
        <View style={[layoutStyles.center, { width: width }]}>
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
