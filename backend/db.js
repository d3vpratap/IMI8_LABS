const Database = require("better-sqlite3");

const db = new Database("documents.db");

// Create table if not exists
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    filename TEXT,
    filepath TEXT,
    filesize INTEGER,
    assignment_id TEXT,
    created_at TEXT
  )
`
).run();

module.exports = db;
