
export default function wordsReducer(state: WordsState = [], action: WordsAction) {
    switch (action.type) {
        case "LOAD_WORDS":
            return action.data;
        case "ADD_WORD":
            return [action.item, ...state];
        case "DELETE_WORD":
            return state.filter(word => word.id !== action.id);
        case "UPDATE_WORD":
            let newState = state.slice();
            let idx = state.findIndex(word => word.id == action.item.id);
            newState[idx] = action.item;
            return newState;
        default:
            return state;
    }
};