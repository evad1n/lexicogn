import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type SettingsRoute = {
    Settings: undefined;
};

type SettingsRouteProps<T extends keyof SettingsRoute> = {
    navigation: StackNavigationProp<SettingsRoute, T>;
    route: RouteProp<SettingsRoute, T>;
};
