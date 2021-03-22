import { insertWord } from "@/src/db/db";

export default function wordsReducer(state: WordsState = [], action: WordsAction) {
    switch (action.type) {
        case "LOAD_WORDS":
            return action.data;
        case "ADD_WORD":
            console.log("add word:", action.item);
            // First add to db
            insertWord(action.item).then(id => {
                // Now add word to loaded words
                state.push({ ...action.item, ID: id });
            }).catch(error => {
                console.error("add word to db error:", error);
            });
            return state;
        case "DELETE_WORD":
            console.log("delete word:", action.id);
            // Deleted word from state
            // state.push(action.item);
            return state;
        default:
            return state;
    }
};