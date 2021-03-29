import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState } from "./reducers/rootReducer";
import store from "./store";

export const useTypedDispatch = () => useDispatch<typeof store.dispatch>();

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;