#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";

const HELP = `agent-skill-markdownlint --skill DIR | --collection DIR [options]
  --skill DIR         individual skill directory (repeatable)
  --collection DIR    every immediate skill directory (repeatable)
  --file FILE         focused documents; unrelated Markdown gets standard rules only
  --rule ID           focused custom rule IDs (repeatable; marks validation partial)
  --config FILE       explicit JSON standard-rule configuration; no automatic inheritance
  --help              show usage
Exits: 0 including advisories; 1 violations; 2 input/config/runtime/coverage failure.
W1-full covers AS001/AS010 and standard checks, not all skill structure requirements.
`;

try {
  const { values } = parseArgs({ options: {
    skill: { type: "string", multiple: true }, collection: { type: "string", multiple: true },
    file: { type: "string", multiple: true }, rule: { type: "string", multiple: true },
    config: { type: "string" }, help: { type: "boolean" },
  } });
  if (values.help) process.stdout.write(HELP);
  else {
    const { createContext } = await import("./context.mjs");
    const { runValidation } = await import("./run.mjs");
    const standardConfig = values.config ? JSON.parse(await readFile(values.config, "utf8")) : undefined;
    const context = await createContext({ skills: values.skill, collections: values.collection, files: values.file });
    const result = await runValidation(context, { standardConfig, rules: values.rule });
    for (const finding of result.findings) {
      process.stdout.write(`${finding.path}:${finding.lineNumber} ${finding.severity ?? "error"} ${finding.ruleNames.join("/")} ${finding.errorDetail ?? finding.ruleDescription}\n`);
    }
    for (const failure of result.failures) process.stderr.write(`${failure}\n`);
    if (result.code !== 2) {
      process.stdout.write(`${result.scope}: ${result.documents.length} document(s); roots ${JSON.stringify(result.roots)}; rules ${result.rules.join(", ")}; exit ${result.code}\n`);
      for (const path of result.documents) process.stdout.write(`Checked: ${path}\n`);
    }
    process.exitCode = result.code;
  }
} catch (error) {
  process.stderr.write(`Validation infrastructure failure: ${error.message ?? error}\n`);
  process.exitCode = 2;
}
