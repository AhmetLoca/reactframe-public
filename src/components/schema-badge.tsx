import { SearchCheck } from "lucide-react";
import schemaManifest from "@/lib/schema-manifest.json";
import { cn } from "@/lib/utils";

const schema = schemaManifest as Record<string, string[]>;

// What the markup earns in search, in plain words. Keyed by the component's most search-relevant
// schema.org type; the raw type names stay in the tooltip for readers who know them.
const BENEFITS: Record<string, string> = {
  Review: "Star ratings in Google",
  AggregateRating: "Star ratings in Google",
  QAPage: "Q&A rich results",
  FAQPage: "FAQ rich results",
  HowTo: "Step-by-step rich results",
  LocalBusiness: "Business info in Google",
  SoftwareApplication: "App details in Google",
  WebApplication: "App details in Google",
  Product: "Product rich results",
  Offer: "Price info in Google",
  BlogPosting: "Article rich results",
  BreadcrumbList: "Breadcrumbs in Google",
  ItemList: "List rich results",
  ImageGallery: "Better image search",
  ImageObject: "Better image search",
  Person: "Profile info for search",
  Service: "Service info for search",
};

export function getSchemaTypes(slug: string): string[] | undefined {
  return schema[slug];
}

// Marks components that ship schema.org structured data (microdata or JSON-LD). Cards show a short
// "SEO-ready"; the detail page (`detailed`) also says what that gets you in search.
export function SchemaBadge({ slug, detailed = false, className }: { slug: string; detailed?: boolean; className?: string }) {
  const types = schema[slug];
  if (!types) return null;
  const benefit = BENEFITS[types[0]] ?? "Rich results in search";
  return (
    <span
      title={`${benefit}. Ships schema.org structured data (${types.join(", ")}) so search engines can show rich results.`}
      className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide", className)}
    >
      <SearchCheck className="h-3 w-3" aria-hidden />
      SEO-ready
      {detailed && <span className="font-medium opacity-75">· {benefit}</span>}
    </span>
  );
}
