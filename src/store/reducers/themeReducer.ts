import Themes from '../../themes';

// Default to light mode

const initialState: ThemeState = {
    current: {
        name: "light",
        ...Themes["light"],
    },
    custom: {
        dark: false,
        primary: {
            default: "rgb(220,220,220)",
            light: "rgb(255,255,255)",
            dark: "rgb(200,200,200)",
            text: "rgb(0,0,0)",
        }
    }
};

export default function themeReducer(state: ThemeState = initialState, action: ThemeAction): ThemeState {
    switch (action.type) {
        case "CHANGE_THEME":
            if (action.name === 'custom') {
                return {
                    ...state,
                    current: {
                        name: action.name,
                        ...state.custom
                    }
                };
            } else {
                return {
                    ...state,
                    current: {
                        name: action.name,
                        ...Themes[action.name]
                    }
                };
            }
        case "CHANGE_CUSTOM_THEME":
            return {
                ...state,
                custom: action.theme,
            };
        default:
            return state;
    }
};