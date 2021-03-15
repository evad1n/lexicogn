import Themes from '../theme/themes';

// Default to light mode

const initialTheme: ThemeState = {
    name: "light",
    ...Themes["light"]
};

export default function themeReducer(state: ThemeState = initialTheme, action: ThemeAction) {
    switch (action.type) {
        case "CHANGE_THEME":
            return action.theme;
        default:
            return state;
    }
};