import Divider from '@/src/components/layout/Divider';
import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";


const settings: SettingsType[] = [
    {
        name: "Theme",
        nav: "Theme",
        icon: "color-palette-sharp"
    },
    {
        name: "idk",
        nav: "Theme",
        icon: "color-palette-outline"
    },
];

export default function Settings({ navigation }: SettingsRouteProps<"Settings">) {


    const renderSettingTab = ({ item: setting }: { item: SettingsType; }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate(setting.nav)} style={styles.item}>
                <Ionicons name={setting.icon} size={30} />
                <Text style={styles.itemText}>{setting.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={settings}
            renderItem={renderSettingTab}
            keyExtractor={(item: SettingsType) => item.name}
            ItemSeparatorComponent={Divider}
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
