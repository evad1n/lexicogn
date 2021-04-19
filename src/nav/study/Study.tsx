import Flashcard from '@/src/components/Flashcard';
import { useTypedSelector } from '@/src/store/hooks';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerStateChangeEvent, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { StudyRouteProps } from './StudyRoutes';


export default function Study({ navigation }: StudyRouteProps<'Study'>) {
    const words = useTypedSelector(state => state.words);

    const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);

    function randomWord() {
        let r = Math.floor(Math.random() * words.length);

        setWord(words[r]);
    }

    function handleChange(event: PanGestureHandlerGestureEvent) {
        console.log(event);
    }

    return (
        <PanGestureHandler onGestureEvent={handleChange}>
            <View style={styles.container}>
                <Swipeable containerStyle={styles.cardContainer}>
                    <Flashcard word={word} />
                </Swipeable>
                <Swipeable
                    containerStyle={{ backgroundColor: "red" }}
                >
                    <Button onPress={randomWord} title="Random" />
                </Swipeable>
            </View>
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
