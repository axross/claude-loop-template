# Verify the active skill

An installer writes files; a host chooses which skill to discover and load.
A correct installed copy can coexist with an unexpected active skill of the
same name. Verification therefore follows the evidence across those boundaries
rather than treating a successful command as proof of every later step.

## Separate the observations

First identify the skill's tier. For a distributable skill, record each result
with the evidence that supports it:

| Observation      | Evidence                                                              | Does not prove                     |
| ---------------- | --------------------------------------------------------------------- | ---------------------------------- |
| Installation     | Installer summary and intended files on disk                          | Source agreement or host discovery |
| Source agreement | File comparison against editable source, plus lockfile inspection     | Which source the host selects      |
| Discovery        | Active host catalog and reported origin                               | That the body was loaded           |
| Active loading   | Host load result identifying the selected source and expected content | Another session's state            |

For a repository-local skill, the committed skill root is the editable source.
Record its path and intended content revision directly. Installation and
source-to-installed-copy agreement are not applicable: there is no installer,
separate generated copy, or lockfile entry to check. Discovery and active
loading still need the host evidence in the table; a committed file alone
does not prove that the host selected it.

**Guidelines:**

- MUST report these observations separately, naming failed, unavailable, untested, or tier-inapplicable stages rather than collapsing them into installation success.
- MUST identify the intended source and content revision before comparing them with the host's selected source. Resolve symlinks when two paths may name the same files.
- MUST use the current session's available host evidence; a shell inventory or another executor's tools do not establish this session's active state.
- MUST use the host's supported reload or fresh-session route after an authorized refresh, then load the skill and inspect its reported source and expected body content. A matching name or description alone is insufficient.
- MUST report active verification as unavailable when the host cannot expose enough source or content evidence, stating that an unexpected or stale skill cannot be ruled out.

For example, a source comparison passes for the project installation, but the
host loads a user-level skill of the same name. Installation and source agreement
can pass while active loading is a mismatch. A matching path with an old body
instead indicates stale content; a current file read alone cannot establish
that the session loaded the new body.

When completeness, current retention or another actor's acquisition is in
question, use [actor-local-acquisition.md](./actor-local-acquisition.md).
Native loading remains one observation, not proof that every applicable
reference reached the actor. Direct acquisition can supply required text
without establishing which source the host selected for native loading.

## Diagnose before changing an installation

Reload and precedence mechanisms differ by host. Project operations own their
commands and settings; consult current host documentation and permitted tools
when that guidance is absent. Skill-authoring practices own metadata validity
and the distinction between standard fields and host extensions.

**Guidelines:**

- MUST inspect same-name candidates and the host's current precedence before concluding which source wins; never infer priority from a directory's name.
- MUST distinguish disabled compatibility discovery from missing files, broken symlinks, inaccessible sources, invalid metadata, and same-name masking. Report the observed cause or the evidence still missing.
- MUST NOT add a duplicate skill tree or change personal/global skills or compatibility settings merely to make discovery succeed. Diagnose first and obtain authorization for the required change.
- MUST route content defects to editable source. For distributable skills, regenerate only the intended managed skills and inspect generated roots and lockfile changes; never repair an installed copy by hand. For repository-local skills, edit the committed skill root directly without installing it or creating a lockfile entry.
- MUST keep host-specific reload commands and extension handling out of universal installation requirements. A host's unsupported extension is not by itself evidence that another host's installation should change.
