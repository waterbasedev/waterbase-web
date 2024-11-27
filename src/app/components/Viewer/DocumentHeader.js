import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/app/utils/string-manipulation";
import styles from "./documentViewer.module.css";

export default function DocumentHeader({ doc, onEdit, onDelete}) {
  return (
    <div className={styles.documentHeader}>
      <div className={styles.documentHeaderTitle}>
        <div>
          <h2>{doc.title}</h2>
        </div>
        <div className={styles.documentActions}>
          <button className={styles.editButton} onClick={onEdit}>
            <Edit size={18} />
            Edit
          </button>
          <button className={styles.deleteButton} onClick={onDelete}>
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
      <div className={styles.documentHeaderMetadata}>
        <span className={styles.docMeta}>
          <span className={styles.metaLabel}>Date Created:</span>{" "}
          {formatDate(doc.date_created)}
        </span>
        <span className={styles.docMeta}>
          <span className={styles.metaLabel}>Last Edited:</span>{" "}
          {formatDate(doc.last_edited_time[doc.last_edited_time.length - 1])}
        </span>
      </div>
    </div>
  );
}
