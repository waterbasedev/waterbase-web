import React, { useState } from "react";
import { Plus, Search, Folder, FileText, ChevronDown } from "lucide-react";
import { updateDocument, refreshDocuments } from "../utils/api";
import {
  isDescendant,
  findDocfromId,
  handleNewItem,
} from "../utils/document-helper";

const Sidebar = ({ documents, setDocuments, setSelectedItem }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsedFolders, setCollapsedFolders] = React.useState({});

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDocs = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const collapseFolder = (folder) => {
    setCollapsedFolders((prevState) => ({
      ...prevState,
      [folder.id]: !prevState[folder.id],
    }));
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("item", JSON.stringify(item));
    console.log("Item to drag:", item);
  };

  const handleDrop = (e, dropTarget) => {
    const docToUpdate = JSON.parse(e.dataTransfer.getData("item"));
    console.log(
      "dropping item:",
      docToUpdate.title,
      "into target:",
      dropTarget.title
    );
    console.log("Documents:", documents);

    if (docToUpdate) {
      if (docToUpdate.id === dropTarget.id) {
        console.log("Cannot drop", docToUpdate.title, "into itself.");
        return;
      }

      if (docToUpdate.type === "folder" && docToUpdate.children) {
        if (
          isDescendant(docToUpdate, dropTarget, (id) =>
            findDocfromId(id, documents)
          )
        ) {
          alert("Cannot drop a folder into one of its descendants.");
          return;
        }
      }

      if (dropTarget.type === "document") {
        const parentFolder = findDocfromId(dropTarget.parent_id, documents);
        console.log("Parent folder:", dropTarget.parent_id, parentFolder);
        if (parentFolder) {
          dropTarget = parentFolder;
        } else {
          dropTarget = { id: null };
        }
      }

      const updatedDoc = { ...docToUpdate, parent_id: dropTarget.id };
      updateDocument(updatedDoc).then(() => refreshDocuments(setDocuments));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOutside = (e) => {
    e.preventDefault();
    const docToUpdate = JSON.parse(e.dataTransfer.getData("item"));
    console.log("Dropping item outside:", docToUpdate.title);

    if (docToUpdate) {
      const updatedDoc = { ...docToUpdate, parent_id: null };
      updateDocument(updatedDoc).then(() => refreshDocuments(setDocuments));
    }
  };

  const renderDocuments = (docs) => {
    const folders = docs.filter((doc) => doc.type === "folder");
    const documents = docs.filter((doc) => doc.type !== "folder");

    return (
      <>
        {folders.map((folder) => (
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
            <div
              className="folder-item"
              onClick={() => setSelectedItem(folder)}
            >
              <button
                className="folder-collapse"
                onClick={(e) => {
                  e.stopPropagation();
                  collapseFolder(folder);
                }}
                style={{ float: "right", transition: "transform 0.3s" }}
              >
                <ChevronDown
                  size={20}
                  style={{
                    transform: collapsedFolders[folder.id]
                      ? "rotate(-90deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s",
                  }}
                />
              </button>
              <Folder size={20} /> <strong>{folder.title}</strong>
            </div>
            <div
              className="folder-children"
              style={{
                display: collapsedFolders[folder.id] ? "none" : "block",
              }}
            >
              {renderDocuments(folder.children || [])}
            </div>
          </div>
        ))}
        {documents.map((doc) => (
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
            onClick={() => setSelectedItem(doc)}
          >
            <FileText size={20} />
            {doc.title}
          </div>
        ))}
      </>
    );
  };

  return (
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

      <button
        className="new-folder-button"
        onClick={() => handleNewItem(documents, setDocuments, "folder")}
      >
        <Plus size={20} />
        New Folder
      </button>

      <button
        className="new-doc-button"
        onClick={() => handleNewItem(documents, setDocuments, "document")}
      >
        <Plus size={20} />
        New Document
      </button>
    </div>
  );
};

export default Sidebar;