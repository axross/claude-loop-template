# INIT — Adapting this template to a project

This repository is a **reusable, framework-agnostic and AI-agent-agnostic
template** for an `AGENTS.md`-driven skill system. It ships:

- `AGENTS.md` — the master routing index + working agreement (the universal,
  agent-agnostic entry point).
- `CLAUDE.md` — a one-line binding (`@AGENTS.md`) so Claude Code loads `AGENTS.md`.
- `.agents/skills/**` — a generic, cross-project **skill core** (10 skills).
- `.claude/**` — an **example** Claude Code harness binding (hooks + settings).

Everything project-specific has been replaced with `{{TOKEN}}` placeholders or
neutral prose. This file tells an AI agent how to turn the template into a
working setup for one concrete project.

> **You are the agent running INIT.** Follow the steps in order. Do not skip
> Step 1 — the rest depends on its answers. Make changes only inside this
> template's files. When done, INIT.md and every `<!-- INIT: ... -->` /
> "TEMPLATE NOTE" / "_template note_" scaffold should be gone.

---

## Step 1 — Interview the user (REQUIRED, do this first)

You MUST ask the user the following before editing any file. Ask them together
(grouped), accept partial answers, and infer sensible defaults only for what the
user leaves unspecified — but never invent the project's goal or kind.

1. **Project kind.** What kind of project is this — a web app, mobile app, CLI,
   library, backend service, desktop app, something else? Does it have a
   user-facing UI surface?
2. **Frameworks & tooling.** Which does the project use for each of:
   - **App framework / runtime** (e.g. Next.js, React Native, Express, none)
   - **Unit test framework** (e.g. Jest, Vitest, pytest, none)
   - **E2E test framework** (e.g. Playwright, Cypress, none)
   - **Linter** (e.g. Biome, ESLint, Ruff)
   - **Formatter** (e.g. Biome, Prettier, gofmt)
   - **Package manager** (e.g. npm, pnpm, yarn, bun, pip)
   - **Primary language** (e.g. TypeScript, Python, Go)
   - Optional: **error tracker** (e.g. Sentry), **structured logger** (e.g.
     Pino), **data/content layer** (e.g. Payload CMS, Prisma, a REST API),
     **hosting platform** (e.g. Vercel).
3. **Rough picture.** In one or two sentences, what is the project's goal /
   overview? (This becomes the Project Overview in `AGENTS.md`.)
4. **Which agents** will use this repo (Claude Code, Cursor, Copilot, others)?
   This decides which harness bindings to keep (see Step 6).

If the project already has a manifest/lockfile/config, you SHOULD read it to
confirm the answers instead of relying solely on the user.

---

## Step 2 — Fill the Project Overview

In `AGENTS.md`, replace the `## Project Overview` placeholder block with a short,
durable description built from the Step 1 answers. Keep it to a few bullets;
deep layout detail belongs in a project-specific structure skill (Step 5), not
here. Remove the top-of-file "Template note" blockquote.

---

## Step 3 — Replace the placeholder tokens

Every `{{TOKEN}}` maps to a Step 1 answer. Replace ALL occurrences across
`AGENTS.md`, `.agents/skills/**`, and `.claude/**`. The table below is the
complete set used by the template. Each row gives several example values across
different stacks so the substitution is unambiguous — pick the one matching the
project, or follow the same shape for a stack not listed.

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
| `{{SOURCE_DIR}}` | Main source dir | `src/` · `app/` · `lib/` · `internal/` |
| `{{TEST_DIR}}` | Test root dir | `e2e/` · `tests/` · `__tests__/` · `spec/` |

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

## Step 4 — Prune what the project does not need

The skill core is intentionally broad. Remove what does not apply so the agent
isn't told to follow rules for tools the project lacks.

- **No error tracker / structured logger** → delete
  `.agents/skills/observability-guidelines/` (or trim the sections marked with
  an italic "_delete this section during INIT_" note). Remove its row from the
  `AGENTS.md` skill index and any cross-links to it.
