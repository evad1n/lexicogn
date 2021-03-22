import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type SettingsRoute = {
    settings: undefined;
    theme: undefined;
};

export type SettingsRouteProps<T extends keyof SettingsRoute> = {
    navigation: StackNavigationProp<SettingsRoute, T>;
    route: RouteProp<SettingsRoute, T>;
};
