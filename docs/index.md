---
okf_version: "0.3"
title: Claude Loop Template engineering
description: How to contribute to a template project, authorize delivery and operate the automation behind a change.
---

# Documentation

To adopt the template in a new project, start with the [adaptation guide](../INIT.md).
For commands available in this checkout, see the [repository README](../README.md).

<a id="conventions"></a>
<a id="operations"></a>

## Working on the project

Choose the question you need to answer:

- [Contributing](./contributing/index.md) — Set up a Claude Code session, maintain skills and documentation, or take a change through review.
- [Governance](./governance/index.md) — Find who may authorize a delivery action and which exceptions to installed rules the project has adopted.
- [Operations](./operations/index.md) — Investigate a branch flagged by GitHub or a requested CI review that never appeared.

For a change to the documentation itself, see [where the answer belongs](./contributing/documentation.md#choose-a-subject)
and [how to verify it](./contributing/verify-documentation.md). Requirement keywords in the engineering
guides follow [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119.html).

## Decisions

These published records explain two choices made when adopting the shared skill library.
Each links to the original decision and the procedure that governs the work today.

- [Why are installed skills committed?](./decisions/2026-08-11-install-skills-from-a-shared-library-rather-than-authoring-them.md)
- [Why follow an upstream skill rename?](./decisions/2026-08-20-follow-upstream-skill-renames-rather-than-pinning-or-forking.md)
