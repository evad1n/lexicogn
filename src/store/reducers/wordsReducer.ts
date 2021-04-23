

const initialState: WordsState = {
    words: [],
    homeWord: null
};

export default function wordsReducer(state: WordsState = initialState, action: WordsAction): WordsState {
    switch (action.type) {
        case "LOAD_WORDS":
            return {
                words: action.words,
                homeWord: action.words.length === 0 ? null : (
                    action.words[Math.floor(Math.random() * action.words.length)]
                )
            };
        case "ADD_WORD":
            {
                const newWords = [action.word, ...state.words];
                newWords.sort((a, b) => ('' + a.word).localeCompare(b.word));
                return {
                    words: newWords,
                    homeWord: state.words.length === 0 ? (
                        newWords[Math.floor(Math.random() * newWords.length)]
                    ) : state.homeWord
                };
            }
        case "DELETE_WORD":
            {
                const newWords = state.words.filter(word => word.id !== action.id);
                return {
                    words: newWords,
                    homeWord: newWords.length === 0 ? null : state.homeWord
                };
            }
        case "UPDATE_WORD":
            {
                let newWords = state.words.slice();
                let idx = newWords.findIndex(word => word.id == action.word.id);
                newWords[idx] = action.word;
                return { ...state, words: newWords };
            }
        default:
            return state;
    }
};