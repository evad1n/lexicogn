/**
 * Initially set words state from database
 * @param data The list of words loaded from the database
 * @returns 
 */
export const setWords = (data: WordDocument[]): WordsAction => {
    return {
        type: "LOAD_WORDS",
        data: data
    };
};


/**
 * Adds the word the database, then adds to state with return new id. Will do nothing if unable to add to database
 * @param data The word to add
 */
export const addWord = (data: WordResult): WordsAction => {
    return {
        type: "ADD_WORD",
        item: data
    };
};