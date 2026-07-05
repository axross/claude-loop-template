"use client";

import { useSyncExternalStore } from "react";

import {
  createTodo,
  parseStoredTodos,
  saveTodos,
  TODOS_KEY,
  type Todo,
} from "@/lib/todo-store";

const EMPTY: Todo[] = [];

let cachedRaw: string | null = null;
let cachedTodos: Todo[] = EMPTY;

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Keep this tab in sync when another tab changes the stored todos.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): Todo[] {
  const raw = localStorage.getItem(TODOS_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedTodos = parseStoredTodos(raw);
    } catch (error) {
      // Root call site for storage reads: report, then fall back to empty.
      console.error(error);
      cachedTodos = EMPTY;
    }
  }
  return cachedTodos;
}

function getServerSnapshot(): Todo[] {
  return EMPTY;
}

function update(next: Todo[]) {
  saveTodos(next);
  notify();
}

/**
 * Subscribes to the localStorage-persisted todo list and returns it together
 * with the add/toggle/delete mutations. Server rendering sees an empty list;
 * the persisted list takes over on the client.
 */
export function useTodos() {
  const todos = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addTodo = (text: string) => {
    update([...todos, createTodo(text)]);
  };

  const toggleTodo = (id: string) => {
    update(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: string) => {
    update(todos.filter((todo) => todo.id !== id));
  };

  return { todos, addTodo, toggleTodo, deleteTodo };
}
