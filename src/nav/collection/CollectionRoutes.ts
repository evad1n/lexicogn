import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type CollectionRoute = {
    Collection: {
        focus: boolean; // Whether to focus search input on navigate
        search: string;
    } | undefined;
    Detail: {
        id: number;
        search?: string;
    };
};

export type CollectionRouteProps<T extends keyof CollectionRoute> = {
    navigation: StackNavigationProp<CollectionRoute, T>;
    route: RouteProp<CollectionRoute, T>;
};
