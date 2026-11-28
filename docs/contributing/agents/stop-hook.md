---
type: Procedure
title: Diagnose a stop check
description: Decide whether a stop message requires fixing a failed check or checking the delivery state.
---

# Diagnose a stop check

With the [quality hooks enabled](./session-startup.md#enable-the-quality-hooks),
Claude Code runs [check.sh](../../../.claude/hooks/check.sh) before the
main agent finishes, including in an unattended cloud session. A subagent’s
stop does not invoke this hook. The hook exits immediately if the project's
package manager is unavailable.

## Blocking failure

The hook runs the retained lint and unit-test commands when at least one of
these conditions holds:

- The working tree or index contains changes matching the project's source-file pattern.
- The diff for commits ahead of the upstream branch includes a path matching that pattern.

A failure blocks completion and prints the checks' output. Fix the reported
errors before stopping again. A shell edit or an unsuccessful autofix can
leave a mechanically fixable lint error for this check.

Keep mechanical repairs in the [edit hook](./edit-hook.md). A repair at
`Stop` can change the working tree after the commit has been pushed,
allowing a local check to pass on different contents. Test failures and
lint errors that need an author's judgment belong in the blocking check.

## Delivery reminder

A session can also receive a reminder when the working branch has commits
ahead of the default branch and every commit has reached its upstream. It
can appear on a clean tree, including when the lint and unit checks had
nothing to run. The reminder MUST remain non-blocking because the local
hook cannot determine whether GitHub already has an open pull request.

Check whether the change has an open pull request with its required review.
For the next authorized action, consult the
[delivery procedure](../change-delivery.md#request-post-push-review) and the
[delivery authorization](../../governance/delivery-authorization.md).
