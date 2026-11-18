---
name: agent-skill-management
description: Deciding whether guidance belongs in agent instructions, project documentation, host configuration or a skill, choosing its tier, and managing installation, active loading and actor-local acquisition. Triggers on adding, editing, renaming, moving or removing skills; installed-copy or lockfile drift; missing discovery; same-name masking; stale, truncated or missing material; retained-context recovery; a defective loaded rule. Metadata belongs to skill-authoring practices; selection/output assessment follow task-specific development/review practices; project policy and host operations own safeguard activation and commands. Covers source ownership, targeted refresh, acquisition coverage and retention/recovery.
user-invocable: false
---

# Agent Skill Management

Use this capability to manage agent skills in a two-tier project, verify their discovery and active loading, or establish actor-local acquisition, retention and recovery. Management includes adding, editing, renaming, moving, and removing skills. **Distributable** skills — portable capabilities other projects can install — are authored in a source directory (conventionally `skills/`, the source of truth) and **installed** into the skill root (the directory the agent actually loads — `.claude/skills/` for Claude Code, `.agents/skills/` for Codex and several others) with the [vercel-labs/skills](https://github.com/vercel-labs/skills) CLI (`npx skills`); a `skills-lock.json` file records what was installed. **Repository-local** skills — capabilities that encode a single project's own process and have to fire while a surface is being edited, never a document the project's own instructions could route to on demand — are committed directly under the skill root and are never touched by the CLI.

Discovery is what routes to a skill in either tier: each skill advertises when it applies through its own `description`, so no written index is required. Some hosts maintain one anyway (e.g. an `AGENTS.md` table), which then becomes a second record to keep current.

This skill is **self-contained**: it names no repository-specific file or layout and references no repository-root index, so it works installed on its own. The directory names below are the conventional defaults — `skills/` for the source, and a skill root of `.claude/skills/` on Claude Code or `.agents/skills/` on Codex. Substitute the host project's chosen paths where they differ, and note that a project targeting both hosts has two roots, one of which may be a symlink into the other.

**Guidelines:**

- MUST, where the host project maintains a written skill index, keep it in sync whenever a skill in either tier is added, renamed, moved, or removed, per your project's skill-authoring conventions; where it maintains none, each skill's `description` frontmatter is the whole of discovery and no index is owed.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119.html).

## Is the Material a Skill?

Before asking which tier a skill belongs in, ask whether the material should be a skill at all. A skill's one functional advantage over a document is discovery — it fires unasked while a matching surface is being edited, without anyone remembering to consult it — and that advantage is also its whole recurring cost: every skill's `description` competes for room in every session's listing, on every task, whether or not that task needs it. Material that never has to fire unasked pays that cost for nothing, because an always-loaded instruction file can route to it on demand instead.

One incident can expose several kinds of guidance. A project's choice of who an agent must assign, a portable procedure for verifying assignment, and a host's configured permissions have different owners. Split those statements before choosing a destination; a whole paragraph need not move together.

