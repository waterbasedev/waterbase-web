import React from "react";
import DocumentRenderer from "./DocumentRenderer";
import DocumentHeader from "./DocumentHeader";
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
      <DocumentHeader doc={document} />
      <DocumentRenderer content={document.content} onLinkClick={onLinkClick} />
    </div>
  );
};

export default ContextPanel;
