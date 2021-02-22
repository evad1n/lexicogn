import React from 'react';
import { StyleSheet, Text, View, Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function HideKeyboard({ children }: any) {
    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); console.log("KEYBOARD FUCK OFF"); }} accessible={false}>
            {children}
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({});
