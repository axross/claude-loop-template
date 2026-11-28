---
type: Convention
title: Placing a documentation change
description: Which page owns a project decision and how contributors keep it reachable as the project changes.
---

# Placing a documentation change

## Choose a subject

Start with the question someone will bring to the [documentation index](../index.md).
The same pull request can affect several subjects:

| Reader's question | Where the answer belongs |
| --- | --- |
| How do I deliver a change for review? | [Deliver a change](./change-delivery.md) owns the contributor's workflow. |
| May this session publish the change? | [Delivery authorization](../governance/delivery-authorization.md) owns the grant and its limits. A procedure that uses the grant links there. |
| What do I do when the requested review never appears? | [Review automation](../operations/review-automation.md) owns diagnosis of the service. |

Once you know the subject, choose the page type that describes the answer.
A Policy can name who may grant an exception. A Procedure can tell an operator
how to recover from a failed job. Keep steps, prerequisites and recovery for
one task together. Split a page when its readers need answers that change
independently.

Create a subject when no existing page owns the new question. For example,
an adopter's first product guarantee can be a Specification under that
product's own subject. Add a glossary when readers actually use competing
names for a concept. The installed [Living Project Documentation skill](../../.claude/skills/living-project-documentation/SKILL.md)
defines the format and migration rules.

## Maintain the decision with its subject

The page governing a decision MUST state the current constraint and the reason
for it. Readers can consult the original commit or pull request to follow the
deliberation. Project-specific rules belong in the project's documents, so
refreshing an installed skill preserves the project's choice.

A change that makes a documented answer incorrect MUST correct its owning
page in the same change. The plan SHOULD name each affected page. Keep the
limiting condition beside the action it changes. When a delivery grant
changes, check each procedure that uses it and correct any instructions that
depend on its former scope.

## Connect the page to its readers

A new page MUST have a descriptive link in the subject index or root index.
For a new change surface, the same change MUST also add its owner to the
[agent routing table](../../AGENTS.md#routing-a-change), so a session working
on that surface can discover the local rule. Link to the passage where a
reader can act.

A rename or removal MUST update the index and any affected routing row in
the same change. Redirect editable callers to the new owner. Keep a short
route at the previously published path and fragment while external use is
uncertain. [Verify the documentation change](./verify-documentation.md)
from those entry points.
