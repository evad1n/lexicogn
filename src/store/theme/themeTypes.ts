type ColorPalette = {
    default: string;
    light: string;
    dark: string;
    text: string;
};

/**
 * dark: whether to use status bar dark theme
 */
type ThemePalette = {
    dark: boolean;
    primary: ColorPalette;
};

type ThemeKey =
    | "light"
    | "dark"
    | "cozy"
    | "grey";

type ThemeName = ThemeKey | "custom";

type ThemeMap = {
    [key in ThemeKey]: ThemePalette;
};

/**
 * Theme with name
 */
interface Theme extends ThemePalette {
    name: string;
}

/**
 * Adds theme name to state
 */
type ThemeState = {
    current: Theme;
    custom: ThemePalette;
};

type ThemeAction =
    | {
        type: "CHANGE_THEME";
        name: ThemeName;
    }
    | {
        type: "CHANGE_CUSTOM_THEME";
        theme: ThemePalette;
    };