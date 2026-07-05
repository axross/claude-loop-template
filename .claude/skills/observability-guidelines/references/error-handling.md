# Error Handling

Apply these rules when writing, reviewing, or modifying any code that might throw or receive an error.

## Placement of try-catch

Only the root call site knows what the failed operation means to the user, so it alone can choose the right recovery — a nested helper can only guess.

**Guidelines:**

- MUST place `try-catch` blocks at the **root call site** — the outermost function that initiates an operation (e.g., a request handler, a top-level command, or an entry-point function).
- MUST NOT swallow errors silently in nested helpers. Let errors propagate naturally up the call stack so the root call site can handle them.
- MUST rethrow a caught error when the catch block exists only for a side effect (e.g., logging). Catching without rethrowing hides the error from the root call site.

```typescript
// CORRECT — nested helper lets errors propagate
function loadTodos(): Todo[] {
  return parseStoredTodos(localStorage.getItem(TODOS_KEY));
}

// CORRECT — root call site catches, reports, then handles
export function useTodos() {
  try {
    return loadTodos();
  } catch (error) {
    reportError(error);
    return [];
  }
}

// WRONG — nested helper swallows the error
function loadTodos(): Todo[] {
  try {
    return parseStoredTodos(localStorage.getItem(TODOS_KEY));
  } catch (error) {
    console.log(error); // error is lost after this
  }
}
```

`reportError(...)` stands in for the project's error-reporting call. Until an error tracker lands, `reportError` is `console.error` at the root call site; when a tracker is added, it becomes the tracker's capture call (see [error-tracking.md](./error-tracking.md)).

## Reporting Failures

Unexpected failures caught at the root call site should be reported before execution moves to a fallback. Tracker-specific import, privacy, and context rules live in [error-tracking.md](./error-tracking.md) (dormant until a tracker lands).

**Guidelines:**

- MUST report the error (via `reportError(...)`) when a caught error represents an unexpected failure that should be investigated.
- SHOULD report the error before any early return or redirect so the report is always sent, even when execution continues along an alternate path.
- MUST consult [error-tracking.md](./error-tracking.md) before changing imports, event context, PII behavior, or error-tracker configuration, once a tracker exists.

```typescript
try {
  resource = await retrieveResource(id);
} catch (error) {
  reportError(error);
  notFound(); // early exit after reporting
}
```

- SHOULD also report non-thrown unexpected states — for example, receiving an unrecognized data type:

```typescript
unknownHandler: (_state, node) => {
  reportError(new Error(`Handled unknown node (type: ${node.type}).`));
},
```

## Top-Level Error Boundary

Unhandled render and runtime errors end their journey at the top-level boundary (`app/global-error.tsx` / `app/error.tsx`), so its `reportError(...)` is the last guarantee that nothing fails invisibly.

**Guidelines:**

- MUST keep the framework's top-level error boundary as the last-resort handler for the entire application, and MUST report errors it receives via `reportError(...)`.
- MUST NOT remove or bypass the top-level error boundary.
- MAY add scope-specific error boundaries for areas that need customized error handling, following the same reporting pattern.

```typescript
// the framework's top-level error boundary
export function TopLevelErrorBoundary({ error }: { error: Error }) {
  // report the error once the boundary receives it
  reportError(error);

  // ...render fallback UI...
}
```

## Error Messages

A reported issue is often read in a dashboard where the message is the headline and the stack trace is minified or several clicks away.

**Guidelines:**

- SHOULD write error messages that identify the exact function or condition that failed, so reported issues are immediately actionable without reading the stack trace.

```typescript
// GOOD — context is clear from the message alone
throw new Error(`retrieveResource() was called but the access token is null.`);

// LESS GOOD — requires stack trace to understand
throw new Error("Token is missing.");
```
