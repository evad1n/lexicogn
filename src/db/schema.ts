/**
 * Check if the words table exists if not create it
 */
export const schema =
    `CREATE TABLE IF NOT EXISTS words (
    id INTEGER NOT NULL PRIMARY KEY,
    word TEXT NOT NULL,
    definition TEXT NOT NULL,
    api INTEGER NOT NULL,
    correct INTEGER NOT NULL DEFAULT 0,
    incorrect INTEGER NOT NULL DEFAULT 0
    );`;

/* Drop all records from words table */
export const wipe =
    `DELETE FROM words`;

/* Delete words table */
export const reset =
    `DROP TABLE IF EXISTS words;`;