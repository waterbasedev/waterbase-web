'use client';

import React, { useEffect } from 'react';
import { Plus, ChevronDown, Edit, Trash2, Search, Folder, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ReactMde from 'react-mde';
import Showdown from 'showdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import './globals.css';

export default function KnowledgeBase() {
    const [documents, setDocuments] = React.useState([]);
    const [selectedDoc, setSelectedDoc] = React.useState(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [editContent, setEditContent] = React.useState('');
    const [editTitle, setEditTitle] = React.useState('');
    const [selectedTab, setSelectedTab] = React.useState('write');
    const [collapsedFolders, setCollapsedFolders] = React.useState({});

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch('/api/documents');
                if (!response.ok) throw new Error('Failed to fetch documents');
                const data = await response.json();
                const nestDocuments = (docs, parentId = null) => {
                    return docs
                        .filter(doc => doc.parent_id === parentId)
                        .map(doc => ({ ...doc, children: nestDocuments(docs, doc.id) }));
                };
                setDocuments(nestDocuments(data));
            } catch (error) {
                console.error('Error fetching documents:', error);
                alert('Failed to fetch documents. Please try again.');
            }
        };

        fetchDocuments();
    }, []);

    const converter = new Showdown.Converter();

    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    const handleNewDocument = () => {
        const newDoc = {
            id: generateRandomString(6),
            title: `New Document ${documents.length + 1}`,
            type: 'document',
            content: '# New Document\n\nStart writing here...'
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
    };

    const refreshDocuments = () => {
        fetch('/api/documents')
            .then(response => response.json())
            .then(data => {
                const nestDocuments = (docs, parentId = null) => {
                    return docs
                        .filter(doc => doc.parent_id === parentId)
                        .map(doc => ({ ...doc, children: nestDocuments(docs, doc.id) }));
                };
                setDocuments(nestDocuments(data));
            })
            .catch(error => {
                console.error('Error fetching documents:', error);
                alert('Failed to fetch documents. Please try again.');
            });
    };

    const handleNewFolder = () => {
        const newFolder = {
            id: generateRandomString(6),
            title: `New Folder ${documents.length + 1}`,
            type: 'folder',
            content: '', // Folders typically don't have content
            parent_id: null // Adjust as needed if you want to support nested folders
        };
        fetch('/api/documents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newFolder)
        })
            .then(response => response.json())
            .then(data => setDocuments([...documents, data]));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = () => {
        setIsEditing(true);
        setEditContent(selectedDoc.content);
        setEditTitle(selectedDoc.title);
    };

    const updateDocument = (updatedDoc) => {
        return fetch(`/api/documents`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedDoc)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update document');
                }
                return response.json(); // Parse the JSON response to get the updated document data
            })
            .then(data => {
                // Re-fetch and update the documents
                refreshDocuments();
                return data; // Return the updated document data
            })
            .catch(error => {
                console.error('Error updating document:', error);
                alert('Failed to update document. Please try again.');
            });
    }

    const handleSave = () => {
        const updatedDoc = { ...selectedDoc, title: editTitle, content: editContent };
        updateDocument(updatedDoc)
            .then(data => {
                if (data) {
                    // Set the active document to the updated document
                    setSelectedDoc(data);
                    setIsEditing(false);
                }
            })
            .catch(error => {
                console.error('Error saving document:', error);
                alert('Failed to save document. Please try again.');
            });
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            fetch(`/api/documents`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: selectedDoc.id })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to delete document');
                    }
                    return response.json();
                })
                .then(() => {
                    // Re-fetch and update the documents
                    refreshDocuments();
                    setSelectedDoc(null);
                })
                .catch(error => {
                    console.error('Error deleting document:', error);
                    alert('Failed to delete document. Please try again.');
                });
        }
    };

    const collapseFolder = (folder) => {
        setCollapsedFolders(prevState => ({
            ...prevState,
            [folder.id]: !prevState[folder.id]
        }));
    };

    const handleDragStart = (e, item) => {
        e.dataTransfer.setData('item', JSON.stringify(item));
        console.log('Item to drag:', item);
    };

    const findDocfromId = (docId, docs = documents) => {
        for (const doc of docs) {
            if (doc.id === docId) {
                return doc;
            }
            // Recursively search for the document in the child documents, if any
            if (doc.children) {
                const foundDoc = findDocfromId(docId, doc.children);
                if (foundDoc) {
                    return foundDoc;
                }
            }
        }
    };


    const handleDrop = (e, dropTarget) => {
        const docToUpdate = JSON.parse(e.dataTransfer.getData('item'));
        console.log('dropping item:', docToUpdate.title, 'into target:', dropTarget.title);
        console.log('Documents:', documents);

        if (docToUpdate) {
            // Prevent dropping a folder into itself
            if (docToUpdate.id === dropTarget.id) {
                console.log('Cannot drop', docToUpdate.title, 'into itself.');
                return;
            }

            if (docToUpdate.type === 'folder' && docToUpdate.children) {
                // Prevent dropping a folder into one of its descendants
                const isDescendant = (parent, child) => {
                    if (parent.id === child.parent_id) {
                        return true;
                    }
                    const parentFolder = findDocfromId(child.parent_id);
                    return parentFolder ? isDescendant(parent, parentFolder) : false;
                };

                if (docToUpdate.type === 'folder' && isDescendant(docToUpdate, dropTarget)) {
                    alert('Cannot drop a folder into one of its descendants.');
                    return;
                }
            }

            // Check if the drop target is a document
            if (dropTarget.type === 'document') {
                // Find the parent folder of the target document
                const parentFolder = findDocfromId(dropTarget.parent_id);
                console.log('Parent folder:', dropTarget.parent_id, parentFolder);
                if (parentFolder) {
                    dropTarget = parentFolder;
                } else {
                    // Set parent_id to null if there is no parent folder
                    dropTarget = { id: null };
                }
            }

            const updatedDoc = { ...docToUpdate, parent_id: dropTarget.id };

            // Update the document in the database
            updateDocument(updatedDoc)
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const renderDocuments = (docs) => {
        const folders = docs.filter(doc => doc.type === 'folder');
        const documents = docs.filter(doc => doc.type !== 'folder');

        return (
            <>
                {folders.map(folder => (
                    <div
                        id={folder.id}
                        key={folder.id}
                        className="folder"
                        draggable
                        onDragStart={(e) => {
                            e.stopPropagation();
                            handleDragStart(e, folder);
                        }}
                        onDrop={(e) => {
                            e.stopPropagation();
                            handleDrop(e, folder);
                        }}
                        onDragOver={(e) => {
                            e.stopPropagation();
                            handleDragOver(e);
                        }}
                    >
                        <div className="folder-item" onClick={() => setSelectedDoc(folder)}>
                            <button className='folder-collapse' onClick={(e) => { e.stopPropagation(); collapseFolder(folder); }} style={{ float: 'right', transition: 'transform 0.3s' }}>
                                <ChevronDown size={20} style={{ transform: collapsedFolders[folder.id] ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                            </button>
                            <Folder size={20} /> <strong>{folder.title}</strong>
                        </div>
                        <div className="folder-children" style={{ display: collapsedFolders[folder.id] ? 'none' : 'block' }}>
                            {renderDocuments(folder.children || [])}
                        </div>
                    </div>
                ))}
                {documents.map(doc => (
                    <div
                        key={doc.id}
                        className="document-item"
                        draggable
                        onDragStart={(e) => {
                            e.stopPropagation();
                            handleDragStart(e, doc);
                        }}
                        onDrop={(e) => {
                            e.stopPropagation();
                            handleDrop(e, doc);
                        }}
                        onDragOver={(e) => {
                            e.stopPropagation();
                            handleDragOver(e);
                        }}
                        onClick={() => setSelectedDoc(doc)}
                    >
                        <FileText size={20} />{doc.title}
                    </div>
                ))}
            </>
        );
    };

    const handleDropOutside = (e) => {
        e.preventDefault();
        const docToUpdate = JSON.parse(e.dataTransfer.getData('item'));
        console.log('Dropping item outside:', docToUpdate.title);

        if (docToUpdate) {
            const updatedDoc = { ...docToUpdate, parent_id: null };

            // Update the document in the database
            updateDocument(updatedDoc)
        }
    };

    return (
        <div className="knowledge-base">
            <div className="side-panel">
                <div className="panel-header">
                    <img src="/bulb.svg" alt="Logo" className="header-logo" />
                    <text>WaterBase</text>
                </div>
                <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>

                <div
                    className="documents-list"
                    onDrop={handleDropOutside}
                    onDragOver={(e) => e.preventDefault()}
                >
                    {renderDocuments(filteredDocs)}
                </div>

                <button className="new-folder-button" onClick={handleNewFolder}>
                    <Plus size={20} />
                    New Folder
                </button>

                <button className="new-doc-button" onClick={handleNewDocument}>
                    <Plus size={20} />
                    New Document
                </button>
            </div>

            <div className="document-viewer">
                {selectedDoc ? (
                    <>
                        <div className="document-header">
                            <h2>{selectedDoc.title}</h2>
                            <div className="document-actions">
                                <button className="edit-button" onClick={handleEdit}>
                                    <Edit size={18} />
                                    Edit
                                </button>
                                <button className="delete-button" onClick={handleDelete}>
                                    <Trash2 size={18} />
                                    Delete
                                </button>
                            </div>
                        </div>
                        {isEditing ? (
                            <div className="editor-container">
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="title-editor"
                                />
                                <ReactMde
                                    value={editContent}
                                    onChange={setEditContent}
                                    selectedTab={selectedTab}
                                    onTabChange={setSelectedTab}
                                    generateMarkdownPreview={markdown =>
                                        Promise.resolve(converter.makeHtml(markdown))
                                    }
                                />
                                <div className="editor-actions">
                                    <button className="cancel-button" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </button>
                                    <button className="save-button" onClick={handleSave}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="document-content">
                                <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="no-selection">
                        Select a document to view
                    </div>
                )}
            </div>
        </div>
    );
}
