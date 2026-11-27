---
type: Procedure
title: Deployment
description: How the release operator migrates the schema, deploys, verifies and rolls back Scheduler.
---

# Deployment

The release operator uses a checkout of the release revision with production
deployment access. Only the release operator may deploy or roll back, even when
someone else has credentials that can run the command. Before release, record
the previous revision for rollback.

## Releasing

```bash
npm run build
npm run migrate:up -- --env production
npm run deploy
```

Migrations MUST run before the deploy, never after. The new code assumes the new
schema and the old code tolerates it, because every migration here is written to be
safe against the version already running. Deploying first inverts that and opens a
window where live code queries columns that do not exist yet.

The worker package deploys from the same command and the same commit. It MUST NOT be
deployed on its own to pick up a fix: the two packages share `shared/`, and a split
deploy runs two versions of it against one queue.

## Verifying a release

The deploy is not finished when the command returns. Watch the worker's claim rate for
five minutes and confirm queued jobs are being claimed. A release that broke the
queue consumer can deploy cleanly and stop claiming while requests still succeed.

Queued jobs include those [waiting for a retry](../scheduling/outcomes.md#attempts-and-retries).
Check the claim rate before treating a queued job as evidence of a stalled worker.

## Rolling back

As release operator, first check whether a destructive contract migration
already removed data. If it
did, stop and hand the restore to the on-call operator. Deploying an older
revision cannot bring the data back.

For a code rollback, use the recorded previous revision that works with the
current schema:

```bash
npm run deploy -- --revision <previous>
```

Leave the migration in place. Destructive changes have separate expand and
contract migrations so the earlier code can run against the expanded schema.
Roll back to the revision before the contract and correct the schema with a
forward migration.
