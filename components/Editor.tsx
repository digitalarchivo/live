"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, serverTimestamp } from "@/firebase";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Editor = ({ user }: { user: any }) => {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const docId = "global-doc"; // Shared document ID

  // Real-time sync
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "documents", docId), (doc) => {
      if (doc.exists()) setContent(doc.data().content);
    });
    return () => unsubscribe();
  }, []);

  // Auto-save to Firestore
  const handleSave = async (value: string) => {
    setContent(value);
    setIsSaving(true);
    await updateDoc(doc(db, "documents", docId), {
      content: value,
      updatedAt: serverTimestamp(),
      updatedBy: user.displayName,
    });
    setIsSaving(false);
  };

  // Quill toolbar config
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
          <h1 className="text-2xl font-bold">Live Collaborative Editor</h1>
          {isSaving && (
            <span className="text-sm opacity-80">Saving changes...</span>
          )}
        </div>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleSave}
          modules={modules}
          className="min-h-[500px]"
        />
      </div>
    </div>
  );
};

export default Editor; 