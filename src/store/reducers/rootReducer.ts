import { combineReducers } from "redux";
import theme from "./themeReducer";
import words from "./wordsReducer";

export const rootReducer = combineReducers({
    theme,
    words
});

export type RootState = ReturnType<typeof rootReducer>;