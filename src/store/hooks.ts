import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState } from "./reducers/rootReducer";
import { RootDispatch } from "./store";

// export const useTypedDispatch = () => useDispatch<typeof store.dispatch>();
export const useTypedDispatch = () => useDispatch<RootDispatch>();

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useCurrentTheme = () => useTypedSelector(state => state.theme.current);

export const useCustomTheme = () => useTypedSelector(state => state.theme.custom);

export const useWords = () => useTypedSelector(state => state.words);