# Agent Sessions

Use Claude Code from the project root. The [working agreement](../../AGENTS.md) enters through the `CLAUDE.md` import. It defines project rules, not the host's instruction hierarchy or tool capabilities.

## Session startup

[Shared settings](../../.claude/settings.json) configure default effort, telemetry labels and [SessionStart](../../.claude/hooks/session-start.sh). The script only provisions when `CLAUDE_CODE_REMOTE=true`: it uses the available toolchain, prepares an absent `.env.local` from `.env.example`, and installs dependencies. It never creates or replaces private Claude Code settings. Only set the remote flag locally in a disposable fixture; it selects the script branch, not a cloud session.

Claude Code's [cloud settings contract](https://code.claude.com/docs/en/settings#settings-in-cloud-sessions) differs by surface. An ordinary single-repository session outside Projects can read supported keys from committed `.claude/settings.json`. Multi-repository Anthropic-hosted sessions only read repository plugin settings; Projects cloud threads do not load repository hooks, permissions or `env` from that file. Cloud sessions do not read `.claude/settings.local.json`. Verify loaded sources with `/status` and observe each event on the actual launch surface before relying on a hook. A direct invocation or an edited settings file proves neither loading nor firing.

## Opt-in quality hooks

Locally, merge only the desired hook entries from [the example](../../.claude/settings.local-example.json) into the gitignored `.claude/settings.local.json`. Preserve existing hooks, permissions and preferences; copy the example only when the destination does not exist and is not a symlink. Opting in for supported cloud sessions is a separate team decision to add the selected bindings to shared settings. Do not write permissions or schedules just to make tools available; see the [development workflow](./development-workflow.md) for authorization.

Both quality hooks need `jq` and Git 2.31 or later. `CLAUDE_PROJECT_DIR` locates the script in the launch checkout; the event's `cwd` selects the active checkout. The hooks only operate in worktrees that share the launch checkout's Git common directory. Check actual bindings after switching worktrees as well as at startup.

- **PostToolUse:** [format.sh](../../.claude/hooks/format.sh) handles one file from Edit, Write or MultiEdit. It rejects outside paths, symlinks, foreign Git roots, ignored files, generated skill copies, and common build and dependency paths. Extend the protected paths for this project. Each selected command must itself accept one trailing literal `./`-relative file, respect tool-specific ignores, and never bootstrap a tool or repair other files. An appended argument cannot narrow a project-wide formatter; run that separately. Prove the setup with two defective files and verify only the selected one changes. Rejected input or failed repair does not block a turn or count as verification.
- **Stop:** [check.sh](../../.claude/hooks/check.sh) runs only non-mutating lint for matching worktree, index, untracked, or branch changes. It does not run unit tests or apply fixes. A detected lint failure returns exit 2. If the toolchain is missing, the hook reports that lint did not run; it uses `jq` to recognize a continuation so that the missing executable does not block Stop again. An unbound, skipped, or successful hook does not replace contributor verification or CI.

For committed changes, Stop compares from the merge base of the active head and the selected ref. It tries `origin/HEAD`, remote or local `main` or `master`, then the branch's upstream. Override that order with a repository-local setting, for example `git config --local claude-loop.lintBase refs/heads/trunk`. If Git cannot compare and there are no known pending code changes, Stop reports that lint did not run. It does not search inherited history or infer whether a PR was opened.

## Subagents

[The Claude Code definitions](../../.claude/agents/) cover implementation, investigation, and advisory pre-flight. Qualify the role and its allowed tools each time. The advisory reader cannot publish independent review; use the route in the [development workflow](./development-workflow.md) for that checkpoint. Keep one writer and do not pass the implementation conversation to a fresh reviewer.

## Telemetry

The shared settings label telemetry with the repository name and entry point when the host exports it. They configure no exporter, credentials, or opt-in. Verify a change in the metrics backend with a newly started session, not by assuming a subprocess receives the same variables.
