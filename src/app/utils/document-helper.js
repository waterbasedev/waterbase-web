import { generateRandomString } from "./string-manipulation.js";

export function nestDocuments(docs, parentId = null) {
  return docs
    .filter((doc) => doc.parent_id === parentId)
    .map((doc) => ({ ...doc, children: nestDocuments(docs, doc.id) }));
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
    title: `New Document ${documents.length + 1}`,
    type: itemType,
    content: "# New Document\n\nStart writing here...",
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
