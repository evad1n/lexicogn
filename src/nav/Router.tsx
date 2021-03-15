
import HomeStack from '@/src/nav/home/HomeStack';
import SearchStack from '@/src/nav/search/SearchStack';
import StudyStack from '@/src/nav/study/StudyStack';
import SettingsStack from '@/src/nav/settings/SettingsStack';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RouteParamList } from './DrawerRoutes';
import { Ionicons } from '@expo/vector-icons';
import Divider from '../components/layout/Divider';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { useTypedSelector } from '../store/selector';

const Drawer = createDrawerNavigator<RouteParamList>();

const TopItems: DrawerItemConfig[] = [
    {
        name: "Home",
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
    }
    // book icon for collection
];

const BotItems: DrawerItemConfig[] = [
    {
        name: "Settings",
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
                initialRouteName="Home"
                drawerContent={(props) => <MyDrawerContent {...props} />}
            >
                {[...TopItems, ...BotItems].map((item, index) => (
                    <Drawer.Screen {...item} key={index} />
                ))}
            </Drawer.Navigator>
        </NavigationContainer >

    );
}

interface DrawerItemConfig {
    name: keyof RouteParamList,
    component: React.ComponentType<any>,
    icon: any,
    focusedIcon: any;
};

function DrawerSection(props: DrawerContentComponentProps & { items: DrawerItemConfig[]; } & { indexOffset?: number; }) {
    const { items, indexOffset = 0, state, navigation, style } = props;
    const theme = useTypedSelector(state => state.theme);

    return (
        <View style={style}>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <DrawerItem
                        focused={state.index == index + indexOffset}
                        onPress={() => navigation.navigate(item.name)}
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
    const { state, navigation } = props;
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
