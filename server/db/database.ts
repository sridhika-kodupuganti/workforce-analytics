import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const currentDir = import.meta.dirname || path.dirname(new URL(import.meta.url).pathname);
const DB_PATH = process.env.SQLITE_DB_PATH || path.resolve(process.cwd(), 'workforce.sqlite');
const SCHEMA_PATH = path.resolve(currentDir, 'schema.sql');

let dbInstance: DatabaseType | null = null;

export function getDatabase(): DatabaseType {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    
    // Performance optimizations for SQLite
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('foreign_keys = ON');
    dbInstance.pragma('synchronous = NORMAL');
    
    // Initialize schema if not present
    initializeSchema(dbInstance);
  }
  return dbInstance;
}

export function initializeSchema(db: DatabaseType): void {
  try {
    if (fs.existsSync(SCHEMA_PATH)) {
      const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
      db.exec(schemaSql);
    } else {
      console.warn(`Schema file not found at ${SCHEMA_PATH}, skipping auto-init.`);
    }
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    throw error;
  }
}

export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