| The material is…                                                                      | Route it to                                                                                        |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| What the product is, means, does, and is constrained by                               | The project's own living documentation of the product                                              |
| A project-specific obligation for agents alone                                        | The project's agent instructions, such as `AGENTS.md`                                              |
| How human contributors and agents lay out, write, build, operate, and run the project | The project's contributor documentation                                                            |
| An actual personal, host, or environment preference or configured value               | That owner's supported configuration surface and workflow                                          |
| A capability that needs discovery while a matching task or surface is being worked on | Its existing skill owner, or [Choosing a Tier](#choosing-a-tier) below if a new skill is justified |

The configuration row concerns the setting itself, not the reusable procedure that uses it. A host-specific runbook may explain that workflow, but copying a portable rule into every personal setting would give it several owners without making it environment-specific. A project's explicit placement policy and the active host's instruction hierarchy still apply.

The portability question below cannot make this call. A repository-layout _document_ is exactly as unportable as a repository-layout _skill_, so portability returns "no" for both — asking it first leaves a reader concluding the material must be a repository-local skill, having never asked whether it should be a skill in the first place.

**Guidelines:**

- MUST answer this question before [Choosing a Tier](#choosing-a-tier), for new material and for material a change is about to add to an existing skill.
- MUST split mixed guidance by project scope, intended actor, and actual environment dependence before assigning each statement its owner.
- MUST keep a reusable procedure with its applicable capability owner rather than copying it into project instructions or personal settings; follow the supported configuration workflow for actual settings.
- MUST NOT write a skill for material an always-loaded instruction file can already route to on demand; that routing costs one line there and nothing in every other session's listing.
- MUST retire an existing skill when this question reclassifies it — move its content to the owning instructions, documentation, or supported configuration under the applicable change gates, and remove the skill rather than leaving both in place.

## Choosing a Tier

Every skill lives in exactly one tier, decided by one question: **would the skill work, unchanged, installed into another project?**

- A skill that is self-contained and portable — it names no repository-specific file, workflow, or layout — is **distributable**: author it under the source directory (`skills/<name>/`) and install it with the CLI.
- A skill that encodes one project's own process as a capability — the skill-authoring rules a project tailors to itself, a project's own change loop, a review policy written against its own diffs — is **repository-local**: commit it directly under the skill root (`.claude/skills/<name>/`, or `.agents/skills/<name>/` on a host that reads that path).

**Guidelines:**

- MUST place every new skill in exactly one tier using the portability question above, once [Is the Material a Skill?](#is-the-material-a-skill) has settled that it is one, and before writing its `SKILL.md`.
- MUST NOT store a repository-local skill under the source directory or manage it with `npx skills`; it never appears in `skills-lock.json`.
- MUST move a skill between tiers deliberately when its scope changes — a repository-local skill later generalized for sharing moves its source to `skills/<name>/` and is reinstalled with the CLI — never by keeping a copy in both.
- MAY read a skill's tier off `skills-lock.json`: a skill listed there is distributable and installed; one absent from it is repository-local.

## Repository-Local Skills

A repository-local skill's committed copy under the skill root **is** its source of truth. The prohibition on hand-editing installed copies does not apply here — editing these files in place is the correct workflow.

**Guidelines:**

- MUST edit a repository-local skill directly under the skill root (`.claude/skills/<name>/`, or the equivalent path the host reads) — its `SKILL.md`, `references/`, and any `scripts/` — and commit those files; there is no separate source directory and no install step.
- MUST author it to the same standard as any other skill — frontmatter, naming, discovery metadata, progressive disclosure — per your project's skill-authoring conventions.
- MUST rename a repository-local skill with a `git mv` of its directory plus a matching frontmatter `name` update, and update every reference to the old name in the same change.

## Distributable Skills: Install and Refresh

A distributable skill is authored under `skills/<name>/SKILL.md` (with its `references/` beside it) and installed with the CLI. The CLI is run through `npx`; when the environment does not support symlinks, installs use `--copy` (the copy lands as a real directory under the skill root).

**Commands:**

- Install or refresh every managed skill:

  ```bash
  npx skills add ./skills --agent claude-code --skill '*' --yes --copy
  ```

- Refresh a single skill by name:

  ```bash
  npx skills add ./skills --agent claude-code --skill <name> --yes --copy
  ```

- Refresh several named skills — one `--skill` flag each:

  ```bash
  npx skills add ./skills --agent claude-code --skill <name> --skill <other-name> --yes --copy
  ```

- List installed skills: `npx skills list`
- Remove an installed skill: `npx skills remove <name>` (then delete its `skills/<name>/` source, and update the host's written skill index where it keeps one).

**Guidelines:**

- MUST author a distributable skill under the source directory (`skills/<name>/`), never directly under the skill root.
- MUST NOT hand-edit an installed copy under the skill root when you own its source; edit the source and reinstall.
- MUST re-run the install after editing any source skill so the committed installed copy and `skills-lock.json` match the source.
- MUST commit every installed skill root — `.claude/skills/<name>/`, `.agents/skills/<name>/`, or both — and `skills-lock.json` alongside the `skills/` source; they are tracked artifacts, not gitignored.
- MUST pass `--copy` when symlinks are unsupported; a symlink install leaves the skill root empty or broken there.
- MUST use `--skill '*'` to refresh all managed skills after a broad change, or `--skill <name>` for a targeted one; `--skill` takes exactly one skill per flag, so installing several means repeating it (`--skill <name> --skill <other-name>`), not passing a list.
- MUST read a `No matching skills found` response — the CLI answering with the source's available-skill list where an install summary belongs — as a run that installed nothing: no skill reaches the skill root and no lockfile is written. A comma-separated `--skill a,b,c` is the usual cause, since the CLI does not split the value and so matches no skill at all, and that available-skill list reads like ordinary help rather than a failure.
- SHOULD run `npx skills add` from the repository root so `./skills` resolves and `skills-lock.json` is written there.
- SHOULD confirm the install summary lists every expected skill as `copied` before committing — the check that catches a run which matched nothing and installed nothing.
- SHOULD retry with an explicit version specifier (`npx --yes skills@latest …`) when `npx skills` aborts with `could not determine executable to run`; the plain form above stays canonical, and the specifier is a fallback for environments where `npx` cannot resolve the bare package name.

## Discovery and Active Loading

See [active-loading.md](./references/active-loading.md) for:

- verifying an installation or refresh through separate observations of installation, source agreement, discovery, and active content
- diagnosing missing discovery or unexpected loaded content, including same-name precedence, stale sessions, and unavailable source evidence
- diagnosis before an authorized installation change

## Actor-local Acquisition and Recovery

See [actor-local-acquisition.md](./references/actor-local-acquisition.md) for:

- establishing complete applicable bodies and references in each controlled internal actor's current context
- applying task-sensitive development or internal-review selection and output-assessment ownership
- distinguishing native loading, direct acquisition and retained text, with full, partial, unknown, mismatch or unavailable coverage
- correlating expected and observed material without inferring acquisition from a parent or reused assignment identifier
- recovering truncation or lost retention from one verified revision, without redundant reads of complete retained text
- separating acquisition from output verification and verification-evidence assessment, without adding external-review attestations

## Proposing a Change to an Installed Skill

See [installed-rule-changes.md](./references/installed-rule-changes.md) for:

- routing a wrong, outdated, or missing loaded rule to its actual source according to skill tier
- distinguishing additive local conventions, approved bounded deviations, and unadopted upstream proposals
- checking human adoption, host priority, scope, and reassessment without requiring a dedicated register
- correcting an owned source under applicable change gates or publishing an authorized third-party request

## The Lockfile

`skills-lock.json` is the install lockfile — analogous to `package-lock.json`. It records each distributable skill's `source`, `sourceType`, and a `computedHash` of the installed content, and is committed so the installed state is reproducible and drift is detectable. Repository-local skills never appear in it.

Since `skills@1.5.22`, the CLI writes a `local` `source` as a path relative to the lockfile's own directory — `/`-separated, so it stays portable across checkouts and platforms — rather than as an absolute path. It falls back to an absolute one only where no relative path exists, as when the source sits on a different filesystem root. Refreshing any single skill rewrites every `local` entry's `source` through that same normalization, not only the one refreshed, so a lockfile diff that touches entries for skills you did not edit is this normalization sweep, not drift. A CLI older than 1.5.22 still writes the absolute form, so a checkout's lockfile can carry either form depending on which version last ran the install.

Verified against the [`v1.5.22` release notes](https://github.com/vercel-labs/skills/releases/tag/v1.5.22), published 2026-08-05.

**Guidelines:**

- MUST commit `skills-lock.json` and regenerate it by running the install command, never by hand-editing.
- MUST treat a `computedHash` change with no corresponding source edit as install drift to investigate, not to blindly commit.
- SHOULD treat a diff touching only `local` `source` fields, with no `computedHash` change, as the normalization sweep above rather than drift; confirm which CLI version last ran the install when a lockfile keeps alternating between the two forms.

## Installed-Copy Drift Check

The installed copies are tracked artifacts, not build output, so nothing stops a hand-edit to one — and the next install discards it silently. This skill bundles `scripts/check-installed-copies.mjs`, a dependency-light Node check (standard library only) that compares each source skill against its installed copy file by file and byte for byte, so a forgotten reinstall or a hand-edit fails before merge instead of surfacing later.

**Example:**

```bash
# Substitute the skill root the host reads (.claude/skills, .agents/skills, …).
node skills/agent-skill-management/scripts/check-installed-copies.mjs skills .claude/skills
```

Both roots are **required**, and there is no default: a directory layout is a project's own choice, and a guessed root that matches nothing reports no drift — a pass indistinguishable from a real one. It reports four kinds of difference (a file missing from the installed copy, a file present only there, differing content, and a source skill with no installed copy at all), plus an installed skill that has neither a source nor repository-local status. Mark each repository-local skill with a repeatable `--local <name>`, or the check reads it as drift. It deliberately ignores `skills-lock.json`: the lockfile is written only by an install, so it records what the last install did rather than what is on disk now, and cannot witness an edit made to an installed copy afterwards — precisely the drift this check exists to catch. Its `source` field also names where a skill came from rather than where its installed copy lives, so it identifies neither of the two roots the check compares. Directory contents are the truth.

It exits 0 when every installed copy matches, 1 on drift, and 2 on a bad invocation or a root that is not a directory.

**Guidelines:**

- MUST run this check after any change to a distributable skill, and treat exit 1 as a forgotten reinstall or a hand-edited copy rather than as a reason to edit the installed tree.
- MUST name both roots explicitly at every call site, including the project's own gate, since the check cannot infer a layout it was not told.
- MUST register every repository-local skill through `--local` (or the set inside a project's own copy) rather than letting a sourceless installed skill pass, or a DELETED source becomes indistinguishable from a deliberate one.
- SHOULD wire it into the project's merge gate: it is offline and deterministic, which is exactly what a gate needs.

## Verification

Skill changes are documentation changes: they gate on format, lint, and relative-link integrity, plus a skill structure validator where the project ships one.

**Guidelines:**

- MUST run the project's documentation checks (format, lint, relative-link integrity) after any skill change — a direct edit or a reinstall — and fix any failure before committing.
- MUST run the relative-link check whenever a skill's files or links moved, since a stale link inside an installed copy fails the same check as the source.
- MUST confirm, after adding, renaming, moving, or removing a skill or a reference file, that discovery metadata and parent routing still resolve to the change — per your skill-authoring conventions, which own those rules — because a tier move changes paths that discovery and routing depend on.
- SHOULD validate a changed skill with the structure validator your skill-authoring conventions ship, if any.
- SHOULD diff a reinstalled copy against its source (`git diff --stat`) to confirm the reinstall changed exactly the expected files.
