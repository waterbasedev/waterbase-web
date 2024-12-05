// route.js
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Handle GET request
export async function GET() {
    try {
        const documents = await sql`SELECT * FROM documents ORDER BY id`;
        return new Response(JSON.stringify(documents), { status: 200 });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ error: 'Failed to read documents' }), { status: 500 });
    }
}

// Handle POST request
export async function POST(req) {
    try {
        const body = await req.json();
        const result = await sql`
            INSERT INTO documents (id, title, type, content, parent_id)
            VALUES (${body.id}, ${body.title}, ${body.type}, ${body.content}, ${body.parent_id})
            RETURNING *
        `;
        return new Response(JSON.stringify(result[0]), { status: 201 });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ error: 'Failed to write document' }), { status: 500 });
    }
}

// Handle PUT request
// Handle PUT request
export async function PUT(req) {
    try {
      const body = await req.json();
      const currentTime = new Date().toISOString();
      const result = await sql`
        UPDATE documents 
        SET title = ${body.title}, 
            content = ${body.content}, 
            parent_id = ${body.parent_id},
            path = ${body.path},
            last_edited_time = ARRAY_APPEND(COALESCE(last_edited_time, ARRAY[]::timestamptz[]), ${currentTime}::timestamptz)
        WHERE id = ${body.id}
        RETURNING *
      `;
      return new Response(JSON.stringify(result[0]), { status: 200 });
    } catch (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Failed to update document', details: error.message }), { status: 500 });
    }
}

// Handle DELETE request
export async function DELETE(req) {
    try {
        const body = await req.json();
        await sql`DELETE FROM documents WHERE id = ${body.id}`;
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete document' }), { status: 500 });
    }
}
