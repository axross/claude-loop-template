---
type: Definition
title: Counting attempts
description: How to distinguish the first try, retries and the budget for one job.
---

# Counting attempts

## Attempt budget

An **Attempt** is one try at running a job. The first attempt belongs to the
job even though it consumes no retry. Each subsequent attempt is a retry of
that same job. Its outcome is the last attempt's outcome. Starting another job
from the same template starts a new count.

For the limit, timing and state between attempts, see
[what happens after a failed attempt](./outcomes.md#attempts-and-retries).
