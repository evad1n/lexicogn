import { useTypedSelector } from '@/src/store/selector';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StudyRouteProps } from './StudyRoutes';


export default function Study({ navigation }: StudyRouteProps<'study'>) {
    const words = useTypedSelector(state => state.words);
    console.log("words in state:", words);

    return (
        <SafeAreaView style={styles.shit}>
            {words.map((word, index) => (
                <Text>{word.word} hi-- {word.definition}</Text>
            ))}
            <Text>Hello</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    shit: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#cfc",
    }
});
