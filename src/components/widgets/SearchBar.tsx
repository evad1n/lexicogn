import { useSearchInput } from '_hooks/search_input';
import textStyles from '@/src/styles/text';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/core';
import React, { useRef } from 'react';
import { StyleProp, StyleSheet, TextInput, TouchableOpacity, ViewStyle } from 'react-native';
import { useCurrentTheme } from '_hooks/theme_provider';

interface SearchBarProps {
    placeholder: string,
    autoFocus?: boolean,
    editable?: boolean,
    value?: string;
    /** When editing is false use this for onPress */
    blockEvent?: () => void;
    onChange?: (text: string) => void,
    onSubmit?: () => void,
    onClear?: () => void,
    /** Container style */
    style?: StyleProp<ViewStyle>;
    textColor?: string;
}

export default function SearchBar({ style, textColor, autoFocus = false, editable = true, placeholder, value = "", onChange, onSubmit, onClear, blockEvent }: SearchBarProps) {
    const theme = useCurrentTheme();
    const { inputRef, setRef, focus } = useSearchInput();

    const searchRef: any = useRef();

    textColor = textColor ?? theme.primary.lightText;

    useFocusEffect(
        React.useCallback(() => {
            if (setRef) {
                setRef(searchRef.current);
            }
        }, [searchRef, inputRef])
    );

    return (
        <TouchableOpacity
            onPress={() => {
                if (blockEvent)
                    blockEvent();
                else
                    focus();
            }}
            activeOpacity={1}
            style={[styles.container, { backgroundColor: theme.primary.light }, style]}
        >
            <Ionicons name="md-search" size={20} style={styles.icon} color={textColor} />
            <TextInput
                autoFocus={autoFocus}
                editable={editable}
                ref={searchRef}
                value={value}
                style={[styles.text, { color: textColor }, value.length === 0 ? textStyles.placeholder : null]}
                placeholderTextColor={textColor}
                autoCapitalize='none'
                placeholder={placeholder}
                onChangeText={onChange}
                onSubmitEditing={onSubmit}
                returnKeyType="search"
                keyboardAppearance={theme.dark ? 'dark' : 'light'}
            />
            {value.length > 0 && <Ionicons onPress={onClear} name="close" size={26} color={textColor} />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: "center",
        borderRadius: 3,
        paddingVertical: 5,
        paddingHorizontal: 10,
        elevation: 5,
    },
    text: {
        fontSize: 20,
        flex: 1,
    },
    icon: {
        paddingRight: 10
    },
});