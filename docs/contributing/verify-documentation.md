---
type: Procedure
title: Verifying a documentation change
description: Check a documentation change in the repository and trace the same answers in a standalone export.
---

# Verifying a documentation change

Run these checks from the repository root after changing a page, a bookmark
or a file the documentation cites. For Open Knowledge Format (OKF) v0.3,
follow the installed skill's [validator setup](../../.claude/skills/living-project-documentation/references/validators.md#prepare-the-installed-skill)
with `skill_dir=.claude/skills/living-project-documentation`. The examples
below use its activated environment and pinned validator.

## Check the checkout

Run both checks. The first also catches relative links in agent instructions
and other Markdown outside `docs/`. The second checks the whole bundle and
can resolve links to neighboring files in this checkout.

```bash
node .claude/skills/agent-skill-authoring/scripts/check-links.mjs
node .claude/skills/living-project-documentation/scripts/check-docs.mjs \
  --validator "$VIRTUAL_ENV/validate-okf-v0.3.py" --source-root . docs
```

For the whole-root check, exit 1 identifies required findings. Correct the
reported file or link and rerun the check. Exit 2 means the check could not
complete. Use its diagnostic to correct the setup or invocation. After a
structural pass, inspect the warnings and the list of declared page types.

## Follow the changed answer

1. For each typed page under review, identify the question it answers, the
   claim it maintains and why its declared type fits. Use the
   [editorial type review](../../.claude/skills/living-project-documentation/references/documentation-structure.md#review-the-declared-type)
   if a page appears to answer independent questions.
2. Start at the root and follow the subject index. Then start from a real
   caller such as the agent routing table or an adoption instruction. Check
   that each route lands on the passage promised by its link text.
3. Try a condition that changes the answer. For example, a contributor ready
   to publish must be able to find what to do when the standing grant is
   inactive. For a moved passage, try the old path **with its fragment** and
   follow its pointer to the same answer.

## Check a standalone export

Check the directory a recipient actually gets, outside the repository. Include
linked assets. For a cited file outside the bundle, either distribute a
permitted copy or resolve it to its published revision, preserving any section
fragment. Check historical evidence against the original revision it cites.

Set `export_dir` to that standalone directory. Run the same whole-root
checker from the repository, with the export as its only document root:

```bash
node .claude/skills/living-project-documentation/scripts/check-docs.mjs \
  --validator "$VIRTUAL_ENV/validate-okf-v0.3.py" "$export_dir"
```

Trace a subject-index route and a moved fragment offline using the exported
files. Compare the bytes of distributed evidence and assets with their
originals. Record the checkout and export results separately, including the
validator revision, expected warning paths and reasons, and any source or
route that remains unresolved.
