---
type: Procedure
title: Respond to the branch audit
description: Identify why the hourly GitHub audit flagged a branch and choose an authorized response.
---

# Respond to the branch audit

Use this procedure when the [branch governance audit](../../.github/workflows/branch-governance-audit.yaml)
reports a `claude/*` branch. It checks branches on GitHub even if the session
that pushed the branch has ended. The workflow reports its findings through
the job status and leaves the branch and pull requests untouched.

## Identify why the branch was flagged

The audit runs hourly from the default branch. For a branch with the
configured prefix, it requires all three conditions:

- The branch has commits ahead of the default branch.
- There is no open pull request for that branch.
- Its head commit is at least 30 minutes old.

The same conditions apply to a human-pushed branch. The audit MUST remain a
scheduled sweep with a grace period. The [delivery procedure](../contributing/change-delivery.md#start-a-change)
allows a branch to be pushed before the draft opens. Running the check on
push would flag that normal interval. GitHub Actions schedules the audit independently
of Claude Code. The session's ban on scheduling a wake applies only within
the session.

## Respond to a flagged branch

Use the audit report to choose the next action the maintainer has authorized:

1. Read the audit job's failure to identify the branch. Check whether the
   change is intended for delivery.
2. If it is, check the [delivery authorization](../governance/delivery-authorization.md).
   When authorized, open the draft against the tracking issue and
   [request post-push review](../contributing/change-delivery.md#request-post-push-review).
3. If the branch is abandoned, the maintainer can remove it. The audit
   finding gives no permission to publish or delete anything. If the action
   you need is outside your grant, stop and ask the maintainer.

On the next sweep, a branch with an open pull request no longer meets the
failure conditions. A branch the maintainer deleted is no longer inspected.
