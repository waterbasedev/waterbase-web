// setupDatabase.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

(async () => {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS documents (
            id TEXT PRIMARY KEY,
            title TEXT,
            type TEXT,
            content TEXT,
            parent_id TEXT
        )
    `);

    console.log('Database and table created');
})();
