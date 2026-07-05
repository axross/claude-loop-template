# INIT — Adapting this template to a project

This repository is a **reusable, framework-agnostic and AI-agent-agnostic
template** for an `AGENTS.md`-driven skill system. It ships:

- `AGENTS.md` — the master routing index + working agreement (the universal,
  agent-agnostic entry point).
- `CLAUDE.md` — a one-line binding (`@AGENTS.md`) so Claude Code loads `AGENTS.md`.
- `.claude/skills/**` — a generic, cross-project **skill core** (12 skills).
- `.claude/**` — an **example** Claude Code harness binding (hooks + settings).

Everything project-specific has been replaced with `{{TOKEN}}` placeholders or
neutral prose. This file tells an AI agent how to turn the template into a
working setup for one concrete project.

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
> - `python3 tools/check-links.py` — relative-link integrity across the whole
>   tree, **including** the `.claude/` dot-directory that a
>   `glob('**/*.md')` sweep silently skips.

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
  preserved.
- **Existing `CLAUDE.md`** — if it is already just `@AGENTS.md`, keep it. If it
  holds other instructions, append `@AGENTS.md` rather than replacing them.
- **Existing `.gitignore`** — keep the project's file; merge in the template's
  `settings.local.json` / `.env.local` entries (Step 6) instead of overwriting.
- **Existing `.claude/`** — merge directory-by-directory; never
  replace wholesale.

If the repository is empty/new, there is nothing to reconcile — continue.

---

## Step 1 — Interview the user (REQUIRED, do this first)

You MUST ask the user the following before editing any file. Ask them together
(grouped), accept partial answers, and infer sensible defaults only for what the
user leaves unspecified — but never invent the project's goal or kind.

1. **Project kind.** What kind of project is this — a web app, mobile app, CLI,
   library, backend service, desktop app, something else? Does it have a
   user-facing UI surface?
2. **Always-present tooling.** Which does the project use for each of:
   - **App framework / runtime** (e.g. Next.js, React Native, Express, none)
   - **Linter** (e.g. Biome, ESLint, Ruff)
   - **Formatter** (e.g. Biome, Prettier, gofmt). If the project has **no
     dedicated formatter** (a default `create-next-app`, for example, ships
     ESLint but no Prettier), say so — see Step 3 for how to handle it.
   - **Package manager** (e.g. npm, pnpm, yarn, bun, pip)
   - **Primary language** (e.g. TypeScript, Python, Go)
3. **Optional capabilities — for each, decide _have / add / skip_.** Do **not**
   assume these exist. A freshly scaffolded app usually has none of them, so the
   honest default is often "add" or "skip", not "delete". For each one ask: does
   the project already have it, do you want to **add** it now (and with which
   tool), or skip it?
   - **Unit tests** (e.g. Vitest, Jest, pytest)
   - **E2E tests** (e.g. Playwright, Cypress, Detox)
   - **E2E scenario coverage** (a journey-catalog coverage metric over the e2e suite — which user journeys the tests assert; requires E2E tests)
   - **Error tracker** (e.g. Sentry, Rollbar)
   - **Structured logger** (e.g. Pino, Winston)
   - **Data / content layer** (e.g. Prisma, Drizzle, Payload CMS, a REST API)
   - **Hosting platform** (e.g. Vercel, AWS, Fly.io)
   - **GitHub operations** (agents read/write GitHub through a proxied single-operator identity, e.g. Claude Code + GitHub MCP)
   - **Independent review channel** (a posted-review policy `REVIEW.md` plus a CI reviewer, a local review command, and an end-to-end delivery loop, e.g. GitHub Actions + Claude Code; requires GitHub operations)

   Record each as **have**, **add → _tool_**, or **skip**. This single answer
   drives both the token fill (Step 3) and the keep-or-delete decision for every
   `<!-- INIT:OPTIONAL -->` section (Step 4): **have** and **add** keep the
   section (fill the token; **add** also scaffolds the tool in Step 5); **skip**
   deletes it — or, for infrastructure the project will plausibly add later,
   marks it **dormant** (see Step 4). (GitHub operations, the independent review
   channel, and E2E scenario coverage are the capabilities with no token — their
   keep paths are described in their Step-4 bullets, not a token fill.)
4. **Rough picture.** In one or two sentences, what is the project's goal /
   overview? (This becomes the Project Overview in `AGENTS.md`.)
