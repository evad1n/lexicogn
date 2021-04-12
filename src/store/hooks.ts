import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState } from "./reducers/rootReducer";
import { RootDispatch } from "./store";

// export const useTypedDispatch = () => useDispatch<typeof store.dispatch>();
export const useTypedDispatch = () => useDispatch<RootDispatch>();

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;