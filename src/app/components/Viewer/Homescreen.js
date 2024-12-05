import React from "react";
import styles from "./documentViewer.module.css";

const HomeScreen = ({ documents, setSelectedItem }) => {
  const rootFolders = documents.filter(doc => doc.type === 'folder' && doc.parent_id === null);

  const handleButtonClick = (doc) => {
    setSelectedItem(doc);
  };

  return (
    <div className={styles.homeScreen}>
      <div className={styles.bentoBox}>
        <div className={styles.leftColumn}>
          <div className={styles.box}>
            <img src="/simple_line.png" alt="Simple Line" />
          </div>
          <div className={styles.box}>
            <img src="/simple_bar.png" alt="Simple Bar" />
          </div>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.box}>
            <img src="/aarhus_kort.jpg" alt="Aarhus Kort" />
          </div>
        </div>
      </div>
      <div className={styles.bottomRow}>
        {rootFolders.map((doc) => (
          <button
            key={doc.id}
            className={styles.bottomRowButton}
            onClick={() => handleButtonClick(doc)}
          >
            {doc.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
