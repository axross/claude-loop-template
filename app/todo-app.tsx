"use client";

import { useState, type FormEvent } from "react";

import styles from "./todo-app.module.css";
import { useTodos } from "./use-todos";

/**
 * The interactive todo list: an add form, the persisted list with per-item
 * complete/delete controls, and an empty state. Todos load from and persist
 * to localStorage via the todo store.
 */
export function TodoApp() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [text, setText] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (trimmed === "") {
      return;
    }
    addTodo(trimmed);
    setText("");
  };

  return (
    <section className={styles.app} data-testid="todo-app">
      <form className={styles.form} onSubmit={submit}>
        <input
          className={styles.input}
          data-testid="new-todo-input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo"
        />
        <button className={styles.addButton} data-testid="add-todo">
          Add
        </button>
      </form>
      {todos.length === 0 ? (
        <p className={styles.empty} data-testid="empty-state">
          Nothing to do yet. Add your first todo above.
        </p>
      ) : (
        <ul className={styles.list} data-testid="todo-list">
          {todos.map((todo) => (
            <li className={styles.item} data-testid="todo-item" key={todo.id}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  data-testid="toggle"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span
                  className={todo.completed ? styles.completedText : undefined}
                  data-testid="text"
                >
                  {todo.text}
                </span>
              </label>
              <button
                className={styles.deleteButton}
                data-testid="delete"
                onClick={() => deleteTodo(todo.id)}
                aria-label={`Delete "${todo.text}"`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
