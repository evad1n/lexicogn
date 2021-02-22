import { RouteProp } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

// Restrict screen types
export type RouteParamList = {
    Home: undefined;
    Search: undefined;
    Study: undefined;
};

export type RouteNavProps<T extends keyof RouteParamList> = {
    navigation: DrawerNavigationProp<RouteParamList, T>;
    route: RouteProp<RouteParamList, T>;
};