- **No e2e framework** → delete `.agents/skills/e2e-testing-guidelines/` and
  its index row, then remove every inbound link to it:
  - `quality-assurance-guidelines/references/e2e-coverage.md` (delete the file)
    and its pointer in `quality-assurance-guidelines/SKILL.md`;
  - the `../e2e-testing-guidelines/SKILL.md` link in
    `quality-assurance-guidelines/SKILL.md`;
  - the `../../e2e-testing-guidelines/SKILL.md` link in
    `unit-test-guidelines/references/testing-scope.md`;
  - the e2e-authoring pointer in
    `development-guidelines/references/verification.md`;
  - the `{{E2E_TEST_CMD}}` bullet in the `AGENTS.md` Verification section.
- **No unit test framework** → delete `.agents/skills/unit-test-guidelines/`
  and its index row.
- **No data/content layer** → remove the data-layer sections (each is marked
  optional) from `development-guidelines`, `application-security-requirements`,
  and `performance-and-reliability-requirements`.
- **No client bundle / not a UI project** → remove the "User-Facing Work"
  subsection from `AGENTS.md` and the bundling/asset sections (marked optional)
  in `performance-and-reliability-requirements`.
- Walk every file for sections flagged `_optional / delete during INIT_` and
  decide each one.

Whenever you remove a skill, also remove every relative link pointing to it so
no dangling links remain.

---

## Step 5 — Add project-specific skills

The template deliberately ships only the cross-project core. Recreate the
project's own skills as needed, following
[Agent Skills Best Practices](.agents/skills/agent-skills-best-practices/SKILL.md).
Common ones to add:

- **Project Structure** — repository layout, stack, services, file placement.
  Create this first; `AGENTS.md` already points at it.
- **Component / UI skills** — if the project has a UI (component conventions,
  styling, UI design principles, accessibility).
- **Routing** — if the project has a routing layer.
- **Domain skills** — content authoring, data-model/CMS operations, or any
  domain workflow specific to this project.

For each new skill: add a directory under `.agents/skills/<name>/` with a
`SKILL.md`, then add a row to the `AGENTS.md` skill index (there is a commented
example block there) and to the review-lens lists in
`code-review-guideline` / `development-guidelines` where relevant.

---

## Step 6 — Set up the agent harness binding(s)

`AGENTS.md` + `.agents/skills/**` are the agent-agnostic substance. Each agent
reads them through its own binding:

- **Claude Code** — `CLAUDE.md` (`@AGENTS.md`) plus the `.claude/` directory:
  - `.claude/settings.json` wires the `SessionStart` hook.
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
- **Other agents** (Cursor, Copilot, Aider, etc.) — point them at `AGENTS.md`
  via their own mechanism (e.g. a rules file that imports/links `AGENTS.md`).
  Add that binding file and, if the agent has no hook system, drop `.claude/`.

Keep only the bindings for the agents named in Step 1.

---

## Step 7 — Finalize

- Delete this `INIT.md`.
- Remove the "Template note" blockquote at the top of `AGENTS.md` and every
  `<!-- INIT: ... -->` comment and "TEMPLATE NOTE" / "_delete during INIT_" line
  you decided to keep content for.
- Update `README.md` to describe the actual project (or replace it).

### Completion checklist

- [ ] No `{{` tokens remain: `grep -rn '{{' . | grep -v node_modules`
- [ ] No dangling relative skill links (every `](../...)` / `](./...)` resolves).
- [ ] `AGENTS.md` skill index matches the directories under `.agents/skills/`.
- [ ] Removed skills have no remaining inbound links.
- [ ] Harness binding for each Step-1 agent is filled in and runnable.
- [ ] A `.gitignore` excludes `settings.local.json` and `.env.local` (or the
      project's equivalent local-state/secret files).
- [ ] `INIT.md` and template scaffolding notes are deleted.
