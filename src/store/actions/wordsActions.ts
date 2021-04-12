
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
