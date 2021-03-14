import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type HomeRoute = {
    Home: undefined;
};

type HomeRouteProps<T extends keyof HomeRoute> = {
    navigation: StackNavigationProp<HomeRoute, T>;
    route: RouteProp<HomeRoute, T>;
};
