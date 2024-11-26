// DocumentEditor.js
import React from "react";
import ReactMde from "react-mde";
import Showdown from "showdown";
import styles from "./documentViewer.module.css";

export default function DocumentEditor({
  initialTitle,
  initialContent,
  onSave,
  onCancel,
}) {
  const [editTitle, setEditTitle] = React.useState(initialTitle);
  const [editContent, setEditContent] = React.useState(initialContent);
  const [selectedTab, setSelectedTab] = React.useState("write");

  const converter = new Showdown.Converter();

  const handleSave = () => {
    onSave({
      title: editTitle,
      content: editContent,
    });
  };

  return (
    <div className={styles.editorContainer}>
      <input
        type="text"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        className={styles.titleEditor}
        placeholder="Enter document title"
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
        <button className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button className={styles.saveButton} onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}
