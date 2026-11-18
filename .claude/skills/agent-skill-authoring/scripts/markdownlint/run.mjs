import fs from "node:fs";
import { basename, posix, sep } from "node:path";

import { main } from "markdownlint-cli2";
import { lint } from "markdownlint-cli2/markdownlint/promise";

import { createConfiguration } from "./rules.mjs";

/** hide automatic configuration discovery; explicit snapshots never fall back to disk content. */
function protectedFilesystem() {
  return {
    ...fs,
    promises: {
      ...fs.promises,
      async access(path, ...args) {
        if (/^\.markdownlint(?:-cli2)?\.(?:jsonc?|ya?ml|[cm]js)$/.test(basename(path))) {
          throw Object.assign(new Error("Configuration discovery disabled"), { code: "ENOENT" });
        }
        return fs.promises.access(path, ...args);
      },
    },
  };
}

/**
 * execute standard and protected custom checks against one explicit snapshot set.
 * exits: 0 including advisories, 1 for violations, 2 for infrastructure/coverage failure.
 * additional custom rules and ruleConfig extend execution; mandatory AS001/AS010 stay enabled at error severity.
 * @returns {Promise<{code:number, scope:string, roots:string[], documents:string[], rules:string[], findings:object[], failures:string[]}>}
 */
export async function runValidation(context, { standardConfig = { default: true }, additionalRules = [], ruleConfig = {}, rules: selectedRules } = {}) {
  const findings = [];
  const failures = [];
  let documents = [];
  let ruleIds = [];
  const partial = Boolean(context?.partial || selectedRules);
  try {
    if (!standardConfig || typeof standardConfig !== "object" || Array.isArray(standardConfig)) {
      throw new Error("Standard configuration must be a JSON rule object");
    }
    if (!(context?.documents instanceof Map)) throw new Error("Missing or invalid source context");
    documents = [...context.documents.keys()];
    if (!documents.length) throw new Error("Missing or empty source context");
    for (const [path, document] of context.documents) {
      if (document.path !== path || typeof document.raw !== "string" || !["skill", "reference", "markdown"].includes(document.kind)) {
        throw new Error(`Invalid source context: ${path}`);
      }
    }
    const strings = Object.fromEntries(documents.map((path) => [path, context.documents.get(path).raw]));
    const standard = await lint({ strings, config: standardConfig, handleRuleFailures: false });
    if (Object.keys(standard).length !== documents.length || documents.some((path) => !Object.hasOwn(standard, path))) {
      throw new Error("Standard-rule document coverage gap");
    }
    for (const [path, errors] of Object.entries(standard)) {
      for (const error of errors) findings.push({ path, ...error });
    }
    const directory = process.cwd();
    const identities = new Map(documents.map((path) => [path.split(sep).join("/"), path]));
    const formatterIdentities = new Map([...identities].map(([name, path]) => [posix.relative(directory.split(sep).join("/"), name), path]));
    const options = createConfiguration(context);
    const available = [...options.customRules, ...additionalRules];
    ruleIds = available.map((rule) => rule.names[0]);
    if (new Set(ruleIds).size !== ruleIds.length) throw new Error("Duplicate custom rule identity");
    if (selectedRules) {
      if (!selectedRules.length || selectedRules.some((id) => !ruleIds.includes(id))) throw new Error("Empty or unavailable custom rule selection");
      ruleIds = [...new Set(selectedRules)];
    }
    const completed = new Set();
    options.customRules = available.filter((rule) => ruleIds.includes(rule.names[0])).map((rule) => ({
      ...rule,
      asynchronous: true,
      async function(params, onError) {
        const name = identities.get(params.name);
        try {
          await rule.function({ ...params, name }, onError);
          completed.add(`${name}\0${rule.names[0]}`);
        } catch (error) {
          failures.push(`${rule.names[0]} runtime failure in ${name ?? params.name}: ${error?.message ?? error}`);
        }
      },
    }));
    options.config = {
      default: false,
      ...Object.fromEntries(ruleIds.map((id) => [id, ["AS001", "AS010"].includes(id) ? true : ruleConfig[id] ?? true])),
    };
    const diagnostics = [];
    const code = await main({
      directory, argv: [], noGlobs: true, noImport: true,
      fs: protectedFilesystem(), nonFileContents: Object.fromEntries([...identities].map(([name, path]) => [name, strings[path]])), optionsOverride: {
        ...options,
        outputFormatters: [[({ results }) => {
          for (const error of results) {
            const path = formatterIdentities.get(error.fileName);
            if (!path) throw new Error(`Custom-rule diagnostic identity gap: ${error.fileName}`);
            findings.push({ ...error, path });
          }
        }]],
      },
      logMessage() {}, logError(message) { diagnostics.push(message); },
    });
    if (code > 1) failures.push(`CLI2 execution failed: ${diagnostics.join("; ")}`);
    for (const path of documents) {
      for (const id of ruleIds) {
        if (!completed.has(`${path}\0${id}`)) failures.push(`Custom-rule coverage gap: ${path} ${id}`);
      }
    }
  } catch (error) {
    failures.push(`Validation infrastructure failure: ${error?.message ?? error}`);
  }
  return {
    code: failures.length ? 2 : findings.some((finding) => finding.severity !== "warning") ? 1 : 0,
    scope: partial ? "partial" : "W1-full", roots: context?.roots ?? [], documents, rules: ruleIds, findings, failures,
  };
}
