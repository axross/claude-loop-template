---
type: Procedure
title: Quality hooks
description: How to activate format-on-edit and diagnose a stop check or a delivery reminder.
---

# Quality hooks

To enable the quality hooks locally, copy
[the settings example](../../.claude/settings.local-example.json) to
`.claude/settings.local.json`. Cloud startup installs the example
automatically. It also pre-approves `subscribe_pr_activity` and
`unsubscribe_pr_activity` on the Remote MCP server so an unattended run can
wait for CI and review. Before subscribing, check the [delivery authorization](./delivery-authorization.md)
and the operator's watching choice for this run. If the operator declines,
wait for the human to report the result. Leave scheduling disabled as required
by the [waiting procedure](../../CLAUDE.md#waiting-on-a-pull-request).

## Format after an edit

The `PostToolUse` matcher runs [format.sh](../../.claude/hooks/format.sh)
after `Edit`, `Write`, and `MultiEdit`. Shell edits bypass it. If the package
manager is unavailable the hook exits without running the formatter.

When adapting the file patterns in the edit hook, include files accepted by
either the formatter or the optional lint autofix. For an autofix match under
the project root, the hook passes the project-relative path to the linter so
its ignore rules apply. Prefix **each** autofix alternative with
`"$PROJECT_DIR"/` in the shell `case` pattern. The prefix applies to only one
alternative at a time. The formatter then runs on the whole project, including
when only the autofix pattern matched. Its own pattern has no project-root
prefix because its command takes no path.

## Diagnose a stop check

[check.sh](../../.claude/hooks/check.sh) runs the retained lint and unit-test
commands when the package manager is available and source files have pending
changes in the working tree or commits ahead of the upstream branch. A
failure blocks completion and prints the checks' output. Fix the reported
errors before stopping again. A mechanically fixable lint error can still
arrive here after a shell edit or an unsuccessful autofix.

Keep mechanical repairs in the edit hook. A repair at `Stop` can change the
working tree after the commit has been pushed, allowing a local check to pass
on different contents. Test failures and lint errors that need an author's
judgment belong in the blocking check.

The hook also emits a reminder when the working branch has commits ahead of
the default branch and every commit has reached its upstream. This catches a
run that stopped after pushing even when its tree is clean. The reminder MUST
remain non-blocking because the local hook cannot determine whether GitHub
already has an open pull request.
