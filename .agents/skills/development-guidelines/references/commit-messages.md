# Commit Messages

Apply these rules whenever you author a Git commit, amend an existing one, or title a pull request in this project. The project follows [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) — the normative rules below are summarized so no network fetch is required.

## Overall Format

```
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

**Guidelines:**

- MUST prefix every commit with a `<type>`, followed by an OPTIONAL scope, an OPTIONAL `!` breaking-change marker, a REQUIRED colon, and a REQUIRED single space before the description.
- MUST keep the first line (the header: `type(scope)!: description`) a single line with no trailing period.
- MUST separate the header, body, and footers with exactly one blank line each when they are present.

## Pull Request Titles

The header format is not commit-only: a pull request title MUST follow the same `<type>[scope][!]: <description>` shape as a commit header, so titles stay consistent and scannable across the pull-request list and merged history regardless of merge strategy — that consistency is the base rationale for the unconditional rule. It also matters at merge time: when a squash merge takes the pull request title as the squashed commit's subject (GitHub's behavior when "Default to pull request title" is enabled, or for a title the maintainer types at merge), a title without a type prefix lands a non-conforming commit on the default branch. The title carries only the header; the body/footer live in the pull request description, not the title.

**Guidelines:**

- MUST title every pull request with a Conventional Commits header (`<type>[scope][!]: <description>`), applying the Type, Scope, Description, and Breaking-Change rules below exactly as for a commit header.
- SHOULD pick the type from the primary change the pull request delivers when it spans more than one type (e.g., a change that is mostly CI config with an incidental docs tweak is `ci`).
- MUST NOT apply this rule to issue titles: an issue states a problem or deliverable in plain descriptive prose, and is never a commit subject.

## Type

Type sets the required project default: use `feat` when the commit adds a user-facing feature — correlates to a SemVer **MINOR** bump.

**Guidelines:**

- MUST use `feat` when the commit adds a user-facing feature — correlates to a SemVer **MINOR** bump.
- MUST use `fix` when the commit fixes a user-facing bug — correlates to a SemVer **PATCH** bump.
- MAY use any of these additional types for non-release-affecting changes:
  - `build` — build system or external dependencies (e.g., the dependency manifest or build config).
  - `chore` — housekeeping that does not fit another type (e.g., skill edits, config tweaks, repo metadata).
  - `ci` — CI/CD configuration (e.g., pipeline definitions or hosting/project settings).
  - `docs` — documentation only (`AGENTS.md`, `.agents/skills/**`, `README.md`).
  - `style` — formatting / whitespace only, no behavior change (formatter-driven, typically).
  - `refactor` — code change that neither fixes a bug nor adds a feature.
  - `perf` — performance improvement.
  - `test` — adding or correcting tests.
  - `revert` — reverts a prior commit; see the revert example below.
- MUST treat types as case-insensitive in parsing but SHOULD write them lowercase for consistency with the existing git log.

## Scope

Scope describes an optional project path: include a scope in parentheses immediately after the type, e.g., `fix(parser): ...`.

**Guidelines:**

- MAY include a scope in parentheses immediately after the type, e.g., `fix(parser): ...`.
- MUST make the scope a noun identifying the affected section of the codebase — prefer names that match the existing layout: e.g., `api`, `auth`, `config`, `e2e`, `skills`, or a specific module/route name.
- SHOULD omit the scope when the change spans the whole project and no single section is primary.

## Description

Description sets the required project default: place the description immediately after `: ` and keep it a short imperative summary of the change (e.g., "add Polish language", not "added" or "adds").

**Guidelines:**

- MUST place the description immediately after `: ` and keep it a short imperative summary of the change (e.g., "add Polish language", not "added" or "adds").
- SHOULD keep the full header (`type(scope)!: description`) under ~72 characters so `git log --oneline` stays readable.
- MUST NOT end the description with a period.

## Body

Body describes an optional project path: provide a body one blank line after the description to add context, rationale, or migration notes — use it whenever the "why" is not obvious from the diff.

**Guidelines:**

- MAY provide a body one blank line after the description to add context, rationale, or migration notes — use it whenever the "why" is not obvious from the diff.
- MAY consist of any number of newline-separated paragraphs. Body text is free-form.
- SHOULD wrap body lines at ~72 characters for terminal readability, except for URLs and code spans.

## Footers

Footers describes an optional project path: place one or more footers one blank line after the body (or after the description, if the body is omitted).

- `BREAKING CHANGE` is the only token allowed to contain a space. `BREAKING-CHANGE` (hyphenated) is synonymous and equally valid.

**Guidelines:**

- MAY place one or more footers one blank line after the body (or after the description, if the body is omitted).
- MUST write each footer as a word token, followed by either `: ` (colon + space) or ` #` (space + hash), followed by the value. Tokens MUST use `-` instead of whitespace, e.g., `Reviewed-by:`, `Acked-by:`, `Co-authored-by:`, `Refs: #123`, `Closes: #45`.
- MAY allow footer values to span spaces and newlines; a value terminates only when the next valid footer token is parsed.

## Breaking Changes

A breaking change MUST be indicated in at least one of two ways (both MAY be used together):

1. **`!` after the type/scope prefix**, e.g., `feat(api)!: drop support for Node 18`. When `!` is used, the `BREAKING CHANGE:` footer MAY be omitted and the description itself serves as the breaking-change note.
2. **`BREAKING CHANGE:` footer** (uppercase required), e.g.:
   ```
   BREAKING CHANGE: `extends` key in config file is now used for extending other config files
   ```

**Guidelines:**

- MUST correlate breaking changes to a SemVer **MAJOR** bump, regardless of whether the type is `feat`, `fix`, or anything else.
- MUST write `BREAKING CHANGE` uppercase; all other Conventional Commits tokens are case-insensitive for parsing but SHOULD be written lowercase.

## SemVer Correlation

SemVer Correlation maps each Conventional Commit shape to the release bump it signals. Use this table when choosing the header type and breaking-change marker for a commit.

| Commit shape | SemVer bump |
|---|---|
| `fix: ...` | PATCH |
| `feat: ...` | MINOR |
| Any type with `!` or a `BREAKING CHANGE:` footer | MAJOR |
| `chore`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `perf`, `revert` without `!` | No release bump |

**Guidelines:**

- MUST treat `fix` as PATCH and `feat` as MINOR unless the commit also marks a breaking change.
- MUST treat any `!` marker or `BREAKING CHANGE:` footer as MAJOR.
- MUST NOT imply a release bump from non-`feat` / non-`fix` types unless they carry a breaking-change marker.

## Examples

These examples show accepted commit shapes for common cases, including scopes, bodies, footers, breaking changes, and reverts.

**Simple, no scope, no body:**
```
docs: correct spelling of CHANGELOG
```

**With scope:**
```
feat(lang): add Polish language
```

**Breaking change via `!`:**
```
feat!: send an email to the customer when a product is shipped
```

**Breaking change via `!` with scope:**
```
feat(api)!: drop support for Node 18
```

**Breaking change via footer (no `!`):**
```
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

**With body and multiple footers:**
```
fix: prevent racing of requests

Introduce a request id and a reference to latest request. Dismiss
incoming responses other than from the latest request.

Remove timeouts which were used to mitigate the racing issue but are
obsolete now.

Reviewed-by: Z
Refs: #123
```

**Revert:**
```
revert: feat(lang): add Polish language

Refs: 676104e, a215868
```

**Guidelines:**

- SHOULD model new commit messages after the closest accepted example.
- MUST preserve the blank-line separation between header, body, and footers when a commit includes more than a single header line.

## Tooling Notes

Tooling Notes captures the project-specific context for the checklist below: The repository does not currently enforce commit messages with a commit hook or CI check, so authors (human or agent) MUST self-enforce this format.

- When amending or rewriting history, re-check that every rewritten commit still conforms — especially that breaking changes carry either `!` or the footer.

**Guidelines:**

- MUST self-enforce this format because the repository does not currently enforce commit messages with a commit hook or CI check.
