import React from 'react';
import CustomMarkdown from './CustomMarkdown';
import styles from "./contextPanel.module.css";

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
                <button className={styles.setActiveButton} onClick={handleSetActive}>« Open</button>
                <button className={styles.closeContext} onClick={onClose}>Close</button>    
            </div> 
            <div className={styles.documentHeader}>
                <h2>{document.title}</h2>
            </div>
            <div className={styles.documentText}>
                <CustomMarkdown content={document.content} onLinkClick={onLinkClick} />
            </div>
        </div>
    );
};

export default ContextPanel;
