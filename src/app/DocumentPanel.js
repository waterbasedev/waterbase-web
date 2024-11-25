import React from 'react';
import ReactMarkdown from 'react-markdown';
import './documentPanel.css';

const DocumentPanel = ({ document, onClose }) => {
    if (!document) return null;

    return (
        <div className="second-document-panel">
            <div className="document-header">
                <h2>{document.title}</h2>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
            <div className="document-text">
                <ReactMarkdown>{document.content}</ReactMarkdown>
            </div>
        </div>
    );
};

export default DocumentPanel;
