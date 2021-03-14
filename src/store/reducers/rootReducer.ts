import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { combineReducers } from "redux";
import theme from "./themeReducer";

export const rootReducer = combineReducers({
    theme
});

export type RootState = ReturnType<typeof rootReducer>;