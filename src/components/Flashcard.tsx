import { useFocusEffect } from '@react-navigation/core';
import React, { useEffect } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useCurrentTheme } from '_hooks/theme_provider';


interface FlashcardProps {
    word: Partial<WordDocument>;
}

export default function Flashcard({ word }: FlashcardProps) {
    const theme = useCurrentTheme();

    const flipValue = new Animated.Value(0);

    useFocusEffect(() => {
        flipValue.setValue(0);
    });

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

    function flipCard() {
        if (currentFlipValue >= 90) {
            Animated.spring(flipValue, {
                toValue: 0,
                friction: 8,
                tension: 10,
                useNativeDriver: true
            }).start();
        } else {
            Animated.spring(flipValue, {
                toValue: 180,
                friction: 8,
                tension: 10,
                useNativeDriver: true
            }).start();
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
                        source={{ uri: word.definition }}
                        // NOTE: this won't show up on android develpoment
                        // https://reactnative.dev/docs/image#defaultsource
                        defaultSource={require('_assets/no-image.png')}
                    />
                </View>
            );
        } else {
            return (
                <Text adjustsFontSizeToFit style={[{ color: theme.primary.darkText }, styles.text]}>{word.definition}</Text>
            );
        }
    }


    return (
        <TouchableWithoutFeedback onPress={flipCard} style={styles.container}>
            <View>
                <Animated.View style={[frontAnimatedStyle, { backgroundColor: theme.primary.dark }, styles.flipCard]}>
                    <Text adjustsFontSizeToFit style={[{ color: theme.primary.darkText }, styles.text]}>{word.word}</Text>
                </Animated.View>
                <Animated.View style={[backAnimatedStyle, { backgroundColor: theme.primary.dark }, styles.back, styles.flipCard]}>
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
