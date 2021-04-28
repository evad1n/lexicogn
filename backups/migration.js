const Database = require('better-sqlite3');
const db = new Database('flashcards.db', { verbose: console.log });

process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

function getTables() {
    const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`)
    try {
        return stmt.all()
    } catch (error) {
        console.log(error)
    }
}

function addTable(name, columns) {
    let cols = ""
    columns.forEach(col => {
        cols += col + " text,"
    });
    cols = cols.substring(0, cols.length - 1) // Cut off last comma
    const stmt = db.prepare(`CREATE TABLE ${name}(${cols})`)

    try {
        stmt.run()
    } catch (error) {
        console.log(error)
    }
}

function editTable(name, data) {
    const stmt = db.prepare(`ALTER TABLE ${name} RENAME TO ${data.name};`)
    try {
        stmt.run()
    } catch (error) {
        console.log(error)
    }
}

function deleteTable(name) {
    const stmt = db.prepare(`DROP TABLE ${name}`)
    try {
        stmt.run()
    } catch (error) {
        console.log(error)
    }
}

// Get all entries in a table ordered by first column
function getEntries(table_name) {
    const stmt = db.prepare(`SELECT rowid, * FROM ${table_name} ORDER BY 1`)
    try {
        return stmt.all()
    } catch (error) {
        console.log(error)
    }
}

function addEntry(table_name, data) {
    let cols = ""
    Object.keys(data).forEach(key => {
        if (key != "id") {
            cols += "@" + key + ","
        }
    });
    cols = cols.substring(0, cols.length - 1) // Cut off last comma

    let vals = ""
    Object.keys(data).forEach(key => {
        if (key != "id") {
            vals += '"' + data[key] + '",'
        }
    });
    vals = vals.substring(0, vals.length - 1) // Cut off last comma

    const stmt = db.prepare(`INSERT INTO ${table_name} VALUES (${cols})`)
    try {
        return stmt.run(data).lastInsertRowid
    } catch (error) {
        console.log(error)
    }
}

function updateEntry(table_name, data) {
    let cols = ''
    Object.keys(data).forEach(key => {
        if (key != "id") {
            cols += key + " = '" + data[key] + "',"
        }
    });
    cols = cols.substring(0, cols.length - 1) // Cut off last comma
    console.log(`UPDATE ${table_name} SET ${cols} WHERE rowid = ${data.id};`)

    const stmt = db.prepare(`UPDATE ${table_name} SET ${cols} WHERE rowid = ${data.id};`)
    try {
        stmt.run()
        console.log("Edited entry (id = " + data.id + ") " + cols);
    } catch (error) {
        console.log(error)
    }
}

function deleteEntry(table_name, id) {
    const stmt = db.prepare(`DELETE FROM ${table_name} WHERE rowid = ${id};`)
    try {
        stmt.run()
        console.log("Deleted entry (id = " + data.id + ")");
    } catch (error) {
        console.log(error)
    }
}