5. **Which agents** will use this repo (Claude Code, Cursor, Copilot, others)?
   This decides which harness bindings to keep (see Step 6).

If the project already has a manifest/lockfile/config, you SHOULD read it to
confirm the answers instead of relying solely on the user. **Prefer adding a
missing capability over silently dropping it** — deleting a whole testing or
observability skill should be a deliberate choice the user made, not a default.

---

## Step 2 — Fill the Project Overview

In `AGENTS.md`, replace the `## Project Overview` placeholder block with a short,
durable description built from the Step 1 answers. Keep it to a few bullets;
deep layout detail belongs in a project-specific structure skill (Step 5), not
here. Remove the top-of-file "Template note" blockquote.

---

## Step 3 — Replace the placeholder tokens

Every `{{TOKEN}}` maps to a Step 1 answer. Replace ALL occurrences across
`AGENTS.md` and `.claude/**`. The table below is the
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

## Step 4 — Resolve optional capabilities (add or remove)

The skill core is intentionally broad. Every capability-specific block is wrapped
with a greppable marker so you can find them all:

```bash
grep -rn 'INIT:OPTIONAL' .claude .github AGENTS.md REVIEW.md   # every optional section, with a key
```

For **each** marked section, apply the Step 1 decision for that capability:

- **have** / **add** → keep the section and fill its token. For **add**, also
  scaffold the tool in Step 5 (install it, add the run-script, wire the command
  token) so the kept rules describe something real. Then delete the
  `<!-- INIT:OPTIONAL ... -->` comment and the italic "_delete during INIT_"
  note, leaving the content.
- **skip** → delete the whole marked section (and, for a whole skill, follow the
  removal list below). Remove the marker, the note, and every inbound link.
- **dormant** (a middle path) → keep the section, but replace its
  `<!-- INIT:OPTIONAL ... -->` marker and italic note with a **visible**
  one-line banner, so the rule self-restores instead of vanishing:

  ```markdown
  > **Dormant until <infrastructure> exists** — remove this banner when it
  > lands, making the lens unconditional.
  ```

  Replace any unfilled `{{TOKEN}}` inside a dormant section with neutral prose
  (e.g. "the project's error tracker") so the token gate stays clean. Prefer
  **dormant** over **skip** for service-shaped capabilities the project is
  likely to acquire (an error tracker, server-side caching, a data layer): the
  rules are already correct and only their infrastructure is missing. Prefer
  **skip** for capability-shaped sections that would be re-authored anyway when
  adopted (a whole test framework, the review channel) — a dormant copy of
  those only rots.

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
- **Agents do not operate GitHub through a proxied single-operator identity**
  → delete `.claude/skills/github-operations/` and its `AGENTS.md` skill-index
  row. If they do (e.g. a Claude Code session using the GitHub MCP server),
  keep the skill, delete its `<!-- INIT:OPTIONAL -->` marker and the italic
  "_delete or adapt_" note, replace the example tool-channel, marker, and
  branch-prefix names with your harness's real ones, and review its Conventions
  section's SHOULD bullets against your project's policy.
- **No independent-review channel** (no posted-review policy, CI reviewer, or
  agent delivery loop) → delete every `INIT:OPTIONAL key=INDEPENDENT_REVIEW`
  target: `REVIEW.md`, `.claude/commands/review.md`,
  `.claude/commands/address.md`, `.github/workflows/claude-review.yaml`,
  `.github/workflows/merge-checks.yaml`, the "Repository Review Policy Overlay"
  section in `code-review-guideline/SKILL.md`, the marked posted-review bullets
  in `code-review-guideline/references/severity.md` and
  `references/evidence.md`, the posted-review parenthetical in
  `references/escalation.md`, and the marked SHOULD bullet in `AGENTS.md`'s
  Review Independence Gates. If the project **does** adopt it (it requires the
  GitHub-operations capability — keep both or neither), keep all of the above,
  delete the markers and italic notes, and:
  - fill `REVIEW.md`'s do-not-report list with the checks the project's CI
    actually enforces (the `merge-checks.yaml` jobs), and review its mandatory
    checks against the project's `AGENTS.md` skill index;
  - set the review trigger phrase and reviewer identity across
    `claude-review.yaml` and the `.claude/commands/` files. The trigger phrase
    is functional and dangerous in prose: a comment-triggered workflow matches
    it **anywhere** in a comment body, so the literal phrase belongs ONLY in
    the workflow and command files — everywhere else refer to it as "the
    review trigger phrase";
  - replace the `@<maintainer>`, agent-comment-marker, and branch-prefix
    examples in `.claude/commands/address.md` with the project's real values
    per `github-operations`;
  - replace the placeholder commands and toolchain setup in `merge-checks.yaml`
    with the project's real lint/unit-test commands — `init.sh` does **not**
    substitute tokens in YAML files, which is why they are prose placeholders.
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
  - the `{{E2E_TEST_CMD}}` bullet in the `AGENTS.md` Verification section.

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
    `code-review-guideline/SKILL.md`.
