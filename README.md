# AGENTS.md Skill Template

A reusable, **framework-agnostic** and **AI-agent-agnostic** starting point for
giving coding agents a structured working agreement and a library of skills.

It is extracted from a production setup and stripped of stack-specific detail,
leaving a generic core you adapt to any project — web, mobile, CLI, library, or
service — and any agent — Claude Code, Cursor, Copilot, and others.

## What's inside

```
.
├── INIT.md                  # how to adapt this template (start here)
├── init.sh                  # metacharacter-safe {{TOKEN}} substitution + gates
├── tokens.json              # machine-readable manifest of every {{TOKEN}}
├── .gitignore               # ignores settings.local.json + .env.local (see INIT Step 6)
├── AGENTS.md                # master routing index + working agreement (universal)
├── CLAUDE.md                # @AGENTS.md — Claude Code's binding to AGENTS.md
├── REVIEW.md                # optional: posted-review policy for the independent-review capability
├── .github/
│   └── workflows/           # optional: example CI reviewer + merge checks (GitHub Actions + Claude Code);
│                            # plus template-checks.yaml, this repo's own link-check CI (deleted during INIT)
└── .claude/
    ├── commands/            # optional: /review + /address + /handoff entry points (Claude Code examples)
    ├── skills/              # the generic, cross-project skill core (12 skills)
    │   ├── agent-skills-best-practices/  # ships scripts/check-links.sh (relative-link integrity)
    │   ├── application-security-requirements/
    │   ├── code-review-guideline/
    │   ├── development-guidelines/
    │   ├── e2e-testing-guidelines/
    │   ├── github-operations/
    │   ├── maintainable-code-guidelines/
    │   ├── observability-guidelines/
    │   ├── performance-and-reliability-requirements/
    │   ├── product-requirement-guidelines/
    │   ├── quality-assurance-guidelines/
    │   └── unit-test-guidelines/
    ├── hooks/               # session-start (always on), format + check (opt-in)
    ├── settings.json        # wires the SessionStart hook (always on)
    └── settings.local-example.json  # opt-in: copied to settings.local.json (by session-start) to wire format + check
```

The skill core covers cross-project workflow: how to author skills, frame
product requirements, develop and review changes, test (unit + e2e), operate
GitHub, and review for maintainability, security, performance/reliability,
observability, and QA evidence. Project-specific skills
(structure, components, routing, UI, domain) are intentionally **not** shipped —
you add them during adaptation.

An optional **independent-review capability** ships alongside the core:
`REVIEW.md` (the posted-review policy), the `/review` + `/address` entry points
in `.claude/commands/`, and the example `.github/workflows/`. Keep and adapt
it, or delete it — INIT Step 4 covers both paths. A **`/handoff`** command also
ships in `.claude/commands/`: it suspends in-progress work into a downloadable
handoff package (a `handoff-<unix epoch>.md` plus an optional zip of supporting
files) that a fresh session takes over with `/address continue` — so it rides
along with the `/address` entry point rather than standing alone.

## How it works

- **`AGENTS.md`** is the agent-agnostic source of truth: a skill index plus a
  working agreement (plan → implement → self-review → verify → report).
- **`.claude/skills/**`** hold the detailed, progressively-disclosed rules each
  index entry routes to.
- **Bindings** connect a specific agent to `AGENTS.md`: `CLAUDE.md` plus
  `.claude/` for Claude Code; an equivalent rules file for other agents.

## Getting started

1. Copy this template into a new (or existing) repository.
2. Open **[INIT.md](./INIT.md)** and follow it — or hand the repo to an AI agent
   and ask it to "run INIT". INIT reconciles any files a scaffold already
   generated (e.g. an existing `AGENTS.md`), interviews you about the project
   kind, frameworks, architecture (directory structure, business-logic
   structure, state management, database layer, styling, theming), and goal,
   then fills the `{{TOKENS}}` via `./init.sh`. For
   each optional capability — unit tests, e2e, observability — it asks whether to
   **add** it (and with which tool) or skip it, rather than assuming it should be
   deleted, and it adds project-specific skills.
3. When adaptation is complete, delete `INIT.md` and this `README.md` (or rewrite
   the README for your project).

Placeholders use the `{{TOKEN}}` convention so they are easy to find and replace;
the full token list lives in [INIT.md](./INIT.md).
