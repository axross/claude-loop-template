---
type: Procedure
title: Branch governance
description: How to work on a delivery branch and respond to the scheduled audit.
---

# Branch governance

Use this procedure when starting a change or responding to a branch flagged by the scheduled audit.

## Working on a branch

Claude Code invokes Loop Engineering when the user describes a code or
documentation change. The human approves the plan recorded on the tracking
issue before implementation begins. [CLAUDE.md](../../CLAUDE.md) describes
this host's gates.

Use a `claude/`-prefixed working branch. Never push to the default branch.
Only the maintainer merges. A successful delivery run ends when its reviewed
pull request is ready.

## Resolving an audit finding

The [branch governance audit](../../.github/workflows/branch-governance-audit.yaml)
runs hourly from the default branch. The audit flags a `claude/*` branch
when all three conditions hold:

- The branch has commits ahead of the default branch.
- The branch has no open pull request.
- The head commit is at least 30 minutes old.

The same conditions apply when a human pushes a `claude/*` branch.
For work intended for delivery, check the [delivery authorization](./delivery-authorization.md)
before opening the draft and [requesting review](./pull-request-review.md#request-the-post-push-review).
A failed audit grants no permission to publish or delete a branch. If the
required effect has no authorization, stop and ask the maintainer. The
maintainer can remove an abandoned branch.

The audit MUST remain a scheduled sweep with a grace period. The normal delivery sequence
pushes the branch before opening the draft, so checking on push would report
a failure while delivery was still in progress. Running on GitHub also
catches a session that exits after the push.
