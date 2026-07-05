# todo-app

A minimal todo web app: create, complete, and delete todos, persisted in the
browser's localStorage. No backend, no accounts — client-side state only.

Built with Next.js 16 (App Router), React 19, and TypeScript. Hosted on Vercel.

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
```

## Commands

| Command             | Purpose                         |
| ------------------- | ------------------------------- |
| `npm run dev`       | Start the development server    |
| `npm run build`     | Production build                |
| `npm run start`     | Serve the production build      |
| `npm run format`    | Format with Prettier            |
| `npm run lint`      | Lint with ESLint                |
| `npm run typecheck` | Type-check with `tsc --noEmit`  |
| `npm run test:unit` | Run Vitest unit tests           |
| `npm run test:e2e`  | Run Playwright end-to-end tests |

## Repository guide

- `app/` — routes and route-local components (App Router).
- `lib/` — shared, UI-free modules (the localStorage-backed todo store) with
  colocated unit tests.
- `e2e/tests/` — Playwright suites, purpose-based (`smoke`, `happy-path`).
- `AGENTS.md` — the working agreement and skill index for coding agents;
  `.claude/skills/` holds the detailed project skills.
- `REVIEW.md` — the posted-review policy used by the CI reviewer
  (`.github/workflows/claude-review.yaml`) and the `/review` command.
