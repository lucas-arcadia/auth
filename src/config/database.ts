// /src/config/database.ts

import { Database } from "bun:sqlite";

class DatabaseSingleton {
  private static instance: Database;

  private constructor() {
    DatabaseSingleton.instance = new Database("db.sqlite");
  }

  public static getInstance(): Database {
    if (!DatabaseSingleton.instance) {
      new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }
}

const db = DatabaseSingleton.getInstance();

// Criar tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS company (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    ein TEXT UNIQUE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    deletedAt DATETIME,
    UNIQUE(ein)
  );
  `);

db.exec(`
  CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    companyId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    deletedAt DATETIME,
    FOREIGN KEY (companyId) REFERENCES company(id),
    UNIQUE(name, companyId)
  );
`);

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    companyId INTEGER NOT NULL,
    groupId INTEGER NOT NULL,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    deletedAt DATETIME,
    FOREIGN KEY (companyId) REFERENCES company(id),
    FOREIGN KEY (groupId) REFERENCES groups(id),
    UNIQUE(email)
  );
`);

export default db;
