import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "./reducers/rootReducer";
import store from "./store";

// export const useTypedDispatch = () => useDispatch<typeof store.dispatch>();
export const useTypedDispatch = () => useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;