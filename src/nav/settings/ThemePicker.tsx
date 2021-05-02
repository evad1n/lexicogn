import Divider from '@/src/components/layout/Divider';
import { useTheme } from '@/src/hooks/theme_provider';
import buttonStyles from '@/src/styles/button';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Themes from '~/themes';
import { SettingsRouteProps } from './SettingsRoutes';

export default function ThemePicker({ navigation }: SettingsRouteProps<'Theme'>) {
    const { current: currentTheme, custom: customTheme, changeTheme } = useTheme();

    const renderPalette = ({ item: themeName }: { item: ThemeKey; }) => {
        const theme = Themes[themeName];

        return (
            <TouchableOpacity onPress={() => changeTheme(themeName)} style={styles.item}>
                <View style={[styles.color, { backgroundColor: theme.palette.primary, borderColor: theme.palette.primaryText, borderWidth: 2 }]}>
                </View>
                <Text style={[styles.colorTitle, { color: currentTheme.palette.secondaryText }]}>{themeName}</Text>
            </TouchableOpacity>
        );
    };

    function renderCustomPalette() {
        return (
            <TouchableOpacity onPress={() => changeTheme("custom")} style={styles.item}>
                <View style={[styles.color, { backgroundColor: customTheme.palette.primary, borderColor: customTheme.palette.primaryText, borderWidth: 2 }]}>
                </View>
                <Text style={[styles.colorTitle, { color: currentTheme.palette.secondaryText }]}>custom</Text>
            </TouchableOpacity>
        );
    };

    const colorOptions: Array<ThemeKey> = (Object.keys(Themes) as (keyof ThemeMap)[]);

    return (
        <View style={styles.container}>
            <View style={styles.currentTheme}>
                <Text style={[styles.currentTitle, { color: currentTheme.palette.secondaryText }]}>Current Theme</Text>
                <View style={[styles.color, { backgroundColor: currentTheme.palette.primary, borderColor: currentTheme.palette.primaryText, borderWidth: 2 }]}>
                </View>
                <Text style={[styles.colorTitle, { color: currentTheme.palette.secondaryText }]}>{currentTheme.name}</Text>
            </View>
            <View style={{ marginHorizontal: 10 }} >
                <Divider color={currentTheme.palette.secondaryText} />
            </View>
            <FlatList
                style={{ borderBottomWidth: 0 }}
                contentContainerStyle={styles.colorContainer}
                data={colorOptions}
                renderItem={renderPalette}
                keyExtractor={(item) => item}
                numColumns={4}
                ListFooterComponent={renderCustomPalette}
            />
            <View style={{ marginHorizontal: 0 }} >
                <Divider color={currentTheme.palette.secondaryText} />
            </View>
            <View style={styles.bottom}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Custom Theme")}
                    style={[buttonStyles.container, { backgroundColor: currentTheme.palette.primary }]}
                >
                    <Text style={[buttonStyles.text, { color: currentTheme.palette.primaryText }]}>Custom</Text>
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
        marginVertical: 10,
    }
});
