import Flashcard from '@/src/components/Flashcard';
import React, { useRef, useState } from 'react';
import { Animated, Button, PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useCurrentTheme, useWords } from '_store/hooks';
import { StudyRouteProps } from './StudyRoutes';

const NO_WORDS: WordDefinition = {
    word: "You've got nothing to study!",
    definition: "Did you expect something witty here?"
};

const THRESHOLD = 200;

export default function Study({ navigation }: StudyRouteProps<'Study'>) {
    const words = useWords();
    const theme = useCurrentTheme();
    const { width, height } = useWindowDimensions();

    const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);



    function newCard() {
        pan.setValue({ x: width, y: 0 });
        // Get new word
        randomWord();
        Animated.spring(
            pan, // Auto-multiplexed
            {
                toValue: { x: 0, y: 0 },
                useNativeDriver: true
            }, // Back to zero
        ).start();
    }

    function randomWord() {
        let r = Math.floor(Math.random() * words.length);

        setWord(words[r]);
    }

    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (e, gestureState) => {
            return (Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2) >= THRESHOLD);
        },
        onPanResponderMove: (e, gestureState) => {
            // console.log(gestureState);
            Animated.event(
                [
                    null,
                    { dx: pan.x, dy: pan.y }
                ],
                {
                    useNativeDriver: false,
                },
            )(e, gestureState);
        },
        onPanResponderRelease: (e, gestureState) => {
            if (gestureState.moveY < height * 0.2) {
                // UP
                Animated.timing(
                    pan, // Auto-multiplexed
                    {
                        duration: 200,
                        toValue: { x: 0, y: -height },
                        useNativeDriver: true
                    }, // Back to zero
                ).start(newCard);
            } else if (gestureState.moveY > height * 0.9) {
                // DOWN
                Animated.timing(
                    pan, // Auto-multiplexed
                    {
                        duration: 200,
                        toValue: { x: 0, y: height },
                        useNativeDriver: true
                    }, // Back to zero
                ).start(newCard);
            } else {
                Animated.spring(
                    pan, // Auto-multiplexed
                    {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: true
                    }, // Back to zero
                ).start();
            }
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[styles.cardWrapper, pan.getTranslateTransform()]}
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
        // Extra touch area
        padding: 5,
    },
    noWords: {
        fontSize: 20
    }
});
