#!/usr/bin/env node
// orphan detection: a document nobody can reach.
//
// this command owns one direction only — is a file listed? whether a listed
// link resolves is check-references.mjs's question, so no defect is reported
// twice.

import { extractLinks, main, resolveLink, selfName, siblingHelp } from "./docs.mjs";

const USAGE = `Usage: ${selfName(import.meta.url)} [<docs-dir>]

Check that every document under a project's docs is listed in index.md. Run it
after adding or removing a document. Defaults to ./docs.

Exit codes: 0 every document is listed, or the project has no docs.
            1 findings. 2 bad invocation.
${siblingHelp(selfName(import.meta.url))}`;

function run(docs) {
  const index = docs.documents.find((doc) => doc.relative === "index.md");
  const linked = new Set(
    extractLinks(index.text).map(({ target }) => resolveLink(index.path, target)),
  );

  const findings = [];

  for (const doc of docs.documents) {
    if (doc.relative === "index.md") continue;
    if (!linked.has(doc.path)) {
      findings.push({
        category: "unindexed",
        message: `${doc.relative} is not linked from index.md`,
      });
    }
  }

  return findings;
}

process.exitCode = await main({
  usage: USAGE,
  argv: process.argv.slice(2),
  run,
  pass: (docs) => `Every document is listed in index.md (${docs.documents.length - 1} indexed).`,
});
