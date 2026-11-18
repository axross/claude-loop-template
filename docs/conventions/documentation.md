# Documentation

Use the [documentation index](../index.md) as the single map for project-specific facts, rules, and procedures. The README is an entry point, not a second command reference. Claude Code discovers skills from their descriptions; it does not discover project procedures that way. Put those in indexed `docs/` instead of skills so reference material does not crowd the skill catalog.

## Upkeep

Update a document in the same change as the behavior it describes. Link every new document from `docs/index.md`; no second registration in `AGENTS.md` is required. Put setup and run commands in the setup guide, verification commands and CI coverage in the testing convention, and the stack and layout in the directory-structure convention. Reuse an existing owner rather than creating a competing guide.

Put each constraint and its reason together in its owning spec, convention, or procedure. A separate decision log would make readers reconcile a second copy of what is true now. This template no longer seeds one. Adopting projects may keep their existing decision records and policy; preserve them and reconcile their index coverage rather than deleting them to pass a check.

Use `living-project-documentation` for the shape. Its [six-file example](../../.claude/skills/living-project-documentation/assets/docs-example/index.md) shows the index, glossary, specs, convention, and procedure working together. Do not invent empty product domains for a template.

## Checks

After editing docs, run the documentation gate described in the [testing convention](./testing.md).
