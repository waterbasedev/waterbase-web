const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const filePath = './documents.json';

// Read documents from JSON file
const readDocuments = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// Write documents to JSON file
const writeDocuments = (documents) => {
  fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));
};

// Get all documents
app.get('/documents', (req, res) => {
  const documents = readDocuments();
  res.json(documents);
});

// Add a new document
app.post('/documents', (req, res) => {
  const documents = readDocuments();
  const newDoc = req.body;
  documents.push(newDoc);
  writeDocuments(documents);
  res.status(201).json(newDoc);
});

// Update a document
app.put('/documents/:id', (req, res) => {
  const documents = readDocuments();
  const updatedDoc = req.body;
  const index = documents.findIndex(doc => doc.id === parseInt(req.params.id));
  if (index !== -1) {
    documents[index] = updatedDoc;
    writeDocuments(documents);
    res.json(updatedDoc);
  } else {
    res.status(404).json({ message: 'Document not found' });
  }
});

// Delete a document
app.delete('/documents/:id', (req, res) => {
  let documents = readDocuments();
  documents = documents.filter(doc => doc.id !== parseInt(req.params.id));
  writeDocuments(documents);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
