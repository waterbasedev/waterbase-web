import { generateRandomString } from './string-manipulation.js';


export function nestDocuments(docs, parentId = null) {
    return docs
        .filter(doc => doc.parent_id === parentId)
        .map(doc => ({ ...doc, children: nestDocuments(docs, doc.id) }));
}

export function isDescendant(parent, child) {
    if (parent.id === child.parent_id) {
        return true;
    }
    const parentFolder = findDocfromId(child.parent_id);
    return parentFolder ? isDescendant(parent, parentFolder) : false;
}

export function findDocfromId(docId, docs) {
    for (const doc of docs) {
        if (doc.id === docId) {
            return doc;
        }
        if (doc.children) {
            const foundDoc = findDocfromId(docId, doc.children);
            if (foundDoc) {
                return foundDoc;
            }
        }
    }
}

export function handleNewItem(documents, setDocuments, itemType) {
    const newDoc = {
        id: generateRandomString(6),
        title: `New Document ${documents.length + 1}`,
        type: itemType,
        content: '# New Document\n\nStart writing here...',
        parent_id: null
    };
    fetch('/api/documents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDoc)
    })
        .then(response => response.json())
        .then(data => setDocuments([...documents, data]));
}