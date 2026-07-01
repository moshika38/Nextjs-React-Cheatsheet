"use client";

import { useState } from "react";
import Portal from "./components/Portal";

export default function Home() {
   const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 gap-4">
      <h1 className="text-3xl font-bold mb-4">Multi-Modal Example</h1>
      
      {/* Button 1 */}
      <button
        onClick={() => setIsAddOpen(true)}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Open Add Modal
      </button>

      {/* Button 2 */}
      <button
        onClick={() => setIsDeleteOpen(true)}
        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Open Delete Modal
      </button>

      {/* --- 1   POPUP   (Add Form) --- */}
      {isAddOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4">➕ Add New Item</h2>
              <p className="text-gray-600 mb-6">Items add form here</p>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </Portal>
      )}

      {/* --- 2   POPUP   (Delete Alert) --- */}
      {isDeleteOpen && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Delete Item</h2>
              <p className="text-gray-600 mb-6">Are You sure you want to delete this item?</p>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 bg-red-600 text-white rounded-lg">Yes, Delete</button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </main>
  );
}