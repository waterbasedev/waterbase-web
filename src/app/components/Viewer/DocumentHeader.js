import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { formatDate, arrayToPath } from "@/app/utils/string-manipulation";
import styles from "./documentViewer.module.css";

export default function DocumentHeader({ doc, onEdit, onDelete }) {
  return (
    <div className={styles.documentHeader}>

      <div className={styles.documentHeaderTop}>
        <div className={styles.documentHeaderTitle}>
            <span>{arrayToPath(doc.path)}</span>
            <h2>{doc.title}</h2>
        </div>

        <div className={styles.documentActions}>
          {onEdit && (
            <button className={styles.editButton} onClick={onEdit}>
              <Edit size={18} />
              Edit
            </button>
          )}
          {onDelete && (
            <button className={styles.deleteButton} onClick={onDelete}>
              <Trash2 size={18} />
              Delete
            </button>
          )}
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
        <span className={styles.docMeta}>
          <span className={styles.metaLabel}>Administered by:</span>
          {doc.administered_by}
        </span>
      </div>
    </div>
  );
}
