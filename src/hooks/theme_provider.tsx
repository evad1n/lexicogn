import React, { createContext, useContext, useEffect, useState } from "react";
import { TextInput } from "react-native";
import { getData, storeData } from "../storage";
import Themes from "../themes";

/* Allows for sharing of search input without using complicated forward refs */

interface ThemeState {
    current: Theme;
    custom: ThemePalette;
};

interface ThemeContext extends ThemeState {
    changeTheme: (name: ThemeName) => Promise<void>;
    changeCustomTheme: (newCustomTheme: ThemePalette) => Promise<void>;
}

const initialState: ThemeState = {
    current: {
        name: "light",
        ...Themes["light"],
    },
    custom: {
        dark: false,
        palette: {
            primary: "rgb(200,200,200)",
            primaryText: "rgb(0,0,0)",
            secondary: "rgb(255,255,255)",
            secondaryText: "rgb(0,0,0)",
        }
    }
};

const themeContext = createContext<ThemeContext>(undefined!);

export function ProvideTheme({ children }: any) {
    const search = useProvideTheme();
    return (
        <themeContext.Provider value={search}>{children}</themeContext.Provider>
    );
}

export const useTheme = () => {
    return useContext(themeContext);
};

export const useCurrentTheme = () => {
    return useContext(themeContext).current;
};

export const useCustomTheme = () => {
    return useContext(themeContext).custom;
};

function useProvideTheme(): ThemeContext {
    const [theme, setTheme] = useState<ThemeState>(initialState);

    useEffect(() => {
        async function loadTheme() {
            try {
                const themeName = await getData("@theme");
                const customTheme = await getData("@customTheme");
                if (customTheme) {
                    changeCustomTheme(customTheme);
                }
                // If there is a saved theme
                if (themeName) {
                    changeTheme(themeName);
                }
            } catch (error) {
                throw new Error(error);
            }
        }
        loadTheme();
    }, []);

    async function changeTheme(name: ThemeName) {
        await storeData('@theme', name);
        if (name === 'custom') {
            setTheme(theme => ({
                ...theme,
                current: {
                    name,
                    ...theme.custom
                }
            }));
        } else {
            setTheme(theme => ({
                ...theme,
                current: {
                    name,
                    ...Themes[name]
                }
            }));
        }
    }

    async function changeCustomTheme(newCustomTheme: ThemePalette) {
        await storeData("@customTheme", newCustomTheme);
        setTheme(theme => ({
            ...theme,
            custom: newCustomTheme
        }));
    }

    return {
        current: theme.current,
        custom: theme.custom,
        changeTheme,
        changeCustomTheme,
    };
}