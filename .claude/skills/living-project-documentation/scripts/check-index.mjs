#!/usr/bin/env node
import { main, selfName, siblingHelp } from "./docs.mjs";

import { checkIndex } from "./navigation.mjs";

const usage = `Usage: ${selfName(import.meta.url)} [--evidence <bundle-relative-file.md>]... [<docs-dir>]

Check direct listings in legacy docs and root-to-page routes through indexes in
OKF bundles. Require a nonempty concept type except for index.md, log.md and
exact untyped evidence paths. Each evidence exception prints a warning.
Exit codes: 0 pass or no index, 1 findings, 2 bad invocation or read error.
${siblingHelp(selfName(import.meta.url))}`;

process.exitCode = await main({
  usage,
  allowEvidence: true,
  run: checkIndex,
  pass: (docs) =>
    `Every living page is reachable from the root index (${docs.documents.length} Markdown files).`,
});
