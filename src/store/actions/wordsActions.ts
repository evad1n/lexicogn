import { insertWord } from "@/src/db/db";

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
export const addWord = (data: WordResult): any => {
    return async (dispatch: any) => {
        try {
            let id = await insertWord(data);
            dispatch({
                type: "ADD_WORD",
                item: { ...data, id }
            });
        } catch (error) {
            console.error(error);
        }
    };
    // console.log("add word:", action.item);
    // // First add to db
    // insertWord(action.item).then(id => {
    //     // Now add word to loaded words
    //     state.push({ ...action.item, id });
    // }).catch(error => {
    //     console.error("add word to db error:", error);
    // });
    // return {
    //     type: "ADD_WORD",
    //     item: data
    // };
};