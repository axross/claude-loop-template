# INIT — Adapting this template to a project

This repository is a **reusable, framework-agnostic template** for a **Claude
Code** project built on an `AGENTS.md`-driven skill system. It ships:

- `AGENTS.md` — the master routing index + working agreement (the entry point
  Claude Code routes through via `CLAUDE.md`).
- `CLAUDE.md` — a one-line binding (`@AGENTS.md`) so Claude Code loads `AGENTS.md`.
- `.claude/skills/**` — a generic, cross-project **skill core** (12 guideline
  skills) plus the fixed **workflow entry-point skills** `/address` and
  `/handoff`.
- `.claude/**` — the **Claude Code** harness binding (example hooks + settings).
- `README.template.md` — a seed for the initialized project's own README
  (summary, tech stack, getting started, development workflow, testing,
  related links), finalized into `README.md` in Step 7.

Everything project-specific has been replaced with `{{TOKEN}}` placeholders or
neutral prose. This file tells an AI agent how to turn the template into a
working setup for one concrete project.

> **Fixed vs. configured — do not ask about these.** This template targets
> **Claude Code specifically**: there is no "which agent?" choice. The `/address`
> and `/handoff` workflow entry-point skills under `.claude/skills/**`, together with the
> **independent-review loop** they drive (`REVIEW.md`, the `.github/workflows/`,
> and the `github-operation-guidelines` skill), are **fixed infrastructure** —
> INIT *configures and adapts* them but **never asks whether to keep them, and
> never deletes them.** The rest of the skill core is resolved per capability in
> Steps 1 and 4: most of the 12 skills are always-present cross-project guidance,
> and a few (unit tests, e2e, observability) are added or skipped to match the
> project's stack.

> **You are the agent running INIT.** Follow the steps in order. Do not skip
> Step 0 or Step 1 — the rest depends on their answers. Make changes only inside
> this template's files. When done, INIT.md and every `<!-- INIT: ... -->` /
> "TEMPLATE NOTE" / "_template note_" scaffold should be gone.

> **Tooling.** Two helpers automate the mechanical parts; both are optional but
> recommended:
> - `./init.sh` — metacharacter-safe `{{TOKEN}}` substitution driven by
>   `tokens.json` (`./init.sh init` to scaffold a values file, `apply` to
>   substitute, `check` to run the gates). Use it instead of a hand-written
>   `sed` sweep — two tokens contain `| * ( ) \ $` and break `sed`.
> - `.claude/skills/agent-skills-best-practices/scripts/check-links.sh` —
>   relative-link integrity across the whole tree, **including** the
>   `.claude/` dot-directory that a `glob('**/*.md')` sweep silently skips.
>   Not INIT-only tooling: it ships with the agent-skills-best-practices
>   skill and survives adaptation.

---

## Step 0 — Reconcile pre-existing files (do this before copying anything)

You are often dropping this template into a repository that **already has** some
of these files — modern scaffolds (`create-next-app`, `create-vite`, many
others) now generate their own `AGENTS.md` and `CLAUDE.md`. Overwriting them
silently loses real project guidance.

Before copying the template over an existing tree, check for collisions and
merge rather than clobber:

- **Existing `AGENTS.md`** — do **not** overwrite. Copy the template's
  `AGENTS.md` in as `AGENTS.template.md`, then fold any project-specific rules
  the existing file already contains (framework gotchas, "read these docs first"
  notes, house style) into the template's **Project Overview** (Step 2) or a
  project-specific skill (Step 5). Replace `AGENTS.md` only once its content is
  preserved. Concrete example: `create-next-app` generates an `AGENTS.md` whose
  one rule is load-bearing — Next.js 16 has breaking changes and ships its own
  docs in `node_modules/next/dist/docs/`; fold that into the Project Overview
  and the current-docs table, don't drop it.
- **Existing `CLAUDE.md`** — if it is already just `@AGENTS.md`, keep it. If it
  holds other instructions, append `@AGENTS.md` rather than replacing them.
- **Existing `.gitignore`** — keep the project's file; merge in the template's
  `settings.local.json` / `.env.local` entries (Step 6) instead of overwriting.
  Watch for a blanket `.env*` entry (`create-next-app` ships one): it also
  ignores the `.env.example` that `session-start.sh` copies from — replace it
  with the template's `.env.local` / `.env.*.local` entries so the example
  file stays committable.
