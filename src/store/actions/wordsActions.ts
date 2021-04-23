
/**
 * Initially set words state from database
 * @param words The list of words loaded from the database
 * @returns 
 */
export const setWords = (words: WordDocument[]): WordsAction => {
    return {
        type: "LOAD_WORDS",
        words: words
    };
};
