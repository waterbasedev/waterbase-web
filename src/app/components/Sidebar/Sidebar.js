import React, { useState } from "react";
import { Plus, Search, Folder, FileText, ChevronDown } from "lucide-react";
import { updateDocument, refreshDocuments } from "@/app/utils/api";
import {
  isDescendant,
  findDocFromId,
  handleNewItem,
} from "@/app/utils/document-helper";
import styles from "./Sidebar.module.css";

const Sidebar = ({ documents, setDocuments, setSelectedItem, selectedItem }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsedFolders, setCollapsedFolders] = React.useState({});

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const recursiveSearch = (docs, term) => {
    let result = [];
    docs.forEach((doc) => {
      if (
        doc.title.toLowerCase().includes(term.toLowerCase()) ||
        doc.content.toLowerCase().includes(term.toLowerCase())
      ) {
        result.push(doc);
      }
      if (doc.children && doc.children.length > 0) {
        result = result.concat(recursiveSearch(doc.children, term));
      }
    });
    return result;
  };

  const filteredDocs = searchTerm
    ? recursiveSearch(documents, searchTerm)
    : documents;

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
    
    console.log(1);

      if (docToUpdate.type === "folder" && docToUpdate.children) {
        if (
          isDescendant(docToUpdate, dropTarget, documents)
        ) {
          alert("Cannot drop a folder into one of its descendants.");
          return;
        }
      }

      console.log(2);

      if (dropTarget.type === "document") {
        const parentFolder = findDocFromId(documents, dropTarget.parent_id);
        if (parentFolder) {
          dropTarget = parentFolder;
        } else {
          dropTarget = { id: null };
        }
      }

      console.log(3);

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
    const folderItems = docs.filter((doc) => doc.type === "folder");
    const documentItems = docs.filter((doc) => doc.type !== "folder");

    return (
      <>
        {folderItems.map((folder) => (
          <div
            key={folder.id}
            className={styles.folder}
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
              className={`${styles.sidebarItem} ${selectedItem?.id === folder.id ? styles.selectedItem : ""}`}
              onClick={() => setSelectedItem(folder)}
            >
              <button
                className={styles.folderCollapse}
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
              className={styles.folderChildren}
              style={{
                display: collapsedFolders[folder.id] ? "none" : "block",
              }}
            >
              {renderDocuments(folder.children || [])}
            </div>
          </div>
        ))}
        {documentItems.map((doc) => (
          <div
            key={doc.id}
            className={`${styles.sidebarItem} ${selectedItem?.id === doc.id ? styles.selectedItem : ""}`}
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
    <div className={styles.sidePanel}>
      <div className={styles.panelHeader} onClick={() => setSelectedItem(null)}>
        <img src="/bulb.svg" alt="Logo" className={styles.headerLogo} />
        <text>WaterBase</text>
      </div>
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      <div
        className={styles.documentsList}
        onDrop={handleDropOutside}
        onDragOver={(e) => e.preventDefault()}
      >
        {renderDocuments(filteredDocs)}
      </div>

      <button
        className={styles.newFolderButton}
        onClick={() => handleNewItem(documents, setDocuments, "folder")}
      >
        <Plus size={20} />
        New Folder
      </button>

      <button
        className={styles.newDocButton}
        onClick={() => handleNewItem(documents, setDocuments, "document")}
      >
        <Plus size={20} />
        New Document
      </button>
    </div>
  );
};

export default Sidebar;
