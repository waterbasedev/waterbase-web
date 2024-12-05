import React, { useCallback, useMemo } from "react";
import { deleteItem, updateDocument, refreshDocuments } from "@/app/utils/api";
import DocumentHeader from "./DocumentHeader";
import DocumentEditor from "./DocumentEditor";
import HomeScreen from "./Homescreen";
import DocumentRenderer from "./DocumentRenderer";
import DocumentContextPanel from "./DocumentContextPanel";
import styles from "./documentViewer.module.css";
import { findDocFromId } from "@/app/utils/document-helper";

export default function DocumentViewer({
  documents,
  setDocuments,
  selectedItem,
  setSelectedItem,
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [contextItem, setContextItem] = React.useState(null);
  const [contextVisible, setContextVisible] = React.useState(false);

  const openContextPanel = (docId) => {
    const secondaryDoc = findDocFromId(documents, docId);
    if (secondaryDoc) {
      setContextItem(secondaryDoc);
      setContextVisible(true);
    }
  };

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
    return <HomeScreen documents={documents} setSelectedItem={setSelectedItem} />;
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
            console.log("Document in DocumentViewer:", selectedItem.title),
            console.log("Document path in DocumentViewer:", selectedItem.path),
        <div className={styles.documentContent}>
          <DocumentRenderer
            content={selectedItem.content}
            onLinkClick={openContextPanel}
          />
          {contextVisible && contextItem && (
            <DocumentContextPanel
              document={contextItem}
              onClose={() => setContextVisible(false)}
              onSetActive={setSelectedItem}
              onLinkClick={openContextPanel}
            />
          )}
        </div>
      )}
    </div>
  );
}
