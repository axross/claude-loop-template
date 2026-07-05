---
name: project-structure
description: Use this skill when navigating the repository, deciding where a new module, route, component, style, or test belongs, or checking the project's stack, tooling, and directory conventions. Covers the app/ route tree, the lib/ shared-module tier, colocated unit tests, the e2e/ suite layout, and configuration file ownership. Use for "where should this live", "what's the layout", or before creating any new file.
---

# Project Structure

Apply this skill before creating, moving, or renaming files, and when checking what owns a directory.

## Stack

- **Runtime/framework**: Next.js 16 (App Router), React 19, TypeScript (strict).
- **Persistence**: browser localStorage via `lib/todo-store.ts` — no backend, no database, no auth.
- **Tooling**: npm; ESLint (`eslint.config.mjs`); Prettier (`.prettierignore`); Vitest (`vitest.config.ts`); Playwright (`playwright.config.ts`); Node version pinned in `.nvmrc`.
- **Hosting**: Vercel.

## Layout

```
<root>
├── app/                    # Next.js App Router routes and route-local components
│   ├── layout.tsx          # root layout + metadata
│   ├── page.tsx            # the single todo page (server component shell)
│   ├── todo-app.tsx        # interactive todo list (client component)
│   ├── *.module.css        # CSS module colocated with its component
│   └── globals.css         # global styles and design-token variables
├── lib/                    # shared, UI-free modules
│   ├── todo-store.ts       # todo type, validation, localStorage persistence
│   └── todo-store.test.ts  # colocated Vitest unit tests
├── e2e/tests/              # Playwright suites (purpose-based: smoke, happy-path, …)
├── .claude/                # agent harness binding + project skills
└── .github/workflows/      # merge checks + independent reviewer
```

**Guidelines:**

- MUST place route files and route-local components under `app/`, and keep each component's CSS module colocated with matching base name.
- MUST place shared, UI-free logic under `lib/`; `lib/` modules MUST NOT import from `app/`.
- MUST colocate unit tests as `<module>.test.ts` next to the module under test.
- MUST place e2e suites under `e2e/tests/` using the purpose-based layout (`smoke`, `happy-path`, `regressions`, `<feature>`), per [e2e-testing-guidelines › structure](../e2e-testing-guidelines/references/structure.md).
- MUST use kebab-case file names for source, style, and test files.
- MUST route all localStorage access through `lib/todo-store.ts`, per [maintainable-code-guidelines › abstraction-boundaries](../maintainable-code-guidelines/references/abstraction-boundaries.md).
- SHOULD import cross-directory modules via the `@/*` path alias (e.g. `@/lib/todo-store`) instead of deep relative paths.
