import { changeTheme } from '_store/actions/themeActions';
import Themes from '@/src/store/theme/themes';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/src/store/selector';



export default function ThemePicker() {
    const currentTheme = useTypedSelector(state => state.theme);
    const dispatch = useDispatch();

    const renderPalette = ({ item: themeName }: { item: string; }) => {
        const theme = Themes[themeName];

        return (
            <TouchableOpacity onPress={() => dispatch(changeTheme(themeName))} style={styles.item}>
                <View style={[styles.color, { backgroundColor: theme.primary.default }]}>
                </View>
                <Text style={styles.colorTitle}>{themeName}</Text>
            </TouchableOpacity>
        );
    };

    const colorOptions = Object.keys(Themes);

    return (
        <FlatList
            contentContainerStyle={styles.container}
            data={colorOptions}
            renderItem={renderPalette}
            keyExtractor={(item) => item}
            horizontal={true}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    item: {
        paddingHorizontal: 10,
        paddingVertical: 20
    },
    color: {
        height: 60,
        width: 60,
        borderRadius: 100,
        margin: 5
    },
    colorTitle: {
        fontSize: 24,
        textAlign: "center",
        textTransform: 'capitalize'
    }
});
