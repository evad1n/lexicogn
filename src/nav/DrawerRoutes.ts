import { RouteProp } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

// Restrict screen types
export type RouteParamList = {
    home: undefined;
    search: undefined;
    study: undefined;
    collection: undefined;
    settings: undefined;
};

export type RouteNavProps<T extends keyof RouteParamList> = {
    navigation: DrawerNavigationProp<RouteParamList, T>;
    route: RouteProp<RouteParamList, T>;
};
