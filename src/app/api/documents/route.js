import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'documents.json');

// Read documents from JSON file
const readDocuments = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Write documents to JSON file
const writeDocuments = (documents) => {
    fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));
};

// Handle GET request
export async function GET() {
    try {
        const documents = readDocuments();
        return new Response(JSON.stringify(documents), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to read documents' }), { status: 500 });
    }
}

// Handle POST request
export async function POST(req) {
    try {
        const body = await req.json();
        const documents = readDocuments();
        documents.push(body);
        writeDocuments(documents);
        return new Response(JSON.stringify(body), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to write document' }), { status: 500 });
    }
}
