import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/app/utils/string-manipulation";

export default function DocumentHeader({ doc, onEdit, onDelete }) {
  return (
    <div className="document-header">
      <div className="document-header-title">
        <div>
          <h2>{doc.title}</h2>
        </div>
        <div className="document-actions">
          <button className="edit-button" onClick={onEdit}>
            <Edit size={18} />
            Edit
          </button>
          <button className="delete-button" onClick={onDelete}>
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
      <div className="document-header-metadata">
        <span className="doc-meta">
          <span className="meta-label">Date Created:</span>{" "}
          {formatDate(doc.date_created)}
        </span>
        <span className="doc-meta">
          <span className="meta-label">Last Edited:</span>{" "}
          {formatDate(doc.last_edited_time[doc.last_edited_time.length - 1])}
        </span>
        <span className="doc-meta">
          <span className="meta-label">Administered by:</span>
        </span>
      </div>
    </div>
  );
}
