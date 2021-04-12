/**
 * Check if the words table exists if not create it
 */
const schema =
    `CREATE TABLE IF NOT EXISTS words (
    id INTEGER NOT NULL PRIMARY KEY,
    word TEXT NOT NULL,
    definition TEXT NOT NULL,
    api INTEGER NOT NULL
    );`;

export const reset =
    `DROP TABLE IF EXISTS words;`;

export default schema;