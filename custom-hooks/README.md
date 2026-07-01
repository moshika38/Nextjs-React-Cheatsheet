Here is the complete, professional `README.md` file tailored exactly to your code structure, written in English.

```markdown
# Next.js Custom Hooks (Data Fetching Guide)

This project demonstrates how to implement a clean, reusable data-fetching architecture in Next.js using **Custom Hooks** and TypeScript.

---

## 💡 What is a Custom Hook?

A **Custom Hook** is a specialized JavaScript function whose name starts with `use` and that can call other Hooks. It allows you to extract component logic (like `useEffect` and `fetch` operations) into reusable functions.

### 🎯 Key Benefits:
* **Code Reusability**: The same fetching logic can be reused across multiple components and different API endpoints.
* **Separation of Concerns**: It cleanly separates your data-fetching and state management logic from the visual UI presentation layer.
* **Clean & Readable Components**: Components remain small, declarative, and focused solely on rendering the UI.

---

## 📂 Project Architecture & Codebase

### 1. The Custom Hook: `hooks/useFetch.js`
This generic hook accepts a URL parameter, executes the HTTP request, and manages three crucial states: `data`, `loading`, and `error`.

```javascript
import { useState, useEffect } from 'react';

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Successful fetch data !");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);  

  return { data, loading, error };
}

```

### 2. The Consumer Component: `components/UserList.tsx`

This Client Component consumes the `useFetch` hook. It securely maps the endpoint using a public environment variable and utilizes TypeScript **Type Casting (`as any as Student[]`)** to enforce type safety on the untyped hook data.

```tsx
"use client";
import useFetch from '../hooks/useFetch';

interface Student {
  id: string | number;
  name: string;
  class: string;
  email: string;
}

export default function UserList() {
  // Constructing the endpoint securely via public environment variables
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/students`;
  const { data, loading, error } = useFetch(apiUrl);

  // Casting data to the specific Student array schema
  const users = data as any as Student[];

  if (loading) return <p>Loading users... </p>;
  if (error) return <p>Error: {error} </p>;

  return (
    <ul>
      {users?.map((user) => (
        <div key={user.id} className="mb-3 flex gap-5 items-center">
          <li className="font-medium">{user.id}</li>
          <li className="font-medium">{user.name}</li>
          <li className="text-sm text-slate-500">{user.email}</li>
          <li className="text-sm text-slate-500">{user.class}</li>
        </div>
      ))}
    </ul>
  );
}

```

### 3. The Page: `app/page.tsx`

The primary layout file serving as the entry point where the `UserList` component is rendered inside a centralized layout.

```tsx
import UserList from "./components/UserList";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <h1 className="mb-20 text-2xl font-bold">User List</h1>
      <UserList/>
    </div>
  );
}

```

---

## 🛠️ Key Technical Best Practices Applied

1. **Environment Variable Prefixing**: In Client Components, environment variables must be explicitly prefixed with `NEXT_PUBLIC_` (e.g., `NEXT_PUBLIC_API_URL`). Without this prefix, Next.js blocks access to protect server-side values, resulting in `undefined` on the browser.
2. **React DOM Key Assignment**: Inside `.map()`, the `key` prop must be assigned to the topmost structural wrapper element (the `<div>` in this case) rather than inner `<li>` tags to allow React's virtual DOM to track changes efficiently.
3. **HTML Semantic Layouts**: Multiple block elements returned inside a loop are safely contained within a parent wrapper, ensuring the semantic correctness of JSX parsing.





