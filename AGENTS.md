# AGENTS.md

> **Template note.** This file is a reusable, framework-agnostic starting
> point — the host-neutral working agreement and routing skeleton that
> `CLAUDE.md` loads for a Claude Code project. Before using it in a real
> project, run the adaptation pass described in [INIT.md](./INIT.md): fill in
> the `{{...}}` tokens, complete the Project Overview, install the
> stack-specific skills the project needs, and grow `docs/` with the routing
> rows that point at it. Delete this note when the template has been adapted.

## Project Overview

- **{{PROJECT_NAME}}** is a {{PROJECT_KIND}}. {{PROJECT_OVERVIEW}}
- Primary language: {{PRIMARY_LANGUAGE}}. App framework: {{APP_FRAMEWORK}}.
- Tooling: {{PACKAGE_MANAGER}} for packages, {{LINTER}} for linting,
  {{FORMATTER}} for formatting.
- [README.md](./README.md) is the authoritative record of this project's
  run-script commands. It is not a skill, so skill discovery never surfaces it
  on its own.
- The project's contributor guides, governance rules and operating procedures live under [docs/](./docs/index.md) — see
  [Routing a Change](#routing-a-change). Skill discovery never surfaces those
  either.
- **Every skill under `.claude/skills/` is installed, not written here.** They
  come from a shared skills library and are copied in with the skills CLI;
  [`skills-lock.json`](./skills-lock.json) records what is installed. A
  hand-edit to one is discarded by the next install; see
  [docs/contributing/agents/install-skills.md](./docs/contributing/agents/install-skills.md) for the
  library, how the skills are refreshed, and how a wrong or missing rule is
  routed.
- This project's fixed agent-comment marker is `<!-- ai-agent -->`. The marker
  `<!-- agent -->` is retired: it is still recognized in history and never
  written.
  <!-- INIT: keep the marker and the retired-marker note, or replace both with the project's own marker and its retired predecessors. -->
  [GitHub Operation](./.claude/skills/github-operation/references/identity-and-targets.md#attribute-comments-without-inventing-a-bot)
  owns how an agent comment is marked and recognized.
- Never push to the default branch. Work on a `claude/`-prefixed branch and
  leave merging to the maintainer, `@<maintainer>`.
  <!-- INIT: replace `@<maintainer>` with the connected operator's real handle. -->
- Repository artifacts — code, code comments, commit messages, issues, pull requests, reviews, and documentation — are written in English; the conversation with the human follows the language of the human's latest message.
  <!-- INIT: change the language here if the project writes its repository artifacts in another one. -->

## Routing a Change

[docs/index.md](./docs/index.md) says which document holds what; this table
names the specific document for a kind of change this project already
distinguishes, so a session does not have to open the index for one of these.

<!-- INIT: add a direct route when the project gains a new change surface. -->

| Kind of change | Document |
| -------------- | -------- |
| A project run-script command | [README.md](./README.md) |
| Placing or moving a documented decision | [Documentation conventions](./docs/contributing/documentation.md) |
| Validating the checkout or an exported bundle | [Documentation checks](./docs/contributing/verify-documentation.md) |
| Cloud session startup or telemetry | [docs/contributing/agents/session-startup.md](./docs/contributing/agents/session-startup.md) |
| Formatting or autofix after an edit | [Edit hook](./docs/contributing/agents/edit-hook.md) |
| Blocking stop checks or a delivery reminder | [Stop hook](./docs/contributing/agents/stop-hook.md) |
| Subagent responsibilities | [docs/contributing/agents/subagents.md](./docs/contributing/agents/subagents.md) |
| Installing, restoring or renaming a skill | [docs/contributing/agents/install-skills.md](./docs/contributing/agents/install-skills.md) |
| An accepted skill departure or gap | [docs/governance/skill-departures.md](./docs/governance/skill-departures.md) |
| Working branches and review gates | [Deliver a change](./docs/contributing/change-delivery.md) |
| A branch flagged by GitHub | [Branch audit](./docs/operations/branch-audit.md) |
| CI reviewer setup or a missing response | [Review automation](./docs/operations/review-automation.md) |
| Permission to publish or monitor a change | [docs/governance/delivery-authorization.md](./docs/governance/delivery-authorization.md) |

## Response Approach

Load capabilities by task instead of applying every change gate to read-only
work:

- MUST load [Professional Behavior](./.claude/skills/professional-behavior/SKILL.md) first in every session, including read-only questions and investigations.
- MUST load [Software Development](./.claude/skills/software-development/SKILL.md) when a task touches the project.
- MUST load [Code Maintainability](./.claude/skills/code-maintainability/SKILL.md) before a comment or a doc-comment is written or kept, rather than relying on the skill's own trigger words to fire for a session that is only writing a comment.
- For code or document changes, MUST load [Loop Engineering](./.claude/skills/loop-engineering/SKILL.md) before planning or making changes and follow its change gates. Read-only work stays outside the change loop.
- MUST load each matching skill's body, not act from its discovery description alone.
- MUST read [README.md](./README.md) before running project commands. Software Development owns the procedure when a command is undocumented.
- MUST read [docs/index.md](./docs/index.md) when a task depends on project terminology, behavior, conventions, or past decisions, then follow only the relevant routes.

This agreement is the maintainer's standing request that agents delegate investigation, implementation, and the plan, pre-push, and post-push reviews to the subagents in `.claude/agents/` wherever the host permits; a host that requires the request explicitly obtains it as that host's entry file states.

## Host and delivery routing

Choose guidance from the actual session and the changed surface:

- **Claude Code:** [CLAUDE.md](./CLAUDE.md) is the entry file for how this host
  meets the project's gates, and
  [Session startup](./docs/contributing/agents/session-startup.md) covers bootstrap and telemetry.
- **GitHub:** load [GitHub Operation](./.claude/skills/github-operation/SKILL.md)
  for every read and write. Follow
  [Deliver a change](./docs/contributing/change-delivery.md) for the branch and
  review procedure. Check [delivery authorization](./docs/governance/delivery-authorization.md) before publishing.

<!-- INIT:OPTIONAL key=POST_PUSH_OVERRIDE — Keep the bullet below while the project's CI reviewer (.github/workflows/claude-review.yaml) stays enabled, then delete this comment. To disable that reviewer's triggers, delete this comment and the bullet: the fallback reviewer subagent then becomes the post-push review route. -->
- **Post-push review override, Claude Code sessions:** use the review trigger
  phrase `@claude review`, posted as one top-level comment on the pull request,
  for the post-push review. The workflow matches the phrase anywhere in a body,
  so write it nowhere else.

## Code Review Rules

MUST read and apply [REVIEW.md](./REVIEW.md) as this repository's review policy,
and load [Code Review](./.claude/skills/code-review/SKILL.md) for the review
methodology. [Loop Engineering](./.claude/skills/loop-engineering/SKILL.md)
defines plan review, pre-push review, and post-push review.
In *Deliver a change*, see [when pre-push review cannot run](./docs/contributing/change-delivery.md#when-pre-push-review-cannot-run)
and [how to request post-push review](./docs/contributing/change-delivery.md#request-post-push-review).

Changes to the review or CI infrastructure, secret handling, the dependency or
supply-chain surface, public route or API contracts, the data layer, and large
refactors SHOULD also receive a human reviewer, in addition to the post-push
review, not a lighter path.

## Skill maintenance

[Agent Skill Management](./.claude/skills/agent-skill-management/SKILL.md) owns
the rule against hand-editing an installed skill and the routing of a rule that
is wrong, outdated, or missing; [skill departures](./docs/governance/skill-departures.md)
holds this repository's register of departures. At completion, MUST report
whether skill maintenance was performed, skipped, or blocked; this three-way
report is this project's own convention.
