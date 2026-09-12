// Runs against the MIRROR working copy (cwd = the mirror dir), after rsync
// has already copied everything over. rsync's --exclude list only knows how
// to drop whole `registry/new-york/<slug>` folders — it can't reach into a
// single shared file and remove just the premium-keyed parts of it. Several
// files mix free and premium data together in exactly that way:
//
//   - src/lib/code-variants.ts   — alternate JS/CSS source per component
//   - src/lib/usage-examples.ts  — usage snippets per component
//   - src/lib/checkout-links.ts  — Lemon Squeezy links per component
//   - registry.json              — the registry manifest itself
//   - src/registry-preview/index.tsx — demo/preview JSX per component,
//     plus a static import of every component's registry folder
//
// This script strips the premium-keyed entries out of each one, then does
// two safety passes: it deletes any remaining source file that still
// imports a premium registry path (catches full pages built around a
// premium component, like a template preview), and finally re-scans
// everything and throws if a premium import survived. A thrown error here
// must stop the publish — never commit/push past it.
//
// Keep this in sync with whatever new shared, slug-keyed data files show up
// in src/lib or elsewhere: if a file's shape is "one entry per component"
// and it isn't under registry/new-york, assume it needs a filter here too.

import { readFileSync, writeFileSync, readdirSync, statSync, rmSync, existsSync } from "node:fs";
import path from "node:path";
import { components } from "../src/lib/catalog-data.ts";

const premiumSlugs = new Set(components.filter((c) => !c.free).map((c) => c.slug));

function read(p: string): string {
  return readFileSync(p, "utf8");
}
function write(p: string, content: string): void {
  writeFileSync(p, content, "utf8");
}

// --- low-level scanner shared by every stripper below -------------------
// Walks `content` from `start`, treating string/template literals and
// comments as opaque (their contents never affect bracket depth or get
// mistaken for structure), and tracks depth across (), {}, and [].
function skipOpaque(content: string, i: number): number | null {
  const c = content[i];
  if (c === '"' || c === "'" || c === "`") {
    let j = i + 1;
    while (j < content.length) {
      if (content[j] === "\\") {
        j += 2;
        continue;
      }
      if (content[j] === c) {
        j += 1;
        break;
      }
      j += 1;
    }
    return j;
  }
  if (c === "/" && content[i + 1] === "/") {
    const nl = content.indexOf("\n", i);
    return nl === -1 ? content.length : nl;
  }
  if (c === "/" && content[i + 1] === "*") {
    const end = content.indexOf("*/", i + 2);
    return end === -1 ? content.length : end + 2;
  }
  return null;
}

/** Index of the matching close bracket for the open bracket at openIdx. */
function findMatching(content: string, openIdx: number, openCh: string, closeCh: string): number {
  let depth = 0;
  let i = openIdx;
  while (i < content.length) {
    const skipTo = skipOpaque(content, i);
    if (skipTo !== null) {
      i = skipTo;
      continue;
    }
    const c = content[i];
    if (c === openCh) depth += 1;
    else if (c === closeCh) {
      depth -= 1;
      if (depth === 0) return i;
    }
    i += 1;
  }
  return -1;
}

/** From just after a `"slug":` key, find the index right after the entry's
 *  top-level trailing comma (tracks (), {}, [] together; opaque-aware). */
function findEntryEnd(content: string, start: number): number {
  let depth = 0;
  let i = start;
  while (i < content.length) {
    const skipTo = skipOpaque(content, i);
    if (skipTo !== null) {
      i = skipTo;
      continue;
    }
    const c = content[i];
    if (c === "(" || c === "{" || c === "[") depth += 1;
    else if (c === ")" || c === "}" || c === "]") depth -= 1;
    else if (c === "," && depth === 0) return i + 1;
    i += 1;
  }
  return content.length;
}

// Only backticks are opaque here (skipOpaque's generic "any quote char"
// rule would swallow each entry's own `"slug"` key before it can be read —
// the values are template literals; regular "..." / '...' never appear at
// the top level, only inside those backticks, which this already covers).
function skipTemplateLiteralOnly(content: string, i: number): number | null {
  if (content[i] !== "`") return null;
  let j = i + 1;
  while (j < content.length) {
    if (content[j] === "\\") {
      j += 2;
      continue;
    }
    if (content[j] === "`") {
      j += 1;
      break;
    }
    j += 1;
  }
  return j;
}

