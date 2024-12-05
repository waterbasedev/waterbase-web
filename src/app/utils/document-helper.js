import { generateRandomString } from "./string-manipulation.js";

export function nestDocuments(docs, parentId = null) {
  return docs
    .filter((doc) => doc.parent_id === parentId)
    .map((doc) => ({
      ...doc,
      children: nestDocuments(docs, doc.id),
    }));
}

export async function calculatePath(documents, parentId) {
  let path = [];
  while (parentId) {
    const parentDoc = documents.find((doc) => doc.id === parentId);
    if (parentDoc) {
      path.unshift(parentDoc.title);
      parentId = parentDoc.parent_id;
    } else {
      break;
    }
  }
  return path;
}

export function isDescendant(parent, child, documents) {
  if (parent.id === child.parent_id) {
    return true;
  }
  const parentFolder = findDocFromId(documents, child.parent_id);
  return parentFolder ? isDescendant(parent, parentFolder, documents) : false;
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
  console.log("Creating new document:", newDoc);
  fetch("/api/documents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newDoc),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("New document created:", data);
      setDocuments([...documents, data]);
      console.log("Documents:", [...documents, data]);
    })
    .catch((error) => {
      console.error("Error creating new document:", error);
    });
}
