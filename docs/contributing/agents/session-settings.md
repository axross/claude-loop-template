---
type: Procedure
title: Activate Claude Code settings
description: Create and verify the per-checkout settings copy for local and cloud sessions, including worktrees and cached environments.
---

# Activate Claude Code settings

The committed [settings example](../../../.claude/settings.example.json) wires
the startup, edit and stop hooks, sets the default effort, tags telemetry and
pre-approves the two pull request subscription tools. Claude Code reads
these settings from the gitignored `.claude/settings.json` in each checkout.
Without that copy a session uses its defaults and receives none of the
template's hooks, effort setting, telemetry tags or subscription grants.

## Activate the settings

For a local session, run the following command in the repository root before
starting Claude Code. It preserves an existing copy:

```bash
[ -e .claude/settings.json ] || cp .claude/settings.example.json .claude/settings.json
```

For cloud sessions, the maintainer adds the following loop to the setup
script of each environment that runs the repository. The environment tool
describes setup as running after cloning, from the directory containing the
checkouts. The loop also works when setup starts inside a checkout:

```bash
for ex in .claude/settings.example.json */.claude/settings.example.json; do
  [ -f "$ex" ] || continue
  target="${ex%settings.example.json}settings.json"
  [ -e "$target" ] || cp "$ex" "$target" || echo "could not create $target" >&2
done
```

The loop activates all examples it finds, skips repositories without one and
reports copy errors without failing startup. In an environment shared with
repositories outside your control, list the intended repository directories
explicitly in place of the wildcard. A template change cannot configure
another project's cloud environment.

## Where the copy takes effect

A local session can load the repository settings. In an Anthropic-hosted
cloud environment, the template's settings apply to a single-repository
session outside a project's threads. A multi-repository cloud session reads
only plugin keys, which the example does not set. A project thread does not
apply the repository's hooks, permissions or environment variables.

[Claude Code's documentation](https://code.claude.com/docs/en/settings#settings-in-cloud-sessions)
lists `.claude/settings.local.json` as not read in a cloud session because the
file is not in the clone, so a cloud session starts without one. One consumer
reported a single-repository cloud session running a `Stop` hook defined only
in a `.claude/settings.local.json` that the consumer's own `SessionStart` hook
had created there; this was not reproduced here. The documentation describes
loading a settings file created mid-session only for Claude Code on a local
machine, so do not rely on that behavior in cloud. The setup-script copy
targets `.claude/settings.json`; [Caveats](#caveats) says what is unverified
about it.

## Check and repair a copy

In a local session, open `/status` and read its setting sources. In cloud,
run `ls .claude/settings.json` in the checkout. If it is missing, fix the
environment's setup script and start a new session. For a local checkout,
run the [activation command](#activate-the-settings). If you changed the
example, compare it with the installed copy before testing a new session.

## Caveats

Check the condition that applies to your checkout:

- **Cached cloud environment.** A cached snapshot can [skip the setup script](https://code.claude.com/docs/en/cloud-environments#environment-caching).
  Whether its untracked copy survives a fresh clone and whether the host
  reads the setup-created copy are unverified. Try two consecutive sessions.
  In each, check for the file and verify a configured effect, such as the
  [startup hook](./session-startup.md#bootstrap-a-cloud-session).
- **Worktrees.** A new `claude --worktree` session lacks the ignored copy
  unless `.worktreeinclude` lists `.claude/settings.json`. A subagent working
  in a worktree still runs its session's hooks.
- **Drift.** Existing copies do not update automatically. Run
  `cmp .claude/settings.example.json .claude/settings.json` to detect
  differences and reconcile local edits before copying again.
- **Existing clones.** Before pulling the change that stops tracking
  `.claude/settings.json`, save the old file outside its tracked path.
  Pulling removes an unmodified tracked version and stops on a conflicting
  local edit. Preserve the edit, complete the pull, then create the new
  copy and reconcile the saved values.
- **User settings.** The user's separate `~/.claude/settings.json` is
  unaffected by the repository copy.
