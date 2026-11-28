# Work with Claude Code

Use these guides when configuring a Claude Code checkout or changing the
tools and roles available during a session.

## Start a session

Choose the setup you need:

- [Activate and verify the checkout settings for your session](./session-settings.md).
- [Bootstrap a cloud session](./session-startup.md#bootstrap-a-cloud-session).
- [Enable edit and stop hooks in a supported session](./session-startup.md#enable-the-quality-hooks).
- [Verify telemetry after startup](./session-startup.md#verify-telemetry-after-startup).

## Adapt or diagnose a hook

Choose the hook by the event you observed:

- [Select the files to format or autofix after an edit](./edit-hook.md#select-files-for-formatting-and-autofix).
- [Diagnose a blocking lint or unit-test failure at stop](./stop-hook.md#blocking-failure).
- [Respond to a delivery reminder on a fully pushed branch](./stop-hook.md#delivery-reminder).

## Maintain skills and delegate work

Choose the change you are making:

- [Install, refresh or restore skills, including recovery from a rename](./install-skills.md).
- [Find the responsibility and fallback for each subagent role](./subagents.md#role-boundaries).
- [Assign an independent reviewer](./subagents.md#assigning-the-reviewer).
