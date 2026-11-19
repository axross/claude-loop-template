# AGENTS.md

## Project overview

**{{PROJECT_NAME}}** — {{PROJECT_OVERVIEW}}

Start at the [README](./README.md) for development entry points. Use the [documentation index](./docs/index.md) to find the project conventions and procedures that apply. Read the documented commands before running project operations; ask when a required command is missing rather than inferring it from a manifest.

## Response Approach

- Load `professional-behavior` first. Load the full bodies of matching skills from the Claude Code catalog; discovery descriptions are for selection, not execution.
- Apply `software-development` whenever work touches the project. Apply `loop-engineering` before planning or making a change. Standalone read-only work does not enter change gates.
- For a change, identify the phase, tracking issue, current plan revision, and approval before proceeding. Use the [development workflow](./docs/operations/development-workflow.md) for recovery, delivery, and readiness. Stop before implementation until the human has approved the current plan.

## Host and delivery routing

This repository supports Claude Code. [Session operation](./docs/operations/agent-sessions.md) describes the supported settings and hooks. Follow the host's actual instruction hierarchy, tools, and restrictions. Qualify each delegation or review route separately; if ineligible, do permitted local work directly without substituting for a required independent review.

Follow the [delivery rules](./docs/operations/development-workflow.md#authorization-and-ownership) for authorization, branching, and merging.

## Ownership of agent-created work

The session that creates an issue or PR owns [assignee verification](./docs/operations/development-workflow.md#authorization-and-ownership). Mark agent-authored GitHub comments with `<!-- agent -->` on their first line. Keep one implementation writer and preserve the work of other owners. Record temporary resources and verify their release or hand them back by locator.

## Code Review Rules

Apply [REVIEW.md](./REVIEW.md) when reviewing a change. See [Independent review](./docs/operations/development-workflow.md#independent-review) for route selection and the evidence required before ready.

## Skill maintenance

Treat CLI-installed skills as generated copies. See [Agent skills](./docs/operations/agent-skills.md) for refreshing them, checking which copies loaded, and routing gaps instead of editing a copy. Report whether skill maintenance ran or was blocked.
