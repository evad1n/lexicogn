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
        <View style={[{ backgroundColor: theme.primary.default, shadowColor: "red" }, styles.container, styles.shadow, props.style]}>
            <Ionicons name="md-search" size={20} style={styles.icon} color={theme.primary.text} />
            <TextInput
                editable={props.editable}
                ref={input}
                style={[styles.text, searchText.length === 0 ? styles.placeholder : null]}
                placeholderTextColor={theme.primary.text}
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
        elevation: 6,
    },
    text: {
        fontSize: 20,
        flex: 1,
    },
    icon: {
        paddingRight: 10
    },
    placeholder: {
        opacity: 0.5
    }
});

export default SearchBar;