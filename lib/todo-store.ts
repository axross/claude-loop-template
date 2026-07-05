/**
 * A single todo item as persisted in localStorage and rendered in the list.
 */
export interface Todo {
  /** Stable unique identifier, generated at creation time. */
  id: string;
  /** The user-entered todo text. */
  text: string;
  /** Whether the user has marked the todo as done. */
  completed: boolean;
}

/** The localStorage key under which the todo list is persisted. */
export const TODOS_KEY = "todo-app.todos";

function isTodo(value: unknown): value is Todo {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.text === "string" &&
    typeof record.completed === "boolean"
  );
}

/**
 * Parses a raw persisted value into a validated todo list.
 *
 * Treats `null` (nothing stored yet) as an empty list. Anything else must be
 * a JSON array of well-formed todos.
 *
 * @throws TypeError when the raw value is not valid JSON or does not match
 * the expected todo-array shape.
 */
export function parseStoredTodos(raw: string | null): Todo[] {
  if (raw === null) {
    return [];
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new TypeError(
      `parseStoredTodos() received a value that is not valid JSON.`,
      { cause: error },
    );
  }
  if (!Array.isArray(parsed) || !parsed.every(isTodo)) {
    throw new TypeError(
      `parseStoredTodos() received JSON that is not an array of todos.`,
    );
  }
  return parsed;
}

/**
 * Loads the persisted todo list from localStorage.
 *
 * @throws TypeError when the stored value is corrupt; callers at the root
 * call site report the error and fall back to an empty list.
 */
export function loadTodos(): Todo[] {
  return parseStoredTodos(localStorage.getItem(TODOS_KEY));
}

/** Persists the given todo list to localStorage. */
export function saveTodos(todos: Todo[]): void {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

/** Creates a new, uncompleted todo with a unique id from user-entered text. */
export function createTodo(text: string): Todo {
  return { id: crypto.randomUUID(), text, completed: false };
}
