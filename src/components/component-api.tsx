import { InstallCommand } from "@/components/install-command";
import propsManifest from "@/lib/props-manifest.json";
import { cn } from "@/lib/utils";
import { getComponentGuide } from "@/lib/component-guides";

type PropRow = { name: string; type: string; default?: string; required: boolean; description?: string };
type PropsEntry = { component: string; element?: string; props: PropRow[] };

const manifest = propsManifest as Record<string, PropsEntry>;
const VISIBLE_ROWS = 12;

export function getPropsEntry(slug: string): PropsEntry | undefined {
  return manifest[slug];
}

function Row({ row }: { row: PropRow }) {
  const nested = row.name.includes(".");
  return (
    <tr className="border-t border-border align-top">
      <td className={cn("py-3 pr-4 font-mono text-[13px] whitespace-nowrap text-foreground", nested && "pl-4 text-foreground/70")}>
        {row.name}
        {row.required && <span className="ml-1 text-[#F2A841]">*</span>}
        {row.description && <p className="mt-1 max-w-[260px] font-sans text-xs whitespace-normal text-foreground/50">{row.description}</p>}
      </td>
      <td className="py-3 pr-4 font-mono text-[12.5px] break-words text-[#8FB8FF]">{row.type}</td>
      <td className="py-3 font-mono text-[12.5px] break-words text-foreground/60">{row.default ?? "—"}</td>
    </tr>
  );
}

// Small screens get a stacked list instead of a three-column table that would have to scroll sideways.
function PropsList({ rows }: { rows: PropRow[] }) {
  return (
    <ul className="sm:hidden">
      {rows.map((row) => (
        <li key={row.name} className="border-t border-border py-3 first:border-t-0">
          <div className={cn("font-mono text-[13px] text-foreground", row.name.includes(".") && "text-foreground/70")}>
            {row.name}
            {row.required && <span className="ml-1 text-[#F2A841]">*</span>}
          </div>
          {row.description && <p className="mt-1 text-xs text-foreground/50">{row.description}</p>}
          <div className="mt-1.5 font-mono text-[12px] break-words text-[#8FB8FF]">{row.type}</div>
          {row.default !== undefined && <div className="mt-1 font-mono text-[12px] break-words text-foreground/50">Default: {row.default}</div>}
        </li>
      ))}
    </ul>
  );
}

function PropsTable({ rows, head = true }: { rows: PropRow[]; head?: boolean }) {
  return (
    <div className="hidden overflow-x-auto sm:block">
      <table className="w-full min-w-[560px] table-fixed border-collapse text-left">
        <colgroup>
          <col className="w-[34%]" />
          <col className="w-[38%]" />
          <col className="w-[28%]" />
        </colgroup>
        {head && (
          <thead>
            <tr className="text-xs font-medium tracking-wide text-foreground/40 uppercase">
              <th className="pb-2 font-medium">Prop</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Default</th>
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Installation + props reference under the live preview. Everything here is server-rendered text, so
// search engines and AI answer engines see the actual API, not just the interactive demo.
export function ComponentApi({
  slug,
  name,
  unlocked,
  checkout,
  dependencies,
}: {
  slug: string;
  name: string;
  unlocked: boolean;
  checkout?: { url: string; price?: string };
  dependencies: string[];
}) {
  const entry = manifest[slug];
  const top = entry?.props.slice(0, VISIBLE_ROWS) ?? [];
  const rest = entry?.props.slice(VISIBLE_ROWS) ?? [];
  const hasRequired = entry?.props.some((p) => p.required);
  const guide = getComponentGuide(slug);

  return (
    <div className="mt-16 flex flex-col gap-14">
      {guide && (
        <section>
          <h2 className="text-lg font-semibold tracking-tight">When to use the {name} component</h2>
          <div className="mt-3 flex max-w-3xl flex-col gap-3 text-[15px] leading-relaxed text-foreground/70">
            {guide.whenToUse.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Installation</h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/60">
          Add the {name} component to your project with the shadcn CLI. It lands in <code className="font-mono text-foreground/80">components/{slug}.tsx</code> as plain React +
          Tailwind CSS source you own and can edit.
        </p>
        <div className="mt-4">
          <InstallCommand slug={slug} free={unlocked} checkout={checkout} />
        </div>
        {dependencies.length > 0 && (
          <>
            <p className="mt-6 text-sm text-foreground/60">
              {unlocked ? "Or copy the source by hand and install its dependencies:" : "Its npm dependencies, for when you add the source by hand:"}
            </p>
            <div className="mt-3">
              <InstallCommand slug={slug} free packages={dependencies} />
            </div>
          </>
        )}
      </section>

      {entry && entry.props.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold tracking-tight">Props</h2>
          <p className="mt-2 max-w-2xl text-sm text-foreground/60">
            <code className="font-mono text-foreground/80">&lt;{entry.component} /&gt;</code> accepts {entry.props.filter((p) => !p.name.includes(".")).length} props
            {hasRequired ? <> (required ones are marked <span className="text-[#F2A841]">*</span>)</> : ", all optional"}.
            {entry.element && (
              <>
                {" "}
                It also accepts the usual <code className="font-mono text-foreground/80">&lt;{entry.element}&gt;</code> attributes, like{" "}
                <code className="font-mono text-foreground/80">className</code>, <code className="font-mono text-foreground/80">style</code>,{" "}
                <code className="font-mono text-foreground/80">id</code> and <code className="font-mono text-foreground/80">aria-*</code>, and passes them to its root element.
              </>
            )}
          </p>
          <div className="mt-4 rounded-xl border border-border bg-card px-5 pt-4 pb-2">
            <PropsTable rows={top} />
            <PropsList rows={top} />
            {rest.length > 0 && (
              <details className="group">
                <summary className="cursor-pointer list-none border-t border-border py-3 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
                  <span className="group-open:hidden">Show all {entry.props.length} props</span>
                  <span className="hidden group-open:inline">Show fewer</span>
                </summary>
                <PropsTable rows={rest} head={false} />
                <PropsList rows={rest} />
              </details>
            )}
          </div>
        </section>
      )}

      {guide && guide.faq.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold tracking-tight">FAQ</h2>
          <dl className="mt-4 max-w-3xl divide-y divide-border rounded-xl border border-border bg-card px-5">
            {guide.faq.map(({ q, a }) => (
              <div key={q} className="py-4">
                <dt className="text-[15px] font-medium text-foreground">{q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-foreground/65">{a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}
