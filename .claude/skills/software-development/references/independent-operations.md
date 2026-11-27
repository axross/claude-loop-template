# Independent Operations

Apply this reference when a turn could carry more than one operation, to
decide which of the candidates belong together and which do not.

## What a Turn Is Billed For

Batching independent operations can avoid another trip through the model.
The cost difference depends on input, cache writes and reads, and generated
output. Tool results that enter a later request contribute to its input. To evaluate savings for a task, compare the total cost of all
requests and the observed wall time under comparable conditions.

## The Dependency Test

An operation belongs in the same turn as another only when nothing about
either one depends on what the other returns. The test is concrete: could
this operation's target, its arguments, and the decision to run it at all
have been written down before any of the operations in the turn ran? If yes
for every candidate, they are independent and belong together. If any one of
them only gets its target, its arguments, or its reason to exist once another
operation has returned a result, it cannot be issued in the same turn as the
operation it depends on — there is nothing yet to issue it with — and putting
it in the same turn as some other, unrelated operation does not change that;
it still has to wait for the turn after the one whose result it needs.

**Good Example:**

> A change has already been located in two files. Both diffs and the
> project's contributor guide are needed to assess it. Their paths and the
> need for each read are known before any result returns, so read them
> together.

**Bad Example:**

> A search across the repository for where a function is defined, paired in
> the same turn with an attempt to open the file the search has not returned
> yet. The second operation has no target until the first one's result
> exists, so pairing them buys nothing — the second call is guaranteed to
> miss or hit whatever placeholder path stood in for the real one.

## Why No Target Number Is Given

Use the operations the task actually needs. A batch might contain one read
or several. Adding a speculative read to meet a quota also pays for its
result and can expose irrelevant material to later requests.

## Beside Change Management's Incremental Steps

[Make Incremental Changes](./change-management.md#make-incremental-changes)
makes verification of the current step a prerequisite for starting the next,
including steps that modify different files. Within the current step, independent
reads or checks on the same fixed material can share a turn.
