import React from "react";
import DocumentRenderer from "./DocumentRenderer";
import styles from "./documentViewer.module.css";

const ContextPanel = ({ document, onClose, onSetActive, onLinkClick }) => {
  console.log("Document in ContextPanel:", document);
  if (!document) return null;

  const handleSetActive = () => {
    onSetActive(document);
    onClose();
  };

  return (
    <div className={styles.contextPanel}>
      <div className={styles.contextActions}>
        <button className={styles.setActiveButton} onClick={handleSetActive}>
          « Open
        </button>
        <button className={styles.closeContext} onClick={onClose}>
          Close
        </button>
      </div>
      <div className={styles.contextHeader}>
        <h2>{document.title}</h2>
      </div>
      <DocumentRenderer content={document.content} onLinkClick={onLinkClick} />
    </div>
  );
};

export default ContextPanel;
