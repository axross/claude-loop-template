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
async function fetchRecord(id: string) {
  const result = await dataLayer.find({ id });
  return result;
}

// CORRECT — root call site catches, reports, then handles
export async function handleRequest(id: string) {
  try {
    const record = await fetchRecord(id);
    return record;
  } catch (error) {
    reportError(error);
    return notFound();
  }
}

// WRONG — nested helper swallows the error
async function fetchRecord(id: string) {
  try {
    return await dataLayer.find(...);
  } catch (error) {
    console.error(error); // error is lost after this
  }
}
```

`reportError(...)` stands in for {{ERROR_TRACKER}}'s capture call (the function that sends an exception to the error-reporting service).

## Reporting to the Error Tracker

Unexpected failures caught at the root call site should be reported before execution moves to a fallback. {{ERROR_TRACKER}}-specific import, privacy, and context rules live in [error-tracking.md](./error-tracking.md).

**Guidelines:**

- MUST report the error (via {{ERROR_TRACKER}}'s capture call) when a caught error represents an unexpected failure that should be investigated.
- SHOULD report the error before any early return or redirect so the report is always sent, even when execution continues along an alternate path.
- MUST consult [error-tracking.md](./error-tracking.md) before changing imports, event context, PII behavior, or {{ERROR_TRACKER}} configuration.

```typescript
import { reportError } from "{{ERROR_TRACKER}}'s SDK";

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

Unhandled render and runtime errors end their journey at the top-level boundary, so its report to {{ERROR_TRACKER}} is the last guarantee that nothing fails invisibly.

**Guidelines:**

- MUST keep the framework's top-level error boundary as the last-resort handler for the entire application, and MUST report errors it receives via {{ERROR_TRACKER}}'s capture call.
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
throw new Error(
  `retrieveResource() was called but the access token is null.`
);

// LESS GOOD — requires stack trace to understand
throw new Error("Token is missing.");
```
