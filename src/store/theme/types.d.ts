type ColorPalette = {
    default: string;
    light: string;
    dark: string;
    text: string;
};

type ThemePalette = {
    primary: ColorPalette;
    secondary: ColorPalette;
};

type ThemeMap = {
    [name: string]: ThemePalette;
};

type ThemeState = ThemePalette;

type ThemeAction = {
    type: string;
    theme: ThemePalette;
};