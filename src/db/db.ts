import * as SQLite from 'expo-sqlite';
import { reset, schema } from './schema';

const db = SQLite.openDatabase("lexicogn.db");

/**
 * ### Creates database tables if they don't exist according to the schema
 */
export async function initDB(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Check if the words table exists if not create it
        db.transaction(tx => {
            // CHORE: remove on deploy (only for testing)
            tx.executeSql(schema);
        }, (error) => {
            reject(error);
        }, () => {
            resolve();
        });
    });
}

/**
 * ### Wipes the words database table
 */
export async function wipeDB(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(reset);
            tx.executeSql(schema);
        }, (error) => {
            reject(error);
        }, () => {
            resolve();
        });
    });
}

/**
 * ### Gets all words in alphabetical order
 * @returns {Promise<WordDocument[]>} All words in the database
 */
export async function getAllWords(): Promise<WordDocument[]> {
    return new Promise<WordDocument[]>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM words ORDER BY word',
                [],
                (_, { rows }: { rows: any; }) => {
                    // Expo sqlite has completely wrong Types => rows has no member _array but it does! Awesome!
                    resolve(rows._array);
                },
            );
        }, (error) => {
            reject(error);
        });
    });
}

/**
 * ### Insert a word into the database
 * @param {WordResult} word The word object to insert
 * @returns {Promise<number>}
 */
export async function insertWord(word: WordResult): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('INSERT INTO words (word, definition, api) values (?, ?, ?)', [word.word, word.definition, word.api],
                (txObj, { insertId }) => {
                    resolve(insertId);
                },
            );
        }, (error) => {
            reject(error);
        });
    });
}

/**
 * ### Delete a word from the database
 * 
 * @param {number} id The id of the word to delete
 * @returns {Promise<void>}
 */
export async function deleteWord(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('DELETE FROM words WHERE id = ?', [id],
                (txObj, { rowsAffected }) => {
                    if (rowsAffected == 0)
                        reject(`no word exists with id ${id}`);
                    else
                        resolve();
                },
            );
        }, (error) => {
            reject(error);
        });
    });
}

/**
 * ### Update a word in the database
 * @param newDefinition The updated definition
 * @param {number} api The id of the word to update
 * @param {number} id The id of the word to update
 * @returns {Promise<void>} 
 */
export async function updateDefinition(newDefinition: string, api: number, id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('UPDATE words SET definition = ?, api = ? WHERE id = ?', [newDefinition, api, id],
                (txObj, { rowsAffected }) => {
                    if (rowsAffected == 0)
                        reject(`no word exists with id ${id}`);
                    else
                        resolve();
                },
            );
        }, (error) => {
            reject(error);
        });
    });
}

/**
 * ### Add 1 to word's correct count
 * @param id The id of the word to update
 * @returns {Promise<void>} 
 */
export async function decreaseFrequency(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('UPDATE words SET correct = correct + 1 WHERE id = ?', [id],
                (txObj, { rowsAffected }) => {
                    if (rowsAffected == 0)
                        reject(`no word exists with id ${id}`);
                    else
                        resolve();
                },
            );
        }, (error) => {
            reject(error);
        });
    });
}


/**
 * ### Add 1 to word's incorrect count
 * @param id The id of the word to update
 * @returns {Promise<void>} 
 */
export async function increaseFrequency(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('UPDATE words SET incorrect = incorrect + 1 WHERE id = ?', [id],
                (txObj, { rowsAffected }) => {
                    if (rowsAffected == 0)
                        reject(`no word exists with id ${id}`);
                    else
                        resolve();
                },
            );
        }, (error) => {
            reject(error);
        });
    });
}