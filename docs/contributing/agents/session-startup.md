---
type: Procedure
title: Session startup
description: How to bootstrap a cloud session, enable project hooks and verify telemetry settings.
---

# Session startup

Use a fresh Claude Code session to verify bootstrap and telemetry settings.
For the change and review gates that apply once the session is running, see
[the host instructions](../../../CLAUDE.md#project-gates-within-claude-code).

Before launching, [activate the settings for the checkout](./session-settings.md#activate-the-settings)
and confirm that the host [reads the copy](./session-settings.md#where-the-copy-takes-effect).
The example sets the default effort to `xhigh` and registers the
[session-start hook](../../../.claude/hooks/session-start.sh). The hook cannot
install the settings file that is needed to invoke it. Refresh the copy and
start a new session to exercise a change to either setting.

## Bootstrap a cloud session

The hook runs its setup only when `CLAUDE_CODE_REMOTE=true`. A local session
uses the contributor's toolchain. Set the variable explicitly to exercise
cloud setup locally. The hook performs the following steps:

1. Activate the version manager if it is available. The template uses mise
   and records its activation in `CLAUDE_ENV_FILE` when available. The hook MUST NOT
   install a version manager unconditionally. A cloud image with a working
   runtime can start even if the manager's installer is unreachable.
2. Seed a missing `.env.local` from `.env.example` when the example exists.
3. Run the project's dependency installation command.
4. Print a pointer to [the working agreement](../../../AGENTS.md). The pointer
   lets the agreement change without duplicating its instructions in the hook.

## Enable the quality hooks

[Activate the project settings](./session-settings.md#activate-the-settings)
in a [supported session](./session-settings.md#where-the-copy-takes-effect).
The same copy enables [formatting after an edit](./edit-hook.md) and the
[main agent's stop check](./stop-hook.md), including in unattended cloud
sessions. Remove the `PostToolUse` and `Stop` entries from the example if
your project does not use these hooks. Reconcile the checkout copy before
starting the next session.

The example also pre-approves the Remote MCP server's `subscribe_pr_activity`
and `unsubscribe_pr_activity` tools so an unattended run can wait for CI and
review without a permission prompt. A session that cannot read the copy
lacks these pre-approvals. The example grants no scheduling
permission. Before subscribing, check the run's
[delivery authorization](../../governance/delivery-authorization.md) and
the operator's [watching choice](../../../CLAUDE.md#confirming-delivery-at-the-plan-gate).
The [host's waiting rules](../../../CLAUDE.md#waiting-on-a-pull-request)
cover subscription release and scheduled check-ins.

## Verify telemetry after startup

When the host reads the settings copy, its environment block attaches the repository name to exported OpenTelemetry
resources and enables the entrypoint dimension on metrics. Contributors with
telemetry enabled can distinguish projects and launch surfaces in the same
account. The block does not enable telemetry or supply an exporter endpoint
or credentials.

To verify a tag change, start a new session and inspect its metrics in the
backend. Claude Code filters `OTEL_*` from its subprocess environment, so
printing the variable in a session shell cannot verify what the exporter saw.
