import React, { useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useTypedSelector } from '../store/hooks';

export default function Flashcard({ word }: { word: WordDocument; }) {
    const theme = useTypedSelector(state => state.theme);


    const [flipValue, setFlipValue] = useState(new Animated.Value(0));

    let currentFlipValue = 0;
    flipValue.addListener(({ value }) => {
        currentFlipValue = value;
    });

    const frontInterpolate = flipValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg']
    });

    const backInterpolate = flipValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg']
    });

    const frontAnimatedStyle = {
        transform: [
            { rotateX: frontInterpolate },
            { perspective: 1000 }
        ]
    };
    const backAnimatedStyle = {
        transform: [
            { rotateX: backInterpolate },
            { perspective: 1000 }
        ]
    };

    // https://reactnative.dev/docs/animated#timing
    function flipCard() {
        if (currentFlipValue >= 90) {
            Animated.spring(flipValue, {
                toValue: 0,
                friction: 8,
                tension: 10,
                useNativeDriver: false
            }).start();
        } else {
            Animated.spring(flipValue, {
                toValue: 180,
                friction: 8,
                tension: 10,
                useNativeDriver: false
            }).start();
        }
    }


    return (
        <TouchableWithoutFeedback onPress={flipCard} style={styles.container}>
            <Animated.View style={[frontAnimatedStyle, { backgroundColor: theme.primary.default }, styles.flipCard]}>
                <Text adjustsFontSizeToFit style={[{ color: theme.primary.text }, styles.text]}>{word.word}</Text>
            </Animated.View>
            <Animated.View style={[backAnimatedStyle, { backgroundColor: theme.primary.default }, styles.back, styles.flipCard]}>
                <Text adjustsFontSizeToFit style={[{ color: theme.primary.text }, styles.text]}>{word.definition}</Text>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
    },
    flipCard: {
        backfaceVisibility: "hidden",
        width: "100%",
        height: 200,
        padding: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    back: {
        position: "absolute",
        top: 0
    },
    text: {
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold"
    }
});
