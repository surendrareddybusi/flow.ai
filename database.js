// db/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/expense_tracker.db');

db.serialize(() => {
  // Create 'categories' table
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL
    )
  `);

  // Create 'transactions' table
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      description TEXT
    )
  `);
});

module.exports = db;
