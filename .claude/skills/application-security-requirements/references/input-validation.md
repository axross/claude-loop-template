# Input Validation

Apply these rules to verify every untrusted input is validated and coerced before reaching persisted storage, an outbound `fetch`, or any rendering pipeline. Treat the static types at a request boundary as unverified: the runtime value may not match its declared type (e.g., a single query param may arrive as a string, an array, or `undefined`).

## Route Inputs (params, query params)

Route and query params are the cheapest input an attacker controls — anyone crafts them in a URL — and the declared types at the boundary promise shapes the runtime never enforces.

**Guidelines:**

- MUST flag a Critical when a route param or query param value reaches a `fetch` URL or a redirect target without an explicit type assertion or validation-library parse. The static type at the boundary lies — at runtime a query value can be `string | string[] | undefined`.
- MUST flag a Major when a boolean query param is coerced via a truthy check (`if (query.flag)`) instead of value comparison (`query.flag === "true"`). The project's established pattern uses explicit value comparison — diverging risks treating a `?flag=false` value as truthy.
- MUST flag a Critical when a dynamic segment (e.g., an identifier path param) is passed into an equality filter without ensuring it is a string. An array value can bypass an equals filter.

## Server Actions and Request Handlers

Request bodies and form data arrive from arbitrary clients, so the handler's parameter types describe intent, not what actually shows up at runtime.

**Guidelines:**

- MUST flag a Critical when a new request handler reads a JSON body, form data, or the request URL without a schema (or equivalent runtime check) validating the parsed shape before use.
- MUST flag a Critical when a new server-side callable invoked from the client accepts arguments without runtime validation, regardless of static types.

## Persisted Storage (localStorage)

Stored values drift from the code's expectations — older writes, other tabs, extensions, and hand-edited devtools state all produce shapes the static types no longer describe.

**Guidelines:**

- MUST flag a Critical when code reads todos from `localStorage` and uses the parsed value without validating its shape first. The project's pattern is to validate stored JSON in the storage module (`lib/todo-store.ts`) before returning it.
- MUST flag a Major when a storage-parse failure is **silently** dropped (no report via `reportError(...)` and no safe fallback). The stored value being corrupt must not crash the app.

## Rendered User Content

Todo text is untrusted user input rendered back into the page, so its safety rests on the framework's encoding path.

**Guidelines:**

- MUST flag a Critical when user-entered content (todo text) is rendered through a raw-HTML sink (`dangerouslySetInnerHTML`) or interpolated into markup outside React's safe-encoding path — see [xss-in-markdown.md](./xss-in-markdown.md).
