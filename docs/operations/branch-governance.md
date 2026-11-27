---
type: Procedure
title: Branch governance
description: How to work on a delivery branch and respond to the scheduled audit.
---

# Branch governance

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
runs hourly from the default branch. It fails for a `claude/*` branch with
commits ahead of the default branch, no open pull request, and a head commit
at least 30 minutes old. It checks human pushes to those branches as well.
For work intended for delivery, check the [delivery authorization](./delivery-authorization.md)
before opening the draft and [requesting review](./pull-request-review.md#request-the-post-push-review).
A failed audit grants no permission to publish or delete a branch. If the
required effect has no authorization, stop and ask the maintainer. The
maintainer can remove an abandoned branch.

Keep the scheduled sweep and its grace period. The normal delivery sequence
pushes the branch before opening the draft, so checking on push would report
a failure while delivery was still in progress. Running on GitHub also
catches a session that exits after the push.
