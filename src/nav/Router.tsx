
import HomeStack from '@/src/nav/home/HomeStack';
import SearchStack from '@/src/nav/search/SearchStack';
import SettingsStack from '@/src/nav/settings/SettingsStack';
import StudyStack from '@/src/nav/study/StudyStack';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { CommonActions, StackActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Divider from '../components/layout/Divider';
import { useTypedSelector } from '_store/hooks';
import CollectionStack from './collection/CollectionStack';
import { RouteNavProps, RouteParamList } from './DrawerRoutes';

interface DrawerItemConfig {
    name: keyof RouteParamList,
    component: React.ComponentType<any>,
    icon: any,
    focusedIcon: any;
};


const Drawer = createDrawerNavigator<RouteParamList>();

const TopItems: DrawerItemConfig[] = [
    {
        name: 'home',
        component: HomeStack,
        icon: "home-outline",
        focusedIcon: "home-sharp",
    },
    {
        name: 'search',
        component: SearchStack,
        icon: "search-outline",
        focusedIcon: "search",
    },
    {
        name: 'study',
        component: StudyStack,
        icon: "albums-outline",
        focusedIcon: "albums-sharp",
    },
    {
        name: 'collection',
        component: CollectionStack,
        icon: "book-outline",
        focusedIcon: "book-sharp",
    }
];

const BotItems: DrawerItemConfig[] = [
    {
        name: 'settings',
        component: SettingsStack,
        icon: "settings-outline",
        focusedIcon: "settings-sharp",
    },
];


export default function Router() {
    const theme = useTypedSelector(state => state.theme);

    // https://reactnavigation.org/docs/themes/#built-in-themes
    const navTheme = (theme: ThemePalette) => {
        return {
            dark: false,
            colors: {
                primary: theme.primary.default,
                background: theme.primary.light,
                card: theme.primary.default,
                text: theme.primary.text,
                border: theme.primary.dark,
                notification: theme.primary.default,
            }
        };
    };

    return (
        <NavigationContainer theme={navTheme(theme)}>
            <Drawer.Navigator
                initialRouteName='home'
                drawerContent={(props) => <MyDrawerContent {...props} />}
            >
                {[...TopItems, ...BotItems].map((item, index) => (
                    <Drawer.Screen {...item} key={index} />
                ))}
            </Drawer.Navigator>
        </NavigationContainer >

    );
}

function DrawerSection(props: DrawerContentComponentProps & { items: DrawerItemConfig[]; } & { indexOffset?: number; }) {
    const { items, indexOffset = 0, state, navigation, style } = props;
    // const state2 = useNavigation();
    const theme = useTypedSelector(state => state.theme);

    return (
        <View style={style}>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <DrawerItem
                        focused={state.index == index + indexOffset}
                        onPress={() => {
                            // console.log(state);
                            navigation.reset({
                                index: 0,
                                routes: [{
                                    name: 'home'
                                }]
                            });
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: state.index,
                                    routes: [{
                                        name: 'home',
                                        state: {
                                            routes: [
                                                {
                                                    name: 'home'
                                                }
                                            ],
                                            stale: true
                                        }
                                    }]
                                })
                            );
                            // Navigate to inner default screen
                            navigation.navigate(item.name, { screen: item.name });
                            // navigation.dispatch(StackActions.popToTop());
                        }}
                        icon={({ focused, size }) => <Ionicons name={focused ? item.focusedIcon : item.icon} size={size} color={theme.primary.text} />}
                        label={({ focused }) => <Text style={{ color: theme.primary.text, fontWeight: focused ? "bold" : "normal", fontSize: 16 }}>{item.name}</Text>}
                        activeTintColor={theme.primary.text}
                    />
                </React.Fragment>
            ))
            }
        </View>
    );
}

function MyDrawerContent(props: DrawerContentComponentProps) {
    return (
        <View style={styles.drawer}>
            <DrawerContentScrollView {...props}>
                <DrawerSection items={TopItems} {...props} />
            </DrawerContentScrollView>
            <View style={styles.footer}>
                <DrawerSection items={BotItems} indexOffset={TopItems.length} {...props} />
                <Divider />
                <Text style={styles.footerText}>&copy; {new Date().getFullYear()} Will Dickinson</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    app: {
        fontFamily: "Roboto"
    },
    drawer: {
        flex: 1
    },
    footer: {

    },
    footerText: {
        padding: 5,
        textAlign: "center",
        fontSize: 15
    }
});
