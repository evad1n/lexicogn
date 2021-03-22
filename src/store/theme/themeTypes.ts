type ColorPalette = {
    default: string;
    light: string;
    dark: string;
    text: string;
};

/**
 * dark: whether to use status bar dark theme
 */
interface ThemePalette {
    dark: boolean;
    primary: ColorPalette;
    secondary: ColorPalette;
};

type ThemeMap = {
    [name: string]: ThemePalette;
};

/**
 * Adds theme name to state
 */
interface ThemeState extends ThemePalette {
    name: string;
}

type ThemeAction =
    | {
        type: "CHANGE_THEME";
        theme: ThemeState;
    };