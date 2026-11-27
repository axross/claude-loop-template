---
type: Specification
title: Job creation and history
description: What a template change does to queued work and how to retrieve output after pruning.
---

# Job creation and history

## Templates and schedules

A **Job Template** carries a name, the work to run, and an optional schedule. The name is
unique across the account and is what job history is grouped by, so renaming a
template regroups every job it has already produced.

A **Schedule** is the recurrence attached to a template. It produces one job
each time it fires, evaluated in UTC. If the previous job is still running,
the schedule creates a second job. The two can run concurrently within the
worker pool limit. A template with no schedule produces jobs only when someone runs it by hand.

A template is enabled or disabled. A disabled template's schedule does not fire and it
cannot be run by hand, but disabling does not touch jobs already created — a job
queued a moment earlier is still claimed and still runs.

Editing a template does not change jobs already created: each job carries a copy of
the work it was created with, so a template edited while a job is queued runs the old
definition once more.

## Creating a job

A run creates a job, one execution of a template. A firing schedule and a manual
run produce the same record. Only the job's `trigger` field distinguishes them.

A run returns a queued job. A saturated pool can delay its start indefinitely.
A repeated worker claim cannot start a second copy of that job. The
[dispatch boundary](./dispatch.md) explains how all producers share capacity.
See [job outcomes](./outcomes.md#states) for the states a caller can observe.

## Output and pruning

A job's record is pruned thirty days after it ends. Its job output outlives the record
and is addressed by the job's identifier, so a link to output written last quarter
still resolves once the job it came from is gone. Earlier attempts' output is
pruned with the record.

## What scheduling does not do

A job does not trigger another job. There is no dependency graph, no fan-out, and no
"run this once that succeeds" — a template needing a second step runs it inside its
own work.
