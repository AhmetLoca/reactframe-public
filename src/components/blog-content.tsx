import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function BlogContent({ content }: { content: string }) {
  return (
    <div className="mt-10 text-[17px] leading-relaxed text-foreground/80">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="mt-5 first:mt-0">{children}</p>,
          h2: ({ children }) => (
            <h2 className="mt-12 text-2xl font-semibold tracking-tight text-foreground first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => <h3 className="mt-8 text-lg font-semibold tracking-tight text-foreground">{children}</h3>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          ul: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="mt-5 list-decimal space-y-2 pl-5">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          table: ({ children }) => (
            <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full border-collapse text-left text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-foreground/[0.03]">{children}</thead>,
          th: ({ children }) => <th className="border-b border-border px-4 py-3 font-semibold text-foreground">{children}</th>,
          td: ({ children }) => {
            const text =
              typeof children === "string" ? children : Array.isArray(children) && typeof children[0] === "string" ? children.join("") : "";
            const isPositive = text.startsWith("✓ ");
            const isNegative = text.startsWith("✗ ");

            if (isPositive || isNegative) {
              return (
                <td className="border-b border-border px-4 py-3 align-top text-foreground/70">
                  <span className={isPositive ? "text-[#22c55e]" : "text-[#ef4444]"}>{isPositive ? "✓" : "✗"}</span> {text.slice(2)}
                </td>
              );
            }

            return <td className="border-b border-border px-4 py-3 align-top text-foreground/70">{children}</td>;
          },
          blockquote: ({ children }) => <blockquote className="mt-5 border-l-2 border-border pl-4 text-foreground/60">{children}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
