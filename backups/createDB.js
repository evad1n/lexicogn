const Database = require('better-sqlite3');
const db = new Database('flashcards.db', { verbose: console.log });

process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

db.exec(`
    CREATE TABLE IF NOT EXISTS lists(
        name text,
        front_fields INTEGER DEFAULT 1
    );
`)