import { generateRandomString } from "./string-manipulation.js";

export function nestDocuments(docs, parentId = null, parentPath = []) {
  return docs
    .filter((doc) => doc.parent_id === parentId)
    .map((doc) => {
      const currentPath = [...parentPath, doc.title]; // Assuming each document has a 'title' property
      return { 
        ...doc, 
        path: currentPath, 
        children: nestDocuments(docs, doc.id, currentPath) 
      };
    });
}

export function isDescendant(parent, child) {
  if (parent.id === child.parent_id) {
    return true;
  }
  const parentFolder = findDocFromId(child.parent_id);
  return parentFolder ? isDescendant(parent, parentFolder) : false;
}

const flattenDocuments = (documents) => {
  const result = [];
  const stack = [...documents];

  while (stack.length) {
    const current = stack.pop();
    result.push(current);
    if (current.children) {
      stack.push(...current.children);
    }
  }

  return result;
};

export function findDocFromId(documents, docId) {
  const flattenedDocuments = flattenDocuments(documents);
  return flattenedDocuments.find((doc) => doc.id === docId);
}

export function handleNewItem(documents, setDocuments, itemType) {
  const newDoc = {
    id: generateRandomString(6),
    title: `New ${itemType} ${documents.length + 1}`,
    type: itemType,
    content: `# New ${itemType}\n\nStart writing here...`,
    parent_id: null,
  };
  fetch("/api/documents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newDoc),
  })
    .then((response) => response.json())
    .then((data) => setDocuments([...documents, data]));
}
