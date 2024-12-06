import { nestDocuments } from "./document-helper";
import { generateRandomString } from "./string-manipulation.js";

export const fetchDocuments = async () => {
    try {
        const response = await fetch('/api/documents');
        if (!response.ok) throw new Error('Failed to fetch documents');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
};

export const updateDocument = async (updatedDoc) => {
    console.log('Updating document:', updatedDoc);
    const originalPath = updatedDoc.path; // Save the original path

    try {
        const response = await fetch(`/api/documents`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedDoc)
        });
        if (!response.ok) {
            throw new Error('Failed to update document');
        }
        const data = await response.json();
        console.log('Document updated:', data);

        // Reattach the path and update the last entry with the new title
        if (originalPath) {
            data.path = [...originalPath.slice(0, -1), data.title];
        }

        return data;
    } catch (error) {
        console.error('Error updating document:', error);
        alert('Failed to update document. Please try again.');
    }
};

export const refreshDocuments = async (setDocuments) => {
    try {
        const data = await fetchDocuments();
        setDocuments(nestDocuments(data));
    } catch (error) {
        console.error('Error fetching documents:', error);
        alert('Failed to fetch documents. Please try again.');
    }
};

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
    .then((data) => {
        setDocuments([...documents, data]);
        return refreshDocuments(setDocuments); // Refresh documents after adding the new one
    })
    .catch((error) => {
        console.error("Error creating new document:", error);
    });
}

export const deleteItem = async (documents, selectedItem, setDocuments, setSelectedItem) => {
    const findChildDocuments = (folderId, docs) => {
        let childDocs = [];
        console.log(`Searching for child documents of folder with ID: ${folderId}`);
        
        // Find target folder
        const folder = docs.find(doc => doc.id === folderId);
        if (!folder) {
            console.log(`Folder with ID ${folderId} not found`);
            return childDocs;
        }
        
        console.log(`Found target folder with ID: ${folder.id}`);
        
        // Helper function to process folder and its children
        const processFolder = (folderDoc) => {
            if (folderDoc.children && Array.isArray(folderDoc.children)) {
                folderDoc.children.forEach(child => {
                    console.log(`Processing child with ID: ${child.id}, Type: ${child.type}`);
                    childDocs.push(child);
                    
                    if (child.type === 'folder') {
                        console.log(`Child ${child.id} is a folder, processing its children...`);
                        processFolder(child);
                    }
                });
            }
        };
        
        // Start processing from root folder
        processFolder(folder);
        
        console.log(`Total documents found for folder ${folderId}: ${childDocs.length}`);
        return childDocs;
    };

    if (selectedItem.type === 'document') {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                const response = await fetch(`/api/documents`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: selectedItem.id })
                });

                if (!response.ok) {
                    throw new Error('Failed to delete document');
                }

                await response.json();
                refreshDocuments(setDocuments);
                setSelectedItem(null);
            } catch (error) {
                console.error('Error deleting document:', error);
                alert('Failed to delete document. Please try again.');
            }
        }
    } else if (selectedItem.type === 'folder') {
        const childDocuments = findChildDocuments(selectedItem.id, documents);
        const totalDocuments = childDocuments.length; // including the folder itself

        if (window.confirm(`Are you sure you want to delete this folder and its ${totalDocuments} documents?`)) {
            try {
                const deleteRequests = childDocuments.map(doc => 
                    fetch(`/api/documents`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: doc.id })
                    })
                );

                deleteRequests.push(
                    fetch(`/api/documents`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: selectedItem.id })
                    })
                );

                const responses = await Promise.all(deleteRequests);

                if (responses.some(response => !response.ok)) {
                    throw new Error('Failed to delete some documents');
                }

                await Promise.all(responses.map(response => response.json()));
                refreshDocuments(setDocuments);
                setSelectedItem(null);
            } catch (error) {
                console.error('Error deleting folder and documents:', error);
                alert('Failed to delete folder and documents. Please try again.');
            }
        }
    }
};
