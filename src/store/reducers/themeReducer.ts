import Themes from '../theme/themes';

// Default to light mode
const initialTheme: ThemePalette = Themes["light"];

export default function themeReducer(state: ThemeState = initialTheme, action: ThemeAction) {
    switch (action.type) {
        case "CHANGE_THEME":
            return { ...state, theme: action.theme };
        default:
            return state;
    }
};