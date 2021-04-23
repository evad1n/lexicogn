import Divider from '@/src/components/layout/Divider';
import themeReducer from '@/src/store/reducers/themeReducer';
import buttonStyles from '@/src/styles/button';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { changeTheme } from '_store/actions/themeActions';
import { useCurrentTheme, useCustomTheme, useTypedDispatch } from '_store/hooks';
import Themes from '~/themes';
import { SettingsRouteProps } from './SettingsRoutes';

export default function ThemePicker({ navigation }: SettingsRouteProps<'Theme'>) {
    const currentTheme = useCurrentTheme();
    const customTheme = useCustomTheme();
    const dispatch = useTypedDispatch();

    const renderPalette = ({ item: themeName }: { item: ThemeKey; }) => {
        const theme = Themes[themeName];

        return (
            <TouchableOpacity onPress={() => dispatch(changeTheme(themeName))} style={styles.item}>
                <View style={[styles.color, { backgroundColor: theme.primary.default, borderColor: theme.primary.text, borderWidth: 2 }]}>
                </View>
                <Text style={[styles.colorTitle, { color: currentTheme.primary.text }]}>{themeName}</Text>
            </TouchableOpacity>
        );
    };

    function renderCustomPalette() {
        return (
            <TouchableOpacity onPress={() => dispatch(changeTheme("custom"))} style={styles.item}>
                <View style={[styles.color, { backgroundColor: customTheme.primary.default, borderColor: customTheme.primary.text, borderWidth: 2 }]}>
                </View>
                <Text style={[styles.colorTitle, { color: currentTheme.primary.text }]}>custom</Text>
            </TouchableOpacity>
        );
    };

    const colorOptions: Array<ThemeKey> = (Object.keys(Themes) as (keyof ThemeMap)[]);

    return (
        <View style={styles.container}>
            <View style={styles.currentTheme}>
                <Text style={[styles.currentTitle, { color: currentTheme.primary.text }]}>Current Theme</Text>
                <View style={[styles.color, { backgroundColor: currentTheme.primary.default, borderColor: currentTheme.primary.text, borderWidth: 2 }]}>
                </View>
                <Text style={[styles.colorTitle, { color: currentTheme.primary.text }]}>{currentTheme.name}</Text>
            </View>
            <View style={{ marginHorizontal: 10 }} >
                <Divider color={currentTheme.primary.text} />
            </View>
            <FlatList
                contentContainerStyle={styles.colorContainer}
                data={colorOptions}
                renderItem={renderPalette}
                keyExtractor={(item) => item}
                numColumns={4}
                ListFooterComponent={renderCustomPalette}
            />
            <View style={styles.bottom}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Custom Theme")}
                    style={[buttonStyles.container, { backgroundColor: currentTheme.primary.default }]}
                >
                    <Text style={[buttonStyles.text, { color: currentTheme.primary.text }]}>Custom</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    colorContainer: {
        alignItems: 'center',
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
    },
    bottom: {
        paddingHorizontal: 20,
        marginVertical: 10
    }
});
