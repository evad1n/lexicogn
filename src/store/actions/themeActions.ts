import { storeData } from '@/src/storage';

export const changeTheme = (name: ThemeName): ThemeAction => {
    // Persist theme
    storeData('@theme', name);

    return {
        type: 'CHANGE_THEME',
        name
    };
};

export const changeCustomTheme = (theme: ThemePalette): ThemeAction => {
    // Persist custom theme
    storeData('@customTheme', theme);

    return {
        type: 'CHANGE_CUSTOM_THEME',
        theme
    };
};