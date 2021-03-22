import Divider from '@/src/components/layout/Divider';
import { useTypedSelector } from '@/src/store/selector';
import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SettingsRouteProps, SettingsRoute } from './SettingsRoutes';

type SettingsType = {
    name: string;
    nav: keyof SettingsRoute;
    icon: any;
};

const settings: SettingsType[] = [
    {
        name: "Theme",
        nav: "theme",
        icon: "color-palette-sharp"
    },
    {
        name: "idk",
        nav: "theme",
        icon: "color-palette-outline"
    },
];

export default function Settings({ navigation }: SettingsRouteProps<'settings'>) {
    const theme = useTypedSelector(state => state.theme);

    const renderSettingTab = ({ item: setting }: { item: SettingsType; }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate(setting.nav)} style={styles.item}>
                <Ionicons name={setting.icon} size={30} color={theme.primary.text} />
                <Text style={[styles.itemText, { color: theme.primary.text }]}>{setting.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={settings}
            renderItem={renderSettingTab}
            keyExtractor={(item: SettingsType) => item.name}
            ItemSeparatorComponent={() => <Divider color={theme.primary.text} />}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    item: {
        paddingVertical: 10,
        paddingLeft: 10,
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    itemText: {
        paddingLeft: 10,
        fontSize: 20
    },
});
