import { changeTheme } from '_store/actions/themeActions';
import Themes from '@/src/store/theme/themes';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '@/src/store/selector';
import Divider from '@/src/components/layout/Divider';



export default function ThemePicker() {
    const currentTheme = useTypedSelector(state => state.theme);
    const dispatch = useDispatch();

    const renderPalette = ({ item: themeName }: { item: string; }) => {
        const theme = Themes[themeName];

        return (
            <TouchableOpacity onPress={() => dispatch(changeTheme(themeName))} style={styles.item}>
                <View style={[styles.color, { backgroundColor: theme.primary.default, borderColor: theme.primary.text, borderWidth: 2 }]}>
                </View>
                <Text style={[styles.colorTitle, { color: currentTheme.primary.text }]}>{themeName}</Text>
            </TouchableOpacity>
        );
    };

    const colorOptions = Object.keys(Themes);

    return (
        <View>
            <View style={styles.currentTheme}>
                <Text style={[styles.currentTitle, { color: currentTheme.primary.text }]}>Current Theme</Text>
                <View style={[styles.color, { backgroundColor: currentTheme.primary.default, borderColor: currentTheme.primary.text, borderWidth: 2 }]}>
                </View>
                <Text style={[styles.colorTitle, { color: currentTheme.primary.text }]}>{currentTheme.name}</Text>
            </View>
            <Divider />
            <FlatList
                contentContainerStyle={styles.container}
                data={colorOptions}
                renderItem={renderPalette}
                keyExtractor={(item) => item}
                horizontal={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    currentTheme: {
        justifyContent: "center",
        marginBottom: 20
    },
    currentTitle: {
        paddingVertical: 5,
        fontSize: 30,
        textAlign: "center"
    },
    item: {
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    color: {
        alignSelf: "center",
        height: 60,
        width: 60,
        borderRadius: 100,
        margin: 5
    },
    colorTitle: {
        fontSize: 24,
        textAlign: "center",
        textTransform: 'capitalize'
    },
    selected: {
        borderWidth: 3,
        borderColor: "red",
    }
});
