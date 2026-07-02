This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```markdown
# Next.js 15+ & Redux Toolkit (RTK) State Management Example

This project demonstrates how to clean and efficiently manage global state in **Next.js (App Router)** using **Redux Toolkit (RTK)**. It includes simple implementations of a Counter app and a Todo application to showcase best practices.

---

## 🚀 Core Concepts Covered
* **Global Store Configuration** using `configureStore`.
* **Feature-first Slice Design** using `createSlice`.
* **Client-side Providers Integration** in Next.js App Router (`'use client'`).
* **State Selection & Action Dispatching** using `useSelector` and `useDispatch`.

---

## 📂 Folder Structure

The project follows a scalable, feature-based architecture to separate UI from global state logic:

```text
my-app/
├── src/
│   ├── app/                      <-- Next.js UI Pages, Layouts & Redux Configuration
│   │   ├── layout.jsx            <-- Root Layout wrapping the App with Redux Provider
│   │   ├── page.jsx              <-- Main Application Entry Point (Home)
│   │   └── redux-provider.jsx    <-- Custom Client-side Wrapper for Redux Provider
│   └── features/                 <-- Feature-based modules
│   |   ├── counter/              <-- Counter Feature Module
│   |   │   ├── counterSlice.js   <-- Counter Actions & Reducers Logic
│   |   │   └── Counter.jsx       <-- Counter UI Component
│   |   └── todos/                <-- Todo Feature Module
│   |   |   ├── todoSlice.js      <-- Todo Actions & Reducers Logic
│   |   |   └── TodoPage.jsx      <-- Todo UI Component
|   └── redux/
|         └── store.js          <-- Global Redux Store Configuration

```

---

## 🛠️ Getting Started

### 1. Installation

Clone the repository, navigate into the project directory, and install the required dependencies:

```bash
npm install

```

*(Note: This project relies primarily on `@reduxjs/toolkit` and `react-redux`).*

### 2. Run the Local Development Server

To launch the app locally using Next.js (with Turbopack enabled), run:

```bash
npm run dev

```

Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)** to see the application in action.

---



| Provider            | RTK Toolkit                |
| ------------------- | -------------------------- |
| ChangeNotifier      | Redux Store                |
| notifyListeners()   | dispatch()                 |
| context.watch()     | useSelector()              |
| context.read()      | useDispatch()              |


---

## 01. app/features/counter/todoSlice.js 
```tsx
import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todos: [],
  },
  reducers: {
    addTodo: (state, action) => {
      state.todos.push({
        id: Date.now(),
        text: action.payload,
      });
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
  },
});

export const { addTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;

```
## 02. app/features/counter/TodoPage.jsx 
```tsx
"use client";
import React, { useState } from "react";
import { addTodo, deleteTodo } from "./todoSlice";
import { useDispatch, useSelector } from "react-redux";

export function TodoPage() {
   
  const [inputText, setInputText] = useState("");

   
  const todosArray = useSelector((state: any) => state.todos.todos);
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (inputText.trim() !== "") {
      dispatch(addTodo(inputText));  
      setInputText("");  
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Todo List</h1>

       <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Add new todo"
          className="border p-2 rounded-md flex-1 text-black"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
        >
          + Add
        </button>
      </div>

       <ul className="space-y-2">
        {todosArray && todosArray.map((todo: any) => (
          <li 
            key={todo.id} 
            className="flex justify-between items-center bg-gray-100 p-3 rounded-md text-black"
          >
            <span>{todo.text}</span>
             <button
              onClick={() => dispatch(deleteTodo(todo.id))}
              className="bg-red-500 text-white rounded-md px-3 py-1 text-sm hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```
## 03. app/redux-provider.jsx 
```tsx
'use client';  

import { Provider } from 'react-redux';
import { store } from './redux/store';  

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
```
## 04. redux/store.js          
```tsx
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import todoReducer from '../features/todo/todoSlice';

export const store = configureStore({
  reducer: {
    // counter: counterReducer,
    todos: todoReducer,
  },
})
```
## 05. app/layout.jsx 
```tsx
return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
```