// --- code-variants.ts: `  "slug": { ... },` entries, values are template
// literals full of arbitrary component source (may contain `` ` `` chars
// escaped as `\``, and `${...}` interpolation — skipOpaque handles both). --
function stripCodeVariants(content: string): string {
  const marker = "export const codeVariants: Record<string, CodeVariantSet> = {";
  const objStart = content.indexOf(marker) + marker.length;
  if (objStart < marker.length) throw new Error("code-variants.ts: marker not found");

  const keyRe = /"([a-z0-9-]+)":\s*\{/;
  const spans: { start: number; end: number; slug: string }[] = [];
  let i = objStart;
  let depth = 1;
  let current: { start: number; slug: string } | null = null;

  while (i < content.length) {
    const skipTo = skipTemplateLiteralOnly(content, i);
    if (skipTo !== null) {
      i = skipTo;
      continue;
    }
    const c = content[i];
    if (c === "{") {
      depth += 1;
      i += 1;
      continue;
    }
    if (c === "}") {
      depth -= 1;
      if (depth === 0) break;
      if (depth === 1 && current) {
        let j = i + 1;
        while (j < content.length && (content[j] === " " || content[j] === "\t")) j += 1;
        if (content[j] === ",") j += 1;
        if (content[j] === "\n") j += 1;
        spans.push({ start: current.start, end: j, slug: current.slug });
        current = null;
        i = j;
        continue;
      }
      i += 1;
      continue;
    }
    if (depth === 1 && current === null && c === '"') {
      const lineStart = content.lastIndexOf("\n", i) + 1;
      if (content.slice(lineStart, i) === "  ") {
        const m = keyRe.exec(content.slice(i, i + 200));
        if (m) current = { start: lineStart, slug: m[1] };
      }
    }
    i += 1;
  }

  return removeSpans(content, spans);
}

// --- usage-examples.ts: `  "slug": `...`,` entries, values are template
// literals of a short usage snippet. ---------------------------------------
function stripUsageExamples(content: string): string {
  const keyRe = /^ {2}"([a-z0-9-]+)":\s*`/gm;
  const spans: { start: number; end: number; slug: string }[] = [];
  let m: RegExpExecArray | null;
  const starts: { start: number; slug: string }[] = [];
  while ((m = keyRe.exec(content))) {
    starts.push({ start: m.index, slug: m[1] });
  }
  for (let k = 0; k < starts.length; k++) {
    const { start, slug } = starts[k];
    const nextStart = k + 1 < starts.length ? starts[k + 1].start : content.length;
    spans.push({ start, end: nextStart, slug });
  }
  return removeSpans(content, spans);
}

// --- checkout-links.ts / any other flat `"slug": { ... },` data file ------
function stripFlatObjectEntries(content: string, marker: string): string {
  const objStart = content.indexOf(marker) + marker.length;
  if (objStart < marker.length) throw new Error(`stripFlatObjectEntries: marker not found: ${marker}`);
  const keyRe = /"([a-z0-9-]+)":\s*/;
  const spans: { start: number; end: number; slug: string }[] = [];
  let i = objStart;
  while (i < content.length) {
    while (i < content.length && /\s/.test(content[i])) i += 1;
    if (content[i] === "}") break;
    const m = keyRe.exec(content.slice(i, i + 200));
    if (!m) throw new Error(`stripFlatObjectEntries: unexpected content at ${i}: ${JSON.stringify(content.slice(i, i + 80))}`);
    const lineStart = content.lastIndexOf("\n", i) + 1;
    const slug = m[1];
    const valueStart = i + m[0].length;
    const end = findEntryEnd(content, valueStart);
    let j = end;
    while (j < content.length && (content[j] === " " || content[j] === "\t")) j += 1;
    if (content[j] === "\n") j += 1;
    spans.push({ start: lineStart, end: j, slug });
    i = j;
  }
  return removeSpans(content, spans);
}

function removeSpans(content: string, spans: { start: number; end: number; slug: string }[]): string {
  let out = "";
  let lastEnd = 0;
  for (const { start, end, slug } of spans) {
    if (premiumSlugs.has(slug)) {
      out += content.slice(lastEnd, start);
      lastEnd = end;
    }
  }
  out += content.slice(lastEnd);
  return out;
}

// --- registry-preview/index.tsx: import lines + two Record<slug, () => JSX>
// maps, plus a cleanup pass for now-orphaned local helper definitions. -----
function stripRegistryPreview(content: string): string {
  // 1. Drop `import { X } from "../../registry/new-york/<premium-slug>/...";`
  const importRe = /^import .+ from "\.\.\/\.\.\/registry\/new-york\/([a-z0-9-]+)\/[a-z0-9-]+";$/;
  content = content
    .split("\n")
    .filter((line) => {
      const m = importRe.exec(line);
      return !(m && premiumSlugs.has(m[1]));
    })
    .join("\n");

  // 2. Strip premium entries from both preview maps.
  for (const marker of [
    "export const registryPreviews: Record<string, () => React.ReactNode> = {",
    "export const registryPlaygroundPreviews: Partial<Record<string, () => React.ReactNode>> = {",
  ]) {
    const i0 = content.indexOf(marker);
    if (i0 === -1) continue; // tolerate either map moving/renaming later
    const objStart = i0 + marker.length;
    const keyRe = /"([a-z0-9-]+)":\s*/;
    const spans: { start: number; end: number; slug: string }[] = [];
    let i = objStart;
    while (i < content.length) {
      while (i < content.length && /\s/.test(content[i])) i += 1;
      if (content[i] === "}") break;
      const m = keyRe.exec(content.slice(i, i + 200));
      if (!m) throw new Error(`registry-preview: unexpected content at ${i}: ${JSON.stringify(content.slice(i, i + 80))}`);
      const lineStart = content.lastIndexOf("\n", i) + 1;
      const slug = m[1];
      const valueStart = i + m[0].length;
      const end = findEntryEnd(content, valueStart);
      let j = end;
      while (j < content.length && (content[j] === " " || content[j] === "\t")) j += 1;
      if (content[j] === "\n") j += 1;
      spans.push({ start: lineStart, end: j, slug });
      i = j;
    }
    content = removeSpans(content, spans);
  }

  // 3. Fixed-point cleanup: a premium-only entry may have been the sole
  // caller of a local helper component/constant defined in this same file
  // (e.g. a decorative "Showcase" wrapper). Repeat until nothing more to
  // remove, so removing one orphan can reveal the next.
  let changed = true;
  while (changed) {
    changed = false;
    const defRe = /^(?:function ([A-Z][A-Za-z0-9]*)\(|const ([A-Z][A-Za-z0-9]*)[:\s=])/gm;
    let m: RegExpExecArray | null;
    while ((m = defRe.exec(content))) {
      const name = m[1] ?? m[2];
      const occurrences = (content.match(new RegExp(`\\b${name}\\b`, "g")) ?? []).length;
      if (occurrences > 1) continue; // still referenced somewhere

      // Found an orphan. Remove its full definition (plus an immediately
      // preceding line-comment block, if any) and restart the scan.
      const defLineStart = content.lastIndexOf("\n", m.index) + 1;
      let removalStart = defLineStart;
      // walk upward absorbing a contiguous block of `//` comment lines
      while (true) {
        const prevLineEnd = removalStart - 1;
        if (prevLineEnd < 0) break;
        const prevLineStart = content.lastIndexOf("\n", prevLineEnd - 1) + 1;
        const prevLine = content.slice(prevLineStart, prevLineEnd);
        if (/^\s*\/\//.test(prevLine)) removalStart = prevLineStart;
        else break;
      }

      const isFunction = m[1] !== undefined;
      let removalEnd: number;
      if (isFunction) {
        // The function's own parameter list may destructure an object
        // (`{ a, b }`) or carry an inline type (`: { a: string }`), both of
        // which contain braces that come *before* the real body — so the
        // body's `{` is whatever follows the parameter list's matching `)`,
        // not just the first `{` after the function name.
        const parenIdx = content.indexOf("(", m.index);
        const closeParen = findMatching(content, parenIdx, "(", ")");
        const braceIdx = content.indexOf("{", closeParen);
        const closeBrace = findMatching(content, braceIdx, "{", "}");
        removalEnd = closeBrace + 1;
      } else {
        // const NAME = <value>; — value is an array/object/expression
        // ending at the first top-level `;` (opaque-aware).
        const eqIdx = content.indexOf("=", m.index) + 1;
        let j = eqIdx;
        let depth = 0;
        while (j < content.length) {
          const skipTo = skipOpaque(content, j);
          if (skipTo !== null) {
            j = skipTo;
            continue;
          }
          const c = content[j];
          if (c === "(" || c === "{" || c === "[") depth += 1;
          else if (c === ")" || c === "}" || c === "]") depth -= 1;
          else if (c === ";" && depth === 0) break;
          j += 1;
        }
        removalEnd = j + 1;
      }
      if (content[removalEnd] === "\n") removalEnd += 1;

      content = content.slice(0, removalStart) + content.slice(removalEnd);
      changed = true;
      break; // restart the outer while(changed) loop with fresh indices
    }
  }

  return content;
}