- **Existing `README.md`** (a real project README, not this template's own) —
  do **not** let Step 7's finalize clobber it: fold `README.template.md`'s
  sections (summary, tech stack, getting started, development workflow,
  testing, related links) into the existing README there instead of renaming
  the seed over it, then delete the seed.
- **Existing `.claude/`** — merge directory-by-directory; never
  replace wholesale.

If the repository is empty/new, there is nothing to reconcile — continue.

---

## Step 1 — Interview the user (REQUIRED, do this first)

You MUST ask the user the questions below before editing any file. Ask them
together, grouped by sub-step, and batch related questions rather than
dribbling them out over many rounds. The interview is strict:

- MUST ask every area that applies to the project. Each area lists concrete
  example options — offer them, but accept any answer.
- MUST NOT infer a default for an area the user has not answered. If the user
  explicitly delegates an area ("your pick", "whatever is standard"), choose a
  sensible option and record it as a stated assumption — delegation is an
  answer; silence is not.
- MUST NOT invent the project's goal or kind under any circumstances.
- MUST record every answer — including delegated picks and "not applicable" —
  in the **Stack Decision Record** (end of this step) before starting Step 2.
- SHOULD skip asking an area whose applicability condition clearly fails
  (e.g. styling for a headless REST API), recording it as not applicable.

### 1a — Project identity

1. **Project overview.** In one or two sentences, what is the project's
   purpose / goal / what it is? (This becomes the Project Overview in
   `AGENTS.md` and the quick summary in the project README.) Also collect any
   **related links** — docs, issue tracker, deployment dashboard, design
   files — for the README's Related-links section (Step 7); "none" is a fine
   answer.
2. **Application type.** What kind of project is this?
   - Web client / full-stack web app
   - Mobile app
   - Server (RESTful API, GraphQL, WebSocket, …)
   - CLI, library, desktop app, something else

   Does it have a user-facing UI surface?

### 1b — Core toolchain (always present)

3. **Always-present tooling.** Which does the project use for each of:
   - **App framework / runtime** — examples per application type: web
     (Next.js, Remix, …), mobile (Expo, Flutter, …), server (Hono, NestJS,
     Apollo, Express, …), or `none (plain runtime)`
   - **Primary language** (e.g. TypeScript, Python, Go)
   - **Package manager** (e.g. npm, pnpm, yarn, bun, pip)
   - **Linter** (e.g. Biome, ESLint, Ruff)
   - **Formatter** (e.g. Biome, Prettier, gofmt). If the project has **no
     dedicated formatter** (a default `create-next-app`, for example, ships
     ESLint but no Prettier), say so — see Step 3 for how to handle it.

### 1c — Architecture & structure

These answers fill no `{{TOKEN}}`; they live in the Stack Decision Record and
are consumed by Step 2 (Project Overview) and Step 5 (the structure /
component / UI-design skills). Ask each area that applies:

4. **Directory structure** (worth deciding early, especially for smaller
   apps):
   - by feature (domain A, domain B, …)
   - by purpose/type (components, hooks, persistence, …)
5. **Business-logic structure:**
   - React hooks and context-based
   - Bloc (or a similar event/state pattern)
   - Clean Architecture model-based
   - none / ad-hoc
6. **State management** *(if the app holds client-side or shared state)*:
   - client state (e.g. Zustand, Jotai, Redux)
   - server cache (e.g. TanStack Query, Apollo Client)
   - Bloc, or another pattern-supplied store
7. **Database layer** *(if the app persists data — mobile and
   server/full-stack apps especially)*: PostgreSQL, MySQL, Firebase
   Firestore, libSQL/SQLite, … Whether the project has, adds, or skips a
   data/content layer at all is decided in 1d; this records *which* engine.
8. **ORM / db-wrapper library** *(if the app persists data and a database
   layer was picked in item 7 — mobile and server/full-stack apps
   especially)*: Drizzle, Prisma, … — or none (raw driver/SQL).
9. **Interface / validation & sanitization** *(if the project parses external
   input — API payloads, forms, env)*: zod, valibot, …
10. **Styling** *(if the project renders UI)*: CSS Modules, Tailwind,
    Emotion, …
11. **Theming** *(if the project renders UI)*: CSS variables + Radix color
    system, React Native Unistyles, …
12. **Headless component library** *(if the project renders UI)*: Base UI,
    Radix UI, none (hand-rolled), …

### 1d — Optional capabilities

13. **For each, decide _have / add / skip_.** Do **not**
    assume these exist. A freshly scaffolded app usually has none of them, so
    the honest default is often "add" or "skip", not "delete". For each one
    ask: does the project already have it, do you want to **add** it now, or
    skip it? For **have** and **add**, the answer MUST name the tool — "we
    have unit tests" without a framework name is not a recorded decision.
    - **Unit tests** (e.g. Vitest, Jest, pytest)
    - **E2E tests** (e.g. Playwright, Cypress, Detox, Maestro)
    - **E2E scenario coverage** (a journey-catalog coverage metric over the e2e suite — which user journeys the tests assert; requires E2E tests)
    - **Error tracker** (e.g. Sentry, Rollbar)
    - **Structured logger** (e.g. Pino, Winston)
    - **Data / content layer** (e.g. Prisma, Drizzle, Payload CMS, a REST API — the engine and ORM/wrapper picked in 1c, when the project has one)
    - **Hosting platform** (e.g. Vercel, AWS, Fly.io)

    **Not on this list — fixed, do not ask:** GitHub operations
    (`github-operation-guidelines`) and the independent-review loop (the
    `/address` / `/handoff` skills, `REVIEW.md`, and the `.github/workflows/`)
    are **fixed infrastructure** (see the "Fixed vs. configured" note at the top).
    INIT configures and adapts them but never offers them up for deletion; record
    them as kept, and resolve their markers as "keep + adapt" in Step 4.

    Record each of the seven capabilities above as **have → _tool_**, **add →
    _tool_**, or **skip**. This single answer drives both the token fill (Step 3)
    and the keep-or-delete decision for every `<!-- INIT:OPTIONAL -->` section
    (Step 4): **have** and **add** keep the section (fill the token; **add** also
    scaffolds the tool in Step 5); **skip** deletes it — or, for infrastructure
    the project will plausibly add later, marks it **dormant** (see Step 4). (Not
    every marked section has a token: E2E scenario coverage has a Step-4 bullet
    instead of a token fill, and a few smaller marked sections — typed-language
    type safety, the unit-coverage gate, the backend/API test helpers — carry
    their keep-or-delete instruction in the marker itself. The Step-4 grep walk
    resolves them all; decide the smaller ones from the project's own shape rather
    than a Step-1 answer.)

### 1e — Agent (fixed: Claude Code)

14. **Agent — do not ask.** This template targets **Claude Code**, and only
    Claude Code; the harness binding is fixed (see Step 6). There is no "which
    agents?" question — record the agent as `Claude Code` in the Stack Decision
    Record and move on. (If a project also wants to drive these same
    `AGENTS.md` + `.claude/skills/**` files from another agent, that is a
    post-INIT addition the project makes itself, not an INIT choice.)

### Stack Decision Record

Collect every 1a–1e answer into one table — the Stack Decision Record — and
keep it for the rest of the INIT run: Step 2 (Project Overview), Step 3 (token
fill), Step 4 (optional-capability resolution), and Step 5 (project-specific
skills) all consume it. `Source` is one of `answered`, `delegated
(assumption)`, or `not applicable`:

| Area | Decision | Source |
| ---- | -------- | ------ |
| Application type | full-stack web app | answered |
| State management | Zustand | delegated (assumption) |
| Theming | — (headless REST API) | not applicable |

If the project already has a manifest/lockfile/config, you SHOULD read it to
confirm the answers instead of relying solely on the user — confirmation
supplements the interview; it never replaces asking. **Prefer adding a missing
capability over silently dropping it** — deleting a whole testing or
observability skill should be a deliberate choice the user made, not a default.
(The `/address` / `/handoff` skills, `REVIEW.md`, the CI workflows, and
`github-operation-guidelines` are the exception — they are fixed and never
dropped; see the "Fixed vs. configured" note.)

---

## Step 2 — Fill the Project Overview

In `AGENTS.md`, replace the `## Project Overview` placeholder block with a short,
durable description built from the Stack Decision Record (Step 1). Keep it to a
few bullets; deep layout detail — and the 1c architecture decisions — belongs
in a project-specific structure skill (Step 5), not here. Remove the
top-of-file "Template note" blockquote.

---

## Step 3 — Replace the placeholder tokens

Every `{{TOKEN}}` maps to a Stack Decision Record entry (Step 1). Replace ALL
occurrences across
`AGENTS.md`, `README.template.md`, and `.claude/**`. The table below is the
complete set used by the template (also machine-readable in `tokens.json`). Each
row gives several example values across different stacks so the substitution is
unambiguous — pick the one matching the project, or follow the same shape for a
stack not listed.

> **Use `./init.sh`, not a `sed` sweep.** Two tokens — `{{CODE_FILE_GLOB}}`
> (`*.ts | *.tsx | *.css`) and `{{CODE_FILE_REGEX}}` (`\.(ts|tsx|css)$`) —
> contain shell/regex metacharacters (`| * ( ) \ $`) that break a naive
> `sed s|...|...|` replacement. Run `./init.sh init`, fill `init.values.json`,
> then `./init.sh apply`; it substitutes literally and then runs the gates. If
> you must replace by hand, do these two literally and verify with
> `./init.sh check`.

> **No dedicated formatter?** If the project lints but has no separate formatter
> (common for a default `create-next-app`: ESLint, no Prettier), set
> `{{FORMATTER}}` to the linter's autofix (e.g. `ESLint (eslint --fix)`) and
> `{{FORMAT_CMD}}` to that command (e.g. `npx eslint --fix`). Alternatively,
> **add** a formatter (Prettier/Biome) during Step 5, or delete `format.sh` and
> the format-on-edit binding (Step 6) so the project is lint-only.

> Rule of thumb for command tokens: if the project exposes run-scripts through
> its package manager, prefer those (`npm run build`, `pnpm test`); otherwise use
> the direct tool invocation (`tsc --noEmit`, `go test ./...`). Always use the
> project's *actual* scripts when they exist — the examples are only shapes.

### Identity & stack

| Token | Fill with | Example values (pick the matching stack) |
| ----- | --------- | ---------------------------------------- |
| `{{PROJECT_NAME}}` | Project / repo name | `acme-web` · `billing-service` · `dotctl` |
| `{{PROJECT_OVERVIEW}}` | One-line goal/overview | `Internal dashboard for fleet operations.` · `CLI for managing dotfiles.` |
| `{{PROJECT_KIND}}` | Kind of project | `web app` · `mobile app` · `CLI` · `library` · `backend service` · `desktop app` |
| `{{PRIMARY_LANGUAGE}}` | Main language | `TypeScript` · `Python` · `Go` · `Rust` · `Swift` |
| `{{APP_FRAMEWORK}}` | App framework / runtime | `Next.js` · `React Native` · `Express` · `FastAPI` · `Gin` · `none (plain runtime)` |
| `{{PACKAGE_MANAGER}}` | Package manager binary (single binary only — the hooks call `command -v` on it, so a multiword value like `npx playwright` will not work) | `npm` · `pnpm` · `yarn` · `bun` · `pip` · `poetry` · `cargo` · `go` |
| `{{LINTER}}` | Linter | `Biome` · `ESLint` · `Ruff` · `golangci-lint` · `Clippy` |
| `{{FORMATTER}}` | Formatter | `Biome` · `Prettier` · `Ruff` · `gofmt` · `rustfmt` |
| `{{UNIT_TEST_FRAMEWORK}}` | Unit test framework | `Jest` · `Vitest` · `pytest` · `go test` · `cargo test` |
| `{{SOURCE_DIR}}` | Main source dir (no trailing slash — templates append the `/`) | `src` · `app` · `lib` · `internal` |
| `{{TEST_DIR}}` | Test root dir (no trailing slash — templates append the `/`) | `e2e` · `tests` · `__tests__` · `spec` |

### Optional integrations

If the project does not use one of these, **delete** the matching skill /
section instead of filling the token (see Step 4). When kept, fill the token.

| Token | Fill with | Example values | If absent |
| ----- | --------- | -------------- | --------- |
| `{{E2E_TEST_FRAMEWORK}}` | E2E test framework | `Playwright` · `Cypress` · `Detox` | delete `e2e-testing-guidelines` |
| `{{ERROR_TRACKER}}` | Error-reporting service | `Sentry` · `Rollbar` · `Bugsnag` · `Honeybadger` | delete the error-tracking sections of `observability-guidelines` |
| `{{LOGGER}}` | Structured logger | `Pino` · `Winston` · `structlog` · `zap` | delete the logging section of `observability-guidelines` |
| `{{CMS_OR_DATA_LAYER}}` | Data / content layer | `Payload CMS` · `Prisma` · `Drizzle` · `SQLAlchemy` · `a REST API` | delete the data-layer sections (marked optional) |
| `{{HOSTING_PLATFORM}}` | Hosting / deploy platform | `Vercel` · `AWS` · `Fly.io` · `Cloudflare` · `self-hosted` | leave generic or delete the mention |

### Commands

| Token | Fill with | Example values (npm-scripts · direct) |
| ----- | --------- | ------------------------------------- |
| `{{INSTALL_CMD}}` | Install dependencies | `npm install` · `pnpm install` · `pip install -r requirements.txt` · `go mod download` |
| `{{DEV_CMD}}` | Start dev server | `npm run dev` · `pnpm dev` · `uvicorn app:app --reload` · `go run ./...` |
| `{{BUILD_CMD}}` | Production build | `npm run build` · `pnpm build` · `go build ./...` · `cargo build --release` |
| `{{START_CMD}}` | Start built app | `npm run start` · `node dist/index.js` · `./bin/app` |
| `{{FORMAT_CMD}}` | Run formatter | `npm run format` · `biome format --write .` · `ruff format .` · `gofmt -w .` |
| `{{LINT_CMD}}` | Run linter | `npm run lint` · `biome check .` · `ruff check .` · `golangci-lint run` |
| `{{TYPECHECK_CMD}}` | Type-check (drop if the language is untyped) | `npm run typecheck` · `tsc --noEmit` · `mypy .` |
| `{{UNIT_TEST_CMD}}` | Run unit tests | `npm run test:unit` · `pnpm test` · `pytest` · `go test ./...` |
| `{{E2E_TEST_CMD}}` | Run e2e tests | `npm run test:e2e` · `npx playwright test` · `cypress run` |

### Harness-hook tokens (`.claude/hooks/*.sh`)

| Token | Fill with | Example values |
| ----- | --------- | -------------- |
| `{{CODE_FILE_GLOB}}` | Shell `case` pattern of formatted extensions (`format.sh`) | `*.ts \| *.tsx \| *.css` · `*.py` · `*.go` |
| `{{CODE_FILE_REGEX}}` | Extended-regex of source extensions (`check.sh`) | `\.(ts\|tsx\|css)$` · `\.py$` · `\.go$` |

A find-and-replace sweep is the fastest path. After replacing, search the tree
for `{{` to confirm none remain (the completion checklist does this).

---

## Step 4 — Resolve optional capabilities (add or remove)

The skill core is intentionally broad. Every capability-specific block is wrapped
with a greppable marker so you can find them all:

```bash
grep -rn 'INIT:OPTIONAL' .claude .github AGENTS.md REVIEW.md README.template.md   # every optional section, with a key
```

**The loop machinery is fixed — never deleted here.** The `/address` /
`/handoff` skills, `REVIEW.md`, the `.github/workflows/`, and
`github-operation-guidelines` are permanent (see the "Fixed vs. configured" note
at the top of this file): resolve their `INIT:OPTIONAL` markers as "keep +
adapt", never as a deletion. Every *other* marked capability is resolved by its
Step-1 decision below.

For **each** marked section, apply the Step 1 decision for that capability:

- **have** / **add** → keep the section and fill its token. For **add**, also
  scaffold the tool in Step 5 (install it, add the run-script, wire the command
  token) so the kept rules describe something real. Then delete the
  `<!-- INIT:OPTIONAL ... -->` comment and the italic "_delete during INIT_"
  note, leaving the content.
- **skip** → delete the whole marked section (and, for a whole skill, follow the
  removal list below). Remove the marker, the note, and every inbound link.
  (The fixed loop machinery above is never skipped.)
- **dormant** (a middle path) → keep the section, but replace its
  `<!-- INIT:OPTIONAL ... -->` marker and italic note with a **visible**
  one-line banner, so the rule self-restores instead of vanishing:

  ```markdown
  > **Dormant until <infrastructure> exists** — remove this banner when it
  > lands, making the lens unconditional.
  ```

  Replace any unfilled `{{TOKEN}}` inside a dormant section with neutral prose
  (e.g. "the project's error tracker") and delete the token's row from
  `tokens.json` (and `init.values.json`, if already generated) — `./init.sh
  apply` refuses to run while any manifest-listed token has no value, whether
  or not it still occurs in the tree. Prefer
  **dormant** over **skip** for service-shaped capabilities the project is
  likely to acquire (an error tracker, server-side caching, a data layer): the
  rules are already correct and only their infrastructure is missing. Prefer
  **skip** for capability-shaped sections that would be re-authored anyway when
  adopted (a whole test framework) — a dormant copy of those only rots.

Do not leave a section half-resolved: a kept section MUST have its token (if any)
filled; a skipped section MUST be gone along with its links; a dormant section
MUST carry its banner and no unfilled token. The detailed removal lists below
apply to the **skip** path.

- **No error tracker AND no structured logger** → the
  `.claude/skills/observability-guidelines/` skill MAY be deleted (or
  dormant-marked per the dormant path above, when the project will plausibly
  add either tool). If only one of the two is missing, instead trim the
  sections marked `key=ERROR_TRACKER` / `key=LOGGER` inside the skill. On the
  delete path, resolve every inbound link:
  - the Observability Guidelines row of the `AGENTS.md` skill index, and the
    word "observability" in the review-lenses MUST bullet of `AGENTS.md`'s
    Review Independence Gates;
  - the "Error handling and structured logging" row of the
    developer-facing-skills table in `code-review-guideline/SKILL.md`;
  - the "Error handling, error-reporting, and logging" row of the topic table
    in `development-guidelines/SKILL.md`;
  - the `{{ERROR_TRACKER}} config and {{LOGGER}} setup` row of the
    output-surface table in `development-guidelines/references/verification.md`;
  - the `{{ERROR_TRACKER}}` row and refresh bullet in
    `development-guidelines/references/current-docs.md` (marked
    `key=ERROR_TRACKER`);
  - the `logger.info()` / `logger.warn()` phrasing in the secret-interpolation
    bullet of `application-security-requirements/references/secret-handling.md`
    (reword to "any log/console output" when the logger is dropped);
  - in `performance-and-reliability-requirements/SKILL.md` and its
    `references/error-and-observability.md`, the rules survive as the
    reviewer's checklist: drop each `per [observability-guidelines › …]` /
    "Defer the developer-facing rules to …" citation and fold the cited rule
    inline (e.g. "…not in nested helpers, so errors propagate to the root call
    site"; "the project routes errors through `reportError(...)`");
  - the start/complete log-pair SHOULD bullet in
    `performance-and-reliability-requirements/references/caching-correctness.md`
    (delete the bullet);
  - the logging-module label sub-bullet in
    `maintainable-code-guidelines/references/naming-and-organization.md`
    (delete it);
  - the empty-`try`/`catch` bullet in
    `maintainable-code-guidelines/references/complexity-and-readability.md`:
    keep the bullet but fold the rule inline — "errors are rethrown or
    reported, never swallowed" — instead of linking the rethrow rule.
- **GitHub operations** → `.claude/skills/github-operation-guidelines/` is
  **fixed — keep it** (this template drives GitHub through Claude Code + the
  GitHub MCP server, and the independent-review channel depends on it). Delete
  its `<!-- INIT:OPTIONAL -->` marker and the italic note below it,
  replace the example tool-channel, marker, and branch-prefix names with the
  project's real ones, and review its Conventions section's SHOULD bullets
  against the project's policy. A project that genuinely does no GitHub
  automation leaves the skill's rules dormant rather than deleting the skill.
- **Independent-review channel** → the `/address` and `/handoff` skills,
  `REVIEW.md`, and the `.github/workflows/*.yaml` are **fixed — keep them all.**
  This is the template's Claude delivery loop, and it requires the
  GitHub-operations capability (also fixed — keep both). Delete the
  `key=INDEPENDENT_REVIEW` and `key=SESSION_HANDOFF` markers and their italic
  notes across `REVIEW.md`, `.claude/skills/address/SKILL.md`,
  `.claude/skills/handoff/SKILL.md`, `.github/workflows/claude-review.yaml`,
  `.github/workflows/merge-checks.yaml`, the "Repository Review Policy Overlay"
  section and marked posted-review bullets in `code-review-guideline`
  (`SKILL.md`, `references/severity.md`, `references/evidence.md`,
  `references/escalation.md`), the marked SHOULD bullet in `AGENTS.md`'s Review
  Independence Gates, the marked Workflow Entry Points subsection in
  `AGENTS.md`'s Skill Index, and the marked `/address` / `/handoff` subsections in
  `README.template.md`'s Development workflow section — leaving the content in
  place — and then configure it (a project that wants no automated loop disables
  the workflow triggers and leaves the skills dormant rather than deleting
  them):
  - fill `REVIEW.md`'s do-not-report list with the checks the project's CI
    actually enforces (the `merge-checks.yaml` jobs), and review its mandatory
    checks against the project's `AGENTS.md` skill index;
  - set the review trigger phrase and reviewer identity across
    `claude-review.yaml` and the address skill
    (`.claude/skills/address/SKILL.md`). The trigger phrase
    is functional and dangerous in prose: a comment-triggered workflow matches
    it **anywhere** in a comment body, so the literal phrase belongs ONLY in
    the workflow and entry-point skill files — everywhere else refer to it as "the
    review trigger phrase";
  - replace the `@<maintainer>`, agent-comment-marker, and branch-prefix
    examples in `.claude/skills/address/SKILL.md` with the project's real values
    per `github-operation-guidelines`;
  - the `{{INSTALL_CMD}}` / `{{LINT_CMD}}` / `{{UNIT_TEST_CMD}}` run commands
    in `merge-checks.yaml` are substituted by `./init.sh apply` like every
    other token; only the toolchain setup (setup-node, `.nvmrc`, the npm
    cache) is not a token — replace it with the project's own by hand.
    The template ships no `.nvmrc`: even a project keeping the npm-flavored
    setup must create one (or switch `setup-node` to `node-version:`), or
    both jobs fail at Setup Node on every run. Note both jobs self-skip
    their real steps (and pass) while `INIT.md` exists; deleting the INIT
    tooling in Step 7 is what arms them, so a green Merge Checks before
    that point does not mean lint/tests ran.
- **No e2e framework** → delete `.claude/skills/e2e-testing-guidelines/` and
  its index row, then remove every inbound link to it:
  - `quality-assurance-guidelines/references/e2e-coverage.md` (delete the file)
    and its pointer in `quality-assurance-guidelines/SKILL.md`;
  - the `../e2e-testing-guidelines/SKILL.md` link in
    `quality-assurance-guidelines/SKILL.md`;
  - the `../../e2e-testing-guidelines/SKILL.md` link in
    `unit-test-guidelines/references/testing-scope.md`;
  - the `../e2e-testing-guidelines/SKILL.md` link in
    `product-requirement-guidelines/SKILL.md`;
  - the e2e row of the topic table in `development-guidelines/SKILL.md`;
  - the e2e row of the developer-facing-skills table in
    `code-review-guideline/SKILL.md`;
  - the `../../e2e-testing-guidelines/SKILL.md` link in
    `performance-and-reliability-requirements/references/server-client-boundary.md`;
  - the e2e-authoring pointer in
    `development-guidelines/references/verification.md`;
  - the `{{E2E_TEST_CMD}}` bullet in the `AGENTS.md` Verification section;
  - the marked e2e rows in `README.template.md`'s Tech stack and Testing
    tables.

  Deleting the e2e skill also removes every `key=SCENARIO_COVERAGE` site (next
  bullet) — the two that live outside `e2e-testing-guidelines/` are inside
  `quality-assurance-guidelines` files deleted or trimmed above.
- **E2E suite kept, but no scenario-coverage catalog** → delete every
  `INIT:OPTIONAL key=SCENARIO_COVERAGE` site:
  - `e2e-testing-guidelines/references/scenario-coverage.md` (delete the file)
    and its "E2E Scenario Coverage" routing section in
    `e2e-testing-guidelines/SKILL.md`;
  - the "Scenario Coverage" section in
    `quality-assurance-guidelines/references/e2e-coverage.md` and the marked
    scenario-coverage bullet in `quality-assurance-guidelines/SKILL.md`.

  If the project **adopts** it, keep all four sites, delete the markers and
  italic notes, and then in Step 5 author the journey catalog (e.g.
  `scenarios.md` in `{{TEST_DIR}}`), pick the tag syntax
  `{{E2E_TEST_FRAMEWORK}}` supports, and build the coverage reporter and gate
  script — the template ships the convention only, no implementation.
- **No unit test framework** → delete `.claude/skills/unit-test-guidelines/`
  and its index row, then remove every inbound link to it:
  - the `../unit-test-guidelines/SKILL.md` link in
    `product-requirement-guidelines/SKILL.md`;
  - the unit-test row of the developer-facing-skills table in
    `code-review-guideline/SKILL.md`;
  - the `{{UNIT_TEST_CMD}}` bullet in the `AGENTS.md` Verification section;
  - the marked unit-test rows in `README.template.md`'s Tech stack and
    Testing tables.
- **No data/content layer** → delete every `key=DATA_LAYER` site (the Step-4
  grep finds them all): the marked sections in `development-guidelines`
  (`dev-commands.md`, `change-management.md`, plus the `current-docs.md` row
  and bullet), `application-security-requirements` (`access-control.md`),
  `performance-and-reliability-requirements`
  (`references/data-access-efficiency.md` — the whole file — and its
  "Data-Access Efficiency" section in `SKILL.md`), and
  `maintainable-code-guidelines` (`abstraction-boundaries.md` — rewrite the
  Data-Access / UI Split bullets around the project's actual persistence
  boundary — and the realm row/bullet in `naming-and-organization.md`), plus
  the marked data-layer row in `README.template.md`'s Tech stack table. Then
  sweep the prose: the "data-layer/migration handling" / "migrations" phrases
  in `development-guidelines/SKILL.md`'s description and body, the
  data-access/data-layer phrases in the `AGENTS.md` index rows
  (Development Guidelines, Performance and Reliability) and in `AGENTS.md`'s
  high-risk and Verification bullets, and the data-layer mentions in
  `performance-and-reliability-requirements/SKILL.md`'s description.
- **No authentication system** (nothing logs in — no accounts, sessions, or
  admin surface) → delete every `key=AUTH` site:
  `application-security-requirements/references/auth-and-session.md` (move its
  auth-independent "Localhost / Production Divergence" section into
  `privacy-and-exposure.md` first) and, when the project also has no data
  layer, `references/access-control.md` entirely; then remove their routing
  sections ("Access Control", "Auth and Session Management") from that skill's
  `SKILL.md`, the auth phrases from its frontmatter description and the
  `AGENTS.md` index row, and the inbound access-control link in
  `performance-and-reliability-requirements/references/data-access-efficiency.md`
  (itself deleted on the no-data-layer path). Verify with
  `.claude/skills/agent-skills-best-practices/scripts/check-links.sh`.
- **No client bundle / not a UI project** → remove the "User-Facing Work"
  subsection from `AGENTS.md` and the bundling/asset sections (marked optional)
  in `performance-and-reliability-requirements`.
- Walk every `<!-- INIT:OPTIONAL ... -->` marker (the grep above) and resolve
  each one as **have/add/skip** per Step 1.

Whenever you remove a skill, also remove every relative link pointing to it so
no dangling links remain. Verify with
`.claude/skills/agent-skills-best-practices/scripts/check-links.sh`.

---

## Step 5 — Add project-specific skills

The template deliberately ships only the cross-project core. Recreate the
project's own skills as needed, following
[Agent Skills Best Practices](.claude/skills/agent-skills-best-practices/SKILL.md)
and its
[project-skill archetypes](.claude/skills/agent-skills-best-practices/references/project-skill-archetypes.md)
reference — section-by-section skeletons for the skills below. Common ones to
add:

- **Project Structure** — repository layout, stack, services, file placement.
  Create this first; `AGENTS.md` already points at it. Its Stack section MUST
  record the Stack Decision Record's directory-structure, business-logic
  structure, state-management, database-engine, ORM/db-wrapper, and
  validation/sanitization decisions (1c).
- **Component / UI skills** — if the project has a UI (component conventions,
  styling, UI design principles, accessibility). These MUST record the Stack
  Decision Record's headless-component-library, styling, and theming decisions
  (1c).
- **Routing** — if the project has a routing layer.
- **Domain skills** — content authoring, data-model/CMS operations, or any
  domain workflow specific to this project.

For each new skill: add a directory under `.claude/skills/<name>/` with a
`SKILL.md`, then add a row to the `AGENTS.md` skill index (there is a commented
example block there) and to the review-lens lists in
`code-review-guideline` / `development-guidelines` where relevant.

**Scaffolding capabilities chosen as "add" in Step 1.** When the user opted to
add a capability rather than skip it, set it up for real here so the kept rules
are not aspirational:

- **Unit tests** → install the runner (e.g. `vitest`), add a `test:unit`
  run-script, fill `{{UNIT_TEST_FRAMEWORK}}` / `{{UNIT_TEST_CMD}}`, and create a
  first example test. Keep `unit-test-guidelines`.
- **E2E tests** → install the runner (e.g. `@playwright/test`), add a
  `test:e2e` script, fill `{{E2E_TEST_FRAMEWORK}}` / `{{E2E_TEST_CMD}}` /
  `{{TEST_DIR}}`. Keep `e2e-testing-guidelines`.
- **E2E scenario coverage** → author the journey catalog (e.g. `scenarios.md`
  in `{{TEST_DIR}}`), tag the asserting tests, and build the coverage
  reporter/gate wired into the e2e run. Keep the marked `SCENARIO_COVERAGE`
  sections.
- **Error tracker / logger** → add the dependency and its init, fill
  `{{ERROR_TRACKER}}` / `{{LOGGER}}`. Keep `observability-guidelines`.
- **Formatter** → add it (e.g. Prettier/Biome), add a `format` script, fill
  `{{FORMATTER}}` / `{{FORMAT_CMD}}`.

Confirm each added command actually runs before relying on the `check.sh` /
`format.sh` hooks that call it.

---

## Step 6 — Set up the Claude Code harness binding

`AGENTS.md` + `.claude/skills/**` are the portable substance. This template
targets **Claude Code** (fixed — Step 1e), which reads them through the
`.claude/` binding:

- **Claude Code** — `CLAUDE.md` (`@AGENTS.md`) plus the `.claude/` directory:
  - `.claude/skills/**` is also discovered natively by Claude Code, so each
    skill is directly invocable in addition to being routed via `AGENTS.md`.
  - `.claude/settings.json` wires the `SessionStart` hook and sets the
    default reasoning effort level (`effortLevel`; ships as `xhigh`).
  - `.claude/settings.local-example.json` is the opt-in quality binding
    (format-on-edit + lint/test-before-stop); the session-start hook copies it
    to `settings.local.json` in cloud sessions.
  - `.claude/hooks/*.sh` are **examples** — fill `{{CODE_FILE_GLOB}}`,
    `{{CODE_FILE_REGEX}}`, `{{INSTALL_CMD}}`, command tokens, and adapt the
    toolchain-provisioning block in `session-start.sh` to the project's runtime
    (the example uses `mise` + Node). Delete any hook the project doesn't want.
  - The session-start hook materializes `settings.local.json` and `.env.local`.
    The template ships a `.gitignore` that excludes both (the
    `application-security` skill assumes they are gitignored) — keep those entries
    and merge the rest of the project's ignores into it. If the project keeps its
    own `.gitignore` elsewhere, move these entries there instead.
The Claude Code binding is the only one to set up — there is no per-agent choice
to make. A project that later wants to also drive the same
`AGENTS.md` + `.claude/skills/**` from another agent (Cursor, Copilot, Aider, …)
adds that binding itself, outside INIT, by pointing the agent at `AGENTS.md` via
its own mechanism; the portable substance already supports it.

---

## Step 7 — Finalize

- Finalize the project README from its seed:
  `git mv -f README.template.md README.md` (replacing the template's own
  README — but when the repository already had its own real README, merge the
  seed's sections into it instead and delete the seed; see Step 0),
  then complete it against the Stack Decision Record and the Step-1 answers —
  expand the quick summary into a short paragraph, trim the Tech stack table
  to what the project actually uses, verify the Getting-started commands run,
  resolve the Development-workflow and Testing markers against the kept
  capabilities, and fill Related links (or delete that section) — and delete
  every `<!-- INIT… -->` comment in it. The finished README MUST cover: a
  quick summary, the tech stack, getting started, the development workflow
  (including `/address`, which is fixed infrastructure), the testing strategy
  and its commands, and related links (when applicable).
- Run `./init.sh check` and resolve everything it reports.
- Walk the completion checklist below **while the INIT tooling still exists** —
  several items run `./init.sh check`, and checking them after the deletion
  step would leave those items with no runnable command.
- Then delete the INIT tooling — all of it, unconditionally: `INIT.md`,
  `init.sh`, `tokens.json`, `init.values.json`, and
  `.github/workflows/template-checks.yaml` (the template repository's own CI).
  None of these are meant to survive adaptation; a leftover copy is dead
  weight that only rots. The link checker
  (`.claude/skills/agent-skills-best-practices/scripts/check-links.sh`) is
  **not** INIT tooling — it ships with the agent-skills-best-practices skill
  and stays. If the project wants an ongoing docs-link gate, wire that script
  into its own CI as ordinary project work.
- Remove the "Template note" blockquote at the top of `AGENTS.md`, every
  `<!-- INIT:OPTIONAL ... -->` marker and `<!-- INIT: ... -->` fill-in comment,
  and every "TEMPLATE NOTE" / "_delete during INIT_" line for sections you
  decided to keep.

### Completion checklist

- [ ] No `{{TOKEN}}`s remain in authored files (build/VCS dirs excluded):
      `./init.sh check` (or `grep -rnE '\{\{[A-Z][A-Z0-9_]*\}\}' .
      --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git`).
      The uppercase-token pattern matters when the independent-review
      workflows are kept: GitHub Actions `${{ ... }}` expressions contain
      `{{` but are lowercase, so they never match, while leftover tokens in
      `.github/` (e.g. `merge-checks.yaml`'s run commands) are caught.
- [ ] No `<!-- INIT… -->` markers remain — neither `INIT:OPTIONAL` capability
      markers nor `INIT:` fill-in comments: `grep -rn '<!-- INIT' .`
- [ ] No dangling relative skill links:
      `.claude/skills/agent-skills-best-practices/scripts/check-links.sh`
      (checks the `.claude/` tree a `glob('**/*.md')` sweep would skip).
- [ ] `AGENTS.md` skill index matches the directories under `.claude/skills/`.
- [ ] Removed skills have no remaining inbound links (the fixed loop machinery —
      `/address`, `/handoff`, `REVIEW.md`, the workflows, `github-operation-guidelines` —
      is never removed).
- [ ] The conditional hedges are resolved — in every bullet hedged with a
      "when the project has …" clause, delete the clause when the capability
      was kept and the whole bullet when it was skipped. They live in
      `AGENTS.md`'s Verification section (the `{{UNIT_TEST_CMD}}`,
      `{{E2E_TEST_CMD}}`, and `{{BUILD_CMD}}` bullets) **and** outside it:
      `development-guidelines/references/dev-commands.md` (build, unit, e2e
      bullets), `references/code-quality.md` (check-sequence test step),
      `references/verification.md` (the e2e-suite bullet), and
      `unit-test-guidelines/references/review-checklist.md` (the typecheck
      clause). Grep for `when the project has` to catch them all.
- [ ] Skipped capabilities no longer appear in prose: grep the tree for each
      skipped tool's name and for generic phrases like "data layer",
      "structured logger", or "error tracker" in skill descriptions and
      `AGENTS.md` index rows, and reword or delete the stragglers.
- [ ] Every skill removed in Step 4 is also gone from the review-lenses MUST
      bullet in `AGENTS.md`'s Review Independence Gates (e.g. drop
      "observability" when `observability-guidelines` was deleted).
- [ ] Added capabilities have a working command (the `check.sh` / `format.sh`
      hooks actually run).
- [ ] `merge-checks.yaml` is kept (fixed): its jobs actually run the lint/test
      steps instead of skipping them — the guard steps disarm once `INIT.md`
      is deleted, so check a post-INIT run's log shows the steps executing.
- [ ] The Claude Code harness binding is filled in and runnable.
- [ ] A `.gitignore` excludes `settings.local.json` and `.env.local` (or the
      project's equivalent local-state/secret files).
- [ ] `INIT.md` and template scaffolding notes/tooling are deleted — including
      `init.sh`, `tokens.json`, `init.values.json`, and
      `.github/workflows/template-checks.yaml`.
- [ ] The README seed is finalized: `README.template.md` is gone (renamed
      over — or merged into — `README.md`), no `<!-- INIT… -->` comment or
      `{{TOKEN}}` remains in
      `README.md`, and it covers the quick summary, tech stack, getting
      started, development workflow, testing strategy and commands, and
      related links (or that section was deliberately dropped). The template's
      own README — the one titled "Claude Loop Engineering Template" — no
      longer exists.
