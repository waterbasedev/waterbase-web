import React from "react";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import Showdown from "showdown";
import { deleteItem, updateDocument, refreshDocuments } from "@/app/utils/api";
import DocumentHeader from "./DocumentHeader";
import styles from "./documentViewer.module.css";

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

  if (!selectedItem) {
    return <div className={styles.noSelection}>Select a document to view</div>;
  }

  return (
    <div className={styles.documentViewer}>
      <DocumentHeader
        doc={selectedItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
          <ReactMarkdown>{selectedItem.content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
