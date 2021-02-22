import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchBar(props: any) {
    const [searchText, setSearchText] = useState("");

    return (
        <View style={[styles.container, styles.shadow]}>
            <Ionicons name="md-search" size={20} style={styles.icon} />
            <TextInput
                {...props}
                style={[props.style, styles.text]}
                placeholder={props.placeholder}
                onChangeText={text => { setSearchText(text); props.change(text); }}
                onSubmitEditing={() => props.search(searchText)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: "center",
        backgroundColor: "#eee",
        borderRadius: 3,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 6,
    },
    text: {
        fontSize: 20,
        color: "#f00"
    },
    icon: {
        paddingRight: 10
    }
});
