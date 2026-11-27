# Conventions and Operations

## Placing a project rule

Where a violation appears helps identify the reader who needs the rule. A
client receiving a missing field encounters a contract violation. A reviewer
checking directory layout is applying a Convention, even if a linter enforces
it. An operator diagnosing a queue backlog needs the Architecture to identify
the producer and consumer before consulting a recovery Procedure.

**Guidelines:**

- SHOULD place an observable guarantee in its Specification and a team's choice among conforming practices in its Convention.
- MUST keep the constraint beside its reasoning and link to its existing owner when already documented. A project with architectural decision records MAY link the original record for provenance.

## Permission and execution

A release operator activates a rollout. A device operator checks the
installation and restores service if verification fails. Both procedures can
depend on the same permission to release. When one operator carries out a
single task, a locally scoped permission check can fit directly in its steps.

**Guidelines:**

- SHOULD extract a Policy when several entry points depend on a permission rule that changes independently.
- MUST identify the adopted scope, exception authority and reopening conditions, and connect every affected entry point, including manual and emergency paths, to the actual authority.
- SHOULD give operators separate procedures when their tasks have different prerequisites, success signals or recovery actions.
- MUST state the local stop condition beside a consequential step. A successful recovery command establishes what ran. Permission to run it comes from the project's authority.
- MUST NOT invent an approver or independent permission rule to populate a type.

## Contributor routes

A contributor guide can direct a new maintainer to the setup procedure and a
reviewer to the same convention used by the linter. Each route leads to one
maintained rule.

**Guidelines:**

- SHOULD document each subject's scope and its nearest confusing neighbor. Give a tie-breaker a contributor can apply to a new claim and explain when to add a subject. For instance, a worker-pool cap belongs with dispatch internals unless it promises an outcome to callers.
- SHOULD link the placement convention from durable human and agent entry points and update it when responsibility moves. Link editable callers directly to their governing section.
