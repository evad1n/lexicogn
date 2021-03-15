import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type SettingsType = {
    name: string;
    nav: SettingsRoute;
};

type SettingsRoute = {
    Settings: undefined;
    Theme: undefined;
};

type SettingsRouteProps<T extends keyof SettingsRoute> = {
    navigation: StackNavigationProp<SettingsRoute, T>;
    route: RouteProp<SettingsRoute, T>;
};
