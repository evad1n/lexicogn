import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type StudyRoute = {
    Home: undefined;
    Detail: undefined;
};

type StudyRouteProps<T extends keyof StudyRoute> = {
    navigation: StackNavigationProp<StudyRoute, T>;
    route: RouteProp<StudyRoute, T>;
};
