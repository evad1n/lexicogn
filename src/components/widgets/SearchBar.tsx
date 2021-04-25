import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputSubmitEditingEventData, View } from 'react-native';
import { useCurrentTheme } from '_store/hooks';

interface SearchRef {
    focusSearchBar(): void;
}

interface SearchBarProps {
    autoFocus: boolean,
    editable: boolean,
    placeholder: string,
    value?: string;
    onChange: (text: string) => void,
    onSubmit: () => void,
    onClear: () => void,
    style: any;
}

const SearchBar = React.forwardRef<SearchRef, any>(({ autoFocus = false, editable = true, placeholder, value = "", onChange, onSubmit, onClear, style }: SearchBarProps, ref) => {
    const theme = useCurrentTheme();

    const input: any = useRef();

    const focusSearchBar = () => {
        input.current.focus();
    };

    console.log("focus:", autoFocus);


    useEffect(() => {
        console.log("focus!");
        if (autoFocus)
            input.current.focus();
    }, [autoFocus]);

    useImperativeHandle(ref, () => ({ focusSearchBar }));

    return (
        <View style={[{ backgroundColor: theme.primary.default, shadowColor: "red" }, styles.container, style]}>
            <Ionicons name="md-search" size={20} style={styles.icon} color={theme.primary.text} />
            <TextInput
                autoFocus={autoFocus}
                editable={editable}
                ref={input}
                value={value}
                style={[styles.text, { color: theme.primary.text }, value.length === 0 ? styles.placeholder : null]}
                placeholderTextColor={theme.primary.text}
                placeholder={placeholder}
                onChangeText={onChange}
                onSubmitEditing={onSubmit}
                returnKeyType="search"
                keyboardAppearance={theme.dark ? 'dark' : 'light'}
            />
            {value.length > 0 && <Ionicons onPress={onClear} name="close-circle" size={26} color={theme.primary.text} />}
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