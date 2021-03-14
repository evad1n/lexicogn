export default function wordsReducer(state = [], action: any) {
    switch (action.type) {
        case "ADD_WORD":
            console.log("add word");
            return state;
        default:
            return state;
    }
};