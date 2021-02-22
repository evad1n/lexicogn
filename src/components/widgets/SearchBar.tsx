import { Ionicons } from '@expo/vector-icons';
import React, { createRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface MyCustomComponentProps {
    title: string;
}

interface MyRef {
    focusSearchBar(): void;
}

const SearchBar = React.forwardRef<MyRef, any>((props, ref) => {
    const [searchText, setSearchText] = useState("");

    const input: any = createRef();

    const focusSearchBar = () => {
        input.current.focus();
    };

    useImperativeHandle(ref, () => ({ focusSearchBar }));

    return (
        <View style={[props.style, styles.container, styles.shadow]}>
            <Ionicons name="md-search" size={20} style={styles.icon} />
            <TextInput
                {...props}
                ref={input}
                style={[props.style, styles.text]}
                placeholder={props.placeholder}
                onChangeText={text => { setSearchText(text); props.change(text); }}
                onSubmitEditing={() => props.search(searchText)}
            />
        </View>
    );
}
);

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
        flex: 1,
    },
    icon: {
        paddingRight: 10
    }
});

export default SearchBar;