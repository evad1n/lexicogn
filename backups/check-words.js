const Database = require('better-sqlite3');
const db = new Database('flashcards.db', { verbose: console.log });
const fs = require("fs");

process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

var words = []
var dict = []
var checked = []

dict = getEntries("vocab")
dict = dict.map(entry => entry.word)

fs.readFile('check-words.txt', function(err, data) {
    words = data.toString().split('\n')

    words.forEach(word => {
        var found = false
        dict.forEach(entry => {
            if (word == entry) {
                found = true
            }
        });
        if (!found)
            checked.push(word)
    });

    fs.writeFile('checked-words.txt', checked.join('\n'), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });

    console.log(checked)
});

// Get all entries in a table ordered by first column
function getEntries(table_name) {
    const stmt = db.prepare(`SELECT rowid, * FROM ${table_name} ORDER BY 1`)
    try {
        return stmt.all()
    } catch (error) {
        console.log(error)
    }
}