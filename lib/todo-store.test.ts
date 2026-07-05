import { describe, expect, it } from "vitest";

import { createTodo, parseStoredTodos, type Todo } from "./todo-store";

const storedTodos: Todo[] = [
  { id: "1", text: "Buy milk", completed: false },
  { id: "2", text: "Walk the dog", completed: true },
];

describe("parseStoredTodos", () => {
  it("returns an empty list when nothing is stored", () => {
    expect(parseStoredTodos(null)).toEqual([]);
  });

  it("returns the stored todos when the value is a well-formed array", () => {
    expect(parseStoredTodos(JSON.stringify(storedTodos))).toEqual(storedTodos);
  });

  it("throws when the stored value is not valid JSON", () => {
    expect(() => parseStoredTodos("{not json")).toThrow(TypeError);
  });

  it("throws when the stored value is JSON but not an array", () => {
    expect(() => parseStoredTodos('{"id":"1"}')).toThrow(TypeError);
  });

  it("throws when an array entry is missing a required field", () => {
    expect(() => parseStoredTodos('[{"id":"1","text":"Buy milk"}]')).toThrow(
      TypeError,
    );
  });
});

describe("createTodo", () => {
  it("creates an uncompleted todo carrying the given text", () => {
    const todo = createTodo("Buy milk");

    expect(todo.text).toBe("Buy milk");
    expect(todo.completed).toBe(false);
  });

  it("assigns a distinct id to each created todo", () => {
    expect(createTodo("a").id).not.toBe(createTodo("b").id);
  });
});
