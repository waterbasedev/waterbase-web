import React, { useCallback, useMemo } from "react";
import { deleteItem, updateDocument, refreshDocuments } from "@/app/utils/api";
import DocumentHeader from "./DocumentHeader";
import DocumentEditor from "./DocumentEditor";
import DocumentRenderer from "./DocumentRenderer";
import styles from "./documentViewer.module.css";

export default function DocumentViewer({
  documents,
  setDocuments,
  selectedItem,
  setSelectedItem,
}) {
  const [isEditing, setIsEditing] = React.useState(false);

  const handleSave = useCallback(
    (editedDocument) => {
      const updatedDoc = {
        ...selectedItem,
        ...editedDocument,
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
    },
    [selectedItem, setDocuments, setSelectedItem]
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    deleteItem(documents, selectedItem, setDocuments, setSelectedItem);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
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
        <DocumentEditor
          initialTitle={selectedItem.title}
          initialContent={selectedItem.content}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      ) : (
        <DocumentRenderer content={selectedItem.content} />
      )}
    </div>
  );
}
