# {{PROJECT_NAME}}

<!-- INIT: this file is the SEED for the initialized project's README. During
INIT Step 7, finalize it: `git mv -f README.template.md README.md` (replacing
the template's own README; merge instead when the repository already had a
real README — see INIT Step 0), fill every prose gap flagged by an `INIT:` comment
from the Stack Decision Record and the Step-1 interview answers, resolve every
`INIT:OPTIONAL` marker below, and delete all `INIT` comments — including this
one. -->

{{PROJECT_OVERVIEW}}

<!-- INIT: expand the one-liner above into a short paragraph from the Step-1
interview — what the project is, who it serves, and its current goal. -->

## Tech stack

| Area | Tool |
| ---- | ---- |
| Language | {{PRIMARY_LANGUAGE}} |
| App framework / runtime | {{APP_FRAMEWORK}} |
| Package manager | {{PACKAGE_MANAGER}} |
| Linting & formatting | {{LINTER}} / {{FORMATTER}} |
| Unit tests | {{UNIT_TEST_FRAMEWORK}} <!-- INIT:OPTIONAL key=UNIT_TESTS — fill the token OR delete this row if the project has no unit suite. --> |
| E2E tests | {{E2E_TEST_FRAMEWORK}} <!-- INIT:OPTIONAL key=E2E_TESTS — fill the token OR delete this row if the project has no e2e suite. --> |
| Data / content layer | {{CMS_OR_DATA_LAYER}} <!-- INIT:OPTIONAL key=DATA_LAYER — fill the token OR delete this row if the project has no data/content layer. --> |
| Hosting | {{HOSTING_PLATFORM}} <!-- INIT:OPTIONAL key=HOSTING — fill the token OR delete this row if the project has no hosting platform yet. --> |

<!-- INIT: add rows a newcomer needs from the Stack Decision Record (state
management, styling, ORM/db wrapper, error tracker, logger, …); keep the table
to what the project actually uses. -->

## Getting started

1. Install dependencies: `{{INSTALL_CMD}}`
2. Start developing: `{{DEV_CMD}}`
   <!-- INIT: for a project without a dev server (CLI, library), reword this
   step to the project's run/watch equivalent. -->
3. Production build and start: `{{BUILD_CMD}}`, then `{{START_CMD}}`
   <!-- INIT:OPTIONAL key=BUILD_STEP — keep and fill OR delete this step if the project has no build step. -->

<!-- INIT: add the real prerequisites — runtime/toolchain version, `.env.local`
setup, database or services to start — from the project's actual needs (see
`.claude/hooks/session-start.sh` for what cloud sessions provision). -->

## Development workflow

Development in this repository is agent-assisted via
[Claude Code](https://claude.com/claude-code). The working agreement lives in
[`AGENTS.md`](./AGENTS.md) (loaded through `CLAUDE.md`) and routes to the
detailed skills under [`.claude/skills/`](./.claude/skills). Human and agent
contributors follow the same loop: plan → implement → self-review → verify →
report.

<!-- INIT:OPTIONAL key=INDEPENDENT_REVIEW — keep this block if the project keeps the independent-review capability (REVIEW.md + /address + /review); delete the whole block otherwise and describe the project's own PR flow instead. -->
Delivery runs through two entry points:

- **[`/address`](./.claude/commands/address.md)** — takes a GitHub issue, pull
  request, or free-form prompt end-to-end: plan, implement, verify, open a
  draft pull request, request the independent review, and address findings
  until CI and the review are green. Merging stays a human decision.
- **[`/review`](./.claude/commands/review.md)** — runs this repository's
  review policy ([`REVIEW.md`](./REVIEW.md)) on a pull request or local diff
  and posts findings. The same policy runs in CI via
  [`claude-review.yaml`](./.github/workflows/claude-review.yaml).
- **[`/handoff`](./.claude/commands/handoff.md)** — suspends in-progress work
  into a package a fresh session takes over with `/address continue`.
  <!-- INIT:OPTIONAL key=SESSION_HANDOFF — delete this bullet if the project dropped /handoff. -->

Changes made without an agent follow the same bar: branch, implement, run the
checks below, open a pull request, and get it reviewed before merge.

## Testing

<!-- INIT: describe the testing strategy in a sentence or two — what unit
tests cover versus e2e, and which checks gate a merge. -->

| Check | Command |
| ----- | ------- |
| Format | `{{FORMAT_CMD}}` |
| Lint | `{{LINT_CMD}}` |
| Type-check | `{{TYPECHECK_CMD}}` <!-- INIT:OPTIONAL key=TYPED_LANGUAGE — delete this row for an untyped language. --> |
| Unit tests | `{{UNIT_TEST_CMD}}` <!-- INIT:OPTIONAL key=UNIT_TESTS — delete this row if the project has no unit suite. --> |
| E2E tests | `{{E2E_TEST_CMD}}` <!-- INIT:OPTIONAL key=E2E_TESTS — delete this row if the project has no e2e suite. --> |

Run format + lint after every change, and the suites relevant to the changed
surface before opening a pull request — see the Verification section of
[`AGENTS.md`](./AGENTS.md).

## Related links

<!-- INIT: list the project's real links collected in the Step-1 interview —
docs, issue tracker, deployment dashboard, design files, staging URL — or
delete this section if there are none. -->

- …
