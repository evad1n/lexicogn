import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type SearchRoute = {
    search: undefined;
};

export type SearchRouteProps<T extends keyof SearchRoute> = {
    navigation: StackNavigationProp<SearchRoute, T>;
    route: RouteProp<SearchRoute, T>;
};
