"use client";

import React, { useEffect } from "react";
import "react-mde/lib/styles/css/react-mde-all.css";
import "./globals.css";
import Sidebar from "@/app/components/Sidebar.js";
import { DocumentViewer } from "@/app/components/Viewer";
import { nestDocuments } from "@/app/utils/document-helper.js";
import { fetchDocuments } from "@/app/utils/api.js";

export default function KnowledgeBase() {
  const [documents, setDocuments] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState(null);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await fetchDocuments();
        setDocuments(nestDocuments(data));
      } catch (error) {
        alert("Failed to fetch documents. Please try again.");
      }
    };
    loadDocuments();
  }, []);
  return (
    <div className="knowledge-base">
      <Sidebar
        documents={documents}
        setDocuments={setDocuments}
        setSelectedItem={setSelectedItem}
      />
      <DocumentViewer
        documents={documents}
        setDocuments={setDocuments}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
    </div>
  );
}
