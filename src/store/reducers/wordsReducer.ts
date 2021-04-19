
export default function wordsReducer(state: WordsState = [], action: WordsAction) {
    switch (action.type) {
        case "LOAD_WORDS":
            return action.data;
        case "ADD_WORD":
            return [action.item, ...state];
        case "DELETE_WORD":
            return state.filter(word => word.id !== action.id);
        default:
            return state;
    }
};