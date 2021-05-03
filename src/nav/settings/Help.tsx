import Divider from '@/src/components/layout/Divider';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCurrentTheme } from '_hooks/theme_provider';
import { SettingsRouteProps } from './SettingsRoutes';

const INFO =
    `A mobile app to keep track of and study new vocabulary words`;

const FLASHCARD_HELP =
    `Swipe up to decrease the frequency of a word

Swipe down to increase the frequency of a word

Swipe left to see recently studied words

Swipe right to go the most current word`;

const CONTACT =
    `Bugs or suggestions?
    
Contact me at willdickinson98@gmail.com`;

export default function Help({ navigation }: SettingsRouteProps<'Help'>) {
    const theme = useCurrentTheme();

    const secondaryText = { color: theme.palette.secondaryText };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={[styles.info, secondaryText]}>{INFO}</Text>
                <View>
                    <Text style={[styles.header, secondaryText]}>Flashcard Directions</Text>
                    <Text style={[styles.flashcards, secondaryText]}>{FLASHCARD_HELP}</Text>
                </View>
                <Divider color={theme.palette.secondaryText} />
                <Text style={[styles.flashcards, secondaryText]}>{CONTACT}</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: "space-around",
        padding: 10,
    },
    info: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold"
    },
    header: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 20,
    },
    flashcards: {
        fontSize: 20,
        textAlign: "center"
    }
});
