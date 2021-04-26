import { useSearchInput } from '@/src/hooks/search_input';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, TextInput, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useCurrentTheme } from '_store/hooks';

interface SearchBarProps {
    placeholder: string,
    autoFocus?: boolean,
    editable?: boolean,
    value?: string;
    onChange?: (text: string) => void,
    onSubmit?: () => void,
    onClear?: () => void,
    style?: StyleProp<ViewStyle>;
}

export default function SearchBar({ style, autoFocus = false, editable = true, placeholder, value = "", onChange, onSubmit, onClear, }: SearchBarProps) {
    const theme = useCurrentTheme();
    const { inputRef, focus } = useSearchInput();

    return (
        <TouchableOpacity
            onPress={focus}
            activeOpacity={1}
            containerStyle={[style]}
            style={[styles.container, { backgroundColor: theme.primary.default }, style]}
        >
            <Ionicons name="md-search" size={20} style={styles.icon} color={theme.primary.text} />
            <TextInput
                autoFocus={autoFocus}
                editable={editable}
                ref={inputRef}
                value={value}
                style={[styles.text, { color: theme.primary.text }, value.length === 0 ? styles.placeholder : null]}
                placeholderTextColor={theme.primary.text}
                placeholder={placeholder}
                onChangeText={onChange}
                onSubmitEditing={onSubmit}
                returnKeyType="search"
                keyboardAppearance={theme.dark ? 'dark' : 'light'}
            />
            {value.length > 0 && <Ionicons onPress={onClear} name="close" size={26} color={theme.primary.text} />}
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