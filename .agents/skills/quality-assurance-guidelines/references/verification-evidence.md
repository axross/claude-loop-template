# Verification Evidence

Apply these rules when reviewing whether the author proved the change works. Verification evidence is the observable record of checks performed, not a general claim that the change was tested.

## Evidence Required Before Completion

A review should connect each changed surface to the command, manual check, or reasoning that covers it.

**Guidelines:**

- MUST require `{{FORMAT_CMD}}` and `{{LINT_CMD}}` evidence after code or documentation edits.
- MUST require `{{E2E_TEST_CMD}}` evidence, when the project has an e2e suite, after the change affects user-facing output, e2e coverage, snapshots, route behavior, metadata, content rendering, or other observable runtime state.
- MUST require `{{BUILD_CMD}}` evidence, when the project has a build step, after the change affects routes, metadata, data-layer config, runtime config, dependencies, or type signatures.
- MUST require manual evidence for changed output surfaces listed in [manual-verification.md](./manual-verification.md).
- MUST map skipped required checks to a concrete reason and residual risk.
- MUST require a second-pass verification statement after fixing any Critical or Major finding.

## Evidence Format

Evidence should be short but specific enough that another reviewer can see what was covered.

**Guidelines:**

- SHOULD state each command with its observed result, such as "`{{LINT_CMD}}` passed" or "`{{E2E_TEST_CMD}}` failed in a record-detail snapshot".
- SHOULD name manual routes or surfaces checked, such as "the record-detail page in its non-default content state rendered the expected banner".
- SHOULD include relevant log, screenshot, or diff context when the result is not obvious from command success alone.
- MUST NOT accept "tested manually" or "looks fine" without the route, state, or behavior that was checked.
- MUST NOT accept a passing command as coverage for a surface the command does not exercise.
