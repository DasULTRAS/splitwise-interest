const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT);");
  db.run("CREATE TABLE IF NOT EXISTS persons (id INTEGER PRIMARY KEY, name TEXT, schuldbetrag REAL, zins REAL, zinsrate REAL);");
  db.run("INSERT INTO users VALUES (1, 'user','changeme');")
});

module.exports = db;
