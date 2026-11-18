# Claude Loop Engineering Template

A GitHub repository template for Claude Code projects that use a human-approved plan, explicit verification, and an independent review on a draft pull request. It ships 17 core skills and leaves stack-specific choices to the adopting project.

## Development

You need Git, Bash, Python 3, and Node.js. Template contract tests also use Bun and `jq`; optional quality hooks use `jq`. The template has no application to build or start.

- [Adapt the template](./INIT.md) — set project values, retain existing files, and choose hooks and checks.
- [Run template verification](./docs/conventions/testing.md) — local checks, CI coverage, and adoption smoke tests.
- [Browse project documentation](./docs/index.md) — workflow, Claude Code sessions, and skill maintenance.

## Related links

- [Shared skill library](https://github.com/axross/skills)
- [Review policy](./REVIEW.md)
