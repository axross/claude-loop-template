---
type: Procedure
title: Session startup
description: How to bootstrap a remote Claude Code session and verify its telemetry settings.
---

# Session startup

Use a fresh Claude Code session to verify bootstrap and telemetry settings.
For the change and review gates that apply once the session is running, see
[the host instructions](../../CLAUDE.md#project-gates-within-claude-code).

Claude Code reads [the shared settings](../../.claude/settings.json) at startup.
They set the default reasoning effort to `xhigh` and register the
[session-start hook](../../.claude/hooks/session-start.sh). Start a fresh
session to exercise a change to either setting.

## Bootstrap a cloud session

The hook runs its setup only when `CLAUDE_CODE_REMOTE=true`. A local session
uses the contributor's toolchain. Set the variable explicitly to exercise
cloud setup locally. The hook performs the following steps:

1. Activate the version manager if it is available. The template uses mise
   and records its activation in `CLAUDE_ENV_FILE` when available. The hook MUST NOT
   install a version manager unconditionally. A cloud image with a working
   runtime can start even if the manager's installer is unreachable.
2. Seed a missing `.env.local` from `.env.example` when the example exists.
3. Copy the local settings example, when present, over
   `.claude/settings.local.json`. This file is gitignored and Claude Code
   reloads it during the session.
4. Run the project's dependency installation command.
5. Print a pointer to [the working agreement](../../AGENTS.md). The pointer
   lets the agreement change without duplicating its instructions in the hook.

## Verify telemetry after startup

The shared settings attach the repository name to exported OpenTelemetry
resources and enable the entrypoint dimension on metrics. Contributors with
telemetry enabled can distinguish projects and launch surfaces in the same
account. The settings supply neither an exporter endpoint nor credentials.

To verify a tag change, start a new session and inspect its metrics in the
backend. Claude Code filters `OTEL_*` from its subprocess environment, so
printing the variable in a session shell cannot verify what the exporter saw.
