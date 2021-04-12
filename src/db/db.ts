import { DrawerContentScrollView } from '@react-navigation/drawer';
import * as SQLite from 'expo-sqlite';
import schema, { reset } from './schema';

const db = SQLite.openDatabase("lexicogn.db");

/**
 * Creates database tables if they don't exist according to the schema
 */
export async function initDB(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // Check if the words table exists if not create it
        db.transaction(tx => {
            // tx.executeSql(reset);
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
 *
 * @returns The last inserted id
 */
export async function insertWord(word: WordResult) {
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

export async function deleteWord(id: Number) {
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