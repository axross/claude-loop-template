---
type: Procedure
title: Format after an edit
description: Select the files that receive the optional lint autofix and the whole-project formatter.
---

# Format after an edit

Use the edit hook for mechanical repairs. [Enable the quality hooks](./session-startup.md#enable-the-quality-hooks)
and make the project's package manager available. Claude Code invokes
[format.sh](../../../.claude/hooks/format.sh) through the `PostToolUse`
matcher after `Edit`, `Write`, and `MultiEdit`. Keep the matcher limited
to those three tools. Shell edits bypass this repair and may leave lint
errors for the [stop check](./stop-hook.md). If the package manager is
unavailable, the hook exits without running either command.

## Select files for formatting and autofix

The hook reads the edited file's path from the tool payload. Configure the
two file sets according to the commands you keep in the template:

1. Set `CODE_FILE_GLOB` to the formatter's file set. Its shell pattern
   has no project-root prefix because the formatter takes no file argument.
2. If you keep the per-file lint autofix, set `LINT_FIX_FILE_GLOB` to its
   file set. Leave the first pattern bare because `format.sh` supplies its
   project-root prefix. Prefix each later pattern yourself, as in
   `*.md | "$PROJECT_DIR"/*.mdx`.
3. Check that the hook admits the union of those two sets. For an autofix
   match under the project root, it first passes the project-relative path
   to the linter so that the linter's ignore rules apply. The formatter then
   runs on the whole project, including when only the autofix pattern matched.

To verify the configuration, edit a matching file through a covered tool
and inspect the resulting changes. If the two commands cover different
extensions, also try a file matched only by the autofix. Both the autofix
and the formatter should run in that case. If an edit leaves a lint
violation, use the stop check's reported output to resolve it.
