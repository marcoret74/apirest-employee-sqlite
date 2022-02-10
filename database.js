var sqlite3 = require('sqlite3').verbose();
var md5 = require('md5');

const DBSOURCE = 'db.sqlite';

let db = new sqlite3.Database(DBSOURCE, function (err) {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database');
        db.run(`CREATE TABLE employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fname text,
            lname text,
            email text,
            active bit
        );`, function (err) {
            if (err) {
                console.log('Table employees already exists.');
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO employees (fname, lname, email, active) VALUES (?, ?, ?, ?);';
                db.run(insert, ['MARCO', 'RETAMALES', 'marcoret74@gmail.com', true]);
                db.run(insert, ['KAREN', 'GONZALEZ', 'karencita.nicolita@gmail.com', true]);
            }
        });
    }
});

module.exports = db;