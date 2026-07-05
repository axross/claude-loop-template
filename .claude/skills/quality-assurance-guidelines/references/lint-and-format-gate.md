# Lint and Format Gate

Apply these rules to verify the author respected the project's mandatory checks.

## Format

Format sets the required project default: mentally run `{{FORMAT_CMD}}` ({{FORMATTER}}) over the diff. Flag any tab/space inconsistency, trailing whitespace, missing trailing newline, or quote-style drift as Critical (lint will fail).

**Guidelines:**

- MUST mentally run `{{FORMAT_CMD}}` ({{FORMATTER}}) over the diff. Flag any tab/space inconsistency, trailing whitespace, missing trailing newline, or quote-style drift as Critical (lint will fail).
- MUST flag a hand-applied formatting change to a file the diff did not otherwise need to touch — that violates [development-guidelines › change-management](../../development-guidelines/references/change-management.md) scope discipline.

## Lint

Lint sets the required project default: flag a Critical for any introduced lint **error** (not warning). Watch for the categories the project's linter enforces, for example:

**Guidelines:**

- MUST flag a Critical for any introduced lint **error** (not warning). Common categories to watch for:
  - an escape-hatch type (e.g., an `any`-equivalent) where the linter forbids it
  - an `import` from a package not declared in the project's manifest
  - a platform/runtime import used outside the file(s) where the linter whitelists it
  - an access to environment variables outside the file(s) where the linter whitelists it
  - any other project-specific rule the linter is configured to treat as an error
- MUST flag a Major when modified files carry **new** lint warnings.
- SHOULD report pre-existing lint warnings in changed files as Minor with a "consider fixing while you're here" framing — these are explicitly allowed to be cleaned up per [development-guidelines › code-quality](../../development-guidelines/references/code-quality.md).

## Suppressions

Suppressions sets the required project default: flag a new {{LINTER}}'s inline suppression (with justification) directive that lacks an inline justification on the same line. The project rule is "explain why, not just what".

**Guidelines:**

- MUST flag a new {{LINTER}}'s inline suppression (with justification) directive that lacks an inline justification on the same line. The project rule is "explain why, not just what".
- MUST flag a new block-level {{LINTER}} suppression in any file that is not one of the whitelisted exception points the linter config defines.
- SHOULD flag a type-checker suppression (e.g., a "ts-expect-error"-style directive) introduced without a comment explaining the upstream type bug it works around.

## Type Safety Compliance

Type Safety Compliance sets the required project default: flag any introduced escape-hatch cast or suppression (e.g., an `any` cast, an unsafe double cast, or a type-checker error suppression) swallowing a real error, per the project's own code conventions, if defined.

**Guidelines:**

- MUST flag any introduced escape-hatch cast or suppression (e.g., an `any` cast, an unsafe double cast, or a type-checker error suppression) swallowing a real error, per the project's own code conventions, if defined.
- MUST flag a missing return type on a new exported function when the project's conventions require explicit return types.
- SHOULD flag a non-`type`-only import for symbols used only as types when the project distinguishes type-only imports.
