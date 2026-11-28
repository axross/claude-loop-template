---
type: Guide
title: Agent Sessions
description: Routes from the original session guide to the owners of startup, quality hooks and delegation.
---

# Agent Sessions

These entries lead from the original session guide to setup, delegation and verification instructions.

## The Settings File

[Activate the settings locally or in the cloud environment](../contributing/agents/session-settings.md#activate-the-settings).

### Where the Copy Takes Effect

[Check which hosts read the settings](../contributing/agents/session-settings.md#where-the-copy-takes-effect)
and [diagnose a missing copy](../contributing/agents/session-settings.md#check-and-repair-a-copy).

### Caveats

[Check cached environments, worktrees, configuration drift and existing clones](../contributing/agents/session-settings.md#caveats).

## The Session-Start Hook

[Bootstrap a cloud session](../contributing/agents/session-startup.md#bootstrap-a-cloud-session).

<a id="the-opt-in-quality-hooks"></a>

## The Quality Hooks

[Enable the edit and stop hooks](../contributing/agents/session-startup.md#enable-the-quality-hooks),
[adapt formatting after edits](../contributing/agents/edit-hook.md), or
[diagnose a stop check or delivery reminder](../contributing/agents/stop-hook.md).

## Subagents

[Choose the definition for an assignment](../contributing/agents/subagents.md).

### Roles

[Find the limits of each role](../contributing/agents/subagents.md#role-boundaries).

### The Reviewer

[Check when a reviewer may post](../contributing/agents/subagents.md#assigning-the-reviewer)
or [check which tools the reviewer may use](../contributing/agents/subagents.md#role-boundaries).

### When a Definition Is Missing

[Find the fallback for the missing role](../contributing/agents/subagents.md#role-boundaries).

## Telemetry Tagging

[Verify the tags in exported metrics](../contributing/agents/session-startup.md#verify-telemetry-after-startup).
