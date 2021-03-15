import { useTypedSelector } from '@/src/store/selector';
import { Ionicons } from '@expo/vector-icons';
import React, { createRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface SearchRef {
    focusSearchBar(): void;
}

const SearchBar = React.forwardRef<SearchRef, any>((props, ref) => {
    const theme = useTypedSelector(state => state.theme);

    const [searchText, setSearchText] = useState("");

    const input: any = createRef();

    const focusSearchBar = () => {
        input.current.focus();
    };

    useImperativeHandle(ref, () => ({ focusSearchBar }));

    return (
        <View style={[{ backgroundColor: theme.primary.default }, styles.container, styles.shadow, props.style]}>
            <Ionicons name="md-search" size={20} style={styles.icon} />
            <TextInput
                editable={props.editable}
                ref={input}
                style={styles.text}
                placeholder={props.placeholder}
                onChangeText={text => { setSearchText(text); props.change(text); }}
                onSubmitEditing={() => props.search(searchText)}
                returnKeyType="search"
                keyboardAppearance={theme.dark ? 'dark' : 'light'}
            />
        </View>
    );
}
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: "center",
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
        // padding: 5,
        fontSize: 20,
        flex: 1,
    },
    icon: {
        paddingRight: 10
    }
});

export default SearchBar;