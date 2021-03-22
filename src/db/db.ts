import * as SQLite from 'expo-sqlite';
import schema from './schema';

const db = SQLite.openDatabase("lexicogn.db");

/**
 * Creates database tables if they don't exist according to the schema
 */
export async function initDB(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Check if the words table exists if not create it
        db.transaction(tx => {
            tx.executeSql(schema);
        }, (error) => {
            reject(error);
        }, () => {
            resolve();
        });
    });
}

/**
 * 
 * @returns All words in the database
 */
export async function getWords(): Promise<WordDocument[]> {
    return new Promise<WordDocument[]>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM words',
                [],
                (_, { rows }: { rows: any; }) => {
                    // This is so dumb, because the db fields
                    let words = (rows._array as Array<any>).map((x): WordDocument => {
                        return {
                            ID: x.id,
                            Word: x.word,
                            Definition: x.definition,
                            API: x.api
                        };
                    });
                    resolve(words);
                    // console.log(performance.now());
                },
            );
        }, (error) => {
            reject(error);
        });
    });
}

/**
 *
 * @returns The last inserted id
 */
export async function insertWord(word: WordResult) {
    return new Promise<number>((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('INSERT INTO words (word, definition, api) values (?, ?, ?)', [word.Word, word.Definition, word.API],
                (txObj, { insertId }) => {
                    resolve(insertId);
                },
            );
        }, (error) => {
            reject(error);
        });
    });
}