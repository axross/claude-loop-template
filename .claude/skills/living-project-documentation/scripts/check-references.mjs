#!/usr/bin/env node
import { main, selfName, siblingHelp } from "./docs.mjs";

import { checkReferences } from "./navigation.mjs";

const usage = `Usage: ${selfName(import.meta.url)} [--source-root <checkout>] [<docs-dir>]

Check relative links in Markdown, images and OKF path fields. In an OKF bundle, check Markdown
heading fragments and resolve / from the bundle root. With --source-root, authored links
may also reach local files in the containing checkout. Standalone exports use source URLs.
Exit codes: 0 pass or no index, 1 findings, 2 bad invocation or read error.
${siblingHelp(selfName(import.meta.url))}`;

process.exitCode = await main({
  usage,
  allowSourceRoot: true,
  run: (docs, _evidence, sourceRoot) => checkReferences(docs, sourceRoot),
  pass: (docs) =>
    `Every relative link resolves across ${docs.documents.length} documents.`,
});
