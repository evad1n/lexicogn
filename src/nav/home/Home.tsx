import SearchBar from '@/src/components/widgets/SearchBar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RouteNavProps } from '../DrawerRoutes';

export default function Home({ navigation }: RouteNavProps<"Home">) {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>LEXICOGN</Text>
            </View>
            <SearchBar
                style={styles.searchBar}
                placeholder="Look up a word"
                onFocus={() => navigation.navigate('Search')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    titleContainer: {
        height: "50%",
        justifyContent: "center"
    },
    title: {
        fontSize: 50,
        // FIX: font family how?
        fontFamily: 'Roboto',
        fontWeight: "bold"
    },
    searchBar: {
        width: '80%',
        padding: 5,
    }
});;

// Have random word from db be shown on startup
