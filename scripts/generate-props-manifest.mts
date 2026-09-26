// Extracts every catalog component's public props (name, type, default, required, JSDoc) from its
// registry source into src/lib/props-manifest.json, for the "Props" table on each detail page:
//   npm run props
// Re-run after changing a component's props interface.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

type PropRow = { name: string; type: string; default?: string; required: boolean; description?: string };
// `element`: the HTML tag whose native attributes the component also forwards (from `extends ComponentPropsWithoutRef<"div">`).
type Entry = { component: string; element?: string; props: PropRow[] };

const root = process.cwd();
const catalog = fs.readFileSync(path.join(root, "src/lib/catalog-data.ts"), "utf8");
const slugs = [...catalog.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]);
const usage = fs.readFileSync(path.join(root, "src/lib/usage-examples.ts"), "utf8");

const MAX_DEFAULT = 90;
const clean = (text: string) => text.replace(/\s+/g, " ").trim();

function docOf(node: ts.Node, sf: ts.SourceFile): string | undefined {
  const ranges = ts.getLeadingCommentRanges(sf.text, node.pos) ?? [];
  const text = ranges
    .map((r) => sf.text.slice(r.pos, r.end))
    .filter((c) => c.startsWith("/**") || c.startsWith("//"))
    .map((c) =>
      c
        .replace(/^\/\*\*|\*\/$/g, "")
        .split("\n")
        .map((l) => l.replace(/^\s*(\*|\/\/)\s?/, ""))
        .join(" "),
    )
    .join(" ");
  const out = clean(text.replace(/@\w+.*/g, ""));
  return out || undefined;
}

// The component a user imports, per the usage example ("import { Button } from ...").
function mainComponentName(slug: string, sf: ts.SourceFile): string | undefined {
  const block = usage.match(new RegExp(`^  "${slug}": \`import \\{ ([A-Za-z0-9_]+)`, "m"));
  if (block) return block[1];
  const pascal = slug.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());
  let first: string | undefined;
  let exact: string | undefined;
  sf.forEachChild((n) => {
    if (ts.isFunctionDeclaration(n) && n.name && ts.getCombinedModifierFlags(n) & ts.ModifierFlags.Export && /^[A-Z]/.test(n.name.text)) {
      first ??= n.name.text;
      if (n.name.text.toLowerCase() === pascal.toLowerCase()) exact = n.name.text;
    }
  });
  return exact ?? first;
}

function findFunction(name: string, sf: ts.SourceFile): ts.FunctionLikeDeclaration | undefined {
  let found: ts.FunctionLikeDeclaration | undefined;
  sf.forEachChild((n) => {
    if (ts.isFunctionDeclaration(n) && n.name?.text === name) found = n;
    if (ts.isVariableStatement(n))
      for (const d of n.declarationList.declarations)
        if (ts.isIdentifier(d.name) && d.name.text === name && d.initializer && (ts.isArrowFunction(d.initializer) || ts.isFunctionExpression(d.initializer))) found = d.initializer;
  });
  return found;
}

function propsTypeName(fn: ts.FunctionLikeDeclaration): string | undefined {
  const t = fn.parameters[0]?.type;
  return t && ts.isTypeReferenceNode(t) ? t.typeName.getText() : undefined;
}

function findTypeDecl(name: string, sf: ts.SourceFile): ts.InterfaceDeclaration | ts.TypeAliasDeclaration | undefined {
  let found: ts.InterfaceDeclaration | ts.TypeAliasDeclaration | undefined;
  sf.forEachChild((n) => {
    if ((ts.isInterfaceDeclaration(n) || ts.isTypeAliasDeclaration(n)) && n.name.text === name) found = n;
  });
  return found;
}

function membersOf(decl: ts.InterfaceDeclaration | ts.TypeAliasDeclaration): ts.NodeArray<ts.TypeElement> | undefined {
  if (ts.isInterfaceDeclaration(decl)) return decl.members;
  if (ts.isTypeLiteralNode(decl.type)) return decl.type.members;
  return undefined;
}

