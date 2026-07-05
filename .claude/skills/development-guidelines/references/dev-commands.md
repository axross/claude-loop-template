# Dev Commands

Apply this reference when choosing which project command to run or when updating the command surface in the project's manifest. The project pins a minimum runtime/toolchain version in its manifest; respect that pin when running or upgrading.

## Application Commands

These commands run the application locally or as a production build.

| Command         | Purpose                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------- |
| `npm run dev`   | Starts the development server (commonly at a local URL such as `http://localhost:3000`). |
| `npm run build` | Builds the production bundle.                                                            |
| `npm run start` | Starts the production build produced by `npm run build`.                                 |

**Guidelines:**

- MUST use `npm run dev` for manual verification of UI, route, metadata, and data-driven output changes.
- MUST run `npm run build` after changes affect routes, metadata, runtime config, dependencies, or public type signatures.
- SHOULD use `npm run build` followed by `npm run start` when verifying production-only caching, asset, or compiler behavior.

## Quality Commands

These commands enforce formatting, linting, and end-to-end behavior.

| Command                                  | Purpose                                                  |
| ---------------------------------------- | -------------------------------------------------------- |
| `npm run format`                         | Formats the code and documentation with Prettier.        |
| `npm run lint`                           | Runs ESLint.                                             |
| `npm run typecheck`                      | Type-checks the project with `tsc --noEmit`.             |
| `npm run test:unit`                      | Runs the Vitest unit suite.                              |
| `npm run test:e2e`                       | Runs the Playwright end-to-end suite.                    |
| `npm run test:e2e -- --update-snapshots` | Regenerates end-to-end snapshots for the local platform. |

**Guidelines:**

- MUST run `npm run format` and `npm run lint` after code or documentation edits.
- MUST run `npm run test:unit` after a change affects code it covers.
- MUST run `npm run test:e2e` after a change affects a UI output surface or e2e coverage.
- MUST NOT use snapshot updates to hide unexpected visual regressions; pair each snapshot update with a reason the visual change is intentional.
- SHOULD report skipped quality commands, including the reason and residual risk, before completion.
