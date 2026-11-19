# Testing and Verification

This template has no application build or unit suite. Verify the template contracts and the configured checks of an adapted project separately. Run the commands from the repository root with Git, Bash, Node.js, Python 3, and `jq` available.

## Documentation

```bash
bash .github/scripts/check-documentation.sh
```

This checks inline links to Markdown files from tracked and non-ignored Markdown. In project-owned Markdown it also checks relative inline links to non-Markdown paths and top-level reference definitions. It runs the index, references, and glossary validators on `docs/`. Check section anchors separately. Missing required inputs fail; absent specs are not applicable to glossary pairing. The Documentation and Links job in Merge Checks runs this command before and after adoption, including for changes that touch only CI, settings, scripts, or checkers.

## Template contracts

Install Bun for YAML parsing; the workflow tests do not call GitHub or Claude Code.

```bash
python3 .github/tests/template-contracts.py
git diff --check
```

Template Contracts exercises initialization, link and docs failures, direct hook invocations in disposable consumers, and workflow wiring. It also runs the optional review guards against local stand-ins. It does not establish that Claude Code loaded the bindings or that GitHub ran the workflow. Do not run formatters on `.claude/skills/`; compare managed copies against their upstream source instead.

## Delivery dry run

Walk through these cases against the [development workflow](../operations/development-workflow.md) with disposable issue, PR, and review snapshots. Start with the control, then change one input at a time. Record the first gate that stops the transition. Do not publish anything or mark a real PR ready during this check.

| Case | Expected decision |
| --- | --- |
| The PR is mergeable under project policy; approval matches the current plan; ownership, required checks, and evidence are verified; the posted independent review is current and has converged | The `loop-engineering` Ready Gate is satisfied. It covers marking the PR ready, not merging it, and does not override host restrictions. |
| Update the plan after approval, leaving the prior approval and schedule in place | Stop before implementing the new revision. Ask for approval of that revision. |
| Mark required external evidence `pending`, even with green checks | Keep the PR in draft until that evidence is verified. |
| Leave one required finding unresolved in the current posted independent review | Keep the PR in draft until the finding is resolved and the review is current. |
| Make the PR unmergeable with all other inputs unchanged | Keep the PR in draft. |
| Keep the gate satisfied but remove the separate grant to mark ready | Mark ready if the host permits. Do not merge. |

## Adopted project

Before adoption, Merge Checks show explicit notices and skip project lint and unit tests. After adoption, its guarded steps set up the selected toolchain, install dependencies, and run lint and the selected unit-test command. Select actual toolchain versions and commands during adaptation. Document those and any separate formatting, type-check, end-to-end tests, or manual verification here; keep whole-project formatting an explicit operation. Remove the template-only sections when dropping the template checks.

Configure GitHub's required checks separately from the agent's ready policy. Neither an optional hook nor an available Actions workflow proves required checks ran at the current head. Keep the reviewer exclusion list in sync with actual coverage.
