# AGENTS.md Skill Template

A reusable, **framework-agnostic** and **AI-agent-agnostic** starting point for
giving coding agents a structured working agreement and a library of skills.

It is extracted from a production setup and stripped of all stack-specific
detail, leaving a generic core you adapt to any project — web, mobile, CLI,
library, or service — and any agent — Claude Code, Cursor, Copilot, and others.

## What's inside

```
.
├── INIT.md                  # how to adapt this template (start here)
├── init.sh                  # metacharacter-safe {{TOKEN}} substitution + gates
├── tokens.json              # machine-readable manifest of every {{TOKEN}}
├── tools/check-links.py     # relative-link integrity (descends the .claude/ dot-dir)
├── .gitignore               # ignores settings.local.json + .env.local (see INIT Step 6)
├── AGENTS.md                # master routing index + working agreement (universal)
├── CLAUDE.md                # @AGENTS.md — Claude Code's binding to AGENTS.md
└── .claude/
    ├── skills/              # the generic, cross-project skill core (12 skills)
    │   ├── agent-skills-best-practices/
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
    ├── hooks/               # example Claude Code harness binding (session-start, format, check)
    └── settings.json        # wires the SessionStart hook
```

The skill core covers cross-project workflow: how to author skills, frame
product requirements, develop and review changes, test (unit + e2e), operate
GitHub, and review for maintainability, security, performance/reliability,
observability, and QA evidence. Project-specific skills
(structure, components, routing, UI, domain) are intentionally **not** shipped —
you add them during adaptation.

## How it works

- **`AGENTS.md`** is the agent-agnostic source of truth: a skill index plus a
  working agreement (plan → implement → self-review → verify → report).
- **`.claude/skills/**`** hold the detailed, progressively-disclosed rules each
  index entry routes to.
- **Bindings** connect a specific agent to `AGENTS.md`: `CLAUDE.md` + `.claude/`
  for Claude Code; an equivalent rules file for other agents.

## Getting started

1. Copy this template into a new (or existing) repository.
2. Open **[INIT.md](./INIT.md)** and follow it — or hand the repo to an AI agent
   and ask it to "run INIT". INIT reconciles any files a scaffold already
   generated (e.g. an existing `AGENTS.md`), interviews you about the project
   kind, frameworks, and goal, then fills the `{{TOKENS}}` (via `./init.sh`).
   For each optional capability — unit tests, e2e, observability — it asks
   whether to **add** it (and with which tool) or skip it, rather than assuming
   it should be deleted, and adds project-specific skills.
3. Delete `INIT.md` and this `README.md` (or rewrite it for your project) when
   adaptation is complete.

Placeholders use the `{{TOKEN}}` convention so they are easy to find and replace;
the full token list lives in [INIT.md](./INIT.md).
