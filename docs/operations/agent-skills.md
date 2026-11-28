---
type: Guide
title: Agent skills
description: Published routes to skill installation, version management and decisions about installed rules.
---

# Agent Skills

Use the [skill maintenance procedure](../contributing/agents/install-skills.md) to change the installed set.
For a local decision about an installed rule, use the [departures register](../governance/skill-departures.md).

## Install and Refresh

[Refresh the selected skills and check that Claude Code loaded them](../contributing/agents/install-skills.md#install-and-refresh).

### Versions

[Restore the revisions in the lockfile](../contributing/agents/install-skills.md#versions).

### When Upstream Renames a Skill

[Replace the old name in the installation and its callers](../contributing/agents/install-skills.md#when-upstream-renames-a-skill).

## Deviations and Gaps

See the [skill departures register](../governance/skill-departures.md).

## The Register

See [which departures qualify and what each entry records](../governance/skill-departures.md#the-register).
The following bookmarks lead to individual entries:

- <a id="deviation--combined-plan-gate-confirmation"></a>[Combined plan-gate confirmation](../governance/skill-departures.md#deviation--combined-plan-gate-confirmation)
- <a id="deviation--the-explicit-request-is-asked-again-not-carried-forward"></a>[Renewing the explicit request](../governance/skill-departures.md#deviation--the-explicit-request-is-asked-again-not-carried-forward)
- <a id="deviation--watching-conditioned-on-the-humans-confirmation"></a>[Watching a pull request](../governance/skill-departures.md#deviation--watching-conditioned-on-the-humans-confirmation)
- <a id="deviation--reviewer-instances-that-cannot-be-closed-or-checked"></a>[Reviewer identity and closure](../governance/skill-departures.md#deviation--reviewer-instances-that-cannot-be-closed-or-checked)
- <a id="gap--application-security-is-silent-on-authentication-lockout-and-session-cookie-ownership"></a>[Authentication lockout and session-cookie ownership](../governance/skill-departures.md#gap--application-security-is-silent-on-authentication-lockout-and-session-cookie-ownership)