- **No data/content layer** → remove the data-layer sections (each is marked
  optional) from `development-guidelines`, `application-security-requirements`,
  and `performance-and-reliability-requirements`.
- **No client bundle / not a UI project** → remove the "User-Facing Work"
  subsection from `AGENTS.md` and the bundling/asset sections (marked optional)
  in `performance-and-reliability-requirements`.
- Walk every `<!-- INIT:OPTIONAL ... -->` marker (the grep above) and resolve
  each one as **have/add/skip** per Step 1.

Whenever you remove a skill, also remove every relative link pointing to it so
no dangling links remain. Verify with `python3 tools/check-links.py`.

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
  Create this first; `AGENTS.md` already points at it.
- **Component / UI skills** — if the project has a UI (component conventions,
  styling, UI design principles, accessibility).
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

## Step 6 — Set up the agent harness binding(s)

`AGENTS.md` + `.claude/skills/**` are the agent-agnostic substance. Each agent
reads them through its own binding:

- **Claude Code** — `CLAUDE.md` (`@AGENTS.md`) plus the `.claude/` directory:
  - `.claude/skills/**` is also discovered natively by Claude Code, so each
    skill is directly invocable in addition to being routed via `AGENTS.md`.
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
  Add that binding file and, if the agent has no hook system, drop
  `.claude/hooks/` and the `settings*.json` files — but keep `.claude/skills/`,
  which `AGENTS.md` links into.

Keep only the bindings for the agents named in Step 1.

---

## Step 7 — Finalize

- Run `./init.sh check` and resolve everything it reports.
- Delete the INIT tooling once adaptation is done: `INIT.md`, `init.sh`,
  `tokens.json`, `init.values.json`, and (optionally) `tools/check-links.py` if
  you don't want to keep it as a CI check.
- Remove the "Template note" blockquote at the top of `AGENTS.md`, every
  `<!-- INIT:OPTIONAL ... -->` marker, and every "TEMPLATE NOTE" /
  "_delete during INIT_" line for sections you decided to keep.
- Update `README.md` to describe the actual project (or replace it).

### Completion checklist

- [ ] No `{{` tokens remain in authored files (build/VCS dirs excluded):
      `./init.sh check` (or `grep -rn '{{' . --exclude-dir=node_modules
      --exclude-dir=.next --exclude-dir=.git --exclude-dir=.github`). The
      `.github/` exclusion matters when the independent-review workflows are
      kept: GitHub Actions `${{ ... }}` expressions match the grep but are not
      template tokens — ignore them in `./init.sh check` output too.
- [ ] No `<!-- INIT:OPTIONAL -->` markers remain: `grep -rn 'INIT:OPTIONAL' .`
- [ ] No dangling relative skill links: `python3 tools/check-links.py` (checks
      the `.claude/` tree a `glob('**/*.md')` sweep would skip).
- [ ] `AGENTS.md` skill index matches the directories under `.claude/skills/`.
- [ ] Removed skills have no remaining inbound links.
- [ ] The conditional hedges in `AGENTS.md`'s Verification section are
      resolved: in the `{{E2E_TEST_CMD}}` and `{{BUILD_CMD}}` bullets, delete
      the "when the project has an e2e suite" / "when the project has a build
      step" clause when the capability was kept, and delete the whole bullet
      when it was skipped.
- [ ] Every skill removed in Step 4 is also gone from the review-lenses MUST
      bullet in `AGENTS.md`'s Review Independence Gates (e.g. drop
      "observability" when `observability-guidelines` was deleted).
- [ ] Added capabilities have a working command (the `check.sh` / `format.sh`
      hooks actually run).
- [ ] Harness binding for each Step-1 agent is filled in and runnable.
- [ ] A `.gitignore` excludes `settings.local.json` and `.env.local` (or the
      project's equivalent local-state/secret files).
- [ ] `INIT.md` and template scaffolding notes/tooling are deleted.