// --- registry.json: prune premium items from the manifest itself ----------
function stripRegistryJson(content: string): string {
  const data = JSON.parse(content);
  data.items = data.items.filter((item: { name: string }) => !premiumSlugs.has(item.name));
  return JSON.stringify(data, null, 2) + "\n";
}

// --- last-resort safety net: delete any remaining source file that still
// imports a premium registry path (catches whole pages built around one,
// e.g. a template preview), wherever in the tree it lives. -----------------
function deleteFilesImportingPremium(root: string): string[] {
  const premiumImportRe = /from\s+["'].*\/registry\/new-york\/([a-z0-9-]+)\/[a-z0-9-]+["']/;
  const deleted: string[] = [];

  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      if (entry === "node_modules" || entry === ".git" || entry === ".next") continue;
      const full = path.join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(tsx?|jsx?)$/.test(entry)) continue;
      const text = read(full);
      for (const line of text.split("\n")) {
        const m = premiumImportRe.exec(line);
        if (m && premiumSlugs.has(m[1])) {
          rmSync(full);
          deleted.push(path.relative(root, full));
          break;
        }
      }
    }
  }

  walk(root);
  return deleted;
}

/** Hard gate: throw if anything under root still imports a premium registry
 *  path. Call this last — a thrown error here must abort the publish. */
