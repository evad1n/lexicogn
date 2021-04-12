import { useTypedSelector } from '_store/hooks';
import { Ionicons } from '@expo/vector-icons';
import React, { createRef, useEffect, useImperativeHandle, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { changeTheme } from '@/src/store/actions/themeActions';

interface SearchRef {
    focusSearchBar(): void;
}

const SearchBar = React.forwardRef<SearchRef, any>(({ autoFocus, editable, placeholder, onChange, onSubmit, style }, ref) => {
    const theme = useTypedSelector(state => state.theme);

    const [searchText, setSearchText] = useState("");

    const input: any = createRef();

    const focusSearchBar = () => {
        input.current.focus();
    };

    const clear = () => {
        setSearchText("");
    };

    useEffect(() => {
        if (editable)
            onChange(searchText);
    }, [searchText]);

    useImperativeHandle(ref, () => ({ focusSearchBar }));

    return (
        <View style={[{ backgroundColor: theme.primary.default, shadowColor: "red" }, styles.container, style]}>
            <Ionicons name="md-search" size={20} style={styles.icon} color={theme.primary.text} />
            <TextInput
                autoFocus={autoFocus}
                editable={editable}
                ref={input}
                value={searchText}
                style={[styles.text, { color: theme.primary.text }, searchText.length === 0 ? styles.placeholder : null]}
                placeholderTextColor={theme.primary.text}
                placeholder={placeholder}
                onChangeText={text => setSearchText(text)}
                onSubmitEditing={() => onSubmit(searchText)}
                returnKeyType="search"
                keyboardAppearance={theme.dark ? 'dark' : 'light'}
            />
            {searchText.length > 0 && <Ionicons onPress={clear} name="close-circle" size={26} color={theme.primary.text} />}
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