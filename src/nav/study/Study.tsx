import Flashcard from '@/src/components/Flashcard';
import React, { useRef, useState } from 'react';
import { Animated, Button, PanResponder, StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useCurrentTheme, useWords } from '_store/hooks';
import { StudyRouteProps } from './StudyRoutes';

const noWords: WordDefinition = {
    word: "You've got nothing to study!",
    definition: "Did you expect something witty here?"
};


export default function Study({ navigation }: StudyRouteProps<'Study'>) {
    const words = useWords();
    const theme = useCurrentTheme();

    const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);



    function randomWord() {
        let r = Math.floor(Math.random() * words.length);

        setWord(words[r]);
    }

    let pos = new Animated.ValueXY();

    const pan = useRef(new Animated.ValueXY()).current;

    // TODO: idk the thresholds to use for tap/move
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (e, gestureState) => {
            return Math.abs(gestureState.dx) >= 1 || Math.abs(gestureState.dy) >= 1;
        },
        onPanResponderMove: Animated.event([
            null,
            {
                dx: pan.x, // x,y are Animated.Value
                dy: pan.y,
            },
        ], { useNativeDriver: false }),
        onPanResponderRelease: () => {
            Animated.spring(
                pan, // Auto-multiplexed
                {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true
                }, // Back to zero'
            ).start();
        },
    });

    return (
        <View style={styles.container}>
            <PanGestureHandler >
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[styles.cardContainer, pan.getTranslateTransform()]}
                >
                    <Flashcard word={word || noWords} />
                </Animated.View>
            </PanGestureHandler >
            <View
                style={[{ backgroundColor: "red" }]}
            >
                <Button onPress={randomWord} title="Random" />
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
        padding: 30,
    },
    noWords: {
        fontSize: 20
    }
});
