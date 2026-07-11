# Claude Loop Engineering Template

A reusable, **framework-agnostic** starting point for giving **Claude Code** a
structured working agreement and a library of skills.

It is extracted from a production setup and stripped of stack-specific detail,
leaving a generic core you adapt to any project — web, mobile, CLI, library, or
service. The system is built for Claude Code: the skill core, the `/address`
and `/handoff` commands, and the example GitHub Actions all target
it, with the working agreement kept in `AGENTS.md` and loaded through
`CLAUDE.md`.

## What's inside

```
.
├── INIT.md                  # how to adapt this template (start here)
├── init.sh                  # metacharacter-safe {{TOKEN}} substitution + gates
├── tokens.json              # machine-readable manifest of every {{TOKEN}}
├── README.template.md       # seed for the initialized project's README (finalized in INIT Step 7)
├── .gitignore               # ignores settings.local.json + .env.local (see INIT Step 6)
├── AGENTS.md                # master routing index + working agreement
├── CLAUDE.md                # @AGENTS.md — Claude Code's binding to AGENTS.md
├── REVIEW.md                # fixed: posted-review policy for the independent-review channel (configured, never removed)
├── .github/
│   └── workflows/           # fixed: CI reviewer + merge checks (GitHub Actions + Claude Code);
│                            # plus template-checks.yaml, this repo's own link-check CI (deleted during INIT)
└── .claude/
    ├── commands/            # fixed: /address + /handoff entry points (Claude Code)
    ├── skills/              # the generic, cross-project skill core (12 skills)
    │   ├── agent-skills-best-practices/  # ships scripts/check-links.sh (relative-link integrity)
    │   ├── application-security-requirements/
    │   ├── code-review-guideline/
    │   ├── development-guidelines/
    │   ├── e2e-testing-guidelines/
    │   ├── github-operation-guidelines/
    │   ├── maintainable-code-guidelines/
    │   ├── observability-guidelines/
    │   ├── performance-and-reliability-requirements/
    │   ├── product-requirement-guidelines/
    │   ├── quality-assurance-guidelines/
    │   └── unit-test-guidelines/
    ├── hooks/               # session-start (always on), format + check (opt-in)
    ├── settings.json        # wires the SessionStart hook + default effort level (always on)
    └── settings.local-example.json  # opt-in: copied to settings.local.json (by session-start) to wire format + check
```

The skill core covers cross-project workflow: how to author skills, frame
product requirements, develop and review changes, test (unit + e2e), operate
GitHub, and review for maintainability, security, performance/reliability,
observability, and QA evidence. Project-specific skills
(structure, components, routing, UI, domain) are intentionally **not** shipped —
you add them during adaptation.

A fixed **independent-review channel** ships alongside the core: `REVIEW.md`
(the posted-review policy), the `/address` entry point in `.claude/commands/`,
and the `.github/workflows/`. INIT configures and adapts it — it is never
removed (a project that wants no automated loop leaves it dormant); INIT Step 4
covers the configuration. Its CI reviewer needs a one-time secret setup before
it runs — see [Getting started](#getting-started).
A **`/handoff`** command also
ships in `.claude/commands/`: it suspends in-progress work into a downloadable
handoff package (a `handoff-<unix epoch>.md` plus an optional zip of supporting
files) that a fresh session takes over with `/address continue` — so it rides
along with the `/address` entry point rather than standing alone.

## How it works

- **`AGENTS.md`** is the source of truth: a skill index plus a working
  agreement (plan → implement → self-review → verify → report).
- **`.claude/skills/**`** hold the detailed, progressively-disclosed rules each
  index entry routes to.
- **`CLAUDE.md`** plus **`.claude/`** bind Claude Code to `AGENTS.md`, loading
  the working agreement and skills into every session.

## Getting started

This repository is a GitHub **template repository**, so you start from a copy of
it rather than cloning it.

1. Get the template into your repository:
   - **New repository** — on GitHub, click **Use this template → Create a new
     repository**. Your repository starts as a copy of this one, so the files
     below — including this `README.md` — are already in place; there is nothing
     to copy by hand. Skip to step 2.
   - **Existing repository** — copy the template's files into it: the
     adaptation tooling (`INIT.md`, `init.sh`, `tokens.json`), the README seed
     (`README.template.md`), the working agreement, skills, and ignore rules
     (`AGENTS.md`, `CLAUDE.md`, `.claude/`, `.gitignore`), and the optional
     `.github/` and `REVIEW.md`.
2. Open **[INIT.md](./INIT.md)** and follow it — or hand the repo to Claude Code
   and ask it to "run INIT". INIT reconciles any files a scaffold already
   generated (e.g. an existing `AGENTS.md`), interviews you about the project
   kind, frameworks, architecture (directory structure, business-logic
   structure, state management, database layer, styling, theming), and goal,
   then fills the `{{TOKENS}}` via `./init.sh`. The 12 bundled skills and the
   `/address` + `/handoff` commands are **fixed** — INIT never asks whether to
   keep them and never deletes one; for each capability (unit tests, e2e,
   observability, …) it asks only whether the project **has** it (and with which
   tool) so it can configure the matching skill or, when the tool is absent, mark
   that skill's sections **dormant**. INIT also adds project-specific skills.
3. When adaptation is complete, INIT finalizes `README.template.md` into your
   project's `README.md` — a README covering the project summary, tech stack,
   getting started, the development workflow (`/address`), testing strategy and
   commands, and related links — replacing this template README, and deletes
   `INIT.md`.
4. **Enable the CI reviewer.** The fixed independent-review channel's GitHub
   Actions reviewer
   ([`claude-review.yaml`](./.github/workflows/claude-review.yaml)) needs a
   one-time operator setup before it runs: install the
   [Claude GitHub App](https://github.com/apps/claude) and add a
   `CLAUDE_CODE_OAUTH_TOKEN` repository secret — generate it locally with
   `claude setup-token` — under **Settings → Secrets and variables → Actions**,
   or set an `ANTHROPIC_API_KEY` secret instead for pay-as-you-go API billing.
   Until both are in place the workflow no-ops. The workflow file's header
   comment documents the exact steps.

Placeholders use the `{{TOKEN}}` convention so they are easy to find and replace;
the full token list lives in [INIT.md](./INIT.md).
