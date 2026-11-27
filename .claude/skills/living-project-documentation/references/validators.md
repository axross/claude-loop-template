# Validators

## Check the whole documentation root

Run `check-docs.mjs` on first adoption, during migration and after editing a
bundle. It inventories visible Markdown even if every living page is untyped.
In a populated directory without a root index it reports the missing
`index.md` and continues checking the available pages and links.

### Prepare the installed skill

Set `skill_dir` to the installed skill directory. Use Node, npm and a Python 3
environment with PyYAML. For example, from the project root on a POSIX shell:

```bash
skill_dir=.agents/skills/living-project-documentation
npm ci --prefix "$skill_dir/scripts" --ignore-scripts
python3 -m venv .venv-okf
. .venv-okf/bin/activate
python3 -m pip install PyYAML==6.0.3
validator="$VIRTUAL_ENV/validate-okf-v0.3.py"
curl -fsSL https://raw.githubusercontent.com/open-knowledge-format/open-knowledge-format/527e81aff55992be21507e97004286789126f88c/skills/okf-generate/scripts/validate.py -o "$validator"
```

The command verifies the pinned validator's SHA-256 before invoking Python.
After setup the check runs offline. You can also point `--validator` at the
same file in a local [OKF v0.3 checkout](https://github.com/open-knowledge-format/open-knowledge-format/blob/527e81aff55992be21507e97004286789126f88c/skills/okf-generate/scripts/validate.py).

### Run and interpret the check

```bash
node "$skill_dir/scripts/check-docs.mjs" --validator "$validator" docs
```

The exit status is **0** when the required checks pass, **1** for findings
that require a fix, and **2** when a setup, invocation or execution problem
prevents a complete check. Use the diagnostics to locate each finding:

- **Required by OKF.** A format error such as frontmatter on a nested `index.md` (`E004`) or on a `log.md` (`E006`) fails the check.
- **Required by this skill.** A living page needs a nonempty string `type`, a route from the root index and resolvable local links and fragments. OKF permits untyped Markdown and emits `W120`. The engineering check determines the type using the YAML 1.2 core schema. For example, an unquoted `type: On` is a string under that schema. The pinned Python parser can still emit `W120` for it. Quoting `"On"` makes both parsers read the same type.
- **Recommendations.** Upstream warnings remain visible. For example, a root index without a version declaration can receive `W125`. Check for an accompanying required finding before deciding what to fix.
- **Editorial review.** The report lists typed pages on both passing and failing runs. For each page, use its reader's question and the claim it owns to [review the declared type](./documentation-structure.md#review-the-declared-type). Root reachability and fragment resolution can pass even when a subject index omits a decision, a valid heading answers another question or a runbook sends a reader through an unrelated guide. [Trace each affected reader's route](./consulting-and-upkeep.md#verify-a-readers-route) to judge the answer and its limits.

For checkout links to neighboring files, add `--source-root .` from the
repository root. For immutable Markdown evidence, name each original by its
exact bundle-relative path. A reachable companion can cite the source in its
body or a local `sources[].resource` field.

```bash
node "$skill_dir/scripts/check-docs.mjs" --validator "$validator" --source-root . \
  --evidence evidence/accepted.md --evidence evidence/incident.md docs
```

**Guidelines:**

- MUST run the whole-root check when determining whether a tree meets the required format and engineering rules.
- MUST verify each named source against its companion and original bytes. Its expected `W120` stays in the report. An additional untyped living page or a separate error on the named source still fails.

## Focused checks

The individual Node commands default to `./docs` and accept another directory
as a positional argument. They retain their existing root-index and OKF
detection for callers using them during a targeted edit.

| Command                | Question                                                                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `check-index.mjs`      | Can a reader reach every page from the root index? An OKF route may pass through nested indexes. The legacy layout lists pages directly.           |
| `check-references.mjs` | Do local Markdown links, fragments and OKF path fields resolve? The local checker also checks rendered HTML links and images for export usability. |
| `check-glossary.mjs`   | Does each legacy flat spec have a matching glossary heading? OKF type names do not imply a glossary pairing.                                       |

## Check the export independently

Run the whole-root command on the exported directory outside the checkout.
Leave out `--source-root` so the check sees only the files a recipient gets.
Pass the same evidence paths used for the checkout.

**Guidelines:**

- MUST run project gates in the checkout and the whole-root check on both source and export.
- MUST include all distributed evidence and linked assets in the export and compare their hashes with the originals.
- MUST trace an index route and a moved fragment offline, and resolve each external source against its published location or pinned revision.
- MUST report checkout and export results separately, naming the validator revision, expected warning paths and reasons, and any unresolved sources or routes.
- SHOULD exercise the example or compare the claim with its implementation when checking runtime behavior.
