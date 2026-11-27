#!/usr/bin/env node
// vocabulary correspondence: every behavioural domain has somewhere to define
// its words.
//
// the correspondence runs one way on purpose. a spec needs a heading, because a
// domain whose terms are undefined is where a glossary silently stops being the
// place vocabulary lives. a heading needs no spec: cross-cutting vocabulary
// belongs to no single domain, and a domain can be named before its behaviour is
// written down. checking the other direction would need an exception list for
// both, and an exception list is where a rule goes to be ignored.

import { main, selfName, siblingHelp } from "./docs.mjs";

import { checkGlossary } from "./navigation.mjs";

const USAGE = `Usage: ${selfName(import.meta.url)} [<docs-dir>]

In a legacy layout, check that every spec under a project's docs has a matching heading in
glossary.md. Run it after adding or renaming a spec, or after editing the
glossary.

A specs/<domain>.md file pairs with a "## <Domain>" heading, compared on a
slug so "## Job Templates" pairs with job-templates.md. The reverse is not
required: a heading may define cross-cutting vocabulary that no single spec
owns. Defaults to ./docs.

Exit codes: 0 every spec has a heading, or the project has no docs, or no specs/.
            1 findings. 2 bad invocation.
${siblingHelp(selfName(import.meta.url))}`;

process.exitCode = await main({
  usage: USAGE,
  run: checkGlossary,
  pass: (docs) => {
    if (docs.okf)
      return "OKF concepts do not require matching glossary headings.";
    const count = docs.documents.filter((doc) =>
      doc.relative.startsWith("specs/"),
    ).length;
    return count
      ? `Every spec has a heading in glossary.md (${count} checked).`
      : "No specs/ entries. Nothing to check.";
  },
});
