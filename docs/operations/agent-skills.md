---
type: Procedure
title: Agent skills
description: Install, restore or refresh the shared skills, including recovery when upstream renames one.
---

# Agent Skills

The template distributes a working copy of each selected
[axross/skills](https://github.com/axross/skills) capability, so a fresh clone
can load the skills before anyone installs Node or connects to the library.
The [skills CLI](https://github.com/vercel-labs/skills) manages the copies.
Maintaining a separate fork or vendoring the files under local ownership
would hide divergence from upstream corrections. Project-specific rules
belong in the project's documentation, where the
[placement convention](../conventions/documentation.md#choose-a-subject) routes their readers.
The template adopted shared skills in [PR #65](https://github.com/axross/claude-loop-template/pull/65).

## Install and Refresh

From the project root, use Node and a network connection to refresh the set
in [skills-lock.json](../../skills-lock.json):

```bash
npx skills add axross/skills --agent claude-code --yes --copy \
  $(node -p "Object.keys(require('./skills-lock.json').skills).map(s => '--skill ' + s).join(' ')")
```

For a targeted refresh or a new adoption, pass one `--skill <name>` flag per
selected skill. A comma-separated value matches no skills. The wildcard
`--skill '*'` selects the entire upstream catalogue, including capabilities
this template has never adopted. If npx reports `could not determine executable
to run`, retry the command with `npx --yes skills@latest add`.

Check the CLI's installation summary for each expected copy, then compare the
directory names in `.claude/skills/` with the lockfile and review the revision
and content changes. Commit the generated copies and lockfile together. A
hand-edit disappears on refresh. Follow [Changes to installed rules](../../.claude/skills/agent-skill-management/references/installed-rule-changes.md)
to verify and route a suspected defect. Record an accepted local departure in
the [skill departures register](./skill-departures.md#the-register).
After installation, open a fresh Claude Code session and check `/context` to
confirm discovery. A successful copy alone establishes only what is on disk.

### Versions

To restore the recorded revisions, run:

```bash
npx skills install --agent claude-code
```

The source-free `install` alias was verified with skills CLI 1.9.0. If the
restore creates a staging `.agents/` directory, remove the generated staging
files before committing. This template tracks only the Claude Code skill root.
Running the [refresh command](#install-and-refresh) installs the latest upstream
revision of each selected skill and updates its recorded commit in
`skills-lock.json`. Upgrades run only when someone invokes the command.

### When Upstream Renames a Skill

The refresh command derives its selection from the lockfile, so an upstream
rename leaves it requesting a missing name. Install all surviving skills and
the new name explicitly, then remove the stale name with the CLI so its
lockfile entry is removed as well:

```text
npx skills add axross/skills --agent claude-code --yes --copy --skill <surviving-skill> --skill <new-name>
npx skills remove <old-name>
```

Use one flag for each survivor. Carry the rename through every workflow,
script, instruction and document that names the old skill. Exercise each
affected command at its new path. Review the generated diff through the
lockfile and call sites. Pinning an older library revision to avoid a rename
defers this work and holds back other skills' improvements. Forking the renamed
skill also cuts it off from shared fixes.
The template applied this procedure in [PR #67](https://github.com/axross/claude-loop-template/pull/67).

## Deviations and Gaps

See the [skill departures register](./skill-departures.md).

## The Register

See [which departures qualify and what each entry records](./skill-departures.md#the-register).
The following bookmarks lead to individual entries:

- <a id="deviation--combined-plan-gate-confirmation"></a>[Combined plan-gate confirmation](./skill-departures.md#deviation--combined-plan-gate-confirmation)
- <a id="deviation--the-explicit-request-is-asked-again-not-carried-forward"></a>[Renewing the explicit request](./skill-departures.md#deviation--the-explicit-request-is-asked-again-not-carried-forward)
- <a id="deviation--watching-conditioned-on-the-humans-confirmation"></a>[Watching a pull request](./skill-departures.md#deviation--watching-conditioned-on-the-humans-confirmation)
- <a id="gap--application-security-is-silent-on-authentication-lockout-and-session-cookie-ownership"></a>[Authentication lockout and session-cookie ownership](./skill-departures.md#gap--application-security-is-silent-on-authentication-lockout-and-session-cookie-ownership)
