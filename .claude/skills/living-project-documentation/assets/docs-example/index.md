---
okf_version: "0.3"
title: Scheduler engineering
description: Job execution, notification delivery and operating procedures for Scheduler.
---

# Documentation

- [Scheduling](./scheduling/index.md) — follow a job from its template to its final attempt, or find how workers claim it.
- [Notifications](./notifications.md) — decide which outcomes send a message and where it goes.
- [Operating a release](./operating/deployment.md) — deploy, verify worker health or decide whether rollback is safe.
- [Contributing code](./contributing/directory-structure.md) — place a module and check which packages can import it.
- [Contributing documentation](./contributing/documentation.md#choose-a-subject) — choose the owner for a new or changed claim.
- [Glossary](./glossary.md) — find a job by its dashboard or operator terminology.

## Specifications

For a job's observable behavior, choose a [scheduling question](./scheduling/index.md).
For message delivery, see [notification rules](./notifications.md#rules).

## Conventions

See [module placement](./contributing/directory-structure.md#tiers) or
[where a documentation change belongs](./contributing/documentation.md#choose-a-subject).

## Operations

Use the [release procedure](./operating/deployment.md#releasing) or go directly
to the [rollback decision](./operating/deployment.md#rolling-back).
