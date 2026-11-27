import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";
import { resolveLink, slug } from "./docs.mjs";

/** return a parsed nonempty YAML 1.2 type. */
export function declaredType(doc) {
  if (doc?.metadataError) return;
  const type = doc?.meta?.get("type");
  if (typeof type === "string" && type.trim()) return type;
}

/** review shared content once, preferring its canonical living-page name when available. */
export function reviewPages(docs) {
  const pages = new Map();
  for (const doc of docs.documents) {
    if (doc.markerKey !== "type" || !declaredType(doc)) continue;
    if (doc.path === doc.canonical || !pages.has(doc.canonical))
      pages.set(doc.canonical, doc);
  }
  return pages.values();
}

/**
 * retain a link's location when permissions prevent a whole-root inspection.
 * @throws for other errors or for focused commands that stop at the first read failure.
 */
function recordLinkReadError(docs, doc, link, error) {
  if (!docs.readErrors || !["EACCES", "EPERM"].includes(error.code))
    throw error;
  docs.readErrors.add(
    `${doc.relative}:${link.line} → ${link.target}: ${error.message}`,
  );
}

/**
 * resolve one navigation edge without losing unrelated routes after a denied read.
 * @throws for filesystem errors outside the whole-root permission recovery.
 */
async function linkedPage(docs, doc, link) {
  try {
    return (await resolveLink(docs, doc, link.target)).page;
  } catch (error) {
    recordLinkReadError(docs, doc, link, error);
  }
}

/**
 * follow index routes and include named evidence cited by reachable companions.
 * @throws on unexpected filesystem errors while resolving a route.
 */
async function reachable(docs, evidence) {
  const reached = new Set([docs.index.canonical]);
  const visited = new Set([docs.index.path]);
  const pending = [docs.index];
  while (pending.length) {
    const index = pending.pop();
    for (const link of index.links) {
      if (link.html || link.image || link.field) continue;
      const doc = await linkedPage(docs, index, link);
      if (!doc || visited.has(doc.path)) continue;
      visited.add(doc.path);
      reached.add(doc.canonical);
      if (docs.okf && basename(doc.path) === "index.md") pending.push(doc);
    }
  }
  // a named source is discoverable through its indexed companion.
  if (docs.okf && evidence.size) {
    for (const page of docs.documents) {
      if (
        !visited.has(page.path) ||
        page.markerKey !== "type" ||
        !page.meta?.has("type")
      )
        continue;
      for (const link of page.links) {
        if (
          link.html ||
          link.image ||
          (link.field && !link.field.startsWith("sources."))
        )
          continue;
        const source = await linkedPage(docs, page, link);
        if (source && evidence.has(source.relative))
          reached.add(source.canonical);
      }
    }
  }
  return reached;
}

/**
 * report unreachable pages and metadata findings, honoring exact evidence exceptions.
 * @throws if the bundle's navigation cannot be inspected.
 */
export async function checkIndex(docs, evidence, upstreamUntyped = []) {
  const reached = docs.index ? await reachable(docs, evidence) : undefined;
  const findings = [];
  if (!docs.index && docs.populated)
    findings.push({
      category: "index",
      message: "index.md is missing from the populated documentation root",
    });
  const unused = new Set(evidence);
  const unaccounted = new Set(upstreamUntyped);
  for (const doc of docs.documents) {
    if (
      reached &&
      !reached.has(doc.canonical) &&
      !(docs.okf && basename(doc.path) === "log.md")
    ) {
      findings.push({
        category: "unindexed",
        message: `${doc.relative} is not linked from index.md`,
      });
    }
    if (!docs.okf) continue;
    if (doc.metadataError)
      findings.push({
        category: "frontmatter",
        message: `${doc.relative}: ${doc.metadataError}`,
      });
    if (doc.markerKey !== "type") continue;
    unaccounted.delete(doc.relative);
    if (declaredType(doc)) continue;
    if (!doc.meta?.has("type") && unused.delete(doc.relative)) {
      console.log(`WARN  ${doc.relative}: named untyped evidence`);
    } else {
      findings.push({
        category: "type",
        message: `${doc.relative} needs a nonempty string type`,
      });
    }
  }
  for (const name of unaccounted)
    findings.push({
      category: "type",
      message: `${name} received W120 and could not be checked as a visible living page`,
    });
  for (const name of unused)
    findings.push({
      category: "evidence",
      message: `${name} does not name an untyped evidence document`,
    });
  return findings;
}

/**
 * report unresolved local destinations with their source line and field.
 * @throws if a destination cannot be inspected due to a filesystem error.
 */
export async function checkReferences(docs, sourceRoot) {
  const findings = [];
  const sourceAnchors = new Map();

  for (const doc of docs.documents) {
    for (const link of doc.links) {
      try {
        const { target, line, field } = link;
        let { path, page, fragment, error, sourceLink } = link.error
          ? link
          : await resolveLink(
              docs,
              doc,
              target,
              field ? undefined : sourceRoot,
            );
        if (!error && sourceLink && link.image)
          error = "is an embedded image outside the bundle";
        if (!error && field === "license" && !(await stat(path)).isFile())
          error = "does not resolve to a license file";
        if (
          !error &&
          docs.okf &&
          fragment &&
          (page || path.toLowerCase().endsWith(".md"))
        ) {
          let anchors = page?.anchors;
          if (!anchors && sourceLink && (await stat(path)).isFile()) {
            if (!sourceAnchors.has(path)) {
              const { readMarkdown } = await import("./okf.mjs");
              const text = await readFile(path, "utf8");
              sourceAnchors.set(path, readMarkdown(text).anchors);
            }
            anchors = sourceAnchors.get(path);
          }
          if (!anchors?.has(fragment)) error = "has no matching fragment";
        }
        if (error)
          findings.push({
            category: field ?? "link",
            message: `${doc.relative}:${line} → ${target} ${error}`,
          });
      } catch (error) {
        recordLinkReadError(docs, doc, link, error);
      }
    }
  }
  return findings;
}

/** report legacy domains missing their single glossary heading. */
export function checkGlossary(docs) {
  if (docs.hasMarker) return [];
  const specs = docs.documents.filter((doc) =>
    doc.relative.startsWith("specs/"),
  );
  if (specs.length === 0) return [];

  const glossary = docs.documents.find((doc) => doc.relative === "glossary.md");
  if (!glossary) {
    return [
      {
        category: "glossary",
        message: `glossary.md is missing, so none of the ${specs.length} spec(s) has anywhere to define its terms`,
      },
    ];
  }

  const headings = new Set(
    glossary.headings
      .filter(({ level }) => level === 2)
      .map(({ text }) => slug(text)),
  );
  const findings = [];

  for (const spec of specs) {
    const stem = spec.relative.slice("specs/".length, -".md".length);
    if (stem.includes("/")) {
      findings.push({
        category: "nested",
        message: `${spec.relative} is nested; specs/ is flat so one domain maps to one heading`,
      });
      continue;
    }
    if (!headings.has(slug(stem))) {
      findings.push({
        category: "glossary",
        message: `${spec.relative} has no matching heading in glossary.md`,
      });
    }
  }

  return findings;
}
