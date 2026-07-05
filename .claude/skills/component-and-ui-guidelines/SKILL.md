---
name: component-and-ui-guidelines
description: Use this skill when writing, placing, reviewing, or refactoring a React component or hook, or deciding how a surface should look — server/client split, CSS-module styling, spacing, interaction states, copy, accessibility, and e2e test-id hooks. Use for "add a component", "style this", "where does this state live", or any change to a .tsx or .module.css file.
---

# Component and UI Guidelines

Apply this skill when creating or changing components, styles, or any user-facing surface.

## Server / Client Split

The page shell stays a server component; interactivity lives in a client component leaf. localStorage exists only in the browser, so persisted state is read after mount, never during server rendering.

**Guidelines:**

- MUST keep `app/page.tsx` (and any future route entry) a server component; put interactive state in a `"use client"` child (the established example is `app/todo-app.tsx`).
- MUST consume persisted todos through the `useTodos()` hook (`app/use-todos.ts`), which bridges localStorage via `useSyncExternalStore` — never read `localStorage` during render, and never load it with a bare set-state-in-effect (the lint preset rejects that pattern).
- MUST go through `lib/todo-store.ts` for every read/write of persisted todos.
- MUST catch storage failures at the root call site, report via `console.error` (the project's interim `reportError`), and fall back to an empty list, per [observability-guidelines › error-handling](../observability-guidelines/references/error-handling.md).

## Styling

**Guidelines:**

- MUST style components with a colocated CSS module (`<component>.module.css`); global rules and design tokens (`--background`, `--foreground`) live in `app/globals.css`.
- MUST use the design-token variables for colors instead of hard-coded values, so dark mode keeps working.
- MUST NOT add a styling dependency (Tailwind, CSS-in-JS) without an explicit decision — CSS modules are the established convention.

## Interaction and Accessibility

**Guidelines:**

- MUST give every icon-only or ambiguous control an accessible name (`aria-label`); form inputs need a label or `aria-label`.
- MUST implement mutations as controls with native semantics (a `form` submit for add, `checkbox` for toggle, `button` for delete) so keyboard interaction works without extra code.
- MUST render a meaningful empty state (the list with zero todos shows copy, not a blank area).
- SHOULD keep user-facing copy short, sentence-cased, and action-oriented.

## Test Hooks

**Guidelines:**

- MUST give every visually distinct element a kebab-case `data-testid`, scope-relative rather than globally unique (`toggle` inside `todo-item`, not `todo-item-toggle`), per [e2e-testing-guidelines › conventions](../e2e-testing-guidelines/references/conventions.md).
- MUST NOT remove or rename an existing test id without updating the e2e suites that reference it.
