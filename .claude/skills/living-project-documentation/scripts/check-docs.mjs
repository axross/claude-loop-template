#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, realpath } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { loadDocs } from "./docs.mjs";
import {
  checkGlossary,
  checkIndex,
  checkReferences,
  declaredType,
  reviewPages,
} from "./navigation.mjs";

const usage = `Usage: check-docs.mjs --validator <validate.py> [--source-root <checkout>] [--evidence <file.md>]... [<docs-dir>]

Check OKF v0.3 format and engineering documentation, including untyped and
indexless trees. Defaults to ./docs. Each evidence path is bundle-relative.
Install the pinned validator, python3, PyYAML and the Node parsers as described
in references/validators.md. Exit 0 for a structural pass, 1 for required
findings, or 2 for incomplete checks or a bad invocation.`;

const validatorDigest =
  "7f92df7d6a2118a5b7e5c388aa97de48f6ad31b942abc9e2fc7d344830661f49";
const reviewRule =
  "references/documentation-structure.md#review-the-declared-type";

/**
 * run the pinned validator on the original tree and retain all diagnostic levels.
 * @throws if the script, Python dependencies or JSON report are unavailable.
 */
async function checkFormat(validator, root) {
  const script = await readFile(validator);
  if (createHash("sha256").update(script).digest("hex") !== validatorDigest)
    throw new Error(
      `${validator} does not match the pinned validator SHA-256 (${validatorDigest})`,
    );

  // pass the verified bytes to Python so reopening the path cannot select another script.
  const result = spawnSync("python3", ["-I", "-B", "-", "--json", root], {
    input: script,
    encoding: "utf8",
    maxBuffer: Infinity,
  });
  if (result.error) throw result.error;
  if (![0, 1].includes(result.status) || !result.stdout.trim())
    throw new Error(
      result.stderr.trim() ||
        `python3 ended with ${result.signal ?? result.status} without a report`,
    );
  const { findings, errors } = JSON.parse(result.stdout);
  if (
    !Array.isArray(findings) ||
    errors !== findings.filter(({ level }) => level === "error").length ||
    result.status !== (errors ? 1 : 0)
  )
    throw new Error("inconsistent JSON report from the pinned validator");
  return findings;
}

/**
 * report required failures, recommendations and outstanding editorial reviews.
 * @throws for an invalid invocation or an incomplete local check.
 */
async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      help: { type: "boolean", short: "h" },
      validator: { type: "string" },
      "source-root": { type: "string" },
      evidence: { type: "string", multiple: true },
    },
  });
  if (values.help) {
    console.log(usage);
    return 0;
  }
  if (!values.validator || positionals.length > 1) throw new Error(usage);
  const root = resolve(positionals[0] ?? "docs");
  const evidence = new Set(values.evidence);
  let incomplete = false;
  let failed = false;
  const upstreamUntyped = [];

  try {
    const findings = await checkFormat(values.validator, root);
    for (const { level, code, path, line, message } of findings) {
      if (level === "warning" && code === "W120") upstreamUntyped.push(path);
      const namedEvidence =
        level === "warning" && code === "W120" && evidence.has(path);
      console.log(
        `OKF ${level.toUpperCase()} ${code} ${path}${line ? ":" + line : ""}: ${message}${namedEvidence ? " (named evidence)" : ""}`,
      );
      if (level === "error") failed = true;
    }
  } catch (error) {
    console.error(`Could not complete OKF validation: ${error.message}`);
    incomplete = true;
  }

  console.log(`Editorial type review: ${reviewRule}`);
  const sourceRoot =
    values["source-root"] && (await realpath(values["source-root"]));
  const docs = await loadDocs(root, sourceRoot, { wholeRoot: true });
  for (const doc of reviewPages(docs))
    console.log(
      `REVIEW ${doc.relative} — ${JSON.stringify(declaredType(doc))}`,
    );
  const findings = [
    ...(await checkIndex(docs, evidence, upstreamUntyped)),
    ...(await checkReferences(docs, sourceRoot)),
    ...checkGlossary(docs),
  ];
  for (const { category, message } of findings)
    console.log(`ENGINEERING ${category}: ${message}`);
  for (const error of docs.readErrors)
    console.error(`Could not inspect ${error}`);
  if (incomplete || docs.readErrors.size) return 2;
  if (failed || findings.length) {
    console.log(`FAIL  ${root}`);
    return 1;
  }
  console.log(`PASS  ${root} (${docs.documents.length} Markdown paths)`);
  return 0;
}

try {
  process.exitCode = await main();
} catch (error) {
  console.error(
    `Could not complete documentation validation: ${error.message}`,
  );
  process.exitCode = 2;
}