// Defaults from every object destructuring of the props: `function X({ a = 1 }: XProps)` and
// `const { a = 1 } = props`, anywhere in the file (some components forward props to an inner one).
function collectDefaults(propsType: string, sf: ts.SourceFile): Map<string, string> {
  const defaults = new Map<string, string>();
  const take = (pattern: ts.ObjectBindingPattern) => {
    for (const el of pattern.elements) {
      const key = (el.propertyName ?? el.name).getText(sf);
      if (el.initializer && !defaults.has(key)) defaults.set(key, clean(el.initializer.getText(sf)));
    }
  };
  const visit = (n: ts.Node) => {
    if (ts.isParameter(n) && ts.isObjectBindingPattern(n.name) && n.type && ts.isTypeReferenceNode(n.type) && n.type.typeName.getText(sf) === propsType) take(n.name);
    if (ts.isVariableDeclaration(n) && ts.isObjectBindingPattern(n.name) && n.initializer && ts.isIdentifier(n.initializer) && /^props$/.test(n.initializer.text)) take(n.name);
    n.forEachChild(visit);
  };
  visit(sf);
  return defaults;
}

// `variant?: ButtonVariant` reads better as `"primary" | "secondary" | ...` when the alias is a local
// union of literals; anything else (objects, generics, imports) stays as written.
// Local names are expanded to what a reader can actually pass (`OrbitIcon[]` -> `{ src: string; alt?:
// string }[]`, `keyof typeof SIZES` -> `"sm" | "md"`), as long as the result stays short.
const MAX_TYPE = 140;