function assertNoPremiumImportsRemain(root: string): void {
  const premiumImportRe = /from\s+["'].*\/registry\/new-york\/([a-z0-9-]+)\/[a-z0-9-]+["']/;
  const offenders: string[] = [];

  function walk(dir: string) {
    for (const entry of readdirSync(dir)) {
      if (entry === "node_modules" || entry === ".git" || entry === ".next") continue;
      const full = path.join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(tsx?|jsx?)$/.test(entry)) continue;
      const text = read(full);
      for (const line of text.split("\n")) {
        const m = premiumImportRe.exec(line);
        if (m && premiumSlugs.has(m[1])) offenders.push(`${path.relative(root, full)}: ${line.trim()}`);
      }
    }
  }

  walk(root);
  if (offenders.length > 0) {
    throw new Error(
      "Premium registry imports survived the filter — aborting before commit/push:\n" + offenders.map((o) => `  ${o}`).join("\n"),
    );
  }
}

// --- also make sure premium registry folders themselves are gone (belt +
// braces alongside rsync's own --exclude list). ----------------------------
function deletePremiumRegistryFolders(root: string): string[] {
  const dir = path.join(root, "registry", "new-york");
  if (!existsSync(dir)) return [];
  const deleted: string[] = [];
  for (const slug of readdirSync(dir)) {
    if (premiumSlugs.has(slug)) {
      rmSync(path.join(dir, slug), { recursive: true, force: true });
      deleted.push(slug);
    }
  }
  return deleted;
}

// --- run --------------------------------------------------------------
const root = process.cwd();
console.log(`- Stripping premium data from shared files (${premiumSlugs.size} premium slugs)...`);

const leftoverFolders = deletePremiumRegistryFolders(root);
if (leftoverFolders.length) console.log(`  - removed ${leftoverFolders.length} premium registry/new-york folder(s) rsync missed`);

const codeVariantsPath = path.join(root, "src/lib/code-variants.ts");
write(codeVariantsPath, stripCodeVariants(read(codeVariantsPath)));
console.log("  - filtered src/lib/code-variants.ts");

const usageExamplesPath = path.join(root, "src/lib/usage-examples.ts");
write(usageExamplesPath, stripUsageExamples(read(usageExamplesPath)));
console.log("  - filtered src/lib/usage-examples.ts");

const checkoutLinksPath = path.join(root, "src/lib/checkout-links.ts");
{
  const before = read(checkoutLinksPath);
  const marker = "export const checkoutLinks: Record<string, CheckoutLink> = {";
  write(checkoutLinksPath, before.includes(marker) ? stripFlatObjectEntries(before, marker) : before);
  console.log("  - filtered src/lib/checkout-links.ts");
}

const registryJsonPath = path.join(root, "registry.json");
write(registryJsonPath, stripRegistryJson(read(registryJsonPath)));
console.log("  - filtered registry.json");

const registryPreviewPath = path.join(root, "src/registry-preview/index.tsx");
write(registryPreviewPath, stripRegistryPreview(read(registryPreviewPath)));
console.log("  - filtered src/registry-preview/index.tsx");

const deletedPages = deleteFilesImportingPremium(root);
if (deletedPages.length) {
  console.log(`  - deleted ${deletedPages.length} file(s) that directly imported a premium component:`);
  for (const f of deletedPages) console.log(`      ${f}`);
}

assertNoPremiumImportsRemain(root);
console.log("- No premium registry imports remain. Safe to commit.");
