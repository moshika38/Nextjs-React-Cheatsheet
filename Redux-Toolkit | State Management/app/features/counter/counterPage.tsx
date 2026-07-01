"use client";
import React from "react";
import { increment, decrement } from "./counterSlice";
import { useDispatch, useSelector } from "react-redux";

export function Counter() {
  const count = useSelector((state: any) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button
        onClick={() => dispatch(increment())}
        className="bg-blue-500 text-white rounded-md m-3 p-2"
      >
        + Increment
      </button>
      <button
        onClick={() => dispatch(decrement())}
        className="bg-blue-500 text-white rounded-md m-3 p-2"
      >
        - Decrement
      </button>
    </div>
  );
}