function objectKeys(name: string, sf: ts.SourceFile): string[] | undefined {
  let keys: string[] | undefined;
  sf.forEachChild((n) => {
    if (!ts.isVariableStatement(n)) return;
    for (const d of n.declarationList.declarations) {
      let init = d.initializer;
      while (init && (ts.isAsExpression(init) || ts.isSatisfiesExpression(init))) init = init.expression;
      if (ts.isIdentifier(d.name) && d.name.text === name && init && ts.isObjectLiteralExpression(init))
        keys = init.properties.flatMap((p) => (p.name ? [p.name.getText(sf).replace(/^["']|["']$/g, "")] : []));
    }
  });
  return keys;
}

function expand(node: ts.TypeNode, sf: ts.SourceFile, depth: number): string {
  const text = clean(node.getText(sf));
  if (depth > 2) return text;
  if (ts.isParenthesizedTypeNode(node)) return expand(node.type, sf, depth);
  if (ts.isArrayTypeNode(node)) {
    const inner = expand(node.elementType, sf, depth);
    return /[|&]/.test(inner) && !inner.startsWith("{") ? `(${inner})[]` : `${inner}[]`;
  }
  if (ts.isUnionTypeNode(node)) return node.types.map((t) => expand(t, sf, depth)).join(" | ");
  if (ts.isTypeOperatorNode(node) && node.operator === ts.SyntaxKind.KeyOfKeyword && ts.isTypeQueryNode(node.type)) {
    const keys = objectKeys(node.type.exprName.getText(sf), sf);
    return keys?.length ? keys.map((k) => `"${k}"`).join(" | ") : text;
  }
  if (!ts.isTypeReferenceNode(node) || node.typeArguments) return text;
  const decl = findTypeDecl(node.typeName.getText(sf), sf);
  if (!decl) return text;
  if (ts.isTypeAliasDeclaration(decl) && !ts.isTypeLiteralNode(decl.type)) return expand(decl.type, sf, depth + 1);
  const members = membersOf(decl);
  if (!members || (ts.isInterfaceDeclaration(decl) && decl.heritageClauses)) return text;
  const fields = members.filter(ts.isPropertySignature).map((m) => `${m.name.getText(sf)}${m.questionToken ? "?" : ""}: ${m.type ? clean(m.type.getText(sf)) : "unknown"}`);
  return `{ ${fields.join("; ")} }`;
}

function readableType(node: ts.TypeNode, sf: ts.SourceFile): string {
  const text = clean(node.getText(sf));
  const expanded = expand(node, sf, 0);
  return expanded.length <= MAX_TYPE ? expanded : text;
}

function rowsFor(members: ts.NodeArray<ts.TypeElement>, sf: ts.SourceFile, defaults: Map<string, string>, prefix = "", depth = 0): PropRow[] {
  const rows: PropRow[] = [];
  for (const m of members) {
    if (!ts.isPropertySignature(m) || !m.name) continue;
    const name = m.name.getText(sf).replace(/^["']|["']$/g, "");
    const type = m.type ? readableType(m.type, sf) : "unknown";
    const fallback = prefix ? undefined : defaults.get(name);
    rows.push({
      name: prefix + name,
      type,
      ...(fallback !== undefined ? { default: fallback.length > MAX_DEFAULT ? `${fallback.slice(0, MAX_DEFAULT - 1)}…` : fallback } : {}),
      required: !m.questionToken,
      ...(docOf(m, sf) ? { description: docOf(m, sf) } : {}),
    });
    // Expand one level of local object types (e.g. `content?: AlertContent` -> content.title, ...).
    if (depth === 0 && m.type && ts.isTypeReferenceNode(m.type) && !m.type.typeArguments) {
      const sub = findTypeDecl(m.type.typeName.getText(sf), sf);
      const subMembers = sub && membersOf(sub);
      if (subMembers?.length) {
        // Its fields get their own rows right below, so the parent row just says what it is.
        rows[rows.length - 1].type = "object";
        rows.push(...rowsFor(subMembers, sf, defaults, `${name}.`, 1));
      }
    }
  }
  return rows;
}

const manifest: Record<string, Entry> = {};
const problems: string[] = [];
for (const slug of slugs) {
  const file = path.join(root, "registry/new-york", slug, `${slug}.tsx`);
  if (!fs.existsSync(file)) continue;
  const sf = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const component = mainComponentName(slug, sf);
  const fn = component ? findFunction(component, sf) : undefined;
  const typeName = fn && propsTypeName(fn);
  const decl = typeName ? findTypeDecl(typeName, sf) : undefined;
  const members = decl && membersOf(decl);
  if (!component || !members) {
    problems.push(`${slug} (component=${component ?? "?"}, props=${typeName ?? "?"})`);
    continue;
  }
  const heritage = decl && ts.isInterfaceDeclaration(decl) ? decl.heritageClauses?.map((h) => h.getText(sf)).join(" ") : undefined;
  const element = heritage?.match(/ComponentProps(?:WithoutRef|WithRef)?<"(\w+)">/)?.[1];
  manifest[slug] = { component, ...(element ? { element } : {}), props: rowsFor(members, sf, collectDefaults(typeName!, sf)) };
}

// schema.org types each component emits (microdata itemType or JSON-LD @type), most search-relevant
// first, for the "schema" badge on catalog cards. Kept in its own small file so client cards don't pull
// in the props manifest.
const SCHEMA_PRIORITY = ["Review", "AggregateRating", "QAPage", "FAQPage", "HowTo", "Product", "Offer", "BlogPosting", "BreadcrumbList", "LocalBusiness", "Event", "SoftwareApplication", "WebApplication", "ImageGallery", "ImageObject", "Service", "Person", "Organization", "ItemList"];
const schema: Record<string, string[]> = {};
for (const slug of Object.keys(manifest)) {
  const src = fs.readFileSync(path.join(root, "registry/new-york", slug, `${slug}.tsx`), "utf8");
  const found = new Set([...src.matchAll(/schema\.org\/([A-Za-z]+)/g), ...src.matchAll(/"@type":\s*"([A-Za-z]+)"/g)].map((m) => m[1]));
  const types = SCHEMA_PRIORITY.filter((t) => found.has(t));
  if (types.length) schema[slug] = types;
}
fs.writeFileSync(path.join(root, "src/lib/schema-manifest.json"), JSON.stringify(schema, null, 1) + "\n");
console.log(`schema-manifest.json: ${Object.keys(schema).length} components with structured data`);

const out = path.join(root, "src/lib/props-manifest.json");
fs.writeFileSync(out, JSON.stringify(manifest) + "\n");
const rows = Object.values(manifest).reduce((n, e) => n + e.props.length, 0);
console.log(`props-manifest.json: ${Object.keys(manifest).length} components, ${rows} props, ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
if (problems.length) console.log(`skipped ${problems.length}:\n  ${problems.join("\n  ")}`);
