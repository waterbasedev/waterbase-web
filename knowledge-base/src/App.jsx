import React, { useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Folder, FileText } from 'lucide-react';
import ReactHtmlParser from 'react-html-parser';
import Tiptap from './tiptap';
import './App.css';

function App() {
  const [documents, setDocuments] = React.useState([]);
  const [selectedDoc, setSelectedDoc] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [editContent, setEditContent] = React.useState('');
  const [editTitle, setEditTitle] = React.useState('');

  useEffect(() => {
    console.log('Selected Document:', selectedDoc);
  }, [selectedDoc]);

  useEffect(() => {
    fetch('http://localhost:5000/documents')
      .then(response => response.json())
      .then(data => setDocuments(data));
  }, []);

  const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleNewDocument = () => {
    const newDoc = {
      id: generateRandomString(8),
      title: `New Document ${documents.length + 1}`,
      type: 'document',
      content: '<p>Start writing here...</p>'
    };
    fetch('http://localhost:5000/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newDoc)
    })
    .then(response => response.json())
    .then(data => setDocuments([...documents, data]));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(selectedDoc.content);
    setEditTitle(selectedDoc.title);
  };

  const handleSave = () => {
    const updatedDoc = { ...selectedDoc, title: editTitle, content: editContent };
    fetch(`http://localhost:5000/documents/${selectedDoc.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedDoc)
    })
    .then(response => response.json())
    .then(data => {
      setDocuments(documents.map(doc => 
        doc.id === selectedDoc.id 
          ? data
          : doc
      ));
      setSelectedDoc(data);
      setIsEditing(false);
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      fetch(`http://localhost:5000/documents/${selectedDoc.id}`, {
        method: 'DELETE'
      })
      .then(() => {
        setDocuments(documents.filter(doc => doc.id !== selectedDoc.id));
        setSelectedDoc(null);
      });
    }
  };

  const collapseFolder = (folder) => {
    const folderElement = document.getElementById(folder.id);
    const childrenElement = folderElement.querySelector('.folder-children');
    childrenElement.classList.toggle('collapsed');
  };

  const renderDocuments = (docs) => {
    return docs.map(doc => {
      if (doc.type === 'folder') {
        return (
          <div id={doc.id} key={doc.id} className="folder">
            <div className="folder-item" onClick={() => collapseFolder(doc)}>
              <Folder size={20} /> {doc.title}
            </div>
            <div className="folder-children">
              {renderDocuments(doc.children)}
            </div>
          </div>
        );
      } else {
        return (
          <div 
            id={doc.id}
            key={doc.id} 
            className={`document-item ${selectedDoc?.id === doc.id ? 'selected' : ''}`} 
            onClick={() => setSelectedDoc(doc)}
          >
            <FileText size={20} /> {doc.title}
          </div>
        );
      }
    });
  };

  return (
    <div className="knowledge-base">
      <div className="side-panel">
        <div className="panel-header">
          <img src="/bulb.svg" alt="Logo" className="header-logo"/>
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

        <div className="documents-list">
          {renderDocuments(filteredDocs)}
        </div>

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

                <div className="document-editor">
                  <Tiptap content={editContent} onChange={setEditContent} />
                </div>
                
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
                {ReactHtmlParser(selectedDoc.content)}
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

export default App;
