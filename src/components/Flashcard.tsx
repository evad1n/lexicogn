import { useFocusEffect } from '@react-navigation/core';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useCurrentTheme } from '_hooks/theme_provider';


// ELEVATION TRANSITION CONSTANTS
const MAX_ELEVATION = 40;
const DEFAULT_ELEVATION = 5;
const ELEVATION_TIME = 100;
// FLIP TRANSITION CONSTANTS
const FLIP_FRICTION = 10;
const FLIP_TENSION = 10;
const FLIP_SPEED_THRESHOLD = 50;
const FLIP_DISPLACEMENT_THRESHOLD = 30;

interface FlashcardProps {
    word: Partial<WordDocument>;
}

export default function Flashcard({ word }: FlashcardProps) {
    const theme = useCurrentTheme();

    const flipValue = useRef(new Animated.Value(0)).current;
    const elevation = useRef(new Animated.Value(DEFAULT_ELEVATION)).current;

    // useFocusEffect(() => {
    //     flipValue.setValue(0);
    // });

    useEffect(() => {
        flipValue.setValue(0);

    }, [word]);

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
        ],
        elevation
    };
    const backAnimatedStyle = {
        transform: [
            { rotateX: backInterpolate },
            { perspective: 1000 }
        ],
        elevation
    };

    function flipCard() {
        if (currentFlipValue >= 90) {
            Animated.sequence(
                [
                    Animated.timing(elevation, {
                        toValue: MAX_ELEVATION,
                        duration: ELEVATION_TIME,
                        useNativeDriver: true
                    }),
                    Animated.spring(flipValue, {
                        toValue: 0,
                        friction: FLIP_FRICTION,
                        tension: FLIP_TENSION,
                        restSpeedThreshold: FLIP_SPEED_THRESHOLD, restDisplacementThreshold: FLIP_DISPLACEMENT_THRESHOLD,
                        useNativeDriver: true
                    }),
                    Animated.timing(elevation, {
                        toValue: DEFAULT_ELEVATION,
                        duration: ELEVATION_TIME,
                        useNativeDriver: true
                    }),
                ]
            ).start();
        } else {
            Animated.sequence(
                [
                    Animated.timing(elevation, {
                        toValue: MAX_ELEVATION,
                        duration: ELEVATION_TIME,
                        useNativeDriver: true
                    }),
                    Animated.spring(flipValue, {
                        toValue: 180,
                        friction: FLIP_FRICTION,
                        tension: FLIP_TENSION,
                        restSpeedThreshold: FLIP_SPEED_THRESHOLD, restDisplacementThreshold: FLIP_DISPLACEMENT_THRESHOLD,
                        useNativeDriver: true
                    }),
                    Animated.timing(elevation, {
                        toValue: DEFAULT_ELEVATION,
                        duration: ELEVATION_TIME,
                        useNativeDriver: true
                    }),
                ]
            ).start();
        }
    }

    function renderBack() {
        // Image
        if (word.api == 1) {
            return (
                <View style={styles.imageContainer}>
                    <Image
                        resizeMode="contain"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                        source={{ uri: word.definition !== "" ? word.definition : "__" }}
                        // NOTE: this won't show up on android develpoment
                        // https://reactnative.dev/docs/image#defaultsource
                        defaultSource={require('_assets/no-image.png')}
                    />
                </View>
            );
        } else {
            return (
                <Text adjustsFontSizeToFit style={[{ color: theme.palette.primaryText }, styles.text]}>{word.definition}</Text>
            );
        }
    }

    const cardStyle = useMemo(() => ({
        backgroundColor: theme.palette.primary,
    }), [theme]);


    return (
        <TouchableWithoutFeedback onPress={flipCard} style={styles.container}>
            <View>
                <Animated.View style={[frontAnimatedStyle, cardStyle, styles.flipCard]}>
                    <Text adjustsFontSizeToFit style={[{ color: theme.palette.primaryText }, styles.text]}>{word.word}</Text>
                </Animated.View>
                <Animated.View style={[backAnimatedStyle, cardStyle, styles.back, styles.flipCard]}>
                    {renderBack()}
                </Animated.View>
            </View>
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
        borderRadius: 3,
    },
    back: {
        position: "absolute",
        top: 0,
    },
    text: {
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold",
        textAlignVertical: 'bottom',
    },
    imageContainer: {
        width: "100%",
        height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
