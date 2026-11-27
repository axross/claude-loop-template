---
type: Architecture
title: Subagents
description: Which Claude Code definitions handle investigation, implementation and review, and how missing definitions affect delegation.
---

# Subagents

Loop Engineering defines which work to delegate. Claude Code loads this
project's definitions from [.claude/agents/](../../../.claude/agents/).
Keep the definitions portable across adopting repositories by referring to
the marker in `AGENTS.md`. The skills installer and lockfile cover skills
only, so an installer refresh does not update these definitions.

## Role boundaries

Match the assignment to its definition and fallback:

| Assignment | Definition | If unavailable |
| --- | --- | --- |
| Read a large payload and return a finding with its location. The investigator returns unresolved judgments to the caller. | [investigator.md](../../../.claude/agents/investigator.md) | The caller reads the material itself. |
| Implement a bounded change and commit locally. The caller handles publication. | [implementer.md](../../../.claude/agents/implementer.md) | Use a generic agent or implement in the main session. |
| Review the plan or the local change, or perform the fallback post-push review. | [reviewer.md](../../../.claude/agents/reviewer.md) | Report the affected review gate unmet. The author cannot provide independent review. |

Each definition selects its model explicitly to avoid inheriting the main
session's model and cost. The investigator and implementer use high effort.
The reviewer uses xhigh. The investigator and reviewer deny editing tools and
spawning. The reviewer definition MUST NOT widen that deny-list. The reviewer
needs access to the issue and plan artifacts to check the requested change
and to the sources behind factual claims.
The implementer's local-only delivery boundary is an instruction in its
definition.

## Assigning the reviewer

For plan and pre-push reviews, collect the reviewer's report in the main
session. Before assigning a fallback post-push review, the main agent checks
the run's [authorization to publish](../../governance/delivery-authorization.md). The main
agent explicitly requests a posted review and supplies:

- The pull request
- The review round
- The head commit to review
- The author's checkout path

The reviewer posts only for that explicit post-push assignment. If the
working directory is the author's checkout, the reviewer stops without
posting. An unresolved maintainer decision also goes back to the main agent
without a post. Otherwise the reviewer works in its own checkout and submits
exactly one COMMENT-type review on the named pull request.

The [reviewer definition](../../../.claude/agents/reviewer.md) specifies what
the reviewer returns to the main session.
