# Agent Skills

The shared [axross/skills](https://github.com/axross/skills) library owns the installed copies under `.claude/skills/`. Committing copies gives a fresh clone its core skills without an install step. Use the installer rather than maintaining a fork or patching generated files: hand edits vanish on refresh and forked copies no longer receive upstream fixes. Node.js and network access are required when fetching a refresh, not to read the installed skill text.

## Install and refresh

The template's core set was refreshed with `skills@1.9.0` from [axross/skills at `69a254d`](https://github.com/axross/skills/commit/69a254dd6b368732a6f8a153f5826784b7df6746). The generated `skills-lock.json` records the source, commit, and installed hashes. For an intentional refresh, choose the upstream SHA and installer version. From the repository root, repeat `--skill` once per intended name:

```bash
revision=69a254dd6b368732a6f8a153f5826784b7df6746
args=()
while IFS= read -r name; do args+=(--skill "$name"); done < <(
  node -p 'Object.keys(require("./skills-lock.json").skills).join("\n")'
)
test "${#args[@]}" -gt 0 && DISABLE_TELEMETRY=1 npm_config_ignore_scripts=true \
  npx --yes skills@1.9.0 add "https://github.com/axross/skills/tree/$revision/skills" \
  --agent claude-code --copy --yes "${args[@]}"
```

This command assumes every lock entry comes from that library. In a project with several sources, refresh each source's subset separately. Do not use `--skill '*'` against an external source, or join names into a comma-separated argument. Check the CLI's copied inventory and compare files byte for byte to the pinned source; do not equate a lock hash change with a content change. Commit the generated copies and CLI-generated lockfile together. Do not run project formatters or INIT over generated copies.

When upstream renames a skill, refresh the intended set using its new name, remove the stale skill through the CLI, and update every executable path and prose reference in the same change. Pinning the old name indefinitely delays every later refresh without avoiding the migration; forking hides divergence. Use skill names in prose and paths where a command or link actually needs one.

## Confirm loading

In a fresh Claude Code session, verify discovery and the source in `/context`, then invoke the matching skill and check that the expected body loads. A copied directory, lock entry, or another host's reload does not prove this. Verify any distinct author/reviewer launch surface separately.

## Deviations and gaps

Record accepted local deviations with the applicable rule, scope, reason, and authorizing decision. Compare a suspected gap with the installed source before classifying it. Request approval before filing a generalizable issue upstream; record the pending gap locally without patching the copy. Repo-specific practice stays in its owning convention.

### Gap: authentication policy

The installed security skill's general checks do not define a project's login throttling or which component owns session cookies. A project with authentication should document and review those choices in its own security convention. Choose lockout and recovery limits for that project's risk and availability needs; this template does not set a universal OWASP threshold.
