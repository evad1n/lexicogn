import { combineReducers } from "redux";
import theme from "./themeReducer";
import words from "./wordsReducer";

export const rootReducer = combineReducers({
    words,
    theme,
});

export type RootState = ReturnType<typeof rootReducer>;