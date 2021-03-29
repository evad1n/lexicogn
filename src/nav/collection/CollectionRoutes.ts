import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type CollectionRoute = {
    collection: undefined;
    detail: {
        id: Number;
    };
};

export type CollectionRouteProps<T extends keyof CollectionRoute> = {
    navigation: StackNavigationProp<CollectionRoute, T>;
    route: RouteProp<CollectionRoute, T>;
};
