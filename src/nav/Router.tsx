
import HomeStack from '@/src/nav/home/HomeStack';
import SearchStack from '@/src/nav/search/SearchStack';
import SettingsStack from '@/src/nav/settings/SettingsStack';
import StudyStack from '@/src/nav/study/StudyStack';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCurrentTheme } from '_store/hooks';
import Divider from '../components/layout/Divider';
import CollectionStack from './collection/CollectionStack';
import { RouteParamList } from './DrawerRoutes';

interface DrawerItemConfig {
    name: keyof RouteParamList,
    component: React.ComponentType<any>,
    icon: any,
    focusedIcon: any;
};


const Drawer = createDrawerNavigator<RouteParamList>();

const TopItems: DrawerItemConfig[] = [
    {
        name: 'Home',
        component: HomeStack,
        icon: "home-outline",
        focusedIcon: "home-sharp",
    },
    {
        name: 'Search',
        component: SearchStack,
        icon: "search-outline",
        focusedIcon: "search",
    },
    {
        name: 'Study',
        component: StudyStack,
        icon: "albums-outline",
        focusedIcon: "albums-sharp",
    },
    {
        name: 'Collection',
        component: CollectionStack,
        icon: "book-outline",
        focusedIcon: "book-sharp",
    }
];

const BotItems: DrawerItemConfig[] = [
    {
        name: 'Settings',
        component: SettingsStack,
        icon: "settings-outline",
        focusedIcon: "settings-sharp",
    },
];


export default function Router() {
    const theme = useCurrentTheme();

    // https://reactnavigation.org/docs/themes/#built-in-themes
    const navTheme = (theme: ThemePalette) => {
        return {
            dark: false,
            colors: {
                primary: theme.primary.dark,
                background: theme.primary.light,
                card: theme.primary.dark,
                text: theme.primary.darkText,
                border: theme.primary.dark,
                notification: theme.primary.dark,
            }
        };
    };

    return (
        <NavigationContainer theme={navTheme(theme)}>
            <Drawer.Navigator
                initialRouteName='Home'
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
    const theme = useCurrentTheme();

    return (
        <View style={style}>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <DrawerItem
                        focused={state.index == index + indexOffset}
                        onPress={() => {
                            // Navigate to inner default screen
                            navigation.navigate(item.name, { screen: item.name });
                        }}
                        icon={({ focused, size }) => <Ionicons name={focused ? item.focusedIcon : item.icon} size={size} color={theme.primary.darkText} />}
                        label={({ focused }) => <Text style={{ color: theme.primary.darkText, fontWeight: focused ? "bold" : "normal", fontSize: 16 }}>{item.name}</Text>}
                        activeTintColor={theme.primary.darkText}
                    />
                </React.Fragment>
            ))
            }
        </View>
    );
}

function MyDrawerContent(props: DrawerContentComponentProps) {
    const theme = useCurrentTheme();

    return (
        <View style={styles.drawer}>
            <DrawerContentScrollView {...props}>
                <DrawerSection items={TopItems} {...props} />
            </DrawerContentScrollView>
            <View style={styles.footer}>
                <DrawerSection items={BotItems} indexOffset={TopItems.length} {...props} />
                <Divider color={theme.primary.darkText} />
                <Text style={[styles.footerText, { color: theme.primary.darkText }]}>&copy; {new Date().getFullYear()} Will Dickinson</Text>
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
        fontSize: 16
    }
});
