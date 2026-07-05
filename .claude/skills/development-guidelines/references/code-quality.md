# Code Quality

Apply these rules whenever you write or modify code in this project.

## Check Sequence

The order matters because the linter reports correctness and quality problems the formatter does not touch, so a passing format step is not proof the code is clean.

- `npm run format` applies Prettier formatting. `npm run lint` enforces lint rules only (`eslint-config-prettier` disables stylistic rules), so both steps are always required.

**Guidelines:**

- MUST always run checks in this order after making any code change:
  1. **Format** (`npm run format`) — auto-formats all modified files.
  2. **Lint** (`npm run lint`) — detects code-quality issues.
  3. **Fix all reported errors.**
  4. **Re-run lint** — confirm all errors are resolved.
  5. **Test** (`npm run test:e2e`) — when the change affects a UI output surface; see [verification.md](./verification.md) for which changes require testing.

- MUST NOT skip or reorder these steps.

## Formatting

Delegating whitespace and layout to Prettier keeps diffs free of style noise and ends manual formatting debates in review.

**Guidelines:**

- MUST run `npm run format` after every set of code changes, before committing or considering the task done.
- MUST NOT manually adjust spacing, indentation, or line endings — let Prettier handle them.
- MUST NOT submit code that has not been passed through the formatter.

## Linting

The linter catches correctness and quality problems the formatter cannot see.

**Guidelines:**

- MUST run `npm run lint` after formatting to surface code-quality issues.
- MUST fix every lint **error** before considering the task complete.
- SHOULD fix lint **warnings** in any file that was modified as part of the task. MAY also fix pre-existing warnings in those files.
- MUST NOT suppress lint rules with ESLint's inline suppression directive unless there is a clear, documented reason why the rule cannot be satisfied.
  - When suppression is genuinely necessary, add an inline comment on the same line explaining the reason.

## Type Safety

A type system's guarantees only hold when the code does not quietly opt out of them. An unchecked cast or a non-null/force-unwrap assertion silences the compiler at the exact spot a bug would surface, trading a compile-time check for a runtime risk — and because such escape hatches are often not lint-caught, they are a discipline the author owns.

**Guidelines:**

- MUST NOT introduce an unchecked cast (e.g., `as SomeType`) or a non-null/force-unwrap assertion (e.g., `!`) without a justification the surrounding code makes obvious or a line comment states.
- SHOULD prefer narrowing that proves the type to the compiler — a type guard, an early return, or a language-native runtime check — over asserting it.
- SHOULD keep any unavoidable unsafe assertion as small and local as possible, and never use one to paper over a type error that a correct type or narrowing would resolve.

## Comments

This project distinguishes two kinds of comment, each with its own style: **doc-comments** that document an API (written as TSDoc), and **line comments** that explain a specific spot in the code (sentence-cased, ending with a period). Existing source files are the authority for both — read them before writing comments and match their voice. These rules apply to source-code comments only, not to commit messages (see [commit-messages.md](./commit-messages.md)) or to prose documentation.

### Doc-Comments

Doc-comments carry the API-level documentation, written in the project's doc-comment standard. A public surface without one forces every consumer to read the implementation to learn what it does.

**Guidelines:**

- MUST give every exported/public type definition, and every function whose body exceeds ~5 lines, a doc-comment in the project's doc-comment standard stating what it is or does.
- MUST document the conditions under which a function throws, using the standard's throws tag (e.g., `@throws`) when the standard supports one.
- SHOULD add parameter/return documentation only when the name and type do not already make the meaning obvious; do NOT add restating noise.

### Line Comments

Line comments earn their place: a comment that merely restates the next line adds reading cost without information, while a missing "why" comment leaves the next reader to rediscover the reason.

**Guidelines:**

- MUST write line comments in the project's chosen comment voice; read the surrounding source files before adding comments and match what is already there. Proper nouns, code identifiers, and acronyms keep their natural casing regardless of the voice.
- MUST keep line comments minimal — write one only when control flow, a business rule, or a non-obvious reason is not conveyed by the code alone — and remove a comment that only restates the code it precedes.
- MUST NOT delete a comment that explains a "why", an edge case, or non-obvious behavior.
- MUST keep a linter suppression directive in the tool's required casing; only the trailing human-readable reason follows the project's comment voice.
- MUST let the linter/formatter enforce comment conventions where it can, and fix any comment-style violations it reports.

## Import Hygiene

Stale imports misrepresent a module's real dependencies and can drag dead code — or another runtime's code — into the bundle.

**Guidelines:**

- MUST NOT leave unused imports in modified files. The linter will flag these, but resolve them proactively.
- MUST NOT use barrel re-export files (an `index` module that re-exports everything) as import sources when a direct import path is available. Import directly from the module file.
  - This keeps bundle size small and avoids accidentally pulling in code intended for one runtime/boundary into another.
- SHOULD use type-only imports when the language supports them and the imported symbol is a type that is not used as a value.
