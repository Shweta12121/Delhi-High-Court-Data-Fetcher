const Database = require("better-sqlite3");
const db = new Database("judgments.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    raw_html TEXT
  );
`);

module.exports = db;
