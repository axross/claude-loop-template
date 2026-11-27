---
type: Architecture
title: Subagents
description: Which Claude Code definitions handle investigation, implementation and review, and how missing definitions affect delegation.
---

# Subagents

Loop Engineering defines which work to delegate. Claude Code loads this
project's definitions from [.claude/agents/](../../.claude/agents/).
Keep the definitions portable across adopting repositories by referring to
the marker in `AGENTS.md`. The skills installer and lockfile cover skills
only, so an installer refresh does not update these definitions.

| Assignment | Definition | If unavailable |
| --- | --- | --- |
| Read a large payload and return a finding with its location. The investigator returns unresolved judgments to the caller. | [investigator.md](../../.claude/agents/investigator.md) | The caller reads the material itself. |
| Implement a bounded change and commit locally. The caller handles publication. | [implementer.md](../../.claude/agents/implementer.md) | Use a generic agent or implement in the main session. |
| Review the plan or the local change, or perform the fallback post-push review. | [reviewer.md](../../.claude/agents/reviewer.md) | Report the affected review gate unmet. The author cannot provide independent review. |

## Role boundaries

Each definition selects its model explicitly to avoid inheriting the main
session's model and cost. The investigator and implementer use high effort.
The reviewer uses xhigh. The investigator and reviewer deny editing tools and
spawning. Preserve the reviewer's access to the issue, plan artifacts and
sources for factual claims so it can check the requested change against them.
The implementer's local-only delivery boundary is an instruction in its
definition.

## Assigning the reviewer

For plan and pre-push reviews, collect the reviewer's report in the main
session. Only a fallback post-push assignment names a pull request, round,
head commit and author's checkout path and requests a posted review. It
requires [authorization to publish](./delivery-authorization.md), a separate checkout and exactly one submitted COMMENT-type review.
The reviewer's posting and hand-back requirements are in its definition.
