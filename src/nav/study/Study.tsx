import Flashcard from '@/src/components/Flashcard';
import { useTypedSelector } from '@/src/store/hooks';
import React, { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { add, concat, useValue } from 'react-native-reanimated';
import { StudyRouteProps } from './StudyRoutes';


export default function Study({ navigation }: StudyRouteProps<'Study'>) {
    const words = useTypedSelector(state => state.words);

    const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);

    function randomWord() {
        let r = Math.floor(Math.random() * words.length);

        setWord(words[r]);
    }

    let animatedValue = useValue(0);

    const handleGesture = Animated.event(
        [{ nativeEvent: { absoluteY: animatedValue } }],
        { useNativeDriver: true }
    );

    const flashcardTransform = {
        transform: [
            { translateY: add(animatedValue, -100) },
            // { rotateY: concat(animatedValue, "deg") }
        ]
    };

    function FUCK(event: PanGestureHandlerGestureEvent) {
        // event.nativeEvent.
    }

    return (
        <PanGestureHandler onGestureEvent={handleGesture}>
            <Animated.View style={[flashcardTransform, styles.container]}>
                <Animated.View style={[styles.cardContainer, flashcardTransform]}>
                    <Flashcard word={word} />
                </Animated.View>
                <View
                    style={[{ backgroundColor: "red" }]}
                >
                    <Button onPress={randomWord} title="Random" />
                </View>
            </Animated.View>
        </PanGestureHandler>
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
    }
});
