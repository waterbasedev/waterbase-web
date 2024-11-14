import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const openDb = async () => {
    return open({
        filename: './database.db',
        driver: sqlite3.Database
    });
};

// Handle GET request
export async function GET() {
    try {
        const db = await openDb();
        const documents = await db.all('SELECT * FROM documents');
        return new Response(JSON.stringify(documents), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to read documents' }), { status: 500 });
    }
}

// Handle POST request
export async function POST(req) {
    try {
        const body = await req.json();
        const db = await openDb();
        await db.run(
            'INSERT INTO documents (id, title, type, content, parent_id) VALUES (?, ?, ?, ?, ?)',
            body.id, body.title, body.type, body.content, body.parent_id || null
        );
        return new Response(JSON.stringify(body), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to write document' }), { status: 500 });
    }
}

// Handle PUT request
export async function PUT(req) {
    try {
        const body = await req.json();
        const db = await openDb();
        await db.run(
            'UPDATE documents SET title = ?, content = ?, parent_id = ? WHERE id = ?',
            body.title, body.content, body.parent_id, body.id
        );
        return new Response(JSON.stringify(body), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update document' }), { status: 500 });
    }
}

// Handle DELETE request
export async function DELETE(req) {
    try {
        const body = await req.json();
        const db = await openDb();
        await db.run('DELETE FROM documents WHERE id = ?', body.id);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete document' }), { status: 500 });
    }
}
