"use client";
import { useState, useEffect } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import Editor from "../components/Editor";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    await signInWithPopup(auth, provider);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg"></div>
              <span className="font-bold text-gray-900">LiveEdit</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <img
                    src={user.photoURL}
                    className="w-8 h-8 rounded-full"
                    alt={user.displayName}
                  />
                  <button
                    onClick={() => signOut(auth)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="py-12">
        {user ? (
          <Editor user={user} />
        ) : (
          <div className="max-w-4xl mx-auto text-center px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Edit in Real-Time, Together
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              A collaborative editor with elite design and instant sync.
            </p>
            <button
              onClick={handleLogin}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition transform hover:-translate-y-1 shadow-lg"
            >
              Start Editing
            </button>
          </div>
        )}
      </div>
    </main>
  );
}