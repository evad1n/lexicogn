import { insertWord } from "@/src/db/db";

export default function wordsReducer(state: WordsState = [], action: WordsAction) {
    switch (action.type) {
        case "LOAD_WORDS":
            return action.data;
        case "ADD_WORD":
            console.log("add word state:", action.item);
            return [action.item, ...state];
        case "DELETE_WORD":
            console.log("delete word state:", action.id);
            // Delete word from state
            return state.filter(word => word.id !== action.id);
            return state;
        default:
            return state;
    }
};