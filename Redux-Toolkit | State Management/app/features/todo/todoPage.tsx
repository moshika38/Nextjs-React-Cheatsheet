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