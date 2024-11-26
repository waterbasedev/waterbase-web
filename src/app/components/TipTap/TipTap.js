"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Tiptap = () => {
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: `<p>Hello World! 🌎️</p>`,
    editable: false, // Default to read-only
  });

  // Sync editor's editable state and focus when editing
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
      if (isEditing) {
        editor.commands.focus(); // Focus editor when entering edit mode
      }
    }
  }, [isEditing, editor]);

  return (
    <>
      <button onClick={() => setIsEditing((prev) => !prev)}>
        {isEditing ? "Save" : "Edit"}
      </button>
      {editor && <EditorContent editor={editor} />}
    </>
  );
};

export default Tiptap;
