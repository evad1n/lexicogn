import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type SearchRoute = {
    Search: undefined;
};

type SearchRouteProps<T extends keyof SearchRoute> = {
    navigation: StackNavigationProp<SearchRoute, T>;
    route: RouteProp<SearchRoute, T>;
};
