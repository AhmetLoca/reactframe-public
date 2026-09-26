import { notFound } from "next/navigation";

// HIDDEN-UNTIL-LAUNCH (templates): while true, every route under /templates (the page and its previews) renders the
// site's 404 page. Nothing in this folder is removed — set this to false (or delete this file) to
// publish the section again.
const HIDDEN_UNTIL_LAUNCH = true;

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  if (HIDDEN_UNTIL_LAUNCH) notFound();
  return children;
}
