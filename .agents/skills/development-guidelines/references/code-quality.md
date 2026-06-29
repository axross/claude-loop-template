# Code Quality

Apply these rules whenever you write or modify code in this project.

## Check Sequence

Check Sequence sets the required project default: always run checks in this order after making any code change:

- `{{FORMAT_CMD}}` applies auto-fixable formatting. `{{LINT_CMD}}` enforces both lint rules and format rules. Some format violations are only caught by the lint step, so it may still report format issues even after running the formatter.

**Guidelines:**

- MUST always run checks in this order after making any code change:
  1. **Format** (`{{FORMAT_CMD}}`) — auto-formats all modified files.
  2. **Lint** (`{{LINT_CMD}}`) — detects code quality and remaining format issues.
  3. **Fix all reported errors.**
  4. **Re-run lint** — confirm all errors are resolved.
  5. **Test** (`{{E2E_TEST_CMD}}`) — only when the project has an e2e suite and the change affects a UI output surface; see [verification.md](./verification.md) for which changes require testing.

- MUST NOT skip or reorder these steps.

## Formatting

Formatting sets the required project default: run `{{FORMAT_CMD}}` after every set of code changes, before committing or considering the task done.

**Guidelines:**

- MUST run `{{FORMAT_CMD}}` after every set of code changes, before committing or considering the task done.
- MUST NOT manually adjust spacing, indentation, or line endings — let {{FORMATTER}} handle them.
- MUST NOT submit code that has not been passed through the formatter.

## Linting

Linting sets the required project default: run `{{LINT_CMD}}` after formatting to surface code quality issues.

**Guidelines:**

- MUST run `{{LINT_CMD}}` after formatting to surface code quality issues.
- MUST fix every lint **error** before considering the task complete.
- SHOULD fix lint **warnings** in any file that was modified as part of the task. MAY also fix pre-existing warnings in those files.
- MUST NOT suppress lint rules with {{LINTER}}'s inline suppression directive unless there is a clear, documented reason why the rule cannot be satisfied.
  - When suppression is genuinely necessary, add an inline comment on the same line explaining the reason.

## Comments

Comments sets the required project default: follow the project's established comment style. The linter/formatter enforces it where it can, and existing source files are the authority for anything it does not.

- Match the casing, punctuation, and phrasing conventions already used in the surrounding source files.
- Proper nouns, code identifiers, and acronyms keep their natural casing regardless of the project's general comment convention.
- This applies to source-code comments only. It does NOT apply to commit messages (see [commit-messages.md](./commit-messages.md)) or to prose documentation.
- Any linter suppression directive comments follow the tool's required casing for the directive itself; the trailing human-readable reason follows the project's comment style.

**Guidelines:**

- MUST follow the project's established comment style; read the surrounding source files before adding comments and match what is already there.
- MUST let the linter/formatter enforce comment conventions where it can, and fix any comment-style violations it reports.

## Import Hygiene

Import Hygiene is a project prohibition: do not leave unused imports in modified files. The linter will flag these, but resolve them proactively.

**Guidelines:**

- MUST NOT leave unused imports in modified files. The linter will flag these, but resolve them proactively.
- MUST NOT use barrel re-export files (an `index` module that re-exports everything) as import sources when a direct import path is available. Import directly from the module file.
  - This keeps bundle size small and avoids accidentally pulling in code intended for one runtime/boundary into another.
- SHOULD use type-only imports when the language supports them and the imported symbol is a type that is not used as a value.
