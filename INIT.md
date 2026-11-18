# Adapt the template

Keep the Claude Code workflow and independent-review gate; choose the commands, stack, and optional hooks for your project. Use Git, Bash, Python 3, and Node.js. Install `jq` on hosts where you use either quality hook.

## 1. Reconcile existing files and decide the stack

Use GitHub's template for a new repository. For an existing repository, inspect collisions before copying anything. Merge the working agreement, README, settings, ignores, docs, hooks, and workflows deliberately. Preserve private settings, unrelated files, existing decisions, and existing guides. Do not replace an existing skill tree or lockfile by copying over it; reconcile managed skills through the CLI. Preserve a single Claude Code import of the working agreement and keep `REVIEW.md` as the stand-alone review policy.

Confirm the project's goal and audience, runtime and package manager, structure, setup/run/build commands, formatting and non-mutating lint, test and type-check commands, and environment prerequisites. Ask which capabilities to keep, add, or omit (unit and end-to-end tests, UI, data/content, hosting, and instrumentation) rather than assuming a framework or provisioning a service. Resolve disagreements before applying values.

## 2. Choose bindings and fill values

Run `./init.sh init`. In `init.values.json`, retain only confirmed template-owned inputs in `files`. For clean templates the generated list is the starting inventory; for existing projects reconcile each same-named file before confirming it. Remove omitted or consumer-owned paths from the selection. Never add private settings, generated skill copies, consumer docs, or symlink targets to the manifest. Required values go in the top-level JSON fields; use the examples in `tokens.json` for syntax (not as defaults). Do not put credentials in this file. Commands and patterns are trusted project configuration, not untrusted data or a sandbox. Values are single-line strings.

- Replace the Node example in both [merge-check jobs](./.github/workflows/merge-checks.yaml): provide the named runtime/lockfile or use the project's own setup. Keep real lint and the selected unit tests. For a deliberately test-free project, remove the test job, reconcile the review exclusions and testing guide, and add `UNIT_TEST_CMD` to `omit`. Do not use a successful no-op as a stand-in. Add any required e2e/type checks to the appropriate verification routes, rather than to Stop.
- Adapt the `SessionStart` script at `.claude/hooks/session-start.sh` to the project or remove its binding and script. Review example environment copying and make sure private settings and credentials stay ignored.
- For Stop, provide `PACKAGE_MANAGER` (one executable name), `CODE_FILE_REGEX` (Bash extended regex over paths), and the same non-mutating lint command you document. Otherwise remove that hook and its binding, and omit `CODE_FILE_REGEX`; omit `PACKAGE_MANAGER` only if neither quality hook uses it.
- For PostToolUse, `FORMAT_FILE_CMD` plus `CODE_FILE_GLOB` select single-file formatting (for example a package script with no preselected target, ending in `--`). `LINT_FIX_CMD` plus `LINT_FIX_FILE_GLOB` independently select lint autofix. The path passed is a literal trailing `./`-relative argument. If a pair is not used, remove its marked case block and add both names to `omit`. If neither operation applies, remove `format.sh` and its binding. Otherwise remove markers from the retained blocks and prove that the hook changes only one eligible file. Keep whole-project formatting as an explicit command.

An omitted name must be optional, its value empty or absent, and its uses removed. Leave its manifest entry in place. Remove the corresponding script paths from `files` when removing a hook, and update the session guide to describe the bindings that remain. Keep `.claude/hooks/quality-context.sh` if you retain either quality hook. Do not enable quality hooks or add scheduler grants here; read [session operation](./docs/operations/agent-sessions.md) before opting in.

Run `./init.sh apply`. This substitutes only selected files; it does not run the configured project commands. Read the changed settings, shell, YAML and working agreement. Check that the two approved commands CI actually runs match the documented versions.

## 3. Select skills and document the project

Keep the 17 core skills. Fetch the catalog with `npx skills add axross/skills --list` and choose additional skills by their actual role. For example, the selected test framework, UI stack, data client, and instrumentation vendors may each have a dedicated skill. Use `--agent claude-code --copy --yes` with one `--skill` per selected name, never `*` against the upstream library. Commit the copies and CLI-generated lockfile together. [Skill operation](./docs/operations/agent-skills.md) explains source comparison and confirmation in a fresh Claude Code session.

Keep existing project guides when they already own a topic. Otherwise document prerequisites, dependency setup, and run/build commands in a development setup guide; format/lint/type-check/test commands and CI scope in the testing convention; stack and placement in the directory-structure convention. State how to configure local environment files without disclosing values. Index each new `docs/` page in [docs/index.md](./docs/index.md). Keep any existing decisions and index them if they live under the adopted `docs/`; do not seed an empty decision log or glossary. Write specs and glossary entries for real product domains only.

## 4. Define ownership and qualify delivery

Record the adopted assignee policy in `AGENTS.md`, such as “agent-created issues and PRs are assigned to the requesting maintainer.” Replace the example with the actual policy, including how to identify the assignee; if there is no assignment policy, state that explicitly. Verify required assignment both after creation and before ready.

Here is an **ungranted** scope example. Record grants only when the human has actually issued them:

| Field | Example |
| --- | --- |
| Target | This repository, approved issue and linked draft PR |
| Effects | None granted; list each permitted write, publication, review invocation or cleanup separately |
| Route | Unconfirmed; name the actual host/tool and actor |
| Lifetime | Unset; record when the grant expires or must be checked again |
| Exclusions | No assumed scheduling, push, assignment, merge, deployment, or alternate review route |

Set up the preferred fresh Claude Code review route (or explicitly elect Claude Actions) and test qualifications separately from plan approval. Follow the [development workflow](./docs/operations/development-workflow.md). Keep the branch audit and `claude/` policy; configure repository rules separately. Make [REVIEW.md](./REVIEW.md)'s reporting exclusions match only checks actually enforced by your CI.

## 5. Finalize and verify

1. Reconcile `README.template.md` into `README.md`. Replace the template README only if it has no project-owned content. State prerequisites briefly and link real setup and verification guides; do not duplicate command tables or link unwritten guides. Remove the README seed and its INIT notes. Finish other retained INIT-marked sections.
2. Run `./init.sh check`. This read-only diagnostic checks the final README and retained manifest files for template tokens or markers, including files excluded from substitution. It also runs repository links and the three docs validators. Fix all findings and missing prerequisites; a skipped required check is not success. Confirm the actual bindings and commands in the adopted environment, not just the template fixture.
3. Reconcile [the testing convention](./docs/conventions/testing.md) to describe your project and remove its template-only guidance. Keep the Documentation and Links job in Merge Checks and the scripts it invokes. Remove only these adaptation files: `INIT.md`, `init.sh`, `tokens.json`, `init.values.json`, the reconciled README seed if still present, `.github/workflows/template-checks.yaml`, and `.github/tests/template-contracts.py`. Do not delete `.github/tests/` or other consumer files. Removing `INIT.md` enables the project lint and test steps in Merge Checks; the documentation job is already active.
4. Rerun `bash .github/scripts/check-documentation.sh` after cleanup and check remaining links to removed tools. Run the real project commands and verify that configured CI and any selected quality hooks execute on their intended surfaces. Before a paid review or external operation, obtain the specific authorization; do not count a green dry run as published evidence.
