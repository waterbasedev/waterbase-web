import React from "react";
import ReactMde from "react-mde";
import Showdown from "showdown";
import { deleteItem, updateDocument, refreshDocuments } from "@/app/utils/api";
import DocumentHeader from "./DocumentHeader";
import CustomMarkdown from "./CustomMarkdown";
import ContextPanel from "./ContextPanel";
import styles from "./documentViewer.module.css";
import { findDocFromId } from "@/app/utils/document-helper";

export default function DocumentViewer({
  documents,
  setDocuments,
  selectedItem,
  setSelectedItem,
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState("");
  const [editTitle, setEditTitle] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState("write");
  const [secondaryItem, setSecondaryItem] = React.useState(null);
  const [isContextWindowVisible, setIsContextWindowVisible] =
    React.useState(false);

  const converter = new Showdown.Converter();

  const handleSave = () => {
    const updatedDoc = {
      ...selectedItem,
      title: editTitle,
      content: editContent,
    };
    updateDocument(updatedDoc)
      .then((data) => {
        if (data) {
          setSelectedItem(data);
          setIsEditing(false);
          refreshDocuments(setDocuments);
        }
      })
      .catch((error) => {
        console.error("Error saving document:", error);
        alert("Failed to save document. Please try again.");
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(selectedItem.content);
    setEditTitle(selectedItem.title);
  };

  const handleDelete = () => {
    deleteItem(documents, selectedItem, setDocuments, setSelectedItem);
  };

  const openContextWindow = (docId) => {
    const secondaryDoc = findDocFromId(documents, docId);
    if (secondaryDoc) {
      setSecondaryItem(secondaryDoc);
      setIsContextWindowVisible(true);
    }
  };

  const setActiveDocument = (document) => {
    setSelectedItem(document);
    setIsContextWindowVisible(false);
  };

  if (!selectedItem) {
    return <div className={styles.noSelection}>Select a document to view</div>;
  }

  return (
    <div className={styles.documentViewer}>
      <DocumentHeader
        doc={selectedItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onOpenContextWindow={openContextWindow}
      />
      {isEditing ? (
        <div className={styles.editorContainer}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className={styles.titleEditor}
          />
          <ReactMde
            value={editContent}
            onChange={setEditContent}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={(markdown) =>
              Promise.resolve(converter.makeHtml(markdown))
            }
          />
          <div className={styles.editorActions}>
            <button
              className={styles.cancelButton}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button className={styles.saveButton} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.documentContent}>
          <div className={styles.documentText}>
            <CustomMarkdown content={selectedItem.content} onLinkClick={openContextWindow} />
          </div>

          {isContextWindowVisible && secondaryItem && (
            <ContextPanel
              document={secondaryItem}
              onClose={() => setIsContextWindowVisible(false)}
              onSetActive={setActiveDocument}
              onLinkClick={openContextWindow}
            />
          )}
        </div>
      )}
    </div>
  );
}
