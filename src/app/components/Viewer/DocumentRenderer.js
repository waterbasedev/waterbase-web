import React from "react";
import ReactMarkdown from "react-markdown";
import styles from "./documentViewer.module.css";

export default function DocumentContent({ content }) {
  return (
    <div className={styles.documentContent}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
