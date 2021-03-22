import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type HomeRoute = {
    home: undefined;
};

export type HomeRouteProps<T extends keyof HomeRoute> = {
    navigation: StackNavigationProp<HomeRoute, T>;
    route: RouteProp<HomeRoute, T>;
};
