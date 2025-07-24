const Database = require("better-sqlite3");
const db = new Database("app.db");

// Crear tabla de usuarios
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )
`
).run();

// Crear tabla de historial de chats
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    image_url TEXT,
    grado TEXT,
    confianza REAL,
    recomendaciones TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`
).run();

module.exports = db;
