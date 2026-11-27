---
type: Convention
title: Placing a documentation change
description: How contributors assign a claim to its owner, route readers to it and verify the documentation bundle.
---

# Documentation

## Choose a subject

Put a claim where someone has to use it. In this template, contributors use
`conventions/` to choose a repository practice. Operators use `operations/`
to configure a session, maintain skills or deliver a change. For example, the
procedure for requesting review belongs with pull request review. Permission
to publish belongs with delivery authorization because pushing a branch and
requesting a review both depend on the same grant.

Add a subject when a reader brings a question no current subject owns.
Within it, choose the type that describes the answer. An adopted project's
first product contract can be a Specification under its product subject.
Introduce a glossary when readers actually use competing names for a concept.

## A Document Is Corrected by the Change That Made It Wrong

Update the owning page with the change that alters its answer. Keep the
condition that changes the action beside the action itself. For example, a
change to a delivery grant also requires checking the procedures that rely
on it. The installed [Living Project Documentation skill](../../.claude/skills/living-project-documentation/SKILL.md)
defines the format and migration rules.

## A New Document Earns Two Entries

Add a descriptive link to the subject index (or the root for a directly
listed subject). For each new change surface, also add its owner to the
[agent routing table](../../AGENTS.md#routing-a-change). The table is how a
session editing the project discovers a local rule. Keep project conventions
here instead of authoring local skills, so a library refresh and template
adaptation can manage installed skills without modifying their contents.

When moving an answer, point editable callers at the new owner. Keep a short
route from a published path or fragment while external use is uncertain.

<a id="the-decision-log-is-this-projects-own"></a>

## Where a settled decision belongs

Record the current constraint and its reason on the page governing the
decision. Use the original commit or pull request for the deliberation.
The template's dated skill records are historical entry points. New decisions
are maintained with their subject.

## Checking a Documentation Change

Run the repository link check from the root. For Open Knowledge Format (OKF) validation, set
`skill_dir=.claude/skills/living-project-documentation` and prepare the Node
dependencies, Python environment and pinned validator using the installed
[validator setup](../../.claude/skills/living-project-documentation/references/validators.md#prepare-the-installed-skill).
With that environment active, check the checkout:

```bash
node .claude/skills/agent-skill-authoring/scripts/check-links.mjs
node .claude/skills/living-project-documentation/scripts/check-docs.mjs \
  --validator "$VIRTUAL_ENV/validate-okf-v0.3.py" --source-root . docs
```

For a standalone export, run the same whole-root check on the exported
directory outside the checkout, omitting `--source-root .`. A checkout link
can resolve here even when the recipient lacks its target. Trace a question
from the root, subject index and a real caller to the owning passage. Check
that the reader can also find the exception that changes the answer.
