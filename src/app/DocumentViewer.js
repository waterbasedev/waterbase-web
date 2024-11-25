import React from 'react';
import ReactMarkdown from 'react-markdown';
import ReactMde from 'react-mde';
import Showdown from 'showdown';
import { Edit, Trash2 } from 'lucide-react';
import 'react-mde/lib/styles/css/react-mde-all.css';

const DocumentViewer = ({ document, isEditing, setIsEditing, editContent, setEditContent, editTitle, setEditTitle, selectedTab, setSelectedTab, handleEdit, handleSave, handleDelete }) => {
    const converter = new Showdown.Converter();

    return (
        <div className="document-viewer">
            {document ? (
                <>
                    <div className="document-header">
                        <h2>{document.title}</h2>
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
                            <ReactMarkdown>{document.content}</ReactMarkdown>
                        </div>
                    )}
                </>
            ) : (
                <div className="no-selection">
                    Select a document to view
                </div>
            )}
        </div>
    );
};

export default DocumentViewer;
