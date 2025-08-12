"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, serverTimestamp } from "../firebase";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { motion, AnimatePresence } from "framer-motion";

const Editor = ({ user }: { user: any }) => {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const docId = "global-doc";

  // Real-time sync
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "documents", docId), (doc) => {
      if (doc.exists()) {
        setContent(doc.data().content);
        setActiveUsers(doc.data().activeUsers || 0);
      }
    });
    return () => unsubscribe();
  }, []);

  // Auto-save with debounce
  const handleSave = async (value: string) => {
    setContent(value);
    setIsSaving(true);
    await updateDoc(doc(db, "documents", docId), {
      content: value,
      updatedAt: serverTimestamp(),
      updatedBy: user.displayName,
      activeUsers: activeUsers + 1
    });
    setTimeout(() => setIsSaving(false), 1000);
  };

  // Custom toolbar with premium icons
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"]
    ],
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      {/* Glassmorphism Header */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Live Collaborative Editor</h1>
              <p className="text-violet-200 mt-1">Editing in real-time with {activeUsers} others</p>
            </div>
            <AnimatePresence>
              {isSaving && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full"
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm">Saving...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Premium Editor */}
        <div className="p-1 bg-gradient-to-r from-violet-100 to-indigo-100">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={handleSave}
            modules={modules}
            className="bg-white rounded-xl shadow-inner min-h-[600px]"
          />
        </div>
      </div>

      {/* User Avatars */}
      <div className="flex -space-x-3 mb-8">
        {[...Array(activeUsers)].map((_, i) => (
          <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
            {user?.displayName?.[0] || "U"}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Editor; 