---
type: Convention
title: Directory structure
description: Module placement, import direction and route naming for the API and worker.
---

# Directory Structure

The API and worker are the two deployable **Packages**. Each runs in its own
environment. This convention governs the modules each package contains or imports.

The general discipline — put shared logic at the lowest tier with more than one
caller, name a file for what it holds — belongs to the installed code-maintainability
capability. What follows is this repository's own tiers and paths, which nothing
outside it could infer.

## The Tree

```text
<root>
├── api/                       # the API package: creates jobs, serves the dashboard
│   ├── routes/<route>/
│   │   ├── _components/       # used by this route only
│   │   └── handler.ts
│   └── _/                     # feature-agnostic modules shared across routes
├── worker/                    # the worker package: claims jobs, runs attempts
└── shared/                    # the few modules both packages import
```

## Tiers

A module sits at the lowest tier that has more than one caller, and MUST NOT be
promoted in anticipation of a second — a module promoted early is one every package
pays to read while one of them uses it.

`shared/` MUST stay deliberate. A module there is imported by two deployables that
run in separate processes, so a change to it changes both at once. It belongs there only
when both packages need the same _behaviour_, never merely the same shape.

The import direction is one-way: `api/` and `worker/` MAY import `shared/`; `shared/`
MUST NOT import either, and the two packages MUST NOT import each other. Each
production package contains only its own modules and shared dependencies. A
cross-package import can compile in the checkout and fail in the deployed process.

## Naming

A file is named for what it holds, in kebab-case; a directory, for the thing its files
are about. A route directory MUST match the URL segment it serves — the router derives
one from the other, so a mismatch is a 404 nobody can see in review.

`_`-prefixed directories are not routed. Anything under `routes/` without the prefix
becomes a URL, so a helper dropped there unprefixed is published.
