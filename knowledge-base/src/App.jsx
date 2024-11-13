import React, { useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ReactMde from 'react-mde';
import Showdown from 'showdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import './App.css';

function App() {
  const [documents, setDocuments] = React.useState([]);
  const [selectedDoc, setSelectedDoc] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [editContent, setEditContent] = React.useState('');
  const [editTitle, setEditTitle] = React.useState('');
  const [selectedTab, setSelectedTab] = React.useState('write');

  useEffect(() => {
    fetch('http://localhost:5000/documents')
      .then(response => response.json())
      .then(data => setDocuments(data));
  }, []);

  const handleNewDocument = () => {
    const newDoc = {
      id: documents.length + 1,
      title: `New Document ${documents.length + 1}`,
      content: '# New Document\n\nStart writing here...'
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
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchTerm.toLowerCase())
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

  const converter = new Showdown.Converter();

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
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`document-item ${selectedDoc?.id === doc.id ? 'selected' : ''}`}
            >
              {doc.title}
            </div>
          ))}
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
                <ReactMde
                  value={editContent}
                  onChange={setEditContent}
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                  generateMarkdownPreview={markdown =>
                    Promise.resolve(converter.makeHtml(markdown))
                  }
                  childProps={{
                    writeButton: {
                      tabIndex: -1
                    }
                  }}
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

export default App;
