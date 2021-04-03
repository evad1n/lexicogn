import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type CollectionRoute = {
    Collection: undefined;
    Detail: {
        word: WordDocument;
    };
};

export type CollectionRouteProps<T extends keyof CollectionRoute> = {
    navigation: StackNavigationProp<CollectionRoute, T>;
    route: RouteProp<CollectionRoute, T>;
};
