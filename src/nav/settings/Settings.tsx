import React from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SettingsRouteProps } from "./SettingsRoutes";

export default function Settings({ navigation }: SettingsRouteProps<"Settings">) {

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps={"handled"}
        >

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    autoSuggestions: {
        paddingTop: 5,
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
    },
});
