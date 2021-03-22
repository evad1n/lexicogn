/**
 * Check if the words table exists if not create it
 */
const schema =
    `CREATE TABLE IF NOT EXISTS words (
    id SERIAL PRIMARY KEY,
    word TEXT NOT NULL,
    definition TEXT NOT NULL,
    api INTEGER NOT NULL
    );`;

export default schema;