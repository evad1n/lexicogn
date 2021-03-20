import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type StudyRoute = {
    Home: undefined;
    Detail: undefined;
};

export type StudyRouteProps<T extends keyof StudyRoute> = {
    navigation: StackNavigationProp<StudyRoute, T>;
    route: RouteProp<StudyRoute, T>;
};
