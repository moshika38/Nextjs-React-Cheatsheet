# Next.js Portals 

This is a clean, production-ready example of implementing **React Portals** in a **Next.js (App Router)** application, beautifully styled using **Tailwind CSS**. 

Portals provide a way to render children into a DOM node that exists outside the DOM hierarchy of the parent component. This is the gold standard for building **Modals, Tooltips, Dropdowns, and Notifications**.

---

## 📂 Project Structure

To use portals correctly in Next.js without causing Server-Side Rendering (SSR) issues, the files should be structured as follows:

```text
├── app/
│   ├── layout.tsx     # Defines the <div id="portal-root"></div>
│   └── page.tsx       # Main page controlling multiple modals using Tailwind
└── components/
    └── Portal.tsx     # The reusable Portal wrapper component (Client Component)
```

---


## 🛠️ Code Setup
### 1. The Destination (app/layout.tsx)
 ```tsx
 export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {/* All portals will mount here, outside the main application tree */}
        <div id="portal-root"></div>
      </body>
    </html>
  );
}
```

---


## 2. The Reusable Wrapper (components/Portal.tsx)
```tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const portalRoot = document.getElementById("portal-root");
  return portalRoot ? createPortal(children, portalRoot) : null;
}
```

---

## 3. 3. Controlling Multiple Modals (app/page.tsx)


```tsx
const [isAddOpen, setIsAddOpen] = useState(false);
```

---

```tsx
<button
    onClick={() => setIsAddOpen(true)}
    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
```

---

```tsx
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
```


---
---

### (app/page.tsx) 
```tsx
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
```




